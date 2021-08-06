import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {MapControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(15, 15, 15);
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new MapControls(camera, renderer.domElement);

scene.add(new THREE.GridHelper(70, 70));







function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x+r, y);ctx.lineTo(x+w-r, y);ctx.quadraticCurveTo(x+w, y, x+w, y+r);ctx.lineTo(x+w, y+h-r);ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);ctx.lineTo(x+r, y+h);ctx.quadraticCurveTo(x, y+h, x, y+h-r);ctx.lineTo(x, y+r);ctx.quadraticCurveTo(x, y, x+r, y);ctx.closePath(); ctx.fill(); ctx.stroke();   
}

function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = parameters.hasOwnProperty("fontsize") ? 
		parameters["fontsize"] : 18;
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 4;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	// roundRect(context, borderThickness/2+50, borderThickness/2, textWidth + borderThickness, fontsize * 1.2 + borderThickness, 19);
	roundRect(context, borderThickness/2+65, borderThickness/2, textWidth + borderThickness, fontsize * 1.2 + borderThickness, 19);

	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness+65, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( { map: texture} );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(5,2,3.0);
	spriteMaterial.depthTest = false;

	return sprite;	
}






// New York
////////////////////

var h = 0.4


let cities = []
function createCity(i){
    var NYGeom = new THREE.ConeBufferGeometry(0.4,h ,6);
    NYGeom.translate(0, h * 0.5, 0);
    var NYMat = new THREE.MeshBasicMaterial({color: "blue"});
    var NYcone = new THREE.Mesh(NYGeom, NYMat);
    scene.add(NYcone);
    var NYEdgesGeom = new THREE.EdgesGeometry(NYGeom);
    var NYedges = new THREE.LineSegments(NYEdgesGeom, new THREE.LineBasicMaterial({color: "red"}));
    NYcone.add(NYedges);

    NYcone.name = String.fromCharCode(65+i);
    let label = makeTextSprite( NYcone.name, { fontsize: 60, borderColor: {r:225, g:0, b:0, a:1.0}, backgroundColor: {r:225, g:140, b:0, a:0.9} } );
    NYcone.add(label)
    cities.push(NYcone)
}

for(let i = 0; i<4; i++){
    createCity(i)
}



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
    for (let i=0; i<cities.length; i++){
        console.log(dragObject.name, "->", cities[i].name, ': ',450*Math.sqrt((dragObject.position.x - cities[i].position.x)**2 +  (dragObject.position.z - cities[i].position.z)**2) )

    }
}
// events
document.addEventListener("pointermove", event => {
  	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    if (raycaster.intersectObjects(cities).length>0){
        document.body.style.cursor =  'grab';
    }
    else{
        document.body.style.cursor =  'auto';

    }

    if (isDragging) {
        raycaster.setFromCamera(mouse, camera);
    	raycaster.ray.intersectPlane(plane, planeIntersect);
      dragObject.position.addVectors(planeIntersect, shift);
      getDistance()
    }
});

document.addEventListener("pointerdown", () => {
	
    var intersects = raycaster.intersectObjects(cities);

      if (intersects.length > 0) {
          // CHANGE THIS to dragIDX logic with raycaster set and no shift vectors
			controls.enabled = false;
			pIntersect.copy(intersects[0].point);
			plane.setFromNormalAndCoplanarPoint(pNormal, pIntersect);
			shift.subVectors(intersects[0].object.position, intersects[0].point);
			isDragging = true;
			dragObject = intersects[0].object;
          getDistance()
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