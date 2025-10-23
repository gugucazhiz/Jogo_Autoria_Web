import {mapas} from "./Mapas.js";

export function playTiro(){
            const tiro = new Audio("./Audio/Player/tiro_Sound.mpeg");
            tiro.volume = 1;
            tiro.play();
        }

export function addMusic(musicaAtual){
    const music = new Audio(musicaAtual.musicPath)
    music.loop = true;
    if(musicaAtual === mapas.Praia || musicaAtual === mapas.Masmorra){
        music.volume = 0.08;
    }
    else{
        music.volume = 0.1;
    }
    ;
    console.log(musicaAtual.musicPath);

    const iniciarMusica = () => {
        music.play()
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
}