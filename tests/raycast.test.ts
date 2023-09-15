import { expect, test } from "bun:test";
import { Ray } from "../src/raycast";

const tmap = {
    "w": 10, "h": 10, "c" : 16,
    "data":[
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
};

const v = -3.14;

test("Ray._constructor()", (): void => {
    let r = new Ray(v, v, v, v);

    expect(r.x).toBe(v);
    expect(r.y).toBe(v);
    expect(r.a).toBe(v);
    expect(r.m).toBe(v);
    expect(r.cos).toBe(Math.cos(v));
    expect(r.sin).toBe(Math.sin(v));

    r.cast(tmap);
});

test("Ray.cast() speed test", (): void => {
    let r = new Ray(20, 20, v);
    [1, 10, 100, 1000, 10000, 1000000, 10000000].forEach((n) => {
        const start = Date.now();
        for(let i: number = 0; i < n; i++)
            r.cast(tmap);
        console.log(n + ": " + (Date.now() - start) + "ms");
    });
});