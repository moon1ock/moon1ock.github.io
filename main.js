import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

import * as dat from 'dat.gui'
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';


const gui = new dat.GUI()
const world = {
  plane : {
    width: 10,
    height: 10,
    widthSegments : 10,
    heightSegments: 10
  }
}
gui.add(world.plane, 'width', 1,20).onChange(() => {
  generatePlane()
})
gui.add(world.plane, 'height', 1,20).onChange(() => {
  generatePlane()
})

gui.add(world.plane, 'widthSegments', 1,20).onChange(() => {
  generatePlane()
})

gui.add(world.plane, 'heightSegments', 1,20).onChange(() => {
  generatePlane()
})


function generatePlane(){
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegments,world.plane.heightSegments)

  ////
  const {array} = planeMesh.geometry.attributes.position

  for (let i=0; i<array.length; i+=3){
    const x = array[i]
    const y = array[i+1]
    const z = array[i+2]
    array[i+2] = z+Math.random()
  }

  ////
}


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000)


const renderer = new THREE.WebGLRenderer()


renderer.setSize(innerWidth , innerHeight)
// remove jagging when animating objects
renderer.setPixelRatio(devicePixelRatio)


document.body.appendChild(renderer.domElement)

// create a box
// other geometries can be used look at the 3js website

// const boxGeometry = new THREE.BoxGeometry(1, 1,1,1)
// const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
// // Once we have the geometry and the material, we can create the mesh

// const mesh = new THREE.Mesh(boxGeometry, material)
// console.log(mesh)
// scene.add(mesh)
// mesh.rotation.x +=0.01
// mesh.rotation.y +=0.1

///////////////// box end ////////////////////



new OrbitControls(camera, renderer.domElement)
camera.position.z = 5


const planeGeometry = new THREE.PlaneGeometry(5,5,10,10)
const planeMaterial = new THREE.MeshPhongMaterial(
  {color: 0xff0000,
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading
  })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)

const light = new THREE.DirectionalLight(0xffffff, 1)
const backlight = new THREE.DirectionalLight(0xffffff, 1)

light.position.set(0,0,1)
backlight.position.set(0,0,-1)
scene.add(light)
scene.add(backlight)

function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene,  camera)

  // planeMesh.rotation.x +=0.01
}
animate()


