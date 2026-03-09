import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { REGIONS } from './data.js';

export default function BrainCanvas({ selected, hovered, onSelect, onHover }) {
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
    renderer.setClearColor(0x080D1A);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const key = new THREE.DirectionalLight(0xffeedd, 0.85);
    key.position.set(3, 4, 5); scene.add(key);
    const fill = new THREE.DirectionalLight(0x3355bb, 0.5);
    fill.position.set(-4, -1, -4); scene.add(fill);

    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1.68, 32, 32),
      new THREE.MeshPhongMaterial({ color: 0x1a3558, transparent: true, opacity: 0.13, side: THREE.BackSide, depthWrite: false })
    );
    shell.scale.set(1.0, 0.88, 1.12);
    scene.add(shell);

    const group = new THREE.Group();
    const allMeshes = [], meshMap = {};

    REGIONS.forEach(reg => {
      const add = (x, y, z) => {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(reg.r, 32, 32),
          new THREE.MeshPhongMaterial({ color: new THREE.Color(reg.color), shininess: 55, transparent: true, opacity: 0.88 })
        );
        mesh.position.set(x, y, z);
        mesh.scale.set(...reg.scl);
        mesh.userData.regionId = reg.id;
        group.add(mesh); allMeshes.push(mesh);
        if (!meshMap[reg.id]) meshMap[reg.id] = [];
        meshMap[reg.id].push(mesh);
      };
      add(...reg.pos);
      if (reg.id === 'temporal') add(-reg.pos[0], reg.pos[1], reg.pos[2]);
    });

    scene.add(group);
    meshMapRef.current = meshMap;

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
      renderer.render(scene, camera);
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
        mesh.material.opacity = isDim ? 0.22 : 0.88;
        mesh.material.emissive = mesh.material.emissive || new THREE.Color(0);
        mesh.material.emissive.set(isSel ? reg.bright : isHov ? reg.bright : 0x000000);
        mesh.material.emissive.multiplyScalar(isSel ? 0.22 : isHov ? 0.1 : 0);
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
        ↻ drag to rotate · click a region to explore
      </div>
    </div>
  );
}
