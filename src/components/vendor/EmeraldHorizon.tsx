"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/* =====================================================================
   Emerald glow rising from an organic moving horizon — a port of the
   ThreeUI "Emerald Horizon" shader. The horizon, wave, noise, glow
   colours and vignette maths are unchanged; only the final output is
   re-keyed for a light section: instead of glow added onto a near-black
   fill, the glow is emitted as premultiplied alpha over the page.
   ===================================================================== */

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_wave_scale;
uniform float u_variation;
uniform float u_glow;
uniform float u_vignette;
uniform float u_strength;
varying vec2 vUv;
float hash(float n) { return fract(sin(n) * 1e4); }
float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hash(i), hash(i + 1.0), u);
}
void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  float yPos = st.y;
  float wave1 = sin(st.x * 3.0 + u_time * 0.5) * 0.1 * u_wave_scale;
  float wave2 = sin(st.x * 5.0 - u_time * 0.3) * 0.05 * u_wave_scale;
  float combinedWave = wave1 + wave2;
  float intensity = smoothstep(0.4, -0.1, yPos + combinedWave);
  float variation = noise(st.x * 2.0 + u_time * 0.1) * 0.5 + 0.5;
  intensity *= variation * 1.5 * u_variation;
  vec3 glowColor1 = vec3(0.05, 0.8, 0.2);
  vec3 glowColor2 = vec3(0.0, 1.0, 0.5);
  vec3 finalGlow = mix(glowColor1, glowColor2, st.x + sin(u_time*0.2)*0.5);
  float amount = pow(intensity, 1.5) * 1.2 * u_glow;
  float vignette = mix(1.0, smoothstep(1.2, 0.5, length(st - vec2(0.5, 0.0))), u_vignette);
  amount *= vignette;
  // light-page output: the glow becomes coverage instead of added light
  float a = clamp(amount, 0.0, 1.0) * u_strength;
  vec3 ink = clamp(finalGlow * 0.72, 0.0, 1.0);
  gl_FragColor = vec4(ink * a, a);
}
`;

export type EmeraldHorizonProps = {
  speed?: number;
  waveScale?: number;
  variation?: number;
  glow?: number;
  vignette?: number;
  hue?: number;
  /** Overall opacity of the glow on the light page */
  strength?: number;
  className?: string;
};

const DEFAULTS = { speed: 1, waveScale: 1, variation: 1, glow: 1, vignette: 1, hue: 0, strength: 0.5 };

export default function EmeraldHorizon({ className = "", ...props }: EmeraldHorizonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optionsRef = useRef({ ...DEFAULTS, ...props });

  useEffect(() => {
    optionsRef.current = { ...DEFAULTS, ...props };
  });

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_wave_scale: { value: 1 },
      u_variation: { value: 1 },
      u_glow: { value: 1 },
      u_vignette: { value: 1 },
      u_strength: { value: DEFAULTS.strength },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      premultipliedAlpha: true,
      depthWrite: false,
      depthTest: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    let frame = 0;
    let visible = true;
    const start = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      renderer.setSize(bounds.width, bounds.height, false);
      // gl_FragCoord is in drawing-buffer pixels, so match the buffer size
      const buf = renderer.getDrawingBufferSize(new THREE.Vector2());
      uniforms.u_resolution.value.set(buf.x, buf.y);
      if (reduced) renderer.render(scene, camera);
    };

    const render = (now: number) => {
      const o = optionsRef.current;
      uniforms.u_time.value = (now - start) * 0.001 * o.speed;
      uniforms.u_wave_scale.value = o.waveScale;
      uniforms.u_variation.value = o.variation;
      uniforms.u_glow.value = o.glow;
      uniforms.u_vignette.value = o.vignette;
      uniforms.u_strength.value = o.strength;
      renderer.render(scene, camera);
      frame = visible && !document.hidden && !reduced ? requestAnimationFrame(render) : 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible && !frame) frame = requestAnimationFrame(render);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    resizeObserver.observe(host);
    intersection.observe(host);
    resize();
    frame = requestAnimationFrame(render);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={hostRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full [mask-image:linear-gradient(to_bottom,#000_62%,transparent_100%)]"
        style={{ filter: props.hue ? `hue-rotate(${props.hue}deg)` : undefined }}
      />
    </div>
  );
}
