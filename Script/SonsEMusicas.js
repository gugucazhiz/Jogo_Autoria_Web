import {mapas} from "./Mapas.js";

const musics = [];
let index =0;
export function playTiro(){
            const tiro = new Audio("./Audio/Player/tiro_Sound.mpeg");
            tiro.volume = 0.3;
            tiro.play();
        }

export function addMusic(musicaAtual){

    //verificar se ja tem musica tocando
    musics.push(new Audio(musicaAtual.musicPath))
    musics[index].loop = true;
    if(musicaAtual === mapas.Praia || musicaAtual === mapas.Masmorra){
        musics[index].volume = 0.07;
    }
    else{
        musics[index].volume = 0.08;
    }
    ;
    console.log(musicaAtual.musicPath);

    const iniciarMusica = () => {
        musics[musics.length - 1].play()
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

    index ++;
}