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
var racoons = [];
var racoonLoaded = false;
var bone2Animation;
var a = false;
var s = false;
var speed;
var target;
var barSpeed = 0;
var maxSpeed = 3;

var aBoxHtml;
var sBoxHtml;
var barHtml;

// // shoulders
// var changeShoulderL;
// var startRotationShoulderL;

// var changeShoulderR;
// var startRotationShoulderR;

// var frontLegsDirection = 1;
// var legStepsAnimation = 600;

// //feet
// var frontFootL1;
// var frontFootL2;
// var frontFootL3;
// var footFrontL1 = true;
// var footFrontL2 = false;
// var footFrontL3 = false;

// var frontFootR1;
// var frontFootR2;
// var frontFootR3;
// var footFrontR1 = true;
// var footFrontR2 = false;
// var footFrontR3 = false;

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
  return {
  spine_00_02 : root.getObjectByName("spine_00_02"),
  tail_00_03 : root.getObjectByName("tail_00_03"),
  tail_01_04 : root.getObjectByName("tail_01_04"),
  tail_02_05 : root.getObjectByName("tail_02_05"),
  tail_03_06 : root.getObjectByName("tail_03_06"),
  tail_04_07 : root.getObjectByName("tail_04_07"),
  spine_01_08 : root.getObjectByName("spine_01_08"),
  spine_02_09 : root.getObjectByName("spine_02_09"),
  spine_03_010 : root.getObjectByName("spine_03_010"),
  neck_011 : root.getObjectByName("neck_011"),
  head_012 : root.getObjectByName("head_012"),
  jaw_lower_013 : root.getObjectByName("jaw_lower_013"),
  shoulder_L_014 : root.getObjectByName("shoulder_L_014"),
  front_thigh_L_015 : root.getObjectByName("front_thigh_L_015"),
  front_shin_L_016 : root.getObjectByName("front_shin_L_016"),
  front_foot_L_017 : root.getObjectByName("front_foot_L_017"),
  f_pinky_00_L_018 : root.getObjectByName("f_pinky_00_L_018"),
  f_pinky_01_L_019 : root.getObjectByName("f_pinky_01_L_019"),
  f_ring_00_L_020 : root.getObjectByName("f_ring_00_L_020"),
  f_ring_01_L_021 : root.getObjectByName("f_ring_01_L_021"),
  f_middle_00_L_022 : root.getObjectByName("f_middle_00_L_022"),
  f_middle_01_L_023 : root.getObjectByName("f_middle_01_L_023"),
  f_index_00_L_024 : root.getObjectByName("f_index_00_L_024"),
  f_index_01_L_025 : root.getObjectByName("f_index_01_L_025"),
  shoulder_R_026 : root.getObjectByName("shoulder_R_026"),
  front_thigh_R_027 : root.getObjectByName("front_thigh_R_027"),
  front_shin_R_028 : root.getObjectByName("front_shin_R_028"),
  front_foot_R_029 : root.getObjectByName("front_foot_R_029"),
  f_pinky_00_R_030 : root.getObjectByName("f_pinky_00_R_030"),
  f_pinky_01_R_031 : root.getObjectByName("f_pinky_01_R_031"),
  f_ring_00_R_032 : root.getObjectByName("f_ring_00_R_032"),
  f_ring_01_R_033 : root.getObjectByName("f_ring_01_R_033"),
  f_middle_00_R_034 : root.getObjectByName("f_middle_00_R_034"),
  f_middle_01_R_035 : root.getObjectByName("f_middle_01_R_035"),
  f_index_00_R_036 : root.getObjectByName("f_index_00_R_036"),
  f_index_01_R_037 : root.getObjectByName("f_index_01_R_037"),
  ribcage_038 : root.getObjectByName("ribcage_038"),
  thigh_L_039 : root.getObjectByName("thigh_L_039"),
  shin_L_040 : root.getObjectByName("shin_L_040"),
  foot_00_L_041 : root.getObjectByName("foot_00_L_041"),
  foot_01_L_042 : root.getObjectByName("foot_01_L_042"),
  r_pinky_00_L_043 : root.getObjectByName("r_pinky_00_L_043"),
  r_pinky_01_L_044 : root.getObjectByName("r_pinky_01_L_044"),
  r_ring_00_L_045 : root.getObjectByName("r_ring_00_L_045"),
  r_ring_01_L_046 : root.getObjectByName("r_ring_01_L_046"),
  r_middle_00_L_047 : root.getObjectByName("r_middle_00_L_047"),
  r_middle_01_L_048 : root.getObjectByName("r_middle_01_L_048"),
  r_index_00_L_049 : root.getObjectByName("r_index_00_L_049"),
  r_index_01_L_050 : root.getObjectByName("r_index_01_L_050"),
  thigh_R_051 : root.getObjectByName("thigh_R_051"),
  shin_R_052 : root.getObjectByName("shin_R_052"),
  foot_00_R_053 : root.getObjectByName("foot_00_R_053"),
  foot_01_R_054 : root.getObjectByName("foot_01_R_054"),
  r_pinky_00_R_055 : root.getObjectByName("r_pinky_00_R_055"),
  r_pinky_01_R_056 : root.getObjectByName("r_pinky_01_R_056"),
  r_ring_00_R_057 : root.getObjectByName("r_ring_00_R_057"),
  r_ring_01_R_058 : root.getObjectByName("r_ring_01_R_058"),
  r_middle_00_R_059 : root.getObjectByName("r_middle_00_R_059"),
  r_middle_01_R_060 : root.getObjectByName("r_middle_01_R_060"),
  r_index_00_R_061 : root.getObjectByName("r_index_00_R_061"),
  r_index_01_R_00 : root.getObjectByName("r_index_01_R_00")};
}

function myRacoon(){
  gltfLoader.load('./racoon2/scene.gltf', function (gltf){
    const root = gltf.scene;
    root.scale.multiplyScalar(2); // adjust scalar factor to match your scene scale
    root.position.x = 0; // once rescaled, position the model where needed
    root.position.y = 5;
    root.position.z = 0;
    root.rotation.y = Math.PI * .5;
  
    root.traverse((object) => {
      if (object.isMesh) object.frustumCulled = false;
    });

    racoonStartPosition(root)

    // speed = 1;
    // maxSpeed = speed * 3;
    // target = {x:20, y:root.position.y, z:root.position.z};
    // bone2Animation = new TWEEN.Tween(root.getObjectByName(ccc).position).to(target, 20/speed * 1000);
    // leftFrontLeg.repeat(Infinity);
    // leftFrontLeg.yoyo(true);


    // bone2Animation = new TWEEN.Tween(root.position).to(target, 20/speed * 1000);
    // bone2Animation.start();
    scene.add(root);
    racoonLoaded = true;
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

  // aBoxHtml = document.getElementById("A");
  // sBoxHtml = document.getElementById("S");
  // barHtml = document.getElementById("speedBar");
  
  myEmisphereLight();
  myDirectionalLight();
  myPlane();
  myRacoon();
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

// function switchColor(target, attribute, colorString){
//   target.setAttribute(attribute, colorString);
// }

// function updateBar(value){
//   barHtml.setAttribute("aria-valuenow", value);
//   barHtml.setAttribute("style", "width:" + value + "%");
//   barHtml.innerHTML = value;
// }

function render(time) {
  time *= 0.001;  // convert to seconds

  // if (!a) {
  //   switchColor(aBoxHtml, "style", "background: rgba(120, 20, 20, 0.5)");
  // } else{
  //   switchColor(aBoxHtml, "style", "background: #AA3333");
  // }
  // if (!s) {
  //   switchColor(sBoxHtml, "style", "background: rgba(20, 20, 120, 0.5)");
  // } else{
  //   switchColor(sBoxHtml, "style", "background: #3333AA")
  // }

  resizeRendererToDisplaySize(renderer);
  {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  barSpeed -= 0.01;
  if(barSpeed < 0) barSpeed = 0;
  // console.log(time);
  var percentageBarSpeed = String(Math.round((barSpeed/3)*100));

  // updateBar(percentageBarSpeed);

  walkRacoon();
  
  renderer.render(scene, camera);
  TWEEN.update();
  requestAnimationFrame(render);
}

function racoonStartPosition(root) {
  racoons.push([root, racoonBones(root)]);

  //shoulders
  startRotationShoulderL = {x: racoons[racoons.length-1][1].shoulder_L_014.rotation.x, 
                            z: racoons[racoons.length-1][1].shoulder_L_014.rotation.z}
  changeShoulderL = {x: Math.abs(startRotationShoulderL.x - 0.65*Math.PI), 
                     z: Math.abs(startRotationShoulderL.z - -0.15*Math.PI)}
  racoons[racoons.length-1][1].shoulder_L_014.rotation.x= 0.5*Math.PI;
  racoons[racoons.length-1][1].shoulder_L_014.rotation.z= -0.15*Math.PI;

  startRotationShoulderR = {x: racoons[racoons.length-1][1].shoulder_R_026.rotation.x, 
                            z: racoons[racoons.length-1][1].shoulder_R_026.rotation.z}
  changeShoulderR = {x: Math.abs(startRotationShoulderR.x - 0.65*Math.PI), 
                     z: Math.abs(startRotationShoulderR.z - 0.15*Math.PI)}
  racoons[racoons.length-1][1].shoulder_R_026.rotation.x= 0.5*Math.PI;
  racoons[racoons.length-1][1].shoulder_R_026.rotation.z= 0.15*Math.PI;


  //feet
  frontFootL1 = {x: Math.abs(0.25*Math.PI - 0)}
  frontFootL2 = {x: Math.abs(-0.25*Math.PI - 0.25*Math.PI)}
  frontFootL3 = {x: Math.abs(-0.25*Math.PI - 0)}
  footFrontL1 = false;
  footFrontL2 = true;
  footFrontL3 = false;
  racoons[racoons.length-1][1].front_foot_L_017.rotation.x = -0.25*Math.PI;

  frontFootR1 = {x: Math.abs(0.25*Math.PI - 0)}
  frontFootR2 = {x: Math.abs(-0.25*Math.PI - 0.25*Math.PI)}
  frontFootR3 = {x: Math.abs(-0.25*Math.PI - 0)}
  footFrontR1 = false;
  footFrontR2 = true;
  footFrontR3 = false;
  racoons[racoons.length-1][1].front_foot_R_029.rotation.x = -0.25*Math.PI;
}

// shoulders
var changeShoulderL;
var startRotationShoulderL;

var changeShoulderR;
var startRotationShoulderR;

var frontLegsDirection = 1;
var legStepsAnimation = 300;

//feet
var frontFootL1;
var frontFootL2;
var frontFootL3;
var footFrontL1 = true;
var footFrontL2 = false;
var footFrontL3 = false;

var frontFootR1;
var frontFootR2;
var frontFootR3;
var footFrontR1 = true;
var footFrontR2 = false;
var footFrontR3 = false;


function walkRacoon() {
  if(racoonLoaded){
    // bone2Animation.onUpdate(function(){
    //   bone2Animation.stop();
    //   // bone2Animation = new TWEEN.Tween(aa.position).to(target, ((20 - aa.position.x) / (speed*barSpeed + 0.00000001)) * 1000);
    //   bone2Animation = new TWEEN.Tween(chicken.position).to(target, ((20 - chicken.position.x) / (speed*barSpeed + 0.00000001)) * 1000);
    //   bone2Animation.start(); 
    // });

    walkFrontShoulderLeft();
    walkFrontShoulderRight();
    
    walkFrontFootLeft();
    walkFrontFootRight();

    walkBackShoulderLeft();
    walkBackShoulderRight();
    
    walkBackFootLeft();
    walkBackFootRight();    
    
    yoyo();
  }
}

function walkFrontShoulderLeft() {
  var shoulderLStep = {x: changeShoulderL.x/legStepsAnimation, z: changeShoulderL.z/legStepsAnimation}
  racoons[0][1].shoulder_L_014.rotation.x += shoulderLStep.x * frontLegsDirection*barSpeedF();
  racoons[0][1].shoulder_L_014.rotation.z += shoulderLStep.z * frontLegsDirection*barSpeedF();
}

function walkFrontShoulderRight() {
  var shoulderRStep = {x: changeShoulderR.x/legStepsAnimation, z: changeShoulderR.z/legStepsAnimation}
  racoons[0][1].shoulder_R_026.rotation.x += shoulderRStep.x * frontLegsDirection*barSpeedF();
  racoons[0][1].shoulder_R_026.rotation.z += shoulderRStep.z * frontLegsDirection*barSpeedF();
}

function walkFrontFootLeft() {
  var footL1Step = {x: frontFootL1.x/(legStepsAnimation)}
  var footL2Step = {x: frontFootL2.x/(legStepsAnimation*0.32)}
  var footL3Step = {x: frontFootL3.x/(legStepsAnimation*0.68)}

  if (footFrontL1) {
    racoons[0][1].front_foot_L_017.rotation.x += frontLegsDirection*footL1Step.x*barSpeedF();
    if (frontLegsDirection == 1) {
      racoons[racoons.length-1][1].front_foot_L_017.rotation.x = 0;
      footFrontL1 = false;
      footFrontL2 = false;
      footFrontL3 = true;
    }
  }

  if (footFrontL2) {
    racoons[0][1].front_foot_L_017.rotation.x += frontLegsDirection*footL2Step.x*barSpeedF();
    if (frontLegsDirection == -1) {
      racoons[racoons.length-1][1].front_foot_L_017.rotation.x = 0.25*Math.PI;
      footFrontL2 = false;
      footFrontL3 = false;
      footFrontL1 = true;
    }
  }

  if (footFrontL3) {
    racoons[0][1].front_foot_L_017.rotation.x += -frontLegsDirection*footL3Step.x*barSpeedF();
    if (racoons[0][1].front_foot_L_017.rotation.x <= -0.25*Math.PI) {
      racoons[racoons.length-1][1].front_foot_L_017.rotation.x = -0.25*Math.PI;
      footFrontL3 = false;
      footFrontL1 = false;
      footFrontL2 = true;
    }
  }
}

function walkFrontFootRight() {
  var footR1Step = {x: frontFootR1.x/(legStepsAnimation)}
  var footR2Step = {x: frontFootR2.x/(legStepsAnimation*0.32)}
  var footR3Step = {x: frontFootR3.x/(legStepsAnimation*0.68)}

  if (footFrontR1) {
    racoons[0][1].front_foot_R_029.rotation.x += frontLegsDirection*footR1Step.x*barSpeedF();
    if (frontLegsDirection == 1) {
      racoons[racoons.length-1][1].front_foot_R_029.rotation.x = 0;
      footFrontR1 = false;
      footFrontR2 = false;
      footFrontR3 = true;
    }
  }

  if (footFrontR2) {
    racoons[0][1].front_foot_R_029.rotation.x += frontLegsDirection*footR2Step.x*barSpeedF();
    if (frontLegsDirection == -1) {
      racoons[racoons.length-1][1].front_foot_R_029.rotation.x = 0.25*Math.PI;
      footFrontR2 = false;
      footFrontR3 = false;
      footFrontR1 = true;
    }
  }

  if (footFrontR3) {
    racoons[0][1].front_foot_R_029.rotation.x += -frontLegsDirection*footR3Step.x*barSpeedF();
    if (racoons[0][1].front_foot_R_029.rotation.x <= -0.25*Math.PI) {
      racoons[racoons.length-1][1].front_foot_R_029.rotation.x = -0.25*Math.PI;
      footFrontR3 = false;
      footFrontR1 = false;
      footFrontR2 = true;
    }
  }
}

function walkBackShoulderLeft() {

}

function walkBackShoulderRight() {

}

function walkBackFootLeft() {

}

function walkBackFootRight() {
  
}  

function yoyo() {
  if (racoons[0][1].shoulder_L_014.rotation.x >= 0.65*Math.PI || 
    racoons[0][1].shoulder_L_014.rotation.x <= startRotationShoulderL.x) {
    frontLegsDirection *= -1;
  }
}

function print(elem) {
  console.log(elem);
}

function barSpeedF() {
  return  barSpeed + 0.000000001
  // return  1
}

init();