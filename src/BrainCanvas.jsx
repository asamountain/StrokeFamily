import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { REGIONS } from './data.js';

function classifyVertex(x, y, z) {
  if (y < -0.30 && z < -0.10) return 'cerebellum';
  if (Math.abs(x) > 0.62)     return 'temporal';
  if (z < -0.60 && y > -0.30) return 'occipital';
  if (z > 0.32)               return 'frontal';
  if (y > 0.50)               return 'parietal';
  return 'limbic';
}

export default function BrainCanvas({ selected, hovered, onSelect, onHover, hint }) {
  const mountRef = useRef(null);
  const stRef = useRef({
    rotY: 0.3, rotX: 0.05,
    isDragging: false, autoRotate: true,
    dnPos: null, prevPos: null, hoveredId: null
  });
  const meshMapRef = useRef({});
  const highlightLightRef = useRef(null);
  const updateColorsRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;
    const st = stRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0C0604);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const key = new THREE.DirectionalLight(0xfff4e8, 1.2);
    key.position.set(4, 5, 6);
    key.castShadow = true;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x3355cc, 0.45);
    fill.position.set(-5, -2, -4);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 0.6);
    rim.position.set(1, 2, -6);
    scene.add(rim);

    const under = new THREE.DirectionalLight(0xffe8d0, 0.2);
    under.position.set(0, -4, 2);
    scene.add(under);

    // Highlight point light for region selection glow
    const highlightLight = new THREE.PointLight(0xffffff, 0, 3.5);
    scene.add(highlightLight);
    highlightLightRef.current = highlightLight;

    const group = new THREE.Group();
    scene.add(group);

    let disposed = false;

    // Load OBJ brain model with vertex colors
    const loader = new OBJLoader();
    loader.load('/brain.obj', (obj) => {
      if (disposed) return;

      const box = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.2 / maxDim;
      const cx = center.x, cy = center.y, cz = center.z;

      obj.scale.setScalar(scale);
      obj.position.set(-cx * scale, -cy * scale, -cz * scale);

      const BASE = new THREE.Color(0xCFB5A0);
      const brainMeshes = [];
      const regionVerts = {};
      REGIONS.forEach(r => { regionVerts[r.id] = []; });

      obj.traverse(child => {
        if (!child.isMesh) return;
        const mi = brainMeshes.length;
        brainMeshes.push(child);
        child.material = new THREE.MeshPhongMaterial({ vertexColors: true, specular: 0x333333, shininess: 20 });
        child.castShadow = true;
        child.receiveShadow = true;

        const pos = child.geometry.attributes.position;
        const N = pos.count;
        const col = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
          const wx = scale * (pos.getX(i) - cx);
          const wy = scale * (pos.getY(i) - cy);
          const wz = scale * (pos.getZ(i) - cz);
          const rid = classifyVertex(wx, wy, wz);
          if (regionVerts[rid]) regionVerts[rid].push({ m: mi, i });
          col[i*3] = BASE.r; col[i*3+1] = BASE.g; col[i*3+2] = BASE.b;
        }
        child.geometry.setAttribute('color', new THREE.BufferAttribute(col, 3));
      });

      group.add(obj);

      const DIM = new THREE.Color(0x352820);

      const updateColors = (sel, hov) => {
        const reset = sel ? DIM : BASE;
        brainMeshes.forEach(mesh => {
          const c = mesh.geometry.attributes.color.array;
          for (let i = 0; i < c.length / 3; i++) {
            c[i*3] = reset.r; c[i*3+1] = reset.g; c[i*3+2] = reset.b;
          }
          mesh.material.transparent = !!sel;
          mesh.material.opacity = sel ? 0.5 : 1.0;
        });
        const activeId = sel || hov;
        if (activeId) {
          const reg = REGIONS.find(r => r.id === activeId);
          const paint = new THREE.Color(sel ? reg.bright : reg.color);
          (regionVerts[activeId] || []).forEach(({ m, i }) => {
            const c = brainMeshes[m].geometry.attributes.color.array;
            c[i*3] = paint.r; c[i*3+1] = paint.g; c[i*3+2] = paint.b;
          });
        }
        brainMeshes.forEach(m => { m.geometry.attributes.color.needsUpdate = true; });
      };

      updateColorsRef.current = updateColors;
      updateColors(null, null);
    });

    // Invisible region spheres for raycasting only
    const allMeshes = [], meshMap = {};
    REGIONS.forEach(reg => {
      const add = (x, y, z) => {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(reg.r, 12, 12),
          new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.001,
            depthWrite: false,
            colorWrite: false,
          })
        );
        mesh.position.set(x, y, z);
        mesh.scale.set(...reg.scl);
        mesh.userData.regionId = reg.id;
        group.add(mesh);
        allMeshes.push(mesh);
        if (!meshMap[reg.id]) meshMap[reg.id] = [];
        meshMap[reg.id].push(mesh);
      };
      add(...reg.pos);
      if (reg.id === 'temporal') add(-reg.pos[0], reg.pos[1], reg.pos[2]);
    });

    meshMapRef.current = meshMap;

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.18, 0.45, 0.85);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    const raycaster = new THREE.Raycaster();
    const m2d = new THREE.Vector2();

    const toNDC = (cx, cy) => {
      const r = mount.getBoundingClientRect();
      return [((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1];
    };
    const raycast = (cx, cy) => {
      const [nx, ny] = toNDC(cx, cy);
      m2d.set(nx, ny);
      raycaster.setFromCamera(m2d, camera);
      const hits = raycaster.intersectObjects(allMeshes);
      return hits.length ? hits[0].object.userData.regionId : null;
    };

    const onDown = (cx, cy) => {
      st.isDragging = true; st.autoRotate = false;
      st.dnPos = { x: cx, y: cy }; st.prevPos = { x: cx, y: cy };
    };
    const onMove = (cx, cy) => {
      if (st.isDragging) {
        st.rotY += (cx - st.prevPos.x) * 0.008;
        st.rotX += (cy - st.prevPos.y) * 0.008;
        st.rotX = Math.max(-0.55, Math.min(0.55, st.rotX));
        st.prevPos = { x: cx, y: cy };
        return;
      }
      const id = raycast(cx, cy);
      if (id !== st.hoveredId) {
        st.hoveredId = id;
        onHover(id);
        mount.style.cursor = id ? 'pointer' : 'grab';
      }
    };
    const onUp = (cx, cy) => {
      if (!st.isDragging) return;
      st.isDragging = false;
      mount.style.cursor = 'grab';
      const d = Math.hypot(cx - st.dnPos.x, cy - st.dnPos.y);
      if (d < 6) {
        const id = raycast(cx, cy);
        onSelect(id || null);
      }
    };

    const mD = e => onDown(e.clientX, e.clientY);
    const mM = e => onMove(e.clientX, e.clientY);
    const mU = e => onUp(e.clientX, e.clientY);
    const tS = e => { const t = e.touches[0]; onDown(t.clientX, t.clientY); };
    const tM = e => { const t = e.touches[0]; onMove(t.clientX, t.clientY); };
    const tE = e => { const t = e.changedTouches[0]; onUp(t.clientX, t.clientY); };

    mount.addEventListener('mousedown', mD);
    window.addEventListener('mousemove', mM);
    window.addEventListener('mouseup', mU);
    mount.addEventListener('touchstart', tS, { passive: true });
    mount.addEventListener('touchmove', tM, { passive: true });
    mount.addEventListener('touchend', tE);
    mount.style.cursor = 'grab';

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (st.autoRotate) st.rotY += 0.003;
      group.rotation.y = st.rotY;
      group.rotation.x = st.rotX;
      composer.render();
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      mount.removeEventListener('mousedown', mD);
      window.removeEventListener('mousemove', mM);
      window.removeEventListener('mouseup', mU);
      mount.removeEventListener('touchstart', tS);
      mount.removeEventListener('touchmove', tM);
      mount.removeEventListener('touchend', tE);
      try { if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); } catch (e) { }
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (updateColorsRef.current) updateColorsRef.current(selected, hovered);
    const light = highlightLightRef.current;
    if (!light) return;
    if (selected) {
      const reg = REGIONS.find(r => r.id === selected);
      light.color.set(reg.bright); light.intensity = 1.0; light.position.set(...reg.pos); light.distance = 2.5;
    } else if (hovered) {
      const reg = REGIONS.find(r => r.id === hovered);
      light.color.set(reg.color); light.intensity = 0.4; light.position.set(...reg.pos); light.distance = 2.2;
    } else {
      light.intensity = 0;
    }
  }, [selected, hovered]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={mountRef}
        style={{ width: '100%', height: 460, borderRadius: 18, overflow: 'hidden',
          border: '1px solid rgba(91,141,217,0.18)',
          boxShadow: '0 0 60px rgba(91,141,217,0.08), 0 20px 40px rgba(0,0,0,0.4)' }}
      />
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: '#2A3A4A' }}>
        {hint || '↻ drag to rotate · click a region to explore'}
      </div>
    </div>
  );
}
