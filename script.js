let scene, camera, renderer, controls, mainSolid, directionalLight;
let isDarkMode = false;
let mainSolidType = 'octahedron';
let mainSolidMaterial;
let currentExplode = 0;
let currentRotationSpeed = 0.01;
let currentRotationDirection = 1;
let currentSize = 1;
let currentHue = 200, currentSaturation = 70, currentLightness = 70;
let currentTransparency = 0;
let currentWireframe = false;
let miniScenes = [];
let explodeGroup = null;

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
    flatShading: false,
    transparent: true,
    opacity: 1,
    wireframe: currentWireframe
  });
  updateMaterial();

  initMiniScenes();
  updateMainSolid();

  document.getElementById('darkModeToggle').addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark', isDarkMode);
    scene.background = isDarkMode ? new THREE.Color(0x111111) : new THREE.Color(0xf5f5f5);
  });

  document.getElementById('hue').addEventListener('input', updateMaterial);
  document.getElementById('saturation').addEventListener('input', updateMaterial);
  document.getElementById('lightness').addEventListener('input', updateMaterial);
  document.getElementById('transparency').addEventListener('input', updateMaterial);
  document.getElementById('size').addEventListener('input', updateMainSolid);
  document.getElementById('rotationSpeed').addEventListener('input', updateSpeed);
  document.getElementById('rotationDirection').addEventListener('change', updateSpeed);
  document.getElementById('explode').addEventListener('input', updateExplode);
  document.getElementById('lightX').addEventListener('input', updateLight);
  document.getElementById('lightY').addEventListener('input', updateLight);
  document.getElementById('lightZ').addEventListener('input', updateLight);
  document.getElementById('wireframe').addEventListener('change', updateWireframe);

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

function updateMaterial() {
  currentHue = parseInt(document.getElementById('hue').value);
  currentSaturation = parseInt(document.getElementById('saturation').value);
  currentLightness = parseInt(document.getElementById('lightness').value);
  currentTransparency = parseInt(document.getElementById('transparency').value) / 100;
  const color = new THREE.Color(`hsl(${currentHue}, ${currentSaturation}%, ${currentLightness}%)`);
  mainSolidMaterial.color = color;
  mainSolidMaterial.opacity = 1 - currentTransparency;
  mainSolidMaterial.transparent = currentTransparency > 0;
  if (explodeGroup) {
    explodeGroup.children.forEach(child => {
      if (child.material) child.material = mainSolidMaterial;
    });
  }
}

function updateWireframe() {
  currentWireframe = document.getElementById('wireframe').checked;
  mainSolidMaterial.wireframe = currentWireframe;
  if (explodeGroup) {
    explodeGroup.children.forEach(child => {
      if (child.material) child.material.wireframe = currentWireframe;
    });
  }
}

function explodeGeometry(geometry, explodeFactor = 0) {
  const group = new THREE.Group();
  group.position.set(0, 1, 0);

  // Clone and scale the geometry for size
  geometry = geometry.clone();
  geometry.scale(currentSize, currentSize, currentSize);

  // Convert to non-indexed to get per-face vertices
  const indexedGeo = new THREE.BufferGeometry().fromGeometry(new THREE.Geometry().fromBufferGeometry(geometry));
  const position = indexedGeo.attributes.position;
  const index = indexedGeo.index;

  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i);
    const b = index.getX(i + 1);
    const c = index.getX(i + 2);

    const v1 = new THREE.Vector3().fromBufferAttribute(position, a);
    const v2 = new THREE.Vector3().fromBufferAttribute(position, b);
    const v3 = new THREE.Vector3().fromBufferAttribute(position, c);

    const faceGeo = new THREE.BufferGeometry();
    faceGeo.setAttribute('position', new THREE.Float32BufferAttribute([
      v1.x, v1.y, v1.z,
      v2.x, v2.y, v2.z,
      v3.x, v3.y, v3.z
    ], 3));
    faceGeo.computeVertexNormals();

    const faceNormal = new THREE.Vector3();
    faceNormal.subVectors(v2, v1).cross(new THREE.Vector3().subVectors(v3, v1)).normalize();

    const faceCenter = new THREE.Vector3();
    faceCenter.add(v1).add(v2).add(v3).divideScalar(3);

    const faceMesh = new THREE.Mesh(faceGeo, mainSolidMaterial.clone());
    faceMesh.position.copy(faceCenter);
    faceMesh.userData.normal = faceNormal;
    faceMesh.userData.originalPosition = faceCenter.clone();
    faceMesh.position.add(faceNormal.multiplyScalar(explodeFactor * 0.5));

    group.add(faceMesh);
  }

  return group;
}

function updateMainSolid() {
  currentSize = parseFloat(document.getElementById('size').value);
  if (explodeGroup) scene.remove(explodeGroup);

  let geometry;
  if (mainSolidType === 'tetrahedron') geometry = new THREE.TetrahedronGeometry(1, 0);
  else if (mainSolidType === 'cube') geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
  else if (mainSolidType === 'octahedron') geometry = new THREE.OctahedronGeometry(1.2, 0);
  else if (mainSolidType === 'dodecahedron') geometry = new THREE.DodecahedronGeometry(1, 0);
  else if (mainSolidType === 'icosahedron') geometry = new THREE.IcosahedronGeometry(1, 0);

  explodeGroup = explodeGeometry(geometry, 0);
  scene.add(explodeGroup);
  updateExplode();
}

function updateExplode() {
  currentExplode = parseFloat(document.getElementById('explode').value);
  if (!explodeGroup) return;

  explodeGroup.children.forEach(child => {
    const normal = child.userData.normal;
    const originalPos = child.userData.originalPosition;
    if (normal && originalPos) {
      child.position.copy(originalPos);
      child.position.add(normal.clone().multiplyScalar(currentExplode * 0.5));
    }
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
  if (explodeGroup) {
    explodeGroup.rotation.y += currentRotationSpeed * currentRotationDirection;
  }
  renderer.render(scene, camera);
}

init();
