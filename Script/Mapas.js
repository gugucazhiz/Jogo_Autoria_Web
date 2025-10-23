

export function drawMap(ctx, mapaAtual,canvas){
    const background = new Image();
    background.src = mapaAtual.background;
    ctx.drawImage(background,0,0,canvas.width,canvas.height);
}

export const mapas ={
    Praia:{
        nome : "Areia Peluda",
        background : "./Sprites/Bosses/BossGustavo/background/backgoudEstatico.png",
        musicPath: "./Audio/Mapas/BossGustavo/audio_gustavo.mpeg"
    },

    Masmorra:{
        nome : "Covil locado",
        background :  "./Sprites/Bosses/BossAlan/background/backgoroundEstatico.png",
        musicPath: "./Audio/Mapas/BossAlan/audio_alan.mpeg"
    },

    Pista:{
        nome: "Parque guaxinildo",
        background: "./Sprites/Bosses/BossDavi/background/backgoundEstatico.png",
        musicPath: "./Audio/Mapas/BossDavi/audio_davi.mpeg"
    },

    Ceu:{
        nome: "zona de cochilo",
        background: "./Sprites/Bosses/BossNayan/background/backgorundEstatico.png",
        musicPath: "./Audio/Mapas/BossNayan/audio_nayan.mpeg"
    }


};