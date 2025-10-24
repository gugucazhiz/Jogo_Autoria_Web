


class Inimigo{
    constructor(ctx){
        this.position = {
            x: 1,
            y: 1
        }
        this.size = {
            h : 20,
            w : 20
        }
        this.velocity = {
            x : 3,
            y : 1,
        }
        this.gravidade =1;
        this.escala = 1.5; // tamanho do inimigo na tela
        this.ctx = ctx;
        this.spriteRun = new Image();
        this.spriteRun.src = "Sprites/Inimigos/Mushroom/Mushroom without VFX/Mushroom-Run.png";
        //
        this.altura =60;
        this.largura =170;
        this.estado = 0;       //cordenada X do spritesheet
        this.direcao = 0;      //direção atual a ser olhada
        this.maximoframes =5;  //quantidade de frames a serem usados da spritesheet
        this.frameContador=0;  //index i do if de animateFrames
        this.frameDelay =10;   //Fps
        this.acao = "parado";  //Animacao Atual
        this.acao_anterior =0; //ultima direção olhada
    }

    draw() {
        this.ctx.drawImage(
            this.spriteRun,
            this.estado * this.largura,
            1 * this.altura,
            this.largura,
            this.altura+10,
            this.position.x,
            this.position.y-20,
            this.largura-20,
            this.altura
            );
        }
    update(Playery ,Playerx){
        const distanciaMinima = 1; // distância mínima do player

    // diferença entre as posições
    const dx = Playerx - this.position.x;
    const dy = Playery - this.position.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    // só se move se estiver longe demais
    if (distancia > distanciaMinima) {
        // normaliza o vetor direção
        
        const dirX = dx / distancia;
        const dirY = dy / distancia;

        // move o inimigo em direção ao player
        this.position.x += dirX * this.velocity.x;
        this.position.y += dirY * this.velocity.y;
        
        let hitboxX = 70;
        let hitboxY = 40;

        const dentroX= Math.abs(this.position.x - Playerx) < hitboxX/2;
        const dentroY= Math.abs(this.position.y - Playery) < hitboxY;
        //console.log(dentroX+" "+dentroY);
        if(dentroX && dentroY){
            //console.log("passou");
            this.ctx.fillStyle = "green";
        }
    }

    // gravidade opcional (caso use física)
    if (this.position.y < canvas.height - 120) {
        this.velocity.y += this.gravidade;
        this.position.y += this.velocity.y;
    } else {
        this.velocity.y = 0;
        this.position.y = canvas.height - 80;
    }
    this.draw();
}
}
        
        
        

