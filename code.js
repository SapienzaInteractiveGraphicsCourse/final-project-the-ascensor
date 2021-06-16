import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({canvas});
const fov = 45;
const near = 0.01;
const far = 1000;
const aspect = 2;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const controls = new OrbitControls(camera, canvas);
var chicken;
var one = true;
var bone2Animation;
var a = false;
var s = false;
var speed;
var target;
var barSpeed = 0;
var maxSpeed;


function myPlane(){
  const planSize = 40;
  const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  const repeats = planSize / 2;
  texture.repeat.set(repeats,repeats);

  const planeGeo = new THREE.PlaneGeometry(planSize, planSize);
  const planeMat = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  planeMat.color.setRGB(1.5, 1.5, 1.5);
  const mesh = new THREE.Mesh(planeGeo,planeMat);
  mesh.rotation.x = Math.PI * -.5;
  scene.add(mesh);
}

function myChicken(){
  return gltfLoader.load('./chicken_-_rigged/scene.gltf', function (gltf){
    const root = gltf.scene;
    root.scale.multiplyScalar(1 / 100); // adjust scalar factor to match your scene scale
    root.position.x = 0; // once rescaled, position the model where needed
    root.position.y = 5;
    root.position.z = 0;
    root.traverse((object) => {
      if (object.isMesh) object.frustumCulled = false;
      // console.log(object);
    });
    speed = 1;
    maxSpeed = speed * 3;
    target = {x:20, y:root.position.y, z:root.position.z};
    bone2Animation = new TWEEN.Tween(root.position).to(target, 20/speed * 1000);
    bone2Animation.start();
    // var bone2Animation = new TWEEN.Tween(bone2.position).to({x:bone2.position.x + 20, y:bone2.position.y, z:bone2.position.z}, 10000);
    // bone2Animation.start();
    chicken = root;
    scene.add(root);
    one = false;
  }, undefined, function (error) {
    console.error(error);
  });
}

function myEmisphereLight(){
  const skyColor = 0xB1E1FF;  // light blue
  const groundColor = 0xB97A20;  // brownish orange
  const intensity = 1;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(light);
}

function myDirectionalLight(){
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-5, 10, 0);
  light.target.position.set(0, 0, 0);
  scene.add(light);
  scene.add(light.target);
}

function init(){
  camera.position.set(0, 10, 20);
  controls.target.set(0, 5, 0);
  controls.update();
  scene.background = new THREE.Color("black");
  var onKeyDown = function(event) {
    switch(event.keyCode){
      case 65:
        a = true;
        s = false;
        barSpeed += ((maxSpeed - barSpeed) * 25) / 100;
        break;
      case 83:
        s = true;
        a = false;
        break;
    }
  }

  // var onKeyUp = function(event) {
  //   switch(event.keyCode){
  //     case 65:
  //       b = false;
  //       break;
  //     case 83:
  //       v = false;
  //       break;
  //   }
  // }
  document.addEventListener('keydown', onKeyDown, false);
  // document.addEventListener('keyup', onKeyUp, false);
  myEmisphereLight();
  myDirectionalLight();
  myPlane();
  myChicken();
  requestAnimationFrame(render);
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function render(time) {
  time *= 0.001;  // convert to seconds

  resizeRendererToDisplaySize(renderer);
  {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  barSpeed -= 0.01;
  if(barSpeed < 0) barSpeed = 0;
  console.log(barSpeed);
  if(!one){
    // if(a){
    //   bone2Animation.onUpdate(function(){
    //     bone2Animation.stop();
    //     bone2Animation = new TWEEN.Tween(chicken.position).to(target, ((20 - chicken.position.x) / speed) * 1000);
    //     console.log("a " +(20 - chicken.position.x)/((20 - chicken.position.x) / speed) * 1000)
    //     bone2Animation.start();
    //   });
    // }
    // if(s){
    //   bone2Animation.onUpdate(function(){
    //     bone2Animation.stop();
    //     bone2Animation = new TWEEN.Tween(chicken.position).to(target, ((20 - chicken.position.x) / (speed*2)) * 1000);
    //     console.log("s " +(20 - chicken.position.x)/((20 - chicken.position.x) / (speed*2)) * 1000);
    //     bone2Animation.start();
    //   });
    // }
    bone2Animation.onUpdate(function(){
      bone2Animation.stop();
      bone2Animation = new TWEEN.Tween(chicken.position).to(target, ((20 - chicken.position.x) / (speed*barSpeed + 0.00000001)) * 1000);
      bone2Animation.start();
    });
  }

  // if(!one && chicken.position.x >= 2){
  //   one = true;
  //   // bone2Animation.stop();
  //   // bone2Animation = new TWEEN.Tween(chicken.position).to({x: 10 - chicken.position.x, y:chicken.position.y, z:chicken.position.z}, 100);
  //   // TWEEN.update();
  //   // bone2Animation.start();
  // }
  // setInterval(function(){bone2.position.x += time;}, 1000);
  // bone2.position.x += time;
  // var bone2 = chicken.getObjectByName("bone_02");
  // console.log(bone2);
  // var bone2Animation = new TWEEN.Tween(bone2.position).to({x:bone2.position.x + 20, y:bone2.position.y, z:bone2.position.z}, 10000);
  // bone2Animation.start();
  renderer.render(scene, camera);
  TWEEN.update();
  requestAnimationFrame(render);
}
init();