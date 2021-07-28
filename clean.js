import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';


///// GLOBAL VARIABLES //////

// camera
let scene, camera, controls, renderer;
// objects
let stars, sphere;


///// SETUP Functions ////
// Create a Scene and Set Up Camera
function init(){
    // Scene and Camera
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera( 60,innerWidth/innerHeight, 1,1400 )
    scene.add(camera);
    camera.position.set(0,75,200);
    camera.lookAt(scene.position);
    // Renderer
    renderer = new THREE.WebGLRenderer({antialias: true} )
    renderer.setSize(innerWidth, innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild(renderer.domElement)
    // Events
    THREEx.WindowResize(renderer, camera);
    // Orbit Controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.minDistance = 50;
    controls.maxDistance = 200;
}
// Create the Globe and the wireframe
function createGlobe(){
    sphere = new THREE.Mesh(
        new THREE.SphereGeometry(30,50,50),
        new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./img/globe.jpg'),
        })
    )
    sphere.position.set(0,0,0);
    scene.add(sphere)
    const wireframe = new THREE.Mesh(
        new THREE.SphereGeometry(30,50,30),
            new THREE.MeshBasicMaterial({
            color: 0xBBBBBB,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        })
    )
    wireframe.position.set(0, 0, 0);
    scene.add(wireframe)
}
// Create Stars
function genStars(){
	const starGeometry = new THREE.BufferGeometry();
	const starMaterial = new THREE.PointsMaterial({color: 0xffffff});
	const starVerticies = [];
	for (let i = 0; i<50000; i++){
		const x = (Math.random() -0.5)*1000;
		const y =  (Math.random() -0.5)*1000;
		const z = (Math.random()-0.5)*1000;;
		if(x*x+y*y+z*z > 120000) starVerticies.push(x,y,z);
	}

	starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVerticies, 3));
	stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

}
function rotateStars(){
    stars.rotation.x+=0.0001;
	stars.rotation.y+=0.0001;
}

/// init calls ///
init();
createGlobe();
genStars();
//////////////////


/////// MAIN BODY ///////
///// CREATE CITIES /////

let cities = [];
let labels = [];
let rayCities = [];
// create a city with `x-y-z` coordinates
function generateCity(name,x,y,z){
    const point = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.25,21,21),
        new THREE.MeshBasicMaterial({
          color: '#ff0000'
        })
      )
    point.name = name
    point.position.set(x,y,z)
    cities.push(point)
    rayCities.push(point)
    generateLabel(point)
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
	roundRect(context, borderThickness/2+50, borderThickness/2, textWidth + borderThickness, fontsize * 1.2 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness+50, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( { map: texture, } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(5,2,6.0);
	spriteMaterial.depthTest = false;

	return sprite;	
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x+r, y);ctx.lineTo(x+w-r, y);ctx.quadraticCurveTo(x+w, y, x+w, y+r);ctx.lineTo(x+w, y+h-r);ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);ctx.lineTo(x+r, y+h);ctx.quadraticCurveTo(x, y+h, x, y+h-r);ctx.lineTo(x, y+r);ctx.quadraticCurveTo(x, y, x+r, y);ctx.closePath(); ctx.fill(); ctx.stroke();   
}

function generateLabel(city){
    let label = makeTextSprite( city.name, { fontsize: 80, borderColor: {r:225, g:0, b:0, a:1.0}, backgroundColor: {r:225, g:140, b:0, a:0.9} } );
    label.position.set(city.position.x,city.position.y,city.position.z);
    labels.push(label)
}




/// Function Calls ///

generateCity('A',0,0,30) //todo: automate city generation
generateCity('B',30,0,0)

for (let i =0; i<cities.length; i++){
    scene.add(cities[i])
    scene.add(labels[i])
}












///// RAYCASTING /////


var raycaster = new THREE.Raycaster();
raycaster.near=1
raycaster.far=200

var mouse = new THREE.Vector2();
var raySphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0) ,  30);
var raySphereIntersect = new THREE.Vector3(); // point of intersection with the plane
var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
var isDragging = false;
var dragObject, dragLabel;
var dragIdx;
rayCities.push(sphere)

document.addEventListener("pointermove", event => {

  	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    if (isDragging) {
		raycaster.setFromCamera(mouse, camera);
		raycaster.ray.intersectSphere(raySphere, raySphereIntersect);
      	cities[dragIdx].position.addVectors(raySphereIntersect, shift); // shift point
        labels[dragIdx].position.set(cities[dragIdx].position.x,cities[dragIdx].position.y,cities[dragIdx].position.z) // move label to the point
		// clearCurves();
		// drawCurves(dragObject);

	}
 }
);


document.addEventListener("pointerdown", () => {


	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(rayCities);
	if (intersects.length > 0 && intersects[0].object == sphere) return// check if the shpere is intersected before the points are, and return in this case
	raycaster.ray.intersectSphere(raySphere, raySphereIntersect); // get base position for later shift
	if (intersects.length > 0) {

		controls.enabled = false;
		isDragging = true; 
		// dragObject = intersects[0].object; // save the object to drag
        for (let i = 0; i<cities.length;i++){if (cities[i]==intersects[0].object) {dragIdx = i; return }} // save the label to drag
		// drawCurves(dragObject);

	}
} );

document.addEventListener("pointerup", () => {
	isDragging = false;
	// dragObject = null;
    dragIdx = null;
	controls.enabled = true;
	// remove curves
	// clearCurves();
} );





/// Animation loop ////
function animate(){

	controls.update() // for damping effect

	// Star rotation happening here
    rotateStars()

    requestAnimationFrame(animate)
	renderer.render(scene, camera)
}
animate()