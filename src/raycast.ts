const TAU: number = 2 * Math.PI;

interface iTileMap{
    w: number; h: number;       // width and height of map (in cells)
    c: number;                  // the size of each cell in pixels, (cs*cs)
    data: number[][];           // cell values
}

interface iVec2{ x: number; y: number; }

const clamp = (num: number, min: number, max:number):number => {
	return Math.min(Math.max(num, min), max);
};

export class Ray{
    public x: number; public y: number;     // coordinates
    public a: number; public m: number;     // angle and magnitude
    public cos: number; public sin: number; // cos & sin for angle

    public xdir: number; public ydir: number;
    public xstep: number; public ystep: number;

    constructor(x: number, y: number, angle: number, magnitude: number = Infinity){
        this.x = x; this.y = y;
        this.a = angle; this.m = magnitude;
        this.cos = Math.cos(angle); this.sin = Math.sin(angle);

        this.xdir = (this.cos <= 0) ? -1 : 1;
        this.ydir = (this.sin <= 0) ? -1 : 1;
        this.xstep = Math.sqrt(1 + Math.pow(this.sin / this.cos, 2));
        this.ystep = Math.sqrt(1 + Math.pow(this.cos / this.sin, 2));
    };

    public cast(tilemap: iTileMap): void{

        const mapcell = (x: number, y: number): number => {
            if(x < 0 || y < 0 || x >= tilemap.w || y >= tilemap.h)
                return -1;
            return tilemap.data[y][x] ?? -1;
        }

        // Snap the ray to the nearest map grid coordinates.
        let mappos: iVec2 = {
            x: clamp(Math.floor(this.x / tilemap.c), 0, tilemap.w),
            y: clamp(Math.floor(this.y / tilemap.c), 0, tilemap.h)
        }

        let offset: iVec2 = { x: Number(!(this.xdir < 0)), y: Number(!(this.ydir < 0))}

        let length: iVec2 = {
            x: Math.abs(this.x - (mappos.x + offset.x) * tilemap.c) / tilemap.c * this.xstep,
            y: Math.abs(this.y - (mappos.y + offset.y) * tilemap.c) / tilemap.c * this.ystep
        }

        let cell: number = mapcell(mappos.x, mappos.y);
        let side: boolean = false;

        while(!cell){
            if(length.x < length.y){
                mappos.x += this.xdir;
                length.x += this.xstep;
                side = false;
            }
            else{
                mappos.y += this.ydir;
                length.y += this.ystep;
                side = true;
            }

            cell = mapcell(mappos.x, mappos.y);

            if(cell){
                //this.hit = cell;
                length = { x: length.x - this.xstep, y: length.y - this.ystep };
                this.m = (!side) ? length.x : length.y;
                break;
            }
        }
    };
}
