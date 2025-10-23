

export function drawMap(ctx, mapaAtual,canvas){
    const background = new Image();
    background.src = mapaAtual.background;
    ctx.drawImage(background,0,0,canvas.width,canvas.height);
}

export const mapas ={
    Praia:{
        nome : "Areia Peluda",
        background : "./Sprites/Bosses/BossGustavo/background/backgoudEstatico.png",
        musicPath: "./Sprites/Bosses/BossGustavo/audio_gustavo.mpeg"
    },

    Masmorra:{
        nome : "Covil locado",
        background :  "./Sprites/Bosses/BossAlan/background/backgoroundEstatico.png",
        musicPath: "./Sprites/Bosses/BossAlan/audio_alan.mpeg"
    },

    Pista:{
        nome: "Parque guaxinildo",
        background: "./Sprites/Bosses/BossDavi/background/backgoundEstatico.png",
        musicPath: "./Sprites/Bosses/BossDavi/audio_davi.mpeg"
    },

    Ceu:{
        nome: "zona de cochilo",
        background: "./Sprites/Bosses/BossNayan/background/backgorundEstatico.png",
        musicPath: "./Sprites/Bosses/BossNayan/audio_nayan.mpeg"
    }


};

export function addMusic(musicaAtual){
    const music = new Audio(musicaAtual.musicPath)
    music.loop = true;
    if(musicaAtual === mapas.Praia || musicaAtual === mapas.Masmorra){
        music.volume = 0.08;
    }
    else{
        music.volume = 0.15;
    }
    ;
    console.log(musicaAtual.musicPath);
    music.play();
}