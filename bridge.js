/* Digital Bridge — interactive 3D background + motion layer */
(function(){
var d=document,B=d.body;
if(d.querySelector('.cta-buttons'))B.classList.add('bb-home');
// scroll progress + cursor glow
var pb=d.createElement('div');pb.id='bb-prog';B.appendChild(pb);
var cg=d.createElement('div');cg.id='bb-glow';B.appendChild(cg);
addEventListener('scroll',function(){var h=d.documentElement.scrollHeight-innerHeight;pb.style.width=(h>0?scrollY/h*100:0)+'%'},{passive:true});
addEventListener('pointermove',function(e){cg.style.transform='translate('+(e.clientX-250)+'px,'+(e.clientY-250)+'px)'});
// scroll reveal
var RV='.hero-section>*,.mission-card,.stat-card,.content-card,.chart-card,.interview-card,.member-card,.leader-card,.social-card,.section-title,.section-subtitle,.cta-content,.tabs-container';
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('bb-in');io.unobserve(e.target)}})},{threshold:.1});
d.querySelectorAll(RV).forEach(function(e,i){e.classList.add('bb-rv');e.style.transitionDelay=(i%4)*70+'ms';io.observe(e)});
setTimeout(function(){d.querySelectorAll('.bb-rv').forEach(function(e){e.classList.add('bb-in')})},3500);
// animated counters
d.querySelectorAll('.stat-number').forEach(function(el){var m=el.textContent.trim().match(/^([^\d]*)([\d.]+)(.*)$/);if(!m)return;var T=parseFloat(m[2]),dec=(m[2].split('.')[1]||'').length,o=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;o.disconnect();var s=performance.now();(function f(n){var p=Math.min(1,(n-s)/1600),v=T*(1-Math.pow(1-p,3));el.textContent=m[1]+v.toFixed(dec)+m[3];if(p<1)requestAnimationFrame(f)})(s)});o.observe(el)});
// 3D card tilt
d.querySelectorAll('.mission-card,.stat-card,.member-card,.leader-card,.social-card,.interview-card,.chart-card').forEach(function(c){
c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transition='border-color .35s,box-shadow .35s';c.style.transform='perspective(900px) rotateY('+x*12+'deg) rotateX('+-y*12+'deg) translateZ(8px)'});
c.addEventListener('pointerleave',function(){c.style.transition='';c.style.transform=''})});
// 3D network background
if(!window.THREE)return;
var cv=d.createElement('canvas');cv.id='bb-bg';B.insertBefore(cv,B.firstChild);
var R;try{R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true})}catch(e){return}
var W=innerWidth,H=innerHeight;R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(W,H);
var S=new THREE.Scene(),C=new THREE.PerspectiveCamera(55,W/H,.1,200);C.position.z=40;
var t2=d.createElement('canvas');t2.width=t2.height=64;var g2=t2.getContext('2d'),gr=g2.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.3,'rgba(255,255,255,.5)');gr.addColorStop(1,'rgba(255,255,255,0)');g2.fillStyle=gr;g2.fillRect(0,0,64,64);
var tex=new THREE.CanvasTexture(t2);
var N=W<700?55:120,X=36,Y=22,Z=28,DM=W<700?10:11.5,P=[],V=[],NP=new Float32Array(N*3),NC=new Float32Array(N*3),cA=new THREE.Color(0x22d3ee),cB=new THREE.Color(0x6366f1),cc=new THREE.Color();
for(var i=0;i<N;i++){P.push(new THREE.Vector3((Math.random()-.5)*2*X,(Math.random()-.5)*2*Y,(Math.random()-.5)*2*Z));V.push(new THREE.Vector3((Math.random()-.5)*.03,(Math.random()-.5)*.03,(Math.random()-.5)*.03));cc.copy(cA).lerp(cB,Math.random());NC[i*3]=cc.r;NC[i*3+1]=cc.g;NC[i*3+2]=cc.b}
var ng=new THREE.BufferGeometry();ng.setAttribute('position',new THREE.BufferAttribute(NP,3));ng.setAttribute('color',new THREE.BufferAttribute(NC,3));
var nodes=new THREE.Points(ng,new THREE.PointsMaterial({size:1.1,map:tex,vertexColors:true,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));S.add(nodes);
var MAXL=N*7,LP=new Float32Array(MAXL*6),LC=new Float32Array(MAXL*6),lg=new THREE.BufferGeometry();
lg.setAttribute('position',new THREE.BufferAttribute(LP,3));lg.setAttribute('color',new THREE.BufferAttribute(LC,3));lg.setDrawRange(0,0);
S.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false})));
// distant dust
var DN=1200,DP=new Float32Array(DN*3);for(var i=0;i<DN;i++){DP[i*3]=(Math.random()-.5)*160;DP[i*3+1]=(Math.random()-.5)*100;DP[i*3+2]=-Math.random()*90-10}
var dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(DP,3));
var dust=new THREE.Points(dg,new THREE.PointsMaterial({size:.5,map:tex,color:0x7ae7ff,transparent:true,opacity:.25,blending:THREE.AdditiveBlending,depthWrite:false}));S.add(dust);
var mx=0,my=0,sx=0,sy=0,sc=0,mw=new THREE.Vector3(999,999,0);
addEventListener('pointermove',function(e){mx=e.clientX/W-.5;my=e.clientY/H-.5});
addEventListener('scroll',function(){sc=scrollY/Math.max(1,d.documentElement.scrollHeight-H)},{passive:true});
addEventListener('resize',function(){W=innerWidth;H=innerHeight;R.setSize(W,H);C.aspect=W/H;C.updateProjectionMatrix()});
var t=0;(function loop(){requestAnimationFrame(loop);t+=.004;
sx+=(mx-sx)*.03;sy+=(my-sy)*.03;
var hh=Math.tan(.4802)*C.position.z;mw.set(mx*2*hh*C.aspect,-my*2*hh,0);
for(var i=0;i<N;i++){var p=P[i],v=V[i];p.add(v);
if(Math.abs(p.x)>X)v.x*=-1;if(Math.abs(p.y)>Y)v.y*=-1;if(Math.abs(p.z)>Z)v.z*=-1;
var dx=p.x-mw.x,dy=p.y-mw.y,dd=Math.sqrt(dx*dx+dy*dy);if(dd<9&&dd>.01){p.x+=dx/dd*(9-dd)*.02;p.y+=dy/dd*(9-dd)*.02}
NP[i*3]=p.x;NP[i*3+1]=p.y;NP[i*3+2]=p.z}
var n=0;for(var i=0;i<N&&n<MAXL;i++)for(var j=i+1;j<N&&n<MAXL;j++){var a=P[i],b=P[j],q=a.distanceTo(b);if(q<DM){var f=1-q/DM;LP.set([a.x,a.y,a.z,b.x,b.y,b.z],n*6);var k=f*.9;LC.set([.13*k,.83*k,.93*k,.39*k,.4*k,.95*k],n*6);n++}}
lg.setDrawRange(0,n*2);lg.attributes.position.needsUpdate=true;lg.attributes.color.needsUpdate=true;ng.attributes.position.needsUpdate=true;
dust.rotation.y=t*.15;
C.position.x=sx*10;C.position.y=-sy*6-sc*10;C.position.z=40-sc*10;C.rotation.y=-sx*.15;C.rotation.x=sy*.1;
R.render(S,C)})();
})();
