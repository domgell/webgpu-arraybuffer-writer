# WebGPU ArrayBuffer Writer

WGSL structs and arrays have specific alignment rules which can make it inconvenient to write data to WebGPU buffers.

This is a utility to make it easier to write correctly aligned data to ArrayBuffers. These can then be written directly
to GPUBuffers.

# Example

```wgsl
// Struct in WGSL shader
struct Particle {
    position: vec3f,
    velocity: vec3f,
    friction: f32,
}
```

```ts
const particle = {
    position: {x: 10, y: 5, z: 0},
    velocity: {x: 0, y: 0, z: 0},
    friction: 0.5,
}

// Create an ArrayBufferWriter with a given size or provide an existing ArrayBuffer
const particleWriter = ArrayBufferWriter(particleByteSize);

// Write each struct member
particleWriter
    .vec3f(particle.position)
    .vec3f(particle.velocity)
    .f32(particle.friction);

// Write the ArrayBuffer to an existing GPUBuffer
device.queue.writeBuffer(particleGPUBuffer, 0, particleWriter.arrayBuffer);
```

