// import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import * as THREE from '/node_modules/three';
// import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import {OrbitControls} from '/node_modules/three/examples/jsm/controls/OrbitControls';

import * as dat from 'dat.gui'
import { SkeletonHelper } from 'three';

// import { GridHelperCustom } from './Grid'




/////////////// GUI ////////////////
const gui = new dat.GUI()
const world = {
  grid : {
    size: 80,
    cells: 90,
  }
}

function generatePlane(){
	scene.remove(scene.getObjectByName("Grid"));
	var grid = new THREE.GridHelper(world.grid.size, world.grid.cells)
	grid.name = 'Grid';
	scene.add(grid);
}
gui.add(world.grid, 'size', 4,150).onChange(() => {
	generatePlane()
})
gui.add(world.grid, 'cells', 4,700).onChange(() => {
	generatePlane()
})


/////////////////// Scene //////////////////
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(0,30, 10);



camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
controls.keyPanSpeed = 6;
controls.maxPolarAngle  = Math.PI/2+0.1;
controls.minPolarAngle  = 0;
controls.maxDistance = 200;
controls.minDistance = 10;
controls.update();

////////// GRID //////


const grid = new THREE.GridHelper(world.grid.size, world.grid.cells, 0x777777, 0x888888)
grid.name = "Grid";
scene.add(grid);


//// CITIES ////////
let NY, KV, AL;
const loader = new THREE.FontLoader();
loader.load('node_modules/three/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
	const NYg = new THREE.TextGeometry( 'NY', {
		font: font,
		size: 1,
		height: 0.1,
		curveSegments: 0.5,
		bevelEnabled: true,
		bevelThickness: 0.2,
		bevelSize: 0.1,
		bevelSegments: 1,
	} );
	var material = new THREE.MeshBasicMaterial({color: "green"} );

   NY = new THREE.Mesh(NYg, material);
	NY.rotation.x = -Math.PI/2;
   scene.add(NY);
	/////
	const KVg = new THREE.TextGeometry( 'KV', {
		font: font,
		size: 1,
		height: 0.1,
		curveSegments: 0.5,
		bevelEnabled: true,
		bevelThickness: 0.2,
		bevelSize: 0.1,
		bevelSegments: 1,
	} );
	var material = new THREE.MeshBasicMaterial();
   KV = new THREE.Mesh(KVg, material);
	KV.rotation.x = -Math.PI/2;
	KV.position.x = 5;
   scene.add(KV);
	///////
	const ALg = new THREE.TextGeometry( 'AL', {
		font: font,
		size: 1,
		height: 0.1,
		curveSegments: 0.5,
		bevelEnabled: true,
		bevelThickness: 0.2,
		bevelSize: 0.1,
		bevelSegments: 1,
	} );
	var material = new THREE.MeshBasicMaterial();
   AL = new THREE.Mesh(ALg, material);

	AL.rotation.x = -Math.PI/2;
	AL.position.x = -5;

   scene.add(AL);

} );


///////////

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane();
var pNormal = new THREE.Vector3(0, 1, 0); // plane's normal
var planeIntersect = new THREE.Vector3(); // point of intersection with the plane
var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
var isDragging = false;
var dragObject;



function getDistance(){
	var val = Math.abs((NY.position.x*KV.position.z) -(NY.position.z*KV.position.x) + (KV.position.x*AL.position.z) - (KV.position.z*AL.position.x) + (AL.position.x*NY.position.z)-(AL.position.z*NY.position.x))
	val = Math.round(val*100)/100;
	document.getElementById("area").innerHTML = "Area of the triangle: " + val.toString()

}

// events

let latest = 0;

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
	  currentDate = Date.now();
	} while (currentDate - date < milliseconds);
 }
sleep(100);
document.addEventListener("pointermove", event => {

  	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
   raycaster.setFromCamera(mouse, camera);



    if (isDragging) {
    	raycaster.ray.intersectPlane(plane, planeIntersect);
      dragObject.position.addVectors(planeIntersect, shift);
		getDistance();
    }

	
	var intersects = raycaster.intersectObjects([NY, KV, AL]);

	if (intersects.length > 0) {
		latest = intersects[0];
		latest.object.material.color.set("blue")
	}
	else{
		if (latest != 0){
			latest.object.material.color.set("yellow")
			latest = 0;
		}
	}
 }

);




document.addEventListener("pointerdown", () => {
		var intersects = raycaster.intersectObjects([NY, KV, AL]);

      if (intersects.length > 0) {
			controls.enabled = false;
			pIntersect.copy(intersects[0].point);
			plane.setFromNormalAndCoplanarPoint(pNormal, pIntersect);
			shift.subVectors(intersects[0].object.position, intersects[0].point);
			isDragging = true;
			dragObject = intersects[0].object;

    }
} );

document.addEventListener("pointerup", () => {
	isDragging = false;
	dragObject = null;
	controls.enabled = true;
} );


renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
})


addEventListener('resize',() => {
	camera.aspect = innerWidth/innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(innerWidth, innerHeight);

})
