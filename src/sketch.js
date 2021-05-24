// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
};

const sketch = ({ context }) => {
  // Create a renderer
  const texureLoader = new THREE.TextureLoader();
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#000", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(3, 3, -5);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup light
  const light = new THREE.PointLight("white", 1);
  light.position.set(2, 2, 2);

  // Load texure
  const earthTexure = texureLoader.load("earth.jpg");
  const moonTexure = texureLoader.load("2k_moon.jpg");

  // Setup a geometry
  const geometry = new THREE.SphereGeometry(1, 32, 32);

  // Setup a material
  const material = new THREE.MeshStandardMaterial({
    map: earthTexure,
  });
  const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonTexure,
  });

  // Setup a mesh with geometry + material
  const earthMesh = new THREE.Mesh(geometry, material);
  const moonMesh = new THREE.Mesh(geometry, moonMaterial);

  const moonGroup = new THREE.Group();
  moonGroup.add(moonMesh);

  moonMesh.position.set(1, 1.2, 1);
  moonMesh.scale.setScalar(0.25);

  scene.add(earthMesh);
  scene.add(moonGroup);
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      earthMesh.rotation.y = time * 0.15;
      moonMesh.rotation.y = time * 0.1;
      moonGroup.rotation.y = time * 0.5;
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
