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
    }
}

const player = new Player();

function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    player.update();
    player.draw();
}

let canPress = true;

function doAction(){
    console.log("Action Executed");
    canPress = true;
}

animate();

document.addEventListener("keydown", ({code}) => {
    if (code === "Space" && canPress == true){
        canPress =false;
        player.position.y -= 15;
        player.velocity.y = -10;
        setTimeout(doAction,500);
    }
    if (code === "KeyD"){
        player.position.x += 15;

    }
    if (code === "KeyA"){
        player.position.x -= 15;

    }
})