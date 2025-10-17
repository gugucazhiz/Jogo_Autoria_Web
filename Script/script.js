let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

//const imagem = new Image();
//imagem.src = "character.png";

//const largura = 34;
//const altura = 42;

//imagem.onload = function(){
//    ctx.drawImage(imagem,0,0,largura,altura,0,0,largura,altura);
//};

//const posy=10;
//const posx=30;

//ctx.fillStyle ="red";
//ctx.fillRect(20,20,20,20);

const gravidade = 1;

class Player{
    constructor(){
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
        this.estado = 0;
        this.direcao = 0;
        this.maximoframes = 5;
        this.frameContador=0;
        this.frameDelay =10;
        this.acao = "parado";
        this.acao_anterior =0;
    }
    draw(){
        let linha;
        switch(this.acao){
            case "parado":
                linha = 1;
                break;
            case "esquerda":
                linha= 0;
                break;
            case "direita":
                linha = 1;
                break;
            case "pulando":
                linha = 2;
        }
        ctx.drawImage(
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
                this.estado = 0;
            }

        }
        //this.velocity.x
        //para testar frames = 0.1
        this.position.x += this.velocity.x;


        if(this.velocity.x > 0 || this.velocity.x <0){
            this.animateFrames();
        }
        else{
            this.estado = 0;
        }
    }
     animateFrames() {
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
}

class Bala{
    constructor(x,y,direcao){
        this.position={
            y,
            x,
        };
        this.size={
            height: 4,
            width: 5,
        };
        this.speed=20;
        this.color = "red";
        this.direcao = direcao;
    }  
        draw(){
            ctx.fillStyle=this.color;
            ctx.fillRect(this.position.x,this.position.y,
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


//VARIAVEIS
const player = new Player();
let balas = [];
let canPress = true;
let keys={
    left: false,
    right: false,
};
let mira={
    leftAim:false,
    rightAim:false,
}
let acao_anterior =0;

//VARIAVEIS

function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'purple'
    ctx.fillRect(0,0,8000,8000)
    
    if(keys.left){
        if(player.velocity.x > -8){
            player.velocity.x -= 2;
        }
        
    }
    else if(keys.right){
        if(player.velocity.x < 8){
            player.velocity.x += 2;
        }
        
    }
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

function doAction(){
    console.log("pular");
    canPress = true;
}
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
document.addEventListener("keydown", ({code}) => {
    if ((code === "Space") && canPress == true ){
        canPress =false;
        player.position.y -= 20;
        player.velocity.y = -10;
        setTimeout(doAction,500);
        
    }
    if (code === "KeyD"){
        keys.right=true;
        mira.leftAim =false;
        mira.rightAim =true;
        player.acao ="direita";
        player.acao_anterior =1;
    }
    if (code === "KeyA"){
        keys.left=true;
        mira.rightAim =false;
        mira.leftAim =true;
        player.acao ="esquerda";
        player.acao_anterior = 0;
    }

})
document.addEventListener("click", () =>{
    const direcao = mira.rightAim ? "direita" : "esquerda";
    const bala = new Bala(player.position.x+50,player.position.y+50,direcao);
    balas.push(bala);
});

document.addEventListener("keyup", ({code}) =>{
    if (code === "KeyD"){
        keys.right=false;
    }
    if (code === "KeyA"){
        keys.left=false;
    }
})

player.sprite.onload = () => {
    animate();
}