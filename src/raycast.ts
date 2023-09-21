const TAU: number = 2 * Math.PI;

interface iVec2{ x: number; y: number; }

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

export class Ray{
    public x: number; public y: number;                 // coordinates
    public angle: number; public magnitude: number;     // angle and magnitude
    public cos: number; public sin: number;             // cos & sin for angle

    public xdir: number; public ydir: number;
    public xstep: number; public ystep: number;

    public side: boolean = false;

    constructor(x: number, y: number, angle: number, magnitude: number = Infinity){
        this.x = x; this.y = y;
        this.angle = angle; this.magnitude = magnitude;
        this.cos = Math.cos(angle); this.sin = Math.sin(angle);

        this.xdir = (this.cos <= 0) ? -1 : 1;
        this.ydir = (this.sin <= 0) ? -1 : 1;
        this.xstep = Math.sqrt(1 + Math.pow(this.sin / this.cos, 2));
        this.ystep = Math.sqrt(1 + Math.pow(this.cos / this.sin, 2));
    };

    public cast(tilemap: iTileMap): void{

        const mapcell = (x: number, y: number): number => {
            if(x < 0 || y < 0 || x >= tilemap.width || y >= tilemap.height)
                return -1;
            return tilemap.data[y][x] ?? -1;
        }

        // Snap the ray to the nearest map grid coordinates.
        let mappos: iVec2 = {
            x: clamp(Math.floor(this.x / tilemap.cellsize), 0, tilemap.width),
            y: clamp(Math.floor(this.y / tilemap.cellsize), 0, tilemap.height)
        }

        let offset: iVec2 = { x: Number(!(this.xdir < 0)), y: Number(!(this.ydir < 0))}

        let length: iVec2 = {
            x: Math.abs(this.x - (mappos.x + offset.x) * tilemap.cellsize) / tilemap.cellsize * this.xstep,
            y: Math.abs(this.y - (mappos.y + offset.y) * tilemap.cellsize) / tilemap.cellsize * this.ystep
        }

        let cell: number = mapcell(mappos.x, mappos.y);

        while(!cell){
            if(length.x < length.y){
                mappos.x += this.xdir;
                length.x += this.xstep;
                this.side = false;
            }
            else{
                mappos.y += this.ydir;
                length.y += this.ystep;
                this.side = true;
            }

            cell = mapcell(mappos.x, mappos.y);

            if(cell){
                //this.hit = cell;
                length = { x: length.x - this.xstep, y: length.y - this.ystep };
                this.magnitude = !this.side ? length.x : length.y;
                break;
            }
        }
    };
}

export function raycast(camera: iCamera, map: iTileMap, ctx: any){

    for(let x = 0; x < camera.width; x++){

        let a = x / camera.width - 0.5;
        let b = Math.atan2(a, camera.focus);
        let c = b;

        let ray = new Ray(camera.x, camera.y, camera.angle + c);
        ray.cast(map);
        
        let perpWallDist: number = ray.magnitude * Math.cos(b);

        if (perpWallDist === Infinity)
            continue;

        //Calculate height of line to draw on screen
        let lineHeight: number = Math.floor(camera.height / perpWallDist);

        //calculate lowest and highest pixel to fill in current stripe
        let line: iVec2 = {
            x: (-lineHeight / 2) + (camera.height / 2) + camera.zoom,
            y: (lineHeight / 2) + (camera.height / 2) + camera.zoom
        };

        //let wallX: number = ((ray.y / map.cellsize) + (ray.magnitude * (ray.side ? ray.cos : ray.sin))) % 1;

        ctx.strokeStyle = ray.side ? "#0000FF" : "#5555FF";

        ctx.beginPath();
        ctx.moveTo(x, line.x);
        ctx.lineTo(x, line.y);
        ctx.stroke();
    }

}