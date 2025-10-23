// Mapas.js
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

import { drawMap,mapas } from "./Mapas.js";
let mapaAtual = mapas.Ceu;
let background = new Image(); //variavel de imagem para descobrir tamanho do mapa
background.src = mapaAtual.background; //recebe mapa("src" é usado em Image())


/*
background.onload = function() { //vai se adaptar ao tamanho da imagem
canvas.width = background.width;
canvas.height = background.height;

animate(); // quando o mapa carregar, inicia
}

*/




// ----------------------------- VARIAVEIS JOGADOR

const player = new Player(ctx);
const inimigo = new Inimigo(ctx);
const balas = [];
let canPress = true;
let canAtirar = true;
let keys={
    left: false,
    right: false,
};
let acao_anterior =0;
let verifica_estado=true;
// ----------------------------- VARIAVEIS JOGADOR



function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.drawImage(background, 0, 0);
    drawMap(ctx,mapaAtual);

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
        
    //se "A" nem "D" estiverem sendo pressionados
    //a velocidade do player zera.  
    }else{
        player.velocity.x = 0;
    }
    
    
    // Atualiza e desenha o player
    player.update();
    player.draw();

    inimigo.update(player.position.y,player.position.x);
    inimigo.draw();

    // Atualiza e desenha balas
    balas.forEach((bala, index) => {
        bala.update();
        if (bala.position.x > canvas.width || bala.position.x < 0) {
            balas.splice(index, 1);
        }
    });
}


//            ------------------           ACOES DO JOGADOR               --------------------
function doAction(){
    console.log("pular");
    canPress = true;
}
//timeStamp do tiro
function tiro(){
    console.log("tiro");
    canAtirar = true;
}

function limpaEstado(){
    player.maximoframes =5;
    player.estado=0;
    verifica_estado = false;
}

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
                //console.log("passou aqui");
                player.acao = (player.acao_anterior === 1) ? "direita" : "esquerda";
                player.maximoframes=6;
                //console.log("acao: "+player.acao);
                //console.log("estado: "+player.estado);
            }
            else{
                player.pararPlayer();
            }
        },200);
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


// Quando o sprite carregar, inicia o loop
player.sprite.onload = () => {
    animate();
};
