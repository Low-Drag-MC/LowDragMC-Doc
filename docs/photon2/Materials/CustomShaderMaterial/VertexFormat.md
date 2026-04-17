# Vertex Format

{{ version_badge("2.0.0", label="Since", icon="tag", href="/changelog/#2.0.0") }}

> **Note:**  
> In most cases, you don’t need to understand this section — Photon2 handles vertex layouts automatically.  
> But for curious users or those with special shader needs, here’s how Photon2 processes different vertex layouts and unifies them for materials.

Photon2 supports **three vertex layouts**:

- **Vanilla layout**
- **Particle Instance**
- **Particle Model Instance**

---

## 📄 Vanilla Layout

Default format used when no special GPU settings are enabled.

```glsl
in vec3 Position;
in vec4 Color;
in vec2 UV0;
in ivec2 UV2;
in vec3 Normal;

struct ParticleData {
    vec3 Position;
    vec4 Color;
    vec2 UV;
    ivec2 LightUV;
    vec3 Normal;
};

ParticleData getParticleData() {
    ParticleData data;
    data.Position = Position;
    data.Color = Color;
    data.UV = UV0;
    data.LightUV = UV2;
    data.Normal = Normal;
    return data;
}
```

---

## 🚀 Particle Instance

Used when **GPU Instance** is enabled in the particle emitter.  
Add the following macro to the shader:

```glsl
#define PARTICLE_INSTANCE
```

```glsl
#ifdef PARTICLE_INSTANCE
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 iPos;
layout(location = 2) in vec2 iSize;
layout(location = 3) in vec3 iScale;
layout(location = 4) in vec4 iRot;
layout(location = 5) in vec4 iColor;
layout(location = 6) in vec4 iUV;
layout(location = 7) in int iLight;

struct ParticleData {
    vec3 Position;
    vec4 Color;
    vec2 UV;
    ivec2 LightUV;
    vec3 Normal;
};

mat3 quatToMat(vec4 q) {
    float x2 = q.x + q.x, y2 = q.y + q.y, z2 = q.z + q.z;
    float xx = q.x * x2, yy = q.y * y2, zz = q.z * z2;
    float xy = q.x * y2, xz = q.x * z2, yz = q.y * z2;
    float wx = q.w * x2, wy = q.w * y2, wz = q.w * z2;

    return mat3(
        1 - (yy + zz), xy + wz, xz - wy,
        xy - wz, 1 - (xx + zz), yz + wx,
        xz + wy, yz - wx, 1 - (xx + yy)
    );
}

ParticleData getParticleData() {
    ParticleData data;
    mat3 rotMat = quatToMat(iRot);
    data.Position = (rotMat * vec3(aPos.xy * iSize, aPos.z)) * iScale + iPos;
    data.Color = iColor;
    data.UV = mix(iUV.xy, iUV.zw, aPos.xy * 0.5 + 0.5);
    data.LightUV = ivec2((iLight >> 16) & 0xFFFF, iLight & 0xFFFF);
    data.Normal = normalize(rotMat * vec3(0, 0, 1));
    return data;
}
#endif
```

---

## 🏗 Particle Model Instance

Used when **model mode** is enabled in the emitter **and** GPU Instance is active.  
Add the following macro to the shader:

```glsl
#define PARTICLE_MODEL_INSTANCE
```

```glsl
#ifdef PARTICLE_MODEL_INSTANCE
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec2 aUV;
layout(location = 2) in vec3 aNormal;
layout(location = 3) in float aBrightness;
layout(location = 4) in vec3 iPos;
layout(location = 5) in vec3 iScale;
layout(location = 6) in vec4 iRot;
layout(location = 7) in vec4 iColor;
layout(location = 8) in int iLight;

struct ParticleData {
    vec3 Position;
    vec4 Color;
    vec2 UV;
    ivec2 LightUV;
    vec3 Normal;
};

mat3 quatToMat(vec4 q) {
    float x2 = q.x + q.x, y2 = q.y + q.y, z2 = q.z + q.z;
    float xx = q.x * x2, yy = q.y * y2, zz = q.z * z2;
    float xy = q.x * y2, xz = q.x * z2, yz = q.y * z2;
    float wx = q.w * x2, wy = q.w * y2, wz = q.w * z2;

    return mat3(
        1 - (yy + zz), xy + wz, xz - wy,
        xy - wz, 1 - (xx + zz), yz + wx,
        xz + wy, yz - wx, 1 - (xx + yy)
    );
}

ParticleData getParticleData() {
    ParticleData data;
    mat3 rotMat = quatToMat(iRot);
    vec3 centeredPos = aPos - vec3(0.5); // Centered
    data.Position = (rotMat * (centeredPos * iScale)) + iPos;
    data.Color = vec4(iColor.rgb * aBrightness, iColor.a);
    data.UV = aUV;
    data.LightUV = ivec2((iLight >> 16) & 0xFFFF, iLight & 0xFFFF);
    data.Normal = normalize(rotMat * aNormal);
    return data;
}
#endif
```
