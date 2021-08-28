import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {MapControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import {atlanta, beijing, cape, delhi, easter, florence, goiania,hobart} from './coordinates.js'






var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(-30, 40, 0);

camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new MapControls(camera, renderer.domElement);

controls.maxPolarAngle = 1.72;

scene.add(new THREE.GridHelper(160, 320, 0x222222, 0x222222 ));




//// Let's Create a projection of the Earth onto a plane
// var earthTex = new THREE.PlaneGeometry(60,20,1,1);
// var loader = new THREE.TextureLoader()

// var earthMaterial = new THREE.MeshBasicMaterial({map: loader.load('img/globe1.jpg')});

// var earthPlane = new THREE.Mesh(earthTex, earthMaterial)


// earthPlane.position.set(0,0,0)
// scene.add(earthPlane)
// console.log(earthPlane);



var light = new THREE.AmbientLight(0xffffff, 1);
light.position.setScalar(10);
scene.add(light);




var earthGeom = new THREE.PlaneGeometry(120, 60, 1, 1);
var earthTexture = new THREE.TextureLoader().load( 'img/globe1.jpg' );
var earthMaterial = new THREE.MeshLambertMaterial( { map: earthTexture } );
var earthImage = new THREE.Mesh(earthGeom, earthMaterial);
earthImage.receiveShadow = true;
// rotate and position the plane
earthImage.rotation.x = -0.5 * Math.PI;
earthImage.rotation.z = -0.5 * Math.PI;

earthImage.position.set(0,0,0);
// add the plane to the scene
scene.add(earthImage);






function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x+r, y);ctx.lineTo(x+w-r, y);ctx.quadraticCurveTo(x+w, y, x+w, y+r);ctx.lineTo(x+w, y+h-r);ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);ctx.lineTo(x+r, y+h);ctx.quadraticCurveTo(x, y+h, x, y+h-r);ctx.lineTo(x, y+r);ctx.quadraticCurveTo(x, y, x+r, y);ctx.closePath(); ctx.fill(); ctx.stroke();
}

function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};

	var fontface = parameters.hasOwnProperty("fontface") ?
		parameters["fontface"] : "Arial";

	var fontsize = parameters.hasOwnProperty("fontsize") ?
		parameters["fontsize"] : 25;

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
	sprite.scale.set(5,2,300.0);
	spriteMaterial.depthTest = false;

	return sprite;
}






// New York
////////////////////



let cities = []
function createCity(i){
    var cityGeom = new THREE.ConeBufferGeometry(0.4,0.4 ,6); // 0.4 is height
    cityGeom.translate(0, 0.4 * 0.5, 0); // 0.4 is height

    var cityCone = new THREE.Mesh(cityGeom, new THREE.MeshBasicMaterial({color: "#DE1738"}));
    scene.add(cityCone);
    var cityEdgesGeom = new THREE.EdgesGeometry(cityGeom);
    var cityEdges = new THREE.LineSegments(cityEdgesGeom, new THREE.LineBasicMaterial({color: "black"}));
    cityCone.add(cityEdges);

    cityCone.name = String.fromCharCode(65+i);
    let label = makeTextSprite( cityCone.name, { fontsize: 60, borderColor: {r:225, g:0, b:0, a:1.0}, backgroundColor: {r:225, g:140, b:0, a:0.9} } );
    cityCone.add(label)
	 cityCone.position.set(truePosition[i].lat/3, 0 ,truePosition[i].lon/3)
    cities.push(cityCone)
}







/// GENERATE CITIES //

let truePosition = [atlanta,beijing, cape, delhi, easter, florence, goiania, hobart];

// Generate the TRUE distances
let trueDistance = [];
const EarthR = 6371e3;

for (let i = 0; i<truePosition.length; i++){
    trueDistance.push([])
    for(let j = 0 ; j<truePosition.length; j++){
        var φ1 = truePosition[i].lat * Math.PI/180; 
        var φ2 = truePosition[j].lat * Math.PI/180;
        var Δφ = ( truePosition[j].lat-truePosition[i].lat) * Math.PI/180;
        var Δλ = ( truePosition[j].lon-truePosition[i].lon) * Math.PI/180;
        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
               Math.cos(φ1) * Math.cos(φ2) *
               Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = EarthR * c; // in metres
        trueDistance[i].push( Math.round(d/10)/100)
    }
}



for(let i = 0; i<8; i++){
    createCity(i)
}






////////////// CURVES //////////

let base = new THREE.Vector3();
let dest = new THREE.Vector3();
let points = [];

let curve_meshes = [];

function drawCurves(){
	clearCurves()
	curve_meshes = [];

	base.set(cities[dragIdx].position.x, cities[dragIdx].position.y,cities[dragIdx].position.z)
	for (let i=0;i<cities.length; i++){
		if (i == dragIdx){continue}
		dest.set(cities[i].position.x,cities[i].position.y,cities[i].position.z)
		points = []
		for (let i =0; i<=12; i++){
			let p = new THREE.Vector3().lerpVectors(base,dest,i/12);
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


















///////////
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane();
var pNormal = new THREE.Vector3(0, 1, 0); // plane's normal
var planeIntersect = new THREE.Vector3(); // point of intersection with the plane
var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
var shift = new THREE.Vector3(0,0,0); // distance between position of an object and points of intersection with the object
var moveVector = new THREE.Vector3(0,0,0);
var isDragging = false;
var dragIdx;



function getDistance(){

    document.getElementById('loc').innerHTML = cities[dragIdx].name
    for (let i=0; i<cities.length; i++){
        document.getElementById(i.toString()).innerHTML = cities[dragIdx].name + "->"+cities[i].name+': '+300*Math.sqrt((cities[dragIdx].position.x - cities[i].position.x)**2 +  (cities[dragIdx].position.z - cities[i].position.z)**2).toString()

    }

}


function checkBorders(){



	return true;
}


// events
document.addEventListener("pointermove", event => {
  	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    if (!isDragging){
        var intersects = raycaster.intersectObjects(cities);

        if (raycaster.intersectObjects(cities).length>0){
            for (let i = 0; i<cities.length;i++){if (cities[i]==intersects[0].object) {dragIdx = i; break }} // save the label to drag
            getDistance()
            drawCurves()

            document.body.style.cursor =  'grab';
        }
        else{
            document.body.style.cursor =  'auto';
            dragIdx = null;
            clearCurves();
        }}

    if (isDragging) {

        raycaster.ray.intersectPlane(plane, planeIntersect);
		  moveVector.addVectors(planeIntersect, shift);
			if (moveVector.x > 80){
				moveVector.x = 80
			}
			else if (moveVector.x < -80){
			moveVector.x = -80
			}
			if (moveVector.z > 80){
			moveVector.z = 80
			}
			else if (moveVector.z < -80){
				moveVector.z = -80
					}
        cities[dragIdx].position.set(moveVector.x,0,moveVector.z)
        getDistance()
        drawCurves()

    }
});




document.addEventListener("pointerdown", () => {

    var intersects = raycaster.intersectObjects(cities);
    raycaster.ray.intersectPlane(plane, planeIntersect);

      if (intersects.length > 0) {
            controls.enabled = false;
            pIntersect.copy(intersects[0].point);
            plane.setFromNormalAndCoplanarPoint(pNormal, pIntersect);
            shift.subVectors(intersects[0].object.position, intersects[0].point);
            isDragging = true;
            for (let i = 0; i<cities.length;i++){if (cities[i]==intersects[0].object) {dragIdx = i; break }} // save the label to drag
        getDistance()
        drawCurves()
    }

} );



document.addEventListener("pointerup", () => {
	isDragging = false;
	// dragObject = null;
    dragIdx = null;
	controls.enabled = true;
    clearCurves()
} );



renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);

})