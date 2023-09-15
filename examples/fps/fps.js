import { bindKey, handleInput } from "./modules/input.mjs";
import { Ray } from "./../dist/raycast.js";

let canvas, context;

const tmap = {
    "w": 10, "h": 10, "c": 16,
    "data":[
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
};

function drawMap2D(tilemap){
    for(let y = 0; y < tilemap.h; y++){
        for(let x = 0; x < tilemap.w; x++){
            context.fillStyle = "#ffffff00";
            const cell = tilemap.data[y][x];
            if(cell != 0)
                context.fillStyle = "#ff0000ff";
            context.fillRect(x * tilemap.c, y * tilemap.c, tilemap.c, tilemap.c);
        }
    }
}

let player = { x: 100, y: 100, a: 0, speed: 3, torque: 0.1 };

function init(){
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    context.imageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;

    bindKey('w', () => { player.x += Math.cos(player.a) * player.speed; player.y += Math.sin(player.a) * player.speed; });
    bindKey('s', () => { player.x -= Math.cos(player.a) * player.speed; player.y -= Math.sin(player.a) * player.speed; });
    bindKey('d', () => { player.a += player.torque; });
    bindKey('a', () => { player.a -= player.torque; });
}

function draw2D(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawMap2D(tmap);

    context.lineWidth = 1;
	context.strokeStyle = "#0f0";

    context.beginPath();
    context.arc(player.x, player.y, 5, 0, 2 * Math.PI);
    context.stroke();

    let r = new Ray(player.x, player.y, player.a);
    r.cast(tmap);

    context.strokeStyle = "#00f";

    context.beginPath();
    context.moveTo(r.x, r.y);
    context.lineTo(r.x + Math.cos(r.a) * r.m, r.y + Math.sin(r.a) * r.m);
    context.stroke();
}

function update(){
    handleInput();
    draw2D();

    requestAnimationFrame(update);
}

function main(){
    init();
    requestAnimationFrame(update);
}

// Call the main function once the documented has loaded.
document.addEventListener('readystatechange', e => {
	if(document.readyState === "complete"){ main(); }
});