"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/* =====================================================================
   Rotating topology graph with pulsing nodes — a native port of the
   ThreeUI "Topology Field" (nexus-topology) scene. Geometry, counts,
   thresholds, rotation and pulse timing follow the source; colours are
   re-keyed for a light section (brand-green ink, fog fades to the page
   colour instead of to black).
   ===================================================================== */

type Props = {
  /** Section background the fog fades into */
  background?: string;
  /** Node / line colour */
  ink?: string;
  className?: string;
};

export default function TopologyField({ background = "#F8FAFC", ink = "#00875A", className = "" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let width = host.clientWidth;
    let height = host.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(new THREE.Color(background), 300, 950);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.z = 650;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const group = new THREE.Group();
    scene.add(group);

    const inkColor = new THREE.Color(ink);
    const bgColor = new THREE.Color(background);

    // nodes on a Fibonacci sphere
    const numNodes = 120;
    const nodes: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>[] = [];
    const nodeGeo = new THREE.SphereGeometry(1, 16, 16);

    for (let i = 0; i < numNodes; i++) {
      const phi = Math.acos(-1 + (2 * i) / numNodes);
      const theta = Math.sqrt(numNodes * Math.PI) * phi;
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);

      const mesh = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: inkColor, transparent: true, opacity: 0.9 }));
      mesh.position.set(x, y, z);
      mesh.userData = {
        baseSize: Math.random() * 1.5 + 1.0,
        pulseSpeed: Math.random() * 0.02 + 0.015,
        pulseOffset: Math.random() * Math.PI * 2,
      };
      group.add(mesh);
      nodes.push(mesh);
    }

    // edges between near neighbours; strength fades with distance
    const linePos: number[] = [];
    const lineColors: number[] = [];
    const threshold = 0.45;
    const c = new THREE.Color();
    for (let i = 0; i < numNodes; i++) {
      for (let j = i + 1; j < numNodes; j++) {
        const dist = nodes[i].position.distanceTo(nodes[j].position);
        if (dist < threshold) {
          linePos.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
          linePos.push(nodes[j].position.x, nodes[j].position.y, nodes[j].position.z);
          // on a light page, "alpha" is a blend from the page colour toward the ink
          const alpha = (1 - dist / threshold) * 0.8;
          c.copy(bgColor).lerp(inkColor, alpha);
          lineColors.push(c.r, c.g, c.b, c.r, c.g, c.b);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
    lineGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      opacity: 0.65,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    function resize() {
      width = host!.clientWidth;
      height = host!.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);

      const R = width > 768 ? 380 : 200;
      group.scale.set(R, R, R);

      const centerX = width > 768 ? width * 0.2 : 0;
      const centerY = width > 768 ? -height * 0.05 : -height * 0.2;
      group.position.set(centerX, centerY, 0);

      const glow = glowRef.current;
      if (glow) {
        glow.style.left = `${width / 2 + centerX}px`;
        glow.style.top = `${height / 2 - centerY}px`;
        glow.style.width = `${R * 2.8}px`;
        glow.style.height = `${R * 2.8}px`;
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    let time = 0;
    let raf: number | null = null;
    let visible = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function frame() {
      time += 1;

      group.rotation.y = time * 0.0018;
      group.rotation.x = 0.2;
      group.rotation.z = time * 0.0006;

      for (const mesh of nodes) {
        const p = mesh.userData as { baseSize: number; pulseSpeed: number; pulseOffset: number };
        const pulse = (Math.sin(time * p.pulseSpeed + p.pulseOffset) + 1) / 2;
        const targetRadius = p.baseSize + pulse * 1.8;
        const scale = targetRadius / group.scale.x;
        mesh.scale.set(scale, scale, scale);
        mesh.material.opacity = 0.4 + pulse * 0.6;
      }

      renderer.render(scene, camera);
    }

    function animate() {
      raf = null;
      frame();
      if (visible && !reduced) raf = requestAnimationFrame(animate);
    }

    // only spend frames while the section is on screen
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && raf === null) animate();
      },
      { rootMargin: "100px" }
    );
    io.observe(host);
    animate();

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      nodeGeo.dispose();
      nodes.forEach((n) => n.material.dispose());
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }, [background, ink]);

  return (
    <div ref={hostRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div
        ref={glowRef}
        className="absolute rounded-full blur-[120px] opacity-[0.18] bg-emerald-200"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
