const TAU: number = 2 * Math.PI;    // 360 degrees

interface iTileMap{
    width: number; height: number;       // width and height of map (in cells)
    cellsize: number;                    // the size of each cell in pixels, (cs*cs)
    data: number[][];                    // cell values
}

interface iCamera{
    x: number; y: number;               // x and y position
    angle: number;                      // angle facing (radians) 
    focus: number;                      // focus length (0.8)
    zoom: number;                       // zoom
    width: number; height: number;      // width and height of resolution
}

const clamp = (num: number, min: number, max:number):number => {
	return Math.min(Math.max(num, min), max);
};

const mapcell = (x: number, y: number, tilemap: iTileMap): number => {
    if(x < 0 || y < 0 || x >= tilemap.width || y >= tilemap.height)
        return -1;
    return tilemap.data[y][x] ?? -1;
}

interface iRay{
    x: number; y: number;                 // coordinates
    angle: number; length: number;        // angle and magnitude
    cos: number; sin: number;             // cos & sin for angle

    xdir: number; ydir: number;
    xstep: number, ystep: number;

    side: boolean; hit: number;
}

export function raycast(tilemap: iTileMap, x: number, y: number, angle: number, length: number = Infinity): iRay{
    let cos: number = Math.cos(angle);
    let sin: number = Math.sin(angle);

    let xdir: number = (cos <= 0) ? -1 : 1;
    let ydir: number = (sin <= 0) ? -1 : 1;

    let xstep: number = Math.sqrt(1 + Math.pow(sin / cos, 2));
    let ystep: number = Math.sqrt(1 + Math.pow(cos / sin, 2));

    let side: boolean = false;

    // Snap the ray to the nearest map grid coordinates.
    let xmappos = clamp(Math.floor(x / tilemap.cellsize), 0, tilemap.width);
    let ymappos = clamp(Math.floor(y / tilemap.cellsize), 0, tilemap.height);

    let xoffset = Number(!(xdir < 0));
    let yoffset = Number(!(ydir < 0));

    let xdist = Math.abs(x - (xmappos + xoffset) * tilemap.cellsize) / tilemap.cellsize * xstep;
    let ydist = Math.abs(y - (ymappos + yoffset) * tilemap.cellsize) / tilemap.cellsize * ystep;

    let cell: number = mapcell(xmappos, ymappos, tilemap);

    while(!cell){
        if(xdist < ydist){
            xmappos += xdir;
            xdist += xstep;
            side = false;
        }
        else{
            ymappos += ydir;
            ydist += ystep;
            side = true;
        }

        cell = mapcell(xmappos, ymappos, tilemap);

        if(cell){
            length = !side ? xdist - xstep : ydist = ystep;
            break;
        }
    }

    return {
        x: x, y: y,
        angle: angle, length: length,
        cos: cos, sin: sin,
        xdir: xdir, ydir: ydir,
        xstep: xstep, ystep: ystep,
        side: side, hit: cell
    } as iRay;
};

export function raycast3D(camera: iCamera, map: iTileMap, ctx: any): Array<iRay>{

    let results: Array<iRay> = [];

    for(let x = 0; x < camera.width; x++){

        let a = x / camera.width - 0.5;
        let b = Math.atan2(a, camera.focus);
        let c = b;

        let ray = raycast(map, camera.x, camera.y, camera.angle + c);
        
        let perpWallDist: number = ray.length * Math.cos(b);

        if (perpWallDist === Infinity)
            continue;

        //Calculate height of line to draw on screen
        let lineHeight: number = Math.floor(camera.height / perpWallDist);

        //calculate lowest and highest pixel to fill in current stripe

        let yStart = (-lineHeight / 2) + (camera.height / 2) + camera.zoom;
        let yEnd = (lineHeight / 2) + (camera.height / 2) + camera.zoom;

        ctx.strokeStyle = ray.side ? "#0000FF" : "#5555FF";

        ctx.beginPath();
        ctx.moveTo(x, yStart);
        ctx.lineTo(x, yEnd);
        ctx.stroke();
    }

    return results;

}