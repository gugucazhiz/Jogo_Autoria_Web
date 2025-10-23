
const gravidade = 1;

class Player{
    constructor(ctx){
        this.ctx =ctx;
        this.position = {
            x : 20,
            y : 20,
        }

        this.size = {
            width : 2,
            height : 20,
        }
        this.color = "green";

        this.velocity = {
            x : 0,
            y : 0
        }
        
        this.sprite = new Image();
        this.sprite.src = "Sprites/Player/personagem_correndo.png"
        //Controle Framess
        this.altura =210;
        this.largura =210;
        this.estado = 0;       //cordenada X do spritesheet
        this.direcao = 0;      //direção atual a ser olhada
        this.maximoframes =5;  //quantidade de frames a serem usados da spritesheet
        this.frameContador=0;  //index i do if de animateFrames
        this.frameDelay =10;   //Fps
        this.acao = "parado";  //Animacao Atual
        this.acao_anterior =0; //ultima direção olhada
    }
    draw(){
        let linha; //cordenada y do spriteSheet
        switch(this.acao){
            case "parado":
                linha = 2;
                break;
            case "esquerda":
                linha= 0;
                break;
            case "direita":
                linha = 1;
                break;
            case "pulando":
                linha = 2;
                break;
            case "atirandoE":
                linha = 2;
                break;
            case "atirandoD":
                linha = 3;
                break;
        }
        this.ctx.drawImage(
            this.sprite,
            this.estado * this.largura,
            linha * this.altura,
            this.largura-30,
            this.altura-10,
            this.position.x,
            this.position.y,
            this.largura-120,
            this.altura-110
            );
        
    }
    update(){
        if(this.position.y < canvas.height-110){
            this.velocity.y += gravidade;
            this.position.y += this.velocity.y;

            if(this.velocity.y > 0){
                this.acao = "pulando";
                this.estado = 4;
                this.maximoframes =5;
            }
        }
        else{
            this.velocity.y = 0;
            this.position.y = canvas.height -110;
            if(this.acao === "pulando"){
                if(this.velocity.x !== 0) {
                    this.acao = (this.acao_anterior === 0)? "esquerda" : "direita";
                }
                else{
                    this.acao = "parado";
                    
                }

            }

        }
        //velocidade normal = this.velocity.x
        //para testar frames = 0.1
        this.position.x += this.velocity.x;

        if (this.position.x < 0) {
        this.position.x = 0;
        this.velocity.x = 0;
        }

        if (this.position.x + (this.largura -160) > canvas.width) {
            this.position.x = canvas.width - (this.largura-160);
            this.velocity.x = 0;
        }

        if(this.velocity.x !== 0  || this.acao === "pulando" || this.acao === "atirandoE" || this.acao === "atirandoD"){
            //precisei colocar esse if pois assim que ele saia da posicao "parado"
            //ele ja somava automaticamente 0.8 ao valor de 2.4 ou 5.6 que são respectivamente posicoes
            //do personagem parado
            if ((this.acao === "parado" ) && (this.estado === 2.4 || this.estado === 5.6)) {
                this.acao = (this.acao_anterior === 0)? "esquerda" : "direita";
                this.estado = 0;
            }
            this.animateFrames();
        }
        else{
            this.pararPlayer();
        }
    }
        
     animateFrames() {
       //console.log("direcao: "+this.estado)
       this.frameContador++;
       if(this.frameContador >= this.frameDelay){
            this.estado= this.estado +0.8;
            if(this.estado >= this.maximoframes){
                this.estado=0;
            }
            this.frameContador=0;
    }
    }
    pular(){
        if(this.position.y >= canvas.height -110){
            this.velocity.y =-10;
            this.acao = "pulando";
        }
    }
    pararPlayer(){
            this.acao = "parado";
            this.estado = (this.acao_anterior === 1)? 2.4 : 5.6;
            }
    
}

class Bala{
    constructor(x,y,direcao,ctx){
        this.ctx =ctx;
        this.position={
            y,
            x,
        };
        this.size={
            height: 10, 
            width: 5,
        };
        this.speed=20;
        this.color = "red";
        this.direcao = direcao;
    }  
        draw(){
            this.ctx.fillStyle=this.color;
            this.ctx.fillRect(this.position.x,this.position.y,
                this.size.width,this.size.height
            );
        }
        update() {
            if(this.direcao === "direita"){
                this.position.x += this.speed;
            }
            else{
                this.position.x -= this.speed;
            }
            this.draw();
        }
}

//-------------------------------SONS 




//VARIAVEIS
//const player = new Player(ctx);
//let balas = [];
/*
let canPress = true;
let canAtirar = true;
let keys={
    left: false,
    right: false,
};
let acao_anterior =0;
let verifica_estado=true;

*/

//VARIAVEIS

/*
function animate(ctx){
    requestAnimationFrame(() => animate(ctx));
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'purple'
    ctx.fillRect(0,0,8000,8000);
    
    if(keys.left){
        //if para limitar velocidade maxima
        if(player.velocity.x > -5){
            player.velocity.x -= 1;
        }
        
    }
    else if(keys.right){
        if(player.velocity.x < 5){
            player.velocity.x += 1;
        }
        
    }
    //se "A" nem "D" estiverem sendo pressionados
    //a velocidade do player zera.
    else player.velocity.x = 0;

    player.update();
    player.draw();

    
    balas.forEach((bala, index) => {
        bala.update();
        if(bala.position.x > canvas.width || bala.position.x < 0){
            balas.splice(index,1);
            }
        });
}

//TimeStamp do pulo
function doAction(){
    console.log("pular");
    canPress = true;
}
//timeStamp do tiro
function tiro(){
    console.log("tiro");
    canAtirar = true;
}
*/

//refresh do estado ao sair de "parado" || "pulando"

/*
function limpaEstado(){
    player.maximoframes =5;
    player.estado=0;
    verifica_estado = false;
}

*/
/*  

function pular(){
        player.direcao = 2;
        player.estado= (this.acao_anterior===1)? 4 : 3.2;
        
        setTimeout(() => {
            player.direcao =acao_anterior;
            player.estado = 0;
        },50);
}

*/

/*
document.addEventListener("keydown", ({code}) => {
    if ((code === "Space") && canPress == true ){
        canPress =false;
        //Mexa aqui para mudar altura e velocidade do pulo
        player.position.y -= 20;
        player.velocity.y = -10;
        setTimeout(doAction,500);
        
    }
    if (code === "KeyD"){
        //serve para limpar o estado antes de mostrar o sprite
        //dele correndo (sem esse if o sprite apresenta glitchs)
        if(verifica_estado)
            {limpaEstado()}

        keys.right=true;   //aumenta a velocidade do player
        player.acao ="direita"; //envia para o switch trocar o frame atual
                                //no stylesheet

        player.acao_anterior =1; //guarda a ultima direção olhada pelo player
    }
    if (code === "KeyA"){
        if(verifica_estado)
            {limpaEstado()}
        keys.left=true;
        player.acao ="esquerda";
        player.acao_anterior = 0;
    }

})
document.addEventListener("click", () =>{
    if(canAtirar){
        canAtirar=false;
        const direcao = (player.acao_anterior === 1) ? "direita" : "esquerda";
        //Posição a onde a bala vai surgir
        //mude o valor ao lado de + para alterar
        const bala = new Bala(player.position.x+50,player.position.y+50,direcao,player.ctx);
        balas.push(bala);
        player.acao = (player.acao_anterior === 1) ? "atirandoD" : "atirandoE";
        player.estado =0;
        player.maximoframes=0
        setTimeout(() => {
            if(player.velocity.x !== 0){
                player.acao = (player.acao_anterior === 1) ? "direita" : "esquerda";
            }
            else{
                player.pararPlayer();
            }
        },300);
        setTimeout(tiro,800);
    }
});

document.addEventListener("keyup", ({code}) =>{
    if (code === "KeyD"){
        keys.right=false;
        verifica_estado = true;
    }
    if (code === "KeyA"){
        keys.left=false;
        verifica_estado = true;
    }
})

*/

//loop para ficar dando frame reset na animação
/*
player.sprite.onload = () => {
    animate(player.ctx);
}

*/