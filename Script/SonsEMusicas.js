import {mapas} from "./Mapas.js";

let musica = new Audio()


export function playTiro(){
            const tiro = new Audio("./Audio/Player/tiro_Sound.mpeg");
            tiro.volume = 0.3;
            tiro.play();
        }

function alterarVolume(musicaAtual){
    if(musicaAtual === mapas.Praia || musicaAtual === mapas.Masmorra){
        musica.volume = 0.07;
    }
    else{
        musica.volume = 0.08;
    };
}

export function abaixarVolume(musicaAtual){
    musica.volume =0;
}

export function addMusic(musicaAtual){
    musica.src = (musicaAtual.musicPath)
    
    console.log(musica.src);
    musica.loop= true;
    

    const iniciarMusica = () => {
        musica.play()
            .then(() => {
                console.log("musica played");
            })
            .catch(err => {
                console.warn("musica error", err);
            });
        document.removeEventListener("click", iniciarMusica);
        document.removeEventListener("keydown", iniciarMusica);
    };

    document.addEventListener("click", iniciarMusica);
    document.addEventListener("keydown", iniciarMusica);


    alterarVolume(musicaAtual);
    
}

