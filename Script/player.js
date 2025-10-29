
const gravidade = 1;

class Player{
    constructor(ctx,canvas){
        this.canvas = canvas;
        this.ctx =ctx;
        this.position = {
            x : canvas.width/2,
            y : canvas.height,
            //
        }
        this.positionVida = {
            //mexa somente no numero fora dos parenteses
            x : (canvas.width/2)-90,
            y : 20,
        }
        this.positionPower = {
            //mexa somente no numero fora dos parenteses
            x : (canvas.width/2)-650,
            y : 40,
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
        //powerup
        this.timeOutTiroNormal = 700; //Ak 300 //normal 700
        this.powerHud =0;
        this.qntInimigosMortos = 0; //se matar 4 sem morrer pode ativar o poder
        this.poderAtivado = false;

        //So,m
        this.audioDano = new Audio("./Audio/Player/PlayerTakingDamage.mp3")
        this.audioDano.volume = 0.025
        //Imagens
        this.normais =  "Sprites/Player/personagem_correndo.png"
        this.agachado = "./Sprites/Player/agachado_e_aleatorio.png";
        this.sprite = new Image();
        this.sprite.src = this.normais

        //huds
        this.spritePower = new Image ();
        this.spritePower.src = "/Sprites/Hud/aka.png"
        this.spriteVida = new Image();
        this.spriteVida.src = "Sprites/Hud/vidas.png"
        //vida
        this.gameOver= false;
        this.life =3;
        this.hudLife =2.7;
        //Controle Framess
        this.alturaDochao= 110;
        this.noChao = false;
        this.emcimaPlataforma=false
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
    setAcao(novaAcao) {
        if (this.acao === novaAcao) return;

        this.acao = novaAcao;
        switch (this.acao) {
            case "parado":
            case "esquerda":
            case "direita":
            case "pulando":
            case "atirandoE":
            case "atirandoD":
                this.frameDelay = 15;
                this.alturaDochao = 110
                this.altura =210;
                this.largura =210;
                this.maximoframes =5
                this.sprite.src = this.normais;
                break;
            case "agachadoE":
            case "agachadoD":
                this.maximoframes =2;
                this.estado =0;
                this.frameDelay = 15;
                this.alturaDochao = 105
                this.position.y += 10;
                this.altura =180;
                this.largura =180;
                this.sprite.src = this.agachado;
                
                break;
        }
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
                if(this.poderAtivado){
                    linha = 3;
                    this.estado = 3.2;
                }
                break;
            case "atirandoD":
                linha = 3;
                if(this.poderAtivado){
                    this.estado = 2.4;
                }
                break;
            case "agachadoE":
                linha =0;
                break;
            case "agachadoD":
                linha =1;
                break;
        }
        // playear
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
        //Vida do player
        this.ctx.drawImage(
            this.spriteVida,
            0 * 210,
            this.hudLife * 205, //2.7 full Life //1.68  2/3 life // 0.8 1/3 life // 0.1 = 0 life0 life
            400,
            200,
            this.positionVida.x,
            this.positionVida.y,
            210,
            100
        );

        //Power
        this.ctx.drawImage(
            this.spritePower,
            0 * 200,
            this.powerHud * 200, //4.35 =4p //3.27 =3p//2.13 = 2p // 1 = 1p // 0 = 0 p
            600, //zoom na imagem
            200,
            this.positionPower.x,
            this.positionPower.y,
            140, //tamanho da imagem
            60
        );
        if(this.qntInimigosMortos == 4){
            this.ctx.font = "18px Arial";
            this.ctx.fillStyle = "gold";
            this.ctx.fillText("Pressione 'P' para Usar AK", this.canvas.width/2-480,this.canvas.height/11);
        }
        
    }
    update(){   

        //posicao vertical
            if (!this.noChao) {
                this.velocity.y += gravidade;
            }
            this.position.y += this.velocity.y;
            this.noChao = false;

            //chao principal
        if (this.position.y > canvas.height - this.alturaDochao) {
                this.position.y = canvas.height - this.alturaDochao;
                this.velocity.y = 0;
                this.noChao = true;
        }

        if (this.velocity.y > 1) {
                //console.log("velo "+this.velocity.y)
                //console.log("esta pulando")
                this.setAcao("pulando");
                this.estado = 4;
                this.maximoframes = 5;
        }
        else{
            //this.velocity.y = 0;
            //this.position.y = canvas.height -110;
            if(this.acao === "pulando"){
                if(this.velocity.x !== 0) {
                    this.setAcao(this.acao_anterior === 0 ? "esquerda" : "direita");
                }
                else{
                    this.setAcao("parado");
                        
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
                this.setAcao(this.acao_anterior === 0 ? "esquerda" : "direita");
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
    pararPlayer(){
            this.setAcao("parado");
            this.estado = (this.acao_anterior === 1)? 2.4 : 5.6;
    }
    powerUp(){
        this.poderAtivado = true;
        this.timeOutTiroNormal = 220;
        console.log(this.life)
        if(this.life != 3){
            this.life +=2; //adiciona mais 2 de vida
            this.helthAtual(1) //tira 1 de vida e atualiza hud
                            //no final player ganha 1+ vida
        }
        setTimeout(() => {
            this.PowerAtual(-4) //zera barra de progressao do poder
            this.poderAtivado = false
            //console.log("valor de timeout Atual: "+this.timeOutTiroNormal)
            this.timeOutTiroNormal = 700;
        },10000)
    }
    helthAtual(vidaAserTirada){
        this.audioDano.play();
        this.life = this.life - vidaAserTirada;
        //2.7 full Life //1.68  2/3 life // 0.8 1/3 life // 0 = 0 life0 life
        switch(this.life){
            case 3:
                this.hudLife = 2.7
                break;
            case 2:
                this.hudLife = 1.68
                break;
            case 1:
                this.hudLife = 0.8
                break;
            case 0:
                this.hudLife = 0
                this.gameOver = true;
                break;
            default:
                this.hudlife = 0;
                this.gameOver = true;
                break;
        }
    }

    PowerAtual(kill){
        this.qntInimigosMortos += kill;
        //2.7 full Life //1.8  2/3 life // 0.9 1/3 life // 0.1 = 0 life
        switch(this.qntInimigosMortos){
            case 0:
                this.powerHud = 0;
                break;
            case 1:
                this.powerHud = 1
                break;
            case 2:
                this.powerHud = 2.13;
                break;
            case 3:
                this.powerHud = 3.27
                break;
            case 4:
                this.powerHud = 4.35;
                break;
            default:
                this.powerHud = 4.35;
                this.qntInimigosMortos =4;
                break;
        }
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
            width: 30,
        };
        this.spriteBala = new Image()
        this.spriteBala.src = "Sprites/Player/Powers.png"
        //Controle Framess
        this.altura =90;
        this.largura =85;
        this.estado = 1;       //cordenada X do spritesheet
        this.maximoframes =5;  //quantidade de frames a serem usados da spritesheet
        this.frameContador=0;  //index i do if de animateFrames
        this.frameDelay =10;   //Fps
        this.acao = "parado";  //Animacao Atual
        this.acao_anterior =0; //ultima direção olhada

        this.speed=10;
        this.direcao = direcao;
        this.lado;    //1.6 e 1.0
        
    }  
        draw(){
            this.ctx.drawImage(
            this.spriteBala,
            this.lado * this.largura,
            0 * this.altura,
            this.largura-15,
            this.altura-10,
            this.position.x,
            this.position.y-50,
            this.largura,
            this.altura
            );
        }
        update() {
            if(this.direcao === "direita"){
                this.position.x += this.speed;
                this.lado = 1.0
            }
            else{
                this.position.x -= this.speed;
                this.lado = 1.6
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