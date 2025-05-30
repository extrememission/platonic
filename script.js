// --- Complete Platonic solids data ---
const SOLIDS = {
  tetrahedron: {
    name: "Tetrahedron",
    symbol: "T",
    vertices: [
      [1, 1, 1],
      [-1, -1, 1],
      [-1, 1, -1],
      [1, -1, -1]
    ],
    faces: [
      [0, 1, 2],
      [0, 3, 1],
      [0, 2, 3],
      [1, 3, 2]
    ],
    info: `
<strong>Tetrahedron | T</strong><br>
Platonic solid<br><br>
<b>Vertices</b><br>4<br>
<b>Edges</b><br>6<br>
<b>Faces</b><br>4<br>
<b>Vertex configuration</b><br>3.3.3<br>
<b>Faces by type</b><br>4 triangles<br>
<b>Volume</b><br>≈0.118s³<br>
<b>Surface area</b><br>≈1.732s²<br>
<b>Sphericity</b><br>≈0.671<br>
<b>Symmetry</b><br>Full tetrahedral, Td<br>
<b>Order</b><br>24<br>
<b>Properties</b><br>deltahedron<br>
<b>Also known as</b><br>triangular pyramid, digonal antiprism, disphenoid
`
  },
  cube: {
    name: "Cube",
    symbol: "C",
    vertices: [
      [-1, -1, -1],
      [-1, -1, 1],
      [-1, 1, -1],
      [-1, 1, 1],
      [1, -1, -1],
      [1, -1, 1],
      [1, 1, -1],
      [1, 1, 1]
    ],
    faces: [
      [0,1,3,2],
      [4,6,7,5],
      [0,4,5,1],
      [2,3,7,6],
      [0,2,6,4],
      [1,5,7,3]
    ],
    info: `
<strong>Cube | C</strong><br>
Platonic solid<br><br>
<b>Vertices</b><br>8<br>
<b>Edges</b><br>12<br>
<b>Faces</b><br>6<br>
<b>Vertex configuration</b><br>4.4.4<br>
<b>Faces by type</b><br>6 squares<br>
<b>Volume</b><br>s³<br>
<b>Surface area</b><br>6s²<br>
<b>Sphericity</b><br>≈0.806<br>
<b>Symmetry</b><br>Full octahedral, Oh<br>
<b>Order</b><br>48<br>
<b>Properties</b><br>zonohedron, regular hexahedron<br>
<b>Also known as</b><br>regular hexahedron
`
  },
  octahedron: {
    name: "Octahedron",
    symbol: "O",
    vertices: [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1]
    ],
    faces: [
      [0,2,4],
      [2,1,4],
      [1,3,4],
      [3,0,4],
      [0,5,2],
      [2,5,1],
      [1,5,3],
      [3,5,0]
    ],
    info: `
<strong>Octahedron | O</strong><br>
Platonic solid<br><br>
<b>Vertices</b><br>6<br>
<b>Edges</b><br>12<br>
<b>Faces</b><br>8<br>
<b>Vertex configuration</b><br>4.4.4<br>
<b>Faces by type</b><br>8 triangles<br>
<b>Volume</b><br>≈0.471s³<br>
<b>Surface area</b><br>≈3.464s²<br>
<b>Sphericity</b><br>≈0.846<br>
<b>Symmetry</b><br>Full octahedral, Oh<br>
<b>Order</b><br>48<br>
<b>Properties</b><br>deltahedron<br>
<b>Also known as</b><br>regular octahedron
`
  },
  dodecahedron: {
    name: "Dodecahedron",
    symbol: "D",
    vertices: (function(){
      const PHI = (1 + Math.sqrt(5)) / 2;
      const a = 1/PHI, b = 1;
      return [
        [ 0,  b,  a], [ 0,  b, -a], [ 0, -b,  a], [ 0, -b, -a],
        [ a,  0,  b], [ a,  0, -b], [-a,  0,  b], [-a,  0, -b],
        [ b,  a,  0], [ b, -a,  0], [-b,  a,  0], [-b, -a,  0],
        [ 1,  1,  1], [ 1,  1, -1], [ 1, -1,  1], [ 1, -1, -1],
        [-1,  1,  1], [-1,  1, -1], [-1, -1,  1], [-1, -1, -1]
      ];
    })(),
    faces: [
      [0,2,14,4,12], [0,12,8,16,6], [0,6,18,2,0], [2,18,9,15,14], [4,14,15,5,13],
      [12,4,13,1,8], [8,1,17,16,8], [6,16,17,10,18], [18,10,11,9,18], [14,15,9,11,4],
      [1,13,5,7,17], [17,7,11,10,17]
    ],
    info: `
<strong>Dodecahedron | D</strong><br>
Platonic solid<br><br>
<b>Vertices</b><br>20<br>
<b>Edges</b><br>30<br>
<b>Faces</b><br>12<br>
<b>Vertex configuration</b><br>3.3.3.3.3<br>
<b>Faces by type</b><br>12 pentagons<br>
<b>Volume</b><br>≈7.663s³<br>
<b>Surface area</b><br>≈20.646s²<br>
<b>Sphericity</b><br>≈0.910<br>
<b>Symmetry</b><br>Full icosahedral, Ih<br>
<b>Order</b><br>120<br>
<b>Properties</b><br>zonohedron<br>
<b>Also known as</b><br>regular dodecahedron
`
  },
  icosahedron: {
    name: "Icosahedron",
    symbol: "I",
    vertices: (function(){
      const PHI = (1 + Math.sqrt(5)) / 2;
      return [
        [0, 1, PHI], [0, -1, PHI], [0, 1, -PHI], [0, -1, -PHI],
        [1, PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [-1, -PHI, 0],
        [PHI, 0, 1], [-PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, -1]
      ];
    })(),
    faces: [
      [0,1,8],[0,8,4],[0,4,5],[0,5,9],[0,9,1],
      [1,9,7],[1,7,6],[1,6,8],[2,3,10],[2,10,4],
      [2,4,5],[2,5,11],[2,11,3],[3,11,7],[3,7,6],
      [3,6,10],[4,8,10],[5,9,11],[6,7,11],[8,6,10]
    ],
    info: `
<strong>Icosahedron | I</strong><br>
Platonic solid<br><br>
<b>Vertices</b><br>12<br>
<b>Edges</b><br>30<br>
<b>Faces</b><br>20<br>
<b>Vertex configuration</b><br>5.5.5<br>
<b>Faces by type</b><br>20 triangles<br>
<b>Volume</b><br>≈2.1817s³<br>
<b>Surface area</b><br>≈8.660s²<br>
<b>Sphericity</b><br>≈0.939<br>
<b>Symmetry</b><br>Full icosahedral, Ih<br>
<b>Order</b><br>120<br>
<b>Properties</b><br>deltahedron<br>
<b>Also known as</b><br>regular icosahedron
`
  }
};

let scene, camera, renderer, controls, directionalLight;
let mainSolidType = 'octahedron';
let mainSolidGroup = null;
let currentExplode = 0;
let currentRotationSpeed = 0.01;
let currentRotationDirection = 1;
let currentSize = 1;
let currentHue = 200, currentSaturation = 70, currentLightness = 70;
let currentTransparency = 0;
let currentWireframe = false;
let miniScenes = [];
let isDarkMode = false;

function init() {
  const container = document.getElementById('renderCanvas');
  const width = window.innerWidth;
  const height = window.innerHeight - 120;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 2, 8);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  initMiniScenes();
  updateMainSolid();

  document.getElementById('darkModeToggle').addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark', isDarkMode);
    scene.background = isDarkMode ? new THREE.Color(0x181a20) : new THREE.Color(0xf5f5f5);
    directionalLight.intensity = isDarkMode ? 0.45 : 0.8;
    directionalLight.color.set(isDarkMode ? 0xccccff : 0xffffff);
    updateMainSolid();
  });

  document.getElementById('hue').addEventListener('input', updateMainSolid);
  document.getElementById('saturation').addEventListener('input', updateMainSolid);
  document.getElementById('lightness').addEventListener('input', updateMainSolid);
  document.getElementById('transparency').addEventListener('input', updateMainSolid);
  document.getElementById('size').addEventListener('input', updateMainSolid);
  document.getElementById('rotationSpeed').addEventListener('input', updateSpeed);
  document.getElementById('rotationDirection').addEventListener('change', updateSpeed);
  document.getElementById('explode').addEventListener('input', updateExplode);
  document.getElementById('wireframe').addEventListener('change', updateMainSolid);

  const controlsModal = document.getElementById('controlsModal');
  const hideControlsBtn = document.getElementById('hideControlsBtn');
  const showControlsBtn = document.getElementById('showControlsBtn');

  showControlsBtn.addEventListener('click', () => {
    controlsModal.classList.add('active');
  });
  hideControlsBtn.addEventListener('click', () => {
    controlsModal.classList.remove('active');
  });

  window.addEventListener('resize', onWindowResize);
  animate();
}

function initMiniScenes() {
  const solidTypes = [
    { type: 'tetrahedron', geo: () => new THREE.TetrahedronGeometry(0.8, 0), color: 0x00a8ff },
    { type: 'cube', geo: () => new THREE.BoxGeometry(1.2, 1.2, 1.2), color: 0x4cd137 },
    { type: 'octahedron', geo: () => new THREE.OctahedronGeometry(0.8, 0), color: 0xe84118 },
    { type: 'dodecahedron', geo: () => new THREE.DodecahedronGeometry(0.8, 0), color: 0x9c88ff },
    { type: 'icosahedron', geo: () => new THREE.IcosahedronGeometry(0.8, 0), color: 0xfbc531 }
  ];

  const wrappers = document.querySelectorAll('.solid-wrapper');
  wrappers.forEach((wrapper, i) => {
    const type = solidTypes[i];
    const canvas = wrapper.querySelector('.solid-preview');
    const miniRenderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    miniRenderer.setSize(canvas.width, canvas.height);

    const miniScene = new THREE.Scene();
    miniScene.background = null;

    const miniCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
    miniCamera.position.z = 2;

    const miniLight = new THREE.DirectionalLight(0xffffff, 1);
    miniLight.position.set(1, 1, 1);
    miniScene.add(miniLight);
    miniScene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const miniMesh = new THREE.Mesh(
      type.geo(),
      new THREE.MeshStandardMaterial({
        color: type.color,
        roughness: 0.3,
        metalness: 0.5,
        flatShading: false
      })
    );
    miniScene.add(miniMesh);

    miniScenes.push({ scene: miniScene, camera: miniCamera, mesh: miniMesh, renderer: miniRenderer });

    wrapper.addEventListener('click', () => {
      mainSolidType = type.type;
      updateMainSolid();
    });
  });
}

function animateMiniScenes() {
  miniScenes.forEach(({ scene, camera, mesh, renderer }) => {
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
  });
  requestAnimationFrame(animateMiniScenes);
}
animateMiniScenes();

function updateMainSolid() {
  if (mainSolidGroup) scene.remove(mainSolidGroup);

  currentHue = parseInt(document.getElementById('hue').value);
  currentSaturation = parseInt(document.getElementById('saturation').value);
  currentLightness = parseInt(document.getElementById('lightness').value);
  currentTransparency = parseInt(document.getElementById('transparency').value) / 100;
  currentSize = parseFloat(document.getElementById('size').value);
  currentWireframe = document.getElementById('wireframe').checked;

  const solid = SOLIDS[mainSolidType];
  const vertices = solid.vertices.map(v => new THREE.Vector3(...v).normalize().multiplyScalar(currentSize * 1.3));
  mainSolidGroup = new THREE.Group();
  mainSolidGroup.position.set(0, 1, 0);

  solid.faces.forEach(faceVerts => {
    // Compute face center
    let faceCenter = new THREE.Vector3();
    faceVerts.forEach(idx => faceCenter.add(vertices[idx]));
    faceCenter.divideScalar(faceVerts.length);

    // Build face geometry relative to center
    let facePoints = faceVerts.map(idx => vertices[idx].clone().sub(faceCenter));
    let geo = new THREE.BufferGeometry().setFromPoints(facePoints);
    let indices = [];
    for (let i = 1; i < facePoints.length - 1; i++) {
      indices.push(0, i, i + 1);
    }
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const color = new THREE.Color(`hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`);
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.5,
      flatShading: false,
      transparent: true,
      opacity: 1 - currentTransparency,
      wireframe: currentWireframe
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(faceCenter);

    // Face normal
    let normal = new THREE.Vector3();
    if (facePoints.length >= 3) {
      normal.subVectors(facePoints[1], facePoints[0])
        .cross(new THREE.Vector3().subVectors(facePoints[2], facePoints[0]))
        .normalize();
    }
    mesh.userData = {
      center: faceCenter.clone(),
      normal: normal.clone()
    };

    const edgeGeo = new THREE.EdgesGeometry(geo, 1);
    const edgeMat = new THREE.LineBasicMaterial({ color: isDarkMode ? 0xffffff : 0x222222, linewidth: 2 });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    edgeLines.renderOrder = 1;
    mesh.add(edgeLines);

    mainSolidGroup.add(mesh);
  });

  scene.add(mainSolidGroup);
  updateExplode();
  updateSolidInfo();
}

function updateExplode() {
  currentExplode = parseFloat(document.getElementById('explode').value);
  if (!mainSolidGroup) return;
  mainSolidGroup.children.forEach(face => {
    const { center, normal } = face.userData;
    face.position.copy(center).add(normal.clone().multiplyScalar(currentExplode));
  });
}

function updateSpeed() {
  currentRotationSpeed = parseFloat(document.getElementById('rotationSpeed').value);
  currentRotationDirection = parseInt(document.getElementById('rotationDirection').value);
}

function updateLight() {
  const x = parseFloat(document.getElementById('lightX').value);
  const y = parseFloat(document.getElementById('lightY').value);
  const z = parseFloat(document.getElementById('lightZ').value);
  directionalLight.position.set(x, y, z);
}

function updateSolidInfo() {
  document.getElementById('solidInfo').innerHTML = SOLIDS[mainSolidType].info;
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight - 120;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (mainSolidGroup) {
    mainSolidGroup.rotation.y += currentRotationSpeed * currentRotationDirection;
  }
  renderer.render(scene, camera);
}

init();
