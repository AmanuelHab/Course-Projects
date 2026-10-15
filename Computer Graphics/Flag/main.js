const ethCanvas = document.getElementById("eth-flag");
const gerCanvas = document.getElementById("ger-flag");
const ngrCanvas = document.getElementById("ngr-flag");
const fraCanvas = document.getElementById("fra-flag");
const jpnCanvas = document.getElementById("jpn-flag");
const bngCanvas = document.getElementById("bng-flag");

const ethCtx = ethCanvas.getContext("2d");
const gerCtx = gerCanvas.getContext("2d");
const ngrCtx = ngrCanvas.getContext("2d");
const fraCtx = fraCanvas.getContext("2d");
const jpnCtx = jpnCanvas.getContext("2d");
const bngCtx = bngCanvas.getContext("2d");


function paintPixel(x,y, r, g, b, image){
    const index = (y * image.width + x) * 4;
    
    image.data[index] = r;
    image.data[index + 1] = g;
    image.data[index + 2] = b;
    image.data[index + 3] = 255;
}
function paintRectangle(x, y, width, height, r, g, b, image, ctx){
    for (let i = 0; i < width; i++){
        for (let j = 0; j < height; j++ ){
            paintPixel(x + i, y + j, r, g, b, image);
        }
    }
    ctx.putImageData(image, 0, 0);
}
async function paintRectangleSlow(x, y, width, height, r, g, b, image, ctx){
    const batchSize = 8;
    for (let i = 0; i < width; i++){
        for (let j = 0; j < height; j++ ){
            paintPixel(x + i, y + j, r, g, b, image);
        }
        if (i % batchSize === 0){
            ctx.putImageData(image, 0, 0);
            await delay(100);
        }
    }
    ctx.putImageData(image, 0, 0);
}
function paintCircle(xc, yc, radius, r, g, b, image){
    function plotSymmetry(cx, cy, r, g, b, image){
        paintPixel(cx + x, cy + y, r, g, b, image);
        paintPixel(cx + x, cy - y, r, g, b, image);
        paintPixel(cx - x, cy + y, r, g, b, image);
        paintPixel(cx - x, cy - y, r, g, b, image);

        paintPixel(cx + y, cy + x, r, g, b, image);
        paintPixel(cx + y, cy - x, r, g, b, image);
        paintPixel(cx - y, cy + x, r, g, b, image);
        paintPixel(cx - y, cy - x, r, g, b, image);
    }
    let x = 0;
    let y = radius;
    let p = 1 - radius;

    while (x <= y){
        plotSymmetry(xc,yc, r, g, b, image);
        if (p < 0){
            p += 2* x + 1
        }else{
            p += 2 *(x - y) + 1
            y -= 1
        }
        x += 1
    }
}
async function drawEthiopianFlag(ctx){
    const image = ctx.createImageData(640, 300);
    
    paintRectangle(0,0, 640, 300, 0, 0, 0, image, ctx);
    await paintRectangleSlow(1,1, 638, 99, 0, 200, 0, image, ctx);
    await paintRectangleSlow(1,100, 638, 100, 255, 255, 0, image, ctx);
    await paintRectangleSlow(1,200, 638, 99, 255, 0, 0, image, ctx);
    paintCircle(300, 150, 100, 50, 75, 255, image, ctx);
    ctx.putImageData(image, 0,0);
}

async function drawGermanyFlag(ctx){
    const image = ctx.createImageData(640, 300);

    paintRectangle(0, 0, 640, 100, 0, 0, 0, image, ctx);
    await paintRectangleSlow(0, 100, 640, 100, 255, 0, 0, image, ctx);
    await paintRectangleSlow(0, 200, 640, 100, 255, 200, 50, image, ctx);
    ctx.putImageData(image, 0,0);
}

async function drawNigeriaFlag(ctx){
    const image = ctx.createImageData(640, 400);
    
    paintRectangle(0,0, 640, 300, 0, 0, 0, image, ctx);
    await paintRectangleSlow(1, 1, 638, 99, 20, 100, 20, image, ctx);
    await paintRectangleSlow(1, 100, 638, 99, 220, 250, 250, image, ctx);
    await paintRectangleSlow(1, 200, 638, 99, 20, 100, 20, image, ctx);
    ctx.putImageData(image, 0, 0);
}

async function drawFranceFlag(ctx){
    const image = ctx.createImageData(600, 480);
    
    paintRectangle(0,0, 500, 350, 0, 0, 0, image, ctx);
    await paintRectangleSlow(1,1, 169, 348, 10, 0, 255, image, ctx);
    await paintRectangleSlow(170,1, 160, 348, 255, 255, 255, image, ctx);
    await paintRectangleSlow(330,1, 169, 348, 255, 25, 5, image, ctx);
    
    ctx.putImageData(image, 0, 0);
}

async function drawJapanFlag(ctx){
    const image = ctx.createImageData(640, 300);
    
    paintRectangle(0,0, 640, 300, 0, 0, 0, image, ctx);
    await paintRectangleSlow(1,1, 638, 298, 255, 255, 255, image, ctx);
    paintCircle(300, 150, 100, 255, 0, 0, image);
    
    ctx.putImageData(image, 0, 0);
}

async function drawBangladeshFlag(ctx){
    const image = ctx.createImageData(640, 300);

    paintRectangle(0,0, 640, 300, 0, 0, 0, image, ctx);
    await paintRectangleSlow(1,1, 638, 298, 50, 100, 50, image, ctx);
    paintCircle(250, 150, 100, 255, 0, 0, image);
    ctx.putImageData(image, 0, 0);
}

function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

drawEthiopianFlag(ethCtx);
drawGermanyFlag(gerCtx);
drawNigeriaFlag(ngrCtx);
drawFranceFlag(fraCtx);
drawJapanFlag(jpnCtx);
drawBangladeshFlag(bngCtx);