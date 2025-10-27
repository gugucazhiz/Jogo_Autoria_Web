const response = await fetch('matrizMap/TileSetPraia/tileSetPraia.tmj');
const tileSetPraia = await response.json();


export function drawMap(ctx, mapaAtual,canvas){
    const background = new Image();
    background.src = mapaAtual.background;
    ctx.drawImage(background,0,0,canvas.width,canvas.height);
    const tilesetImage = new Image();
    tilesetImage.src = mapaAtual.tilesetPath;
    drawTiles(ctx, mapaAtual, 32, tilesetImage);
}

export const mapas ={
    Praia:{
        nome : "Areia Peluda",
        background : "./Sprites/Bosses/BossGustavo/background/backgoudEstatico.png",
        musicPath: "./Audio/Mapas/BossGustavo/audio_gustavo.mpeg",
        width: tileSetPraia.layers[0].width,
        height: tileSetPraia.layers[0].height,
        matriz: tileSetPraia.layers[0].data,
        tilesetPath: "./Sprites/Bosses/BossGustavo/background/TilesetPraia.png",
        inimigosConfig: [
            { tipo: "Inimigo", x: 600, dir: 1 },
            //{ tipo: "Inimigo2", x: 700, dir: 1 },
            //{ tipo: "Inimigo", x: 800, dir: 1 },
            //{ tipo: "Inimigo", x: 1000, dir: 1 },
            //{ tipo: "Inimigo", x: -600, dir: 1 },
            //{ tipo: "Inimigo2", x: 1350, dir: 1 }
        ]
    },

    Masmorra:{
        nome : "Covil locado",
        background :  "./Sprites/Bosses/BossAlan/background/backgoroundEstatico.png",
        musicPath: "./Audio/Mapas/BossAlan/audio_alan.mpeg",
        inimigosConfig: [
            { tipo: "Inimigo", x: 600, dir: 1 },
        ]
    },

    Pista:{
        nome: "Parque guaxinildo",
        background: "./Sprites/Bosses/BossDavi/background/backgoundEstatico.png",
        musicPath: "./Audio/Mapas/BossDavi/audio_davi.mpeg",
        width: tileSetPraia.layers[0].width,
        height: tileSetPraia.layers[0].height,
        matriz: tileSetPraia.layers[0].data,
        tilesetPath: "./Sprites/Bosses/BossGustavo/background/TilesetPraia.png",
        inimigosConfig: [
            { tipo: "Inimigo", x: 600, dir: 1 },
        ]
    },

    Ceu:{
        nome: "zona de cochilo",
        background: "./Sprites/Bosses/BossNayan/background/backgorundEstatico.png",
        musicPath: "./Audio/Mapas/BossNayan/audio_nayan.mpeg",
        inimigosConfig: [
            { tipo: "Inimigo", x: 600, dir: 1 },
        ]
    },

    DeathScreen:{
        nome: "Tela De Morte",
        background: "Sprites/Hud/youDied.png",
        musicPath: "./Audio/Mapas/TelaDeMorte/DeathSong.mp3",
        matriz:[]
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

    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            const tileIndex = matriz[y * mapWidth + x];
            if (tileIndex !== 0) {
                plataformas.push({
                    x: x * tileSize,
                    y: y * tileSize,
                    w: tileSize,
                    h: tileSize
                });
            }
        }
    }

    return plataformas;
}

