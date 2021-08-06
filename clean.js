import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import {atlanta, beijing, cape, delhi, ekaterinburg, florence, goiania,hobart,irkutsk,jakarta, kiev} from './js/coordinates.js'



///// GLOBAL VARIABLES //////

// camera
let scene, camera, controls, renderer;
// objects
let stars, sphere;
let frame = 0;


// DEBUG
const gui = new dat.GUI()
const world = {
	wireframe: true,
	globe: true,
	stars: true
}
var top = gui.addFolder('Basic Config');
var starsGUI = top.add( world, 'stars' ).name("Show Stars").listen();
starsGUI.onChange( function(value) { 
	if (value) scene.add(stars)
	else scene.remove(stars)
});
var globeGUI = top.add( world, 'globe' ).name("Show Globe").listen();
globeGUI.onChange( function(value) {
	if (value) scene.add(sphere)
	else scene.remove(sphere)
});
top.open()
///


// SIDE nav







// ///// SETUP Functions ////
// // Create a Scene and Set Up Camera
function init(){
    // Scene and Camera
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera( 45,innerWidth/innerHeight, 1,1400 )
    scene.add(camera);
    camera.position.set(0,30,90);
    camera.lookAt(scene.position);
    camera.updateProjectionMatrix();
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
    controls.rotateSpeed = 0.5;
}
// Create the Globe and the wireframe
function createGlobe(){
    sphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(30,50,50),
        new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./img/globe1.jpg'),
        })
    )
    sphere.position.set(0,0,0);
    scene.add(sphere)
    const wireframe = new THREE.Mesh(
        new THREE.SphereBufferGeometry(30,50,30),
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
let rayCities = []; // just an array to store for RayCaster, don't modify
// create a city with `x-y-z` coordinates
function generateCity(name,coords){
   
    const point = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.25,21,21),
        new THREE.MeshBasicMaterial({
          color: '#ff0000'
        }))

    point.name = name
    point.position.set(coords.x,coords.y,coords.z)
    cities.push(point)
    rayCities.push(point)
    point.add(generateLabel(point))
    
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
	roundRect(context, borderThickness/2+50, borderThickness/2, textWidth + borderThickness, fontsize * 1.2 + borderThickness, 19);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness+50, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( { map: texture} );
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
    return makeTextSprite( city.name, { fontsize: 80, borderColor: {r:225, g:0, b:0, a:1.0}, backgroundColor: {r:225, g:140, b:0, a:0.9} } );
}

// convert lat-lon to x,y,z
function convertCoordsRad(lat,lon){

    var latRad = lat * (Math.PI / 180);
    var lonRad = -lon * (Math.PI / 180);
    var x = Math.cos(latRad) * Math.cos(lonRad) * 30;
    var y = Math.sin(latRad) * 30;
    var z = Math.cos(latRad) * Math.sin(lonRad) * 30;
    return {x,y,z}
}


function convertPolarToAng(pos){
    /*
    function to convert {X,Y,Z} coordinates of the THREE JS sphere to {lat,lon}
    */
    var lat = Math.asin(pos.y / 30)*(180/Math.PI) ;
    var lon = -1*Math.atan2(pos.z, pos.x)*(180/Math.PI);
    	
    return {lat, lon}
}


// scatter cities around a bit when generating
function sca(){
    // return 0;
    return Math.random()*10-5;
}
const EarthR = 6371e3;


// calculate the distance between the cities
function haversine(){
    var home = convertPolarToAng(cities[dragIdx].position);
    document.getElementById('loc').innerHTML = "lat:" + (Math.round(home.lat*100)/100).toString() + " lon:" +  (Math.round(home.lon*100)/100).toString()
    for (var i = 0; i<cities.length; i++){
        // if (i == dragIdx){continue}
        var away =  convertPolarToAng(cities[i].position);
        var φ1 = home.lat * Math.PI/180; 
        var φ2 = away.lat * Math.PI/180;
        var Δφ = (away.lat-home.lat) * Math.PI/180;
        var Δλ = (away.lon-home.lon) * Math.PI/180;
        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
               Math.cos(φ1) * Math.cos(φ2) *
               Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = EarthR * c; // in metres
        document.getElementById(i.toString()).innerHTML =cities[dragIdx].name+ "->"+ cities[i].name +":"+ (Math.round(d/10)/100).toString() + "km";
    }

}


function changeColors(){
    // this can be all removed to [drag idx][true position]
    let factual;
    if (dragIdx == 0){
        factual = atlanta
    }
    else if (dragIdx == 1){
        factual = beijing;
    }
    else if (dragIdx == 2){
        factual = cape;
    }
    else if (dragIdx == 3){
        factual = delhi;
    }
    else if (dragIdx == 4){
        factual = ekaterinburg;
    }
    else if (dragIdx == 5){
        factual = florence;
    }
    else if (dragIdx == 6){
        factual = goiania;
    }
    else if (dragIdx == 7){
        factual = hobart;
    }

    let curr = convertPolarToAng(cities[dragIdx].position);

    if (Math.sqrt((factual.lat-curr.lat)**2+(factual.lon-curr.lon)**2) < 0.8){
        cities[dragIdx].material.color.setHex(0x00AB08);
        cities[dragIdx].children[0].material.color.setHex(0x59ff4f); 

    }
    else{ cities[dragIdx].material.color.setHex(0xff0000);cities[dragIdx].children[0].material.color.setHex(0xFFFFFF) }
    return
}

/// Create the cities ///
generateCity('A',convertCoordsRad(atlanta.lat+sca(), atlanta.lon+sca())) 
generateCity('B',convertCoordsRad(beijing.lat+sca(), beijing.lon+sca())) 
generateCity('C',convertCoordsRad(cape.lat+sca(), cape.lon+sca())) 
generateCity('D',convertCoordsRad(delhi.lat+sca(), delhi.lon+sca())) 
generateCity('E',convertCoordsRad(ekaterinburg.lat+sca(), ekaterinburg.lon+sca())) 
generateCity('F',convertCoordsRad(florence.lat+sca(), florence.lon+sca())) 
generateCity('G',convertCoordsRad(goiania.lat+sca(), goiania.lon+sca())) 
generateCity('H',convertCoordsRad(hobart.lat+sca(), hobart.lon+sca())) 
// generateCity('I',convertCoordsRad(irkutsk.lat+sca(), irkutsk.lon+sca())) 
// generateCity('J',convertCoordsRad(jakarta.lat+sca(), jakarta.lon+sca())) 
// generateCity('K',convertCoordsRad(kiev.lat+sca(), kiev.lon+sca())) 






for (let i =0; i<cities.length; i++){
    scene.add(cities[i])

}




////// Spider Webs between points ////
let base = new THREE.Vector3();
let dest = new THREE.Vector3();
let points = [];
let mid = new THREE.Vector3();
let curve_meshes = [];

function drawCurves(){
	clearCurves()
	curve_meshes = [];

	base.set(cities[dragIdx].position.x, cities[dragIdx].position.y,cities[dragIdx].position.z)
	for (let i=0;i<cities.length; i++){
		if (i == dragIdx){continue}

		dest.set(cities[i].position.x,cities[i].position.y,cities[i].position.z)

		points = []
		// use midpoint for better interpolation
		mid.addVectors(dest,base);
		mid.multiplyScalar(0.5);
		mid.normalize()
		mid.multiplyScalar(30);
		
		// interpolate base-> mid
		for (let i =0; i<=12; i++){
			let p = new THREE.Vector3().lerpVectors(base,mid,i/12);
			p.multiplyScalar(0.5)
			p.normalize()
			p.multiplyScalar(30)
			points.push(p);
			
		}
		
		for (let i =0; i<=12; i++){
			let p = new THREE.Vector3().lerpVectors(mid,dest,i/12);
			p.multiplyScalar(0.5)
			p.normalize()
			p.multiplyScalar(30)
			points.push(p);
			
		}


		curve_meshes.push(new THREE.Mesh(new THREE.TubeBufferGeometry(new THREE.CatmullRomCurve3(points),64,0.05,50,false),  new THREE.MeshBasicMaterial({color: 0x0000cc})));

	}
	for (let i = 0; i<curve_meshes.length;i++){
		scene.add(curve_meshes[i])
	}
}

function clearCurves(){

	for (let i = 0; i<curve_meshes.length;i++){
		scene.remove(curve_meshes[i])
		curve_meshes[i].material.dispose()
		curve_meshes[i].geometry.dispose()
	}
}
//////////




///// RAYCASTING /////


var raycaster = new THREE.Raycaster();
raycaster.near=1
raycaster.far=200

var mouse = new THREE.Vector2();
var raySphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0) ,  30);
var raySphereIntersect = new THREE.Vector3(); // point of intersection with the plane
var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
var isDragging = false;
var dragIdx;
rayCities.push(sphere)

document.addEventListener("pointermove", event => {

  	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // save mouse here
    if (isDragging) {
		raycaster.setFromCamera(mouse, camera);
		raycaster.ray.intersectSphere(raySphere, raySphereIntersect);
      	cities[dragIdx].position.addVectors(raySphereIntersect, shift); // shift point
        changeColors();
        haversine();
        // if (frame == 0) 
        drawCurves();
	}
 }
);


document.addEventListener("pointerdown", () => {
    
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(rayCities);
	if (intersects.length > 0 && intersects[0].object == sphere) {  return }// check if the shpere is intersected before the points are, and return in this case
	raycaster.ray.intersectSphere(raySphere, raySphereIntersect); // get base position for later shift
	if (intersects.length > 0) {
		controls.enabled = false;
		isDragging = true; 
        for (let i = 0; i<cities.length;i++){if (cities[i]==intersects[0].object) {dragIdx = i; break }} // save the label to drag
        drawCurves();
	}
} );

document.addEventListener("pointerup", () => {

	isDragging = false;
    dragIdx = null;
	controls.enabled = true;
	// remove curves
	clearCurves();
} );





/// Animation loop ////
function animate(){

	controls.update() // for damping effect
    frame = (frame+1)%1;
	// Star rotation happening here
    rotateStars()
    requestAnimationFrame(animate)
	renderer.render(scene, camera)
}
animate()

// ToDo:
/*
- Save true positions x,y,z of cities to avoid repeated calc



https://getbootstrap.com/docs/4.0/components/dropdowns/
*/