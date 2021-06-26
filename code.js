import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';

const canvas = document.querySelector("#c");
var renderer;
const fov = 45;
const near = 0.01;
const far = 1000;
const aspect = 2;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const loadingManager = new THREE.LoadingManager();
const scene = new THREE.Scene();
var gltfLoader = new GLTFLoader(loadingManager);
const controls = new OrbitControls(camera, document.querySelector('.parent'));
var myRacconCursorMesh;
var raccoons = [];
var raccoonLoaded = false;
var bone2Animation;
var a = false;
var s = false;
var speed = [];
var barSpeed = 0;
var maxSpeed = 1.75;
var animations = [];

loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	
};

loadingManager.onLoad = function ( ) {
  var orbitDiv = document.getElementById("orbitDiv");
  var div = document.createElement('div');
  var div2 = document.createElement('div');
  var html = '<div id = "A" class="ng-binding"> <b>A</b> </div> <div id = "S" class="ng-binding">   <b>S</b> </div> <div id = "progressBar-align" class="container">    <div class="progress">      <div id = "speedBar" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:40%"></div>  </div>  </div>';
	createCanvas(orbitDiv, div, div2, html);
};

loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
  document.getElementById("orbitDiv").innerHTML = "loading ";
};

loadingManager.onError = function ( url ) {
};


var loader = new THREE.TextureLoader(loadingManager);


// var cursorAnimation1;
// var cursorAnimation2;
// var elephantAnimation1 = [];
// var elephantAnimation2 = [];
// var giraffeAnimation1;
// var giraffeAnimation2;
// var giraffeAnimation3;
// var giraffeAnimation4;
// var sealAnimation1;
// var pigeonAnimation1;
// var chicken5Animation1;
// var chicken5Animation2;
// var chicken4Animation1;
// var chicken4Animation2;
// var chicken4Animation3;
// var chicken3Animation1;
// var chicken2Animation1;
// var chicken1Animation1;
// var chicken1Animation2;
// var headDinoAnimation;
// var tailAnimations = [];

var aBoxHtml;
var sBoxHtml;
var barHtml;

function trackField(){
  var width = 140;
  var height = 2;
  var lineHeigth = height/8;
  var repeat = width/height;
  var repeatEndLines = (5*height + 6*lineHeigth)/height;
  var trackTexture = './textures/runningTrackField.png';
  var grassTexture = './textures/grass.png';

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
  const planeMat = new THREE.MeshLambertMaterial({
    map: textureField,
    side: THREE.DoubleSide,
  });

  planeMat.color.setRGB(0.4, 0.4, 0.4);
  if(line != 1) planeMat.color.setRGB(2.5, 2.5, 2.5);

  const mesh = new THREE.Mesh(planeGeo,planeMat);
  mesh.rotation.x = Math.PI * -.5;
  if(endLine) mesh.rotation.z = Math.PI * -.5;
  mesh.position.x = x;
  mesh.position.y = y;
  mesh.position.z = z;
  mesh.receiveShadow = true;
  mesh.frustumCulled = true;
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
  animations.push(animation);
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
        object.frustumCulled = true;
        object.castShadow = true;
        object.receiveShadow = true;
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
    var headDinoAnimation = new TWEEN.Tween(head.rotation).to({x:Math.PI*0.1, y:Math.PI*0.1, z:Math.PI*0.1}, t/1.5);
    headDinoAnimation.repeat(Infinity);
    headDinoAnimation.yoyo(true);
    headDinoAnimation.start();

    animations.push(headDinoAnimation);

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
        object.frustumCulled = true;        
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    
    var chicken1Animation1 = new TWEEN.Tween(root.scale).to({x:root.scale.x, y:2, z:root.scale.z}, t);
    chicken1Animation1.repeat(Infinity);
    chicken1Animation1.yoyo(true);
    chicken1Animation1.start();

    var chicken1Animation2 = new TWEEN.Tween(root.position).to({x:root.position.x, y: y + 2.058, z:root.position.z}, t);
    chicken1Animation2.repeat(Infinity);
    chicken1Animation2.yoyo(true);
    chicken1Animation2.start();

    animations.push(chicken1Animation1);
    animations.push(chicken1Animation2);

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
        object.frustumCulled = true;        
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    
    var chicken2Animation1 = new TWEEN.Tween(root.scale).to({x:root.scale.x, y:2, z:root.scale.z}, t);
    chicken2Animation1.repeat(Infinity);
    chicken2Animation1.yoyo(true);
    chicken2Animation1.start();

    animations.push(chicken2Animation1);

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
        object.frustumCulled = true;        
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    
    
    var chicken3Animation1 = new TWEEN.Tween(root.scale).to({x:root.scale.x, y:scaling, z:scaling}, t);
    chicken3Animation1.repeat(Infinity);
    chicken3Animation1.yoyo(true);
    chicken3Animation1.start();

    animations.push(chicken3Animation1);

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
        object.frustumCulled = true;        
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    var leftWing = root.getObjectByName("ArmatureNatureChicken_WingUL_ArmatureNatureChicken");
    var rightWing = root.getObjectByName("ArmatureNatureChickenWingUR_ArmatureNatureChicken");
    var head = root.getObjectByName("ArmatureNatureChickenHead_ArmatureNatureChicken");

    leftWing.rotation.z-=1*Math.PI;
    leftWing.rotation.y+=0.2*Math.PI;

    rightWing.rotation.z-=1*Math.PI;
    rightWing.rotation.y+=0.2*Math.PI;
    
    var chicken4Animation1 = new TWEEN.Tween(leftWing.rotation).to({x:leftWing.rotation.x,
                                                            y:leftWing.rotation.y,
                                                            z:leftWing.rotation.z-0.4*Math.PI}, t);
    chicken4Animation1.repeat(Infinity);
    chicken4Animation1.yoyo(true);
    chicken4Animation1.start();

    var chicken4Animation2 = new TWEEN.Tween(rightWing.rotation).to({x:rightWing.rotation.x,
                                                             y:rightWing.rotation.y,
                                                             z:rightWing.rotation.z-0.4*Math.PI}, t);
    chicken4Animation2.repeat(Infinity);
    chicken4Animation2.yoyo(true);
    chicken4Animation2.start();

    
    var chicken4Animation3 = new TWEEN.Tween(head.position).to({x:head.position.x, y:head.position.y, z:0.05}, t);
    chicken4Animation3.repeat(Infinity);
    chicken4Animation3.yoyo(true);
    chicken4Animation3.start();

    animations.push(chicken4Animation1);
    animations.push(chicken4Animation2);
    animations.push(chicken4Animation3);

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
        object.frustumCulled = true;        
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    
    var chicken5Animation1 = new TWEEN.Tween(root.scale).to({x:scaling*2, y:scaling*1.1, z:root.scale.z}, t);
    chicken5Animation1.repeat(Infinity);
    chicken5Animation1.yoyo(true);
    chicken5Animation1.start();

    var chicken5Animation2 = new TWEEN.Tween(root.rotation).to({x:-0.25*Math.PI, y:root.rotation.y, z:root.rotation.z}, t);
    chicken5Animation2.repeat(Infinity);
    chicken5Animation2.yoyo(true);
    chicken5Animation2.start();

    animations.push(chicken5Animation1);
    animations.push(chicken5Animation2);

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
        object.frustumCulled = true;        
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    
    var pigeonAnimation1 = new TWEEN.Tween(root.scale).to({x:root.scale.x, y:scaling, z:root.scale.z}, t);
    pigeonAnimation1.repeat(Infinity);
    pigeonAnimation1.yoyo(true);
    pigeonAnimation1.start();

    var pigeonAnimation2 = new TWEEN.Tween(root.position).to({x:root.position.x, y: y + scaling*10, z:root.position.z}, t);
    pigeonAnimation2.repeat(Infinity);
    pigeonAnimation2.yoyo(true);
    pigeonAnimation2.start();

    var pigeonAnimation3 = new TWEEN.Tween(root.rotation).to({x:root.rotation.x, y: Math.PI*2, z:root.rotation.z}, t);
    pigeonAnimation3.repeat(Infinity);
    pigeonAnimation3.repeatDelay(t);
    pigeonAnimation3.yoyo(true);
    pigeonAnimation3.start();

    animations.push(pigeonAnimation1);
    animations.push(pigeonAnimation2);
    animations.push(pigeonAnimation3);

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
        object.frustumCulled = true;        
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    var a= "Bone003_04"
    root.getObjectByName(a).rotation.y = Math.PI*0.2;
    root.getObjectByName(a).rotation.x = -Math.PI*0.2;
    
    var neck =root.getObjectByName("Bone003_04")
    var sealAnimation1 = new TWEEN.Tween(neck.rotation).to({x:Math.PI*0.2, y:-Math.PI*0.2, z:neck.rotation.z}, t);
    sealAnimation1.repeat(Infinity);
    sealAnimation1.yoyo(true);
    sealAnimation1.start();

    animations.push(sealAnimation1);

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
        object.frustumCulled = true;        
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    var neck1 = root.getObjectByName("Bone003_Armature");
    var neck2 = root.getObjectByName("Bone004_Armature");
    var neck3 = root.getObjectByName("Bone005_Armature");
    var neck4 = root.getObjectByName("Bone006_Armature");
    neck1.rotation.z = Math.PI*0.05;
    neck2.rotation.z = Math.PI*0.07;
    neck3.rotation.z = Math.PI*0.1;
    neck4.rotation.y = Math.PI*0.05;

    var giraffeAnimation1 = new TWEEN.Tween(neck1.rotation).to({x:neck1.rotation.x, y:neck1.rotation.y, z:-Math.PI*0.05}, t);
    giraffeAnimation1.repeat(Infinity);
    giraffeAnimation1.yoyo(true);
    giraffeAnimation1.start();

    var giraffeAnimation2 = new TWEEN.Tween(neck2.rotation).to({x:neck2.rotation.x, y:neck2.rotation.y, z:-Math.PI*0.07}, t);
    giraffeAnimation2.repeat(Infinity);
    giraffeAnimation2.yoyo(true);
    giraffeAnimation2.start();

    var giraffeAnimation3 = new TWEEN.Tween(neck3.rotation).to({x:neck3.rotation.x, y:neck3.rotation.y, z:-Math.PI*0.1}, t);
    giraffeAnimation3.repeat(Infinity);
    giraffeAnimation3.yoyo(true);
    giraffeAnimation3.start();

    var giraffeAnimation4 = new TWEEN.Tween(neck4.rotation).to({x:neck4.rotation.x, y:-Math.PI*0.05, z:neck4.rotation.z}, t);
    giraffeAnimation4.repeat(Infinity);
    giraffeAnimation4.yoyo(true);
    giraffeAnimation4.start();

    animations.push(giraffeAnimation1);
    animations.push(giraffeAnimation2);
    animations.push(giraffeAnimation3);
    animations.push(giraffeAnimation4);
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
        object.frustumCulled = true;        
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    var rightEar = root.getObjectByName("Elephant_BabyMeshbone_R_ear_00_15");
    var elephantAnimation1 = new TWEEN.Tween(rightEar.rotation).to({x:rightEar.rotation.x, y:rightEar.rotation.y, z:-Math.PI*0.4}, t);
    elephantAnimation1.repeat(Infinity);
    elephantAnimation1.yoyo(true);
    elephantAnimation1.start();
    
    var leftEar = root.getObjectByName("Elephant_BabyMeshbone_L_ear_00_21");
    var elephantAnimation2 = new TWEEN.Tween(leftEar.rotation).to({x:leftEar.rotation.x, y:leftEar.rotation.y, z:-Math.PI*0.4}, t);
    elephantAnimation2.repeat(Infinity);
    elephantAnimation2.yoyo(true);
    elephantAnimation2.start();

    animations.push(elephantAnimation1);
    animations.push(elephantAnimation2);
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

  trex1(-55, 4, -50, 900);
  trex1(-60, 10.1, -68, 1000);
  trex1(20, 10.1, -70, 1100);

  seal1(-50, 16.1, -90, 486);
  seal1(-45, 13.1, -80, 562);
  seal1(-15, 7.1, -60, 562);

  giraffe1(48, 3.85, -46.5, 691);
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
        object.frustumCulled = true;
        object.castShadow = true;
        object.receiveShadow = true;
      } 
    });
    scene.add(root);
  }, undefined, function (error) {
    console.error(error);
  });
}

function stopAnimations(){
  for(var i = 0; i < animations.length ; i++){
    animations[i].stop();
  }
}

function myRaccoon(z, load = false, me = false){
  gltfLoader.load('./racoon2/scene.gltf', function (gltf){
    const root = gltf.scene;
    root.scale.multiplyScalar(2); // adjust scalar factor to match your scene scale
    root.position.x = -140/2 + 0.7; // once rescaled, position the model where needed
    root.position.y = 0.1;
    root.position.z = z;
    root.rotation.y = Math.PI * .5;
  
    root.traverse((object) => {
      if (object.isMesh){
        object.frustumCulled = true;        
        object.castShadow = true;
        object.receiveShadow = true;
      } 
    });


    var otherSpeed = 110 - Math.random()*15;
    if (me) otherSpeed = 180;
    raccoonStartPosition(root, otherSpeed)

    scene.add(root);
    raccoonLoaded = load;
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


function myRacconCursor() {
  const myRacconCursor = new THREE.ConeGeometry(0.3, 1, 4);
  const myRacconCursorMat = new THREE.MeshPhongMaterial({
    color: 0xFF0000,

  });
  myRacconCursorMesh = new THREE.Mesh(myRacconCursor,myRacconCursorMat);
  myRacconCursorMesh.rotation.z += Math.PI;
  myRacconCursorMesh.position.x = -140/2 + 0.7;
  myRacconCursorMesh.position.y = 3.5;
  myRacconCursorMesh.position.z = 4.5;
  var cursorAnimation1 = new TWEEN.Tween(myRacconCursorMesh.position).to({x: myRacconCursorMesh.position.x, y:3, z: myRacconCursorMesh.position.z}, 1300);
  cursorAnimation1.repeat(Infinity);
  cursorAnimation1.yoyo(true);
  cursorAnimation1.start();

  var cursorAnimation2 = new TWEEN.Tween(myRacconCursorMesh.rotation).to({x: myRacconCursorMesh.rotation.x, y:-Math.PI, z: myRacconCursorMesh.rotation.z}, 2000);
  cursorAnimation2.repeat(Infinity);
  cursorAnimation2.yoyo(true);
  cursorAnimation2.start();

  animations.push(cursorAnimation1);
  animations.push(cursorAnimation2);

  scene.add(myRacconCursorMesh);
}

function myDirectionalLight(){
  const color = 0xFFFFFF;
  const intensity = 5;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(100, 50, 0);
  light.target.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow.camera.top = 300;
  light.shadow.camera.bottom = -300;
  light.shadow.camera.right = 300;
  light.shadow.camera.left = -300;
  light.shadow.mapSize.width = 20000;
  light.shadow.mapSize.height = 20000;

  const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(cameraHelper);

  const helper = new THREE.DirectionalLightHelper(light);
  scene.add(helper);
  scene.add(light);
  scene.add(light.target);
}

function createStyleCss(style , head, css){
  head.appendChild(style);

  style.type = 'text/css';
  if (style.styleSheet){
    // This is required for IE8 and below.
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

function createCanvas(orbitDiv, div, div2, html){
  orbitDiv.innerHTML= "";
  div2.setAttribute("id","hud");
  div2.setAttribute("ng-class","{visible: style.visible");
  div2.setAttribute("class","visible");
  div2.innerHTML= html;
  div.appendChild(renderer.domElement);
  div.appendChild(div2);
  orbitDiv.appendChild(div);
}

function init(){
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  var css = 'html, body {  margin: 0;  height: 100%;} #customControls { margin-left: 20px; z-index: 2;} #progressBar-align { position: relative; width: 854px; height: 200px;margin: auto;} #hud { position: absolute;top: 0;width: 100%;height: 100%;margin: auto;z-index: 3;display: none;} #hud.visible { display: block;} #A, #S{ position: absolute; border: 3px solid #FFF; border-radius: 5px; color: #FFF; font-family: arial;} #A { bottom: 10px; left: 10px; width: 80pt; text-align: center; background: #AA3333; font-size: 50pt; font-weight: bold; padding: 5px;} #S { bottom: 10px; left: 120px; width: 80pt; text-align: center; background: #3333AA; font-size: 50pt; font-weight: bold;padding: 5px;} #stats { float: right;}';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  createStyleCss(style, head, css);
  
  renderer.shadowMap.enabled = true;
  camera.position.set(0, 10, 20);
  controls.target.set(0, 0, 0);
  // camera.position.set(0, 10, -50);
  // controls.target.set(0, 0, -50);
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

  myRacconCursor();

  myRaccoon(4.5, false, true);
  requestAnimationFrame(render);
  setTimeout(() => {
    myRaccoon(2.25);
    setTimeout(() => {
      myRaccoon(0);
      setTimeout(() => {
        myRaccoon(-2.25);
        setTimeout(() => {
          myRaccoon(-4.5, true);
        }, 500);
      }, 500);
    }, 500);
  }, 500);
  setTimeout(() => {
    requestAnimationFrame(render);
  }, 2000);
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

  barSpeed -= 0.001;
  if(barSpeed < 0) barSpeed = 0;
  // console.log(time);
  var percentageBarSpeed = String(Math.round((barSpeed/3)*100));

  // updateBar(percentageBarSpeed);

  walkRaccoon(time);

  renderer.render(scene, camera);
  TWEEN.update();
  requestAnimationFrame(render);
}

function raccoonStartPosition(root, otherSpeed) {
  raccoons.push([root, raccoonBones(root)]);
  legStepsAnimation.push(otherSpeed);
  frontLegsDirection.push(1);

  //shoulders
  startRotationShoulderL.push({x: raccoons[raccoons.length-1][1].shoulder_L_014.rotation.x, 
                               z: raccoons[raccoons.length-1][1].shoulder_L_014.rotation.z})
  changeShoulderL.push({x: Math.abs(startRotationShoulderL[raccoons.length - 1].x - 0.65*Math.PI), 
                        z: Math.abs(startRotationShoulderL[raccoons.length - 1].z - -0.1*Math.PI)})
  raccoons[raccoons.length-1][1].shoulder_L_014.rotation.x= 0.5*Math.PI;
  raccoons[raccoons.length-1][1].shoulder_L_014.rotation.z= -0.1*Math.PI;

  startRotationShoulderR.push({x: raccoons[raccoons.length-1][1].shoulder_R_026.rotation.x, 
                               z: raccoons[raccoons.length-1][1].shoulder_R_026.rotation.z})
  changeShoulderR.push({x: Math.abs(startRotationShoulderR[raccoons.length - 1].x - 0.65*Math.PI), 
                        z: Math.abs(startRotationShoulderR[raccoons.length - 1].z - 0.1*Math.PI)})
  raccoons[raccoons.length-1][1].shoulder_R_026.rotation.x= 0.5*Math.PI;
  raccoons[raccoons.length-1][1].shoulder_R_026.rotation.z= 0.1*Math.PI;


  //feet
  frontFootL1.push({x: Math.abs(0.25*Math.PI - 0)})
  frontFootL2.push({x: Math.abs(-0.25*Math.PI - 0.25*Math.PI)})
  frontFootL3.push({x: Math.abs(-0.25*Math.PI - 0)})
  footFrontL1.push(false);
  footFrontL2.push(true);
  footFrontL3.push(false);
  raccoons[raccoons.length-1][1].front_foot_L_017.rotation.x = -0.25*Math.PI;

  frontFootR1.push({x: Math.abs(0.25*Math.PI - 0)})
  frontFootR2.push({x: Math.abs(-0.25*Math.PI - 0.25*Math.PI)})
  frontFootR3.push({x: Math.abs(-0.25*Math.PI - 0)})
  footFrontR1.push(false);
  footFrontR2.push(true);
  footFrontR3.push(false);
  raccoons[raccoons.length-1][1].front_foot_R_029.rotation.x = -0.25*Math.PI;

  backFootR.push({x: Math.abs(0.6*Math.PI - 1.1*Math.PI)})
  raccoons[raccoons.length-1][1].foot_01_R_054.rotation.x = 0.6*Math.PI;

  backFootL.push({x: Math.abs(0.6*Math.PI - 1.1*Math.PI)})
  raccoons[raccoons.length-1][1].foot_01_L_042.rotation.x = 0.6*Math.PI;

  // Thigh
  startRotationThighBackL.push({x: raccoons[raccoons.length-1][1].thigh_L_039.rotation.x, 
                                z: raccoons[raccoons.length-1][1].thigh_L_039.rotation.z})
  changeThighBackL.push({x: Math.abs(startRotationThighBackL[raccoons.length-1].x - 0.2*Math.PI), 
                         z: Math.abs(startRotationThighBackL[raccoons.length-1].z - -0.12*Math.PI)})
  raccoons[raccoons.length-1][1].thigh_L_039.rotation.x = 0.3*Math.PI;


  startRotationThighBackR.push({x: raccoons[raccoons.length-1][1].thigh_R_051.rotation.x, 
                                z: raccoons[raccoons.length-1][1].thigh_R_051.rotation.z})
  changeThighBackR.push({x: Math.abs(startRotationThighBackR[raccoons.length-1].x - 0.2*Math.PI), 
                         z: Math.abs(startRotationThighBackR[raccoons.length-1].z - 0.12*Math.PI)})
  raccoons[raccoons.length-1][1].thigh_R_051.rotation.x = 0.3*Math.PI;


  // Neck            
  changeNeck.push({x: 0.3*Math.PI})

  // Tail
  var tailRad = 0.1*Math.PI;
  tailValues.push({
    t1:{
      start: raccoons[raccoons.length-1][1].tail_00_03.rotation.x-2*tailRad, 
      end: raccoons[raccoons.length-1][1].tail_00_03.rotation.x+0.1*tailRad, 
      step: (2.1*tailRad)/(legStepsAnimation[raccoons.length-1]*0.7)},
    t2:{
      start: raccoons[raccoons.length-1][1].tail_01_04.rotation.x-0.3*tailRad, 
      end: raccoons[raccoons.length-1][1].tail_01_04.rotation.x+0.3*tailRad, 
      step: (0.6*tailRad)/(legStepsAnimation[raccoons.length-1]*0.7)},
    t3:{
      start: raccoons[raccoons.length-1][1].tail_02_05.rotation.x-0.5*tailRad, 
      end: raccoons[raccoons.length-1][1].tail_02_05.rotation.x+0.5*tailRad, 
      step: (1*tailRad)/(legStepsAnimation[raccoons.length-1]*0.7)},
    t4:{
      start: raccoons[raccoons.length-1][1].tail_03_06.rotation.x-0.7*tailRad, 
      end: raccoons[raccoons.length-1][1].tail_03_06.rotation.x+0.7*tailRad, 
      step: (1.4*tailRad)/(legStepsAnimation[raccoons.length-1]*0.7)},
    t5:{
      start: raccoons[raccoons.length-1][1].tail_04_07.rotation.x-tailRad, 
      end: raccoons[raccoons.length-1][1].tail_04_07.rotation.x+tailRad, 
      step: (2*tailRad)/(legStepsAnimation[raccoons.length-1]*0.7)}
  });  
  raccoons[raccoons.length-1][1].tail_00_03.rotation.x += +0.1*tailRad - (tailValues[raccoons.length-1].t1.step*(legStepsAnimation[raccoons.length-1]*0.7))*0.68;
  raccoons[raccoons.length-1][1].tail_01_04.rotation.x += +0.3*tailRad - (tailValues[raccoons.length-1].t2.step*(legStepsAnimation[raccoons.length-1]*0.7))*0.68;
  raccoons[raccoons.length-1][1].tail_02_05.rotation.x += +0.5*tailRad - (tailValues[raccoons.length-1].t3.step*(legStepsAnimation[raccoons.length-1]*0.7))*0.68;
  raccoons[raccoons.length-1][1].tail_03_06.rotation.x += +0.7*tailRad - (tailValues[raccoons.length-1].t4.step*(legStepsAnimation[raccoons.length-1]*0.7))*0.68;
  raccoons[raccoons.length-1][1].tail_04_07.rotation.x += +tailRad - (tailValues[raccoons.length-1].t5.step*(legStepsAnimation[raccoons.length-1]*0.7))*0.68;
  tail1.push(true);
  tail2.push(false);

  // Shin
  startRotationShinFrontR.push(raccoons[raccoons.length-1][1].front_shin_R_028.rotation.x);
  changeShinFrontR.push(Math.abs(startRotationShinFrontR[raccoons.length-1] - -0.5*Math.PI));
  shinFrontR1.push(true);
  shinFrontR2.push(false);
  shinFrontR3.push(false);

  startRotationShinFrontL.push(raccoons[raccoons.length-1][1].front_shin_L_016.rotation.x);
  changeShinFrontL.push(Math.abs(startRotationShinFrontL[raccoons.length-1] - -0.5*Math.PI));
  shinFrontL1.push(true);
  shinFrontL2.push(false);
  shinFrontL3.push(false);

  startRotationBackShin.push({r: raccoons[raccoons.length-1][1].shin_R_052.rotation.x, l: raccoons[raccoons.length-1][1].shin_L_040.rotation.x}) 
  changeBackShin.push(Math.abs(startRotationBackShin[raccoons.length-1].r - 0.5*Math.PI));
  backShin1.push(false);
  backShin2.push(false);
}

// shoulders
var changeShoulderL = [];
var startRotationShoulderL = [];

var changeShoulderR = [];
var startRotationShoulderR = [];

var frontLegsDirection = [];
var legStepsAnimation = [];

//feet
var frontFootL1 = [];
var frontFootL2 = [];
var frontFootL3 = [];
var footFrontL1 = [];
var footFrontL2 = [];
var footFrontL3 = [];

var frontFootR1 = [];
var frontFootR2 = [];
var frontFootR3 = [];
var footFrontR1 = [];
var footFrontR2 = [];
var footFrontR3 = [];

var backFootR = [];
var backFootL = [];

//thigh
var startRotationThighBackL = []; 
var changeThighBackL = [];
var startRotationThighBackR = []; 
var changeThighBackR = [];

var changeNeck = [];

var changeShinFrontR = [];
var startRotationShinFrontR = [];
var shinFrontR1 = [];
var shinFrontR2 = [];
var shinFrontR3 = [];

var changeShinFrontL = [];
var startRotationShinFrontL = [];
var shinFrontL1 = [];
var shinFrontL2 = [];
var shinFrontL3 = [];

var startRotationBackShin = [];
var changeBackShin = [];
var backShin1 = [];
var backShin2 = [];

var tailValues = [];
var tail1 = [];
var tail2 = [];

var step1Camera = 9/600; 
var start1Camera = -4.5;
var step2CameraZ = 20.5/600;
var start2CameraZ = 4.5;
var step2CameraX = -23.16/600;
var start2CameraX = -60;
var one = true;
var startingTime;


function walkRaccoon(time) {
  // if (start1Camera < 4.5) {
  //   start1Camera += step1Camera;
  //   camera.position.set(-60, 3, start1Camera);
  //   camera.lookAt(-69.3, 0.1, start1Camera);
  // } else if (start2CameraZ < 25) {
  //   // -70.7*1.2, 3, 25
  //   start2CameraZ += step2CameraZ;
  //   start2CameraX += step2CameraX;
  //   camera.position.set(start2CameraX, 3, start2CameraZ);
  //   camera.lookAt(-69.3, 0.1, 4.5);
  // } else 
  if (one) {
    startingTime = time;
    one = false;
  }
  // if ((time - startingTime) >= 0 && (time - startingTime) <= 1) print(3);
  // if ((time - startingTime) >= 1 && (time - startingTime) <= 2) print(2);
  // if ((time - startingTime) >= 2 && (time - startingTime) <= 3) print(1);
  // if ((time - startingTime) >= 3) print("VIA!");

  // var container = document.getElementById("container");
  if(raccoonLoaded && (time - startingTime) >= 3){
    var finish = true;
    for(var i = 0; i < raccoons.length; i++){
      if(raccoons[i][0].position.x > 69.3){
        finish = false;
      }
    }
    if (finish){
      // camera.position.set(raccoons[0][0].position.x*1.2, 3, 25);
      // camera.lookAt(raccoons[0][0].position.x, raccoons[0][0].position.y, raccoons[0][0].position.z);

      // controls.target.set(raccoons[0][0].position.x, raccoons[0][0].position.y, raccoons[0][0].position.z);
      // controls.update();
      myRacconCursorMesh.position.x = raccoons[0][0].position.x;
      for (var i = 0; i < raccoons.length; i++) {
        var step = 3/legStepsAnimation[i];
        raccoons[i][0].position.x += step*barSpeedF(i);

        walkFrontShoulderLeft(i);
        walkFrontShoulderRight(i);
        walkFrontShinRight(i);
        walkFrontShinLeft(i);
        
        walkFrontFootLeft(i);
        walkFrontFootRight(i);
    
        walkBackThighLeft(i);
        walkBackThighRight(i);
        
        walkBackShin(i);
        
        walkBackFootLeft(i);
        walkBackFootRight(i);    
        
        walkSpine(i);
    
        walkRibCage(i);
    
        walkNeck(i);
    
        tail(i);
    
        yoyo(i);
      }
    } else{
      stopAnimations();
      myRacconCursorMesh.position.x = raccoons[0][0].position.x;
    }
  }
}

function walkFrontShoulderLeft(i) {
  var shoulderLStep = {x: changeShoulderL[i].x/legStepsAnimation[i], z: changeShoulderL[i].z/legStepsAnimation[i]};
  raccoons[i][1].shoulder_L_014.rotation.x += shoulderLStep.x * frontLegsDirection[i]*barSpeedF(i);
  raccoons[i][1].shoulder_L_014.rotation.z += shoulderLStep.z * frontLegsDirection[i]*barSpeedF(i);
}

function walkFrontShoulderRight(i) {
  var shoulderRStep = {x: changeShoulderR[i].x/legStepsAnimation[i], z: changeShoulderR[i].z/legStepsAnimation[i]};
  raccoons[i][1].shoulder_R_026.rotation.x += shoulderRStep.x * frontLegsDirection[i]*barSpeedF(i);
  raccoons[i][1].shoulder_R_026.rotation.z -= shoulderRStep.z * frontLegsDirection[i]*barSpeedF(i);
}

function walkFrontFootLeft(i) {
  var footL1Step = {x: frontFootL1[i].x/(legStepsAnimation[i])};
  var footL2Step = {x: frontFootL2[i].x/(legStepsAnimation[i]*0.32)};
  var footL3Step = {x: frontFootL3[i].x/(legStepsAnimation[i]*0.68)};

  if (footFrontL1[i]) {
    raccoons[i][1].front_foot_L_017.rotation.x += frontLegsDirection[i]*footL1Step.x*barSpeedF(i);
    if (frontLegsDirection[i] == 1) {
      raccoons[i][1].front_foot_L_017.rotation.x = 0;
      footFrontL1[i] = false;
      footFrontL2[i] = false;
      footFrontL3[i] = true;
    }
  }

  if (footFrontL2[i]) {
    raccoons[i][1].front_foot_L_017.rotation.x += frontLegsDirection[i]*footL2Step.x*barSpeedF(i);
    if (frontLegsDirection[i] == -1) {
      raccoons[i][1].front_foot_L_017.rotation.x = 0.25*Math.PI;
      footFrontL2[i] = false;
      footFrontL3[i] = false;
      footFrontL1[i] = true;
    }
  }

  if (footFrontL3[i]) {
    raccoons[i][1].front_foot_L_017.rotation.x += -frontLegsDirection[i]*footL3Step.x*barSpeedF(i);
    if (raccoons[i][1].front_foot_L_017.rotation.x <= -0.25*Math.PI) {
      raccoons[i][1].front_foot_L_017.rotation.x = -0.25*Math.PI;
      footFrontL3[i] = false;
      footFrontL1[i] = false;
      footFrontL2[i] = true;
    }
  }
}

function walkFrontFootRight(i) {
  var footR1Step = {x: frontFootR1[i].x/(legStepsAnimation[i])}
  var footR2Step = {x: frontFootR2[i].x/(legStepsAnimation[i]*0.32)}
  var footR3Step = {x: frontFootR3[i].x/(legStepsAnimation[i]*0.68)}

  if (footFrontR1[i]) {
    raccoons[i][1].front_foot_R_029.rotation.x += frontLegsDirection[i]*footR1Step.x*barSpeedF(i);
    if (frontLegsDirection[i] == 1) {
      raccoons[i][1].front_foot_R_029.rotation.x = 0;
      footFrontR1[i] = false;
      footFrontR2[i] = false;
      footFrontR3[i] = true;
    }
  }

  if (footFrontR2[i]) {
    raccoons[i][1].front_foot_R_029.rotation.x += frontLegsDirection[i]*footR2Step.x*barSpeedF(i);
    if (frontLegsDirection[i] == -1) {
      raccoons[i][1].front_foot_R_029.rotation.x = 0.25*Math.PI;
      footFrontR2[i] = false;
      footFrontR3[i] = false;
      footFrontR1[i] = true;
    }
  }

  if (footFrontR3[i]) {
    raccoons[i][1].front_foot_R_029.rotation.x += -frontLegsDirection[i]*footR3Step.x*barSpeedF(i);
    if (raccoons[i][1].front_foot_R_029.rotation.x <= -0.25*Math.PI) {
      raccoons[i][1].front_foot_R_029.rotation.x = -0.25*Math.PI;
      footFrontR3[i] = false;
      footFrontR1[i] = false;
      footFrontR2[i] = true;
    }
  }
}

function walkBackThighLeft(i) {
  var thighLStep = {x: changeThighBackL[i].x/legStepsAnimation[i], z: changeThighBackL[i].z/legStepsAnimation[i]}
  raccoons[i][1].thigh_L_039.rotation.x -= thighLStep.x * frontLegsDirection[i]*barSpeedF(i);
  raccoons[i][1].thigh_L_039.rotation.z -= thighLStep.z * frontLegsDirection[i]*barSpeedF(i);
}

function walkBackThighRight(i) {
  var thighRStep = {x: changeThighBackR[i].x/legStepsAnimation[i], z: changeThighBackR[i].z/legStepsAnimation[i]}
  raccoons[i][1].thigh_R_051.rotation.x -= thighRStep.x * frontLegsDirection[i]*barSpeedF(i);
  raccoons[i][1].thigh_R_051.rotation.z += thighRStep.z * frontLegsDirection[i]*barSpeedF(i);
}

function walkBackFootLeft(i) {
  var footLStep = {x: backFootL[i].x/(legStepsAnimation[i]*0.85)}
  if (raccoons[i][1].thigh_R_051.rotation.x >= 0.3*Math.PI) {
    raccoons[i][1].foot_01_L_042.rotation.x -= footLStep.x * frontLegsDirection[i]*barSpeedF(i);
  } else {
    raccoons[i][1].foot_01_L_042.rotation.x = 0.6*Math.PI;
  }
}

function walkBackFootRight(i) {
  var footRStep = {x: backFootR[i].x/(legStepsAnimation[i]*0.85)}
  if (raccoons[i][1].thigh_R_051.rotation.x >= 0.3*Math.PI) {
    raccoons[i][1].foot_01_R_054.rotation.x -= footRStep.x * frontLegsDirection[i]*barSpeedF(i);
  } else {
    raccoons[i][1].foot_01_R_054.rotation.x = 0.6*Math.PI;
  }
}  

function walkFrontShinRight(i) {
  var step1 = {x: changeShinFrontR[i]/(legStepsAnimation[i]*0.32)}
  var step2 = {x: changeShinFrontR[i]/(legStepsAnimation[i]*0.68)}
  if (shinFrontR1[i]) {
    if (frontLegsDirection[i] == -1) {
      shinFrontR1[i] = false;
      shinFrontR2[i] = true;
    }
  } 
  if (shinFrontR2[i]) {
    raccoons[i][1].front_shin_R_028.rotation.x += step1.x * frontLegsDirection[i]*barSpeedF(i);
    if (raccoons[i][1].shoulder_L_014.rotation.x <= 0.5*Math.PI) {
      shinFrontR2[i] = false;
      shinFrontR3[i] = true;
    }
  }
  if (shinFrontR3[i]) {
    raccoons[i][1].front_shin_R_028.rotation.x -= step2.x * frontLegsDirection[i]*barSpeedF(i);
    if ( frontLegsDirection[i] == 1) {
      raccoons[i][1].front_shin_R_028.rotation.x = startRotationShinFrontR[i];
      shinFrontR3[i] = false;
      shinFrontR1[i] = true;
    }
  }
}

function walkFrontShinLeft(i) {
  var step1 = {x: changeShinFrontL[i]/(legStepsAnimation[i]*0.32)}
  var step2 = {x: changeShinFrontL[i]/(legStepsAnimation[i]*0.68)}
  if (shinFrontL1[i]) {
    if (frontLegsDirection[i] == -1) {
      shinFrontL1[i] = false;
      shinFrontL2[i] = true;
    }
  } 
  if (shinFrontL2[i]) {
    raccoons[i][1].front_shin_L_016.rotation.x += step1.x * frontLegsDirection[i]*barSpeedF(i);
    if (raccoons[i][1].shoulder_L_014.rotation.x <= 0.5*Math.PI) {
      shinFrontL2[i] = false;
      shinFrontL3[i] = true;
    }
  }
  if (shinFrontL3[i]) {
    raccoons[i][1].front_shin_L_016.rotation.x -= step2.x * frontLegsDirection[i]*barSpeedF(i);
    if ( frontLegsDirection[i] == 1) {
      raccoons[i][1].front_shin_L_016.rotation.x = startRotationShinFrontL[i];
      shinFrontL3[i] = false;
      shinFrontL1[i] = true;
    }
  }
}

function walkBackShin(i) {
  var step1 = {x: changeBackShin[i]/(legStepsAnimation[i]*0.32)}
  var step2 = {x: changeBackShin[i]/(legStepsAnimation[i]*0.68)}
  if (frontLegsDirection[i] == 1) {
    if (backShin1[i]) {
      raccoons[i][1].shin_R_052.rotation.x += step2.x * frontLegsDirection[i]*barSpeedF(i);
      raccoons[i][1].shin_L_040.rotation.x += step2.x * frontLegsDirection[i]*barSpeedF(i);
      if (raccoons[i][1].shoulder_L_014.rotation.x >= 0.5*Math.PI) {
        backShin1[i] = false;
        backShin2[i] = true;
      }
    }
    if (backShin2[i]) {
      raccoons[i][1].shin_R_052.rotation.x -= step1.x * frontLegsDirection[i]*barSpeedF(i);
      raccoons[i][1].shin_L_040.rotation.x -= step1.x * frontLegsDirection[i]*barSpeedF(i);
    }
  } else {
    raccoons[i][1].shin_R_052.rotation.x = startRotationBackShin[i].r;
    raccoons[i][1].shin_L_040.rotation.x = startRotationBackShin[i].l;
    backShin1[i] = true;
    backShin2[i] = false;
  }
}

function walkSpine(i) {
  var step = 0.1*Math.PI/legStepsAnimation[i];
  raccoons[i][1].spine_00_02.rotation.x -= step*frontLegsDirection[i]*barSpeedF(i);
  raccoons[i][1].spine_01_08.rotation.x += step*frontLegsDirection[i]*barSpeedF(i);
  raccoons[i][1].spine_02_09.rotation.x += step*frontLegsDirection[i]*barSpeedF(i);
  raccoons[i][1].spine_03_010.rotation.x += step*frontLegsDirection[i]*barSpeedF(i);
  step = 0.049/legStepsAnimation[i];
  raccoons[i][1].spine_01_08.position.y -= step*frontLegsDirection[i]*barSpeedF(i);
  raccoons[i][1].spine_02_09.position.y -= step*frontLegsDirection[i]*barSpeedF(i);
  raccoons[i][1].spine_03_010.position.y -= step*frontLegsDirection[i]*barSpeedF(i);
}

function walkRibCage(i) {
  var step1 = 0.21/legStepsAnimation[i];
  var step2 = 0.07/legStepsAnimation[i];
  raccoons[i][1].ribcage_038.position.z -= step1*frontLegsDirection[i]*barSpeedF(i);
  raccoons[i][1].ribcage_038.position.y += step2*frontLegsDirection[i]*barSpeedF(i);
}

function walkNeck(i) {
  var neckStep = {x: changeNeck[i].x/legStepsAnimation[i]}
  raccoons[i][1].neck_011.rotation.x -= neckStep.x * frontLegsDirection[i]*barSpeedF(i);
}

function tail(i) {
  if(tail1[i]) {
    raccoons[i][1].tail_00_03.rotation.x -= tailValues[i].t1.step*frontLegsDirection[i]*barSpeedF(i);
    raccoons[i][1].tail_01_04.rotation.x -= tailValues[i].t2.step*frontLegsDirection[i]*barSpeedF(i);
    raccoons[i][1].tail_02_05.rotation.x -= tailValues[i].t3.step*frontLegsDirection[i]*barSpeedF(i);
    raccoons[i][1].tail_03_06.rotation.x -= tailValues[i].t4.step*frontLegsDirection[i]*barSpeedF(i);
    raccoons[i][1].tail_04_07.rotation.x -= tailValues[i].t5.step*frontLegsDirection[i]*barSpeedF(i);
    if (raccoons[i][1].tail_00_03.rotation.x <= tailValues[i].t1.start &&
        raccoons[i][1].tail_01_04.rotation.x <= tailValues[i].t2.start &&
        raccoons[i][1].tail_02_05.rotation.x <= tailValues[i].t3.start &&
        raccoons[i][1].tail_03_06.rotation.x <= tailValues[i].t4.start &&
        raccoons[i][1].tail_04_07.rotation.x <= tailValues[i].t5.start) {
      raccoons[i][1].tail_00_03.rotation.x = tailValues[i].t1.start
      raccoons[i][1].tail_01_04.rotation.x = tailValues[i].t2.start
      raccoons[i][1].tail_02_05.rotation.x = tailValues[i].t3.start
      raccoons[i][1].tail_03_06.rotation.x = tailValues[i].t4.start
      raccoons[i][1].tail_04_07.rotation.x = tailValues[i].t5.start
      tail1[i] = false;
      tail2[i] = true;
    }
    if (raccoons[i][1].tail_00_03.rotation.x >= tailValues[i].t1.end && 
          raccoons[i][1].tail_01_04.rotation.x >= tailValues[i].t2.end && 
          raccoons[i][1].tail_02_05.rotation.x >= tailValues[i].t3.end && 
          raccoons[i][1].tail_03_06.rotation.x >= tailValues[i].t4.end && 
          raccoons[i][1].tail_04_07.rotation.x >= tailValues[i].t5.end){
      raccoons[i][1].tail_00_03.rotation.x = tailValues[i].t1.end
      raccoons[i][1].tail_01_04.rotation.x = tailValues[i].t2.end
      raccoons[i][1].tail_02_05.rotation.x = tailValues[i].t3.end
      raccoons[i][1].tail_03_06.rotation.x = tailValues[i].t4.end
      raccoons[i][1].tail_04_07.rotation.x = tailValues[i].t5.end
      tail1[i] = false;
      tail2[i] = true;
    }
  }
  if (tail2[i]) {
    if (((raccoons[i][1].tail_00_03.rotation.x == tailValues[i].t1.end && frontLegsDirection[i] == 1) ||
        (raccoons[i][1].tail_00_03.rotation.x == tailValues[i].t1.start && frontLegsDirection[i] == -1)) &&
        ((raccoons[i][1].tail_01_04.rotation.x == tailValues[i].t2.end && frontLegsDirection[i] == 1) ||
        (raccoons[i][1].tail_01_04.rotation.x == tailValues[i].t2.start && frontLegsDirection[i] == -1)) &&
        ((raccoons[i][1].tail_02_05.rotation.x == tailValues[i].t3.end && frontLegsDirection[i] == 1) ||
        (raccoons[i][1].tail_02_05.rotation.x == tailValues[i].t3.start && frontLegsDirection[i] == -1)) &&
        ((raccoons[i][1].tail_03_06.rotation.x == tailValues[i].t4.end && frontLegsDirection[i] == 1) ||
        (raccoons[i][1].tail_03_06.rotation.x == tailValues[i].t4.start && frontLegsDirection[i] == -1)) &&
        ((raccoons[i][1].tail_04_07.rotation.x == tailValues[i].t5.end && frontLegsDirection[i] == 1) ||
        (raccoons[i][1].tail_04_07.rotation.x == tailValues[i].t5.start && frontLegsDirection[i] == -1))) {
      tail2[i] = false;
      tail1[i] = true;
    }
  }
}

function yoyo(i) {
  if (raccoons[i][1].shoulder_L_014.rotation.x >= 0.65*Math.PI || 
    raccoons[i][1].shoulder_L_014.rotation.x <= startRotationShoulderL[i].x) {
      frontLegsDirection[i] *= -1; 
      if (i != 0 && frontLegsDirection[i] == 1) {
        legStepsAnimation[i] += (Math.random() - Math.abs(legStepsAnimation[i] - 90)/20)*5;
      } 
  }
}

function print(elem) {
  console.log(elem);
}

function barSpeedF(i) {
  if (i == 0) return  barSpeed + 0.25; 
  else return 1
}

init();