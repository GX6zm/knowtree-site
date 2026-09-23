import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { allNodes, categories, OINode } from './data/oiTree';

/* ───── Orbit Controls ───── */
class OrbitControls {
  camera: THREE.PerspectiveCamera;
  domElement: HTMLElement;
  target = new THREE.Vector3();
  enabled = true;
  enableDamping = true;
  dampingFactor = 0.06;
  rotateSpeed = 0.8;
  panSpeed = 0.6;

  private sph = new THREE.Spherical();
  private sphD = new THREE.Spherical();
  private panOff = new THREE.Vector3();
  private down = false;
  private btn = -1;
  private last = { x: 0, y: 0 };

  constructor(cam: THREE.PerspectiveCamera, el: HTMLElement) {
    this.camera = cam;
    this.domElement = el;
    this.bind();
  }

  private bind() {
    const el = this.domElement;
    el.addEventListener('pointerdown', this.onDown);
    el.addEventListener('pointermove', this.onMove);
    el.addEventListener('pointerup', this.onUp);
    el.addEventListener('wheel', this.onWheel, { passive: false });
    el.addEventListener('contextmenu', e => e.preventDefault());
  }

  private onDown = (e: PointerEvent) => {
    if (!this.enabled) return;
    this.down = true;
    this.btn = e.button;
    this.last = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  private onMove = (e: PointerEvent) => {
    if (!this.down || !this.enabled) return;
    const dx = e.clientX - this.last.x;
    const dy = e.clientY - this.last.y;
    this.last = { x: e.clientX, y: e.clientY };
    if (this.btn === 0) {
      this.sphD.theta -= dx * this.rotateSpeed * 0.008;
      this.sphD.phi -= dy * this.rotateSpeed * 0.008;
    } else if (this.btn === 2) {
      const off = new THREE.Vector3().copy(this.camera.position).sub(this.target);
      const d = off.length();
      const r = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 0);
      const u = new THREE.Vector3().setFromMatrixColumn(this.camera.matrix, 1);
      this.panOff.add(r.multiplyScalar(-dx * this.panSpeed * d * 0.0005));
      this.panOff.add(u.multiplyScalar(dy * this.panSpeed * d * 0.0005));
    }
  };

  private onUp = () => { this.down = false; this.btn = -1; };

  private onWheel = (e: WheelEvent) => {
    if (!this.enabled) return;
    e.preventDefault();
    const f = e.deltaY > 0 ? 1.08 : 0.92;
    const off = new THREE.Vector3().copy(this.camera.position).sub(this.target);
    off.multiplyScalar(f);
    const len = off.length();
    if (len > 8 && len < 400) this.camera.position.copy(this.target).add(off);
  };

  update() {
    const off = new THREE.Vector3().copy(this.camera.position).sub(this.target);
    this.sph.setFromVector3(off);
    const d = this.enableDamping ? this.dampingFactor : 1;
    this.sph.theta += this.sphD.theta * d;
    this.sph.phi += this.sphD.phi * d;
    this.sph.phi = Math.max(0.05, Math.min(Math.PI - 0.05, this.sph.phi));
    this.sph.makeSafe();
    off.setFromSpherical(this.sph);
    this.target.add(this.panOff);
    this.camera.position.copy(this.target).add(off);
    this.camera.lookAt(this.target);
    const decay = this.enableDamping ? 1 - this.dampingFactor : 0;
    this.sphD.theta *= decay;
    this.sphD.phi *= decay;
    this.panOff.multiplyScalar(decay);
  }

  reset() {
    this.target.set(0, 0, 0);
    this.camera.position.set(0, 50, 110);
    this.camera.lookAt(this.target);
    this.sphD.set(0, 0, 0);
    this.panOff.set(0, 0, 0);
  }
}

/* ───── Layout ───── */
function layoutNodes(nodes: OINode[]): Map<string, THREE.Vector3> {
  const pos = new Map<string, THREE.Vector3>();
  const groups = new Map<string, OINode[]>();
  nodes.forEach(n => {
    if (!groups.has(n.category)) groups.set(n.category, []);
    groups.get(n.category)!.push(n);
  });

  const catNames = Array.from(groups.keys());
  const N = catNames.length;
  const R = 45;

  let seed = 42;
  const srand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  catNames.forEach((cat, ci) => {
    const items = groups.get(cat)!;
    const a = (ci / N) * Math.PI * 2 - Math.PI / 2;
    const cx = Math.cos(a) * R;
    const cz = Math.sin(a) * R;

    items.sort((x, y) => x.level - y.level);

    items.forEach((node, ni) => {
      const y = (node.level - 1.5) * 14;
      const subA = (ni / items.length) * Math.PI * 2 + srand() * 0.5;
      const subR = 8 + srand() * 10;
      const x = cx + Math.cos(subA) * subR;
      const z = cz + Math.sin(subA) * subR;
      pos.set(node.id, new THREE.Vector3(x, y, z));
    });
  });
  return pos;
}

/* ───── Geometry by importance ───── */
function geoFor(imp: number): THREE.BufferGeometry {
  switch (imp) {
    case 5: return new THREE.IcosahedronGeometry(1.4, 1);
    case 4: return new THREE.DodecahedronGeometry(1.1, 0);
    case 3: return new THREE.OctahedronGeometry(0.95, 0);
    case 2: return new THREE.BoxGeometry(0.9, 0.9, 0.9);
    default: return new THREE.TetrahedronGeometry(0.8, 0);
  }
}

/* ───── Label sprite ───── */
function makeLabel(text: string, color: string): THREE.Sprite {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d')!;
  c.width = 512; c.height = 96;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.font = 'bold 32px "PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillText(text, 256, 48);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sp = new THREE.Sprite(mat);
  sp.scale.set(10, 2, 1);
  return sp;
}

/* ───── Tooltip ───── */
interface Tip { name: string; cat: string; desc: string; prereqs: string[]; level: number; x: number; y: number; }

/* ───── Scene Ref type ───── */
interface SceneRef {
  scene: THREE.Scene; cam: THREE.PerspectiveCamera;
  ren: THREE.WebGLRenderer; ctrl: OrbitControls;
  meshes: Map<string, THREE.Mesh>; positions: Map<string, THREE.Vector3>;
  labels: Map<string, THREE.Sprite>; rc: THREE.Raycaster;
  mouse: THREE.Vector2; touring: boolean; tourT: number;
  glowMeshes: THREE.Mesh[]; edges: THREE.Line[];
  highlightCat: string | null;
}

/* ───── Component ───── */
export default function OITreeScene() {
  const boxRef = useRef<HTMLDivElement>(null);
  const ref = useRef<SceneRef | null>(null);

  const [tip, setTip] = useState<Tip | null>(null);
  const [limit, setLimit] = useState(60);
  const [touring, setTouring] = useState(false);
  const [legendOpen, setLegendOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [highlightCat, setHighlightCat] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const init = useCallback(() => {
    if (!boxRef.current) return;
    const W = window.innerWidth, H = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a14);
    scene.fog = new THREE.FogExp2(0x060a14, 0.003);

    const cam = new THREE.PerspectiveCamera(55, W / H, 0.1, 800);
    cam.position.set(0, 50, 110);

    const ren = new THREE.WebGLRenderer({ antialias: true });
    ren.setSize(W, H);
    ren.setPixelRatio(Math.min(devicePixelRatio, 2));
    ren.toneMapping = THREE.ACESFilmicToneMapping;
    ren.toneMappingExposure = 1.2;
    boxRef.current.appendChild(ren.domElement);

    const ctrl = new OrbitControls(cam, ren.domElement);

    /* lights */
    scene.add(new THREE.AmbientLight(0x334466, 2));
    const dl = new THREE.DirectionalLight(0xffffff, 1.2);
    dl.position.set(60, 80, 40);
    scene.add(dl);
    const pl = new THREE.PointLight(0x22d3ee, 1.5, 200);
    pl.position.set(0, 40, 0);
    scene.add(pl);
    const pl2 = new THREE.PointLight(0xc084fc, 0.8, 180);
    pl2.position.set(-40, -20, 40);
    scene.add(pl2);

    /* layout */
    const positions = layoutNodes(allNodes);

    /* nodes */
    const meshes = new Map<string, THREE.Mesh>();
    const labels = new Map<string, THREE.Sprite>();
    const glowMeshes: THREE.Mesh[] = [];
    const edges: THREE.Line[] = [];

    allNodes.forEach(node => {
      const p = positions.get(node.id)!;
      const cat = categories.find(c => c.name === node.category);
      const col = new THREE.Color(cat?.color || '#fff');

      const g = geoFor(node.importance);
      const m = new THREE.MeshPhongMaterial({
        color: col, emissive: col.clone().multiplyScalar(0.35),
        shininess: 100, transparent: true, opacity: 0.92,
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.copy(p);
      mesh.userData = { id: node.id, node };
      scene.add(mesh);
      meshes.set(node.id, mesh);

      // Glow
      const glowG = new THREE.SphereGeometry(node.importance * 0.5 + 0.5, 12, 12);
      const glowM = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.07 });
      const glow = new THREE.Mesh(glowG, glowM);
      glow.position.copy(p);
      scene.add(glow);
      glowMeshes.push(glow);

      // Label
      const sp = makeLabel(node.name, cat?.color || '#fff');
      sp.position.copy(p);
      sp.position.y += 2.8;
      sp.visible = false;
      scene.add(sp);
      labels.set(node.id, sp);
    });

    /* edges */
    allNodes.forEach(node => {
      node.prerequisites.forEach(pid => {
        const fp = positions.get(pid);
        const tp = positions.get(node.id);
        if (!fp || !tp) return;
        const mid = new THREE.Vector3().lerpVectors(fp, tp, 0.5);
        mid.y += 2;
        const curve = new THREE.QuadraticBezierCurve3(fp, mid, tp);
        const pts = curve.getPoints(16);
        const g = new THREE.BufferGeometry().setFromPoints(pts);
        const cat = categories.find(c => c.name === node.category);
        const col = new THREE.Color(cat?.color || '#334');
        const mat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.15 });
        const line = new THREE.Line(g, mat);
        scene.add(line);
        edges.push(line);
      });
    });

    /* category ring labels */
    const catNames = Array.from(new Set(allNodes.map(n => n.category)));
    const catR = 45;
    catNames.forEach((name, i) => {
      const a = (i / catNames.length) * Math.PI * 2 - Math.PI / 2;
      const cat = categories.find(c => c.name === name);
      const sp = makeLabel(`「${name}」`, cat?.color || '#fff');
      sp.position.set(Math.cos(a) * (catR + 20), -30, Math.sin(a) * (catR + 20));
      sp.scale.set(16, 3, 1);
      scene.add(sp);
    });

    /* grid */
    const grid = new THREE.GridHelper(250, 50, 0x111827, 0x111827);
    grid.position.y = -32;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.25;
    scene.add(grid);

    /* particles */
    const pGeo = new THREE.BufferGeometry();
    const pN = 600;
    const pPos = new Float32Array(pN * 3);
    for (let i = 0; i < pN * 3; i++) pPos[i] = (Math.random() - 0.5) * 350;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x2244aa, size: 0.35, transparent: true, opacity: 0.35 });
    scene.add(new THREE.Points(pGeo, pMat));

    const rc = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    ref.current = {
      scene, cam, ren, ctrl, meshes, positions, labels, rc, mouse,
      touring: false, tourT: 0, glowMeshes, edges, highlightCat: null,
    };

    setReady(true);

    /* ── animate ── */
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      if (!ref.current) return;
      const dt = clock.getDelta();
      const t = clock.elapsedTime;
      const { ctrl: c, meshes: ms, labels: ls, glowMeshes: gs, cam: cm } = ref.current;

      c.update();

      ms.forEach(mesh => {
        mesh.rotation.y += 0.004;
        mesh.rotation.x += 0.002;
      });

      gs.forEach((g, i) => {
        const s = 1 + Math.sin(t * 1.5 + i * 0.3) * 0.12;
        g.scale.set(s, s, s);
      });

      // Label visibility
      const cp = cm.position;
      const dists: { id: string; d: number }[] = [];
      ms.forEach((m, id) => dists.push({ id, d: cp.distanceTo(m.position) }));
      dists.sort((a, b) => a.d - b.d);
      ls.forEach(sp => { sp.visible = false; });
      for (let i = 0; i < Math.min(limit, dists.length); i++) {
        const sp = ls.get(dists[i].id);
        if (sp) sp.visible = true;
      }

      // Tour
      if (ref.current.touring) {
        ref.current.tourT += dt * 0.15;
        const tt = ref.current.tourT;
        const r = 90;
        cm.position.x = Math.cos(tt) * r;
        cm.position.z = Math.sin(tt) * r;
        cm.position.y = 35 + Math.sin(tt * 1.5) * 25;
        cm.lookAt(0, 0, 0);
      }

      ren.render(scene, cm);
    };
    animate();

    /* ── events ── */
    const onResize = () => {
      const w = innerWidth, h = innerHeight;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      ren.setSize(w, h);
    };
    addEventListener('resize', onResize);

    const onMM = (e: PointerEvent) => {
      if (!ref.current) return;
      const { rc: r, mouse: m, cam: cm, meshes: ms } = ref.current;
      m.x = (e.clientX / innerWidth) * 2 - 1;
      m.y = -(e.clientY / innerHeight) * 2 + 1;
      r.setFromCamera(m, cm);
      const arr = Array.from(ms.values());
      const hits = r.intersectObjects(arr);

      ms.forEach(mesh => {
        const cat = categories.find(cc => cc.name === mesh.userData.node.category);
        const col = new THREE.Color(cat?.color || '#fff');
        (mesh.material as THREE.MeshPhongMaterial).emissive.copy(col.clone().multiplyScalar(0.35));
        mesh.scale.set(1, 1, 1);
      });

      if (hits.length > 0) {
        const h = hits[0].object as THREE.Mesh;
        const nd = h.userData.node as OINode;
        (h.material as THREE.MeshPhongMaterial).emissive.set(0xffffff);
        h.scale.set(1.4, 1.4, 1.4);
        const prereqNames = nd.prerequisites.map(pid => {
          const p = allNodes.find(n => n.id === pid);
          return p ? p.name : pid;
        });
        setTip({
          name: nd.name, cat: nd.category, desc: nd.description,
          prereqs: prereqNames, level: nd.level,
          x: e.clientX, y: e.clientY,
        });
      } else {
        setTip(null);
      }
    };
    ren.domElement.addEventListener('pointermove', onMM);

    return () => {
      removeEventListener('resize', onResize);
      ren.domElement.removeEventListener('pointermove', onMM);
      ren.dispose();
      if (boxRef.current?.contains(ren.domElement)) boxRef.current.removeChild(ren.domElement);
    };
  }, [limit]);

  useEffect(() => { const c = init(); return c; }, [init]);

  /* ── Highlight category ── */
  useEffect(() => {
    if (!ref.current) return;
    const { meshes: ms } = ref.current;
    ms.forEach(mesh => {
      const nd = mesh.userData.node as OINode;
      const cat = categories.find(c => c.name === nd.category);
      const col = new THREE.Color(cat?.color || '#fff');
      const mat = mesh.material as THREE.MeshPhongMaterial;

      if (highlightCat === null) {
        mat.opacity = 0.92;
        mat.emissive.copy(col.clone().multiplyScalar(0.35));
      } else if (nd.category === highlightCat) {
        mat.opacity = 1.0;
        mat.emissive.copy(col.clone().multiplyScalar(0.7));
      } else {
        mat.opacity = 0.15;
        mat.emissive.set(0x000000);
      }
    });
  }, [highlightCat]);

  /* ── Search highlight ── */
  useEffect(() => {
    if (!ref.current) return;
    const { meshes: ms, labels: ls } = ref.current;
    const q = search.trim().toLowerCase();
    
    ms.forEach(mesh => {
      const nd = mesh.userData.node as OINode;
      const cat = categories.find(c => c.name === nd.category);
      const col = new THREE.Color(cat?.color || '#fff');
      const mat = mesh.material as THREE.MeshPhongMaterial;
      const sp = ls.get(nd.id);

      if (!q) {
        if (highlightCat === null) {
          mat.opacity = 0.92;
          mat.emissive.copy(col.clone().multiplyScalar(0.35));
        }
        return;
      }

      const match = nd.name.toLowerCase().includes(q) || nd.category.toLowerCase().includes(q);
      if (match) {
        mat.opacity = 1.0;
        mat.emissive.copy(col.clone().multiplyScalar(0.8));
        mesh.scale.set(1.3, 1.3, 1.3);
        if (sp) sp.visible = true;
      } else {
        mat.opacity = 0.1;
        mat.emissive.set(0x000000);
        mesh.scale.set(0.7, 0.7, 0.7);
      }
    });
  }, [search, highlightCat]);

  const doReset = useCallback(() => {
    if (ref.current) { ref.current.ctrl.reset(); ref.current.touring = false; setTouring(false); }
    setHighlightCat(null);
    setSearch('');
  }, []);
  const doTour = useCallback(() => {
    if (!ref.current) return;
    ref.current.touring = !ref.current.touring;
    ref.current.tourT = 0;
    setTouring(v => !v);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') doReset(); };
    addEventListener('keydown', h);
    return () => removeEventListener('keydown', h);
  }, [doReset]);

  const totalN = allNodes.length;
  const totalC = categories.length;

  const handleCatClick = (catName: string) => {
    setHighlightCat(prev => prev === catName ? null : catName);
    setSearch('');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#060a14] select-none">
      <div ref={boxRef} className="absolute inset-0" />

      {/* ── Loading ── */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#060a14] z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />
            <p className="text-cyan-300 text-sm mt-4 animate-pulse">正在构建科技树...</p>
          </div>
        </div>
      )}

      {/* ── Title ── */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 pointer-events-auto">
        <h1 className="text-3xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            OI 科技树
          </span>
        </h1>
        <p className="text-[11px] text-gray-400 mt-1 tracking-wide">
          {totalN} 项技能 · 5 个阶段 · {totalC} 大领域 · 信息学竞赛知识图谱
        </p>
      </div>

      {/* ── Search ── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 搜索技能..."
            value={search}
            onChange={e => { setSearch(e.target.value); setHighlightCat(null); }}
            className="w-64 px-4 py-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
            >✕</button>
          )}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl text-white w-[230px] pointer-events-auto">
        <button
          className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-cyan-300"
          onClick={() => setLegendOpen(v => !v)}
        >
          <span>📋 领域图例</span>
          <span className="text-xs text-gray-400">{legendOpen ? '▾' : '▸'}</span>
        </button>

        {legendOpen && (
          <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
            {categories.map(cat => (
              <button
                key={cat.name}
                className={`flex items-center gap-2 py-[3px] w-full text-left rounded px-1 transition-all ${
                  highlightCat === cat.name ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
                onClick={() => handleCatClick(cat.name)}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all"
                  style={{
                    backgroundColor: cat.color,
                    boxShadow: highlightCat === cat.name ? `0 0 8px ${cat.color}` : `0 0 4px ${cat.color}40`
                  }} />
                <span className={`text-[11px] transition-all ${highlightCat === cat.name ? 'text-white font-medium' : 'text-gray-300'}`}>
                  {cat.name}
                </span>
                <span className="text-[10px] text-gray-600 ml-auto">{cat.items.length}</span>
              </button>
            ))}

            {highlightCat && (
              <button
                onClick={() => setHighlightCat(null)}
                className="mt-2 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                ✕ 取消筛选
              </button>
            )}

            <div className="border-t border-white/10 my-3" />
            <div className="text-[10px] text-gray-500 mb-1.5 font-medium">形状 = 重要度</div>
            <div className="text-[10px] text-gray-500 space-y-0.5 leading-relaxed">
              <div>⬡ 二十面体 · 核心基石</div>
              <div>⬠ 十二面体 · 领域支柱</div>
              <div>◇ 八面体 · 重要技能</div>
              <div>▢ 立方体 · 进阶内容</div>
              <div>△ 四面体 · 长尾补充</div>
            </div>

            <div className="border-t border-white/10 my-3" />
            <div className="text-[10px] text-gray-500 mb-1.5 font-medium">阶段 (Y轴高度)</div>
            <div className="text-[10px] text-gray-500 space-y-0.5">
              <div><span className="text-green-400">●</span> Lv.0 入门基础</div>
              <div><span className="text-blue-400">●</span> Lv.1 省选基础</div>
              <div><span className="text-yellow-400">●</span> Lv.2 省选提高</div>
              <div><span className="text-orange-400">●</span> Lv.3 国赛 / 集训队</div>
            </div>

            <div className="border-t border-white/10 my-3" />
            <div className="text-[10px] text-gray-500 mb-1 font-medium">名称显示上限</div>
            <div className="flex items-center gap-2">
              <input type="range" min={0} max={totalN} value={limit}
                onChange={e => setLimit(+e.target.value)}
                className="flex-1 h-1 accent-cyan-400" />
              <span className="text-[10px] text-cyan-300 w-7 text-right">{limit}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Toolbar ── */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-auto">
        <button onClick={doTour}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            touring
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-105'
              : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10'
          }`}>
          {touring ? '⏸ 停止漫游' : '▶ 漫游动画'}
        </button>
        <button onClick={doReset}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all">
          ⟲ 重置视角
        </button>
      </div>

      {/* ── Hint ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-gray-600 tracking-wide">
        拖拽旋转 · 滚轮缩放 · 右键平移 · 悬停查看信息 · 点击图例筛选领域 · Esc 重置
      </div>

      {/* ── Tooltip ── */}
      {tip && (
        <div className="absolute pointer-events-none z-50 max-w-[300px]"
          style={{ left: Math.min(tip.x + 16, innerWidth - 320), top: Math.max(tip.y - 10, 10) }}>
          <div className="bg-black/80 backdrop-blur-xl border border-white/15 rounded-xl px-4 py-3 shadow-2xl">
            <div className="font-bold text-sm text-white">{tip.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">{tip.cat}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                Lv.{tip.level}
              </span>
            </div>
            <div className="text-[11px] text-gray-300 mt-2 leading-relaxed">{tip.desc}</div>
            {tip.prereqs.length > 0 && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="text-[10px] text-gray-500">前置: {tip.prereqs.join('、')}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
