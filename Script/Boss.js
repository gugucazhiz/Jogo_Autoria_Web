class Boss {
    constructor(ctx, positionx, positiony) {
        this.position = {
            x: positionx,
            y: positiony
        }
        this.size = {
            w: 120,
            h: 180
        }
        this.velocity = {
            x: 2,
            y: 1
        }
        this.gravidade = 0.8;
        this.ctx = ctx;

        // controle de Frames
        this.estado = 0;
        this.direcao = 0;      // direção atual
        this.maximoframes = 5.9; // 6 frames por linha
        this.frameContador = 0;
        this.frameDelay = 10;
        this.acao = "movendo";
        this.acao_anterior = 0;

        // sprite
        this.altura = 210;  // altura de cada quadro
        this.largura = 170; // largura aproximada de cada quadro 
        this.sprite = new Image();
        this.sprite.src = "Sprites/Bosses/Bossgustavo/sprites/semFundo/boss.png";

        // vida e estado
        this.life = 0;
        this.vivo = true;
        this.morrendo = false;

        // movimento aleatório
        this.velocidadeAleatoria = {
            x: (Math.random() * 3) + 1,  // entre 1 e 4
            y: (Math.random() * 2) + 0.5  // entre 0.5 e 2.5
        }

        // timer para mudar direção aleatória
        this.tempoMudancaDirecao = 0;
        this.intervaloMudanca = 60; // frames até mudar direção
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
        const sx = Math.floor(this.estado) * 170; // coordenada X da sprite sheet
        const sy = linha * this.altura; // coordenada Y da sprite sheet
        const sw = 170; // largura do frame
        const sh = this.altura; // altura do frame
        
        this.ctx.drawImage(
            this.sprite,
            sx, sy, sw, sh,
            this.position.x,
            this.position.y,
            this.size.w,
            this.size.h // tamanho na tela
        );

        // Desenha barra de vida interessante adicionar para o boss e inimigos
        // this.desenhaVida();
    }

// usar o metodo desenhaVida() para mostrar a vida do boss e depois pode adicionar para inimigos comuns
/*
    desenhaVida() {
        const barraLargura = this.size.width;
        const barraAltura = 10;
        const x = this.position.x;
        const y = this.position.y - 20;

        // Fundo da barra (vermelha)
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(x, y, barraLargura, barraAltura);

        // Vida (verde)
        const vidaPercentual = this.vida / this.vidaMaxima;
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(x, y, barraLargura * vidaPercentual, barraAltura);

        // Borda da barra
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, barraLargura, barraAltura);
    }
*/

    update(Playery, Playerx) {
        if (!this.vivo) return;

        // movimento aleatório em duas direções
        this.tempoMudancaDirecao++;

        if (this.tempoMudancaDirecao >= this.intervaloMudanca) {
            // mudar direção aleatória
            this.velocidadeAleatoria.x = (Math.random() * 3) + 1;
            this.velocidadeAleatoria.y = (Math.random() * 2) + 0.5;

            // pode mudar o sinal (direita/esquerda ou cima/baixo)
            if (Math.random() > 0.5) {
                this.velocity.x = this.velocidadeAleatoria.x;
            } else {
                this.velocity.x = -this.velocidadeAleatoria.x;
            }

            if (Math.random() > 0.5) {
                this.velocity.y = this.velocidadeAleatoria.y;
            } else {
                this.velocity.y = -this.velocidadeAleatoria.y;
            }

            this.tempoMudancaDirecao = 0;
            this.intervaloMudanca = Math.random() * 80 + 40; // entre 40 e 120 frames
        }

        // mover o boss (horizontal)
        this.position.x += this.velocity.x;

        // limites horizontais
        if (this.position.x <= 0) {
            this.position.x = 0;
            this.velocity.x *= -1;
        }
        if (this.position.x + this.size.w >= canvas.width) {
            this.position.x = canvas.width - this.size.w;
            this.velocity.x *= -1;
        }

        // move o boss (vertical)
        this.position.y += this.velocity.y;

        // limites verticais (evita sair da tela)
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocity.y *= -1;
        }
        if (this.position.y + this.size.h >= canvas.height - 100) {
            this.position.y = canvas.height - this.size.h - 100;
            this.velocity.y *= -1;
        }

        // definir direção para animação
        if (this.velocity.x > 0) {
            this.acao_anterior = 1; // direita
        } else if (this.velocity.x < 0) {
            this.acao_anterior = 0; // esquerda
        }

        // atualiza frames de animação
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            this.acao = "movendo";
            this.animateFrames();
        } else {
            this.acao = "parado";
        }

        this.draw();
    }

    animateFrames() {
        this.frameContador++;
        if (this.frameContador >= this.frameDelay) {
            this.estado++;
            if (this.estado >= 6) { // 6 frames por linha
                this.estado = 0;
            }
            this.frameContador = 0;
        }
    }

    verificaColisao(bala) {
        return (
            bala.position.x < this.position.x + (this.largura - 20) &&
            bala.position.x + bala.size.width > this.position.x &&
            bala.position.y < this.position.y + (this.altura - 20) &&
            bala.position.y + bala.size.height > this.position.y
        );
    }

    recebeDano(dano) {
        if (!this.morrendo) {
            this.life += dano;
            if (this.life >= 100) {
                this.life = 100;
                this.morreu();
            }
        }
    }

    morreu() {
        this.morrendo = true;
        this.acao_anterior = (this.acao_anterior === 1) ? 1 : 0;
        console.log("Boss morreu!");
    }

    verificaHitboxPlayer(Playerx, Playery, playerWidth, playerHeight) {
        const dentroX = Math.abs(this.position.x - Playerx) < (this.size.w + playerWidth) / 2;
        const dentroY = Math.abs(this.position.y - Playery) < (this.size.h + playerHeight) / 2;
        return dentroX && dentroY;
    }
}