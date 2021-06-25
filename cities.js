import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(15, 15, 15);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);

scene.add(new THREE.GridHelper(70, 70));

// New York
////////////////////
var h = 2
var NYGeom = new THREE.ConeBufferGeometry(2,h ,8);
NYGeom.translate(0, h * 0.5, 0);
var NYMat = new THREE.MeshBasicMaterial({color: "blue"});
var NYcone = new THREE.Mesh(NYGeom, NYMat);

scene.add(NYcone);

var NYEdgesGeom = new THREE.EdgesGeometry(NYGeom);
var NYedges = new THREE.LineSegments(NYEdgesGeom, new THREE.LineBasicMaterial({color: "red"}));
NYcone.add(NYedges);

/////////////////////////
// Kyiv

var h = 2
var KGeom = new THREE.ConeBufferGeometry(2,h ,7);
KGeom.translate(0, h * 0.5, 0);
var KMat = new THREE.MeshBasicMaterial({color: "green"});
var Kcone = new THREE.Mesh(KGeom, KMat);

scene.add(Kcone);

// edges
var KEdgesGeom = new THREE.EdgesGeometry(KGeom);
var Kedges = new THREE.LineSegments(KEdgesGeom, new THREE.LineBasicMaterial({color: "orange"}));
Kcone.add(Kedges);

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


	return Math.sqrt( (NYcone.position.x - Kcone.position.x)**2 +  (NYcone.position.z - Kcone.position.z)**2 )
}


// events
document.addEventListener("pointermove", event => {

  	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    if (isDragging) {
    	raycaster.ray.intersectPlane(plane, planeIntersect);
      dragObject.position.addVectors(planeIntersect, shift);
		console.log(getDistance())

    }
});




document.addEventListener("pointerdown", () => {
		var intersects = raycaster.intersectObjects([NYcone, Kcone]);

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
