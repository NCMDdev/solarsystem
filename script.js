import * as THREE from "./modules/three.module.js";
import { OrbitControls } from "./modules/OrbitControls.js";

//******************************************************************************
// Texture Loader
//******************************************************************************
const textureLoader = new THREE.TextureLoader(); // create a new texture loader instance

//******************************************************************************
// IMAGES PLANETS
//******************************************************************************

const mercuryColor = textureLoader.load("/textures/mercury/mercurymap.jpg");
const mercuryBump = textureLoader.load("/textures/mercury/mercurybump.jpg");

const venusColor = textureLoader.load("/textures/venus/venusmap.jpg");
const venusBump = textureLoader.load("/textures/venus/venusbump.jpg");

const earthColor = textureLoader.load("/textures/earth/earthmap1k.jpg");
const earthBump = textureLoader.load("/textures/earth/earthbump1k.jpg");

const earthCloud = textureLoader.load("/textures/earth/earthcloudmap.jpg");
const earthSpec = textureLoader.load("/textures/earth/earthspec1k.jpg");

const moonColor = textureLoader.load("/textures/moon/moonmap1k.jpg");
const moonBump = textureLoader.load("/textures/moon/moonbump1k.jpg");

const marsColor = textureLoader.load("/textures/mars/mars_1k_color.jpg");
const marsBump = textureLoader.load("/textures/mars/marsbump1k.jpg");

const jupiterColor = textureLoader.load("/textures/jupiter/jupitermap.jpg");
const jupiterBump = textureLoader.load("/textures/jupiter/jupiter2_1k.jpg");

const saturnColor = textureLoader.load("/textures/saturn/saturnmap.jpg");
const saturnRingColor = textureLoader.load("/textures/saturn/saturnring.png");

const uranusColor = textureLoader.load("/textures/uranus/uranusmap.jpg");
const uranusRingColor = textureLoader.load("/textures/uranus/uranusring.png");

const neptuneColor = textureLoader.load("/textures/neptune/neptunemap.jpg");

const plutoColor = textureLoader.load("/textures/pluto/plutomap1k.jpg");
const plutoBump = textureLoader.load("/textures/pluto/plutobump1k.jpg");
//******************************************************************************
// renderer
//******************************************************************************
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  // antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

//***************************************
// Create a Scene
//***************************************
const scene = new THREE.Scene();

//***************************************
// camera
//***************************************
const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  6000
);
// camera.position.x = 0; // left(-) / right(+) axis
// camera.position.y = 0; // up(+) / down(-) axis
// camera.position.z = 5; // front(+) / back(-) axis
camera.position.set(0, 60, 650);

//******************************************************************************
//  Orbit Controls
//******************************************************************************
const controls = new OrbitControls(camera, renderer.domElement);

// controls.enable = true; // turn on mouse controls (default = true)

// controls.minDistance = 10; // how close camera can zoom/dolly in (default = 1)
// controls.maxDistance = 20; // how far camera can zoom/dolly out (default = infinity)

controls.enableDamping = true; // enable inertia (default = false)
controls.dampingFactor = 0.05; // lower = less responsive

// controls.autoRotate = false; // auto rotate around target (default = false)
// controls.autoRotateSpeed = 1.0; // how fast to rotate around target (default = 2)

// controls.zoomSpeed = 0.5; //speed of zoom/dollying (default = 1)

//******************************************************************************
// Ambient Light
//******************************************************************************
const light = new THREE.AmbientLight(0x333333); // soft white light
scene.add(light);

const plight = new THREE.PointLight(0xffffff); // shadows
scene.add(plight);

//******************************************************************************
// Background
//******************************************************************************
// radius, width segs, height segs
const bgGeometry = new THREE.SphereGeometry(2000, 100, 100);
const bgMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load("/textures/milkyway.jpg"),
  side: THREE.DoubleSide, // texture shows on both sides
});
const bg = new THREE.Mesh(bgGeometry, bgMaterial);
scene.add(bg);

//******************************************************************************
// Create the SUN
//******************************************************************************
const sunGeometry = new THREE.SphereGeometry(46, 30, 30);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load("/textures/sun/sun.jpg"),
});

const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

//******************************************************************************
// FUNCTION CREATE PLANET
//******************************************************************************
function createPlanet(size, texture, bump, position, ring) {
  const geometry = new THREE.SphereGeometry(size, 30, 30);
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture), // color map
    bumpMap: textureLoader.load(bump),
    bumpScale: 0.5,
  });

  const mesh = new THREE.Mesh(geometry, material);
  const obj = new THREE.Object3D();
  obj.add(mesh);

  if (ring) {
    const ringGeometry = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture), // color map
      side: THREE.DoubleSide,
    });

    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMaterial.map = ring.texture;
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }

  material.map = texture;
  material.bumpMap = bump;
  scene.add(obj);
  mesh.position.x = position;
  return { mesh, obj };
}

//******************************************************************************
// FUNCTION CREATE EARTH SYSTEM
//******************************************************************************
const earthSystem = new THREE.Group();
const r = 15; // radius of planet, r + 1 is radius atmosphere
const s = 35; // width segments, height segments sphere geometry

function createEarthSystem(positionE, positionC, positionM, rotation) {
  const earthGeometry = new THREE.SphereGeometry(r, s, s);
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthColor, // color map
    bumpMap: earthBump, // affects lighting to give depth
    bumpScale: 0.5, // how bumpy bumpMap will loop
    specularMap: earthSpec, // how shiny material looks
    shininess: 0.7, // shininess/reflectivity of specular highlight
  });
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

  // EARTH CLOUD
  const cloudGeometry = new THREE.SphereGeometry(r + 1, s, s);
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load(earthCloud), // color map
    transparent: true,
    opacity: 0.4,
  });
  const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);

  // MOON
  const moonGeometry = new THREE.SphereGeometry(6, 35, 10);
  const moonMaterial = new THREE.MeshStandardMaterial({
    map: moonColor, // color map
    bumpMap: moonBump,
    bumpScale: 0.5,
  });

  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  const obj = new THREE.Object3D();
  obj.add(earthMesh, clouds, moonMesh);

  earthMaterial.bumpMap = earthBump;
  earthMaterial.specularMap = earthSpec;
  cloudMaterial.map = earthCloud;

  earthMesh.add(moonMesh);
  scene.add(obj);
  scene.add(earthSystem);

  earthMesh.position.x = positionE;
  clouds.position.x = positionC;
  moonMesh.position.x = positionM;

  return { earthMesh, clouds, moonMesh, obj, earthSystem };
}

//******************************************************************************
// CREATE PLANETS
//******************************************************************************
const mercury = createPlanet(8, mercuryColor, mercuryBump, 68);
const venus = createPlanet(13, venusColor, venusBump, 104);
const earthSolar = createEarthSystem(205, 205, 32);
const mars = createPlanet(10, marsColor, marsBump, 260);
const jupiter = createPlanet(30, jupiterColor, jupiterBump, 333);
const saturn = createPlanet(25, saturnColor, "", 423, {
  innerRadius: 29,
  outerRadius: 41,
  texture: saturnRingColor,
});
const uranus = createPlanet(17, uranusColor, "", 495, {
  innerRadius: 19.5,
  outerRadius: 26.2,
  texture: uranusRingColor,
});
const neptune = createPlanet(17, neptuneColor, "", 572);
const pluto = createPlanet(7, plutoColor, plutoBump, 622);

//******************************************************************************
// Point Light
//******************************************************************************
// color, itensity, distance
const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

//******************************************************************************
// Animate - Render the Scene
//******************************************************************************
function animate() {
  //self-rotation
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earthSolar.earthMesh.rotateY(0.012);
  earthSolar.clouds.rotateY(0.016);
  earthSolar.moonMesh.rotateY(0.01);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  neptune.mesh.rotateY(0.03);
  uranus.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);

  // around sun rotation
  mercury.obj.rotateY(0.04);
  venus.obj.rotateY(0.025);
  earthSolar.obj.rotateY(0.009);
  mars.obj.rotateY(0.008);
  jupiter.obj.rotateY(0.002);
  saturn.obj.rotateY(0.0009);
  neptune.obj.rotateY(0.0004);
  uranus.obj.rotateY(0.0001);
  pluto.obj.rotateY(0.00007);

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

//******************************************************************************
// Responsive
//******************************************************************************
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
