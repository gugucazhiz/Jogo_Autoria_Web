


class Inimigo{
    constructor(ctx){
        this.position = {
            x: 0,
            y: 0
        }
        this.size = {
            h : 20,
            w : 20
        }
        this.velocity = {
            x : 3,
            y : 1,
        }
        this.color = "red";
        this.ctx = ctx;
        this.gravidade = 1;
    }
    draw(){
        this.fillStyle = this.color;
        this.ctx.fillRect(
            this.position.x,
            this.position.y,
            40,
            25
            //this.size.w,
            //this.size.h
        )
    }
    
    update(Playery ,Playerx){
        const distanciaMinima = 0; // distância mínima do player

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
        
        let hitboxX = 50;
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
}
}
        
        
        

