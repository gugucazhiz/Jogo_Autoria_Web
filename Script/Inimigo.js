


class Inimigo{
    constructor(ctx,positionx,positiony,morrendo,vivo,life){
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
        //som
        this.audioDanoMushRoom = new Audio("./Audio/Enemys/Mushroom/mushrromSoundDying.mp3")
        this.audioDanoMushRoom.volume = 0.1;
        //gravidade
        this.gravidade = 1;
        //imagem
        this.ctx = ctx;
        this.spriteRun = new Image();
        this.spriteRun.src = "Sprites/Inimigos/Mushroom/Mushroom without VFX/Mushroom-Run.png";
        //tamanho
        this.escala = 1.5; // tamanho do inimigo na tela
        this.morrendo = morrendo; //false;
        this.vivo = vivo; //true;
        this.life = life; //0;
        this.puloAplicado = false;
        this.altura =60;
        this.largura =100;
        this.estado = 0.4;       //cordenada X do spritesheet
        this.direcao = 3;   //1 esquerda || 3 direita  || 5 morrendo esquerda || 7 morrendo direita
        //controle de frames na tela
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
        this.audioDanoMushRoom.play();
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

    update(Playery, Playerx, player,inimigos) {
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
            //console.log(this.velocity.y)
            const dentroX = Math.abs(this.position.x - Playerx) < hitboxX / 2;
            const dentroY = Math.abs(this.position.y - Playery) < hitboxY;
            //console.log(dentroX+" "+dentroY);
            //tira vida do player caso atinja
            if ((dentroX && dentroY) && this.morrendo === false) {
                //console.log("passou");
                this.velocity.x = 5;
                this.position.x -= (dirX * 60) * this.velocity.x;
                player.helthAtual(1);
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


            //evitar sobreposicao de inimigos

            this.evitarSobreposicao(inimigos);

            this.draw();
            //console.log(this.velocity.x+" velocidade x")
            if (!(this.velocity.x == 0)) {
                this.animateFrames();
            }

        }
    }
    evitarSobreposicao(inimigos) {
        const hitboxReducao = 25; // reduz 25px de cada lado
    inimigos.forEach(outro => {
        if (outro === this) return; // ignora a si mesmo
        const colidiuX = this.position.x + hitboxReducao < outro.position.x + outro.largura - hitboxReducao &&
                 this.position.x + this.largura - hitboxReducao > outro.position.x + hitboxReducao;

        const colidiuY = this.position.y + hitboxReducao < outro.position.y + outro.altura - hitboxReducao &&
                 this.position.y + this.altura - hitboxReducao > outro.position.y + hitboxReducao;


        //debug para testar do tamanho do collider
        /*
        this.ctx.fillRect(
        this.position.x + hitboxReducao / 2, 
        this.position.y + hitboxReducao / 2, 
        this.largura - hitboxReducao, 
        this.altura - hitboxReducao
        );
        */
        if (colidiuX && colidiuY) {
            // empurra os inimigos levemente para os lados opostos
            const sobreposicaoX = (this.largura - Math.abs(this.position.x - outro.position.x)) / 2;
            const direcaoEmpurrao = (this.position.x < outro.position.x) ? -1 : 1;
            this.position.x += direcaoEmpurrao * sobreposicaoX *0.01;
        }
    });
}

}


class Inimigo2{
    constructor(ctx,positionx,positiony,morrendo,vivo,life){
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

        //som
        this.audioDanoFire = new Audio("./Audio/Enemys/Fire/FireSoundDying.mp3")
        this.audioDanoFire.volume = 0.7;
        //gravid
        this.gravidade = 1;
        //imagem
        this.ctx = ctx;
        this.spriteFire = new Image();
        this.spriteFire.src = "Sprites/Inimigos/Fire/fireSmoke.png";
        
        //tamanho
        this.escala = 1.5; // tamanho do inimigo na tela
        this.morrendo = morrendo; //false;
        this.vivo = vivo; //true;
        this.life = life; //0;
        this.altura =70;
        this.largura =105;
        this.estado = 0;       //cordenada X do spritesheet
        this.direcao = 0.4;   //0.4 linha fogo //2 linha fumaca

        //controle de frames
        this.maximoframes =6;  //quantidade de frames a serem usados da spritesheet
        this.frameContador = 0;  //index i do if de animateFrames
        this.frameDelay = 13;   //Fps
        this.acao_anterior = 0; //ultima direção olhadaa
    }

    draw() {
        this.ctx.drawImage(
            this.spriteFire,
            this.estado * this.largura, //0 || 1.3 || 2.6 || 3.9 ||  5.2  ||6.5  || 7.8
            this.direcao* this.altura, //0.4 linha fogo //2 linha fumaca
            this.largura,
            this.altura,
            this.position.x,
            this.position.y+20,
            this.largura-30,
            this.altura-30
        );
        /*
        this.ctx.fillRect(
            this.position.x,
            this.position.y,
            this.largura,
            this.altura
        );
        */
    }
    animateFrames() {
        this.frameContador++;
        if (this.frameContador >= this.frameDelay) {
            this.estado = this.estado + 1.3;
            if (this.estado >= this.maximoframes) {
                this.estado = 0;
            }
            this.frameContador = 0;
        }
        return
    }
    morreu() {
        this.morrendo = true;
        this.maximoframes = 8
        this.direcao = 2;
        this.frameDelay = 12;
        this.animateFrames();
        this.audioDanoFire.play();
    }

    verificaColisao(bala) {
        return (
            bala.position.x < this.position.x + (this.largura - 70) &&
            bala.position.x + bala.size.width > this.position.x &&
            bala.position.y < this.position.y + (this.altura - 20) &&
            bala.position.y + bala.size.height > this.position.y
        );
    }

    update(Playery, Playerx, player,inimigos) {
        const distanciaMinima = 1; // distância mínima do player


        //let verdadeounao = (this.estado).toFixed(0) == 3
        //console.log("estado"+ verdadeounao)

        //se estado for 3.9 (achatado) deve pular
        if (Math.floor(this.estado) === 3 && !this.puloAplicado && 
        this.position.y >= canvas.height - 95 && !this.morrendo) {
        console.log("inimigo pulou")
        this.velocity.y = -15;   // impulso do pulo valor bom: -15
                                 // valor bom para teste -1
        this.puloAplicado = true;
        }

        // quando o frame deixa de ser 3, reseta
        if ((this.estado).toFixed(0) != 3) {
            this.puloAplicado = false;
        }

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
                this.position.y += 1-dirY * this.velocity.y;

                if (Playerx > this.position.x) {
                    this.acao_anterior = 3;
                }
                else {
                    this.acao_anterior = 1;
                }
            }


            let hitboxX = 40;
            let hitboxY = 40;
            //console.log(this.velocity.y)
            const dentroX = Math.abs(this.position.x - Playerx) < hitboxX / 2;
            const dentroY = Math.abs(this.position.y - Playery) < hitboxY;
            //console.log(dentroX+" "+dentroY);
            //tira vida do player caso atinja
            if ((dentroX && dentroY) && this.morrendo === false) {
                //console.log("passou");
                this.velocity.x = 5;
                this.position.x -= (dirX * 60) * this.velocity.x;
                player.helthAtual(2);
            }

            // gravidade
            this.velocity.y += this.gravidade;
            this.position.y += this.velocity.y;

            // colisão com chão
            if (this.position.y >= canvas.height - 95) {
                this.position.y = canvas.height - 95;
                this.velocity.y = 0;
                this.puloAplicado = false; // permite pular novamente no próximo ciclo
            }

            this.evitarSobreposicao(inimigos);

            this.draw();
            //console.log(this.velocity.x+" velocidade x")
            if (!(this.velocity.x == 0)) {
                this.animateFrames();
            }
        }
    }
    evitarSobreposicao(inimigos) {
        const hitboxReducao = 2; // reduz 25px de cada lado
    inimigos.forEach(outro => {
        if (outro === this) return; // ignora a si mesmo
        const colidiuX = this.position.x + hitboxReducao < outro.position.x + outro.largura - hitboxReducao &&
                 this.position.x + this.largura - hitboxReducao > outro.position.x + hitboxReducao;

        const colidiuY = this.position.y + hitboxReducao < outro.position.y + outro.altura - hitboxReducao &&
                 this.position.y + this.altura - hitboxReducao > outro.position.y + hitboxReducao;


        //debug para testar do tamanho do collider
        /*
        this.ctx.fillRect(
        this.position.x + hitboxReducao / 2, 
        this.position.y + hitboxReducao / 2, 
        this.largura - hitboxReducao, 
        this.altura - hitboxReducao
        );
        */
        if (colidiuX && colidiuY) {
            // empurra os inimigos levemente para os lados opostos
            const sobreposicaoX = (this.largura - Math.abs(this.position.x - outro.position.x)) / 2;
            const direcaoEmpurrao = (this.position.x < outro.position.x) ? -1 : 1;
            this.position.x += direcaoEmpurrao * sobreposicaoX *0.01;
        }
    });    
}

}



