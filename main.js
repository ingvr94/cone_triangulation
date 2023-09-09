
import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import axios from 'axios';


const scene=new THREE.Scene();

scene.background=new THREE.Color('white')

const camera=new THREE.PerspectiveCamera(75, (window.innerWidth) / (window.innerHeight/2), 0.1, 1000);

const renderer=new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight/2);
camera.position.set(2, 2, 10);

renderer.render(scene,camera);

window.addEventListener('resize',()=>{
  renderer.setSize(window.innerWidth,window.innerHeight/2);
  camera.updateProjectionMatrix();
})

const material = new THREE.MeshNormalMaterial();
let geometry = new THREE.BufferGeometry();




document.querySelector('.form__btn').addEventListener('click',()=>{
let points=[];

const getPoints=async()=>{
  try {
  const res = await axios.post('https://cone-server-ingvr94.vercel.app',{
  h:Number(document.getElementById('height').value),
  r:Number(document.getElementById('radius').value),
  num:Number(document.getElementById('num').value)
});
return res.data
}
catch(err) {
  alert('Downloading error')
  console.log(err);
}
}

const drawPoints=async()=>{

await getPoints().then(res=>{

for (let i=0;i<res.num*3;i+=3){
  points.push(
  new THREE.Vector3(res.p[i],res.p[i+1],res.p[i+2]),
  new THREE.Vector3(res.p1[i],res.p1[i+1],res.p1[i+2]),
  new THREE.Vector3(0,0,res.h),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(res.p1[i],res.p1[i+1],res.p1[i+2]),
  new THREE.Vector3(res.p[i],res.p[i+1],res.p[i+2])
)
  }
    
})
return points
}

drawPoints().then(res=>{
geometry.setFromPoints(res);
geometry.computeVertexNormals();
})

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene,camera)
}

animate()

document.getElementById('height').value=''
document.getElementById('radius').value=''
document.getElementById('num').value=''

})

