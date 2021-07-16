// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import * as Stats from 'stats.js'

// import * as THREE from 'three'
// import { Float32BufferAttribute } from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'




import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
// import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';


/////////////////

var Stats = function () {

	var mode = 0;

	var container = document.createElement( 'div' );
	container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
	container.addEventListener( 'click', function ( event ) {

		event.preventDefault();
		showPanel( ++ mode % container.children.length );

	}, false );

	//

	function addPanel( panel ) {

		container.appendChild( panel.dom );
		return panel;

	}

	function showPanel( id ) {

		for ( var i = 0; i < container.children.length; i ++ ) {

			container.children[ i ].style.display = i === id ? 'block' : 'none';

		}

		mode = id;

	}

	//

	var beginTime = ( performance || Date ).now(), prevTime = beginTime, frames = 0;

	var fpsPanel = addPanel( new Stats.Panel( 'FPS', '#0ff', '#002' ) );
	var msPanel = addPanel( new Stats.Panel( 'MS', '#0f0', '#020' ) );

	if ( self.performance && self.performance.memory ) {

		var memPanel = addPanel( new Stats.Panel( 'MB', '#f08', '#201' ) );

	}

	showPanel( 0 );

	return {

		REVISION: 16,

		dom: container,

		addPanel: addPanel,
		showPanel: showPanel,

		begin: function () {

			beginTime = ( performance || Date ).now();

		},

		end: function () {

			frames ++;

			var time = ( performance || Date ).now();

			msPanel.update( time - beginTime, 200 );

			if ( time > prevTime + 1000 ) {

				fpsPanel.update( ( frames * 1000 ) / ( time - prevTime ), 100 );

				prevTime = time;
				frames = 0;

				if ( memPanel ) {

					var memory = performance.memory;
					memPanel.update( memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576 );

				}

			}

			return time;

		},

		update: function () {

			beginTime = this.end();

		},

		// Backwards Compatibility

		domElement: container,
		setMode: showPanel

	};

};

Stats.Panel = function ( name, fg, bg ) {

	var min = Infinity, max = 0, round = Math.round;
	var PR = round( window.devicePixelRatio || 1 );

	var WIDTH = 80 * PR, HEIGHT = 48 * PR,
			TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
			GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
			GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

	var canvas = document.createElement( 'canvas' );
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.cssText = 'width:80px;height:48px';

	var context = canvas.getContext( '2d' );
	context.font = 'bold ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
	context.textBaseline = 'top';

	context.fillStyle = bg;
	context.fillRect( 0, 0, WIDTH, HEIGHT );

	context.fillStyle = fg;
	context.fillText( name, TEXT_X, TEXT_Y );
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	context.fillStyle = bg;
	context.globalAlpha = 0.9;
	context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

	return {

		dom: canvas,

		update: function ( value, maxValue ) {

			min = Math.min( min, value );
			max = Math.max( max, value );

			context.fillStyle = bg;
			context.globalAlpha = 1;
			context.fillRect( 0, 0, WIDTH, GRAPH_Y );
			context.fillStyle = fg;
			context.fillText( round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')', TEXT_X, TEXT_Y );

			context.drawImage( canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT );

			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT );

			context.fillStyle = bg;
			context.globalAlpha = 0.9;
			context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round( ( 1 - ( value / maxValue ) ) * GRAPH_HEIGHT ) );

		}

	};

};

//////////////////

// Create a Scene and Set Up Camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth/innerHeight,
  0.1,
  20000  )
scene.add(camera);
camera.position.set(0,75,200);
camera.lookAt(scene.position);

var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );


// Renderer
const renderer = new THREE.WebGLRenderer(
  {antialias: true}
)
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)


// Events
THREEx.WindowResize(renderer, camera);
THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });



// CONTROLS
const controls = new OrbitControls( camera, renderer.domElement );


// Floor

// var floorTexture = new THREE.TextureLoader().load('./img/checkerboard.jpg')
// floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
// floorTexture.repeat.set( 10, 10 );
// var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
// var floorGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);
// var floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.position.y = -0.5;
// floor.position.y = -54;

// floor.rotation.x = Math.PI / 2;
// scene.add(floor);


// SKYBOX/FOG
// var skyBoxGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
// var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
// var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
//   skyBox.flipSided = true; // render faces from inside of the cube, instead of from outside (default).
// // scene.add(skyBox);
// scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );



// Spheres
// camera.position.set(50,50,50);


// Just Globe
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(30,50,50),
//   new THREE.MeshBasicMaterial({
//     // color:0xFF0000
//     map: new THREE.TextureLoader().load('./img/globe.jpg')
//   })
// )
// sphere.position.set(-75, 0, 0);
// scene.add(sphere)

// Just WireFrame


const wireframe = new THREE.Mesh(
	new THREE.SphereGeometry(30,50,30),
  new THREE.MeshBasicMaterial({
      color: 0xAAAAAA,
      wireframe: true,
      transparent: true
  })
)
wireframe.position.set(0, 0, 0);
scene.add(wireframe)


// Globe with WireFrame over it and glow over it
// var globe_geom = new THREE.SphereGeometry(50,32,16);
// var globe_geom = new THREE.SphereGeometry(30,50,16);

// const globe_1 = new THREE.Mesh(
//   globe_geom,
//   new THREE.MeshBasicMaterial({
//       map: new THREE.TextureLoader().load('./img/globe.jpg'),
//   })
// )
// globe_1.position.set(75, 0, 0);
// scene.add(globe_1)

// const wire_1 = new THREE.Mesh(
//   new THREE.SphereGeometry(30,50,50),
//   new THREE.MeshBasicMaterial({
//     color: 0xCCCCCC,
//     wireframe: true,
//     transparent: true
//   })
// )
// wire_1.position.set(75, 0, 0);
// scene.add(wire_1)

// var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0xadd8e6, side: THREE.BackSide } );
// var outlineMesh1 = new THREE.Mesh( globe_geom, outlineMaterial1 );
// outlineMesh1.position.set(75, 0, 0)
// outlineMesh1.scale.multiplyScalar(1.05);
// scene.add( outlineMesh1 );




// Stars
// const starGeometry = new THREE.BufferGeometry()
// const starMaterial = new THREE.PointsMaterial({
//   color: 0xffffff
// })

// const starVerticies = []
// for (let i = 0; i<1000; i++){
//   const x = (Math.random() -0.5)*2000
//   const y = (Math.random() -0.5)*2000
//   const z = Math.random()*2000
//   starVerticies.push(x,y,z)
// }
// starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVerticies, 3))
// const stars = new THREE.Points(starGeometry, starMaterial)
// scene.add(stars)


// Overlaying points on the globe

const point = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5,21,21),
  new THREE.MeshBasicMaterial({
    color: '#ff0000'
  })
)
point.position.z = 30
scene.add(point)







// Raycaster

var raycaster = new THREE.Raycaster();
// raycaster.far = 500


var mouse = new THREE.Vector2();
var plane = new THREE.Plane();
var sphereInter = new THREE.Sphere(new THREE.Vector3(0, 0, 0) ,  30);
var pNormal = new THREE.Vector3(0, 1, 0); // plane's normal
var planeIntersect = new THREE.Vector3(); // point of intersection with the plane
var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
var isDragging = false;
var dragObject;

document.addEventListener("pointermove", event => {

  	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;


    if (isDragging) {
		raycaster.setFromCamera(mouse, camera);
		// raycaster.ray.intersectSphere(wiresphere, planeIntersect);
    	// raycaster.ray.intersectPlane(plane, planeIntersect);
		// console.log(planeIntersect)
		raycaster.ray.intersectSphere(sphereInter, planeIntersect);

      dragObject.position.addVectors(planeIntersect, shift);

		// dragObject.position.x = planeIntersect.x

    }
 }
);




document.addEventListener("pointerdown", () => {


	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects([point]);

    if (intersects.length > 0) {
		controls.enabled = false;
		pIntersect.copy(intersects[0].point);
		// sphereInter.setFromNormalAndCoplanarPoint(pNormal, pIntersect);
		console.log(intersects[0].object.position, intersects[0].point)
		shift.subVectors(intersects[0].object.position, intersects[0].point);
		console.log(shift)
		
		isDragging = true;
		dragObject = intersects[0].object;

	}
} );

document.addEventListener("pointerup", () => {
	isDragging = false;
	dragObject = null;
	controls.enabled = true;
} );



function animate(){

  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  stats.update();

}
animate()