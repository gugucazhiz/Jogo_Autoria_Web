let canvas = document.getElementById("tela");
let ctx = canvas.getContext("2d");

const imagem = new Image();
imagem.src = "character.png";

//ctx.drawImage(imagem, 0, 0);

/*
imagem.onload = function() {
	ctx.drawImage(imagem, 0, 0);
};
*/

const largura = 34;
const altura = 36;

imagem.onload = function () {
  ctx.drawImage(imagem, 0, 0, largura, altura, 0, 0, largura, altura);
};

let estado = 0;
let walkx = 150;
let walky = 0;

let direcao = 0;

function draw() {
  ctx.clearRect(0, 0, 300, 300);
  ctx.drawImage(
    imagem,
    estado * largura,
    0,
    largura,
    altura,
    walkx,
    walky,
    largura,
    altura
  );

  estado++;
  if (estado == 4) {
    estado = 0;
  }
}

function draw2() {
  ctx.clearRect(0, 0, 300, 300);
  ctx.drawImage(
    imagem,
    estado * (largura-2),
    direcao * altura,
    largura,
    altura,
    walkx,
    walky,
    largura,
    altura
  );
  if (direcao == 0) walky += 2;
  if (direcao == 1) walkx += 2;
  if (direcao == 2) walky -= 2;
  if (direcao == 3) walkx -= 2;
  estado++;
  if (estado == 4) {
    estado = 0;
  }
}

let rungame = setInterval(draw2, 100);

document.addEventListener("keydown", movement);

function movement(event) {
  if (event.keyCode == 37) {
    //right
    direcao = 3;
  } else if (event.keyCode == 38) {
    //down
    direcao = 2;
  } else if (event.keyCode == 39) {
    //left
    direcao = 1;
  } else if (event.keyCode == 40) {
    //up
    direcao = 0;
  }
}
context.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);

/*
img	Specifies the image, canvas, or video element to use	 
sx	Optional. The x coordinate where to start clipping	
sy	Optional. The y coordinate where to start clipping	
swidth	Optional. The width of the clipped image	
sheight	Optional. The height of the clipped image	
x	The x coordinate where to place the image on the canvas	
y	The y coordinate where to place the image on the canvas	
width	Optional. The width of the image to use (stretch or reduce the image)	
height	Optional. The height of the image to use (stretch or reduce the image)
*/
