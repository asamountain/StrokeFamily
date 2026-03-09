import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { REGIONS } from './data.js';

export default function BrainCanvas({ selected, hovered, onSelect, onHover, hint }) {
  const mountRef = useRef(null);
  const stRef = useRef({
    rotY: 0.3, rotX: 0.05,
    isDragging: false, autoRotate: true,
    dnPos: null, prevPos: null, hoveredId: null
  });
  const meshMapRef = useRef({});

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

    // Lighting — 4-light photographic rig
    scene.add(new THREE.AmbientLight(0xffffff, 0.28));

    const key = new THREE.DirectionalLight(0xfff4e8, 1.4);
    key.position.set(4, 5, 6);
    key.castShadow = true;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x3355cc, 0.55);
    fill.position.set(-5, -2, -4);
    scene.add(fill);

    // Rim light — separates brain from background, adds depth
    const rim = new THREE.DirectionalLight(0xffffff, 0.7);
    rim.position.set(1, 2, -6);
    scene.add(rim);

    // Inner point light — simulates subsurface tissue translucency
    const inner = new THREE.PointLight(0xff9966, 0.45, 4.5);
    inner.position.set(0, 0, 0);
    scene.add(inner);

    // Brain shell — dura mater: slight clearcoat gloss, wet membrane
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1.68, 48, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0x1a3060,
        transparent: true,
        opacity: 0.11,
        side: THREE.BackSide,
        depthWrite: false,
        roughness: 0.15,
        metalness: 0.05,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
      })
    );
    shell.scale.set(1.0, 0.88, 1.12);
    scene.add(shell);

    const group = new THREE.Group();
    const allMeshes = [], meshMap = {};

    REGIONS.forEach(reg => {
      const add = (x, y, z) => {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(reg.r, 48, 48),
          new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(reg.color),
            roughness: 0.60,
            metalness: 0.0,
            clearcoat: 0.22,
            clearcoatRoughness: 0.35,
            transparent: true,
            opacity: 0.92,
          })
        );
        mesh.position.set(x, y, z);
        mesh.scale.set(...reg.scl);
        mesh.userData.regionId = reg.id;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh); allMeshes.push(mesh);
        if (!meshMap[reg.id]) meshMap[reg.id] = [];
        meshMap[reg.id].push(mesh);
      };
      add(...reg.pos);
      if (reg.id === 'temporal') add(-reg.pos[0], reg.pos[1], reg.pos[2]);
    });

    scene.add(group);
    meshMapRef.current = meshMap;

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.38, 0.55, 0.72);
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
      shell.rotation.y = st.rotY * 0.4;
      composer.render();
    };
    animate();

    return () => {
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
    const meshMap = meshMapRef.current;
    REGIONS.forEach(reg => {
      (meshMap[reg.id] || []).forEach(mesh => {
        const isSel = selected === reg.id;
        const isHov = hovered === reg.id;
        const isDim = selected && !isSel;
        mesh.material.color.set(isSel || isHov ? reg.bright : reg.color);
        mesh.material.opacity = isDim ? 0.22 : 0.92;
        mesh.material.emissive = mesh.material.emissive || new THREE.Color(0);
        mesh.material.emissive.set(isSel ? reg.bright : isHov ? reg.bright : 0x000000);
        mesh.material.emissive.multiplyScalar(isSel ? 0.28 : isHov ? 0.14 : 0);
      });
    });
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
