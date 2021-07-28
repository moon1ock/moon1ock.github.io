import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';




///// SETUP /////

// Create a Scene and Set Up Camera
let scene, renderer, camera, controls;
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

    // CONTROLS
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 50;
    controls.maxDistance = 200;
}
init()

function createGlobe(){
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(30,50,50),
        new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./img/globe.jpg'),
        })
    )
    sphere.position.set(0,0,0);
    scene.add(sphere)
    
    // Just WireFrame
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
createGlobe()











function animate(){

	requestAnimationFrame(animate)
	renderer.render(scene, camera)

	controls.update()
	// // Star rotation happening here
	// stars.rotation.x+=0.0001
	// stars.rotation.y+=0.0001

}
animate()