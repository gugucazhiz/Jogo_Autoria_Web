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
            width : 20,
            height : 20
        }
        this.color = "green";

        this.velocity = {
            x : 0,
            y : 0
        }
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x,this.position.y,
            this.size.width,this.size.height);
    }
    update(){
        if(this.position.y+this.size.height > canvas.height-55){
            this.velocity.y = 0;    
        }
        else{
            this.velocity.y += gravidade;
            this.position.y += this.velocity.y;
        }

        this.position.x += this.velocity.x;
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


function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    if(keys.left){
        if(player.velocity.x <= 10){
            player.velocity.x += 5;
        }
        
    }
    else if(keys.right){
        if(player.velocity.x >= -10){
            player.velocity.x -= 5;
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


animate();

document.addEventListener("keydown", ({code}) => {
    if ((code === "Space") && canPress == true ){
        canPress =false;
        player.position.y -= 15;
        player.velocity.y = -10;
        setTimeout(doAction,300);
    }
    if (code === "KeyD"){
        keys.left=true;
        mira.leftAim =false;
        mira.rightAim =true;
    }
    if (code === "KeyA"){
        keys.right=true;
        mira.rightAim =false;
        mira.leftAim =true;
    }

})
document.addEventListener("click", () =>{
    const direcao = mira.rightAim ? "direita" : "esquerda";
    const bala = new Bala(player.position.x-5,player.position.y,direcao);
    balas.push(bala);
});

document.addEventListener("keyup", ({code}) =>{
    if (code === "KeyD"){
        keys.left=false;
    }
    if (code === "KeyA"){
        keys.right=false;
    }
})