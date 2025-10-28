class Boss {
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
        this.life = 0; // conta acertos
        this.vivo = true;
        this.morrendo = false;

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

    update(Playery, Playerx) {
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

        // aplica velocidade base suave
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
            bala.position.y < this.position.y + (this.altura - 20) &&
            bala.position.y + bala.size.height > this.position.y
        );
    }

    recebeDano() {
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

    verificaHitboxPlayer(Playerx, Playery, playerWidth, playerHeight) {
        const dentroX = Math.abs(this.position.x - Playerx) < (this.size.w + playerWidth) / 2;
        const dentroY = Math.abs(this.position.y - Playery) < (this.size.h + playerHeight) / 2;
        return dentroX && dentroY;
    }
}