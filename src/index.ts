import {LazyBufferView} from "@domgell/lazy-buffer-view";
import {assert} from "@domgell/ts-util";

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
     * Subtract `bytes` from `byteOffset`
     */
    back(bytes: number): ArrayBufferWriter,
    /**
     * Write a `u32` value.
     * @param value
     */
    u32(value: number): ArrayBufferWriter,
    /**
     * Write an `f32` value.
     * @param value
     */
    f32(value: number): ArrayBufferWriter,
    /**
     * Write an `i32` value.
     * @param value
     */
    i32(value: number): ArrayBufferWriter,
    /**
     * Write an `f16` value.
     * (Requires Float16 support in the browser)
     * @param value
     */
    f16(value: number): ArrayBufferWriter,
    /**
     * Write a `vec2f` from `{x, y}`
     */
    vec2f(value: { x: number, y: number }): ArrayBufferWriter,
    /**
     * Write a `vec3f` from `{x, y, z}`
     */
    vec3f(value: { x: number, y: number, z: number }): ArrayBufferWriter,
    /**
     * Write a `vec4f` from `{x, y, z, w}`
     */
    vec4f(value: { x: number, y: number, z: number, w: number }): ArrayBufferWriter,
    /**
     * Write a `vec2u` from `{x, y}`
     */
    vec2u(value: { x: number, y: number }): ArrayBufferWriter,
    /**
     * Write a `vec3u` from `{x, y, z}`
     */
    vec3u(value: { x: number, y: number, z: number }): ArrayBufferWriter,
    /**
     * Write a `vec4u` from `{x, y, z, w}`
     */
    vec4u(value: { x: number, y: number, z: number, w: number }): ArrayBufferWriter,
    /**
     * Write a `vec2i` from `{x, y}`
     */
    vec2i(value: { x: number, y: number }): ArrayBufferWriter,
    /**
     * Write a `vec3i` from `{x, y, z}`
     */
    vec3i(value: { x: number, y: number, z: number }): ArrayBufferWriter,
    /**
     * Write a `vec4i` from `{x, y, z, w}`
     */
    vec4i(value: { x: number, y: number, z: number, w: number }): ArrayBufferWriter,
    /**
     * Write a `vec2h` from `{x, y}`
     * (Requires Float16 support in the browser)
     */
    vec2h(value: { x: number, y: number }): ArrayBufferWriter,
    /**
     * Write a `vec3h` from `{x, y, z}`
     * (Requires Float16 support in the browser)
     */
    vec3h(value: { x: number, y: number, z: number }): ArrayBufferWriter,
    /**
     * Write a `vec4h` from `{x, y, z, w}`
     * (Requires Float16 support in the browser)
     */
    vec4h(value: { x: number, y: number, z: number, w: number }): ArrayBufferWriter,
    /**
     * Write a `mat4x4f` from an array of at least 16 numbers.
     */
    mat4x4f(value: ArrayLike<number>): ArrayBufferWriter,
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
/**
 * @param arg
 * @param byteOffset
 * @constructor
 */
export function ArrayBufferWriter(arg: ArrayBuffer | number, byteOffset: number = 0): ArrayBufferWriter {
    const arrayBuffer = typeof arg === "number" ? new ArrayBuffer(arg) : arg;
    return new ArrayBufferWriterImpl(arrayBuffer, byteOffset);
}

class ArrayBufferWriterImpl implements ArrayBufferWriter {
    private readonly lw: LazyBufferView;
    private readonly supportFloat16 = globalThis["Float16Array"] !== undefined;
    byteAlignment: number = 1;

    constructor(
        readonly arrayBuffer: ArrayBuffer,
        public byteOffset: number = 0,
    ) {
        this.lw = LazyBufferView(arrayBuffer);
    }

    align(bytes: number): ArrayBufferWriter {
        this.byteOffset = alignTo(this.byteOffset, bytes);
        this.byteAlignment = Math.max(this.byteAlignment, bytes);
        return this;
    }

    reset(): ArrayBufferWriter {
        this.byteOffset = 0;
        this.byteAlignment = 0;
        return this;
    }

    skip(bytes: number): ArrayBufferWriter {
        this.byteOffset += bytes;
        return this;
    }

    back(bytes: number): ArrayBufferWriter {
        this.byteOffset -= bytes;
        this.byteOffset = Math.max(this.byteOffset, 0);
        return this;
    }

    u32(value: number): ArrayBufferWriter {
        const offset = this.byteOffset / 4;
        this.lw.uint32Array[offset] = value;
        this.byteOffset += 4;
        return this;
    }

    f32(value: number): ArrayBufferWriter {
        const offset = this.byteOffset / 4;
        this.lw.float32Array[offset] = value;
        this.byteOffset += 4;
        return this;
    }

    i32(value: number): ArrayBufferWriter {
        const offset = this.byteOffset / 4;
        this.lw.int32Array[offset] = value;
        this.byteOffset += 4;
        return this;
    }

    f16(value: number): ArrayBufferWriter {
        assert(this.supportFloat16, "Float16 support is not available in this browser");

        const offset = this.byteOffset / 2;
        this.lw.float16Array[offset] = value;
        this.byteOffset += 2;
        return this;
    }

    vec2f(value: { x: number; y: number; }): ArrayBufferWriter {
        this.align(8);
        const offset = this.byteOffset / 4;
        const float32Array = this.lw.float32Array;
        float32Array[offset] = value.x;
        float32Array[offset + 1] = value.y;
        this.byteOffset += 8;
        return this;
    }

    vec3f(value: { x: number; y: number; z: number; }): ArrayBufferWriter {
        this.align(16);
        const offset = this.byteOffset / 4;
        const float32Array = this.lw.float32Array;
        float32Array[offset] = value.x;
        float32Array[offset + 1] = value.y;
        float32Array[offset + 2] = value.z;
        this.byteOffset += 12;
        return this;
    }

    vec4f(value: { x: number; y: number; z: number; w: number; }): ArrayBufferWriter {
        this.align(16);
        const offset = this.byteOffset / 4;
        const float32Array = this.lw.float32Array;
        float32Array[offset] = value.x;
        float32Array[offset + 1] = value.y;
        float32Array[offset + 2] = value.z;
        float32Array[offset + 3] = value.w;
        this.byteOffset += 16;
        return this;
    }

    vec2u(value: { x: number; y: number; }): ArrayBufferWriter {
        this.align(8);
        const offset = this.byteOffset / 4;
        const uint32Array = this.lw.uint32Array;
        uint32Array[offset] = value.x;
        uint32Array[offset + 1] = value.y;
        this.byteOffset += 8;
        return this;
    }

    vec3u(value: { x: number; y: number; z: number; }): ArrayBufferWriter {
        this.align(16);
        const offset = this.byteOffset / 4;
        const uint32Array = this.lw.uint32Array;
        uint32Array[offset] = value.x;
        uint32Array[offset + 1] = value.y;
        uint32Array[offset + 2] = value.z;
        this.byteOffset += 12;
        return this;
    }

    vec4u(value: { x: number; y: number; z: number; w: number; }): ArrayBufferWriter {
        this.align(16);
        const offset = this.byteOffset / 4;
        const uint32Array = this.lw.uint32Array;
        uint32Array[offset] = value.x;
        uint32Array[offset + 1] = value.y;
        uint32Array[offset + 2] = value.z;
        uint32Array[offset + 3] = value.w;
        this.byteOffset += 16;
        return this;
    }

    vec2i(value: { x: number; y: number; }): ArrayBufferWriter {
        this.align(8);
        const offset = this.byteOffset / 4;
        const int32Array = this.lw.int32Array;
        int32Array[offset] = value.x;
        int32Array[offset + 1] = value.y;
        this.byteOffset += 8;
        return this;
    }

    vec3i(value: { x: number; y: number; z: number; }): ArrayBufferWriter {
        this.align(16);
        const offset = this.byteOffset / 4;
        const int32Array = this.lw.int32Array;
        int32Array[offset] = value.x;
        int32Array[offset + 1] = value.y;
        int32Array[offset + 2] = value.z;
        this.byteOffset += 12;
        return this;
    }

    vec4i(value: { x: number; y: number; z: number; w: number; }): ArrayBufferWriter {
        this.align(16);
        const offset = this.byteOffset / 4;
        const int32Array = this.lw.int32Array;
        int32Array[offset] = value.x;
        int32Array[offset + 1] = value.y;
        int32Array[offset + 2] = value.z;
        int32Array[offset + 3] = value.w;
        this.byteOffset += 16;
        return this;
    }

    vec2h(value: { x: number; y: number; }): ArrayBufferWriter {
        assert(this.supportFloat16, "Float16 support is not available in this browser");

        this.align(4);
        const offset = this.byteOffset / 2;
        const float16Array = this.lw.float16Array;
        float16Array[offset] = value.x;
        float16Array[offset + 1] = value.y;
        this.byteOffset += 4;
        return this;
    }

    vec3h(value: { x: number; y: number; z: number; }): ArrayBufferWriter {
        assert(this.supportFloat16, "Float16 support is not available in this browser");

        this.align(8);
        const offset = this.byteOffset / 2;
        const float16Array = this.lw.float16Array;
        float16Array[offset] = value.x;
        float16Array[offset + 1] = value.y;
        float16Array[offset + 2] = value.z;
        this.byteOffset += 6;
        return this;
    }

    vec4h(value: { x: number; y: number; z: number; w: number; }): ArrayBufferWriter {
        assert(this.supportFloat16, "Float16 support is not available in this browser");

        this.align(8);
        const offset = this.byteOffset / 2;
        const float16Array = this.lw.float16Array;
        float16Array[offset] = value.x;
        float16Array[offset + 1] = value.y;
        float16Array[offset + 2] = value.z;
        float16Array[offset + 3] = value.w;
        this.byteOffset += 8;
        return this;
    }

    mat4x4f(value: number[] | Float32Array): ArrayBufferWriter {
        assert(value.length >= 16, "mat4x4f requires at least 16 elements");

        this.align(16);
        const offset = this.byteOffset / 4;
        this.lw.float32Array.set(value, offset);
        this.byteOffset += 64;
        return this;
    }
}

function alignTo(offset: number, align: number) {
    return Math.ceil(offset / align) * align;
}