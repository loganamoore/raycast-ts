import { bindKey, handleInput } from "./modules/input.mjs";
import { Ray, raycast } from "./../dist/raycast.js";

let canvas, context;

const tmap = {
    "width": 10, "height": 10, "cellsize": 16,
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
    for(let y = 0; y < tilemap.height; y++){
        for(let x = 0; x < tilemap.width; x++){
            context.fillStyle = "#ffffff00";
            const cell = tilemap.data[y][x];
            if(cell != 0)
                context.fillStyle = "#ff0000ff";
            context.fillRect(x * tilemap.cellsize, y * tilemap.cellsize, tilemap.cellsize, tilemap.cellsize);
        }
    }
}

let player = { x: 100, y: 100, a: 0, speed: 1, torque: 0.01 };

function init(){
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    context.imageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    
    resize();

    bindKey('w', () => { player.x += Math.cos(player.a) * player.speed; player.y += Math.sin(player.a) * player.speed; });
    bindKey('s', () => { player.x -= Math.cos(player.a) * player.speed; player.y -= Math.sin(player.a) * player.speed; });
    bindKey('d', () => { player.a += player.torque; });
    bindKey('a', () => { player.a -= player.torque; });
}

function draw2D(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    let camera = {
        x: player.x,
        y: player.y,
        angle: player.a,
        focus: 0.8,
        zoom: 0,
        width: canvas.width,
        height: canvas.height
    };

    raycast(camera, tmap, context);

    drawMap2D(tmap);

    context.lineWidth = 1;
	context.strokeStyle = "#0f0";

    context.beginPath();
    context.arc(player.x, player.y, 5, 0, 2 * Math.PI);
    context.stroke();

    let r = new Ray(player.x, player.y, player.a);
    r.cast(tmap);

    // Multiply the distance scalar by the unit cell size
    r.magnitude *= tmap.cellsize;

    context.strokeStyle = "#00f";

    context.beginPath();
    context.moveTo(r.x, r.y);
    context.lineTo(r.x + Math.cos(r.angle) * r.magnitude, r.y + Math.sin(r.angle) * r.magnitude);
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

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Call the main function once the documented has loaded.
document.addEventListener('readystatechange', e => {
	if(document.readyState === "complete"){ main(); }
});

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resize, false);