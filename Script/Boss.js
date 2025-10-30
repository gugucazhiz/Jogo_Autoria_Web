class Boss1 {
    constructor(ctx, positionx, positiony) {
        this.position = {
            x: positionx,
            y: positiony
        }
        this.size = {
            w: 170.66,
            h: 256
        }
        this.velocity = {
            x: 1.5,
            y: 1.0
        }
        this.gravidade = 0.8;
        this.ctx = ctx;
        this.atingido = true;
        //tesouras
        this.tesouras = [];
        this.cooldownAtaque = 0;
        this.tempoEntreAtaques = 5000;

        // controle de Frames
        this.estado = 0;
        this.direcao = 0;      // direção atual
        this.maximoframes = 6; // 6 frames por linha
        this.frameContador = 0;
        this.frameDelay = 10;
        this.acao = "movendo";
        this.acao_anterior = 0;

        // sprite
        this.altura = 200;  // altura de cada quadro (mantida)
        this.largura = 162; // largura aproximada de cada quadro (mantida)
        this.sprite = new Image();
        this.sprite.src = "./Sprites/Bosses/BossGustavoPraia/sprites/semFundo/boss.png";

        // vida e estado
        this.life = -2; // conta acertos //como ele verifica se tem mais que 2 acertos
        //colocar (-2) vai fazer com que ele conte(-2, -1, 0, 1, 2, 3)(totalizando 5 acertos)
        this.vivo = true;
        this.morrendo = false;
        this.podeDarDano = true;
        this.ultimoDano = 0;
        this.cooldownDano = 2000; // 2 segundos em milissegundos

        // movimento aleatório
        this.velocidadeAleatoria = {
            x: (Math.random() > 0.5 ? 1 : -1),
            y: (Math.random() > 0.5 ? 1 : -1)
        }
        this.speed = 1.5; // velocidade base suave 1.5

        // timer para mudar direção aleatória
        this.tempoMudancaDirecao = 0;
        this.intervaloMudanca = 90; // frames até mudar direção
    }

    draw() {
        let linha;
        switch (this.acao) {
            case "movendo":
                linha = 0;
                break;
            case "parado":
                linha = 1;
                break;
            case "morrendo":
                linha = 2;
                break;
            default:
                linha = 0;
        }

        // desenha o sprite
        // ajusta para não sobrepor frames
        const sx = Math.floor(this.estado) * this.largura; // coordenada X da sprite sheet
        const sy = linha * this.altura; // coordenada Y da sprite sheet
        const sw = this.largura; // largura do frame
        const sh = this.altura; // altura do frame

        this.ctx.drawImage(
            this.sprite,
            sx,
            this.direcao,
            sw,
            sh,
            this.position.x,
            this.position.y,
            this.size.w,
            this.size.h // tamanho na tela
        );

        // barra de vida removida
        // this.desenhaVida();
    }

    update(Playery, Playerx, player, inimigos) {

        if (!this.vivo) return;

        // movimento aleatório em duas direções sem impulsos (apenas alterna direções)
        this.tempoMudancaDirecao++;
        if (this.tempoMudancaDirecao >= this.intervaloMudanca) {
            // alterna sinais ocasionalmente para evitar "impulso"
            if (Math.random() > 0.5) this.velocidadeAleatoria.x *= -1;
            if (Math.random() > 0.5) this.velocidadeAleatoria.y *= -1;
            this.tempoMudancaDirecao = 0;
            this.intervaloMudanca = 60 + Math.floor(Math.random() * 120);
        }

        // aplica velocidade suave
        this.position.x += this.speed * this.velocidadeAleatoria.x;
        this.position.y += this.speed * this.velocidadeAleatoria.y;

        // limites horizontais
        if (this.position.x <= 0) {
            this.position.x = 0;
            this.velocidadeAleatoria.x *= -1;
        }
        if (this.position.x + this.size.w >= canvas.width) {
            this.position.x = canvas.width - this.size.w;
            this.velocidadeAleatoria.x *= -1;
        }

        // limites verticais (evita sair da tela)
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocidadeAleatoria.y *= -1;
        }
        if (this.position.y + this.size.h >= canvas.height - 100) {
            this.position.y = canvas.height - this.size.h - 100;
            this.velocidadeAleatoria.y *= -1;
        }

        // definir direção para animação
        /*
        if (this.speed * this.velocidadeAleatoria.x > 0) {
            this.acao_anterior = 1; // direita
        } else if (this.speed * this.velocidadeAleatoria.x < 0) {
            this.acao_anterior = 0; // esquerda
        }
        */

        if (Playerx > this.position.x) {
            this.acao_anterior = 190;
        }
        else {
            this.acao_anterior = 0;
        }
        // atualiza frames de animação
        this.animateFrames();

        this.verificaHitboxPlayer(Playerx, Playery, player);
        // Verifica colisão do boss com o player

        /////// TESOURAS
        if (Date.now() > this.cooldownAtaque) {
        this.atirar(player);
        this.cooldownAtaque = Date.now() + this.tempoEntreAtaques;
        }

        this.tesouras.forEach((t, i) => {
            t.update();

            // Verifica colisão com player
            if (t.colideCom(player)) {
                player.helthAtual(1); // dano no player
                t.viva = false;
            }

            // Remove se estiver morta ou fora da tela
            if (!t.viva) {
                this.tesouras.splice(i, 1);
            }
         });
        this.draw();
    }

    animateFrames() {
        this.frameContador++;
        this.direcao = this.acao_anterior
        if (this.frameContador >= this.frameDelay) {
            this.estado++;
            if (this.estado >= this.maximoframes) {
                this.estado = 0;
            }
            this.frameContador = 0;
        }
    }

    verificaColisao(bala) {
        return (
            bala.position.x < this.position.x + (this.largura - 70) &&
            bala.position.x + bala.size.width > this.position.x &&
            bala.position.y < this.position.y + (this.altura - 20) &&
            bala.position.y + bala.size.height > this.position.y
        );
    }

    recebeDanoDoBoss() {
        if (!this.morrendo) {
            this.life += 1; // conta 1 por bala
            if (this.life >= 5) { // morre com 5 balas
                this.morreu();
            }
        }
    }

    morreu() {
        this.morrendo = true;
        this.vivo = false;
        this.speed = 0;
        console.log("Boss morreu!");
    }

    verificaHitboxPlayer(Playerx, Playery, player) {


        this.atingido = false;
        console.log("Chamou o metodo")
        let hitboxX = 100;
        let hitboxY = 100;
        const dentroX = Math.abs(this.position.x - Playerx) < hitboxX / 2;
        const dentroY = Math.abs(this.position.y - Playery) < hitboxY;

        const tempoAgora = Date.now();
        if (tempoAgora - this.ultimoDano < this.cooldownDano) {
            return; // Ainda está em cooldown
        }

        if (dentroX && dentroY && this.podeDarDano) {
            player.helthAtual(1);
            // tirar vida do player
            console.log("Player atingido pelo Boss!");

            this.ultimoDano = tempoAgora;
            this.podeDarDano = false;

            // Reseta o podeDarDano após o cooldown
            setTimeout(() => {
                this.podeDarDano = true;
            }, this.cooldownDano);
        }
    }

    isAtingido() {
        this.atingido = true;
    }

    atirar(player) {
    const novaTesoura = new Tesoura(
        this.position.x + this.size.w / 2, 
        this.position.y + this.size.h / 2,
        player.position.x + player.largura / 2, // centro do player
        player.position.y + player.altura / 2,
        this.ctx
    );
    this.tesouras.push(novaTesoura);
}

}
class Tesoura {
    constructor(x, y, alvoX, alvoY, ctx) {
        this.ctx = ctx;
        this.position = { x, y };
        this.size = { width: 80, height: 20 };
        this.spriteTesoura = new Image();
        this.spriteTesoura.src = "./Sprites/Bosses/BossGustavoPraia/sprites/semFundo/tesoura.png";

        // Controle de frames (mantido)
        this.altura = 82;
        this.largura = 80;
        this.estado = 1;
        this.frameContador = 0;
        this.frameDelay = 10;
        this.acao = "parado";
        this.acao_anterior = 0;

        this.speed = 3;
        this.viva = true;

        // Calcula direção até o player
        const dx = alvoX - x;
        const dy = alvoY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.velocity = {
            x: (dx / dist) * this.speed,
            y: (dy / dist) * this.speed,
        };
        this.hitbox = {
            offsetX: 10,   // deslocamento lateral
            offsetY: 20,   // deslocamento vertical
            width: 60,     // largura da hitbox
            height: 40     // altura da hitbox
        };

        this.debug = false;
    }

    draw() {
        this.ctx.drawImage(
            this.spriteTesoura,
            1 * this.largura,
            0.2 * this.altura,
            this.largura - 15,
            this.altura - 10,
            this.position.x,
            this.position.y - 50,
            this.largura,
            this.altura
        );
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Remove se sair da tela
        if (
            this.position.x < -90 ||
            this.position.x > canvas.width + 80 ||
            this.position.y < -90 ||
            this.position.y > canvas.height + 80
        ) {
            this.viva = false;
        }

        this.draw();
    }
    getHitbox() {
        return {
            x: this.position.x + this.hitbox.offsetX,
            y: this.position.y + this.hitbox.offsetY,
            w: this.hitbox.width,
            h: this.hitbox.height
        };
    }
    colideCom(player) {
            const hb = this.getHitbox();

            const playerBox = {
                x: player.position.x,
                y: player.position.y,
                w: player.largura,
                h: player.altura
            };

            const playerBoxReducida = {
                x: player.position.x + 10,
                y: player.position.y + 10,
                w: player.largura - 160,
                h: player.altura - 130 
            };

            if (this.debug) {
                //colisao player
                this.ctx.strokeStyle = "red";
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(hb.x, hb.y, hb.w, hb.h);

                //tamanho normal player
                this.ctx.strokeStyle = "blue";
                this.ctx.strokeRect(playerBox.x, playerBox.y, playerBox.w, playerBox.h);

                //colisão real
                this.ctx.strokeStyle = "lime";
                this.ctx.strokeRect(playerBoxReducida.x, playerBoxReducida.y, playerBoxReducida.w, playerBoxReducida.h);
            }

            return (
                hb.x + 10 < playerBoxReducida.x + playerBoxReducida.w &&
                hb.x + hb.w - 10 > playerBoxReducida.x &&
                hb.y + 10 < playerBoxReducida.y + playerBoxReducida.h &&
                hb.y + hb.h - 10 > playerBoxReducida.y
            );
}

}

//----------------------------------------- BOOS 2 ---------------------------------------

class Boss2 {
    constructor(ctx, positionx, positiony) {
        this.position = {
            x: positionx,
            y: positiony
        }
        this.size = {
            w: 170.66,
            h: 256
        }
        this.velocity = {
            x: 1.5,
            y: 1.0
        }
        // this.gravidade = 0.8;
        this.ctx = ctx;
        this.atingido = true;

        // controle de Frames
        this.estado = 0;
        this.direcao = 0;      // direção atual
        this.maximoframes = 6; // normal 6 frames por linha
        this.frameContador = 0;
        this.frameDelay = 10; // normal é 10
        this.acao = "movendo";
        this.acao_anterior = 0;

        // sprite
        this.altura = 200;  // altura de cada quadro
        this.largura = 200; // largura aproximada de cada quadro
        this.sprite = new Image();
        this.sprite.src = "Sprites/Bosses/BossDavi/sprites/semFundo/boss.png";

        // vida e estado
        this.life = -2; // conta acertos //como ele verifica se tem mais que 2 acertos
        //colocar (-2) vai fazer com que ele conte(-2, -1, 0, 1, 2, 3)(totalizando 5 acertos)
        this.vivo = true;
        this.morrendo = false;
        this.podeDarDano = true;
        this.ultimoDano = 0;
        this.cooldownDano = 2000; // 2 segundos em milissegundos

        // movimento aleatório
        this.velocidadeAleatoria = {
            x: (Math.random() > 0.5 ? 1 : -1),
            y: (Math.random() > 0.5 ? 1 : -1)
        }
        this.speed = 1.5; // velocidade base suave 1.5

        // timer para mudar direção aleatória
        this.tempoMudancaDirecao = 0;
        this.intervaloMudanca = 90; // frames até mudar direção
    }

    draw() {
        let linha;
        switch (this.acao) {
            case "movendo":
                linha = 0;
                break;
            case "parado":
                linha = 1;
                break;
            case "morrendo":
                linha = 2;
                break;
            default:
                linha = 0;
        }

        // desenha o sprite
        // ajusta para não sobrepor frames
        const sx = Math.floor(this.estado) * this.largura; // coordenada X da sprite sheet
        const sy = linha * this.altura; // coordenada Y da sprite sheet
        const sw = this.largura; // largura do frame
        const sh = this.altura; // altura do frame

        this.ctx.drawImage(
            this.sprite,
            sx,
            this.direcao,
            sw,
            sh,
            this.position.x,
            this.position.y,
            this.size.w,
            this.size.h // tamanho na tela
        );

        // barra de vida removida
        // this.desenhaVida();
    }

    update(Playery, Playerx, player, inimigos) {

        if (!this.vivo) return;

        // movimento aleatório em duas direções sem impulsos (apenas alterna direções)
        this.tempoMudancaDirecao++;
        if (this.tempoMudancaDirecao >= this.intervaloMudanca) {
            // alterna sinais ocasionalmente para evitar "impulso"
            if (Math.random() > 0.5) this.velocidadeAleatoria.x *= -1;
            if (Math.random() > 0.5) this.velocidadeAleatoria.y *= -1;
            this.tempoMudancaDirecao = 0;
            this.intervaloMudanca = 60 + Math.floor(Math.random() * 120);
        }

        // aplica velocidade suave
        this.position.x += this.speed * this.velocidadeAleatoria.x;
        this.position.y += canvas.height - this.size.h - 200; // mesmo chão do limite

        // limites horizontais
        if (this.position.x <= 0) {
            this.position.x = 0;
            this.velocidadeAleatoria.x *= -1;
        }
        if (this.position.x + this.size.w >= canvas.width) {
            this.position.x = canvas.width - this.size.w;
            this.velocidadeAleatoria.x *= -1;
        }

        // limites verticais (evita sair da tela)
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocidadeAleatoria.y *= -1;
        }
        if (this.position.y + this.size.h >= canvas.height - 20) {
            this.position.y = canvas.height - this.size.h - 20;
            this.velocidadeAleatoria.y *= -1;
        }

        // definir direção para animação
        /*
        if (this.speed * this.velocidadeAleatoria.x > 0) {
            this.acao_anterior = 1; // direita
        } else if (this.speed * this.velocidadeAleatoria.x < 0) {
            this.acao_anterior = 0; // esquerda
        }
        */

        if (Playerx > this.position.x) {
            this.acao_anterior = 190;
        }
        else {
            this.acao_anterior = 0;
        }
        // atualiza frames de animação
        this.animateFrames();

        this.verificaHitboxPlayer(Playerx, Playery, player);
        // Verifica colisão do boss com o player

        this.draw();
    }

    animateFrames() {
        this.frameContador++;
        this.direcao = this.acao_anterior
        if (this.frameContador >= this.frameDelay) {
            this.estado++;
            if (this.estado >= this.maximoframes) {
                this.estado = 0;
            }
            this.frameContador = 0;
        }
    }

    verificaColisao(bala) {
        return (
            bala.position.x < this.position.x + (this.largura - 20) &&
            bala.position.x + bala.size.width > this.position.x &&
            bala.position.y < this.position.y + (this.altura+28) &&
            bala.position.y + bala.size.height > this.position.y
        );
    }

    recebeDanoDoBoss() {
        if (!this.morrendo) {
            this.life += 1; // conta 1 por bala
            if (this.life >= 5) { // morre com 5 balas
                this.morreu();
            }
        }
    }

    morreu() {
        this.morrendo = true;
        this.vivo = false;
        this.speed = 0;
        console.log("Boss morreu!");
    }

    verificaHitboxPlayer(Playerx, Playery, player) {


        this.atingido = false;
        console.log("Chamou o metodo")
        let hitboxX = 100;
        let hitboxY = 100;
        const dentroX = Math.abs(this.position.x - Playerx) < hitboxX / 2;
        const dentroY = Math.abs(this.position.y - Playery) < hitboxY;

        const tempoAgora = Date.now();
        if (tempoAgora - this.ultimoDano < this.cooldownDano) {
            return; // Ainda está em cooldown
        }

        if (dentroX && dentroY && this.podeDarDano) {
            player.helthAtual(1);
            // tirar vida do player
            console.log("Player atingido pelo Boss!");

            this.ultimoDano = tempoAgora;
            this.podeDarDano = false;

            // Reseta o podeDarDano após o cooldown
            setTimeout(() => {
                this.podeDarDano = true;
            }, this.cooldownDano);
        }
    }

    isAtingido() {
        this.atingido = true;
    }
}


class Boss3 {

    constructor(ctx, positionx, positiony) {
        this.position = {
            x: positionx,
            y: positiony
        }
        this.size = {
            w: 170.66,
            h: 256
        }
        this.velocity = {
            x: 1.5,
            y: 1.0
        }
        this.gravidade = 0.8;
        this.ctx = ctx;
        this.atingido = true;

        // controle de Frames
        this.estado = 0;
        this.direcao = 0;      // direção atual
        this.maximoframes = 6; // 6 frames por linha
        this.frameContador = 0;
        this.frameDelay = 10;
        this.acao = "movendo";
        this.acao_anterior = 0;

        // sprite
        this.altura = 130;  // altura de cada quadro (mantida)
        this.largura = 142; // largura aproximada de cada quadro (mantida)
        this.sprite = new Image();
        this.sprite.src = "./Sprites/Bosses/BossNayan/sprites/semFundo/boss.png";

        // vida e estado
        this.life = -12; // conta acertos //como ele verifica se tem mais que 2 acertos
        //colocar (-2) vai fazer com que ele conte(-2, -1, 0, 1, 2, 3)(totalizando 5 acertos)
        this.vivo = true;
        this.morrendo = false;
        this.podeDarDano = true;
        this.ultimoDano = 0;
        this.cooldownDano = 2000; // 2 segundos em milissegundos

        // movimento aleatório
        this.velocidadeAleatoria = {
            x: (Math.random() > 0.5 ? 1 : -1),
            y: (Math.random() > 0.5 ? 1 : -1)
        }
        this.speed = 2.0; // velocidade base suave 1.5

        // timer para mudar direção aleatória
        this.tempoMudancaDirecao = 0;
        this.intervaloMudanca = 150; // frames até mudar direção
    }

    draw() {
        let linha;
        switch (this.acao) {
            case "movendo":
                linha = 0;
                break;
            case "parado":
                linha = 1;
                break;
            case "morrendo":
                linha = 2;
                break;
            default:
                linha = 0;
        }

        // desenha o sprite
        // ajusta para não sobrepor frames
        const sx = Math.floor(this.estado) * this.largura; // coordenada X da sprite sheet
        const sy = linha * this.altura; // coordenada Y da sprite sheet
        const sw = this.largura; // largura do frame
        const sh = this.altura; // altura do frame

        this.ctx.drawImage(
            this.sprite,
            sx,
            this.direcao,
            sw,
            sh,
            this.position.x,
            this.position.y,
            this.size.w,
            this.size.h // tamanho na tela
        );

        // barra de vida removida
        // this.desenhaVida();
    }

    update(Playery, Playerx, player, inimigos) {

        if (!this.vivo) return;

        // movimento aleatório em duas direções sem impulsos (apenas alterna direções)
        this.tempoMudancaDirecao++;
        if (this.tempoMudancaDirecao >= this.intervaloMudanca) {
            // alterna sinais ocasionalmente para evitar "impulso"
            if (Math.random() > 0.5) this.velocidadeAleatoria.x *= -1;
            if (Math.random() > 0.5) this.velocidadeAleatoria.y *= -1;
            this.tempoMudancaDirecao = 0;
            this.intervaloMudanca = 60 + Math.floor(Math.random() * 120);
        }

        // aplica velocidade suave
        this.position.x += this.speed * this.velocidadeAleatoria.x;
        this.position.y += this.speed * this.velocidadeAleatoria.y;

        // limites horizontais
        if (this.position.x <= 0) {
            this.position.x = 0;
            this.velocidadeAleatoria.x *= -1;
        }
        if (this.position.x + this.size.w >= canvas.width) {
            this.position.x = canvas.width - this.size.w;
            this.velocidadeAleatoria.x *= -1;
        }

        // limites verticais (evita sair da tela)
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocidadeAleatoria.y *= -1;
        }
        if (this.position.y + this.size.h >= canvas.height - 100) {
            this.position.y = canvas.height - this.size.h - 100;
            this.velocidadeAleatoria.y *= -1;
        }

        // definir direção para animação
        /*
        if (this.speed * this.velocidadeAleatoria.x > 0) {
            this.acao_anterior = 1; // direita
        } else if (this.speed * this.velocidadeAleatoria.x < 0) {
            this.acao_anterior = 0; // esquerda
        }
        */

        if (Playerx > this.position.x) {
            this.acao_anterior = 190;
        }
        else {
            this.acao_anterior = 0;
        }
        // atualiza frames de animação
        this.animateFrames();

        this.verificaHitboxPlayer(Playerx, Playery, player);
        // Verifica colisão do boss com o player

        this.draw();
    }

    animateFrames() {
        this.frameContador++;
        this.direcao = this.acao_anterior
        if (this.frameContador >= this.frameDelay) {
            this.estado++;
            if (this.estado >= this.maximoframes) {
                this.estado = 0;
            }
            this.frameContador = 0;
        }
    }

    verificaColisao(bala) {
        return (
            bala.position.x < this.position.x + (this.largura - 70) &&
            bala.position.x + bala.size.width > this.position.x &&
            bala.position.y < this.position.y + (this.altura - 20) &&
            bala.position.y + bala.size.height > this.position.y
        );
    }

    recebeDanoDoBoss() {
        if (!this.morrendo) {
            this.life += 1; // conta 1 por bala
            if (this.life >= 5) { // morre com 5 balas
                this.morreu();
            }
        }
    }

    morreu() {
        this.morrendo = true;
        this.vivo = false;
        this.speed = 0;
        console.log("Boss morreu!");
    }

    verificaHitboxPlayer(Playerx, Playery, player) {


        this.atingido = false;
        console.log("Chamou o metodo")
        let hitboxX = 150;
        let hitboxY = 150;
        const dentroX = Math.abs(this.position.x - Playerx) < hitboxX / 2;
        const dentroY = Math.abs(this.position.y - Playery) < hitboxY;

        const tempoAgora = Date.now();
        if (tempoAgora - this.ultimoDano < this.cooldownDano) {
            return; // Ainda está em cooldown
        }

        if (dentroX && dentroY && this.podeDarDano) {
            player.helthAtual(1);
            // tirar vida do player
            console.log("Player atingido pelo Boss!");

            this.ultimoDano = tempoAgora;
            this.podeDarDano = false;

            // Reseta o podeDarDano após o cooldown
            setTimeout(() => {
                this.podeDarDano = true;
            }, this.cooldownDano);
        }
    }

    isAtingido() {
        this.atingido = true;
    }
    
}
class Boss4 {

    constructor(ctx, positionx, positiony) {
        this.position = {
            x: positionx,
            y: positiony
        }
        this.size = {
            w: 170.66,
            h: 256
        }
        this.velocity = {
            x: 1.5,
            y: 1.0
        }
        this.gravidade = 0.8;
        this.ctx = ctx;
        this.atingido = true;

        // controle de Frames
        this.estado = 0;
        this.direcao = 0;      // direção atual
        this.maximoframes = 4; // 6 frames por linha
        this.frameContador = 0;
        this.frameDelay = 100;
        this.acao = "movendo";
        this.acao_anterior = 0;

        // sprite
        this.altura = 165;  // altura de cada quadro (mantida)
        this.largura = 183; // largura aproximada de cada quadro (mantida)
        this.sprite = new Image();
        this.sprite.src = "./Sprites/Bosses/BossAlan/sprites/sem fundo/boss.png";

        // vida e estado
        this.life = -12; // conta acertos //como ele verifica se tem mais que 2 acertos
        //colocar (-2) vai fazer com que ele conte(-2, -1, 0, 1, 2, 3)(totalizando 5 acertos)
        this.vivo = true;
        this.morrendo = false;
        this.podeDarDano = true;
        this.ultimoDano = 0;
        this.cooldownDano = 2000; // 2 segundos em milissegundos

        // movimento aleatório
        this.velocidadeAleatoria = {
            x: (Math.random() > 0.5 ? 1 : -1),
            y: (Math.random() > 0.5 ? 1 : -1)
        }
        this.speed = 2.0; // velocidade base suave 1.5

        // timer para mudar direção aleatória
        this.tempoMudancaDirecao = 0;
        this.intervaloMudanca = 150; // frames até mudar direção
    }

    draw() {
        let linha;
        switch (this.acao) {
            case "movendo":
                linha = 0;
                break;
            case "parado":
                linha = 1;
                break;
            case "morrendo":
                linha = 2;
                break;
            default:
                linha = 0;
        }

        // desenha o sprite
        // ajusta para não sobrepor frames
        const sx = Math.floor(this.estado) * this.largura; // coordenada X da sprite sheet
        const sy = linha * this.altura; // coordenada Y da sprite sheet
        const sw = this.largura; // largura do frame
        const sh = this.altura; // altura do frame

        this.ctx.drawImage(
            this.sprite,
            sx,
            this.direcao,
            sw,
            sh,
            this.position.x,
            this.position.y,
            this.size.w,
            this.size.h // tamanho na tela
        );

        // barra de vida removida
        // this.desenhaVida();
    }

    update(Playery, Playerx, player, inimigos) {

        if (!this.vivo) return;

        // movimento aleatório em duas direções sem impulsos (apenas alterna direções)
        this.tempoMudancaDirecao++;
        if (this.tempoMudancaDirecao >= this.intervaloMudanca) {
            // alterna sinais ocasionalmente para evitar "impulso"
            if (Math.random() > 0.5) this.velocidadeAleatoria.x *= -1;
            if (Math.random() > 0.5) this.velocidadeAleatoria.y *= -1;
            this.tempoMudancaDirecao = 0;
            this.intervaloMudanca = 60 + Math.floor(Math.random() * 120);
        }

        // aplica velocidade suave
        this.position.x += this.speed * this.velocidadeAleatoria.x;
        this.position.y += this.speed * this.velocidadeAleatoria.y;

        // limites horizontais
        if (this.position.x <= 0) {
            this.position.x = 0;
            this.velocidadeAleatoria.x *= -1;
        }
        if (this.position.x + this.size.w >= canvas.width) {
            this.position.x = canvas.width - this.size.w;
            this.velocidadeAleatoria.x *= -1;
        }

        // limites verticais (evita sair da tela)
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocidadeAleatoria.y *= -1;
        }
        if (this.position.y + this.size.h >= canvas.height - 100) {
            this.position.y = canvas.height - this.size.h - 100;
            this.velocidadeAleatoria.y *= -1;
        }

        // definir direção para animação
        /*
        if (this.speed * this.velocidadeAleatoria.x > 0) {
            this.acao_anterior = 1; // direita
        } else if (this.speed * this.velocidadeAleatoria.x < 0) {
            this.acao_anterior = 0; // esquerda
        }
        */

        if (Playerx > this.position.x) {
            this.acao_anterior = 190;
        }
        else {
            this.acao_anterior = 0;
        }
        // atualiza frames de animação
        this.animateFrames();

        this.verificaHitboxPlayer(Playerx, Playery, player);
        // Verifica colisão do boss com o player

        this.draw();
    }

    animateFrames() {
        this.frameContador++;
        this.direcao = this.acao_anterior
        if (this.frameContador >= this.frameDelay) {
            this.estado++;
            if (this.estado >= this.maximoframes) {
                this.estado = 0;
            }
            this.frameContador = 0;
        }
    }

    verificaColisao(bala) {
        return (
            bala.position.x < this.position.x + (this.largura - 70) &&
            bala.position.x + bala.size.width > this.position.x &&
            bala.position.y < this.position.y + (this.altura - 20) &&
            bala.position.y + bala.size.height > this.position.y
        );
    }

    recebeDanoDoBoss() {
        if (!this.morrendo) {
            this.life += 1; // conta 1 por bala
            if (this.life >= 5) { // morre com 5 balas
                this.morreu();
            }
        }
    }

    morreu() {
        this.morrendo = true;
        this.vivo = false;
        this.speed = 0;
        console.log("Boss morreu!");
    }

    verificaHitboxPlayer(Playerx, Playery, player) {


        this.atingido = false;
        console.log("Chamou o metodo")
        let hitboxX = 150;
        let hitboxY = 150;
        const dentroX = Math.abs(this.position.x - Playerx) < hitboxX / 2;
        const dentroY = Math.abs(this.position.y - Playery) < hitboxY;

        const tempoAgora = Date.now();
        if (tempoAgora - this.ultimoDano < this.cooldownDano) {
            return; // Ainda está em cooldown
        }

        if (dentroX && dentroY && this.podeDarDano) {
            player.helthAtual(1);
            // tirar vida do player
            console.log("Player atingido pelo Boss!");

            this.ultimoDano = tempoAgora;
            this.podeDarDano = false;

            // Reseta o podeDarDano após o cooldown
            setTimeout(() => {
                this.podeDarDano = true;
            }, this.cooldownDano);
        }
    }

    isAtingido() {
        this.atingido = true;
    }
    
}