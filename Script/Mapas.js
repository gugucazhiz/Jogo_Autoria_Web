

export function drawMap(ctx, mapaAtual){
    const background = new Image();
    background.src = mapaAtual.background;
    ctx.drawImage(background,0,0,1500,1000);
}

export const mapas ={
    Praia:{
        nome : "Areia Peluda",
        background : "./Sprites/Bosses/Bossgustavo/background/backgoudestatico.png"
    }
};