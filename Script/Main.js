// Mapas.js
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;


//-------------------------SELETOR DE MAPAS E MUSCAS

import { drawMap,mapas} from "./Mapas.js";
import { playTiro,addMusic } from "./SonsEMusicas.js";
let seletorDeMapaAtual= 2;
let mapaAtual;

switch(seletorDeMapaAtual){
    case 1:
        mapaAtual = mapas.Praia;
        break;
    case 2:
        mapaAtual = mapas.Pista;
        break;
    case 3:
        mapaAtual = mapas.Ceu;
        break;
    case 4:
        mapaAtual = mapas.Masmorra;
        break;
}




//let background = new Image(); //variavel de imagem para descobrir tamanho do mapa
//background.src = mapaAtual.background; //recebe mapa("src" é usado em Image())
/*
background.onload = function() { //vai se adaptar ao tamanho da imagem
canvas.width = background.width;
canvas.height = background.height;

animate(); // quando o mapa carregar, inicia
}

*/




// ----------------------------- VARIAVEIS JOGADOR
const player = new Player(ctx);
const inimigos = [];
const inimigo = new Inimigo(ctx);
inimigos.push(inimigo);
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
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
    //ctx.drawImage(background, 0, 0);
    drawMap(ctx,mapaAtual,canvas);

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

    inimigos.forEach(async(inimigo, index) => {
        if (inimigo.life > 2 && !inimigo.morrendo) {
        inimigo.morrendo = true; // impede chamar de novo
        inimigo.vivo = false;
        await inimigoMorreu(inimigo, index);
    } else if (inimigo.vivo){
        inimigo.update(player.position.y, player.position.x);
    }
    });
    

    // Atualiza e desenha balas
    balas.forEach((bala, index) => {
        let removeBala = false;
        bala.update();
        if (bala.position.x > canvas.width || bala.position.x < 0) {
            removeBala = true;
        }
        console.log(inimigo.verificaColisao(bala))
        if ((inimigo.verificaColisao(bala)) && inimigo.vivo){
            inimigo.life += 1;
            removeBala = true;
            console.log(inimigo.life);
        }
        if(removeBala){
            balas.splice(index, 1);
        }
    });
}

async function inimigoMorreu(inimigo,index){
                inimigo.morreu();
                await esperar(1100);
                console.log("deletou")
                inimigos.splice(index,1)
            }
function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
function click_e_enter_tiro(){
    if(canAtirar){
        canAtirar=false;
        const direcao = (player.acao_anterior === 1) ? "direita" : "esquerda";
        //Posição a onde a bala vai surgir
        //mude o valor ao lado de + para alterar
        if(player.acao_anterior === 1){
            //o tiro para a direcao esquerda sai um pouco do esquadro do player
            const bala = new Bala(player.position.x+47,player.position.y+50,direcao,player.ctx);
            balas.push(bala);
        }
        else{
            const bala = new Bala(player.position.x,player.position.y+50,direcao,player.ctx);
            balas.push(bala);
        }
        
        playTiro();
        player.acao = (player.acao_anterior === 1) ? "atirandoD" : "atirandoE";
        player.estado =0;
        player.maximoframes=0
        setTimeout(() => {
            if(player.velocity.x !== 0){
                //console.log("passou aqui");
                player.acao = (player.acao_anterior === 1) ? "direita" : "esquerda";
                player.maximoframes=5;
                //console.log("acao: "+player.acao);
                //console.log("estado: "+player.estado);
            }
            else{
                player.pararPlayer();
            }
        },200);
        setTimeout(tiro,800);
    }
}

document.addEventListener("keydown", ({code}) => {
    if ((code === "Space" || code ==="KeyW") && canPress == true ){
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
    if(code === "Enter"){
        click_e_enter_tiro();
    }

})
document.addEventListener("click", () =>{
    click_e_enter_tiro();
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
    addMusic(mapaAtual);
};
