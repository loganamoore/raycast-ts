import { expect, test } from "bun:test";
import { raycast } from "../src/raycast";

interface iTileMap{
    width: number; height: number;
    cellsize: number;
    data: number[][];
}

const emptymap = (w: number, h: number, c: number): iTileMap => {
    let m = {width: w, height: h, cellsize: c, data: Array.from(Array(h), _ => Array(w).fill(0))};

    m.data[0].fill(1);
    m.data[h-1].fill(1);

    for(let y: number = 1; y < h - 1; y++){
        m.data[y][0] = 1;
        m.data[y][w - 1] = 1;
    }

    return m;
}

const v = 3.14;

test("Ray.cast() speed test", (): void => {

    const tmap = emptymap(10, 10, 16);
    
    const start = Date.now();
    let i: number = 0;

    while(Date.now() - start < 1000){
        let r = raycast(tmap, 20, 20, v);
        i++;
    }

    console.log(i + " raycast() in " + (Date.now() - start) + "ms");

});