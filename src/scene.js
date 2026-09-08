import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

// Every asset is original geometry. No downloaded models, photos or HDRIs.
export function mountRoom(host,onSelect,onReady) {
  const scene=new THREE.Scene();
  scene.background=new THREE.Color('#eeede6');
  const camera=new THREE.PerspectiveCamera(38,1,0.1,100);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.05;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-label','Interactive 3D room. Use the scene controls to change objects without a mouse.');
  host.appendChild(renderer.domElement);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=0.09;controls.enablePan=false;
  controls.minDistance=6;controls.maxDistance=19;
  controls.minPolarAngle=0.28;controls.maxPolarAngle=Math.PI/2.08;
  controls.target.set(0,1.0,0);
  let dirty=true;
  const home=()=>{camera.position.set(7.1,5.9,8.35);controls.target.set(0,1.0,0);controls.update();dirty=true;};home();
  controls.addEventListener('change',()=>{dirty=true;});
  const ambient=new THREE.HemisphereLight('#fffdf4','#6d7666',2.2);scene.add(ambient);
  const sun=new THREE.DirectionalLight('#fff5df',3.4);sun.position.set(3,7,-1.2);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:0.5,far:25});sun.shadow.normalBias=0.025;sun.shadow.bias=-0.0001;scene.add(sun);
  const fill=new THREE.DirectionalLight('#eaf4ff',0.8);fill.position.set(4,3,6);scene.add(fill);
  const mats=[];const textures=[];
  const material=(color,extra={})=>{const m=new THREE.MeshStandardMaterial({color,roughness:0.83,...extra});mats.push(m);return m;};
  const wood=material('#b98d5b'),darkWood=material('#765638'),white=material('#eee8da'),sage=material('#77846b'),fabric=material('#cbbd9f'),terracotta=material('#af704f'),soil=material('#41372c'),metal=material('#3e443a',{roughness:.45,metalness:.4});
  const wall=material('#ded9cb');
  function box(parent,w,h,d,x,y,z,mat,radius=0){const mesh=new THREE.Mesh(radius?new RoundedBoxGeometry(w,h,d,3,radius):new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  function cyl(parent,top,bottom,h,x,y,z,mat,segments=24){const m=new THREE.Mesh(new THREE.CylinderGeometry(top,bottom,h,segments),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function ball(parent,x,y,z,sx,sy,sz,mat){const m=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;}
  function rod(parent,a,b,r,mat){const delta=new THREE.Vector3().subVectors(b,a);const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),10),mat);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());mesh.castShadow=true;parent.add(mesh);return mesh;}
  const ground=box(scene,200,.05,200,0,-.34,0,material('#eeede6'));ground.castShadow=false;
  box(scene,6.2,.28,5.2,0,-.13,0,material('#b5b1a5'),.035);
  function grainTexture(){const cv=document.createElement('canvas');cv.width=64;cv.height=512;const ctx=cv.getContext('2d');ctx.fillStyle='#b79970';ctx.fillRect(0,0,64,512);let seed=8319;const rand=()=>((seed=(seed*16807)%2147483647)/2147483647);for(let i=0;i<240;i++){ctx.strokeStyle=`rgba(${rand()>.5?'75,51,25':'241,211,163'},${.025+rand()*.12})`;ctx.beginPath();let x=rand()*64;ctx.moveTo(x,0);for(let y=0;y<=512;y+=16)ctx.lineTo(x+Math.sin(y/100+rand())*2,y);ctx.stroke();}const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;textures.push(t);return t;}
  const grain=grainTexture();
  for(let x=0;x<20;x++)for(let z=0;z<4;z++){const p=material(new THREE.Color('#d1b58b').multiplyScalar(.91+((x*7+z*3)%9)*.015),{map:grain});box(scene,.296,.035,1.245,-2.85+x*.3,.025,-1.875+z*1.25,p);}
  box(scene,.16,3.2,5.16,-3.08,1.6,0,wall);
  // Back wall has a real window opening rather than a painted rectangle.
  box(scene,6.16,.78,.16,0,.39,-2.58,wall);
  box(scene,6.16,.2,.16,0,3.1,-2.58,wall);
  box(scene,1.5,2.24,.16,-2.33,1.9,-2.58,wall);
  box(scene,.65,2.24,.16,2.755,1.9,-2.58,wall);
  const windowFrame=material('#f1ede1');
  box(scene,4.05,.1,.24,.43,.82,-2.47,windowFrame);
  box(scene,4.05,.08,.18,.43,3.0,-2.5,windowFrame);
  for(const x of [-1.55,-.55,.45,1.45,2.45])box(scene,.055,2.2,.13,x,1.9,-2.51,windowFrame);
  for(const y of [1.52,2.25])box(scene,4,.04,.13,.45,y,-2.5,windowFrame);
  const windowSky=material('#dce8d5',{emissive:'#cddfc3',emissiveIntensity:.35,roughness:1});
  box(scene,4,2.16,.015,.45,1.91,-2.64,windowSky).castShadow=false;
  box(scene,6,.085,.06,0,.1,-2.45,windowFrame);box(scene,.06,.085,5,-2.96,.1,0,windowFrame);
  // A pair of small, original abstract prints.
  const print=(z,style)=>{box(scene,.07,1.12,.83,-2.95,2.08,z,wood,.018);box(scene,.03,1.02,.73,-2.9,2.08,z,white);box(scene,.02,.77,.51,-2.878,2.08,z,material(style?'#dad2bd':'#b6b69a'));const g=new THREE.Mesh(new THREE.CircleGeometry(.235,36),material(style?'#737b5d':'#525f50'));g.rotation.y=Math.PI/2;g.position.set(-2.855,2.2,z);scene.add(g);if(style)for(let i=0;i<6;i++){const leaf=ball(scene,-2.85,1.74+i*.095,z+(i%2?.06:-.06),.006,.07,.032,sage);leaf.rotation.x=(i%2?1:-1)*.6;}};print(-.48,false);print(-1.51,true);
  // Soft woven rug with a fine geometric border.
  box(scene,2.72,.022,2.18,.9,.06,1.0,fabric,.06);
  const rugLine=material('#b4a487');
  for(let i=0;i<36;i++)box(scene,2.62,.002,.012,.9,.073,-.04+i*.06,rugLine);
  for(const x of [-.38,2.18])box(scene,.022,.003,2.03,x,.075,1.0,white);
  const objects=new Map();
  const group=name=>{const g=new THREE.Group();g.userData.name=name;objects.set(name,g);scene.add(g);return g;};
  const chair=group('Armchair');
  for(const x of [-.4,.4])for(const z of [-.34,.34])cyl(chair,.044,.033,.36,x,.22,z,darkWood);
  box(chair,1.04,.18,.91,0,.47,0,sage,.08);box(chair,.89,.19,.83,0,.62,.04,sage,.075);
  box(chair,1.0,.61,.21,0,.97,-.39,sage,.08).rotation.x=-.08;
  for(const x of [-.52,.52])box(chair,.18,.42,.98,x,.78,0,sage,.08);
  const pillow=box(chair,.48,.44,.17,.1,.92,-.18,fabric,.08);pillow.rotation.z=-.1;pillow.rotation.x=.18;
  const desk=group('Desk');box(desk,2.22,.085,.88,0,.94,0,wood,.025);
  for(const x of [-.94,.94])for(const z of [-.32,.32])box(desk,.065,.91,.065,x,.49,z,wood,.008);
  box(desk,1.96,.16,.065,0,.8,-.31,wood);box(desk,.84,.025,.53,-.3,1.0,0,metal,.018);
  box(desk,.81,.012,.5,-.3,1.018,-.01,material('#a6aba2'),.01);
  for(let i=0;i<3;i++)box(desk,.36,.026,.28,.7,1.0+i*.028,-.05,i===1?sage:white,.008);
  cyl(desk,.052,.043,.15,.81,1.18,-.06,terracotta,18);
  for(let i=0;i<6;i++)rod(desk,new THREE.Vector3(.81,1.2,-.06),new THREE.Vector3(.81+Math.sin(i*2)*.055,1.43-(i%3)*.025,-.06+Math.cos(i*2)*.055),.006,darkWood);
  const plant=group('Plant');cyl(plant,.25,.18,.47,0,.29,0,terracotta);cyl(plant,.245,.245,.035,0,.515,0,soil);
  const green=[material('#52664a'),material('#667b51'),material('#7f8c5b')];
  for(let i=0;i<18;i++){const a=i*2.4;const h=.85+(i%7)*.095;const radius=.25+(i%4)*.055;const end=new THREE.Vector3(Math.sin(a)*radius,h,Math.cos(a)*radius);rod(plant,new THREE.Vector3(0,.47,0),end,.012,green[0]);const l=ball(plant,end.x,end.y+.05,end.z,.12,.29,.033,green[i%3]);l.rotation.set(.3+Math.cos(a)*.6,a,Math.sin(a)*.6);}
  const lamp=group('Floor lamp');
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3;rod(lamp,new THREE.Vector3(Math.sin(a)*.25,.05,Math.cos(a)*.25),new THREE.Vector3(0,1.45,0),.028,wood);}
  const shade=material('#eee0b5',{emissive:'#f9c779',emissiveIntensity:.15});ball(lamp,0,1.65,0,.31,.43,.31,shade);
  const ribs=material('#c4b58e');for(let i=1;i<15;i++){const t=-Math.PI/2+i*Math.PI/15;const ring=new THREE.Mesh(new THREE.TorusGeometry(.31*Math.cos(t),.003,5,48),ribs);ring.rotation.x=Math.PI/2;ring.position.y=1.65+.43*Math.sin(t);lamp.add(ring);}
  cyl(lamp,.055,.055,.06,0,2.08,0,darkWood);
  const lampLight=new THREE.PointLight('#ffd59c',8,7,2);lampLight.position.set(0,1.55,0);lampLight.castShadow=false;lamp.add(lampLight);
  const table=group('Coffee table');cyl(table,.44,.44,.065,0,.47,0,wood,48);
  for(let i=0;i<3;i++){const a=i*2*Math.PI/3;rod(table,new THREE.Vector3(Math.sin(a)*.29,.07,Math.cos(a)*.29),new THREE.Vector3(Math.sin(a)*.2,.45,Math.cos(a)*.2),.022,darkWood);}
  box(table,.28,.025,.23,.03,.525,.08,white,.01);
  cyl(table,.067,.06,.12,-.17,.57,-.08,white);cyl(table,.055,.055,.005,-.17,.633,-.08,darkWood);
  cyl(table,.08,.055,.1,.12,.58,-.12,terracotta);for(let i=0;i<7;i++){const a=i*2;const leaf=ball(table,.12+Math.sin(a)*.07,.7,-.12+Math.cos(a)*.07,.03,.1,.024,green[i%3]);leaf.rotation.z=Math.sin(a)*.6;}
  // Open bookshelf, with individually modelled books and a trailing plant.
  const shelf=new THREE.Group();shelf.position.set(-2.48,0,1.63);shelf.rotation.y=Math.PI/2;scene.add(shelf);
  for(const x of [-.36,.36])for(const z of [-.16,.16])box(shelf,.045,2.05,.045,x,1.06,z,wood,.008);
  for(const y of [.19,.66,1.13,1.6,2.03])box(shelf,.81,.045,.38,0,y,0,wood,.01);
  for(let i=0;i<7;i++)box(shelf,.055,.28+(i%3)*.035,.23,-.23+i*.065,.36+(i%3)*.017,0,[sage,white,fabric,terracotta][i%4],.003);
  for(let i=0;i<3;i++)box(shelf,.4,.045,.26,.02,.7+i*.047,0,i%2?white:sage,.005);
  cyl(shelf,.11,.08,.19,.12,2.16,0,terracotta);
  for(let i=0;i<17;i++){const a=i*2.3;const l=ball(shelf,.12+Math.sin(a)*.16,2.28-(i>9?(i-9)*.08:0),Math.cos(a)*.13,.057,.1,.04,green[i%3]);l.rotation.z=Math.sin(a);}
  const poses={Studio:{Armchair:[1.22,1.02,-.15],Desk:[-2.25,-.38,Math.PI/2],Plant:[-1.0,-1.95,0],'Floor lamp':[2.27,-1.54,0],'Coffee table':[.2,1.13,0]},Lounge:{Armchair:[.85,.72,-.5],Desk:[-1.48,-1.88,0],Plant:[-2.35,.3,0],'Floor lamp':[2.25,-1.36,0],'Coffee table':[.12,1.48,0]}};
  let current=null;
  function update(state){current=state;for(const [name,g] of objects){const [x,z,angle]=poses[state.layout][name];g.position.set(x+state.objects[name].x,0,z);g.rotation.y=angle+state.objects[name].rotation*Math.PI/180;}
    wall.color.set({Chalk:'#ded9cb',Sage:'#aab39d',Clay:'#caa38b'}[state.finish]);
    const night=state.atmosphere==='Night',gold=state.atmosphere==='Golden hour';
    sun.intensity=night?.25:gold?3.2:3.4;sun.color.set(gold?'#ffc47b':night?'#9eadde':'#fff5df');sun.position.set(gold?5:3,gold?3.5:7,gold?-.4:-1.2);
    ambient.intensity=night?.62:2.2;fill.intensity=night?.28:.8;
    scene.background.set(night?'#263633':gold?'#e9decb':'#eeede6');ground.material.color.copy(scene.background);
    windowSky.color.set(night?'#304a68':gold?'#f3d2a0':'#dce8d5');windowSky.emissiveIntensity=night?.08:.35;
    lampLight.intensity=state.light?(night?14:6):0;shade.emissiveIntensity=state.light?(night?1.2:.3):0;
    dirty=true;
  }
  let down=null;const ray=new THREE.Raycaster();const point=new THREE.Vector2();
  const onDown=e=>{down={x:e.clientX,y:e.clientY};};
  const onUp=e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6)return;const rect=renderer.domElement.getBoundingClientRect();point.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(point,camera);const hits=ray.intersectObjects([...objects.values()].filter(g=>g.visible),true);if(hits.length){let g=hits[0].object;while(g&&!g.userData.name)g=g.parent;if(g)onSelect(g.userData.name);}down=null;};
  renderer.domElement.addEventListener('pointerdown',onDown);renderer.domElement.addEventListener('pointerup',onUp);
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w/h<1?48:38;camera.updateProjectionMatrix();dirty=true;};
  const ro=new ResizeObserver(resize);ro.observe(host);resize();
  let animation;let disposed=false;
  const tick=()=>{if(disposed)return;controls.update();if(dirty){renderer.render(scene,camera);dirty=false;}animation=requestAnimationFrame(tick);};tick();
  // The list thumbnails are actual renders of these original 3D objects.
  const thumbs={};
  const tr=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
  tr.setSize(130,120);tr.setPixelRatio(1);tr.outputColorSpace=THREE.SRGBColorSpace;tr.toneMapping=THREE.ACESFilmicToneMapping;
  for(const [name,g] of objects){const ts=new THREE.Scene();ts.add(new THREE.HemisphereLight('#fffdf4','#6d7666',2.8));const light=new THREE.DirectionalLight('#fff5df',3);light.position.set(3,5,4);ts.add(light);const clone=g.clone();clone.position.set(0,0,0);clone.rotation.set(0,0,0);ts.add(clone);const bounds=new THREE.Box3().setFromObject(clone),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());const tc=new THREE.PerspectiveCamera(35,130/120,.01,50);const distance=Math.max(size.x,size.y,size.z)*2.2;tc.position.copy(center).add(new THREE.Vector3(.7,.45,1).normalize().multiplyScalar(distance));tc.lookAt(center);tr.render(ts,tc);thumbs[name]=tr.domElement.toDataURL('image/png');}
  tr.dispose();
  onReady(thumbs);
  return {update,home,visibility(items){for(const i of items){const g=objects.get(i.name);if(g)g.visible=i.action!=='Leave out';}dirty=true;},dispose(){disposed=true;cancelAnimationFrame(animation);ro.disconnect();controls.dispose();renderer.domElement.removeEventListener('pointerdown',onDown);renderer.domElement.removeEventListener('pointerup',onUp);scene.traverse(o=>{o.geometry?.dispose();});for(const m of mats)m.dispose();for(const t of textures)t.dispose();renderer.dispose();renderer.domElement.remove();}};
}
