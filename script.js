// Polyhedra data (vertices, faces, info) as before...

// ... (use SOLIDS object from previous answer, unchanged)

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
    // Scene background
    scene.background = isDarkMode ? new THREE.Color(0x181a20) : new THREE.Color(0xf5f5f5);
    // Info panel colors handled by CSS
    // Adjust lighting for dark mode
    directionalLight.intensity = isDarkMode ? 0.45 : 0.8;
    directionalLight.color.set(isDarkMode ? 0xccccff : 0xffffff);
    // Update main solid material for dark mode
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
  document.getElementById('lightX').addEventListener('input', updateLight);
  document.getElementById('lightY').addEventListener('input', updateLight);
  document.getElementById('lightZ').addEventListener('input', updateLight);
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

function getCurrentSolidData() {
  return SOLIDS[mainSolidType];
}

function updateMainSolid() {
  // Remove previous group
  if (mainSolidGroup) scene.remove(mainSolidGroup);

  // Get controls
  currentHue = parseInt(document.getElementById('hue').value);
  currentSaturation = parseInt(document.getElementById('saturation').value);
  currentLightness = parseInt(document.getElementById('lightness').value);
  currentTransparency = parseInt(document.getElementById('transparency').value) / 100;
  currentSize = parseFloat(document.getElementById('size').value);
  currentWireframe = document.getElementById('wireframe').checked;

  // Build group from solid data
  const solid = getCurrentSolidData();
  const vertices = solid.vertices.map(v => new THREE.Vector3(...v).normalize().multiplyScalar(currentSize * 1.3));
  mainSolidGroup = new THREE.Group();
  mainSolidGroup.position.set(0, 1, 0);

  // For each face, build geometry, mesh, and edge lines
  solid.faces.forEach(faceVerts => {
    for (let i = 1; i < faceVerts.length - 1; i++) {
      const idx = [faceVerts[0], faceVerts[i], faceVerts[i+1]];
      const geo = new THREE.BufferGeometry();
      geo.setFromPoints([vertices[idx[0]], vertices[idx[1]], vertices[idx[2]]]);
      geo.setIndex([0,1,2]);
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

      // Face center and normal
      const vA = vertices[idx[0]], vB = vertices[idx[1]], vC = vertices[idx[2]];
      const center = new THREE.Vector3().add(vA).add(vB).add(vC).divideScalar(3);
      const normal = new THREE.Vector3().subVectors(vB, vA).cross(new THREE.Vector3().subVectors(vC, vA)).normalize();

      mesh.userData = {
        center: center.clone(),
        normal: normal.clone()
      };

      // Edges
      const edgeGeo = new THREE.EdgesGeometry(geo, 1);
      const edgeMat = new THREE.LineBasicMaterial({ color: isDarkMode ? 0xffffff : 0x222222, linewidth: 2 });
      const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
      edgeLines.renderOrder = 1;
      mesh.add(edgeLines);

      mainSolidGroup.add(mesh);
    }
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
