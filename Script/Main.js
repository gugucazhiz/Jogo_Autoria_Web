// Mapas.js
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;


//-------------------------SELETOR DE MAPAS E MUSCAS

import { drawMap,mapas,gerarPlataformas} from "./Mapas.js";
import { playTiro,addMusic,abaixarVolume, playAgachar} from "./SonsEMusicas.js";


let seletorDeMapaAtual =1;
let mapaAtual;
let plataformas = [];

function selecionarMapa(seletorDeMapaAtual){
    
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
    plataformas = gerarPlataformas(mapaAtual,32)
    console.log("Plataformas geradas:", plataformas.length);
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

function carregarInimigosDoMapa(ctx, carregarMapa) {
    return carregarMapa.inimigosConfig.map(conf => {
        if (conf.tipo === "Inimigo2"){
             return new Inimigo2(ctx, conf.x, conf.dir, false, true, 2);
        }
        else if(conf.tipo === "Inimigo"){
            return new Inimigo(ctx, conf.x, conf.dir, false, true, 0);
        }
        else if(conf.tipo === "BossPraia"){
            return new Boss(ctx, canvas.width / 2, 100);
        }
    });
}




// ----------------------------- VARIAVEIS Principais
let podePassardefase = true;
let transicaoEmAndamento = false;
const player = new Player(ctx,canvas);
//inimigos.push(new Inimigo(ctx,600,1,false,true,0));
//inimigos.push(new Inimigo2(ctx,700,1,false,true,2));
const balas = [];
let isAgachando = false;
let canPress = true;
let canAtirar = true;
let canAgachar = true;
let keys={
    left: false,
    right: false,
};
let acao_anterior =0;
let verifica_estado=true;
selecionarMapa(seletorDeMapaAtual);
let inimigos = carregarInimigosDoMapa(ctx, mapaAtual);
// ----------------------------- VARIAVEIS Principais



function animate() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 
    requestAnimationFrame(animate);
    
    if(player.gameOver){
        desenharTelaDeMorte();
    }
    else{
    drawMap(ctx,mapaAtual,canvas);
        
        //ctx.drawImage(background, 0, 0);
        

        //pintar plataformas para debugg
        /*
         plataformas.forEach(p => {
        ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
        ctx.fillRect(p.x, p.y, p.w, p.h);
        });
        */

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
        
        //Plataformas colisao
        //player.noChao = false
        plataformas.forEach(plataforma => {
        const p = player;
        const colisaoX = p.position.x + (p.largura - 170) > plataforma.x &&
                         p.position.x < plataforma.x + plataforma.w;

        const colisaoY = p.position.y + (p.altura-140) > plataforma.y &&
                         p.position.y < plataforma.y + plataforma.h;

        if (colisaoX && colisaoY) {
            // colisão vinda de cima
            if (p.velocity.y > 0 && p.position.y + (p.altura - 160) - p.velocity.y <= plataforma.y) {
                p.position.y = plataforma.y - (p.altura - 160);
                p.velocity.y = 0;
                p.noChao = true;
                //console.log("player acao :"+p.acao)
            }
            //colisao vinda de baixo
            else if (p.velocity.y < 0 && p.position.y >= plataforma.y + plataforma.h - 7) {

            p.position.y = plataforma.y + plataforma.h;
            p.velocity.y = 0;
        }
    }
        });
        
        player.draw();
        
        inimigos.forEach(async(inimigo, index) => {
            if (inimigo.life > 2 && !inimigo.morrendo) {
            inimigo.morrendo = true; // impede chamar de novo
            
            await inimigoMorreu(inimigo, index);
            inimigo.vivo =false;
        } else if (inimigo.vivo){
            inimigo.update(player.position.y, player.position.x,player,inimigos);
        }
        });


        // Atualiza e desenha balas
        balas.forEach((bala, index) => {
            let removeBala = false;
            bala.update();
            if (bala.position.x > canvas.width || bala.position.x < 0) {
                removeBala = true;
            }

            
            inimigos.forEach((inimigo, indexInimigo) => {
                console.log(inimigo.verificaColisao(bala));
                if (inimigo.vivo && inimigo.verificaColisao(bala)) {
                    inimigo.life += 1;
                    removeBala = true;
                    }
            });


            if(removeBala){
                balas.splice(index, 1);
            }
        });
        
        passarDeFase();
    }
}

//            ------------------    ACOES DO JOGADOR  E Principais Funcoes              --------------------

async function inimigoMorreu(inimigo,index){
                inimigo.morreu();
                await esperar(900);
                if(transicaoEmAndamento){return}
                console.log("deletou")
                inimigos.splice(index,1)
                inimigo.vivo = false;
            }
function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function passarDeFase(){
        const podePassardefase = inimigos.some(inimigo => inimigo.vivo);
        if(!podePassardefase){
            transicaoEmAndamento=true;
            console.log(inimigos.length+" inimigos")
            alert("Passou De Fase");
            seletorDeMapaAtual++;
            selecionarMapa(seletorDeMapaAtual);
            reiniciarJogo()
            await esperar(900);
            transicaoEmAndamento=false;
        }
            
}
function trocarDemusica(escolhaMapa){
    addMusic(escolhaMapa);
}
//Tela De Morte Player
function desenharTelaDeMorte() {
    //passa parametros da tela de morte
    abaixarVolume()
    drawMap(ctx,mapas.DeathScreen,canvas);
    //addMusic(mapaAtual);
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "40px Arial";
    ctx.fillText("Pressione 'U' para reiniciar", canvas.width / 2, canvas.height / 2 +250);
}

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
    if(canAtirar && !(player.gameOver) && !player.acao.startsWith("agachado")){
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
        setTimeout(tiro,700);
    }
}

function waitAgachar(){
    canAgachar = true;
}

function agachar(){
    if(isAgachando) return;
        isAgachando = true;
        canAgachar =false;
        playAgachar();
        player.setAcao(player.acao_anterior === 0 ? "agachadoE" : "agachadoD");
        console.log("agachou: "+ player.acao_anterior)
        
        setTimeout(waitAgachar,1000)
}


function reiniciarJogo(){
        player.gameOver =false;
        player.life = 3;
        player.hudLife = 2.7;
        player.position.x = canvas.width/2;
        player.position.y = canvas.height;
        trocarDemusica(mapaAtual);
        inimigos.splice(0, inimigos.length);
        inimigos =carregarInimigosDoMapa(ctx,mapaAtual);
        console.log(inimigos)
}

document.addEventListener("keydown", ({code}) => {
    if ((code === "Space" || code ==="KeyW") && canPress == true ){
        canPress =false;
        //Mexa aqui para mudar altura e velocidade do pulo
        player.position.y -= 30;
        player.velocity.y = -20;
        setTimeout(doAction,700);
        
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
    if (code === "KeyS" && canAgachar){
        agachar();
    }
    if(code === "Enter"){
        click_e_enter_tiro();
    }
    if(code === "KeyU" && player.gameOver){
        reiniciarJogo();
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
    if (code === "KeyS"){
        isAgachando = false;
        verifica_estado = true;
    }
})


let jogoiniciado = false;
// Quando o sprite carregar, inicia o loop
player.sprite.onload = () => {
    if(!jogoiniciado){
        jogoiniciado = true;
        addMusic(mapaAtual);
        console.log("Trocou de musica")
        animate();
    }
};
