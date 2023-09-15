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

test("Ray._constructor()", (): void => {
    const v = -3.14;
    let r = new Ray(v, v, v, v);

    expect(r.x).toBe(v);
    expect(r.y).toBe(v);
    expect(r.a).toBe(v);
    expect(r.m).toBe(v);
    expect(r.cos).toBe(Math.cos(v));
    expect(r.sin).toBe(Math.sin(v));

    r.cast(tmap);
});