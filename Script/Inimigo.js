


class Inimigo {
    constructor(ctx, positionx, positiony) {
        this.position = {
            x: positionx,
            y: positiony
        }
        this.size = {
            h: 20,
            w: 20
        }
        this.velocity = {
            x: 3,
            y: 1,
        }
        this.gravidade = 1;
        this.escala = 1.5; // tamanho do inimigo na tela
        this.ctx = ctx;
        this.spriteRun = new Image();
        this.spriteRun.src = "Sprites/Inimigos/Mushroom/Mushroom without VFX/Mushroom-Run.png";
        //
        this.morrendo = false;
        this.vivo = true;
        this.life = 0;
        this.altura = 60;
        this.largura = 100;
        this.estado = 0.4;       //cordenada X do spritesheet
        this.direcao = 3;   //1 esquerda || 3 direita  || 5 morrendo esquerda || 7 morrendo direita
        this.maximoframes = 12;  //quantidade de frames a serem usados da spritesheet
        this.frameContador = 0;  //index i do if de animateFrames
        this.frameDelay = 10;   //Fps
        this.acao_anterior = 0; //ultima direção olhada
    }

    draw() {
        this.ctx.drawImage(
            this.spriteRun,
            this.estado * this.largura,
            this.direcao * this.altura,
            this.largura,
            this.altura + 10,
            this.position.x,
            this.position.y,
            this.largura - 20,
            this.altura - 20
        );
    }
    animateFrames() {
        this.frameContador++;
        this.direcao = this.acao_anterior;
        if (this.frameContador >= this.frameDelay) {
            this.estado = this.estado + 1.6;
            if (this.estado >= this.maximoframes) {
                this.estado = 0.4;
            }
            this.frameContador = 0;
        }
        return
    }
    morreu() {
        this.morrendo = true;
        this.acao_anterior = (this.acao_anterior === 3) ? 7 : 5;
        this.maximoframes = 11.4
        console.log(this.acao_anterior + " 5 ou 7")
        this.animateFrames();
    }

    verificaColisao(bala) {
        return (
            bala.position.x < this.position.x + (this.largura - 70) &&
            bala.position.x + bala.size.width > this.position.x &&
            bala.position.y < this.position.y + (this.altura - 20) &&
            bala.position.y + bala.size.height > this.position.y
        );
    }

    update(Playery, Playerx, player) {
        const distanciaMinima = 1; // distância mínima do player

        // diferença entre as posições
        const dx = Playerx - this.position.x;
        const dy = Playery - this.position.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        // só se move se estiver longe demais
        if (distancia > distanciaMinima) {
            // normaliza o vetor direção
            this.velocity.x = 3;
            const dirX = dx / distancia;
            const dirY = dy / distancia;

            // move o inimigo em direção ao player
            if (!(this.morrendo)) {
                this.position.x += dirX * this.velocity.x;
                this.position.y += dirY * this.velocity.y;

                if (Playerx > this.position.x) {
                    this.acao_anterior = 3;
                }
                else {
                    this.acao_anterior = 1;
                }
            }


            let hitboxX = 40;
            let hitboxY = 40;
            console.log(this.velocity.y)
            const dentroX = Math.abs(this.position.x - Playerx) < hitboxX / 2;
            const dentroY = Math.abs(this.position.y - Playery) < hitboxY;
            //console.log(dentroX+" "+dentroY);
            if ((dentroX && dentroY) && this.morrendo === false) {
                //console.log("passou");
                this.velocity.x = 5;
                this.position.x -= (dirX * 60) * this.velocity.x;
                player.helthAtual();
            }

        // gravidade opciona
        if (this.position.y < canvas.height - 120) {
            this.velocity.y += this.gravidade;
            this.position.y += this.velocity.y;
        }
        else {
            this.velocity.y = 0;
            this.position.y = canvas.height - 80;
        }
        this.draw();
        //console.log(this.velocity.x+" velocidade x")
        if (!(this.velocity.x == 0)) {
            this.animateFrames();
        }

    }
}





