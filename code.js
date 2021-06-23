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
const controls = new OrbitControls(camera, document.querySelector('.parent'));
var raccoons = [];
var raccoonLoaded = false;
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

function trackField(){
  var width = 140;
  var height = 2;
  var lineHeigth = height/8;
  var repeat = width/height;
  var repeatEndLines = (5*height + 6*lineHeigth)/height;
  var trackTexture = './trackTextures/runningTrackField.png';
  var grassTexture = './trackTextures/grass5.png';

  myPlane(200, 200, grassTexture, 0, -0.1, 0, 1, 40, false, true);

  myPlane((5*height + 6*lineHeigth), lineHeigth, trackTexture, (-1/2)*(width + lineHeigth), 0, 0, (height / lineHeigth), repeatEndLines, true);

  myPlane(width, height, trackTexture, 0, 0, -2*(height + lineHeigth), 1, repeat);
  myPlane(width, lineHeigth, trackTexture, 0, 0, (-5/2)*(height + lineHeigth), (height / lineHeigth), repeat);
  
  myPlane(width, height, trackTexture, 0, 0, -(height + lineHeigth), 1, repeat);
  myPlane(width, lineHeigth, trackTexture, 0, 0, (-3/2)*(height + lineHeigth), (height / lineHeigth), repeat);

  myPlane(width, height, trackTexture, 0, 0, 0, 1, repeat);
  myPlane(width, lineHeigth, trackTexture, 0, 0, (height/2 + lineHeigth/2), (height / lineHeigth), repeat);
  myPlane(width, lineHeigth, trackTexture, 0, 0, -(height/2 + lineHeigth/2), (height / lineHeigth), repeat);

  myPlane(width, height, trackTexture, 0, 0, (height + lineHeigth), 1, repeat);
  myPlane(width, lineHeigth, trackTexture, 0, 0, (3/2)*(height + lineHeigth), (height / lineHeigth), repeat);

  myPlane(width, height, trackTexture, 0, 0, 2*(height + lineHeigth), 1, repeat);
  myPlane(width, lineHeigth, trackTexture, 0, 0, (5/2)*(height + lineHeigth), (height / lineHeigth), repeat);

  myPlane((5*height + 6*lineHeigth), lineHeigth, trackTexture, (1/2)*(width + lineHeigth), 0, 0, (height / lineHeigth), repeatEndLines, true);

  myTribune();

}

function myPlane(sizeX, sizeY, texture, x, y, z, line, repeat, endLine = false, grass = false){

  const textureField = loader.load(texture);
  
  if(grass){
    textureField.wrapS = THREE.RepeatWrapping;
    textureField.wrapT = THREE.RepeatWrapping;
    textureField.repeat.set(repeat, repeat);
  } else {
    
    textureField.wrapS = THREE.MirroredRepeatWrapping;
    textureField.wrapT = THREE.ClampToEdgeWrapping;
    textureField.repeat.x = repeat;
    textureField.repeat.y = 1/line;
  }
  textureField.magFilter = THREE.NearestFilter;

  const planeGeo = new THREE.PlaneGeometry(sizeX, sizeY);
  const planeMat = new THREE.MeshBasicMaterial({
    map: textureField,
    side: THREE.DoubleSide,
  });

  if(line != 1) planeMat.color.setRGB(5, 5, 5);

  const mesh = new THREE.Mesh(planeGeo,planeMat);
  mesh.rotation.x = Math.PI * -.5;
  if(endLine) mesh.rotation.z = Math.PI * -.5;
  mesh.position.x = x;
  mesh.position.y = y;
  mesh.position.z = z;
  scene.add(mesh);
}

function raccoonBones(root) {
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

function dinoTailAnimation(tail, tailrot, t) {
  var animation = new TWEEN.Tween(tail.rotation).to({x:tail.rotation.x, y:-tailrot, z:tail.rotation.z + tailrot}, t/2);
  animation.repeat(Infinity);
  animation.yoyo(true);
  animation.start();
}

function trex1(x, y, z , t){
  gltfLoader.load('./trex1/scene.gltf', function (gltf){
    const root = gltf.scene;
    var scaling = 3;
    root.scale.multiplyScalar(scaling); // adjust scalar factor to match your scene scale
    root.position.x = 0 + x; // once rescaled, position the model where needed
    root.position.y = 0 + y;
    root.position.z = 0 + z;
  
    var leftLeg = [];
    var i = 0;
    root.traverse((object) => {
      if (object.isMesh){
        object.frustumCulled = false;
      }
      if (object.name.substring(0, 6) == "Bip001") {
        var v = parseInt(object.name.substring(object.name.length-2, object.name.length));
        if (v <= 68 && v >= 54){
          leftLeg.push(object);
        }
        if (v <= 83 && v >= 69){
          leftLeg[i].rotation.x = -object.rotation.x;
          leftLeg[i].rotation.y = -object.rotation.y;
          leftLeg[i].rotation.z = object.rotation.z;
          
          leftLeg[i].position.x = object.position.x;
          leftLeg[i].position.y = object.position.y;
          leftLeg[i].position.z = -object.position.z;
          i++;
        }
      }
    });
    
    var head = root.getObjectByName("Bip001_Head_7");
    head.rotation.y = -Math.PI*0.1;
    head.rotation.x = -Math.PI*0.1;
    var animation = new TWEEN.Tween(head.rotation).to({x:Math.PI*0.1, y:Math.PI*0.1, z:Math.PI*0.1}, t/1.5);
    animation.repeat(Infinity);
    animation.yoyo(true);
    animation.start();

    var tail1 = root.getObjectByName("Bip001_Tail_95");
    var tail2 = root.getObjectByName("Bip001_Tail1_92");
    var tail3 = root.getObjectByName("Bip001_Tail2_91");
    var tail4 = root.getObjectByName("Bip001_Tail3_90");
    var tail5 = root.getObjectByName("Bip001_Tail4_89");
    var tail6 = root.getObjectByName("Bip001_Tail5_88");
    var tail7 = root.getObjectByName("Bip001_Tail6_87");
    var tail8 = root.getObjectByName("Bip001_Tail7_86");
    var tail9 = root.getObjectByName("Bip001_Tail8_85");
    var tail10 = root.getObjectByName("Bip001_TailNub_84");

    var tailrot = 0.05;
    tail1.rotation.y = Math.PI*2*tailrot;
    tail2.rotation.y = Math.PI*tailrot;
    tail3.rotation.y = Math.PI*tailrot;
    tail4.rotation.y = Math.PI*tailrot;
    tail5.rotation.y = Math.PI*tailrot;
    tail6.rotation.y = Math.PI*tailrot;
    tail7.rotation.y = Math.PI*tailrot;
    tail8.rotation.y = Math.PI*tailrot;
    tail9.rotation.y = Math.PI*tailrot;
    tail10.rotation.y = Math.PI*tailrot;
    dinoTailAnimation(tail1, tailrot, t);
    dinoTailAnimation(tail2, 1.8*tailrot, t);
    dinoTailAnimation(tail3, 1.6*tailrot, t);
    dinoTailAnimation(tail4, 1.4*tailrot, t);
    dinoTailAnimation(tail5, 1.2*tailrot, t);
    dinoTailAnimation(tail6, tailrot, t);
    dinoTailAnimation(tail7, 1.2*tailrot, t);
    dinoTailAnimation(tail8, 2.4*tailrot, t);
    dinoTailAnimation(tail9, 2.6*tailrot, t);
    dinoTailAnimation(tail10, 2.8*tailrot, t);

    scene.add(root);
  }, undefined, function (error) {
    console.error(error);
  });
}

function chicken1(x, y, z, t){
  gltfLoader.load('./chicken1/scene.gltf', function (gltf){
    const root = gltf.scene;
    root.scale.multiplyScalar(2); // adjust scalar factor to match your scene scale
    root.position.x = 0 + x; // once rescaled, position the model where needed
    root.position.y = 0.808 + y;
    root.position.z = 0 + z;
    root.rotation.y = Math.PI * -.5;
    root.scale.y = 1.5;
  
    root.traverse((object) => {
      if (object.isMesh){
        object.frustumCulled = false;
      }
    });

    
    var animation1 = new TWEEN.Tween(root.scale).to({x:root.scale.x, y:2, z:root.scale.z}, t);
    animation1.repeat(Infinity);
    animation1.yoyo(true);
    animation1.start();

    var animation2 = new TWEEN.Tween(root.position).to({x:root.position.x, y: y + 2.058, z:root.position.z}, t);
    animation2.repeat(Infinity);
    animation2.yoyo(true);
    animation2.start();

    scene.add(root);
  }, undefined, function (error) {
    console.error(error);
  });
}

function chicken2(x, y, z, t){
  gltfLoader.load('./chicken2/scene.gltf', function (gltf){
    const root = gltf.scene;
    root.scale.multiplyScalar(2); // adjust scalar factor to match your scene scale
    root.position.x = 0 + x; // once rescaled, position the model where needed
    root.position.y = -0.04 + y;
    root.position.z = 0 + z;
    root.rotation.y = Math.PI * .5;
    root.scale.y = 1.5;
  
    root.traverse((object) => {
      if (object.isMesh){
        object.frustumCulled = false;
      }
    });
    
    var animation1 = new TWEEN.Tween(root.scale).to({x:root.scale.x, y:2, z:root.scale.z}, t);
    animation1.repeat(Infinity);
    animation1.yoyo(true);
    animation1.start();

    scene.add(root);
  }, undefined, function (error) {
    console.error(error);
  });
}

function chicken3(x, y, z, t){
  gltfLoader.load('./chicken3/scene.gltf', function (gltf){
    const root = gltf.scene;
    var scaling = 5;
    root.scale.multiplyScalar(scaling); // adjust scalar factor to match your scene scale
    root.position.x = 0 + x; // once rescaled, position the model where needed
    root.position.y = 0 + y;
    root.position.z = 0 + z;
    root.rotation.y = Math.PI * -.5;
    root.scale.z = scaling*2;
    root.scale.y = scaling/2;
  
    root.traverse((object) => {
      if (object.isMesh){
        object.frustumCulled = false;
      }
    });

    
    
    var animation1 = new TWEEN.Tween(root.scale).to({x:root.scale.x, y:scaling, z:scaling}, t);
    animation1.repeat(Infinity);
    animation1.yoyo(true);
    animation1.start();

    scene.add(root);
  }, undefined, function (error) {
    console.error(error);
  });
}

function chicken4(x, y, z, t){
  gltfLoader.load('./chicken4/scene.gltf', function (gltf){
    const root = gltf.scene;
    var scaling = 7;
    root.scale.multiplyScalar(scaling); // adjust scalar factor to match your scene scale
    root.position.x = 0 + x; // once rescaled, position the model where needed
    root.position.y = 0 + y;
    root.position.z = 0 + z;
  
    root.traverse((object) => {
      if (object.isMesh){
        object.frustumCulled = false;
      }
    });

    var leftWing = root.getObjectByName("ArmatureNatureChicken_WingUL_ArmatureNatureChicken");
    var rightWing = root.getObjectByName("ArmatureNatureChickenWingUR_ArmatureNatureChicken");
    var head = root.getObjectByName("ArmatureNatureChickenHead_ArmatureNatureChicken");

    leftWing.rotation.z-=1*Math.PI;
    leftWing.rotation.y+=0.2*Math.PI;

    rightWing.rotation.z-=1*Math.PI;
    rightWing.rotation.y+=0.2*Math.PI;
    
    var animation1 = new TWEEN.Tween(leftWing.rotation).to({x:leftWing.rotation.x,
                                                            y:leftWing.rotation.y,
                                                            z:leftWing.rotation.z-0.4*Math.PI}, t);
    animation1.repeat(Infinity);
    animation1.yoyo(true);
    animation1.start();

    var animation2 = new TWEEN.Tween(rightWing.rotation).to({x:rightWing.rotation.x,
                                                             y:rightWing.rotation.y,
                                                             z:rightWing.rotation.z-0.4*Math.PI}, t);
    animation2.repeat(Infinity);
    animation2.yoyo(true);
    animation2.start();

    
    var animation3 = new TWEEN.Tween(head.position).to({x:head.position.x, y:head.position.y, z:0.05}, t);
    animation3.repeat(Infinity);
    animation3.yoyo(true);
    animation3.start();

    scene.add(root);
  }, undefined, function (error) {
    console.error(error);
  });
}

function chicken5(x, y, z, t){
  gltfLoader.load('./chicken5/scene.gltf', function (gltf){
    const root = gltf.scene;
    var scaling = 0.5
    root.scale.multiplyScalar(scaling); // adjust scalar factor to match your scene scale
    root.position.x = 0 + x; // once rescaled, position the model where needed
    root.position.y = 1 + y;
    root.position.z = 0 + z;
  
    root.traverse((object) => {
      if (object.isMesh){
        object.frustumCulled = false;
      }
    });
    
    var animation1 = new TWEEN.Tween(root.scale).to({x:scaling*2, y:scaling*1.1, z:root.scale.z}, t);
    animation1.repeat(Infinity);
    animation1.yoyo(true);
    animation1.start();

    var animation2 = new TWEEN.Tween(root.rotation).to({x:-0.25*Math.PI, y:root.rotation.y, z:root.rotation.z}, t);
    animation2.repeat(Infinity);
    animation2.yoyo(true);
    animation2.start();

    scene.add(root);
  }, undefined, function (error) {
    console.error(error);
  });
}

function pigeon1(x, y, z, t){
  gltfLoader.load('./pigeon1/scene.gltf', function (gltf){
    const root = gltf.scene;
    var scaling = 0.1;
    root.scale.multiplyScalar(scaling); // adjust scalar factor to match your scene scale
    root.position.x = 0 + x; // once rescaled, position the model where needed
    root.position.y = 0 + y;
    root.position.z = 0 + z;
  
    root.traverse((object) => {
      if (object.isMesh){
        object.frustumCulled = false;
      }
    });

    
    var animation1 = new TWEEN.Tween(root.scale).to({x:root.scale.x, y:scaling, z:root.scale.z}, t);
    animation1.repeat(Infinity);
    animation1.yoyo(true);
    animation1.start();

    var animation2 = new TWEEN.Tween(root.position).to({x:root.position.x, y: y + scaling*10, z:root.position.z}, t);
    animation2.repeat(Infinity);
    animation2.yoyo(true);
    animation2.start();

    var animation3 = new TWEEN.Tween(root.rotation).to({x:root.rotation.x, y: Math.PI*2, z:root.rotation.z}, t);
    animation3.repeat(Infinity);
    animation3.repeatDelay(t);
    animation3.yoyo(true);
    animation3.start();

    scene.add(root);
  }, undefined, function (error) {
    console.error(error);
  });
}

function seal1(x, y, z, t){
  gltfLoader.load('./seal1/scene.gltf', function (gltf){
    const root = gltf.scene;
    var scaling = 0.015;
    root.scale.multiplyScalar(scaling); // adjust scalar factor to match your scene scale
    root.position.x = 0 + x; // once rescaled, position the model where needed
    root.position.y = 0 + y;
    root.position.z = 0 + z;
    root.rotation.y = Math.PI*0.19;
    
    root.traverse((object) => {
      if (object.isMesh){
        object.frustumCulled = false;
      }
    });
    var a= "Bone003_04"
    root.getObjectByName(a).rotation.y = Math.PI*0.2;
    root.getObjectByName(a).rotation.x = -Math.PI*0.2;
    
    var neck =root.getObjectByName("Bone003_04")
    var animation1 = new TWEEN.Tween(neck.rotation).to({x:Math.PI*0.2, y:-Math.PI*0.2, z:neck.rotation.z}, t);
    animation1.repeat(Infinity);
    animation1.yoyo(true);
    animation1.start();
    scene.add(root);
  }, undefined, function (error) {
    console.error(error);
  });
}

function giraffe1(x, y, z, t){
  gltfLoader.load('./giraffe1/scene.gltf', function (gltf){
    const root = gltf.scene;
    var scaling = 1.8;
    root.scale.multiplyScalar(scaling); // adjust scalar factor to match your scene scale
    root.position.x = 0 + x; // once rescaled, position the model where needed
    root.position.y = 0 + y;
    root.position.z = 0 + z;
    // root.rotation.y = -Math.PI*0.5
    
    root.traverse((object) => {
      if (object.isMesh){
        object.frustumCulled = false;
        object.material.wireframe = false;
      }
      print(object.name);
    });

    var neck1 = root.getObjectByName("Bone003_Armature");
    var neck2 = root.getObjectByName("Bone004_Armature");
    var neck3 = root.getObjectByName("Bone005_Armature");
    var neck4 = root.getObjectByName("Bone006_Armature");
    neck1.rotation.z = Math.PI*0.05;
    neck2.rotation.z = Math.PI*0.07;
    neck3.rotation.z = Math.PI*0.1;
    neck4.rotation.y = Math.PI*0.05;

    var animation1 = new TWEEN.Tween(neck1.rotation).to({x:neck1.rotation.x, y:neck1.rotation.y, z:-Math.PI*0.05}, t);
    animation1.repeat(Infinity);
    animation1.yoyo(true);
    animation1.start();

    var animation2 = new TWEEN.Tween(neck2.rotation).to({x:neck2.rotation.x, y:neck2.rotation.y, z:-Math.PI*0.07}, t);
    animation2.repeat(Infinity);
    animation2.yoyo(true);
    animation2.start();

    var animation3 = new TWEEN.Tween(neck3.rotation).to({x:neck3.rotation.x, y:neck3.rotation.y, z:-Math.PI*0.1}, t);
    animation3.repeat(Infinity);
    animation3.yoyo(true);
    animation3.start();

    var animation4 = new TWEEN.Tween(neck4.rotation).to({x:neck4.rotation.x, y:-Math.PI*0.05, z:neck4.rotation.z}, t);
    animation4.repeat(Infinity);
    animation4.yoyo(true);
    animation4.start();

    scene.add(root);
  }, undefined, function (error) {
    console.error(error);
  });
}

function elephant1(x, y, z, t){
  gltfLoader.load('./elephant1/scene.gltf', function (gltf){
    const root = gltf.scene;
    var scaling = 4;
    root.scale.multiplyScalar(scaling); // adjust scalar factor to match your scene scale
    root.position.x = 0 + x; // once rescaled, position the model where needed
    root.position.y = 0 + y;
    root.position.z = -3 + z;
    root.rotation.y = -Math.PI*0.5;
    
    root.traverse((object) => {
      if (object.isMesh){
        object.frustumCulled = false;
        object.material.wireframe = false;
      }
      print(object.name);
    });

    var rightEar = root.getObjectByName("Elephant_BabyMeshbone_R_ear_00_15");
    var animation1 = new TWEEN.Tween(rightEar.rotation).to({x:rightEar.rotation.x, y:rightEar.rotation.y, z:-Math.PI*0.4}, t);
    animation1.repeat(Infinity);
    animation1.yoyo(true);
    animation1.start();
    
    var leftEar = root.getObjectByName("Elephant_BabyMeshbone_L_ear_00_21");
    var animation2 = new TWEEN.Tween(leftEar.rotation).to({x:leftEar.rotation.x, y:leftEar.rotation.y, z:-Math.PI*0.4}, t);
    animation2.repeat(Infinity);
    animation2.yoyo(true);
    animation2.start();

    scene.add(root);
  }, undefined, function (error) {
    console.error(error);
  });
}


function tribunePopulation(){
  chicken1(0, 4, -49, 400);
  chicken1(10, 4, -52, 300);
  chicken1(-15, 4, -50, 500);

  chicken2(20, 4.1, -50, 450);
  chicken2(5, 7.1, -59, 550);
  chicken2(-8, 10.1, -68.5, 150);

  chicken3(30, 7, -53, 250);
  chicken3(-28.5, 16.1, -87, 375);
  chicken3(-17.25, 13.1, -77, 425);

  chicken4(40, 16.1, -83.5, 264);
  chicken4(45, 13.1, -74, 394);
  chicken4(36, 10.1, -64, 204);

  chicken5(-38.5, 4.1, -50, 298);
  chicken5(-44.5, 7.1, -59, 379);
  chicken5(-40.8, 10.1, -67, 403);

  pigeon1(-70, 4.1, -50.2, 378);
  pigeon1(-65.16, 16.1, -83.9, 413);
  pigeon1(69, 4.1, -46.4, 321);

  trex1(-55, 4.1, -50, 900);
  trex1(-60, 10.1, -68, 1000);
  trex1(20, 10.1, -70, 1100);

  seal1(-50, 16.1, -90, 486);
  seal1(-45, 13.1, -80, 562);
  seal1(-15, 7.1, -60, 562);

  giraffe1(48, 4.1, -46.5, 691);
  giraffe1(54, 10.1, -66.9, 758);
  giraffe1(16, 16.1, -84.1, 1200);

  elephant1(-30, 7.1, -69.5, 727);
  elephant1(-0.5, 13.1, -86.9, 653);
  elephant1(63, 16.1, -96.9, 365);

}

function myTribune(){
  tribunePopulation();
  gltfLoader.load('./tribune/scene.gltf', function (gltf){
    const root = gltf.scene;
    root.scale.multiplyScalar(0.01);
    root.scale.x *= 2;
    root.scale.z *= 3;
    root.position.z = -70;
    root.rotation.y = Math.PI * .5;
    root.traverse((object) => {
      if (object.isMesh){
        object.frustumCulled = false;
        // object.castShadow = true;
        // object.receiveShadow = true;
        // object.transp
      } 
    });
    scene.add(root);
  }, undefined, function (error) {
    console.error(error);
  });
}

function myRaccoon(){
  gltfLoader.load('./racoon2/scene.gltf', function (gltf){
    const root = gltf.scene;
    root.scale.multiplyScalar(2); // adjust scalar factor to match your scene scale
    root.position.x = -140/2; // once rescaled, position the model where needed
    root.position.y = 0.1;
    root.position.z = 0;
    root.rotation.y = Math.PI * .5;
  
    root.traverse((object) => {
      if (object.isMesh){
        object.frustumCulled = false;
        // object.castShadow = true;
        // object.receiveShadow = true;
        // object.transp
      } 
    });

    raccoonStartPosition(root)

    speed = 1;
    maxSpeed = speed * 3;
    target = {x:20, y:root.position.y, z:root.position.z};

    bone2Animation = new TWEEN.Tween(root.position).to(target, 20/speed * 1000);
    bone2Animation.start();
    scene.add(root);
    raccoonLoaded = true;
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
  const intensity = 2;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(0, 100, 0);
  light.target.position.set(0, 0, 0);
  // light.castShadow = true;
  scene.add(light);
  scene.add(light.target);
}

function init(){
  // camera.position.set(0, 10, 20);
  // controls.target.set(0, 0, 0);
  camera.position.set(0, 10, -50);
  controls.target.set(0, 0, -50);
  controls.update();
  scene.background = new THREE.Color("green");
  renderer.shadowMap.enabled = true;
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
  trackField();
  myRaccoon();
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

  walkRaccoon();
  
  renderer.render(scene, camera);
  TWEEN.update();
  requestAnimationFrame(render);
}

function raccoonStartPosition(root) {
  raccoons.push([root, raccoonBones(root)]);

  //shoulders
  startRotationShoulderL = {x: raccoons[raccoons.length-1][1].shoulder_L_014.rotation.x, 
                            z: raccoons[raccoons.length-1][1].shoulder_L_014.rotation.z}
  changeShoulderL = {x: Math.abs(startRotationShoulderL.x - 0.65*Math.PI), 
                     z: Math.abs(startRotationShoulderL.z - -0.1*Math.PI)}
  raccoons[raccoons.length-1][1].shoulder_L_014.rotation.x= 0.5*Math.PI;
  raccoons[raccoons.length-1][1].shoulder_L_014.rotation.z= -0.1*Math.PI;

  startRotationShoulderR = {x: raccoons[raccoons.length-1][1].shoulder_R_026.rotation.x, 
                            z: raccoons[raccoons.length-1][1].shoulder_R_026.rotation.z}
  changeShoulderR = {x: Math.abs(startRotationShoulderR.x - 0.65*Math.PI), 
                     z: Math.abs(startRotationShoulderR.z - 0.1*Math.PI)}
  raccoons[raccoons.length-1][1].shoulder_R_026.rotation.x= 0.5*Math.PI;
  raccoons[raccoons.length-1][1].shoulder_R_026.rotation.z= 0.1*Math.PI;


  //feet
  frontFootL1 = {x: Math.abs(0.25*Math.PI - 0)}
  frontFootL2 = {x: Math.abs(-0.25*Math.PI - 0.25*Math.PI)}
  frontFootL3 = {x: Math.abs(-0.25*Math.PI - 0)}
  footFrontL1 = false;
  footFrontL2 = true;
  footFrontL3 = false;
  raccoons[raccoons.length-1][1].front_foot_L_017.rotation.x = -0.25*Math.PI;

  frontFootR1 = {x: Math.abs(0.25*Math.PI - 0)}
  frontFootR2 = {x: Math.abs(-0.25*Math.PI - 0.25*Math.PI)}
  frontFootR3 = {x: Math.abs(-0.25*Math.PI - 0)}
  footFrontR1 = false;
  footFrontR2 = true;
  footFrontR3 = false;
  raccoons[raccoons.length-1][1].front_foot_R_029.rotation.x = -0.25*Math.PI;

  backFootR = {x: Math.abs(0.6*Math.PI - 1.1*Math.PI)}
  raccoons[raccoons.length-1][1].foot_01_R_054.rotation.x = 0.6*Math.PI;

  backFootL = {x: Math.abs(0.6*Math.PI - 1.1*Math.PI)}
  raccoons[raccoons.length-1][1].foot_01_L_042.rotation.x = 0.6*Math.PI;

  // Thigh
  startRotationThighBackL = {x: raccoons[raccoons.length-1][1].thigh_L_039.rotation.x, 
                            z: raccoons[raccoons.length-1][1].thigh_L_039.rotation.z}
  changeThighBackL = {x: Math.abs(startRotationThighBackL.x - 0.2*Math.PI), 
                     z: Math.abs(startRotationThighBackL.z - -0.12*Math.PI)}
  raccoons[raccoons.length-1][1].thigh_L_039.rotation.x = 0.3*Math.PI;


  startRotationThighBackR = {x: raccoons[raccoons.length-1][1].thigh_R_051.rotation.x, 
                         z: raccoons[raccoons.length-1][1].thigh_R_051.rotation.z}
  changeThighBackR = {x: Math.abs(startRotationThighBackR.x - 0.2*Math.PI), 
                  z: Math.abs(startRotationThighBackR.z - 0.12*Math.PI)}
  raccoons[raccoons.length-1][1].thigh_R_051.rotation.x = 0.3*Math.PI;


  // Neck            
  changeNeck = {x: 0.3*Math.PI}

  // Tail
  var tailRad = 0.1*Math.PI;
  tailValues = {
    t1:{
      start: raccoons[raccoons.length-1][1].tail_00_03.rotation.x-2*tailRad, 
      end: raccoons[raccoons.length-1][1].tail_00_03.rotation.x+0.1*tailRad, 
      step: (2.1*tailRad)/(legStepsAnimation*0.7)},
    t2:{
      start: raccoons[raccoons.length-1][1].tail_01_04.rotation.x-0.3*tailRad, 
      end: raccoons[raccoons.length-1][1].tail_01_04.rotation.x+0.3*tailRad, 
      step: (0.6*tailRad)/(legStepsAnimation*0.7)},
    t3:{
      start: raccoons[raccoons.length-1][1].tail_02_05.rotation.x-0.5*tailRad, 
      end: raccoons[raccoons.length-1][1].tail_02_05.rotation.x+0.5*tailRad, 
      step: (1*tailRad)/(legStepsAnimation*0.7)},
    t4:{
      start: raccoons[raccoons.length-1][1].tail_03_06.rotation.x-0.7*tailRad, 
      end: raccoons[raccoons.length-1][1].tail_03_06.rotation.x+0.7*tailRad, 
      step: (1.4*tailRad)/(legStepsAnimation*0.7)},
    t5:{
      start: raccoons[raccoons.length-1][1].tail_04_07.rotation.x-tailRad, 
      end: raccoons[raccoons.length-1][1].tail_04_07.rotation.x+tailRad, 
      step: (2*tailRad)/(legStepsAnimation*0.7)}
  };  
  raccoons[raccoons.length-1][1].tail_00_03.rotation.x += +0.1*tailRad - (tailValues.t1.step*(legStepsAnimation*0.7))*0.68;
  raccoons[raccoons.length-1][1].tail_01_04.rotation.x += +0.3*tailRad - (tailValues.t2.step*(legStepsAnimation*0.7))*0.68;
  raccoons[raccoons.length-1][1].tail_02_05.rotation.x += +0.5*tailRad - (tailValues.t3.step*(legStepsAnimation*0.7))*0.68;
  raccoons[raccoons.length-1][1].tail_03_06.rotation.x += +0.7*tailRad - (tailValues.t4.step*(legStepsAnimation*0.7))*0.68;
  raccoons[raccoons.length-1][1].tail_04_07.rotation.x += +tailRad - (tailValues.t5.step*(legStepsAnimation*0.7))*0.68;
  
  // Shin
  startRotationShinFrontR = raccoons[raccoons.length-1][1].front_shin_R_028.rotation.x;
  changeShinFrontR = Math.abs(startRotationShinFrontR - -0.5*Math.PI);

  startRotationShinFrontL = raccoons[raccoons.length-1][1].front_shin_L_016.rotation.x;
  changeShinFrontL = Math.abs(startRotationShinFrontL - -0.5*Math.PI);



  startRotationBackShin = {r: raccoons[raccoons.length-1][1].shin_R_052.rotation.x, l: raccoons[raccoons.length-1][1].shin_L_040.rotation.x} 
  changeBackShin = Math.abs(startRotationBackShin.r - 0.5*Math.PI);

  //   frontFootL1 = {x: Math.abs(0.25*Math.PI - 0)}
  // frontFootL2 = {x: Math.abs(-0.25*Math.PI - 0.25*Math.PI)}
  // frontFootL3 = {x: Math.abs(-0.25*Math.PI - 0)}
  // footFrontL1 = false;
  // footFrontL2 = true;
  // footFrontL3 = false;
  // raccoons[raccoons.length-1][1].front_foot_L_017.rotation.x = -0.25*Math.PI;
  // z: Math.abs(startRotationShoulderL.z - -0.1*Math.PI)}
  // raccoons[raccoons.length-1][1].shoulder_L_014.rotation.x= 0.5*Math.PI;
  // raccoons[raccoons.length-1][1].shoulder_L_014.rotation.z= -0.1*Math.PI;

  // startRotationShoulderR = {x: raccoons[raccoons.length-1][1].shoulder_R_026.rotation.x, 
  //     z: raccoons[raccoons.length-1][1].shoulder_R_026.rotation.z}
  // changeShoulderR = {x: Math.abs(startRotationShoulderR.x - 0.65*Math.PI), 
  // z: Math.abs(startRotationShoulderR.z - 0.1*Math.PI)}
  // raccoons[raccoons.length-1][1].shoulder_R_026.rotation.x= 0.5*Math.PI;
  // raccoons[raccoons.length-1][1].shoulder_R_026.rotation.z= 0.1*Math.PI;

  // raccoons[raccoons.length-1][1].shin_R_052.rotation.x = 0.5*Math.PI;
  // shin_R_052 : root.getObjectByName("shin_R_052"),
  // shin_L_040 : root.getObjectByName("shin_L_040"),
}

// shoulders
var changeShoulderL;
var startRotationShoulderL;

var changeShoulderR;
var startRotationShoulderR;

var frontLegsDirection = 1;
var legStepsAnimation = 100;

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

var backFootR;
var backFootL;

//thigh
var startRotationThighBackL; 
var changeThighBackL;
var startRotationThighBackR; 
var changeThighBackR;

var changeNeck;

var changeShinFrontR;
var startRotationShinFrontR;
var shinFrontR1 = true;
var shinFrontR2 = false;
var shinFrontR3 = false;

var changeShinFrontL;
var startRotationShinFrontL;
var shinFrontL1 = true;
var shinFrontL2 = false;
var shinFrontL3 = false;

var startRotationBackShin;
var changeBackShin;
var backShin1 = false;
var backShin2 = false;

var tailValues;
var tail1 = true;
var tail2 = false;

function walkRaccoon() {
  if(raccoonLoaded){
    bone2Animation.onUpdate(function(){
      bone2Animation.stop();
      // bone2Animation = new TWEEN.Tween(aa.position).to(target, ((20 - aa.position.x) / (speed*barSpeed + 0.00000001)) * 1000);
      // bone2Animation = new TWEEN.Tween(raccoons[0][0].position).to(target, ((20 - raccoons[0][0].position.x) / (speed*barSpeedF())) * 1000);
      // bone2Animation.start(); 
    });
    
    var step = 3/legStepsAnimation;
    raccoons[0][0].position.x += step*barSpeedF();
    


    walkFrontShoulderLeft();
    walkFrontShoulderRight();
    walkFrontShinRight();
    walkFrontShinLeft();
    
    walkFrontFootLeft();
    walkFrontFootRight();

    walkBackThighLeft();
    walkBackThighRight();
    
    walkBackShin();
    
    walkBackFootLeft();
    walkBackFootRight();    
    
    walkSpine();

    walkRibCage();

    walkNeck();

    tail();

    yoyo();
  }
}

function walkFrontShoulderLeft() {
  var shoulderLStep = {x: changeShoulderL.x/legStepsAnimation, z: changeShoulderL.z/legStepsAnimation}
  raccoons[0][1].shoulder_L_014.rotation.x += shoulderLStep.x * frontLegsDirection*barSpeedF();
  raccoons[0][1].shoulder_L_014.rotation.z += shoulderLStep.z * frontLegsDirection*barSpeedF();
}

function walkFrontShoulderRight() {
  var shoulderRStep = {x: changeShoulderR.x/legStepsAnimation, z: changeShoulderR.z/legStepsAnimation}
  raccoons[0][1].shoulder_R_026.rotation.x += shoulderRStep.x * frontLegsDirection*barSpeedF();
  raccoons[0][1].shoulder_R_026.rotation.z -= shoulderRStep.z * frontLegsDirection*barSpeedF();
}

function walkFrontFootLeft() {
  var footL1Step = {x: frontFootL1.x/(legStepsAnimation)}
  var footL2Step = {x: frontFootL2.x/(legStepsAnimation*0.32)}
  var footL3Step = {x: frontFootL3.x/(legStepsAnimation*0.68)}

  if (footFrontL1) {
    raccoons[0][1].front_foot_L_017.rotation.x += frontLegsDirection*footL1Step.x*barSpeedF();
    if (frontLegsDirection == 1) {
      raccoons[raccoons.length-1][1].front_foot_L_017.rotation.x = 0;
      footFrontL1 = false;
      footFrontL2 = false;
      footFrontL3 = true;
    }
  }

  if (footFrontL2) {
    raccoons[0][1].front_foot_L_017.rotation.x += frontLegsDirection*footL2Step.x*barSpeedF();
    if (frontLegsDirection == -1) {
      raccoons[raccoons.length-1][1].front_foot_L_017.rotation.x = 0.25*Math.PI;
      footFrontL2 = false;
      footFrontL3 = false;
      footFrontL1 = true;
    }
  }

  if (footFrontL3) {
    raccoons[0][1].front_foot_L_017.rotation.x += -frontLegsDirection*footL3Step.x*barSpeedF();
    if (raccoons[0][1].front_foot_L_017.rotation.x <= -0.25*Math.PI) {
      raccoons[raccoons.length-1][1].front_foot_L_017.rotation.x = -0.25*Math.PI;
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
    raccoons[0][1].front_foot_R_029.rotation.x += frontLegsDirection*footR1Step.x*barSpeedF();
    if (frontLegsDirection == 1) {
      raccoons[raccoons.length-1][1].front_foot_R_029.rotation.x = 0;
      footFrontR1 = false;
      footFrontR2 = false;
      footFrontR3 = true;
    }
  }

  if (footFrontR2) {
    raccoons[0][1].front_foot_R_029.rotation.x += frontLegsDirection*footR2Step.x*barSpeedF();
    if (frontLegsDirection == -1) {
      raccoons[raccoons.length-1][1].front_foot_R_029.rotation.x = 0.25*Math.PI;
      footFrontR2 = false;
      footFrontR3 = false;
      footFrontR1 = true;
    }
  }

  if (footFrontR3) {
    raccoons[0][1].front_foot_R_029.rotation.x += -frontLegsDirection*footR3Step.x*barSpeedF();
    if (raccoons[0][1].front_foot_R_029.rotation.x <= -0.25*Math.PI) {
      raccoons[raccoons.length-1][1].front_foot_R_029.rotation.x = -0.25*Math.PI;
      footFrontR3 = false;
      footFrontR1 = false;
      footFrontR2 = true;
    }
  }
}

function walkBackThighLeft() {
  var thighLStep = {x: changeThighBackL.x/legStepsAnimation, z: changeThighBackL.z/legStepsAnimation}
  raccoons[0][1].thigh_L_039.rotation.x -= thighLStep.x * frontLegsDirection*barSpeedF();
  raccoons[0][1].thigh_L_039.rotation.z -= thighLStep.z * frontLegsDirection*barSpeedF();
}

function walkBackThighRight() {
  var thighRStep = {x: changeThighBackR.x/legStepsAnimation, z: changeThighBackR.z/legStepsAnimation}
  raccoons[0][1].thigh_R_051.rotation.x -= thighRStep.x * frontLegsDirection*barSpeedF();
  raccoons[0][1].thigh_R_051.rotation.z += thighRStep.z * frontLegsDirection*barSpeedF();
}

function walkBackFootLeft() {
  var footLStep = {x: backFootL.x/(legStepsAnimation*0.85)}
  if (raccoons[0][1].thigh_R_051.rotation.x >= 0.3*Math.PI) {
    raccoons[0][1].foot_01_L_042.rotation.x -= footLStep.x * frontLegsDirection*barSpeedF();
  } else {
    raccoons[raccoons.length-1][1].foot_01_L_042.rotation.x = 0.6*Math.PI;
  }
}

function walkBackFootRight() {
  var footRStep = {x: backFootR.x/(legStepsAnimation*0.85)}
  if (raccoons[0][1].thigh_R_051.rotation.x >= 0.3*Math.PI) {
    raccoons[0][1].foot_01_R_054.rotation.x -= footRStep.x * frontLegsDirection*barSpeedF();
  } else {
    raccoons[raccoons.length-1][1].foot_01_R_054.rotation.x = 0.6*Math.PI;
  }
}  

function walkFrontShinRight() {
  var step1 = {x: changeShinFrontR/(legStepsAnimation*0.32)}
  var step2 = {x: changeShinFrontR/(legStepsAnimation*0.68)}
  if (shinFrontR1) {
    if (frontLegsDirection == -1) {
      shinFrontR1 = false;
      shinFrontR2 = true;
    }
  } 
  if (shinFrontR2) {
    raccoons[0][1].front_shin_R_028.rotation.x += step1.x * frontLegsDirection*barSpeedF();
    if (raccoons[raccoons.length-1][1].shoulder_L_014.rotation.x <= 0.5*Math.PI) {
      shinFrontR2 = false;
      shinFrontR3 = true;
    }
  }
  if (shinFrontR3) {
    raccoons[0][1].front_shin_R_028.rotation.x -= step2.x * frontLegsDirection*barSpeedF();
    if ( frontLegsDirection == 1) {
      raccoons[0][1].front_shin_R_028.rotation.x = startRotationShinFrontR;
      shinFrontR3 = false;
      shinFrontR1 = true;
    }
  }
}

function walkFrontShinLeft() {
  var step1 = {x: changeShinFrontL/(legStepsAnimation*0.32)}
  var step2 = {x: changeShinFrontL/(legStepsAnimation*0.68)}
  if (shinFrontL1) {
    if (frontLegsDirection == -1) {
      shinFrontL1 = false;
      shinFrontL2 = true;
    }
  } 
  if (shinFrontL2) {
    raccoons[0][1].front_shin_L_016.rotation.x += step1.x * frontLegsDirection*barSpeedF();
    if (raccoons[raccoons.length-1][1].shoulder_L_014.rotation.x <= 0.5*Math.PI) {
      shinFrontL2 = false;
      shinFrontL3 = true;
    }
  }
  if (shinFrontL3) {
    raccoons[0][1].front_shin_L_016.rotation.x -= step2.x * frontLegsDirection*barSpeedF();
    if ( frontLegsDirection == 1) {
      raccoons[0][1].front_shin_L_016.rotation.x = startRotationShinFrontL;
      shinFrontL3 = false;
      shinFrontL1 = true;
    }
  }
}

function walkBackShin() {
  var step1 = {x: changeBackShin/(legStepsAnimation*0.32)}
  var step2 = {x: changeBackShin/(legStepsAnimation*0.68)}
  if (frontLegsDirection == 1) {
    if (backShin1) {
      raccoons[0][1].shin_R_052.rotation.x += step2.x * frontLegsDirection*barSpeedF();
      raccoons[0][1].shin_L_040.rotation.x += step2.x * frontLegsDirection*barSpeedF();
      if (raccoons[raccoons.length-1][1].shoulder_L_014.rotation.x >= 0.5*Math.PI) {
        backShin1 = false;
        backShin2 = true;
      }
    }
    if (backShin2) {
      raccoons[0][1].shin_R_052.rotation.x -= step1.x * frontLegsDirection*barSpeedF();
      raccoons[0][1].shin_L_040.rotation.x -= step1.x * frontLegsDirection*barSpeedF();
    }
  } else {
    raccoons[0][1].shin_R_052.rotation.x = startRotationBackShin.r;
    raccoons[0][1].shin_L_040.rotation.x = startRotationBackShin.l;
    backShin1 = true;
    backShin2 = false;
  }
}

function walkSpine() {
  var step = 0.1*Math.PI/legStepsAnimation ;
  raccoons[raccoons.length-1][1].spine_00_02.rotation.x -= step*frontLegsDirection*barSpeedF();
  raccoons[raccoons.length-1][1].spine_01_08.rotation.x += step*frontLegsDirection*barSpeedF();
  raccoons[raccoons.length-1][1].spine_02_09.rotation.x += step*frontLegsDirection*barSpeedF();
  raccoons[raccoons.length-1][1].spine_03_010.rotation.x += step*frontLegsDirection*barSpeedF();
  step = 0.049/legStepsAnimation;
  raccoons[raccoons.length-1][1].spine_01_08.position.y -= step*frontLegsDirection*barSpeedF();
  raccoons[raccoons.length-1][1].spine_02_09.position.y -= step*frontLegsDirection*barSpeedF();
  raccoons[raccoons.length-1][1].spine_03_010.position.y -= step*frontLegsDirection*barSpeedF();
}

function walkRibCage() {
  var step1 = 0.21/legStepsAnimation;
  var step2 = 0.07/legStepsAnimation;
  raccoons[0][1].ribcage_038.position.z -= step1*frontLegsDirection*barSpeedF();
  raccoons[0][1].ribcage_038.position.y += step2*frontLegsDirection*barSpeedF();
}

function walkNeck() {
  var neckStep = {x: changeNeck.x/legStepsAnimation}
  raccoons[0][1].neck_011.rotation.x -= neckStep.x * frontLegsDirection*barSpeedF();
}

function tail() {
  if(tail1) {
    raccoons[raccoons.length-1][1].tail_00_03.rotation.x -= tailValues.t1.step*frontLegsDirection*barSpeedF();
    raccoons[raccoons.length-1][1].tail_01_04.rotation.x -= tailValues.t2.step*frontLegsDirection*barSpeedF();
    raccoons[raccoons.length-1][1].tail_02_05.rotation.x -= tailValues.t3.step*frontLegsDirection*barSpeedF();
    raccoons[raccoons.length-1][1].tail_03_06.rotation.x -= tailValues.t4.step*frontLegsDirection*barSpeedF();
    raccoons[raccoons.length-1][1].tail_04_07.rotation.x -= tailValues.t5.step*frontLegsDirection*barSpeedF();
    if (raccoons[raccoons.length-1][1].tail_00_03.rotation.x <= tailValues.t1.start &&
        raccoons[raccoons.length-1][1].tail_01_04.rotation.x <= tailValues.t2.start &&
        raccoons[raccoons.length-1][1].tail_02_05.rotation.x <= tailValues.t3.start &&
        raccoons[raccoons.length-1][1].tail_03_06.rotation.x <= tailValues.t4.start &&
        raccoons[raccoons.length-1][1].tail_04_07.rotation.x <= tailValues.t5.start) {
      raccoons[raccoons.length-1][1].tail_00_03.rotation.x = tailValues.t1.start
      raccoons[raccoons.length-1][1].tail_01_04.rotation.x = tailValues.t2.start
      raccoons[raccoons.length-1][1].tail_02_05.rotation.x = tailValues.t3.start
      raccoons[raccoons.length-1][1].tail_03_06.rotation.x = tailValues.t4.start
      raccoons[raccoons.length-1][1].tail_04_07.rotation.x = tailValues.t5.start
      tail1 = false;
      tail2 = true;
    }
    if (raccoons[raccoons.length-1][1].tail_00_03.rotation.x >= tailValues.t1.end && 
          raccoons[raccoons.length-1][1].tail_01_04.rotation.x >= tailValues.t2.end && 
          raccoons[raccoons.length-1][1].tail_02_05.rotation.x >= tailValues.t3.end && 
          raccoons[raccoons.length-1][1].tail_03_06.rotation.x >= tailValues.t4.end && 
          raccoons[raccoons.length-1][1].tail_04_07.rotation.x >= tailValues.t5.end){
      raccoons[raccoons.length-1][1].tail_00_03.rotation.x = tailValues.t1.end
      raccoons[raccoons.length-1][1].tail_01_04.rotation.x = tailValues.t2.end
      raccoons[raccoons.length-1][1].tail_02_05.rotation.x = tailValues.t3.end
      raccoons[raccoons.length-1][1].tail_03_06.rotation.x = tailValues.t4.end
      raccoons[raccoons.length-1][1].tail_04_07.rotation.x = tailValues.t5.end
      tail1 = false;
      tail2 = true;
    }
  }
  if (tail2) {
    if (((raccoons[raccoons.length-1][1].tail_00_03.rotation.x == tailValues.t1.end && frontLegsDirection == 1) ||
        (raccoons[raccoons.length-1][1].tail_00_03.rotation.x == tailValues.t1.start && frontLegsDirection == -1)) &&
        ((raccoons[raccoons.length-1][1].tail_01_04.rotation.x == tailValues.t2.end && frontLegsDirection == 1) ||
        (raccoons[raccoons.length-1][1].tail_01_04.rotation.x == tailValues.t2.start && frontLegsDirection == -1)) &&
        ((raccoons[raccoons.length-1][1].tail_02_05.rotation.x == tailValues.t3.end && frontLegsDirection == 1) ||
        (raccoons[raccoons.length-1][1].tail_02_05.rotation.x == tailValues.t3.start && frontLegsDirection == -1)) &&
        ((raccoons[raccoons.length-1][1].tail_03_06.rotation.x == tailValues.t4.end && frontLegsDirection == 1) ||
        (raccoons[raccoons.length-1][1].tail_03_06.rotation.x == tailValues.t4.start && frontLegsDirection == -1)) &&
        ((raccoons[raccoons.length-1][1].tail_04_07.rotation.x == tailValues.t5.end && frontLegsDirection == 1) ||
        (raccoons[raccoons.length-1][1].tail_04_07.rotation.x == tailValues.t5.start && frontLegsDirection == -1))) {
      tail2 = false;
      tail1 = true;
    }
  }
}

function yoyo() {
  if (raccoons[0][1].shoulder_L_014.rotation.x >= 0.65*Math.PI || 
    raccoons[0][1].shoulder_L_014.rotation.x <= startRotationShoulderL.x) {
    frontLegsDirection *= -1;
  }
}

function print(elem) {
  console.log(elem);
}

function barSpeedF() {
  return  barSpeed + 0.000000001;
  // return 1
}

init();