


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
        this.largura =100;
        this.estado = 0.4;       //cordenada X do spritesheet
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
            this.position.y,
            this.largura-20,
            this.altura-20
            );
        }
    animateFrames() {
       this.frameContador++;
       if(this.frameContador >= this.frameDelay){
            this.estado= this.estado +1.6;
            if(this.estado >= this.maximoframes){
                this.estado=0.4;
            }
            this.frameContador=0;
    }
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
        this.velocity.x =3;
        const dirX = dx / distancia;
        const dirY = dy / distancia;

        // move o inimigo em direção ao player
        this.position.x += dirX * this.velocity.x;
        this.position.y += dirY * this.velocity.y;
        
        let hitboxX = 50;
        let hitboxY = 40;

        const dentroX= Math.abs(this.position.x - Playerx) < hitboxX/2;
        const dentroY= Math.abs(this.position.y - Playery) < hitboxY;
        //console.log(dentroX+" "+dentroY);
        if(dentroX && dentroY){
            //console.log("passou");
            this.ctx.fillStyle = "green";
            this.velocity.x = 0;
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
    console.log(this.velocity.x+" velocidade x")
    if(!(this.velocity.x == 0)){
        this.animateFrames();
    }
    
}
}
        
        
        

