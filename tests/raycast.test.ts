import { expect, test } from "bun:test";
import { Ray } from "../src/raycast";

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

test("Ray._constructor()", (): void => {
    const tmap = emptymap(1000, 1000, 16);

    let r = new Ray(v, v, v, v);

    expect(r.x).toBe(v);
    expect(r.y).toBe(v);
    expect(r.angle).toBe(v);
    expect(r.magnitude).toBe(v);
    expect(r.cos).toBe(Math.cos(v));
    expect(r.sin).toBe(Math.sin(v));

    r.cast(tmap);
});

test("Ray.cast() speed test", (): void => {

    const tmap = emptymap(10, 10, 16);

    let r = new Ray(20, 20, v);
    
    [1, 10, 100, 1000, 10000, 1000000, 10000000].forEach((n) => {
        const start = Date.now();
        for(let i: number = 0; i < n; i++)
            r.cast(tmap);
        console.log(n + ": " + (Date.now() - start) + "ms");
    });

    const start = Date.now();
    let i: number = 0;

    while(Date.now() - start < 1000){
        r.cast(tmap);
        i++;
    }

    console.log(i + " Ray.cast() in " + (Date.now() - start) + "ms");

});