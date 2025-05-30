let scene, camera, renderer, controls, mainSolid, directionalLight, transformControls;
let isDarkMode = false;
let mainSolidType = 'octahedron';
let mainSolidMaterial;
let currentHue = 200, currentSaturation = 70, currentLightness = 70;
let miniScenes = [];

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

  mainSolidMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 0.5,
    flatShading: false
  });
  updateMaterial();

  // Initialize mini preview scenes
  initMiniScenes();

  // Initialize main solid (octahedron by default)
  updateMainSolid();

  // Dark mode toggle
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark', isDarkMode);
    scene.background = isDarkMode ? new THREE.Color(0x111111) : new THREE.Color(0xf5f5f5);
  });

  // Controls
  document.getElementById('hue').addEventListener('input', updateMaterial);
  document.getElementById('saturation').addEventListener('input', updateMaterial);
  document.getElementById('lightness').addEventListener('input', updateMaterial);
  document.getElementById('lightX').addEventListener('input', updateLight);
  document.getElementById('lightY').addEventListener('input', updateLight);
  document.getElementById('lightZ').addEventListener('input', updateLight);

  // Gizmo Controls
  document.getElementById('moveBtn').addEventListener('click', () => {
    transformControls.setMode('translate');
  });
  document.getElementById('rotateBtn').addEventListener('click', () => {
    transformControls.setMode('rotate');
  });
  document.getElementById('scaleBtn').addEventListener('click', () => {
    transformControls.setMode('scale');
  });

  // Add TransformControls (gizmo)
  transformControls = new THREE.TransformControls(camera, renderer.domElement);
  scene.add(transformControls);

  window.addEventListener('resize', onWindowResize);
  animate();
}

function initMiniScenes() {
  const solidTypes = [
    { type: 'tetrahedron', geo: () => new THREE.TetrahedronGeometry(1, 0), color: 0x00a8ff },
    { type: 'cube', geo: () => new THREE.BoxGeometry(1.8, 1.8, 1.8), color: 0x4cd137 },
    { type: 'octahedron', geo: () => new THREE.OctahedronGeometry(1.2, 0), color: 0xe84118 },
    { type: 'dodecahedron', geo: () => new THREE.DodecahedronGeometry(1, 0), color: 0x9c88ff },
    { type: 'icosahedron', geo: () => new THREE.IcosahedronGeometry(1, 0), color: 0xfbc531 }
  ];

  document.querySelectorAll('.solid-wrapper').forEach((wrapper, i) => {
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
    miniCamera.position.z = 3;

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

function updateMaterial() {
  currentHue = parseInt(document.getElementById('hue').value);
  currentSaturation = parseInt(document.getElementById('saturation').value);
  currentLightness = parseInt(document.getElementById('lightness').value);
  const color = new THREE.Color(`hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`);
  mainSolidMaterial.color = color;
  if (mainSolid) mainSolid.material = mainSolidMaterial;
}

function updateMainSolid() {
  if (mainSolid) scene.remove(mainSolid);

  let geometry;
  if (mainSolidType === 'tetrahedron') geometry = new THREE.TetrahedronGeometry(1, 0);
  else if (mainSolidType === 'cube') geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
  else if (mainSolidType === 'octahedron') geometry = new THREE.OctahedronGeometry(1.2, 0);
  else if (mainSolidType === 'dodecahedron') geometry = new THREE.DodecahedronGeometry(1, 0);
  else if (mainSolidType === 'icosahedron') geometry = new THREE.IcosahedronGeometry(1, 0);

  mainSolid = new THREE.Mesh(geometry, mainSolidMaterial);
  mainSolid.position.set(0, 1, 0);
  scene.add(mainSolid);
  transformControls.attach(mainSolid);
}

function updateLight() {
  const x = parseFloat(document.getElementById('lightX').value);
  const y = parseFloat(document.getElementById('lightY').value);
  const z = parseFloat(document.getElementById('lightZ').value);
  directionalLight.position.set(x, y, z);
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
  renderer.render(scene, camera);
}

init();
