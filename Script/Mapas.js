const response = await fetch('matrizMap/TileSetPraia/tileSetPraia.tmj');
const tileSetPraia = await response.json();
const response2 = await fetch('matrizMap/TileSetSkate/tilesetSkate.tmj');
const tileSetSkate = await response2.json();
const response3 = await fetch('matrizMap/TileSetCeu/tileSetCeu.tmj');
const tileSetCeu = await response3.json();
const response4 = await fetch('matrizMap/TileSetMasmorra/tilesetMasmorra.tmj');
const tileSetMasmorra = await response4.json();


export function drawMap(ctx, mapaAtual,canvas){
    const background = new Image();
    background.src = mapaAtual.background;
    ctx.drawImage(background,0,0,canvas.width,canvas.height);
    const tilesetImage = new Image();
    tilesetImage.src = mapaAtual.tilesetPath;
    drawTiles(ctx, mapaAtual, 32, tilesetImage);
}

export const mapas = {
    Praia:{
        nome : "Areia Peluda",
        background : "./Sprites/Bosses/BossGustavoPraia/background/backgoudestatico.png",
        musicPath: "./Audio/Mapas/BossGustavo/audio_gustavo.mpeg",
        width: tileSetPraia.layers[0].width,
        height: tileSetPraia.layers[0].height,
        matriz: tileSetPraia.layers[0].data,
        tilesetPath: "./Sprites/Bosses/BossGustavoPraia/background/tileSetPraia.png",
        inimigosConfig: [
            { tipo: "BossPraia", x: 1600, dir: 1 },
            { tipo: "Inimigo", x: 1600, dir: 1 },
            { tipo: "Inimigo2", x: 2000, dir: 1 },
            { tipo: "Inimigo", x: 1200, dir: 1 },
            { tipo: "Inimigo", x: 3000, dir: 1 },
            { tipo: "Inimigo", x: -800, dir: 1 },
            { tipo: "Inimigo2", x: 2550, dir: 1 },
            { tipo: "Inimigo2", x: -1550, dir: 1 },
            { tipo: "Inimigo2", x: 3650, dir: 1 },
            { tipo: "Inimigo2", x: -3550, dir: 1 },
        ]
    },

    Masmorra:{
        nome : "Covil locado",
        background :  "./Sprites/Bosses/BossAlan/background/backgoroundEstatico.png",
        musicPath: "./Audio/Mapas/BossAlan/audio_alan.mpeg",
        width: tileSetMasmorra.layers[0].width,
        height: tileSetMasmorra.layers[0].height,
        matriz: tileSetMasmorra.layers[0].data,
        tilesetPath: "./Sprites/Bosses/BossAlan/background/tilesetMasmorra.png",
        inimigosConfig: [
            { tipo: "BossMasmorra", x: 1600, dir: 1 },
            // { tipo: "Inimigo", x: 1600, dir: 1 },
            // { tipo: "Inimigo2", x: -2000, dir: 1 },
            // { tipo: "Inimigo", x: 1200, dir: 1 },
            // { tipo: "Inimigo", x: 3000, dir: 1 },
            //{ tipo: "Inimigo", x: -800, dir: 1 },
            //{ tipo: "Inimigo2", x: 2550, dir: 1 }
            
        ]
    },

    Pista:{
        nome: "Parque guaxinildo",
        background: "./Sprites/Bosses/BossDavi/background/backgoundEstatico.png",
        musicPath: "./Audio/Mapas/BossDavi/audio_davi.mpeg",
        width: tileSetSkate.layers[0].width,
        height: tileSetSkate.layers[0].height,
        matriz: tileSetSkate.layers[0].data,
        tilesetPath: "./Sprites/Bosses/BossDavi/background/skateTiles.png",
        inimigosConfig: [
            { tipo: "BossPista", x: 1600, dir: 1 },
            // { tipo: "Inimigo", x: 2600, dir: 1 },
            // { tipo: "Inimigo2", x: 2300, dir: 1 },
            // { tipo: "Inimigo", x: 3500, dir: 1 },
            // { tipo: "Inimigo2", x: -4000, dir: 1 },
            // { tipo: "Inimigo", x: 3800, dir: 1 },
            // { tipo: "Inimigo", x: 1500, dir: 1 },
            // { tipo: "Inimigo2", x: 1900, dir: 1 },
            // { tipo: "Inimigo", x: -2080, dir: 1 },
            // { tipo: "Inimigo2", x: 1550, dir: 1 }
        ]
    },

    Ceu:{
        nome: "zona de cochilo",
        background: "./Sprites/Bosses/BossNayan/background/backgorundEstatico.png",
        musicPath: "./Audio/Mapas/BossNayan/audio_nayan.mpeg",
        width: tileSetCeu.layers[0].width,
        height: tileSetCeu.layers[0].height,
        matriz: tileSetCeu.layers[0].data,
        tilesetPath: "./Sprites/Bosses/BossNayan/background/tileSetCeu.png",
        inimigosConfig: [
            //{ tipo: "Inimigo", x: 600, dir: 1 },
            { tipo: "BossCeu", x: 1600, dir: 1},
            //{ tipo: "Inimigo", x: 1600, dir: 1 },
            //{ tipo: "Inimigo2", x: -2000, dir: 1 },
            //{ tipo: "Inimigo", x: 1200, dir: 1 },
            //{ tipo: "Inimigo", x: 3000, dir: 1 },
            //{ tipo: "Inimigo2", x: -800, dir: 1 },
            //{ tipo: "Inimigo2", x: 2550, dir: 1 },
            //{ tipo: "Inimigo2", x: -1000, dir: 1 },
            //{ tipo: "Inimigo2", x: 1800, dir: 1 },
        ]
    },

    DeathScreen:{
        nome: "Tela De Morte",
        background: "Sprites/Hud/youDied.png",
        musicPath: "./Audio/Mapas/TelaDeMorte/DeathSong.mp3",
        matriz:[]
    },


    WinScreen:{
        nome: "Tela De Morte",
        background: "./Sprites/Hud/telaVitoria.png",
        musicPath: "./Audio/Mapas/TelaVitoria/somVitoria.mp3",
        matriz:[],
        inimigosConfig: [],
    }
};



export function drawTiles(ctx, mapaAtual, tileSize, tilesetImage) {
    const matriz = mapaAtual.matriz;
    const mapWidth = mapaAtual.width; // em tiles
    const mapHeight = mapaAtual.height; // em tiles

    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            const tileIndex = matriz[y * mapWidth + x]; // 1D -> 2D
            if (tileIndex === 0) continue; // 0 = vazio

            // calcula a posição do tile no tileset
            const tsCols = tilesetImage.width / tileSize;
            const sx = ((tileIndex - 1) % tsCols) * tileSize;
            const sy = Math.floor((tileIndex - 1) / tsCols) * tileSize;

            ctx.drawImage(
                tilesetImage,
                sx, sy, tileSize, tileSize,
                x * tileSize, y * tileSize, tileSize, tileSize
            );
        }
    }
}

export function gerarPlataformas(mapaAtual, tileSize) {
    const plataformas = [];
    const matriz = mapaAtual.matriz;
    const mapWidth = mapaAtual.width;
    const mapHeight = mapaAtual.height;
    const margem = 18;
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            const tileIndex = matriz[y * mapWidth + x];
            if (tileIndex !== 0) {
                plataformas.push({
                    x: x * tileSize+margem,
                    y: y * tileSize,
                    w: tileSize-margem*2,
                    h: tileSize
                });
            }
        }
    }

    return plataformas;
}

