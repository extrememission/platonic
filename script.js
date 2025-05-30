let scene, camera, renderer, controls, mainSolid, smallSolids = [];
let isDarkMode = false;
let mainSolidType = 'octahedron';
let mainSolidMaterial, directionalLight;
let currentExplode = 0;
let currentRotationSpeed = 0.01;
let currentRotationDirection = 1;
let currentSize = 1;
let currentHue = 200, currentSaturation = 70, currentLightness = 70;

// Initialize the scene
function init() {
  const container = document.getElementById('renderCanvas');
  const width = window.innerWidth;
  const height = window.innerHeight - 120; // Account for footer

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

  // Create small solids in the footer
  const solidTypes = [
    { type: 'tetrahedron', geo: new THREE.TetrahedronGeometry(1, 0) },
    { type: 'cube', geo: new THREE.BoxGeometry(1.8, 1.8, 1.8) },
    { type: 'octahedron', geo: new THREE.OctahedronGeometry(1.2, 0) },
    { type: 'dodecahedron', geo: new THREE.DodecahedronGeometry(1, 0) },
    { type: 'icosahedron', geo: new THREE.IcosahedronGeometry(1, 0) }
  ];
  const spacing = 2.5;
  const startX = -spacing * (solidTypes.length - 1) / 2;

  solidTypes.forEach((solid, i) => {
    const preview = document.querySelector(`.solid-preview:nth-child(${i+1})`);
    const canvas = createSolidCanvas(solid.type);
    preview.appendChild(canvas);

    const mesh = new THREE.Mesh(
      solid.geo,
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.5,
        flatShading: false
      })
    );
    mesh.position.x = startX + i * spacing;
    mesh.position.y = -2.5;
    mesh.position.z = 0;
    mesh.scale.set(0.3, 0.3, 0.3);
    mesh.userData.type = solid.type;
    scene.add(mesh);
    smallSolids.push(mesh);

    document.querySelectorAll('.solid-wrapper')[i].addEventListener('click', () => {
      mainSolidType = solid.type;
      updateMainSolid();
    });
  });

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
  document.getElementById('size').addEventListener('input', updateMainSolid);
  document.getElementById('rotationSpeed').addEventListener('input', updateSpeed);
  document.getElementById('rotationDirection').addEventListener('change', updateSpeed);
  document.getElementById('explode').addEventListener('input', updateExplode);
  document.getElementById('lightX').addEventListener('input', updateLight);
  document.getElementById('lightY').addEventListener('input', updateLight);
  document.getElementById('lightZ').addEventListener('input', updateLight);

  window.addEventListener('resize', onWindowResize);
  animate();
}

function createSolidCanvas(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 60;
  canvas.height = 60;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, 60, 60);
  // (Note: This is a placeholder. For a real preview, render the solid using a mini Three.js scene, but for simplicity, we use a colored rectangle here.)
  // For production, you could use Three.js offscreen rendering for each preview, but that's complex.
  // As a placeholder, we use a color swatch.
  ctx.fillStyle = getSolidColor(type);
  ctx.beginPath();
  ctx.arc(30, 30, 25, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
}

function getSolidColor(type) {
  // Simple mapping for preview color
  const colors = {
    tetrahedron: '#00a8ff',
    cube: '#4cd137',
    octahedron: '#e84118',
    dodecahedron: '#9c88ff',
    icosahedron: '#fbc531'
  };
  return colors[type];
}

function updateMaterial() {
  currentHue = parseInt(document.getElementById('hue').value);
  currentSaturation = parseInt(document.getElementById('saturation').value);
  currentLightness = parseInt(document.getElementById('lightness').value);
  const color = new THREE.Color(`hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`);
  mainSolidMaterial.color = color;
  if (mainSolid) mainSolid.material = mainSolidMaterial;
}

function updateMainSolid() {
  currentSize = parseFloat(document.getElementById('size').value);
  if (mainSolid) scene.remove(mainSolid);

  let geometry;
  if (mainSolidType === 'tetrahedron') geometry = new THREE.TetrahedronGeometry(1, 0);
  else if (mainSolidType === 'cube') geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
  else if (mainSolidType === 'octahedron') geometry = new THREE.OctahedronGeometry(1.2, 0);
  else if (mainSolidType === 'dodecahedron') geometry = new THREE.DodecahedronGeometry(1, 0);
  else if (mainSolidType === 'icosahedron') geometry = new THREE.IcosahedronGeometry(1, 0);

  mainSolid = new THREE.Mesh(geometry, mainSolidMaterial);
  mainSolid.scale.set(currentSize, currentSize, currentSize);
  mainSolid.position.set(0, 1, 0);
  scene.add(mainSolid);
  updateExplode();
}

function updateExplode() {
  currentExplode = parseFloat(document.getElementById('explode').value);
  if (!mainSolid) return;

  // For a true "explode" effect, you would need to separate the faces or vertices.
  // Three.js does not have a built-in explode modifier, so this is a placeholder.
  // For a real explode, you would need to clone and position each face, which is complex.
  // Here, we just scale the object as a simple effect.
  mainSolid.scale.set(currentSize * (1 + currentExplode), currentSize * (1 + currentExplode), currentSize * (1 + currentExplode));
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
  smallSolids.forEach(mesh => {
    mesh.rotation.y += 0.01 * currentRotationDirection;
  });
  if (mainSolid) {
    mainSolid.rotation.y += currentRotationSpeed * currentRotationDirection;
  }
  renderer.render(scene, camera);
}

init();
