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
var chicken1Loaded = false;
var bone2Animation;
var a = false;
var s = false;
var speed;
var target;
var barSpeed = 0;
var maxSpeed;

var spine_00_02;
var tail_00_03;
var tail_01_04;
var tail_02_05;
var tail_03_06;
var tail_04_07;
var spine_01_08;
var spine_02_09;
var spine_03_010;
var neck_011;
var head_012;
var jaw_lower_013;
var shoulder_L_014;
var front_thigh_L_015;
var front_shin_L_016;
var front_foot_L_017;
var f_pinky_00_L_018;
var f_pinky_01_L_019;
var f_ring_00_L_020;
var f_ring_01_L_021;
var f_middle_00_L_022;
var f_middle_01_L_023;
var f_index_00_L_024;
var f_index_01_L_025;
var shoulder_R_026;
var front_thigh_R_027;
var front_shin_R_028;
var front_foot_R_029;
var f_pinky_00_R_030;
var f_pinky_01_R_031;
var f_ring_00_R_032;
var f_ring_01_R_033;
var f_middle_00_R_034;
var f_middle_01_R_035;
var f_index_00_R_036;
var f_index_01_R_037;
var ribcage_038;
var thigh_L_039;
var shin_L_040;
var foot_00_L_041;
var foot_01_L_042;
var r_pinky_00_L_043;
var r_pinky_01_L_044;
var r_ring_00_L_045;
var r_ring_01_L_046;
var r_middle_00_L_047;
var r_middle_01_L_048;
var r_index_00_L_049;
var r_index_01_L_050;
var thigh_R_051;
var shin_R_052;
var foot_00_R_053;
var foot_01_R_054;
var r_pinky_00_R_055;
var r_pinky_01_R_056;
var r_ring_00_R_057;
var r_ring_01_R_058;
var r_middle_00_R_059;
var r_middle_01_R_060;
var r_index_00_R_061;
var r_index_01_R_00;

var speedShoulder;
var distanceRotationStart;
var legInitialRotation;
var legdistanceRotation;
var legAnimation;


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

function racoonBones(root) {
  spine_00_02 = root.getObjectByName("spine_00_02");
  tail_00_03 = root.getObjectByName("tail_00_03");
  tail_01_04 = root.getObjectByName("tail_01_04");
  tail_02_05 = root.getObjectByName("tail_02_05");
  tail_03_06 = root.getObjectByName("tail_03_06");
  tail_04_07 = root.getObjectByName("tail_04_07");
  spine_01_08 = root.getObjectByName("spine_01_08");
  spine_02_09 = root.getObjectByName("spine_02_09");
  spine_03_010 = root.getObjectByName("spine_03_010");
  neck_011 = root.getObjectByName("neck_011");
  head_012 = root.getObjectByName("head_012");
  jaw_lower_013 = root.getObjectByName("jaw_lower_013");
  shoulder_L_014 = root.getObjectByName("shoulder_L_014");
  front_thigh_L_015 = root.getObjectByName("front_thigh_L_015");
  front_shin_L_016 = root.getObjectByName("front_shin_L_016");
  front_foot_L_017 = root.getObjectByName("front_foot_L_017");
  f_pinky_00_L_018 = root.getObjectByName("f_pinky_00_L_018");
  f_pinky_01_L_019 = root.getObjectByName("f_pinky_01_L_019");
  f_ring_00_L_020 = root.getObjectByName("f_ring_00_L_020");
  f_ring_01_L_021 = root.getObjectByName("f_ring_01_L_021");
  f_middle_00_L_022 = root.getObjectByName("f_middle_00_L_022");
  f_middle_01_L_023 = root.getObjectByName("f_middle_01_L_023");
  f_index_00_L_024 = root.getObjectByName("f_index_00_L_024");
  f_index_01_L_025 = root.getObjectByName("f_index_01_L_025");
  shoulder_R_026 = root.getObjectByName("shoulder_R_026");
  front_thigh_R_027 = root.getObjectByName("front_thigh_R_027");
  front_shin_R_028 = root.getObjectByName("front_shin_R_028");
  front_foot_R_029 = root.getObjectByName("front_foot_R_029");
  f_pinky_00_R_030 = root.getObjectByName("f_pinky_00_R_030");
  f_pinky_01_R_031 = root.getObjectByName("f_pinky_01_R_031");
  f_ring_00_R_032 = root.getObjectByName("f_ring_00_R_032");
  f_ring_01_R_033 = root.getObjectByName("f_ring_01_R_033");
  f_middle_00_R_034 = root.getObjectByName("f_middle_00_R_034");
  f_middle_01_R_035 = root.getObjectByName("f_middle_01_R_035");
  f_index_00_R_036 = root.getObjectByName("f_index_00_R_036");
  f_index_01_R_037 = root.getObjectByName("f_index_01_R_037");
  ribcage_038 = root.getObjectByName("ribcage_038");
  thigh_L_039 = root.getObjectByName("thigh_L_039");
  shin_L_040 = root.getObjectByName("shin_L_040");
  foot_00_L_041 = root.getObjectByName("foot_00_L_041");
  foot_01_L_042 = root.getObjectByName("foot_01_L_042");
  r_pinky_00_L_043 = root.getObjectByName("r_pinky_00_L_043");
  r_pinky_01_L_044 = root.getObjectByName("r_pinky_01_L_044");
  r_ring_00_L_045 = root.getObjectByName("r_ring_00_L_045");
  r_ring_01_L_046 = root.getObjectByName("r_ring_01_L_046");
  r_middle_00_L_047 = root.getObjectByName("r_middle_00_L_047");
  r_middle_01_L_048 = root.getObjectByName("r_middle_01_L_048");
  r_index_00_L_049 = root.getObjectByName("r_index_00_L_049");
  r_index_01_L_050 = root.getObjectByName("r_index_01_L_050");
  thigh_R_051 = root.getObjectByName("thigh_R_051");
  shin_R_052 = root.getObjectByName("shin_R_052");
  foot_00_R_053 = root.getObjectByName("foot_00_R_053");
  foot_01_R_054 = root.getObjectByName("foot_01_R_054");
  r_pinky_00_R_055 = root.getObjectByName("r_pinky_00_R_055");
  r_pinky_01_R_056 = root.getObjectByName("r_pinky_01_R_056");
  r_ring_00_R_057 = root.getObjectByName("r_ring_00_R_057");
  r_ring_01_R_058 = root.getObjectByName("r_ring_01_R_058");
  r_middle_00_R_059 = root.getObjectByName("r_middle_00_R_059");
  r_middle_01_R_060 = root.getObjectByName("r_middle_01_R_060");
  r_index_00_R_061 = root.getObjectByName("r_index_00_R_061");
  r_index_01_R_00 = root.getObjectByName("r_index_01_R_00");
}

function racoonWalk(root) {
  racoonBones(root);
    
  speedShoulder = 15;
  distanceRotationStart = Math.abs(0.5 - 0.65);
  legInitialRotation = (shoulder_L_014.rotation.x)/Math.PI;
  legdistanceRotation = Math.abs(legInitialRotation - 0.65);
  legAnimation = {x:shoulder_L_014.rotation.x, y:shoulder_L_014.rotation.y, z:shoulder_L_014.rotation.z};

  shoulder_L_014.rotation.x= 0.5*Math.PI;
  shoulder_L_014.rotation.z= -0.15*Math.PI;

  shoulder_R_026.rotation.x= 0.5*Math.PI;
  shoulder_R_026.rotation.z= 0.15*Math.PI;
  startAnimation()
}

function startAnimation() {
  // racoonLeftFrontLegWalk()
  racoonRightFrontLegWalk()
}

function racoonLeftFrontLegWalk() {
  var leftFrontLegAnimation = {x:legAnimation.x, y:legAnimation.y, z:legAnimation.z};
  var leftFrontLegStartAnimation = {x:0.65*Math.PI, y:shoulder_L_014.rotation.y, z:-0.15*Math.PI};

  var leftFrontLeg = new TWEEN.Tween(shoulder_L_014.rotation).to(leftFrontLegStartAnimation, distanceRotationStart/speedShoulder)
  .onUpdate(function() {
    if (shoulder_L_014.rotation.x >= leftFrontLegStartAnimation.x) {
      leftFrontLeg.stop();
      leftFrontLeg = new TWEEN.Tween(shoulder_L_014.rotation).to(leftFrontLegAnimation, legdistanceRotation/speedShoulder);
      leftFrontLeg.repeat(Infinity);
      leftFrontLeg.yoyo(true);
      leftFrontLeg.start();
    }
  });
  leftFrontLeg.start();
}

function racoonRightFrontLegWalk() {
  var rightFrontLegAnimation = {x:legAnimation.x, y:legAnimation.y, z:-legAnimation.z};
  var rightFrontLegStartAnimation = {x:0.65*Math.PI, y:shoulder_R_026.rotation.y, z:0.15*Math.PI};


  var speedStart = ((rightFrontLegStartAnimation.x - shoulder_R_026.rotation.x) / (speedShoulder*barSpeed + 0.00000001)) * 1000
  var speedRunOne = ((rightFrontLegAnimation.x - shoulder_R_026.rotation.x) / (speedShoulder*barSpeed + 0.00000001)) * 1000
  var speedRunTwo = ((rightFrontLegStartAnimation.x - shoulder_R_026.rotation.x) / (speedShoulder*barSpeed + 0.00000001)) * 1000
  // console.log(speedStart)
  var one = new TWEEN.Tween();
  var two = new TWEEN.Tween();
  // var rightFrontLeg = new TWEEN.Tween(shoulder_R_026.rotation).to(rightFrontLegStartAnimation, speedStart)
  var rightFrontLeg = new TWEEN.Tween(shoulder_R_026.rotation).to(rightFrontLegAnimation, 2000)
  .onUpdate(function() {
    if (shoulder_R_026.rotation.x <= rightFrontLegAnimation.x) {
      rightFrontLeg.stop();
      rightFrontLeg = new TWEEN.Tween(shoulder_R_026.rotation).to(rightFrontLegAnimation, 2000);
      // rightFrontLeg.repeat(Infinity);
      // rightFrontLeg.yoyo(true);
      rightFrontLeg.start();
    }
  });;
  // rightFrontLeg.onUpdate(function() {
  //   if (shoulder_R_026.rotation.x >= rightFrontLegStartAnimation.x) {
  //     rightFrontLeg.stop();
  //     two.stop();
  //     one = new TWEEN.Tween(shoulder_R_026.rotation).to(rightFrontLegAnimation, speedRunOne);
  //     one.repeat(Infinity);
  //     one.yoyo(true);
  //     one.start()
    // } else if (shoulder_R_026.rotation.x <= rightFrontLegStartAnimation.x) {
    //   rightFrontLeg.stop();
    //   one.stop();
    //   two = new TWEEN.Tween(shoulder_R_026.rotation).to(rightFrontLegStartAnimation, speedRunTwo);
    //   two.start();
    // }
  // })
  // 
  rightFrontLeg.start();
}

function myChicken(){
  gltfLoader.load('./racoon2/scene.gltf', function (gltf){
    const root = gltf.scene;
    root.scale.multiplyScalar(2); // adjust scalar factor to match your scene scale
    root.position.x = 0; // once rescaled, position the model where needed
    root.position.y = 5;
    root.position.z = 0;
    root.rotation.y = Math.PI * .5;
    // var asdrubale = "";
    // var asdrubale1 = "";
  
    root.traverse((object) => {
      if (object.isMesh) object.frustumCulled = false;
      // if (object.isMesh && object.name == "f_pinky_00_R_030") object.material = newMaterial;
      
      // asdrubale += object.name + " = root.getObjectByName(\"" + object.name + "\");\n";
      // asdrubale1 += "var "+ object.name + ";\n";
      // console.log( object.name + " -> [" + object.rotation.x +", "+ object.rotation.y + ", " + object.rotation.z + "]")
    });
    // console.log(asdrubale)
    // console.log(asdrubale1)
    racoonWalk(root)    
    

    speed = 1;
    maxSpeed = speed * 3;
    target = {x:20, y:root.position.y, z:root.position.z};
    // bone2Animation = new TWEEN.Tween(root.getObjectByName(ccc).position).to(target, 20/speed * 1000);
    // leftFrontLeg.repeat(Infinity);
    // leftFrontLeg.yoyo(true);


    // bone2Animation = new TWEEN.Tween(root.position).to(target, 20/speed * 1000);
    // bone2Animation.start();


    chicken = root;
    scene.add(root);
    chicken1Loaded = true;
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
  light.position.set(-50, 10, 0);
  light.target.position.set(0, 0, 0);
  scene.add(light);
  scene.add(light.target);
}

function init(){
  camera.position.set(0, 10, 20);
  controls.target.set(0, 5, 0);
  controls.update();
  scene.background = new THREE.Color("green");
  var onKeyDown = function(event) {
    switch(event.keyCode){
      case 65:
        if (!a) {
          a = true;
          s = false;
          barSpeed += ((maxSpeed - barSpeed) * 25) / 100;
        }
        break;
      case 83:
        if (!s) {
          s = true;
          a = false;
          barSpeed += ((maxSpeed - barSpeed) * 25) / 100;
        }
        break;
    }
  }
  document.addEventListener('keydown', onKeyDown, false);
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
  // console.log(barSpeed);
  if(chicken1Loaded){
    // bone2Animation.onUpdate(function(){
    //   bone2Animation.stop();
    //   // bone2Animation = new TWEEN.Tween(aa.position).to(target, ((20 - aa.position.x) / (speed*barSpeed + 0.00000001)) * 1000);
    //   bone2Animation = new TWEEN.Tween(chicken.position).to(target, ((20 - chicken.position.x) / (speed*barSpeed + 0.00000001)) * 1000);
    //   bone2Animation.start(); 
    // });
    
    // startAnimation(chicken)   
  console.log(shoulder_R_026.rotation.x)
  }
  renderer.render(scene, camera);
  TWEEN.update();
  requestAnimationFrame(render);
}
init();