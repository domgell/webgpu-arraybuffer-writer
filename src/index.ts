import {assert, fail, isArray, isTypedArrayNonBigInt, TypedArrayNonBigInt} from "@domgell/ts-util";

/**
 * Write data to an `ArrayBuffer` with WGSL/WebGPU alignment
 */
export interface ArrayBufferWriter {
    /**
     * Current byte offset to write at
     */
    byteOffset: number,
    /**
     * Current maximum byte alignment to write with
     */
    byteAlignment: number,
    /**
     * The `ArrayBuffer` instance to write into
     */
    arrayBuffer: ArrayBuffer,
    /**
     * Update the alignment to write with
     * @param bytes
     */
    align(bytes: number): ArrayBufferWriter,
    /**
     * Set `byteOffset` = 0 and `byteAlignment` = 1
     */
    reset(): ArrayBufferWriter,
    /**
     * Add `bytes` to `byteOffset`
     * @param bytes
     */
    skip(bytes: number): ArrayBufferWriter,
    /**
     * Write a `u32` value.
     * @param value
     */
    u32(value: number): ArrayBufferWriter,
    /**
     * Write a `f32` value.
     * @param value
     */
    f32(value: number): ArrayBufferWriter,
    /**
     * Write a `i32` value.
     * @param value
     */
    i32(value: number): ArrayBufferWriter,
    /**
     * Write a `f16` value.
     * @param value
     */
    f16(value: number): ArrayBufferWriter,
    /**
     * Write a `vec2f` from individual `x, y` components.
     * @param x
     * @param y
     * @param alignment - Default 8 (as in WGSL)
     */
    vec2f(x: number, y: number, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec2f` from an object `{x, y}`.
     * @param v
     * @param alignment - Default 8 (as in WGSL)
     */
    vec2f(v: { x: number, y: number }, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec2f` from an array of at least 2 number elements.
     * @param v
     * @param alignment - Default 8 (as in WGSL)
     */
    vec2f(v: Float32Array | number[], alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec3f` from individual `x, y, z` components.
     * @param x
     * @param y
     * @param z
     * @param alignment - Default 16 (as in WGSL)
     */
    vec3f(x: number, y: number, z: number, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec3f` from an object `{x, y, z}`.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec3f(v: { x: number, y: number, z: number }, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec3f` from an array of at least 3 number elements.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec3f(v: Float32Array | number[], alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec4f` from individual `x, y, z, w` components.
     * @param x
     * @param y
     * @param z
     * @param w
     * @param alignment - Default 16 (as in WGSL)
     */
    vec4f(x: number, y: number, z: number, w: number, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec4f` from an object `{x, y, z, w}`.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec4f(v: { x: number, y: number, z: number, w: number }, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec4f` from an array of at least 4 number elements.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec4f(v: Float32Array | number[], alignment?: number): ArrayBufferWriter,
    /**
     * Write a `mat4x4f` from an array of at least 16 number elements.
     * @param m
     * @param alignment - Default 16 (as in WGSL)
     */
    mat4x4f(m: Float32Array | number[], alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec2h` from individual `x, y` components.
     * @param x
     * @param y
     * @param alignment - Default 4 (as in WGSL)
     */
    vec2h(x: number, y: number, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec2h` from an object `{x, y}`.
     * @param v
     * @param alignment - Default 4 (as in WGSL)
     */
    vec2h(v: { x: number, y: number }, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec2h` from an array of at least 2 number elements.
     * @param v
     * @param alignment - Default 4 (as in WGSL)
     */
    vec2h(v: Float32Array | number[], alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec3h` from individual `x, y, z` components.
     * @param x
     * @param y
     * @param z
     * @param alignment - Default 8 (as in WGSL)
     */
    vec3h(x: number, y: number, z: number, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec3h` from an object `{x, y, z}`.
     * @param v
     * @param alignment - Default 8 (as in WGSL)
     */
    vec3h(v: { x: number, y: number, z: number }, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec3h` from an array of at least 3 number elements.
     * @param v
     * @param alignment - Default 8 (as in WGSL)
     */
    vec3h(v: Float32Array | number[], alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec4h` from individual `x, y, z, w` components.
     * @param x
     * @param y
     * @param z
     * @param w
     * @param alignment - Default 8 (as in WGSL)
     */
    vec4h(x: number, y: number, z: number, w: number, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec4h` from an object `{x, y, z, w}`.
     * @param v
     * @param alignment - Default 8 (as in WGSL)
     */
    vec4h(v: { x: number, y: number, z: number, w: number }, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec2u` from individual `x, y` components.
     * @param x
     * @param y
     * @param alignment - Default 8 (as in WGSL)
     */
    vec2u(x: number, y: number, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec2u` from an object `{x, y}`.
     * @param v
     * @param alignment - Default 8 (as in WGSL)
     */
    vec2u(v: { x: number, y: number }, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec2u` from an array of at least 2 number elements.
     * @param v
     * @param alignment - Default 8 (as in WGSL)
     */
    vec2u(v: Uint32Array | number[], alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec3u` from individual `x, y, z` components.
     * @param x
     * @param y
     * @param z
     * @param alignment - Default 16 (as in WGSL)
     */
    vec3u(x: number, y: number, z: number, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec3u` from an object `{x, y, z}`.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec3u(v: { x: number, y: number, z: number }, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec3u` from an array of at least 3 number elements.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec3u(v: Uint32Array | number[], alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec4u` from individual `x, y, z, w` components.
     * @param x
     * @param y
     * @param z
     * @param w
     * @param alignment - Default 16 (as in WGSL)
     */
    vec4u(x: number, y: number, z: number, w: number, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec4u` from an object `{x, y, z, w}`.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec4u(v: { x: number, y: number, z: number, w: number }, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec4u` from an array of at least 4 number elements.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec4u(v: Uint32Array | number[], alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec2i` from individual `x, y` components.
     * @param x
     * @param y
     * @param alignment - Default 8 (as in WGSL)
     */
    vec2i(x: number, y: number, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec2i` from an object `{x, y}`.
     * @param v
     * @param alignment - Default 8 (as in WGSL)
     */
    vec2i(v: { x: number, y: number }, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec2i` from an array of at least 2 number elements.
     * @param v
     * @param alignment - Default 8 (as in WGSL)
     */
    vec2i(v: Int32Array | number[], alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec3i` from individual `x, y, z` components.
     * @param x
     * @param y
     * @param z
     * @param alignment - Default 16 (as in WGSL)
     */
    vec3i(x: number, y: number, z: number, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec3i` from an object `{x, y, z}`.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec3i(v: { x: number, y: number, z: number }, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec3i` from an array of at least 3 number elements.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec3i(v: Int32Array | number[], alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec4i` from individual `x, y, z, w` components.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec3i(v: Int32Array | number[], alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec4i` from individual `x, y, z, w` components.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec3i(v: Int32Array | number[], alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec4i` from individual `x, y, z, w` components.
     * @param x
     * @param y
     * @param z
     * @param w
     * @param alignment - Default 16 (as in WGSL)
     */
    vec4i(x: number, y: number, z: number, w: number, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec4i` from an object `{x, y, z, w}`.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec4i(v: { x: number, y: number, z: number, w: number }, alignment?: number): ArrayBufferWriter,
    /**
     * Write a `vec4i` from an array of at least 4 number elements.
     * @param v
     * @param alignment - Default 16 (as in WGSL)
     */
    vec4i(v: Int32Array | number[], alignment?: number): ArrayBufferWriter,
}

/**
 * Create an `ArrayBufferWriter` with a new `ArrayBuffer` of a given byteSize
 * @param byteSize
 * @constructor
 */
export function ArrayBufferWriter(byteSize: number): ArrayBufferWriter
/**
 * Create an `ArrayBufferWriter` with an existing `ArrayBuffer` and an optional `byteOffset`
 * @param arrayBuffer
 * @param byteOffset
 * @constructor
 */
export function ArrayBufferWriter(arrayBuffer: ArrayBuffer, byteOffset?: number): ArrayBufferWriter

export function ArrayBufferWriter(arg: ArrayBuffer | number, byteOffset: number = 0): ArrayBufferWriter {
    const arrayBuffer = typeof arg === "number" ? new ArrayBuffer(arg) : arg;
    const dw = new DataView(arrayBuffer);

    const supportFloat16 = DataView.prototype.setFloat16 !== undefined;

    const writer = {
        byteOffset,
        byteAlignment: 1,
        arrayBuffer,
        u32(value) {
            dw.setUint32(writer.byteOffset, value, true);
            writer.byteOffset += 4;
            return this;
        },
        f32(value) {
            dw.setFloat32(writer.byteOffset, value, true);
            writer.byteOffset += 4;
            return this;
        },
        i32(value) {
            dw.setInt32(writer.byteOffset, value, true);
            writer.byteOffset += 4;
            return this;
        },
        f16(value) {
            assert(supportFloat16, "Missing DataView `float16` support");
            dw.setFloat16(writer.byteOffset, value, true);
            writer.byteOffset += 2;
            return this;
        },
        align(bytes) {
            writer.byteOffset = alignTo(writer.byteOffset, bytes);
            writer.byteAlignment = Math.max(writer.byteAlignment, bytes);
            return this;
        },
        reset() {
            writer.byteAlignment = 1;
            writer.byteOffset = 0;
            return this;
        },
        skip(bytes) {
            writer.byteOffset += bytes;
            return this;
        },
        vec2f(...args: any[]) {
            const first = args[0];
            // x: number, y: number
            if (typeof first === "number") {
                const [x, y, alignment = 8] = args;
                writer.align(alignment);
                writer.f32(x);
                writer.f32(y);
            }
            // {x: number, y: number}
            else if ("x" in first && "y" in first) {
                const [v, alignment = 8] = args;
                writer.align(alignment);
                writer.f32(v.x);
                writer.f32(v.y);
            }
            // number[] | Float32Array
            else if (isArray(first) || isTypedArrayNonBigInt(first)) {
                const [arr, alignment = 8] = args;
                assert(arr.length >= 2, "`vec2f` requires at least 2 elements.");
                writer.align(alignment);
                writer.f32(arr[0]);
                writer.f32(arr[1]);
            } else {
                fail("Invalid type, expected `vec2f` compatible type");
            }

            return this;
        },
        vec3f(...args: any[]) {
            const first = args[0];
            // x: number, y: number, z: number
            if (typeof first === "number") {
                const [x, y, z, alignment = 16] = args;
                writer.align(alignment);
                writer.f32(x);
                writer.f32(y);
                writer.f32(z);
            }
            // {x: number, y: number}
            else if ("x" in first && "y" in first && "z" in first) {
                const [v, alignment = 16] = args;
                writer.align(alignment);
                writer.f32(v.x);
                writer.f32(v.y);
                writer.f32(v.z);
            }
            // number[] | Float32Array
            else if (isArray(first) || isTypedArrayNonBigInt(first)) {
                const [arr, alignment = 16] = args;
                assert(arr.length >= 3, "`vec3f` requires at least 3 elements.");
                writer.align(alignment);
                writer.f32(arr[0]);
                writer.f32(arr[1]);
                writer.f32(arr[2]);
            } else {
                fail("Invalid type, expected `vec3f` compatible type");
            }

            return this;
        },
        vec4f(...args: any[]) {
            const first = args[0];
            // x: number, y: number, z: number, w: number
            if (typeof first === "number") {
                const [x, y, z, w, alignment = 16] = args;
                writer.align(alignment);
                writer.f32(x);
                writer.f32(y);
                writer.f32(z);
                writer.f32(w);
            }
            // {x: number, y: number}
            else if ("x" in first && "y" in first && "z" in first && "w" in first) {
                const [v, alignment = 16] = args;
                writer.align(alignment);
                writer.f32(v.x);
                writer.f32(v.y);
                writer.f32(v.z);
                writer.f32(v.w);
            }
            // number[] | Float32Array
            else if (isArray(first) || isTypedArrayNonBigInt(first)) {
                const [arr, alignment = 16] = args;
                assert(arr.length >= 4, "`vec4f` requires at least 4 elements.");
                writer.align(alignment);
                writer.f32(arr[0]);
                writer.f32(arr[1]);
                writer.f32(arr[2]);
                writer.f32(arr[3]);
            } else {
                fail("Invalid type, expected `vec4f` compatible type");
            }

            return this;
        },
        mat4x4f(m, alignment = 16) {
            assert(m.length >= 16, "`mat4x4f` requires at least 16 elements");
            writer.align(alignment);
            for (let i = 0; i < 16; i++) {
                writer.f32(m[i]);
            }

            return this;
        },
        vec2h(...args: any[]) {
            const first = args[0];
            // x: number, y: number
            if (typeof first === "number") {
                const [x, y, alignment = 4] = args;
                writer.align(alignment);
                writer.f16(x);
                writer.f16(y);
            }
            // {x: number, y: number}
            else if ("x" in first && "y" in first) {
                const [v, alignment = 4] = args;
                writer.align(alignment);
                writer.f16(v.x);
                writer.f16(v.y);
            }
            // number[] | Float32Array
            else if (isArray(first) || isTypedArrayNonBigInt(first)) {
                const [arr, alignment = 4] = args;
                assert(arr.length >= 2, "`vec2h` requires at least 2 elements.");
                writer.align(alignment);
                writer.f16(arr[0]);
                writer.f16(arr[1]);
            } else {
                fail("Invalid type, expected `vec2h` compatible type");
            }

            return this;
        },
        vec3h(...args: any[]) {
            const first = args[0];
            // x: number, y: number, z: number
            if (typeof first === "number") {
                const [x, y, z, alignment = 8] = args;
                writer.align(alignment);
                writer.f16(x);
                writer.f16(y);
                writer.f16(z);
            }
            // {x: number, y: number}
            else if ("x" in first && "y" in first && "z" in first) {
                const [v, alignment = 8] = args;
                writer.align(alignment);
                writer.f16(v.x);
                writer.f16(v.y);
                writer.f16(v.z);
            }
            // number[] | Float32Array
            else if (isArray(first) || isTypedArrayNonBigInt(first)) {
                const [arr, alignment = 8] = args;
                assert(arr.length >= 3, "`vec3h` requires at least 3 elements.");
                writer.align(alignment);
                writer.f16(arr[0]);
                writer.f16(arr[1]);
                writer.f16(arr[2]);
            } else {
                fail("Invalid type, expected `vec3h` compatible type");
            }

            return this;
        },
        vec4h(...args: any[]) {
            const first = args[0];
            // x: number, y: number, z: number, w: number
            if (typeof first === "number") {
                const [x, y, z, w, alignment = 8] = args;
                writer.align(alignment);
                writer.f16(x);
                writer.f16(y);
                writer.f16(z);
                writer.f16(w);
            }
            // {x: number, y: number}
            else if ("x" in first && "y" in first && "z" in first && "w" in first) {
                const [v, alignment = 8] = args;
                writer.align(alignment);
                writer.f16(v.x);
                writer.f16(v.y);
                writer.f16(v.z);
                writer.f16(v.w);
            }
            // number[] | Float32Array
            else if (isArray(first) || isTypedArrayNonBigInt(first)) {
                const [arr, alignment = 8] = args;
                assert(arr.length >= 4, "`vec4h` requires at least 4 elements.");
                writer.align(alignment);
                writer.f16(arr[0]);
                writer.f16(arr[1]);
                writer.f16(arr[2]);
                writer.f16(arr[3]);
            } else {
                fail("Invalid type, expected `vec4h` compatible type");
            }

            return this;
        },
        vec2u(...args: any[]) {
            const first = args[0];
            // x: number, y: number
            if (typeof first === "number") {
                const [x, y, alignment = 8] = args;
                writer.align(alignment);
                writer.u32(x);
                writer.u32(y);
            }
            // {x: number, y: number}
            else if ("x" in first && "y" in first) {
                const [v, alignment = 8] = args;
                writer.align(alignment);
                writer.u32(v.x);
                writer.u32(v.y);
            }
            // number[] | Uint32Array
            else if (isArray(first) || isTypedArrayNonBigInt(first)) {
                const [arr, alignment = 8] = args;
                assert(arr.length >= 2, "`vec2u` requires at least 2 elements.");
                writer.align(alignment);
                writer.u32(arr[0]);
                writer.u32(arr[1]);
            } else {
                fail("Invalid type, expected `vec2u` compatible type");
            }
            return this;
        },
        vec3u(...args: any[]) {
            const first = args[0];
            // x: number, y: number, z: number
            if (typeof first === "number") {
                const [x, y, z, alignment = 16] = args;
                writer.align(alignment);
                writer.u32(x);
                writer.u32(y);
                writer.u32(z);
            }
            // {x: number, y: number, z: number}
            else if ("x" in first && "y" in first && "z" in first) {
                const [v, alignment = 16] = args;
                writer.align(alignment);
                writer.u32(v.x);
                writer.u32(v.y);
                writer.u32(v.z);
            }
            // number[] | Uint32Array
            else if (isArray(first) || isTypedArrayNonBigInt(first)) {
                const [arr, alignment = 16] = args;
                assert(arr.length >= 3, "`vec3u` requires at least 3 elements.");
                writer.align(alignment);
                writer.u32(arr[0]);
                writer.u32(arr[1]);
                writer.u32(arr[2]);
            } else {
                fail("Invalid type, expected `vec3u` compatible type");
            }
            return this;
        },
        vec4u(...args: any[]) {
            const first = args[0];
            // x: number, y: number, z: number, w: number
            if (typeof first === "number") {
                const [x, y, z, w, alignment = 16] = args;
                writer.align(alignment);
                writer.u32(x);
                writer.u32(y);
                writer.u32(z);
                writer.u32(w);
            }
            // {x: number, y: number, z: number, w: number}
            else if ("x" in first && "y" in first && "z" in first && "w" in first) {
                const [v, alignment = 16] = args;
                writer.align(alignment);
                writer.u32(v.x);
                writer.u32(v.y);
                writer.u32(v.z);
                writer.u32(v.w);
            }
            // number[] | Uint32Array
            else if (isArray(first) || isTypedArrayNonBigInt(first)) {
                const [arr, alignment = 16] = args;
                assert(arr.length >= 4, "`vec4u` requires at least 4 elements.");
                writer.align(alignment);
                writer.u32(arr[0]);
                writer.u32(arr[1]);
                writer.u32(arr[2]);
                writer.u32(arr[3]);
            } else {
                fail("Invalid type, expected `vec4u` compatible type");
            }
            return this;
        },
        vec2i(...args: any[]) {
            const first = args[0];
            // x: number, y: number
            if (typeof first === "number") {
                const [x, y, alignment = 8] = args;
                writer.align(alignment);
                writer.i32(x);
                writer.i32(y);
            }
            // {x: number, y: number}
            else if ("x" in first && "y" in first) {
                const [v, alignment = 8] = args;
                writer.align(alignment);
                writer.i32(v.x);
                writer.i32(v.y);
            }
            // number[] | Int32Array
            else if (isArray(first) || isTypedArrayNonBigInt(first)) {
                const [arr, alignment = 8] = args;
                assert(arr.length >= 2, "`vec2i` requires at least 2 elements.");
                writer.align(alignment);
                writer.i32(arr[0]);
                writer.i32(arr[1]);
            } else {
                fail("Invalid type, expected `vec2i` compatible type");
            }
            return this;
        },
        vec3i(...args: any[]) {
            const first = args[0];
            // x: number, y: number, z: number
            if (typeof first === "number") {
                const [x, y, z, alignment = 16] = args;
                writer.align(alignment);
                writer.i32(x);
                writer.i32(y);
                writer.i32(z);
            }
            // {x: number, y: number, z: number}
            else if ("x" in first && "y" in first && "z" in first) {
                const [v, alignment = 16] = args;
                writer.align(alignment);
                writer.i32(v.x);
                writer.i32(v.y);
                writer.i32(v.z);
            }
            // number[] | Int32Array
            else if (isArray(first) || isTypedArrayNonBigInt(first)) {
                const [arr, alignment = 16] = args;
                assert(arr.length >= 3, "`vec3i` requires at least 3 elements.");
                writer.align(alignment);
                writer.i32(arr[0]);
                writer.i32(arr[1]);
                writer.i32(arr[2]);
            } else {
                fail("Invalid type, expected `vec3i` compatible type");
            }
            return this;
        },
        vec4i(...args: any[]) {
            const first = args[0];
            // x: number, y: number, z: number, w: number
            if (typeof first === "number") {
                const [x, y, z, w, alignment = 16] = args;
                writer.align(alignment);
                writer.i32(x);
                writer.i32(y);
                writer.i32(z);
                writer.i32(w);
            }
            // {x: number, y: number, z: number, w: number}
            else if ("x" in first && "y" in first && "z" in first && "w" in first) {
                const [v, alignment = 16] = args;
                writer.align(alignment);
                writer.i32(v.x);
                writer.i32(v.y);
                writer.i32(v.z);
                writer.i32(v.w);
            }
            // number[] | Int32Array
            else if (isArray(first) || isTypedArrayNonBigInt(first)) {
                const [arr, alignment = 16] = args;
                assert(arr.length >= 4, "`vec4i` requires at least 4 elements.");
                writer.align(alignment);
                writer.i32(arr[0]);
                writer.i32(arr[1]);
                writer.i32(arr[2]);
                writer.i32(arr[3]);
            } else {
                fail("Invalid type, expected `vec4i` compatible type");
            }
            return this;
        },
    } satisfies ArrayBufferWriter;

    return writer;
}

function alignTo(offset: number, align: number) {
    return Math.ceil(offset / align) * align;
}