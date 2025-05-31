let scene, camera, renderer, controls, directionalLight;
let mainSolidType = 'tetrahedron';
let mainSolidMesh = null;
let currentRotationSpeed = 0.01;
let currentRotationDirection = 1;
let currentSize = 1;
let currentHue = 200, currentSaturation = 70, currentLightness = 70;
let currentTransparency = 0;
let currentWireframe = false;
let miniScenes = [];
let isDarkMode = false;

// Solids in order: Platonic first, then others
const solidTypes = [
  { type: 'tetrahedron', name: 'Tetrahedron', color: 0x7f8c8d, info: 'A tetrahedron with four triangular faces.' },
  { type: 'cube', name: 'Cube', color: 0x00a8ff, info: 'A cube with six square faces.' },
  { type: 'octahedron', name: 'Octahedron', color: 0xe74c3c, info: 'An octahedron with eight triangular faces.' },
  { type: 'dodecahedron', name: 'Dodecahedron', color: 0x8e44ad, info: 'A dodecahedron with twelve pentagonal faces.' },
  { type: 'icosahedron', name: 'Icosahedron', color: 0x2ecc71, info: 'An icosahedron with twenty triangular faces.' },
  { type: 'box', name: 'Box', color: 0x00a8ff, info: 'A 3D box with six faces.' },
  { type: 'sphere', name: 'Sphere', color: 0x4cd137, info: 'A 3D sphere.' },
  { type: 'cylinder', name: 'Cylinder', color: 0xe84118, info: 'A 3D cylinder.' },
  { type: 'cone', name: 'Cone', color: 0x9c88ff, info: 'A 3D cone.' },
  { type: 'torus', name: 'Torus', color: 0xfbc531, info: 'A 3D torus (donut).' },
  { type: 'torusKnot', name: 'Torus Knot', color: 0x00d2d3, info: 'A 3D torus knot.' }
];

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

  const infoModal = document.getElementById('infoModal');
  const showInfoBtn = document.getElementById('showInfoBtn');
  const hideInfoBtn = document.getElementById('hideInfoBtn');
  showInfoBtn.addEventListener('click', () => {
    infoModal.classList.add('active');
  });
  hideInfoBtn.addEventListener('click', () => {
    infoModal.classList.remove('active');
  });

  window.addEventListener('resize', onWindowResize);
  resizeThreeCanvas();
  animate();
}

function initMiniScenes() {
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

    let geometry;
    switch(type.type) {
      case 'tetrahedron':
        geometry = new THREE.TetrahedronGeometry(0.8, 0);
        break;
      case 'cube':
        geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(0.8, 0);
        break;
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(0.8, 0);
        break;
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(0.8, 0);
        break;
      case 'box':
        geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(0.6, 1.2, 32);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
        break;
      case 'torusKnot':
        geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
        break;
    }

    const miniMesh = new THREE.Mesh(
      geometry,
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
  if (mainSolidMesh) scene.remove(mainSolidMesh);

  currentHue = parseInt(document.getElementById('hue').value);
  currentSaturation = parseInt(document.getElementById('saturation').value);
  currentLightness = parseInt(document.getElementById('lightness').value);
  currentTransparency = parseInt(document.getElementById('transparency').value) / 100;
  currentSize = parseFloat(document.getElementById('size').value);
  currentWireframe = document.getElementById('wireframe').checked;

  let geometry;
  switch(mainSolidType) {
    case 'tetrahedron':
      geometry = new THREE.TetrahedronGeometry(currentSize * 1.3, 0);
      break;
    case 'cube':
      geometry = new THREE.BoxGeometry(currentSize * 1.3, currentSize * 1.3, currentSize * 1.3);
      break;
    case 'octahedron':
      geometry = new THREE.OctahedronGeometry(currentSize * 1.3, 0);
      break;
    case 'dodecahedron':
      geometry = new THREE.DodecahedronGeometry(currentSize * 1.3, 0);
      break;
    case 'icosahedron':
      geometry = new THREE.IcosahedronGeometry(currentSize * 1.3, 0);
      break;
    case 'box':
      geometry = new THREE.BoxGeometry(currentSize * 1.3, currentSize * 1.3, currentSize * 1.3);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(currentSize * 0.9, 32, 32);
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(currentSize * 0.7, currentSize * 0.7, currentSize * 1.4, 32);
      break;
    case 'cone':
      geometry = new THREE.ConeGeometry(currentSize * 0.7, currentSize * 1.4, 32);
      break;
    case 'torus':
      geometry = new THREE.TorusGeometry(currentSize * 0.7, currentSize * 0.2, 16, 100);
      break;
    case 'torusKnot':
      geometry = new THREE.TorusKnotGeometry(currentSize * 0.7, currentSize * 0.2, 100, 16);
      break;
  }

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

  mainSolidMesh = new THREE.Mesh(geometry, mat);
  mainSolidMesh.position.set(0, 1, 0);
  scene.add(mainSolidMesh);

  // Update info panel
  const solidInfo = solidTypes.find(s => s.type === mainSolidType);
  document.getElementById('solidInfo').innerHTML = `
    <strong>${solidInfo.name}</strong><br>
    ${solidInfo.info}
  `;
}

function updateSpeed() {
  currentRotationSpeed = parseFloat(document.getElementById('rotationSpeed').value);
  currentRotationDirection = parseInt(document.getElementById('rotationDirection').value);
}

function updateLight() {
  const x = parseFloat(document.getElementById('lightX')?.value || 1);
  const y = parseFloat(document.getElementById('lightY')?.value || 1);
  const z = parseFloat(document.getElementById('lightZ')?.value || 1);
  directionalLight.position.set(x, y, z);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight - 120;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  renderer.domElement.style.width = width + "px";
  renderer.domElement.style.height = height + "px";
}

function resizeThreeCanvas() {
  const width = window.innerWidth;
  const height = window.innerHeight - 120;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  renderer.domElement.style.width = width + "px";
  renderer.domElement.style.height = height + "px";
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (mainSolidMesh) {
    mainSolidMesh.rotation.y += currentRotationSpeed * currentRotationDirection;
  }
  renderer.render(scene, camera);
}

init();
