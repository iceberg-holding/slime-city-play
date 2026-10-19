(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t){let n=e.air?.heights;if(!n)return 0;if(t<=n[0][0])return n[0][1];for(let e=1;e<n.length;e++)if(t<=n[e][0]){let[r,i]=n[e-1],[a,o]=n[e];return i+(o-i)*(t-r)/(a-r)}return n[n.length-1][1]}var t=.6;function n(e,t){let n=e.map(([e,t])=>({x:e,z:t}));return{points:n,length:n.slice(1).reduce((e,t,r)=>e+Math.hypot(t.x-n[r].x,t.z-n[r].z),0),...t}}function r(e,t){let n=e.points,r=Math.max(0,t);for(let e=1;e<n.length;e++){let t=n[e-1],i=n[e],a=Math.hypot(i.x-t.x,i.z-t.z);if(r<=a||e===n.length-1){let e=Math.min(1,r/a),n=(i.x-t.x)/a,o=(i.z-t.z)/a;return{x:t.x+(i.x-t.x)*e,z:t.z+(i.z-t.z)*e,dx:n,dz:o,yaw:Math.atan2(-n,-o)}}r-=a}throw Error(`Empty track`)}function i(e,t,n){let r=e.points,i={distance:1/0,progress:0,x:r[0].x,z:r[0].z,dx:0,dz:-1},a=0;for(let e=1;e<r.length;e++){let o=r[e-1],s=r[e],c=s.x-o.x,l=s.z-o.z,u=Math.hypot(c,l),d=Math.max(0,Math.min(1,((t-o.x)*c+(n-o.z)*l)/u**2)),f=o.x+c*d,p=o.z+l*d,m=Math.hypot(t-f,n-p);m<i.distance&&(i={distance:m,progress:a+u*d,x:f,z:p,dx:c/u,dz:l/u}),a+=u}return i}var a=new WeakMap;function o(n){let i=a.get(n);if(i)return i;if(i=[],n.air){for(let a=20,o=0;a<n.length-12;a+=28,o++){if(n.air.rings.some(e=>Math.abs(e-a)<9))continue;let s=r(n,a),c=o%4==3?o%8==3?-2.5:2.5:0,l=e(n,a)+t,u=o%4==1?`high`:o%4==3&&l>6?`low`:`mid`;i.push({x:s.x-s.dz*c,y:u===`high`?l+3.2:u===`low`?l-1.8:l,z:s.z+s.dx*c,d:a,high:u===`high`})}return a.set(n,i),i}let o=[-3,0,3];for(let e=30,t=0;e<n.length-15;e+=40,t++){if(n.jumps.some(t=>e>t-12&&e<t+n.rampLength+14)||n.gap&&e>n.gap.start-6&&e<n.gap.end+6)continue;let a=r(n,e),s=o[t%3];i.push({x:a.x-a.dz*s,y:1.1,z:a.z+a.dx*s,d:e,high:!1})}for(let e of n.jumps){let t=e+n.rampLength+1.5,a=r(n,t),o=e===n.optionalJump?-3.5:0;i.push({x:a.x-a.dz*o,y:n.rampHeight+.85,z:a.z+a.dx*o,d:t,high:!0})}return i.sort((e,t)=>e.d-t.d),a.set(n,i),i}var s=e=>e.air?.ringRadius??1.6,c=new WeakMap;function l(n){let i=c.get(n);return i||(n.air?(i=n.air.rings.map(i=>{let a=r(n,i);return{x:a.x,y:e(n,i)+t,z:a.z,d:i,yaw:a.yaw}}),c.set(n,i),i):(i=n.jumps.map(e=>{let t=e+n.rampLength+1.5,i=r(n,t),a=e===n.optionalJump?-3.5:0;return{x:i.x-i.dz*a,y:n.rampHeight+n.ringLift,z:i.z+i.dx*a,d:t,yaw:i.yaw}}),c.set(n,i),i))}var u=n([[80,15],[80,-55],[98,-120],[80,-190],[62,-260],[80,-330],[98,-400],[80,-470],[80,-535],[62,-600],[80,-670],[98,-740],[80,-810],[80,-840]],{jumps:[45,145,245,350,455,575,690,790],optionalJump:350,gap:{start:358,end:363},rampHeight:2.7,rampLength:8,rail:6.1,ringLift:1.15}),d=n([[120,10],[120,-40],[135,-90],[120,-140],[135,-190],[135,-290],[135,-330],[150,-356],[180,-356],[195,-330],[205,-300],[205,-250],[190,-190],[205,-130],[205,-60],[190,-10]],{jumps:[20,120,225,255,480,575,660,730],optionalJump:255,gap:{start:262,end:267},rampHeight:1.8,rampLength:7,rail:6.1,ringLift:.9}),f={boardwalk:[206.6,306.6],lighthouse:{x:167,z:-322},cliffRoad:535};u.points,u.length,u.jumps,u.gap,u.rampHeight,u.rampLength;var p=1/60,m=6.5,h=.35,g=1.8,_=8.2,v=.4,y=.5,b=1.2,x=1.6,S=4.2,C=1.5,w=2.6,T=e=>e<0?0:e>1?1:e;function E(e,t,n){if(e.ramp===void 0)return e.maxY;let r=0;switch(e.ramp){case 0:r=(t-e.minX)/(e.maxX-e.minX);break;case 1:r=(n-e.minZ)/(e.maxZ-e.minZ);break;case 2:r=(e.maxX-t)/(e.maxX-e.minX);break;case 3:r=(e.maxZ-n)/(e.maxZ-e.minZ)}return e.minY+(e.maxY-e.minY)*T(r)}function D(e){let t={minX:e.x,minY:e.y,minZ:e.z,maxX:e.x+1,maxY:e.y+1,maxZ:e.z+1};return e.shape===`ramp`&&(t.ramp=e.dir),t}var O=1e-6;function k(e,t,n,r){return t+r>e.minX+O&&t-r<e.maxX-O&&n+r>e.minZ+O&&n-r<e.maxZ-O}var A=class{constructor(e,t=[]){this.statics=e,this.dynamics=t}get lists(){return[this.statics,this.dynamics]}blocked(e,t,n,r,i){for(let a of this.lists)for(let o of a)if(k(o,e,t,r)&&!(o.minY>=n+i)&&E(o,e,t)>n+.4)return!0;return!1}groundAt(e,t,n,r){let i=0;for(let a of this.lists)for(let o of a){if(!k(o,e,t,r))continue;let a=E(o,e,t);a<=n&&a>i&&(i=a)}return i}pointInside(e,t,n){for(let r of this.lists)for(let i of r)if(e>i.minX&&e<i.maxX&&n>i.minZ&&n<i.maxZ&&t>i.minY&&t<E(i,e,n))return i;return null}raycast(e,t,n,r,i,a,o){let s=o;for(let o of this.statics){let c=0,l=s,u=[e,t,n],d=[r,i,a],f=[o.minX,o.minY,o.minZ],p=[o.maxX,o.maxY,o.maxZ],m=!0;for(let e=0;e<3;e++)if(Math.abs(d[e])<1e-8){if(u[e]<f[e]||u[e]>p[e]){m=!1;break}}else{let t=(f[e]-u[e])/d[e],n=(p[e]-u[e])/d[e];if(t>n&&([t,n]=[n,t]),t>c&&(c=t),n<l&&(l=n),c>l){m=!1;break}}m&&c<s&&(s=c)}return s}};function j(e,t,n,r){let i=!1,{radius:a,height:o}=e,s=e.pos.x+e.vel.x*t;n.blocked(s,e.pos.z,e.pos.y,a,o)||Math.abs(s)>r-a?(e.vel.x=0,i=!0):e.pos.x=s;let c=e.pos.z+e.vel.z*t;n.blocked(e.pos.x,c,e.pos.y,a,o)||Math.abs(c)>r-a?(e.vel.z=0,i=!0):e.pos.z=c;let l=e.grounded;e.vel.y+=-22*t,e.vel.y<-40&&(e.vel.y=-40);let u=e.pos.y+e.vel.y*t,d=n.groundAt(e.pos.x,e.pos.z,e.pos.y+v,a);return u<=d||l&&e.vel.y<=0&&d>=e.pos.y-.45?(e.pos.y=d,e.vel.y=0,e.grounded=!0):(e.pos.y=u,e.grounded=!1),i}var M={scooter:{id:`scooter`,parts:[{id:`frontWheel`},{id:`rearWheel`},{id:`deck`},{id:`handlebar`}],radius:.45,height:1.3,seatY:.2,maxSpeed:14,reverseSpeed:3,accel:16,brake:24,drag:1,turnRate:3.4,hopVel:5.2,launch:.75,flies:!1},drone:{id:`drone`,parts:[{id:`propFront`},{id:`propRear`},{id:`frame`},{id:`battery`},{id:`camera`},{id:`skids`}],radius:.75,height:2.1,seatY:.87,maxSpeed:12,reverseSpeed:4,accel:9,brake:14,drag:1.2,turnRate:2.4,hopVel:0,launch:0,flies:!0,climb:5.5,ceiling:26},pitbike:{id:`pitbike`,parts:[{id:`frontWheel`},{id:`rearWheel`},{id:`frame`},{id:`handlebar`},{id:`engine`},{id:`flashlight`,accessory:!0}],radius:.55,height:1.3,seatY:.25,maxSpeed:13,reverseSpeed:4,accel:12,brake:22,drag:1.1,turnRate:2.6,hopVel:6.5,launch:1,flies:!1}},N={vehicle:`pitbike`,garage:{x:5.5,z:15.5,radius:2.6},partSpots:[{x:0,y:1.35,z:-1.9},{x:-13.5,y:5.9,z:-22.2},{x:-11.5,y:3.9,z:22.4},{x:-15.5,y:1.45,z:2.3},{x:19.8,y:6.9,z:-19.8},{x:26,y:12.6,z:-23.4}],rideGoal:10,liftOnly:[5]},P={vehicle:`scooter`,garage:{x:8,z:12,radius:2.6},rideGoal:10,partSpots:[{x:-5.5,y:1.75,z:-32},{x:23.5,y:4.75,z:-32},{x:-1,y:1.95,z:-25.5},{x:-25.5,y:3.35,z:-4.5}]},ee={vehicle:`drone`,garage:{x:8,z:14,radius:2.6},rideGoal:10,hint:[3],partSpots:[{x:-26,y:1.95,z:14},{x:6,y:5.1,z:-32},{x:-22,y:1.75,z:-10},{x:23,y:10.55,z:-23.4},{x:16,y:8.1,z:-32.5},{x:30,y:1.15,z:-3}]},te=[15983555,16238279,12576464,12376306,16507803,14273008,16175012];function ne(e,t,n,r,i,a){return{minX:e,minY:t,minZ:n,maxX:r,maxY:i,maxZ:a}}var re={x:0,y:0,z:14},ie=[{x:12,z:-3},{x:-12,z:-1},{x:14,z:-13},{x:-13,z:-11},{x:3,z:-15},{x:-14,z:12},{x:9,z:3}];function ae(){let e=[],t=0,n=(n,r,i,a,o,s=!0)=>{e.push({minX:n,minZ:r,maxX:i,maxZ:a,height:o,color:te[t++%te.length],mansard:s})};n(-32,-32,-20,-21,9),n(-20,-32,-8,-21,5),n(-8,-32,7,-21,7),n(7,-32,20,-21,4,!1),n(-32,21,-18,32,6),n(-18,21,-6,32,3,!1),n(-6,21,9,32,8),n(9,21,32,32,5),n(-32,-21,-21,-4,7),n(-32,-4,-21,21,4,!1),n(21,-21,32,0,6),n(21,0,32,21,9);let r=[];for(let t of e)if(r.push(ne(t.minX,0,t.minZ,t.maxX,t.height,t.maxZ)),t.mansard){let e=oe(t);r.push(e)}for(let e of[.26,11.57,22.1325])r.push(ne(21.8,e-.2,-30.2,30.2,e,-21.8));r.push(ne(21.8,.26,-30.2,22.1,22.1,-21.8)),r.push(ne(22.1,.26,-30.2,30.2,22.1,-29.9));let i=[{minX:-17.5,minY:0,minZ:-21,maxX:-6,maxY:5,maxZ:-18.6,ramp:2},{minX:18.6,minY:0,minZ:-18.5,maxX:21,maxY:6,maxZ:-4,ramp:3},{minX:-16,minY:0,minZ:19.1,maxX:-8,maxY:3,maxZ:21,ramp:2}],a=[ne(-20,0,-21,-17.5,5,-18.6),ne(18.6,0,-21,21,6,-18.5),ne(-18,0,19.1,-16,3,21)];r.push(...i,...a);let o=[];for(let e of[{x:14,h:1},{x:15.5,h:2},{x:17,h:3},{x:18.5,h:4}]){for(let t=0;t<e.h;t++)o.push({kind:`crate`,x:e.x,z:20.25,w:1.5,d:1.5,h:1,y:t});r.push(ne(e.x-.75,0,19.5,e.x+.75,e.h,21))}for(let e=0;e<8;e++){let t=e/8*Math.PI*2+Math.PI/8,n=Math.cos(t)*9.5,i=Math.sin(t)*9.5;o.push({kind:`tree`,x:n,z:i}),r.push(ne(n-.25,0,i-.25,n+.25,2.2,i+.25))}for(let[e,t]of[[-17.5,-17.5],[17,-17.5],[-19,19],[19,19],[0,-19.5],[-3,19.5]])o.push({kind:`lamp`,x:e,z:t}),r.push(ne(e-.15,0,t-.15,e+.15,3.6,t+.15));for(let[e,t]of[[-5.5,0],[5.5,0],[0,-5.5]]){o.push({kind:`bench`,x:e,z:t});let n=Math.abs(t)>Math.abs(e);r.push(n?ne(e-1,0,t-.35,e+1,.5,t+.35):ne(e-.35,0,t-1,e+.35,.5,t+1))}let s=[{x:-15.5,z:4,alongX:!1,color:15087942},{x:15.5,z:7,alongX:!1,color:2792948},{x:6,z:-16,alongX:!0,color:16758531},{x:-6,z:16,alongX:!0,color:9095462},{x:15.5,z:14,alongX:!1,color:11765995},{x:-11,z:-15.5,alongX:!0,color:16744272}];for(let e of s){let[t,n]=e.alongX?[2,.95]:[.95,2];r.push(ne(e.x-t,0,e.z-n,e.x+t,1.1,e.z+n));let[i,a]=e.alongX?[1.1,.85]:[.85,1.1];r.push(ne(e.x-i,1.1,e.z-a,e.x+i,1.75,e.z+a))}let c={x:0,z:0,stepHalf:3.2,stepH:.35,basinHalf:2.6,basinH:.7,pillarHalf:.6,pillarH:2};return r.push(ne(-c.stepHalf,0,-c.stepHalf,c.stepHalf,c.stepH,c.stepHalf)),r.push(ne(-c.basinHalf,0,-c.basinHalf,c.basinHalf,c.basinH,c.basinHalf)),r.push(ne(-c.pillarHalf,0,-c.pillarHalf,c.pillarHalf,c.pillarH,c.pillarHalf)),{theme:`city`,half:900,solids:r,buildings:e,ramps:i,platforms:a,cars:s,props:o,fountain:c,plazaRadius:9}}function oe(e){let t=1.6;return ne(e.minX+t,e.height,e.minZ+t,e.maxX-t,e.height+1.6,e.maxZ-t)}var F=(e,t,n,r,i,a)=>({minX:e,minY:t,minZ:n,maxX:r,maxY:i,maxZ:a}),se={west:-44,east:44,north:-40,south:30,parkEdge:-2,pond:{minX:-30,maxX:-14,minZ:-16,maxZ:-4,rim:.5,rimH:.45},island:F(-24,0,-12,-20,.8,-8),bridge:F(-23,0,-8,-21,.8,-3),bridgeRamp:{minX:-23,minY:0,minZ:-3,maxX:-21,maxY:.8,maxZ:0,ramp:3},bandstand:{x:-26,z:14,half:3.5,y:1,roof:4.2},bandstandSteps:{minX:-22.5,minY:0,minZ:12.5,maxX:-20,maxY:1,maxZ:15.5,ramp:2},tower:{minX:20,maxX:26,minZ:-26,maxZ:-20,floor:9.6,room:4,x:23,z:-23,top:14.2,stair:1.6,door:[22,24]},terraceA:F(2,0,-36,12,4.2,-28),stairA:{minX:2,minY:0,minZ:-28,maxX:9,maxY:4.2,maxZ:-26.4,ramp:0},terraceB:F(12,0,-36,19,7.2,-29),rampAB:{minX:6,minY:4.2,minZ:-35.6,maxX:12,maxY:7.2,maxZ:-34,ramp:0},rampRail:F(6.6,4.2,-34,12,8.2,-33.85),hedges:[[-34,-26],[-22,2],[10,24]],stalls:[F(27,0,-7,31,1,-5.5),F(33,0,-7,37,1,-5.5)]};function ce(){let e=se.tower,t=e.stair,n=e.floor/4;return{ramps:[{minX:e.minX,maxX:e.maxX,minZ:e.maxZ,maxZ:e.maxZ+t,minY:0,maxY:n,ramp:0},{minX:e.maxX,maxX:e.maxX+t,minZ:e.minZ,maxZ:e.maxZ,minY:n,maxY:n*2,ramp:3},{minX:e.minX,maxX:e.maxX,minZ:e.minZ-t,maxZ:e.minZ,minY:n*2,maxY:n*3,ramp:2},{minX:e.minX-t,maxX:e.minX,minZ:e.minZ,maxZ:e.maxZ,minY:n*3,maxY:e.floor,ramp:1}],landings:[F(e.maxX,0,e.maxZ,e.maxX+t,n,e.maxZ+t),F(e.maxX,0,e.minZ-t,e.maxX+t,n*2,e.minZ),F(e.minX-t,0,e.minZ-t,e.minX,n*3,e.minZ),F(e.minX-t,e.floor-.4,e.maxZ,e.minX,e.floor,e.maxZ+t)],balcony:F(e.minX,e.floor-.4,e.maxZ,e.maxX,e.floor,e.maxZ+t)}}function le(){let e=se.island,t=se.bridge,n=t.maxY+1,r=.15;return[F(t.minX,0,t.minZ,t.minX+r,n,t.maxZ),F(t.maxX-r,0,t.minZ,t.maxX,n,t.maxZ),F(e.minX,0,e.minZ,e.minX+r,n,e.maxZ),F(e.maxX-r,0,e.minZ,e.maxX,n,e.maxZ),F(e.minX,0,e.minZ,e.maxX,n,e.minZ+r),F(e.minX,0,e.maxZ-r,t.minX,n,e.maxZ),F(t.maxX,0,e.maxZ-r,e.maxX,n,e.maxZ)]}function ue(e,t,n){let r=se.pond,i=se.island,a=se.bridge;if(t>.3||e<r.minX+r.rim||e>r.maxX-r.rim||n<r.minZ+r.rim||n>r.maxZ-r.rim)return!1;let o=t=>e>t.minX&&e<t.maxX&&n>t.minZ&&n<t.maxZ;return!o(i)&&!o(a)}function de(e,t,n,r){return e.world.theme!==`oldtown`||!ue(t,n,r)?!1:(e.events.push({type:`splat`,x:t,y:.2,z:r}),!0)}var fe={x:2,y:0,z:10},pe=[{x:-10,z:4},{x:-32,z:0},{x:-16,z:18},{x:12,z:-10},{x:24,z:2},{x:30,z:-12},{x:4,z:20}],me={x:15.5,z:-16},he=[16041098,16507828,15901832,16773590,14280888,16175008,15250592,16639904];function ge(e,t,n,r,i,a,o){let s=o;for(let o=t;o<n-.1;s++){let t=[6,5,7,5.5,6.5][s%5],c=Math.min(n,o+t),l=[7,8.5,6.5,9,7.5,10][s%6];e.push(a?{minX:o,maxX:c,minZ:r,maxZ:i,height:l,color:he[s%he.length],roof:`gable`}:{minX:r,maxX:i,minZ:o,maxZ:c,height:l,color:he[s%he.length],roof:`gable`}),o=c}}function _e(){let e=se,t=[];ge(t,e.west-8,e.east+8,e.south,e.south+8,!0,0),ge(t,e.west-8,e.east+8,e.north-8,e.north,!0,3),ge(t,e.north,e.south,e.west-8,e.west,!1,1),ge(t,e.north,e.south,e.east,e.east+8,!1,4);let n=e.terraceA,r=e.terraceB;return t.push({minX:n.minX,maxX:n.maxX,minZ:n.minZ,maxZ:n.maxZ,height:n.maxY,color:15901832,roof:`flat`}),t.push({minX:r.minX,maxX:r.maxX,minZ:r.minZ,maxZ:r.maxZ,height:r.maxY,color:16507828,roof:`flat`}),t.push({minX:36,maxX:e.east,minZ:-30,maxZ:-22,height:8,color:14280888,roof:`gable`}),t.push({minX:36,maxX:e.east,minZ:-22,maxZ:-14,height:9.5,color:16175008,roof:`gable`}),t.push({minX:38,maxX:e.east,minZ:14,maxZ:22,height:7,color:15250592,roof:`gable`}),t}function ve(e){if(e.roof===`flat`)return[];let t=e.maxX-e.minX>=e.maxZ-e.minZ,n=t?e.maxZ-e.minZ:e.maxX-e.minX,r=Math.min(3,n*.4),i=(r,i,a)=>{let o=t?(e.minZ+e.maxZ)/2:(e.minX+e.maxX)/2,s=n/2*r;return t?F(e.minX,i,o-s,e.maxX,a,o+s):F(o-s,i,e.minZ,o+s,a,e.maxZ)};return[i(.66,e.height,e.height+r*.5),i(.33,e.height+r*.5,e.height+r*.85)]}var ye=[F(3,4.2,-35.5,3.9,6,-34.6),F(10.4,4.2,-30.2,11.3,5.8,-29.3),F(17.6,7.2,-35.4,18.5,9,-34.5)],be=[...[[-38,-30],[-30,-30],[-20,-32],[-8,-30],[-38,-18],[-36,-2],[-8,-16],[-6,-2],[-38,10],[-34,22],[-16,8],[-12,22],[-4,14],[-26,4]].map(([e,t])=>({kind:`tree`,x:e,z:t})),...[[-10,-6],[-18,2],[-30,8.2],[0,-14],[16,6],[32,4]].map(([e,t])=>({kind:`lamp`,x:e,z:t})),...[[-14,2],[-30,-20],[-8,10]].map(([e,t])=>({kind:`bench`,x:e,z:t})),...[[12,2],[18,4],[14,8]].map(([e,t])=>({kind:`umbrella`,x:e,z:t}))];function xe(){let e=se,t=[],n=[];for(let e of _e())t.push(F(e.minX,0,e.minZ,e.maxX,e.height,e.maxZ),...ve(e)),n.push({minX:e.minX,minZ:e.minZ,maxX:e.maxX,maxZ:e.maxZ,height:e.height,color:e.color,mansard:!1});t.push(e.stairA,e.rampAB,e.rampRail,...ye);let r=e.pond;t.push(F(r.minX,0,r.minZ,r.maxX,r.rimH,r.minZ+r.rim),F(r.minX,0,r.maxZ-r.rim,e.bridge.minX,r.rimH,r.maxZ),F(e.bridge.maxX,0,r.maxZ-r.rim,r.maxX,r.rimH,r.maxZ),F(r.minX,0,r.minZ,r.minX+r.rim,r.rimH,r.maxZ),F(r.maxX-r.rim,0,r.minZ,r.maxX,r.rimH,r.maxZ)),t.push(e.island,e.bridge,e.bridgeRamp,...le());let i=e.bandstand;t.push(F(i.x-i.half,0,i.z-i.half,i.x+i.half,i.y,i.z+i.half),e.bandstandSteps);for(let e of[-1,1])for(let n of[-1,1]){let r=i.x+e*(i.half-.3),a=i.z+n*(i.half-.3);t.push(F(r-.15,0,a-.15,r+.15,i.roof,a+.15))}let a=e.tower,o=a.floor+a.room;t.push(F(a.minX,0,a.minZ,a.maxX,a.floor,a.maxZ)),t.push(F(a.minX,a.floor,a.minZ,a.maxX,o,a.minZ+.4),F(a.minX,a.floor,a.minZ,a.minX+.4,o,a.maxZ),F(a.maxX-.4,a.floor,a.minZ,a.maxX,o,a.maxZ),F(a.minX,a.floor,a.maxZ-.4,a.door[0],o,a.maxZ),F(a.door[1],a.floor,a.maxZ-.4,a.maxX,o,a.maxZ)),t.push(F(a.minX-.3,o,a.minZ-.3,a.maxX+.3,a.top,a.maxZ+.3));let s=ce();t.push(...s.ramps,...s.landings,s.balcony);for(let[n,r]of e.hedges)t.push(F(e.parkEdge-1.15,0,n,e.parkEdge-.05,1,r));t.push(...e.stalls);for(let e of be){let n=e.kind===`tree`?.35:e.kind===`bench`?0:.15;e.kind===`bench`?t.push(F(e.x-1,0,e.z-.35,e.x+1,.5,e.z+.35)):t.push(F(e.x-n,0,e.z-n,e.x+n,e.kind===`tree`?3.2:e.kind===`umbrella`?2.4:3.6,e.z+n))}return{theme:`oldtown`,half:900,solids:t,buildings:n,ramps:[e.stairA,e.rampAB,e.bridgeRamp,e.bandstandSteps,...s.ramps],platforms:[e.terraceA,e.terraceB,e.island],cars:[],props:be,plazaRadius:0}}var I=(e,t,n,r,i,a)=>({minX:e,minY:t,minZ:n,maxX:r,maxY:i,maxZ:a}),Se={seawallZ:-14,beachMaxX:-10,pier:{minX:-8,maxX:-3,minZ:-34,maxZ:-14,y:1,boardFrom:-27,boardTo:-24},pierRamp:{minX:-8,minY:0,minZ:-14,maxX:-3,maxY:1,maxZ:-10,ramp:3},boat:{minX:-3,maxX:1,minZ:-30,maxZ:-21,y:1.2},jetty:{minX:20,maxX:26,minZ:-38,maxZ:-14,y:.4},lighthouse:{x:23,z:-35,half:2,height:13},gallery:I(20.3,0,-33,25.7,4,-31),galleryRamp:{minX:20.3,minY:0,minZ:-31,maxX:22.3,maxY:4,maxZ:-22,ramp:3},lifeguard:I(-27,0,-6,-24,2.6,-3),lifeguardRamp:{minX:-24,minY:0,minZ:-5.5,maxX:-17,maxY:2.6,maxZ:-3.5,ramp:2},west:-36,east:36,south:20};function Ce(e,t,n){return n<Se.seawallZ-.4&&t<.2&&e>Se.west-40&&e<Se.east+40}function we(e,t,n,r){return e.world.theme===`oldtown`?de(e,t,n,r):e.world.theme!==`harbor`||e.race.phase===`racing`||!Ce(t,n,r)?!1:(e.events.push({type:`splat`,x:t,y:.2,z:r}),!0)}var L=[{kind:`crate`,x:17,z:-13.1,w:1.1,d:1.1,h:.9},{kind:`crate`,x:18.15,z:-13.1,w:1,d:1,h:.75},{kind:`barrel`,x:16.1,z:-12.6,w:.8,d:.8,h:1},{kind:`barrel`,x:19.2,z:-12.9,w:.75,d:.75,h:.95}],Te={x:0,y:0,z:6},R=[{x:2,z:-8},{x:12,z:-4},{x:-16,z:-8},{x:-22,z:6},{x:16,z:4},{x:-4,z:12},{x:20,z:14}],Ee=[16747136,16765567,9425908,12185800,16230616,16773577,10467327,16757898];function De(){let e=Se,t=[],n=[],r=[],i=[[e.pier.minX,e.pier.maxX],[e.jetty.minX,e.jetty.maxX]],a=e.west;for(let[n,r]of i)t.push(I(a,0,e.seawallZ-.4,n,1,e.seawallZ)),a=r;t.push(I(a,0,e.seawallZ-.4,e.east,1,e.seawallZ)),t.push(I(e.west-4,0,e.seawallZ-.4,e.west,6,e.south+12)),t.push(I(e.east,0,e.seawallZ-.4,e.east+4,7,e.south+12));let o=0;for(let r=e.west;r<e.east-.1;o++){let i=[6,5,7,5.5,6.5][o%5],a=Math.min(e.east,r+i),s=[7,9,6,8,10,7.5][o%6];n.push({minX:r,minZ:e.south,maxX:a,maxZ:e.south+8,height:s,color:Ee[o%Ee.length],mansard:!1}),t.push(I(r,0,e.south,a,s,e.south+8)),r=a}let s=e.pier;t.push(I(s.minX,0,s.minZ,s.maxX,s.y,s.maxZ),e.pierRamp),t.push(I(s.minX,0,s.minZ,s.minX+.25,s.y+1,s.maxZ)),t.push(I(s.maxX-.25,0,s.minZ,s.maxX,s.y+1,s.boardFrom)),t.push(I(s.maxX-.25,0,s.boardTo,s.maxX,s.y+1,s.maxZ)),t.push(I(s.minX,0,s.minZ,s.maxX,s.y+1,s.minZ+.25));let c=e.boat;t.push(I(c.minX,0,c.minZ,c.maxX,c.y,c.maxZ)),t.push(I(c.maxX-.3,0,c.minZ,c.maxX,c.y+.8,c.maxZ)),t.push(I(c.minX,0,c.minZ,c.maxX,c.y+.8,c.minZ+.3)),t.push(I(c.minX,0,c.maxZ-.3,c.maxX,c.y+.8,c.maxZ)),t.push(I(c.minX+1,0,c.maxZ-3,c.maxX-.6,c.y+1.9,c.maxZ-.3));let l=e.jetty;t.push(I(l.minX,0,l.minZ,l.maxX,l.y,l.maxZ)),t.push(I(l.minX,0,l.minZ,l.minX+.3,l.y+1,l.maxZ)),t.push(I(l.maxX-.3,0,l.minZ,l.maxX,l.y+1,l.maxZ)),t.push(I(l.minX,0,l.minZ,l.maxX,l.y+1,l.minZ+.3));let u=e.lighthouse;t.push(I(u.x-u.half,0,u.z-u.half,u.x+u.half,u.height,u.z+u.half)),t.push(e.gallery,e.galleryRamp),t.push(I(l.minX,0,e.gallery.minZ,l.minX+.3,5,e.galleryRamp.maxZ)),t.push(I(e.gallery.maxX-.3,0,e.gallery.minZ,e.gallery.maxX,5,e.gallery.maxZ)),t.push(e.lifeguard,e.lifeguardRamp);for(let r of[-10,-2,6,14])n.push({minX:e.west,minZ:r-1.6,maxX:e.west+3,maxZ:r+1.6,height:2.8,color:Ee[(r+20)%8],mansard:!1}),t.push(I(e.west,0,r-1.6,e.west+3,2.8,r+1.6));for(let[e,n]of[[-31,-10],[-20,-10],[-14,0],[-30,10],[-20,13]])r.push({kind:`umbrella`,x:e,z:n}),t.push(I(e-.1,0,n-.1,e+.1,2.4,n+.1));for(let e of L)t.push(I(e.x-e.w/2,0,e.z-e.d/2,e.x+e.w/2,e.h,e.z+e.d/2));for(let e of[-12,4,14,30])r.push({kind:`palm`,x:e,z:-11.5}),t.push(I(e-.3,0,-11.8,e+.3,4,-11.2));for(let[e,n]of[[-1,-12],[9,-12],[18,16],[-8,17]])r.push({kind:`lamp`,x:e,z:n}),t.push(I(e-.15,0,n-.15,e+.15,3.6,n+.15));for(let e of[-12,2])r.push({kind:`bench`,x:e,z:0}),t.push(I(e-1,0,-.35,e+1,.5,.35));return{theme:`harbor`,half:620,solids:t,buildings:n,ramps:[e.pierRamp,e.galleryRamp,e.lifeguardRamp],platforms:[e.gallery,e.lifeguard],cars:[],props:r,plazaRadius:0}}var Oe=n([[160,10],[160,-60],[185,-120],[185,-190],[160,-250],[160,-320],[190,-370],[230,-370],[255,-330],[255,-260],[235,-200],[255,-140],[255,-60]],{jumps:[],optionalJump:null,gap:null,rampHeight:0,rampLength:0,rail:9,ringLift:0,air:{heights:[[0,2.2],[25,4],[60,10],[125,10.5],[150,4.6],[255,4.4],[285,12],[330,14],[390,12.5],[420,5],[470,3.4],[530,3.4],[560,6],[600,11],[700,10.5],[740,5.5],[762,4.5]],rings:[45,105,170,230,300,375,440,497,610,700],ringRadius:2.2}}),ke={parks:[[140,268],[405,560]],arch:505,cathedral:360},Ae=(e,t,n,r,i,a)=>({minX:e,minY:t,minZ:n,maxX:r,maxY:i,maxZ:a}),je=e=>ke.parks.some(([t,n])=>e>=t&&e<=n),Me=[16041098,16507828,15901832,16773590,14280888,16175008,15250592,16639904],Ne=null;function Pe(t=Oe){if(Ne)return Ne;let n=[],a=[],o=[],s=t.points.map(e=>e.x),c=t.points.map(e=>e.z),l=Math.min(...s)-30,u=Math.max(...s)+30,d=Math.min(...c)-30,f=Math.max(...c)+30,p=ke.arch,m=ke.cathedral,h=r(t,p),g=r(t,m),_={...Ae(g.x+g.dz*6-2.5,0,g.z-g.dx*6-2.5,g.x+g.dz*6+2.5,24,g.z-g.dx*6+2.5),d:m},v=11,y=()=>(v=v*16807%2147483647)/2147483647;for(let r=l;r<u;r+=9)for(let s=d;s<f;s+=9){let c=r+9/2,l=s+9/2,u=i(t,c,l);if(u.distance>27)continue;let d=1/0,f=1/0;for(let[n,a]of[[r,s],[r+9,s],[r,s+9],[r+9,s+9],[c,l],[c,s],[c,s+9],[r,l],[r+9,l]]){let r=i(t,n,a);d=Math.min(d,r.distance),f=Math.min(f,e(t,r.progress))}let m=u.progress,h=y();if(m<14&&d<16||m>t.length-10&&d<14||Math.hypot(c-_.minX-2.5,l-_.minZ-2.5)<9||Math.abs(m-p)<9&&d<14)continue;if(je(m)){d>=5&&h<.8&&a.push({x:c+(y()-.5)*3,z:l+(y()-.5)*3,s:.9+y()*.4,d:m});continue}let g=.5,v=Me[Math.floor(y()*Me.length)],b=g+(h<.5?.9:0),x=g+(h<.5?0:.9),S={minX:r+b,maxX:r+9-b,minZ:s+x,maxZ:s+9-x};if(d>=10.3)n.push({...S,height:9+Math.floor(h*5),color:v,roof:`gable`,d:m});else{let e=Math.min(S.maxX-S.minX,S.maxZ-S.minZ),t=Math.min(3,e*.4),r=Math.min(7,f-2.4-t*.85);if(r<3)continue;if(n.push({...S,height:Math.round(r*10)/10,color:v,roof:`gable`,d:m}),h<.35){let e=S.minX+1.2,n=S.minZ+1.2,i=Math.min(r+t+.6,f-1.2);i>r+.6&&o.push({...Ae(e-.45,r,n-.45,e+.45,i,n+.45),d:m})}}}let b=h.x,x=h.z,S=Math.abs(h.dx)>Math.abs(h.dz),C=e=>({x:b-h.dz*e,z:x+h.dx*e}),w=e=>{let t=C(e),n=S?1.6:1.3,r=S?1.3:1.6;return Ae(t.x-n,0,t.z-r,t.x+n,6.2,t.z+r)},T=C(-10.5),E=C(10.5),D=Ae(Math.min(T.x,E.x)-(S?1.8:0),6.2,Math.min(T.z,E.z)-(S?0:1.8),Math.max(T.x,E.x)+(S?1.8:0),8.2,Math.max(T.z,E.z)+(S?0:1.8)),O=[w(-8.7),w(8.7)],k=[];for(let e of n)k.push(Ae(e.minX,0,e.minZ,e.maxX,e.height,e.maxZ),...ve(e));for(let e of a)k.push(Ae(e.x-.3,0,e.z-.3,e.x+.3,3*e.s,e.z+.3),Ae(e.x-1.5*e.s,2.2*e.s,e.z-1.5*e.s,e.x+1.5*e.s,5.4*e.s,e.z+1.5*e.s));return k.push(...o,...O,D,_),Ne={houses:n,trees:a,arch:{piers:O,deck:D,d:p},cathedral:_,chimneys:o,solids:k},Ne}var Fe={bronze:1,silver:2,gold:3};function Ie(e,t){return t<=e.medals.gold?`gold`:t<=e.medals.silver?`silver`:`bronze`}function Le(e,t){let n=3*(e.air?e.air.rings.length:e.jumps.length-(e.optionalJump===null?0:1));return{gold:Math.ceil(e.length/(t*.85)-n),silver:Math.ceil(e.length/(t*.8)-n*.75)}}function Re(e,t){return Math.ceil(e.length/(t*.75)*1.3+e.length/70)}var ze={id:1,createWorld:ae,spawn:re,creatureSpawns:ie,hintSpawn:{x:30.9,z:-22.4},mission:N,tower:!0,race:{course:u,gate:{minX:2,maxX:9,minY:0,maxY:3.5,minZ:9.7,maxZ:10.1},trigger:{minX:2,maxX:9,minZ:7,maxZ:10.3},gateAt:{x:5.5,z:10},duration:Re(u,M.pitbike.maxSpeed),medals:Le(u,M.pitbike.maxSpeed)}},Be={1:ze,2:{id:2,createWorld:De,spawn:Te,creatureSpawns:R,mission:P,tower:!1,race:{course:d,gate:{minX:26,maxX:33,minY:0,maxY:3.5,minZ:9.7,maxZ:10.1},trigger:{minX:26,maxX:33,minZ:7,maxZ:10.3},gateAt:{x:29.5,z:10},duration:Re(d,M.scooter.maxSpeed),medals:Le(d,M.scooter.maxSpeed)}},3:{id:3,createWorld:()=>({...xe(),raceSolids:Pe(Oe).solids}),spawn:fe,creatureSpawns:pe,hintSpawn:me,mission:ee,tower:!1,bounds:{minX:se.west-6,maxX:se.east+6,minZ:se.north-6,maxZ:se.south+6},race:{course:Oe,gate:{minX:30,maxX:37,minY:0,maxY:3.5,minZ:9.7,maxZ:10.1},trigger:{minX:30,maxX:37,minZ:7,maxZ:10.3},gateAt:{x:33.5,z:10},duration:Re(Oe,M.drone.maxSpeed),medals:Le(Oe,M.drone.maxSpeed)}}},Ve=e=>Be[e]??ze;function He(e){return r(e.course,0)}function Ue(e=`locked`,t=60){return{phase:e,remaining:t,elapsed:0,bonus:0,stars:[],rings:[],points:0,hits:0,progress:0}}function We(e=0){return{mx:0,mz:0,aimYaw:e,jump:!1,sticky:!1,bouncy:!1,place:!1,toggleShape:!1,interact:!1,trick:!1,up:!1,down:!1}}var Ge=Ve(1).race;Ge.duration,Ge.gate;var Ke=e=>Ve(e.level).race;function qe(e){let t=e.garages[0];return!!t?.built&&M[t.vehicle].parts.every(e=>t.delivered.includes(e.id))}function Je(e){Ke(e)&&qe(e)&&e.race.phase===`locked`&&(e.race.phase=`open`)}function Ye(t){let n=Ke(t),r=t.players[0],i=t.vehicles.find(e=>e.id===r.riding);if(!n||!i||t.race.phase===`locked`)return;let a=He(n);t.status=`playing`,t.race=Ue(`racing`,n.duration),i.pos={x:a.x,y:e(n.course,0),z:a.z},i.vel={x:0,y:0,z:0},i.speed=0,i.yaw=a.yaw,r.pos={...i.pos},t.projectiles=[],t.pads=[],t.creatures.forEach(e=>{e.chatUntil=0,e.stuck=0,e.talk=0,e.slot=void 0}),nt(t,!0)}function Xe(e){let t=Ke(e);if(!t||e.race.phase!==`racing`||e.race.remaining<=0)return;let n=r(t.course,t.course.length);e.race.phase=`finished`,e.status=`won`,e.winTime=e.race.elapsed-e.race.bonus,e.events.push({type:`win`,x:n.x,y:1,z:n.z})}function Ze(e,t,n,r,i,a){e.race.phase===`racing`&&(e.race.bonus+=t,e.race.remaining+=t,e.events.push({type:`bonus`,x:n,y:r,z:i,who:e.players[0]?.id,info:`${a}:${t}`}))}function Qe(e,t,n){e.race.phase===`racing`&&t.dash&&!t.paid&&(t.paid=!0,e.race.hits++,Ze(e,n===`sticky`?1:2,t.pos.x,t.pos.y+1.4,t.pos.z,`hit`))}function $e(e,t){let n=Ke(e);if(!n)return;let r=e.players[0],a=n.trigger;if(r.riding!==null&&Je(e),e.race.phase===`open`&&r.riding!==null&&r.pos.z<a.maxZ&&r.pos.z>a.minZ&&r.pos.x>a.minX&&r.pos.x<a.maxX&&Ye(e),e.race.phase!==`racing`)return;if(e.race.elapsed+=t,e.race.remaining=Math.max(0,n.duration+e.race.bonus-e.race.elapsed),e.race.remaining<=0){e.race.phase=`failed`;return}nt(e);let o=e.vehicles.find(e=>e.id===r.riding);if(!o)return;tt(e,o.pos.x,o.pos.y+.5,o.pos.z);let s=i(n.course,o.pos.x,o.pos.z);et(e,s.progress,o.pos.x,o.pos.y+.6,o.pos.z),e.race.progress=s.progress,s.progress>=n.course.length-.01&&s.distance<n.course.rail+.5&&Xe(e)}function et(e,t,n,r,i){let a=Ke(e).course,o=l(a),c=e.race.progress,u=s(a);for(let a=0;a<o.length;a++){let s=o[a];c>=s.d||t<s.d||t-c>5||e.race.rings.includes(a)||(s.x-n)**2+(s.y-r)**2+(s.z-i)**2>u**2||(e.race.rings.push(a),Ze(e,3,s.x,s.y,s.z,`ring`))}}function tt(e,t,n,r){let i=o(Ke(e).course);for(let a=0;a<i.length;a++){let o=i[a];(o.x-t)**2+(o.y-n)**2+(o.z-r)**2>1.3**2||e.race.stars.includes(a)||(e.race.stars.push(a),e.events.push({type:`star`,x:o.x,y:o.y,z:o.z,who:e.players[0].id,info:o.high?`high`:`low`}))}}function nt(t,n=!1){let a=Ke(t).course,o=i(a,t.players[0].pos.x,t.players[0].pos.z).progress;if(!Number.isFinite(o))return;let s=Math.floor(o/70),c=(e,t)=>Math.max(8,Math.min(a.length-10,e*70+18+Math.floor(t/3)*19)),l=!!a.air,u=l?new A(t.world.raceSolids??[]):null;t.creatures.forEach((t,i)=>{let d=s-1+((i-(s-1))%3+3)%3;if(t.slot===d||!n&&t.slot!==void 0&&c(t.slot,i)>o-12)return;let f=c(d,i),p=r(a,f),m=Math.floor(i/3)===1,h=(d+i)%2?1:-1,g=l?m?h*3.6:((i*7+d*3)%5-2)*2.4:m?h*5.4:((i*7+d*3)%5-2)*1.7,_=p.x-p.dz*g,v=p.z+p.dx*g,y=u?u.groundAt(_,v,e(a,f)-1.5,.5):0;t.slot=d,t.pos={x:_,y,z:v},t.home={x:_,z:v},t.target={x:_,z:v},t.vel={x:0,y:0,z:0},t.stuck=0,t.chatUntil=0,t.talk=0,t.paid=!1,t.dash=m?l?{ax:_,az:v,bx:_,bz:v,toB:!1,bounce:!0}:{ax:_,az:v,bx:p.x+p.dz*h*2.2,bz:p.z-p.dx*h*2.2,toB:!1}:void 0})}var rt={x:26,z:-26,roof:22.1325,mid:11.57,liftX:30.9075},it=[.26,rt.mid,rt.roof];function at(e){return{minX:30.2,maxX:31.7,minZ:-26.8,maxZ:-25.2,minY:e-.2,maxY:e}}function ot(e,t,n){let r=e.elevator,i=e.players.filter(e=>Math.abs(e.pos.x-rt.liftX)<.7&&Math.abs(e.pos.z+26)<.7&&Math.abs(e.pos.y-r.y)<.3),a=e.players.find(e=>t[e.id]?.interact&&Math.hypot(e.pos.x-rt.liftX,e.pos.z+26)<3);a&&!i.includes(a)&&(r.target=it.reduce((e,t,n)=>Math.abs(t-a.pos.y)<Math.abs(it[e]-a.pos.y)?n:e,0)),r.wait>0&&(r.wait-=n),r.y===it[r.target]&&r.wait<=0&&(i.length||e.players.some(e=>t[e.id]?.interact&&Math.hypot(e.pos.x-rt.liftX,e.pos.z+26)<3))&&(r.target=(r.target+1)%it.length);let o=r.y,s=it[r.target];r.y+=Math.sign(s-r.y)*Math.min(Math.abs(s-r.y),n*3);for(let e of i)e.pos.y+=r.y-o,e.vel.y=0,e.grounded=!0;o!==r.y&&r.y===s&&(r.wait=3)}var st,ct,lt,ut,dt,ft,pt,mt,ht,gt=1e3,_t=1001,vt=1002,yt=1003,bt=1004,xt=1005,St=1006,Ct=1007,wt=1008,Tt=1009,Et=1010,Dt=1011,Ot=1012,kt=1013,At=1014,jt=1015,Mt=1016,Nt=1017,Pt=1018,Ft=1020,It=35902,Lt=35899,Rt=1021,zt=1022,Bt=1023,Vt=1026,Ht=1027,Ut=1028,Wt=1029,Gt=1030,Kt=1031,qt=1033,Jt=33776,Yt=33777,Xt=33778,Zt=33779,Qt=35840,$t=35841,en=35842,tn=35843,nn=36196,rn=37492,an=37496,on=37488,sn=37489,cn=37490,ln=37491,un=37808,dn=37809,fn=37810,pn=37811,mn=37812,hn=37813,gn=37814,_n=37815,vn=37816,yn=37817,bn=37818,xn=37819,Sn=37820,Cn=37821,wn=36492,Tn=36494,En=36495,Dn=36283,On=36284,kn=36285,An=36286,jn=2300,Mn=2301,Nn=2302,Pn=2303,Fn=2400,In=2401,Ln=2402,Rn=3200,zn=`srgb`,Bn=`srgb-linear`,Vn=`linear`,Hn=`srgb`,Un=7680,Wn=35044,Gn=2e3;function Kn(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function qn(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Jn(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Yn(){let e=Jn(`canvas`);return e.style.display=`block`,e}var Xn={};function Zn(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Qn(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function z(...e){e=Qn(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function B(...e){e=Qn(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function $n(...e){let t=e.join(` `);t in Xn||(Xn[t]=!0,z(...e))}function er(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var tr={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},nr=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},rr=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),ir=1234567,ar=Math.PI/180,or=180/Math.PI;function sr(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(rr[e&255]+rr[e>>8&255]+rr[e>>16&255]+rr[e>>24&255]+`-`+rr[t&255]+rr[t>>8&255]+`-`+rr[t>>16&15|64]+rr[t>>24&255]+`-`+rr[n&63|128]+rr[n>>8&255]+`-`+rr[n>>16&255]+rr[n>>24&255]+rr[r&255]+rr[r>>8&255]+rr[r>>16&255]+rr[r>>24&255]).toLowerCase()}function cr(e,t,n){return Math.max(t,Math.min(n,e))}function lr(e,t){return(e%t+t)%t}function ur(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function dr(e,t,n){return e===t?0:(n-e)/(t-e)}function fr(e,t,n){return(1-n)*e+n*t}function pr(e,t,n,r){return fr(e,t,1-Math.exp(-n*r))}function mr(e,t=1){return t-Math.abs(lr(e,t*2)-t)}function hr(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function gr(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function _r(e,t){return e+Math.floor(Math.random()*(t-e+1))}function vr(e,t){return e+Math.random()*(t-e)}function yr(e){return e*(.5-Math.random())}function br(e){e!==void 0&&(ir=e);let t=ir+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function xr(e){return e*ar}function Sr(e){return e*or}function Cr(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function wr(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Tr(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Er(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:z(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Dr(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function Or(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var kr={DEG2RAD:ar,RAD2DEG:or,generateUUID:sr,clamp:cr,euclideanModulo:lr,mapLinear:ur,inverseLerp:dr,lerp:fr,damp:pr,pingpong:mr,smoothstep:hr,smootherstep:gr,randInt:_r,randFloat:vr,randFloatSpread:yr,seededRandom:br,degToRad:xr,radToDeg:Sr,isPowerOfTwo:Cr,ceilPowerOfTwo:wr,floorPowerOfTwo:Tr,setQuaternionFromProperEuler:Er,normalize:Or,denormalize:Dr};pt=Symbol.iterator;var V=class{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=cr(this.x,e.x,t.x),this.y=cr(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=cr(this.x,e,t),this.y=cr(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(cr(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(cr(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[pt](){yield this.x,yield this.y}};st=V,st.prototype.isVector2=!0;var Ar=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:z(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(cr(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};mt=Symbol.iterator;var H=class{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Mr.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Mr.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=cr(this.x,e.x,t.x),this.y=cr(this.y,e.y,t.y),this.z=cr(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=cr(this.x,e,t),this.y=cr(this.y,e,t),this.z=cr(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(cr(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return jr.copy(this).projectOnVector(e),this.sub(jr)}reflect(e){return this.sub(jr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(cr(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[mt](){yield this.x,yield this.y,yield this.z}};ct=H,ct.prototype.isVector3=!0;var jr=new H,Mr=new Ar,Nr=class{constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return $n(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Pr.makeScale(e,t)),this}rotate(e){return $n(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Pr.makeRotation(-e)),this}translate(e,t){return $n(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Pr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};lt=Nr,lt.prototype.isMatrix3=!0;var Pr=new Nr,Fr=new Nr().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ir=new Nr().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Lr(){let e={enabled:!0,workingColorSpace:Bn,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=zr(e.r),e.g=zr(e.g),e.b=zr(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Br(e.r),e.g=Br(e.g),e.b=Br(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Vn:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return $n(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return $n(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Bn]:{primaries:t,whitePoint:r,transfer:Vn,toXYZ:Fr,fromXYZ:Ir,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:zn},outputColorSpaceConfig:{drawingBufferColorSpace:zn}},[zn]:{primaries:t,whitePoint:r,transfer:Hn,toXYZ:Fr,fromXYZ:Ir,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:zn}}}),e}var Rr=Lr();function zr(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Br(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Vr,Hr=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Vr===void 0&&(Vr=Jn(`canvas`)),Vr.width=e.width,Vr.height=e.height;let t=Vr.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Vr}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Jn(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=zr(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(zr(t[e]/255)*255):t[e]=zr(t[e]);return{data:t,width:e.width,height:e.height}}return z(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Ur=0,Wr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ur++}),this.uuid=sr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Gr(r[t].image)):e.push(Gr(r[t]))}else e=Gr(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Gr(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Hr.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(z(`Texture: Unable to serialize Texture.`),{})}var Kr=0,qr=new H,Jr=class e extends nr{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=_t,i=_t,a=St,o=wt,s=Bt,c=Tt,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Kr++}),this.uuid=sr(),this.name=``,this.source=new Wr(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new V(0,0),this.repeat=new V(1,1),this.center=new V(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Nr,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(qr).x}get height(){return this.source.getSize(qr).y}get depth(){return this.source.getSize(qr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){z(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?z(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case gt:e.x-=Math.floor(e.x);break;case _t:e.x=e.x<0?0:1;break;case vt:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case gt:e.y-=Math.floor(e.y);break;case _t:e.y=e.y<0?0:1;break;case vt:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Jr.DEFAULT_IMAGE=null,Jr.DEFAULT_MAPPING=300,Jr.DEFAULT_ANISOTROPY=1,ht=Symbol.iterator;var Yr=class{constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=cr(this.x,e.x,t.x),this.y=cr(this.y,e.y,t.y),this.z=cr(this.z,e.z,t.z),this.w=cr(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=cr(this.x,e,t),this.y=cr(this.y,e,t),this.z=cr(this.z,e,t),this.w=cr(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(cr(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[ht](){yield this.x,yield this.y,yield this.z,yield this.w}};ut=Yr,ut.prototype.isVector4=!0;var Xr=class extends nr{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:St,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Yr(0,0,e,t),this.scissorTest=!1,this.viewport=new Yr(0,0,e,t),this.textures=[];let r=new Jr({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:St,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Wr(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Zr=class extends Xr{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Qr=class extends Jr{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=yt,this.minFilter=yt,this.wrapR=_t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},$r=class extends Jr{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=yt,this.minFilter=yt,this.wrapR=_t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},ei=class e{constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/ti.setFromMatrixColumn(e,0).length(),i=1/ti.setFromMatrixColumn(e,1).length(),a=1/ti.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ri,e,ii)}lookAt(e,t,n){let r=this.elements;return si.subVectors(e,t),si.lengthSq()===0&&(si.z=1),si.normalize(),ai.crossVectors(n,si),ai.lengthSq()===0&&(Math.abs(n.z)===1?si.x+=1e-4:si.z+=1e-4,si.normalize(),ai.crossVectors(n,si)),ai.normalize(),oi.crossVectors(si,ai),r[0]=ai.x,r[4]=oi.x,r[8]=si.x,r[1]=ai.y,r[5]=oi.y,r[9]=si.y,r[2]=ai.z,r[6]=oi.z,r[10]=si.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],P=r[7],ee=r[11],te=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*P,i[8]=a*C+o*D+s*j+c*ee,i[12]=a*w+o*O+s*M+c*te,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*P,i[9]=l*C+u*D+d*j+f*ee,i[13]=l*w+u*O+d*M+f*te,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*P,i[10]=p*C+m*D+h*j+g*ee,i[14]=p*w+m*O+h*M+g*te,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*P,i[11]=_*C+v*D+y*j+b*ee,i[15]=_*w+v*O+y*M+b*te,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=ti.set(r[0],r[1],r[2]).length(),o=ti.set(r[4],r[5],r[6]).length(),s=ti.set(r[8],r[9],r[10]).length();i<0&&(a=-a),ni.copy(this);let c=1/a,l=1/o,u=1/s;return ni.elements[0]*=c,ni.elements[1]*=c,ni.elements[2]*=c,ni.elements[4]*=l,ni.elements[5]*=l,ni.elements[6]*=l,ni.elements[8]*=u,ni.elements[9]*=u,ni.elements[10]*=u,t.setFromRotationMatrix(ni),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Gn,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Gn,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};dt=ei,dt.prototype.isMatrix4=!0;var ti=new H,ni=new ei,ri=new H(0,0,0),ii=new H(1,1,1),ai=new H,oi=new H,si=new H,ci=new ei,li=new Ar,ui=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(cr(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-cr(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(cr(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-cr(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(cr(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-cr(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:z(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ci.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ci,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return li.setFromEuler(this),this.setFromQuaternion(li,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ui.DEFAULT_ORDER=`XYZ`;var di=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},fi=0,pi=new H,mi=new Ar,hi=new ei,gi=new H,_i=new H,vi=new H,yi=new Ar,bi=new H(1,0,0),xi=new H(0,1,0),Si=new H(0,0,1),Ci={type:`added`},wi={type:`removed`},Ti={type:`childadded`,child:null},Ei={type:`childremoved`,child:null},Di=class e extends nr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fi++}),this.uuid=sr(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new H,n=new ui,r=new Ar,i=new H(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ei},normalMatrix:{value:new Nr}}),this.matrix=new ei,this.matrixWorld=new ei,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new di,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return mi.setFromAxisAngle(e,t),this.quaternion.multiply(mi),this}rotateOnWorldAxis(e,t){return mi.setFromAxisAngle(e,t),this.quaternion.premultiply(mi),this}rotateX(e){return this.rotateOnAxis(bi,e)}rotateY(e){return this.rotateOnAxis(xi,e)}rotateZ(e){return this.rotateOnAxis(Si,e)}translateOnAxis(e,t){return pi.copy(e).applyQuaternion(this.quaternion),this.position.add(pi.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(bi,e)}translateY(e){return this.translateOnAxis(xi,e)}translateZ(e){return this.translateOnAxis(Si,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(hi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?gi.copy(e):gi.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),_i.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hi.lookAt(_i,gi,this.up):hi.lookAt(gi,_i,this.up),this.quaternion.setFromRotationMatrix(hi),r&&(hi.extractRotation(r.matrixWorld),mi.setFromRotationMatrix(hi),this.quaternion.premultiply(mi.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(B(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Ci),Ti.child=e,this.dispatchEvent(Ti),Ti.child=null):B(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(wi),Ei.child=e,this.dispatchEvent(Ei),Ei.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),hi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),hi.multiply(e.parent.matrixWorld)),e.applyMatrix4(hi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Ci),Ti.child=e,this.dispatchEvent(Ti),Ti.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_i,e,vi),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_i,yi,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};Di.DEFAULT_UP=new H(0,1,0),Di.DEFAULT_MATRIX_AUTO_UPDATE=!0,Di.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var U=class extends Di{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Oi={type:`move`},ki=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new U,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new U,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new U,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Oi)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new U;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Ai={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ji={h:0,s:0,l:0},Mi={h:0,s:0,l:0};function Ni(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var W=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=zn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Rr.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Rr.workingColorSpace){return this.r=e,this.g=t,this.b=n,Rr.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Rr.workingColorSpace){if(e=lr(e,1),t=cr(t,0,1),n=cr(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Ni(i,r,e+1/3),this.g=Ni(i,r,e),this.b=Ni(i,r,e-1/3)}return Rr.colorSpaceToWorking(this,r),this}setStyle(e,t=zn){function n(t){t!==void 0&&parseFloat(t)<1&&z(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:z(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);z(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=zn){let n=Ai[e.toLowerCase()];return n===void 0?z(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zr(e.r),this.g=zr(e.g),this.b=zr(e.b),this}copyLinearToSRGB(e){return this.r=Br(e.r),this.g=Br(e.g),this.b=Br(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=zn){return Rr.workingToColorSpace(Pi.copy(this),e),Math.round(cr(Pi.r*255,0,255))*65536+Math.round(cr(Pi.g*255,0,255))*256+Math.round(cr(Pi.b*255,0,255))}getHexString(e=zn){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Rr.workingColorSpace){Rr.workingToColorSpace(Pi.copy(this),t);let n=Pi.r,r=Pi.g,i=Pi.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Rr.workingColorSpace){return Rr.workingToColorSpace(Pi.copy(this),t),e.r=Pi.r,e.g=Pi.g,e.b=Pi.b,e}getStyle(e=zn){Rr.workingToColorSpace(Pi.copy(this),e);let t=Pi.r,n=Pi.g,r=Pi.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(ji),this.setHSL(ji.h+e,ji.s+t,ji.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ji),e.getHSL(Mi);let n=fr(ji.h,Mi.h,t),r=fr(ji.s,Mi.s,t),i=fr(ji.l,Mi.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Pi=new W;W.NAMES=Ai;var Fi=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new W(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Ii=class extends Di{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ui,this.environmentIntensity=1,this.environmentRotation=new ui,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Li=new H,Ri=new H,zi=new H,Bi=new H,Vi=new H,Hi=new H,Ui=new H,Wi=new H,Gi=new H,Ki=new H,qi=new Yr,Ji=new Yr,Yi=new Yr,Xi=class e{constructor(e=new H,t=new H,n=new H){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Li.subVectors(e,t),r.cross(Li);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Li.subVectors(r,t),Ri.subVectors(n,t),zi.subVectors(e,t);let a=Li.dot(Li),o=Li.dot(Ri),s=Li.dot(zi),c=Ri.dot(Ri),l=Ri.dot(zi),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Bi)!==null&&Bi.x>=0&&Bi.y>=0&&Bi.x+Bi.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Bi)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Bi.x),s.addScaledVector(a,Bi.y),s.addScaledVector(o,Bi.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return qi.setScalar(0),Ji.setScalar(0),Yi.setScalar(0),qi.fromBufferAttribute(e,t),Ji.fromBufferAttribute(e,n),Yi.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(qi,i.x),a.addScaledVector(Ji,i.y),a.addScaledVector(Yi,i.z),a}static isFrontFacing(e,t,n,r){return Li.subVectors(n,t),Ri.subVectors(e,t),Li.cross(Ri).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Li.subVectors(this.c,this.b),Ri.subVectors(this.a,this.b),Li.cross(Ri).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Vi.subVectors(r,n),Hi.subVectors(i,n),Wi.subVectors(e,n);let s=Vi.dot(Wi),c=Hi.dot(Wi);if(s<=0&&c<=0)return t.copy(n);Gi.subVectors(e,r);let l=Vi.dot(Gi),u=Hi.dot(Gi);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Vi,a);Ki.subVectors(e,i);let f=Vi.dot(Ki),p=Hi.dot(Ki);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Hi,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Ui.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Ui,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Vi,a).addScaledVector(Hi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Zi=class{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint($i.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint($i.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=$i.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,$i):$i.fromBufferAttribute(r,t),$i.applyMatrix4(e.matrixWorld),this.expandByPoint($i);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),ea.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),ea.copy(e.boundingBox)),ea.applyMatrix4(e.matrixWorld),this.union(ea)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,$i),$i.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(sa),ca.subVectors(this.max,sa),ta.subVectors(e.a,sa),na.subVectors(e.b,sa),ra.subVectors(e.c,sa),ia.subVectors(na,ta),aa.subVectors(ra,na),oa.subVectors(ta,ra);let t=[0,-ia.z,ia.y,0,-aa.z,aa.y,0,-oa.z,oa.y,ia.z,0,-ia.x,aa.z,0,-aa.x,oa.z,0,-oa.x,-ia.y,ia.x,0,-aa.y,aa.x,0,-oa.y,oa.x,0];return!da(t,ta,na,ra,ca)||(t=[1,0,0,0,1,0,0,0,1],!da(t,ta,na,ra,ca))?!1:(la.crossVectors(ia,aa),t=[la.x,la.y,la.z],da(t,ta,na,ra,ca))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,$i).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize($i).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Qi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Qi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Qi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Qi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Qi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Qi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Qi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Qi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Qi)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Qi=[new H,new H,new H,new H,new H,new H,new H,new H],$i=new H,ea=new Zi,ta=new H,na=new H,ra=new H,ia=new H,aa=new H,oa=new H,sa=new H,ca=new H,la=new H,ua=new H;function da(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){ua.fromArray(e,a);let o=i.x*Math.abs(ua.x)+i.y*Math.abs(ua.y)+i.z*Math.abs(ua.z),s=t.dot(ua),c=n.dot(ua),l=r.dot(ua);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var fa=new H,pa=new V,ma=0,ha=class extends nr{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ma++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Wn,this.updateRanges=[],this.gpuType=jt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)pa.fromBufferAttribute(this,t),pa.applyMatrix3(e),this.setXY(t,pa.x,pa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)fa.fromBufferAttribute(this,t),fa.applyMatrix3(e),this.setXYZ(t,fa.x,fa.y,fa.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)fa.fromBufferAttribute(this,t),fa.applyMatrix4(e),this.setXYZ(t,fa.x,fa.y,fa.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)fa.fromBufferAttribute(this,t),fa.applyNormalMatrix(e),this.setXYZ(t,fa.x,fa.y,fa.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)fa.fromBufferAttribute(this,t),fa.transformDirection(e),this.setXYZ(t,fa.x,fa.y,fa.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Dr(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Or(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Dr(t,this.array)),t}setX(e,t){return this.normalized&&(t=Or(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Dr(t,this.array)),t}setY(e,t){return this.normalized&&(t=Or(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Dr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Or(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Dr(t,this.array)),t}setW(e,t){return this.normalized&&(t=Or(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Or(t,this.array),n=Or(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=Or(t,this.array),n=Or(n,this.array),r=Or(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=Or(t,this.array),n=Or(n,this.array),r=Or(r,this.array),i=Or(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},ga=class extends ha{constructor(e,t,n){super(new Uint16Array(e),t,n)}},_a=class extends ha{constructor(e,t,n){super(new Uint32Array(e),t,n)}},va=class extends ha{constructor(e,t,n){super(new Float32Array(e),t,n)}},ya=new Zi,ba=new H,xa=new H,Sa=class{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?ya.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ba.subVectors(e,this.center);let t=ba.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(ba,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(xa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ba.copy(e.center).add(xa)),this.expandByPoint(ba.copy(e.center).sub(xa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Ca=0,wa=new ei,Ta=new Di,Ea=new H,Da=new Zi,Oa=new Zi,ka=new H,Aa=class e extends nr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ca++}),this.uuid=sr(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Kn(e)?_a:ga)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new Nr().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return wa.makeRotationFromQuaternion(e),this.applyMatrix4(wa),this}rotateX(e){return wa.makeRotationX(e),this.applyMatrix4(wa),this}rotateY(e){return wa.makeRotationY(e),this.applyMatrix4(wa),this}rotateZ(e){return wa.makeRotationZ(e),this.applyMatrix4(wa),this}translate(e,t,n){return wa.makeTranslation(e,t,n),this.applyMatrix4(wa),this}scale(e,t,n){return wa.makeScale(e,t,n),this.applyMatrix4(wa),this}lookAt(e){return Ta.lookAt(e),Ta.updateMatrix(),this.applyMatrix4(Ta.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ea).negate(),this.translate(Ea.x,Ea.y,Ea.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new va(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&z(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)B(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Da.setFromBufferAttribute(n),this.morphTargetsRelative?(ka.addVectors(this.boundingBox.min,Da.min),this.boundingBox.expandByPoint(ka),ka.addVectors(this.boundingBox.max,Da.max),this.boundingBox.expandByPoint(ka)):(this.boundingBox.expandByPoint(Da.min),this.boundingBox.expandByPoint(Da.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&B(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Sa);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)B(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new H,1/0);else if(e){let n=this.boundingSphere.center;if(Da.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Oa.setFromBufferAttribute(n),this.morphTargetsRelative?(ka.addVectors(Da.min,Oa.min),Da.expandByPoint(ka),ka.addVectors(Da.max,Oa.max),Da.expandByPoint(ka)):(Da.expandByPoint(Oa.min),Da.expandByPoint(Oa.max))}Da.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)ka.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(ka));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)ka.fromBufferAttribute(a,t),o&&(Ea.fromBufferAttribute(e,t),ka.add(Ea)),r=Math.max(r,n.distanceToSquared(ka))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&B(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){B(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new ha(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new H,s[e]=new H;let c=new H,l=new H,u=new H,d=new V,f=new V,p=new V,m=new H,h=new H;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new H,y=new H,b=new H,x=new H;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new ha(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new H,i=new H,a=new H,o=new H,s=new H,c=new H,l=new H,u=new H;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ka.fromBufferAttribute(e,t),ka.normalize(),e.setXYZ(t,ka.x,ka.y,ka.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new ha(a,r,i)}if(this.index===null)return z(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},ja=new H,Ma=new H,Na=new Nr,Pa=class{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=ja.subVectors(n,t).cross(Ma.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(ja),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Na.getNormalMatrix(e),r=this.coplanarPoint(ja).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Fa=0,Ia=class extends nr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Fa++}),this.uuid=sr(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new W(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Un,this.stencilZFail=Un,this.stencilZPass=Un,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){z(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?z(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new W().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Pa().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new V().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new V().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},La=new H,Ra=new H,za=new H,Ba=new H,Va=class{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,La)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=La.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(La.copy(this.origin).addScaledVector(this.direction,t),La.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Ra.copy(e).add(t).multiplyScalar(.5),za.copy(t).sub(e).normalize(),Ba.copy(this.origin).sub(Ra);let i=e.distanceTo(t)*.5,a=-this.direction.dot(za),o=Ba.dot(this.direction),s=-Ba.dot(za),c=Ba.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Ra).addScaledVector(za,d),f}intersectSphere(e,t){if(e.radius<0)return null;La.subVectors(e.center,this.origin);let n=La.dot(this.direction),r=La.dot(La)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,La)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let P=S/w,ee=C/w,te=1/w,ne=T-P*D,re=E-ee*D,ie=O-P*A,ae=k-ee*A,oe=j-P*N,F=M-ee*N,se=oe*ae-F*ie,ce=ne*F-re*oe,le=ie*re-ae*ne;if(r){if(se<0||ce<0||le<0)return null}else if((se<0||ce<0||le<0)&&(se>0||ce>0||le>0))return null;let ue=se+ce+le;if(ue===0)return null;let de=te*(se*D+ce*A+le*N);return(ue>0?de<0:de>0)?null:this.at(de/ue,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ha=class extends Ia{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new W(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ui,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Ua=new ei,Wa=new Va,Ga=new Sa,Ka=new H,qa=new H,Ja=new H,Ya=new H,Xa=new H,Za=new H,Qa=new H,$a=new H,G=class extends Di{constructor(e=new Aa,t=new Ha){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Za.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Xa.fromBufferAttribute(s,e),a?Za.addScaledVector(Xa,r):Za.addScaledVector(Xa.sub(t),r))}t.add(Za)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ga.copy(n.boundingSphere),Ga.applyMatrix4(i),Wa.copy(e.ray).recast(e.near),!(Ga.containsPoint(Wa.origin)===!1&&(Wa.intersectSphere(Ga,Ka)===null||Wa.origin.distanceToSquared(Ka)>(e.far-e.near)**2))&&(Ua.copy(i).invert(),Wa.copy(e.ray).applyMatrix4(Ua),(n.boundingBox===null||Wa.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Wa)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=to(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=to(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=to(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=to(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function eo(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;$a.copy(s),$a.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo($a);return l<n.near||l>n.far?null:{distance:l,point:$a.clone(),object:e}}function to(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,qa),e.getVertexPosition(c,Ja),e.getVertexPosition(l,Ya);let u=eo(e,t,n,r,qa,Ja,Ya,Qa);if(u){let e=new H;Xi.getBarycoord(Qa,qa,Ja,Ya,e),i&&(u.uv=Xi.getInterpolatedAttribute(i,s,c,l,e,new V)),a&&(u.uv1=Xi.getInterpolatedAttribute(a,s,c,l,e,new V)),o&&(u.normal=Xi.getInterpolatedAttribute(o,s,c,l,e,new H),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new H,materialIndex:0};Xi.getNormal(qa,Ja,Ya,t.normal),u.face=t,u.barycoord=e}return u}var no=class extends Jr{constructor(e=null,t=1,n=1,r,i,a,o,s,c=yt,l=yt,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},ro=class extends ha{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},io=new ei,ao=new ei,oo=[],so=new Zi,co=new ei,lo=new G,uo=new Sa,fo=class extends G{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ro(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,co)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Zi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,io),so.copy(e.boundingBox).applyMatrix4(io),this.boundingBox.union(so)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Sa),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,io),uo.copy(e.boundingSphere).applyMatrix4(io),this.boundingSphere.union(uo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(lo.geometry=this.geometry,lo.material=this.material,lo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),uo.copy(this.boundingSphere),uo.applyMatrix4(n),e.ray.intersectsSphere(uo)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,io),ao.multiplyMatrices(n,io),lo.matrixWorld=ao,lo.raycast(e,oo);for(let e=0,n=oo.length;e<n;e++){let n=oo[e];n.instanceId=i,n.object=this,t.push(n)}oo.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new ro(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new no(new Float32Array(r*this.count),r,this.count,Ut,jt));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},po=new Sa,mo=new V(.5,.5),ho=new H,go=class{constructor(e=new Pa,t=new Pa,n=new Pa,r=new Pa,i=new Pa,a=new Pa){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Gn,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),po.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),po.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(po)}intersectsSprite(e){return po.center.set(0,0,0),po.radius=.7071067811865476+mo.distanceTo(e.center),po.applyMatrix4(e.matrixWorld),this.intersectsSphere(po)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(ho.x=r.normal.x>0?e.max.x:e.min.x,ho.y=r.normal.y>0?e.max.y:e.min.y,ho.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ho)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},_o=class extends Jr{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},vo=class extends Jr{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},yo=class extends Jr{constructor(e,t,n=At,r,i,a,o=yt,s=yt,c,l=Vt,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Wr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},bo=class extends yo{constructor(e,t=At,n=301,r,i,a=yt,o=yt,s,c=Vt){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},xo=class extends Jr{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},So=class e extends Aa{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new va(c,3)),this.setAttribute(`normal`,new va(l,3)),this.setAttribute(`uv`,new va(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new H;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Co=class e extends Aa{constructor(e=1,t=1,n=4,r=8,i=1){super(),this.type=`CapsuleGeometry`,this.parameters={radius:e,height:t,capSegments:n,radialSegments:r,heightSegments:i},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),i=Math.max(1,Math.floor(i));let a=[],o=[],s=[],c=[],l=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+i,m=r+1,h=new H,g=new H;for(let _=0;_<=p;_++){let v=0,y=0,b=0,x=0;if(_<=n){let t=_/n,r=t*Math.PI/2;y=-l-e*Math.cos(r),b=e*Math.sin(r),x=-e*Math.cos(r),v=t*u}else if(_<=n+i){let r=(_-n)/i;y=-l+r*t,b=e,x=0,v=u+r*d}else{let t=(_-n-i)/n,r=t*Math.PI/2;y=l+e*Math.sin(r),b=e*Math.cos(r),x=e*Math.sin(r),v=u+d+t*u}let S=Math.max(0,Math.min(1,v/f)),C=0;_===0?C=.5/r:_===p&&(C=-.5/r);for(let e=0;e<=r;e++){let t=e/r,n=t*Math.PI*2,i=Math.sin(n),a=Math.cos(n);g.x=-b*a,g.y=y,g.z=b*i,o.push(g.x,g.y,g.z),h.set(-b*a,x,b*i),h.normalize(),s.push(h.x,h.y,h.z),c.push(t+C,S)}if(_>0){let e=(_-1)*m;for(let t=0;t<r;t++){let n=e+t,r=e+t+1,i=_*m+t,o=_*m+t+1;a.push(n,r,i),a.push(r,o,i)}}}this.setIndex(a),this.setAttribute(`position`,new va(o,3)),this.setAttribute(`normal`,new va(s,3)),this.setAttribute(`uv`,new va(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},wo=class e extends Aa{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new H,l=new V;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new va(a,3)),this.setAttribute(`normal`,new va(o,3)),this.setAttribute(`uv`,new va(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},To=class e extends Aa{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new va(u,3)),this.setAttribute(`normal`,new va(d,3)),this.setAttribute(`uv`,new va(f,2));function _(){let a=new H,_=new H,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new V,m=new H,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Eo=class e extends To{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Do=class e extends Aa{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new va(i,3)),this.setAttribute(`normal`,new va(i.slice(),3)),this.setAttribute(`uv`,new va(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new H,r=new H,i=new H;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new H;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new H;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new H,t=new H,n=new H,r=new H,o=new V,s=new V,c=new V;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},Oo=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){z(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new V:new H);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new H,r=[],i=[],a=[],o=new H,s=new ei;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new H)}i[0]=new H,a[0]=new H;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(cr(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(cr(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},ko=class extends Oo{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new V){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ao=class extends ko{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function jo(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Mo=new H,No=new H,Po=new jo,Fo=new jo,Io=new jo,Lo=class extends Oo{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new H){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(No.subVectors(r[0],r[1]).add(r[0]),c=No);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Mo.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Mo),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Po.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Fo.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),Io.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Po.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Fo.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),Io.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Po.calc(s),Fo.calc(s),Io.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new H().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Ro(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function zo(e,t){let n=1-e;return n*n*t}function Bo(e,t){return 2*(1-e)*e*t}function Vo(e,t){return e*e*t}function Ho(e,t,n,r){return zo(e,t)+Bo(e,n)+Vo(e,r)}function Uo(e,t){let n=1-e;return n*n*n*t}function Wo(e,t){let n=1-e;return 3*n*n*e*t}function Go(e,t){return 3*(1-e)*e*e*t}function Ko(e,t){return e*e*e*t}function qo(e,t,n,r,i){return Uo(e,t)+Wo(e,n)+Go(e,r)+Ko(e,i)}var Jo=class extends Oo{constructor(e=new V,t=new V,n=new V,r=new V){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new V){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(qo(e,r.x,i.x,a.x,o.x),qo(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Yo=class extends Oo{constructor(e=new H,t=new H,n=new H,r=new H){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new H){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(qo(e,r.x,i.x,a.x,o.x),qo(e,r.y,i.y,a.y,o.y),qo(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Xo=class extends Oo{constructor(e=new V,t=new V){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new V){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new V){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Zo=class extends Oo{constructor(e=new H,t=new H){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new H){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new H){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Qo=class extends Oo{constructor(e=new V,t=new V,n=new V){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new V){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Ho(e,r.x,i.x,a.x),Ho(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},$o=class extends Oo{constructor(e=new H,t=new H,n=new H){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new H){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(Ho(e,r.x,i.x,a.x),Ho(e,r.y,i.y,a.y),Ho(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},es=class extends Oo{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new V){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(Ro(o,s.x,c.x,l.x,u.x),Ro(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new V().fromArray(n))}return this}},ts=Object.freeze({__proto__:null,ArcCurve:Ao,CatmullRomCurve3:Lo,CubicBezierCurve:Jo,CubicBezierCurve3:Yo,EllipseCurve:ko,LineCurve:Xo,LineCurve3:Zo,QuadraticBezierCurve:Qo,QuadraticBezierCurve3:$o,SplineCurve:es}),ns=class extends Oo{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new ts[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new ts[n.type]().fromJSON(n))}return this}},rs=class extends ns{constructor(e){super(),this.type=`Path`,this.currentPoint=new V,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Xo(this.currentPoint.clone(),new V(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new Qo(this.currentPoint.clone(),new V(e,t),new V(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new Jo(this.currentPoint.clone(),new V(e,t),new V(n,r),new V(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new es([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new ko(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},is=class extends rs{constructor(e){super(e),this.uuid=sr(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new rs().fromJSON(n))}return this}};function as(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=os(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=ps(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return cs(a,o,n,s,c,l,0),o}function os(e,t,n,r,i){let a;if(i===Ls(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=Ps(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=Ps(i/r|0,e[i],e[i+1],a);return a&&Es(a,a.next)&&(Fs(a),a=a.next),a}function ss(e,t){if(!e)return e;t||(t=e);let n=e,r;do if(r=!1,!n.steiner&&(Es(n,n.next)||Ts(n.prev,n,n.next)===0)){if(Fs(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function cs(e,t,n,r,i,a,o){if(!e)return;!o&&a&&vs(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?us(e,r,i,a):ls(e))t.push(c.i,e.i,l.i),Fs(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=ds(ss(e),t),cs(e,t,n,r,i,a,2)):o===2&&fs(e,t,n,r,i,a):cs(ss(e),t,n,r,i,a,1);break}}}function ls(e){let t=e.prev,n=e,r=e.next;if(Ts(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&Cs(i,s,a,c,o,l,m.x,m.y)&&Ts(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function us(e,t,n,r){let i=e.prev,a=e,o=e.next;if(Ts(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=bs(p,m,t,n,r),v=bs(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Cs(s,u,c,d,l,f,y.x,y.y)&&Ts(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Cs(s,u,c,d,l,f,b.x,b.y)&&Ts(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Cs(s,u,c,d,l,f,y.x,y.y)&&Ts(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Cs(s,u,c,d,l,f,b.x,b.y)&&Ts(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function ds(e,t){let n=e;do{let r=n.prev,i=n.next.next;!Es(r,i)&&Ds(r,n,n.next,i)&&js(r,i)&&js(i,r)&&(t.push(r.i,n.i,i.i),Fs(n),Fs(n.next),n=e=i),n=n.next}while(n!==e);return ss(n)}function fs(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&ws(o,e)){let s=Ns(o,e);o=ss(o,o.next),s=ss(s,s.next),cs(o,t,n,r,i,a,0),cs(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function ps(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=os(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(xs(o))}i.sort(ms);for(let e=0;e<i.length;e++)n=hs(i[e],n);return n}function ms(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function hs(e,t){let n=gs(e,t);if(!n)return t;let r=Ns(n,e);return ss(r,r.next),ss(n,n.next)}function gs(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(Es(e,n))return n;do{if(Es(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&Ss(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);js(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&_s(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function _s(e,t){return Ts(e.prev,e,t.prev)<0&&Ts(t.next,e,e.next)<0}function vs(e,t,n,r){let i=e;do i.z===0&&(i.z=bs(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,ys(i)}function ys(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function bs(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function xs(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function Ss(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function Cs(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&Ss(e,t,n,r,i,a,o,s)}function ws(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!As(e,t)&&(js(e,t)&&js(t,e)&&Ms(e,t)&&(Ts(e.prev,e,t.prev)||Ts(e,t.prev,t))||Es(e,t)&&Ts(e.prev,e,e.next)>0&&Ts(t.prev,t,t.next)>0)}function Ts(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function Es(e,t){return e.x===t.x&&e.y===t.y}function Ds(e,t,n,r){let i=ks(Ts(e,t,n)),a=ks(Ts(e,t,r)),o=ks(Ts(n,r,e)),s=ks(Ts(n,r,t));return!!(i!==a&&o!==s||i===0&&Os(e,n,t)||a===0&&Os(e,r,t)||o===0&&Os(n,e,r)||s===0&&Os(n,t,r))}function Os(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function ks(e){return e>0?1:e<0?-1:0}function As(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&Ds(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function js(e,t){return Ts(e.prev,e,e.next)<0?Ts(e,t,e.next)>=0&&Ts(e,e.prev,t)>=0:Ts(e,t,e.prev)<0||Ts(e,e.next,t)<0}function Ms(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Ns(e,t){let n=Is(e.i,e.x,e.y),r=Is(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function Ps(e,t,n,r){let i=Is(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Fs(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function Is(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Ls(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var Rs=class{static triangulate(e,t,n=2){return as(e,t,n)}},zs=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];Bs(e),Vs(n,e);let a=e.length;t.forEach(Bs);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,Vs(n,t[e]);let o=Rs.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function Bs(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function Vs(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var Hs=class e extends Aa{constructor(e=new is([new V(.5,.5),new V(-.5,.5),new V(-.5,-.5),new V(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new va(r,3)),this.setAttribute(`uv`,new va(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?Us:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new H,b=new H,x=new H}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!zs.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];zs.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));s<=10000000000000001e-36*c*c?(e.splice(r,1),n--):t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function O(e,t,n){return t||B(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let k=C.length;function A(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new V(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new V(r/a,i/a)}let j=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),j[e]=A(D[e],D[n],D[r]);let M=[],N,P=j.concat();for(let e=0,t=E;e<t;e++){let t=w[e];N=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),N[e]=A(t[e],t[r],t[i]);M.push(N),P=P.concat(N)}let ee;if(p===0)ee=zs.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=O(D[t],j[t],a);oe(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];N=M[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=O(n[e],N[e],a);oe(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}ee=zs.triangulateShape(e,t)}let te=ee.length,ne=d+f;for(let e=0;e<k;e++){let t=l?O(C[e],P[e],ne):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),oe(x.x,x.y,x.z)):oe(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<k;t++){let n=l?O(C[t],P[t],ne):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),oe(x.x,x.y,x.z)):oe(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=O(D[e],j[e],r);oe(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];N=M[e];for(let e=0,i=t.length;e<i;e++){let i=O(t[e],N[e],r);_?oe(i.x,i.y+g[s-1].y,g[s-1].x+n):oe(i.x,i.y,c+n)}}}re(),ie();function re(){let e=r.length/3;if(l){let e=0,t=k*e;for(let e=0;e<te;e++){let n=ee[e];F(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=k*e;for(let e=0;e<te;e++){let n=ee[e];F(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<te;e++){let t=ee[e];F(t[2],t[1],t[0])}for(let e=0;e<te;e++){let t=ee[e];F(t[0]+k*s,t[1]+k*s,t[2]+k*s)}}n.addGroup(e,r.length/3-e,0)}function ie(){let e=r.length/3,t=0;ae(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];ae(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function ae(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=k*e,a=k*(e+1);se(t+r+n,t+i+n,t+i+a,t+r+a)}}}function oe(e,t,n){a.push(e),a.push(t),a.push(n)}function F(e,t,i){ce(e),ce(t),ce(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);le(o[0]),le(o[1]),le(o[2])}function se(e,t,i,a){ce(e),ce(t),ce(a),ce(t),ce(i),ce(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);le(s[0]),le(s[1]),le(s[3]),le(s[1]),le(s[2]),le(s[3])}function ce(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function le(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Ws(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new ts[i.type]().fromJSON(i)),new e(r,t.options)}},Us={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new V(a,o),new V(s,c),new V(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new V(o,1-c),new V(l,1-d),new V(f,1-m),new V(h,1-_)]:[new V(s,1-c),new V(u,1-d),new V(p,1-m),new V(g,1-_)]}};function Ws(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var Gs=class e extends Do{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Ks=class e extends Aa{constructor(e=[new V(0,-.5),new V(.5,0),new V(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=cr(r,0,Math.PI*2);let i=[],a=[],o=[],s=[],c=[],l=1/t,u=new H,d=new V,f=new H,p=new H,m=new H,h=0,g=0;for(let t=0;t<=e.length-1;t++)switch(t){case 0:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,m.copy(f),f.normalize(),s.push(f.x,f.y,f.z);break;case e.length-1:s.push(m.x,m.y,m.z);break;default:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),s.push(f.x,f.y,f.z),m.copy(p)}for(let i=0;i<=t;i++){let f=n+i*l*r,p=Math.sin(f),m=Math.cos(f);for(let n=0;n<=e.length-1;n++){u.x=e[n].x*p,u.y=e[n].y,u.z=e[n].x*m,a.push(u.x,u.y,u.z),d.x=i/t,d.y=n/(e.length-1),o.push(d.x,d.y);let r=s[3*n+0]*p,l=s[3*n+1],f=s[3*n+0]*m;c.push(r,l,f)}}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(s,c,o)}this.setIndex(i),this.setAttribute(`position`,new va(a,3)),this.setAttribute(`uv`,new va(o,2)),this.setAttribute(`normal`,new va(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.points,t.segments,t.phiStart,t.phiLength)}},qs=class e extends Aa{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new va(p,3)),this.setAttribute(`normal`,new va(m,3)),this.setAttribute(`uv`,new va(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Js=class e extends Aa{constructor(e=new is([new V(0,.5),new V(-.5,-.5),new V(.5,-.5)]),t=12){super(),this.type=`ShapeGeometry`,this.parameters={shapes:e,curveSegments:t};let n=[],r=[],i=[],a=[],o=0,s=0;if(Array.isArray(e)===!1)c(e);else for(let t=0;t<e.length;t++)c(e[t]),this.addGroup(o,s,t),o+=s,s=0;this.setIndex(n),this.setAttribute(`position`,new va(r,3)),this.setAttribute(`normal`,new va(i,3)),this.setAttribute(`uv`,new va(a,2));function c(e){let o=r.length/3,c=e.extractPoints(t),l=c.shape,u=c.holes;zs.isClockWise(l)===!1&&(l=l.reverse());for(let e=0,t=u.length;e<t;e++){let t=u[e];zs.isClockWise(t)===!0&&(u[e]=t.reverse())}let d=zs.triangulateShape(l,u);for(let e=0,t=u.length;e<t;e++){let t=u[e];l=l.concat(t)}for(let e=0,t=l.length;e<t;e++){let t=l[e];r.push(t.x,t.y,0),i.push(0,0,1),a.push(t.x,t.y)}for(let e=0,t=d.length;e<t;e++){let t=d[e],r=t[0]+o,i=t[1]+o,a=t[2]+o;n.push(r,i,a),s+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Ys(t,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}return new e(r,t.curveSegments)}};function Ys(e,t){if(t.shapes=[],Array.isArray(e))for(let n=0,r=e.length;n<r;n++){let r=e[n];t.shapes.push(r.uuid)}else t.shapes.push(e.uuid);return t}var Xs=class e extends Aa{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new H,d=new H,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new va(p,3)),this.setAttribute(`normal`,new va(m,3)),this.setAttribute(`uv`,new va(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Zs=class e extends Aa{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new H,f=new H,p=new H;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new va(c,3)),this.setAttribute(`normal`,new va(l,3)),this.setAttribute(`uv`,new va(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}},Qs=class e extends Aa{constructor(e=new $o(new H(-1,-1,0),new H(-1,1,0),new H(1,1,0)),t=64,n=1,r=8,i=!1){super(),this.type=`TubeGeometry`,this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:r,closed:i};let a=e.computeFrenetFrames(t,i);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new H,s=new H,c=new V,l=new H,u=[],d=[],f=[],p=[];m(),this.setIndex(p),this.setAttribute(`position`,new va(u,3)),this.setAttribute(`normal`,new va(d,3)),this.setAttribute(`uv`,new va(f,2));function m(){for(let e=0;e<t;e++)h(e);h(i===!1?t:0),_(),g()}function h(i){l=e.getPointAt(i/t,l);let c=a.normals[i],f=a.binormals[i];for(let e=0;e<=r;e++){let t=e/r*Math.PI*2,i=Math.sin(t),a=-Math.cos(t);s.x=a*c.x+i*f.x,s.y=a*c.y+i*f.y,s.z=a*c.z+i*f.z,s.normalize(),d.push(s.x,s.y,s.z),o.x=l.x+n*s.x,o.y=l.y+n*s.y,o.z=l.z+n*s.z,u.push(o.x,o.y,o.z)}}function g(){for(let e=1;e<=t;e++)for(let t=1;t<=r;t++){let n=(r+1)*(e-1)+(t-1),i=(r+1)*e+(t-1),a=(r+1)*e+t,o=(r+1)*(e-1)+t;p.push(n,i,o),p.push(i,a,o)}}function _(){for(let e=0;e<=t;e++)for(let n=0;n<=r;n++)c.x=e/t,c.y=n/r,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(t){return new e(new ts[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function $s(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(tc(i))i.isRenderTargetTexture?(z(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(tc(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function ec(e){let t={};for(let n=0;n<e.length;n++){let r=$s(e[n]);for(let e in r)t[e]=r[e]}return t}function tc(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function nc(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function rc(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Rr.workingColorSpace}var ic={clone:$s,merge:ec},ac=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,oc=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,sc=class extends Ia{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ac,this.fragmentShader=oc,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=$s(e.uniforms),this.uniformsGroups=nc(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new W().setHex(r.value);break;case`v2`:this.uniforms[n].value=new V().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new H().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Yr().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new Nr().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new ei().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},cc=class extends sc{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},lc=class extends Ia{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new W(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new W(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new V(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ui,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},uc=class extends lc{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new V(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return cr(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new W(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new W(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new W(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},dc=class extends Ia{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new W(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new W(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new V(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ui,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},fc=class extends Ia{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Rn,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},pc=class extends Ia{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function mc(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function hc(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var gc=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},_c=class extends gc{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Fn,endingEnd:Fn}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case In:i=e,o=2*t-n;break;case Ln:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case In:a=e,s=2*n-t;break;case Ln:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},vc=class extends gc{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},yc=class extends gc{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},bc=class extends gc{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Cc(n,t,g,y,r);i[p]=xc(x,o,_,b,m)}return i}};function xc(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Sc(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Cc(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=xc(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Sc(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var wc=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=mc(t,this.TimeBufferType),this.values=mc(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:mc(e.times,Array),values:mc(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),hc(e.settings)&&(n.settings={inTangents:mc(e.settings.inTangents,Array),outTangents:mc(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new yc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new vc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new _c(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new bc(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case jn:t=this.InterpolantFactoryMethodDiscrete;break;case Mn:t=this.InterpolantFactoryMethodLinear;break;case Nn:t=this.InterpolantFactoryMethodSmooth;break;case Pn:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return z(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return jn;case this.InterpolantFactoryMethodLinear:return Mn;case this.InterpolantFactoryMethodSmooth:return Nn;case this.InterpolantFactoryMethodBezier:return Pn}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;hc(this.settings)&&(Tc(this.settings.inTangents,e),Tc(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(B(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(B(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){B(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){B(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&qn(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){B(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Nn,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,hc(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Tc(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}wc.prototype.ValueTypeName=``,wc.prototype.TimeBufferType=Float32Array,wc.prototype.ValueBufferType=Float32Array,wc.prototype.DefaultInterpolation=Mn;var Ec=class extends wc{constructor(e,t,n){super(e,t,n)}};Ec.prototype.ValueTypeName=`bool`,Ec.prototype.ValueBufferType=Array,Ec.prototype.DefaultInterpolation=jn,Ec.prototype.InterpolantFactoryMethodLinear=void 0,Ec.prototype.InterpolantFactoryMethodSmooth=void 0;var Dc=class extends wc{constructor(e,t,n,r){super(e,t,n,r)}};Dc.prototype.ValueTypeName=`color`;var Oc=class extends wc{constructor(e,t,n,r){super(e,t,n,r)}};Oc.prototype.ValueTypeName=`number`;var kc=class extends gc{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Ar.slerpFlat(i,0,a,c-o,a,c,s);return i}},Ac=class extends wc{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new kc(this.times,this.values,this.getValueSize(),e)}};Ac.prototype.ValueTypeName=`quaternion`,Ac.prototype.InterpolantFactoryMethodSmooth=void 0;var jc=class extends wc{constructor(e,t,n){super(e,t,n)}};jc.prototype.ValueTypeName=`string`,jc.prototype.ValueBufferType=Array,jc.prototype.DefaultInterpolation=jn,jc.prototype.InterpolantFactoryMethodLinear=void 0,jc.prototype.InterpolantFactoryMethodSmooth=void 0;var Mc=class extends wc{constructor(e,t,n,r){super(e,t,n,r)}};Mc.prototype.ValueTypeName=`vector`;var Nc=class extends Di{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new W(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Pc=class extends Nc{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(Di.DEFAULT_UP),this.updateMatrix(),this.groundColor=new W(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Fc=new ei,Ic=new H,Lc=new H,Rc=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new V(512,512),this.mapType=Tt,this.map=null,this.mapPass=null,this.matrix=new ei,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new go,this._frameExtents=new V(1,1),this._viewportCount=1,this._viewports=[new Yr(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Ic.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ic),Lc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Lc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Fc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Fc,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Fc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},zc=new H,Bc=new Ar,Vc=new H,Hc=class extends Di{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new ei,this.projectionMatrix=new ei,this.projectionMatrixInverse=new ei,this.coordinateSystem=Gn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(zc,Bc,Vc),Vc.x===1&&Vc.y===1&&Vc.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(zc,Bc,Vc.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(zc,Bc,Vc),Vc.x===1&&Vc.y===1&&Vc.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(zc,Bc,Vc.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Uc=new H,Wc=new V,Gc=new V,Kc=class extends Hc{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=or*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ar*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return or*2*Math.atan(Math.tan(ar*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Uc.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Uc.x,Uc.y).multiplyScalar(-e/Uc.z),Uc.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Uc.x,Uc.y).multiplyScalar(-e/Uc.z)}getViewSize(e,t){return this.getViewBounds(e,Wc,Gc),t.subVectors(Gc,Wc)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ar*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},qc=class extends Rc{constructor(){super(new Kc(90,1,.5,500)),this.isPointLightShadow=!0}},Jc=class extends Nc{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new qc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Yc=class extends Hc{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Xc=class extends Rc{constructor(){super(new Yc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Zc=class extends Nc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Di.DEFAULT_UP),this.updateMatrix(),this.target=new Di,this.shadow=new Xc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Qc=-90,$c=1,el=class extends Di{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Kc(Qc,$c,e,t);r.layers=this.layers,this.add(r);let i=new Kc(Qc,$c,e,t);i.layers=this.layers,this.add(i);let a=new Kc(Qc,$c,e,t);a.layers=this.layers,this.add(a);let o=new Kc(Qc,$c,e,t);o.layers=this.layers,this.add(o);let s=new Kc(Qc,$c,e,t);s.layers=this.layers,this.add(s);let c=new Kc(Qc,$c,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},tl=class extends Kc{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},nl=`\\[\\]\\.:\\/`,rl=RegExp(`[\\[\\]\\.:\\/]`,`g`),il=`[^\\[\\]\\.:\\/]`,al=`[^`+nl.replace(`\\.`,``)+`]`,ol=`((?:WC+[\\/:])*)`.replace(`WC`,il),sl=`(WCOD+)?`.replace(`WCOD`,al),cl=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,il),ll=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,il),ul=RegExp(`^`+ol+sl+cl+ll+`$`),dl=[`material`,`materials`,`bones`,`map`],fl=class{constructor(e,t,n){let r=n||pl.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},pl=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(rl,``)}static parseTrackName(e){let t=ul.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);dl.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){z(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){B(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){B(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){B(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){B(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){B(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){B(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){B(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;B(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){B(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){B(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};pl.Composite=fl,pl.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},pl.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},pl.prototype.GetterByBindingType=[pl.prototype._getValue_direct,pl.prototype._getValue_array,pl.prototype._getValue_arrayElement,pl.prototype._getValue_toArray],pl.prototype.SetterByBindingTypeAndVersioning=[[pl.prototype._setValue_direct,pl.prototype._setValue_direct_setNeedsUpdate,pl.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[pl.prototype._setValue_array,pl.prototype._setValue_array_setNeedsUpdate,pl.prototype._setValue_array_setMatrixWorldNeedsUpdate],[pl.prototype._setValue_arrayElement,pl.prototype._setValue_arrayElement_setNeedsUpdate,pl.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[pl.prototype._setValue_fromArray,pl.prototype._setValue_fromArray_setNeedsUpdate,pl.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var ml=new ei,hl=class{constructor(e,t,n=0,r=1/0){this.ray=new Va(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new di,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):B(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return ml.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ml),this}intersectObject(e,t=!0,n=[]){return _l(e,this,n,t),n.sort(gl),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)_l(e[r],this,n,t);return n.sort(gl),n}};function gl(e,t){return e.distance-t.distance}function _l(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)_l(r[e],t,n,!0)}}ft=class{constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}},ft.prototype.isMatrix2=!0;function vl(e,t,n,r){let i=yl(r);switch(n){case Rt:return e*t;case Ut:return e*t/i.components*i.byteLength;case Wt:return e*t/i.components*i.byteLength;case Gt:return e*t*2/i.components*i.byteLength;case Kt:return e*t*2/i.components*i.byteLength;case zt:return e*t*3/i.components*i.byteLength;case Bt:return e*t*4/i.components*i.byteLength;case qt:return e*t*4/i.components*i.byteLength;case Jt:case Yt:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Xt:case Zt:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case $t:case tn:return Math.max(e,16)*Math.max(t,8)/4;case Qt:case en:return Math.max(e,8)*Math.max(t,8)/2;case nn:case rn:case on:case sn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case an:case cn:case ln:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case un:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case dn:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case fn:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case pn:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case mn:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case hn:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case gn:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case _n:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case vn:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case yn:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case bn:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case xn:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Sn:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Cn:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case wn:case Tn:case En:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Dn:case On:return Math.ceil(e/4)*Math.ceil(t/4)*8;case kn:case An:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function yl(e){switch(e){case Tt:case Et:return{byteLength:1,components:1};case Ot:case Dt:case Mt:return{byteLength:2,components:1};case Nt:case Pt:return{byteLength:2,components:4};case At:case kt:case jt:return{byteLength:4,components:1};case It:case Lt:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?z(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function bl(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function xl(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Sl={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},K={common:{diffuse:{value:new W(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Nr},alphaMap:{value:null},alphaMapTransform:{value:new Nr},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Nr}},envmap:{envMap:{value:null},envMapRotation:{value:new Nr},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Nr}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Nr}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Nr},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Nr},normalScale:{value:new V(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Nr},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Nr}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Nr}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Nr}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new W(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new H},probesMax:{value:new H},probesResolution:{value:new H}},points:{diffuse:{value:new W(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Nr},alphaTest:{value:0},uvTransform:{value:new Nr}},sprite:{diffuse:{value:new W(16777215)},opacity:{value:1},center:{value:new V(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Nr},alphaMap:{value:null},alphaMapTransform:{value:new Nr},alphaTest:{value:0}}},Cl={basic:{uniforms:ec([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.fog]),vertexShader:Sl.meshbasic_vert,fragmentShader:Sl.meshbasic_frag},lambert:{uniforms:ec([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new W(0)},envMapIntensity:{value:1}}]),vertexShader:Sl.meshlambert_vert,fragmentShader:Sl.meshlambert_frag},phong:{uniforms:ec([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new W(0)},specular:{value:new W(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Sl.meshphong_vert,fragmentShader:Sl.meshphong_frag},standard:{uniforms:ec([K.common,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.roughnessmap,K.metalnessmap,K.fog,K.lights,{emissive:{value:new W(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Sl.meshphysical_vert,fragmentShader:Sl.meshphysical_frag},toon:{uniforms:ec([K.common,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.gradientmap,K.fog,K.lights,{emissive:{value:new W(0)}}]),vertexShader:Sl.meshtoon_vert,fragmentShader:Sl.meshtoon_frag},matcap:{uniforms:ec([K.common,K.bumpmap,K.normalmap,K.displacementmap,K.fog,{matcap:{value:null}}]),vertexShader:Sl.meshmatcap_vert,fragmentShader:Sl.meshmatcap_frag},points:{uniforms:ec([K.points,K.fog]),vertexShader:Sl.points_vert,fragmentShader:Sl.points_frag},dashed:{uniforms:ec([K.common,K.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Sl.linedashed_vert,fragmentShader:Sl.linedashed_frag},depth:{uniforms:ec([K.common,K.displacementmap]),vertexShader:Sl.depth_vert,fragmentShader:Sl.depth_frag},normal:{uniforms:ec([K.common,K.bumpmap,K.normalmap,K.displacementmap,{opacity:{value:1}}]),vertexShader:Sl.meshnormal_vert,fragmentShader:Sl.meshnormal_frag},sprite:{uniforms:ec([K.sprite,K.fog]),vertexShader:Sl.sprite_vert,fragmentShader:Sl.sprite_frag},background:{uniforms:{uvTransform:{value:new Nr},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Sl.background_vert,fragmentShader:Sl.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Nr}},vertexShader:Sl.backgroundCube_vert,fragmentShader:Sl.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Sl.cube_vert,fragmentShader:Sl.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Sl.equirect_vert,fragmentShader:Sl.equirect_frag},distance:{uniforms:ec([K.common,K.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Sl.distance_vert,fragmentShader:Sl.distance_frag},shadow:{uniforms:ec([K.lights,K.fog,{color:{value:new W(0)},opacity:{value:1}}]),vertexShader:Sl.shadow_vert,fragmentShader:Sl.shadow_frag}};Cl.physical={uniforms:ec([Cl.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Nr},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Nr},clearcoatNormalScale:{value:new V(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Nr},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Nr},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Nr},sheen:{value:0},sheenColor:{value:new W(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Nr},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Nr},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Nr},transmissionSamplerSize:{value:new V},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Nr},attenuationDistance:{value:0},attenuationColor:{value:new W(0)},specularColor:{value:new W(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Nr},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Nr},anisotropyVector:{value:new V},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Nr}}]),vertexShader:Sl.meshphysical_vert,fragmentShader:Sl.meshphysical_frag};var wl={r:0,b:0,g:0},Tl=new ei,El=new Nr;El.set(-1,0,0,0,1,0,0,0,1);function Dl(e,t,n,r,i,a){let o=new W(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new G(new So(1,1,1),new sc({name:`BackgroundCubeMaterial`,uniforms:$s(Cl.backgroundCube.uniforms),vertexShader:Cl.backgroundCube.vertexShader,fragmentShader:Cl.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Tl.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(El),l.material.toneMapped=Rr.getTransfer(i.colorSpace)!==Hn,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new G(new qs(2,2),new sc({name:`BackgroundMaterial`,uniforms:$s(Cl.background.uniforms),vertexShader:Cl.background.vertexShader,fragmentShader:Cl.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Rr.getTransfer(i.colorSpace)!==Hn,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(wl,rc(e)),n.buffers.color.setClear(wl.r,wl.g,wl.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Ol(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function kl(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Al(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(z(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&z(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function jl(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Pa,s=new Nr,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Ml=4,Nl=6,Pl=20,Fl=256,Il=new Yc,Ll=new W,Rl=null,zl=0,Bl=0,Vl=!1,Hl=new H,Ul=new H,Wl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Hl}=i;Rl=this._renderer.getRenderTarget(),zl=this._renderer.getActiveCubeFace(),Bl=this._renderer.getActiveMipmapLevel(),Vl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Zl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Rl,zl,Bl),this._renderer.xr.enabled=Vl,e.scissorTest=!1,ql(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Rl=this._renderer.getRenderTarget(),zl=this._renderer.getActiveCubeFace(),Bl=this._renderer.getActiveMipmapLevel(),Vl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:St,minFilter:St,generateMipmaps:!1,type:Mt,format:Bt,colorSpace:Bn,depthBuffer:!1},r=Kl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Kl(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Gl(r)),this._blurMaterial=Yl(r,e,t),this._ggxMaterial=Jl(r,e,t)}return r}_compileMaterial(e){let t=new G(new Aa,e);this._renderer.compile(t,Il)}_sceneToCubeUV(e,t,n,r,i){let a=new Kc(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Ll),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new G(new So,new Ha({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Ll),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;ql(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Zl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xl());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;ql(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Il)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Ml?n-d+Ml:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,ql(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Il),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,ql(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Il)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];ql(t,3*l*(r>this._lodMax-Ml?r-this._lodMax+Ml:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Il)}};function Gl(e){let t=[],n=[],r=e,i=e-Ml+1+Nl;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?Ul.set(1,r,n):e===1?Ul.set(-n,1,-r):e===2?Ul.set(-n,r,1):e===3?Ul.set(-1,r,-n):e===4?Ul.set(-n,-1,r):Ul.set(n,r,-1),Ul.toArray(l,(e*6+t)*3)}}let u=new Aa;u.setAttribute(`position`,new ha(c,3)),u.setAttribute(`outputDirection`,new ha(l,3)),n.push(new G(u,null)),r>Ml&&r--}return{lodMeshes:n,sizeLods:t}}function Kl(e,t,n){let r=new Zr(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function ql(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Jl(e,t,n){return new sc({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Fl,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ql(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Yl(e,t,n){return new sc({name:`SphericalGaussianBlur`,defines:{SAMPLES:Pl,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Ql(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Xl(){return new sc({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Ql(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Zl(){return new sc({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ql(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ql(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var $l=class extends Zr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new _o(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new So(5,5,5),i=new sc({name:`CubemapFromEquirect`,uniforms:$s(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new G(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=St),new el(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function eu(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new $l(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Wl(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Wl(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function tu(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&$n(`WebGLRenderer: `+e+` extension not supported.`),t}}}function nu(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?_a:ga)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function ru(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function iu(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:B(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function au(e,t,n){let r=new WeakMap,i=new Yr;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Qr(h,p,m,u);g.type=jt,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new V(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function ou(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var su={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function cu(e,t,n,r,i,a){let o=new Zr(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Aa;l.setAttribute(`position`,new va([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new va([0,2,0,0,2,0],2));let u=new cc({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new G(l,u),f=new Yc(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new Zr(t,n,{type:Mt,depthBuffer:!1,stencilBuffer:!1}),c=new Zr(t,n,{type:Mt,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},Rr.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=su[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var lu=new Jr,uu=new yo(1,1),du=new Qr,fu=new $r,pu=new _o,mu=[],hu=[],gu=new Float32Array(16),_u=new Float32Array(9),vu=new Float32Array(4);function yu(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=mu[i];if(a===void 0&&(a=new Float32Array(i),mu[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function bu(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function xu(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Su(e,t){let n=hu[t];n===void 0&&(n=new Int32Array(t),hu[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Cu(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function wu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(bu(n,t))return;e.uniform2fv(this.addr,t),xu(n,t)}}function Tu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(bu(n,t))return;e.uniform3fv(this.addr,t),xu(n,t)}}function Eu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(bu(n,t))return;e.uniform4fv(this.addr,t),xu(n,t)}}function Du(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(bu(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),xu(n,t)}else{if(bu(n,r))return;vu.set(r),e.uniformMatrix2fv(this.addr,!1,vu),xu(n,r)}}function Ou(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(bu(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),xu(n,t)}else{if(bu(n,r))return;_u.set(r),e.uniformMatrix3fv(this.addr,!1,_u),xu(n,r)}}function ku(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(bu(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),xu(n,t)}else{if(bu(n,r))return;gu.set(r),e.uniformMatrix4fv(this.addr,!1,gu),xu(n,r)}}function Au(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function ju(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(bu(n,t))return;e.uniform2iv(this.addr,t),xu(n,t)}}function Mu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(bu(n,t))return;e.uniform3iv(this.addr,t),xu(n,t)}}function Nu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(bu(n,t))return;e.uniform4iv(this.addr,t),xu(n,t)}}function Pu(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Fu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(bu(n,t))return;e.uniform2uiv(this.addr,t),xu(n,t)}}function Iu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(bu(n,t))return;e.uniform3uiv(this.addr,t),xu(n,t)}}function Lu(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(bu(n,t))return;e.uniform4uiv(this.addr,t),xu(n,t)}}function Ru(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(uu.compareFunction=n.isReversedDepthBuffer()?518:515,a=uu):a=lu,n.setTexture2D(t||a,i)}function zu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||fu,i)}function Bu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||pu,i)}function Vu(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||du,i)}function Hu(e){switch(e){case 5126:return Cu;case 35664:return wu;case 35665:return Tu;case 35666:return Eu;case 35674:return Du;case 35675:return Ou;case 35676:return ku;case 5124:case 35670:return Au;case 35667:case 35671:return ju;case 35668:case 35672:return Mu;case 35669:case 35673:return Nu;case 5125:return Pu;case 36294:return Fu;case 36295:return Iu;case 36296:return Lu;case 35678:case 36198:case 36298:case 36306:case 35682:return Ru;case 35679:case 36299:case 36307:return zu;case 35680:case 36300:case 36308:case 36293:return Bu;case 36289:case 36303:case 36311:case 36292:return Vu}}function Uu(e,t){e.uniform1fv(this.addr,t)}function Wu(e,t){let n=yu(t,this.size,2);e.uniform2fv(this.addr,n)}function Gu(e,t){let n=yu(t,this.size,3);e.uniform3fv(this.addr,n)}function Ku(e,t){let n=yu(t,this.size,4);e.uniform4fv(this.addr,n)}function qu(e,t){let n=yu(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Ju(e,t){let n=yu(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Yu(e,t){let n=yu(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Xu(e,t){e.uniform1iv(this.addr,t)}function Zu(e,t){e.uniform2iv(this.addr,t)}function Qu(e,t){e.uniform3iv(this.addr,t)}function $u(e,t){e.uniform4iv(this.addr,t)}function ed(e,t){e.uniform1uiv(this.addr,t)}function td(e,t){e.uniform2uiv(this.addr,t)}function nd(e,t){e.uniform3uiv(this.addr,t)}function rd(e,t){e.uniform4uiv(this.addr,t)}function id(e,t,n){let r=this.cache,i=t.length,a=Su(n,i);bu(r,a)||(e.uniform1iv(this.addr,a),xu(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?uu:lu;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function ad(e,t,n){let r=this.cache,i=t.length,a=Su(n,i);bu(r,a)||(e.uniform1iv(this.addr,a),xu(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||fu,a[e])}function od(e,t,n){let r=this.cache,i=t.length,a=Su(n,i);bu(r,a)||(e.uniform1iv(this.addr,a),xu(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||pu,a[e])}function sd(e,t,n){let r=this.cache,i=t.length,a=Su(n,i);bu(r,a)||(e.uniform1iv(this.addr,a),xu(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||du,a[e])}function cd(e){switch(e){case 5126:return Uu;case 35664:return Wu;case 35665:return Gu;case 35666:return Ku;case 35674:return qu;case 35675:return Ju;case 35676:return Yu;case 5124:case 35670:return Xu;case 35667:case 35671:return Zu;case 35668:case 35672:return Qu;case 35669:case 35673:return $u;case 5125:return ed;case 36294:return td;case 36295:return nd;case 36296:return rd;case 35678:case 36198:case 36298:case 36306:case 35682:return id;case 35679:case 36299:case 36307:return ad;case 35680:case 36300:case 36308:case 36293:return od;case 36289:case 36303:case 36311:case 36292:return sd}}var ld=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Hu(t.type)}},ud=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=cd(t.type)}},dd=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},fd=/(\w+)(\])?(\[|\.)?/g;function pd(e,t){e.seq.push(t),e.map[t.id]=t}function md(e,t,n){let r=e.name,i=r.length;for(fd.lastIndex=0;;){let a=fd.exec(r),o=fd.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){pd(n,l===void 0?new ld(s,e,t):new ud(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new dd(s),pd(n,e)),n=e}}}var hd=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);md(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function gd(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var _d=37297,vd=0;function yd(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var bd=new Nr;function xd(e){Rr._getMatrix(bd,Rr.workingColorSpace,e);let t=`mat3( ${bd.elements.map(e=>e.toFixed(4))} )`;switch(Rr.getTransfer(e)){case Vn:return[t,`LinearTransferOETF`];case Hn:return[t,`sRGBTransferOETF`];default:return z(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Sd(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+yd(e.getShaderSource(t),r)}return i}function Cd(e,t){let n=xd(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var wd={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Td(e,t){let n=wd[t];return n===void 0?(z(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Ed=new H;function Dd(){return Rr.getLuminanceCoefficients(Ed),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Ed.x.toFixed(4)}, ${Ed.y.toFixed(4)}, ${Ed.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Od(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(jd).join(`
`)}function kd(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Ad(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function jd(e){return e!==``}function Md(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Nd(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Pd=/^[ \t]*#include +<([\w\d./]+)>/gm;function Fd(e){return e.replace(Pd,Ld)}var Id=new Map;function Ld(e,t){let n=Sl[t];if(n===void 0){let e=Id.get(t);if(e!==void 0)n=Sl[e],z(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Fd(n)}var Rd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function zd(e){return e.replace(Rd,Bd)}function Bd(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Vd(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Hd={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function Ud(e){return Hd[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Wd={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Gd(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Wd[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Kd={302:`ENVMAP_MODE_REFRACTION`};function qd(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Kd[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Jd={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Yd(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Jd[e.combine]||`ENVMAP_BLENDING_NONE`}function Xd(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Zd(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=Ud(n),l=Gd(n),u=qd(n),d=Yd(n),f=Xd(n),p=Od(n),m=kd(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(jd).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(jd).join(`
`),_.length>0&&(_+=`
`)):(g=[Vd(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(jd).join(`
`),_=[Vd(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Sl.tonemapping_pars_fragment,n.toneMapping===0?``:Td(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Sl.colorspace_pars_fragment,Cd(`linearToOutputTexel`,n.outputColorSpace),Dd(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(jd).join(`
`)),o=Fd(o),o=Md(o,n),o=Nd(o,n),s=Fd(s),s=Md(s,n),s=Nd(s,n),o=zd(o),s=zd(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=gd(i,i.VERTEX_SHADER,y),S=gd(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Sd(i,x,`vertex`),n=Sd(i,S,`fragment`);B(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):z(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new hd(i,h),T=Ad(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,_d)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=vd++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Qd=0,$d=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new ef(e),t.set(e,n)),n}},ef=class{constructor(e){this.id=Qd++,this.code=e,this.usedTimes=0}};function tf(e){return e===1030||e===37490||e===36285}function nf(e,t,n,r,i,a){let o=new di,s=new $d,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&z(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Cl[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),M=e.state.buffers.depth.getReversed(),N=h.isInstancedMesh===!0,P=h.isBatchedMesh===!0,ee=!!i.map,te=!!i.matcap,ne=!!x,re=!!i.aoMap,ie=!!i.lightMap,ae=!!i.bumpMap&&i.wireframe===!1,oe=!!i.normalMap,F=!!i.displacementMap,se=!!i.emissiveMap,ce=!!i.metalnessMap,le=!!i.roughnessMap,ue=i.anisotropy>0,de=i.clearcoat>0,fe=i.dispersion>0,pe=i.retroreflectivity>0,me=i.iridescence>0,he=i.sheen>0,ge=i.transmission>0,_e=ue&&!!i.anisotropyMap,ve=de&&!!i.clearcoatMap,ye=de&&!!i.clearcoatNormalMap,be=de&&!!i.clearcoatRoughnessMap,xe=me&&!!i.iridescenceMap,I=me&&!!i.iridescenceThicknessMap,Se=he&&!!i.sheenColorMap,Ce=he&&!!i.sheenRoughnessMap,we=!!i.specularMap,L=!!i.specularColorMap,Te=!!i.specularIntensityMap,R=ge&&!!i.transmissionMap,Ee=ge&&!!i.thicknessMap,De=!!i.gradientMap,Oe=!!i.alphaMap,ke=i.alphaTest>0,Ae=!!i.alphaHash,je=!!i.extensions,Me=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Me=e.toneMapping);let Ne={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:P,batchingColor:P&&h._colorsTexture!==null,instancing:N,instancingColor:N&&h.instanceColor!==null,instancingMorph:N&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:Rr.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ee,matcap:te,envMap:ne,envMapMode:ne&&x.mapping,envMapCubeUVHeight:S,aoMap:re,lightMap:ie,bumpMap:ae,normalMap:oe,displacementMap:F,emissiveMap:se,normalMapObjectSpace:oe&&i.normalMapType===1,normalMapTangentSpace:oe&&i.normalMapType===0,packedNormalMap:oe&&i.normalMapType===0&&tf(i.normalMap.format),metalnessMap:ce,roughnessMap:le,anisotropy:ue,anisotropyMap:_e,clearcoat:de,clearcoatMap:ve,clearcoatNormalMap:ye,clearcoatRoughnessMap:be,dispersion:fe,retroreflection:pe,iridescence:me,iridescenceMap:xe,iridescenceThicknessMap:I,sheen:he,sheenColorMap:Se,sheenRoughnessMap:Ce,specularMap:we,specularColorMap:L,specularIntensityMap:Te,transmission:ge,transmissionMap:R,thicknessMap:Ee,gradientMap:De,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Oe,alphaTest:ke,alphaHash:Ae,combine:i.combine,mapUv:ee&&m(i.map.channel),aoMapUv:re&&m(i.aoMap.channel),lightMapUv:ie&&m(i.lightMap.channel),bumpMapUv:ae&&m(i.bumpMap.channel),normalMapUv:oe&&m(i.normalMap.channel),displacementMapUv:F&&m(i.displacementMap.channel),emissiveMapUv:se&&m(i.emissiveMap.channel),metalnessMapUv:ce&&m(i.metalnessMap.channel),roughnessMapUv:le&&m(i.roughnessMap.channel),anisotropyMapUv:_e&&m(i.anisotropyMap.channel),clearcoatMapUv:ve&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:ye&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:be&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:I&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:Se&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&m(i.sheenRoughnessMap.channel),specularMapUv:we&&m(i.specularMap.channel),specularColorMapUv:L&&m(i.specularColorMap.channel),specularIntensityMapUv:Te&&m(i.specularIntensityMap.channel),transmissionMapUv:R&&m(i.transmissionMap.channel),thicknessMapUv:Ee&&m(i.thicknessMap.channel),alphaMapUv:Oe&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(oe||ue),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ee||Oe),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&oe===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:M,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Me,decodeVideoTexture:ee&&i.map.isVideoTexture===!0&&Rr.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:se&&i.emissiveMap.isVideoTexture===!0&&Rr.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:je&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(je&&i.extensions.multiDraw===!0||P)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ne.vertexUv1s=c.has(1),Ne.vertexUv2s=c.has(2),Ne.vertexUv3s=c.has(3),c.clear(),Ne}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Cl[t];n=ic.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Zd(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function rf(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function af(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function of(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function sf(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||af),r.length>1&&r.sort(t||of),i.length>1&&i.sort(t||of)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function cf(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new sf,e.set(t,[i])):n>=r.length?(i=new sf,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function lf(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new H,color:new W};break;case`SpotLight`:n={position:new H,direction:new H,color:new W,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new H,color:new W,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new H,skyColor:new W,groundColor:new W};break;case`RectAreaLight`:n={color:new W,position:new H,halfWidth:new H,halfHeight:new H}}return e[t.id]=n,n}}}function uf(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new V,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var df=0;function ff(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function pf(e){let t=new lf,n=uf(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new H);let i=new H,a=new ei,o=new ei;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(ff);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=K.LTC_FLOAT_1,r.rectAreaLTC2=K.LTC_FLOAT_2):(r.rectAreaLTC1=K.LTC_HALF_1,r.rectAreaLTC2=K.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=df++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function mf(e){let t=new pf(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function hf(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new mf(e),t.set(n,[a])):r>=i.length?(a=new mf(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var gf=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_f=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,vf=[new H(1,0,0),new H(-1,0,0),new H(0,1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1)],yf=[new H(0,-1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1),new H(0,-1,0),new H(0,-1,0)],bf=new ei,xf=new H,Sf=new H;function Cf(e,t,n){let r=new go,i=new V,a=new V,o=new Yr,s=new fc,c=new pc,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new sc({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new V},radius:{value:4}},vertexShader:gf,fragmentShader:_f}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Aa;m.setAttribute(`position`,new ha(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new G(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(z(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){z(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){z(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new Zr(i.x,i.y,{format:Gt,type:Mt,minFilter:St,magFilter:St,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new yo(i.x,i.y,jt),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=Vt,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=yt,d.map.depthTexture.magFilter=yt}else l.isPointLight?(d.map=new $l(i.x),d.map.depthTexture=new bo(i.x,At)):(d.map=new Zr(i.x,i.y),d.map.depthTexture=new yo(i.x,i.y,At)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=Vt,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=St,d.map.depthTexture.magFilter=St):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=yt,d.map.depthTexture.magFilter=yt);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),xf.setFromMatrixPosition(l.matrixWorld),e.position.copy(xf),Sf.copy(e.position),Sf.add(vf[t]),e.up.copy(yf[t]),e.lookAt(Sf),e.updateMatrixWorld(),n.makeTranslation(-xf.x,-xf.y,-xf.z),bf.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(bf,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new Zr(i.x,i.y,{format:Gt,type:Mt}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function wf(e,t){function n(){let t=!1,n=new Yr,r=null,i=new Yr(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?ce(e.DEPTH_TEST):le(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=tr[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?ce(e.STENCIL_TEST):le(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new W(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,P=0,ee=e.getParameter(e.VERSION);ee.indexOf(`WebGL`)===-1?ee.indexOf(`OpenGL ES`)!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),N=P>=2):(P=parseFloat(/^WebGL (\d)/.exec(ee)[1]),N=P>=1);let te=null,ne={},re=e.getParameter(e.SCISSOR_BOX),ie=e.getParameter(e.VIEWPORT),ae=new Yr().fromArray(re),oe=new Yr().fromArray(ie);function F(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let se={};se[e.TEXTURE_2D]=F(e.TEXTURE_2D,e.TEXTURE_2D,1),se[e.TEXTURE_CUBE_MAP]=F(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[e.TEXTURE_2D_ARRAY]=F(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),se[e.TEXTURE_3D]=F(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ce(e.DEPTH_TEST),o.setFunc(3),_e(!1),ve(1),ce(e.CULL_FACE),he(0);function ce(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function le(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ue(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function de(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function fe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let pe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};pe[103]=e.MIN,pe[104]=e.MAX;let me={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function he(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(le(e.BLEND),g=!1);else if(g===!1&&(ce(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:B(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:B(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:B(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:B(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a=a||n,o=o||r,s=s||i,(n!==v||a!==x)&&(e.blendEquationSeparate(pe[n],pe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(me[r],me[i],me[o],me[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function ge(t,n){t.side===2?le(e.CULL_FACE):ce(e.CULL_FACE);let r=t.side===1;n&&(r=!r),_e(r),t.blending===1&&t.transparent===!1?he(0):he(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),be(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?ce(e.SAMPLE_ALPHA_TO_COVERAGE):le(e.SAMPLE_ALPHA_TO_COVERAGE)}function _e(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ve(t){t===0?le(e.CULL_FACE):(ce(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ye(t){t!==k&&(N&&e.lineWidth(t),k=t)}function be(t,n,r){t?(ce(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):le(e.POLYGON_OFFSET_FILL)}function xe(t){t?ce(e.SCISSOR_TEST):le(e.SCISSOR_TEST)}function I(t){t===void 0&&(t=e.TEXTURE0+M-1),te!==t&&(e.activeTexture(t),te=t)}function Se(t,n,r){r===void 0&&(r=te===null?e.TEXTURE0+M-1:te);let i=ne[r];i===void 0&&(i={type:void 0,texture:void 0},ne[r]=i),(i.type!==t||i.texture!==n)&&(te!==r&&(e.activeTexture(r),te=r),e.bindTexture(t,n||se[t]),i.type=t,i.texture=n)}function Ce(){let t=ne[te];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function we(){try{e.compressedTexImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function L(){try{e.compressedTexImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Te(){try{e.texSubImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function R(){try{e.texSubImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Ee(){try{e.compressedTexSubImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function De(){try{e.compressedTexSubImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Oe(){try{e.texStorage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function ke(){try{e.texStorage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Ae(){try{e.texImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function je(){try{e.texImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Me(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ne(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Pe(t){ae.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ae.copy(t))}function Fe(t){oe.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),oe.copy(t))}function Ie(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Le(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Re(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},te=null,ne={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new W(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ae.set(0,0,e.canvas.width,e.canvas.height),oe.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:ce,disable:le,bindFramebuffer:ue,drawBuffers:de,useProgram:fe,setBlending:he,setMaterial:ge,setFlipSided:_e,setCullFace:ve,setLineWidth:ye,setPolygonOffset:be,setScissorTest:xe,activeTexture:I,bindTexture:Se,unbindTexture:Ce,compressedTexImage2D:we,compressedTexImage3D:L,texImage2D:Ae,texImage3D:je,pixelStorei:Ne,getParameter:Me,updateUBOMapping:Ie,uniformBlockBinding:Le,texStorage2D:Oe,texStorage3D:ke,texSubImage2D:Te,texSubImage3D:R,compressedTexSubImage2D:Ee,compressedTexSubImage3D:De,scissor:Pe,viewport:Fe,reset:Re}}function Tf(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new V,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):Jn(`canvas`)}function g(e,t,n){let r=1,i=we(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),z(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&z(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];z(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||z(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Vn:Rr.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,z(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function k(){O=0}function A(){return O}function j(e){O=e}function M(){let e=O;return e>=i.maxTextures&&z(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function N(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function P(t,i){let a=r.get(t);if(t.isVideoTexture&&Se(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)z(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)z(`WebGLRenderer: Texture marked for update but image is incomplete`);else{le(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ee(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?le(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function te(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?le(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ne(t,i){let a=r.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version?ue(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let re={[gt]:e.REPEAT,[_t]:e.CLAMP_TO_EDGE,[vt]:e.MIRRORED_REPEAT},ie={[yt]:e.NEAREST,[bt]:e.NEAREST_MIPMAP_NEAREST,[xt]:e.NEAREST_MIPMAP_LINEAR,[St]:e.LINEAR,[Ct]:e.LINEAR_MIPMAP_NEAREST,[wt]:e.LINEAR_MIPMAP_LINEAR},ae={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function oe(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&z(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,re[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,re[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,re[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ie[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ie[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,ae[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function F(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=N(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function se(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ce(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=se(n.start,r.width,4),c=se(t.start,r.width,4);n.start<=i+1&&a===c&&se(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function le(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=F(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Rr.getPrimaries(Rr.workingColorSpace),r=o.colorSpace===``?null:Rr.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Ce(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);oe(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===Ht,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&ce(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(C){if(T){if(o.layerUpdates.size>0){let t=vl(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=vl(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w){if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=we(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=we(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ue(t,o,s){if(o.image.length!==6)return;let c=F(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Rr.getPrimaries(Rr.workingColorSpace),r=o.colorSpace===``?null:Rr.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Ce(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);oe(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=we(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function de(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),I(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,xe(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function fe(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;I(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,xe(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,xe(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);I(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,xe(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,xe(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function pe(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),oe(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else P(i.depthTexture,0);let u=l.__webglTexture,d=xe(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)I(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)I(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function me(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)pe(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?pe(i.__webglFramebuffer[0],t,0):pe(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),fe(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),fe(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function he(t,n,i){let a=r.get(t);n!==void 0&&de(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&me(t)}function ge(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&I(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=xe(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),fe(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),oe(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)de(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else de(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),oe(c,a),de(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),oe(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)de(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else de(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&me(t)}function _e(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let ve=[],ye=[];function be(t){if(t.samples>0){if(I(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(ve.length=0,ye.length=0,ve.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(ve.push(l),ye.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,ye)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,ve))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function xe(e){return Math.min(i.maxSamples,e.samples)}function I(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function Se(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Ce(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Rr.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&z(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):B(`WebGLTextures: Unsupported texture color space:`,n)),t}function we(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=M,this.resetTextureUnits=k,this.getTextureUnits=A,this.setTextureUnits=j,this.setTexture2D=P,this.setTexture2DArray=ee,this.setTexture3D=te,this.setTextureCube=ne,this.rebindTextures=he,this.setupRenderTarget=ge,this.updateRenderTargetMipmap=_e,this.updateMultisampleRenderTarget=be,this.setupDepthRenderbuffer=me,this.setupFrameBufferTexture=de,this.useMultisampledRTT=I,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Ef(e,t){function n(n,r=``){let i,a=Rr.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Df=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Of=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,kf=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new xo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new sc({vertexShader:Df,fragmentShader:Of,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new G(new qs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Af=class extends nr{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new kf,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new V,C=null,w=null,T=new Kc;T.viewport=new Yr;let E=new Kc;E.viewport=new Yr;let D=[T,E],O=new tl,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new ki,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new ki,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new ki,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function M(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,M),r.removeEventListener(`inputsourceschange`,N);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,oe.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&z(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&z(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,M),r.addEventListener(`inputsourceschange`,N),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?Ht:Vt,a=_.stencil?Ft:At);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Zr(d.textureWidth,d.textureHeight,{format:Bt,type:Tt,depthTexture:new yo(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Zr(f.framebufferWidth,f.framebufferHeight,{format:Bt,type:Tt,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),oe.setContext(r),oe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function N(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let P=new H,ee=new H;function te(e,t,n){P.setFromMatrixPosition(t.matrixWorld),ee.setFromMatrixPosition(n.matrixWorld);let r=P.distanceTo(ee),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ne(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;ne(O,i);for(let e=0;e<a.length;e++)ne(a[e],i);a.length===2?te(O,T,E):O.projectionMatrix.copy(T.projectionMatrix),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),re(e,O,i)};function re(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=or*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let ie=null;function ae(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new Kc,o.layers.enable(n),o.viewport=new Yr,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new xo,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ie&&ie(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let oe=new bl;oe.setAnimationLoop(ae),this.setAnimationLoop=function(e){ie=e},this.dispose=function(){}}},jf=new ei,Mf=new Nr;Mf.set(-1,0,0,0,1,0,0,0,1);function Nf(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,rc(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(jf.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Mf),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Pf(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return B(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?z(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):z(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Ff=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),If=null;function Lf(){return If===null&&(If=new no(Ff,16,16,Gt,Mt),If.name=`DFG_LUT`,If.minFilter=St,If.magFilter=St,If.wrapS=_t,If.wrapT=_t,If.generateMipmaps=!1,If.needsUpdate=!0),If}var Rf=class{constructor(e={}){let{canvas:t=Yn(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Tt}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([qt,Kt,Wt]),g=new Set([Tt,At,Ot,Ft,Nt,Pt]),_=new Uint32Array(4),v=new Int32Array(4),y=new H,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=zn;let j=0,M=0,N=null,P=-1,ee=null,te=new Yr,ne=new Yr,re=null,ie=new W(0),ae=0,oe=t.width,F=t.height,se=1,ce=null,le=null,ue=new Yr(0,0,oe,F),de=new Yr(0,0,oe,F),fe=!1,pe=new go,me=!1,he=!1,ge=new ei,_e=new H,ve=new Yr,ye={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},be=!1;function xe(){return N===null?se:1}let I=n;function Se(e,n){return t.getContext(e,n)}let Ce,we,L,Te,R,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,Ke,!1),t.addEventListener(`webglcontextrestored`,qe,!1),t.addEventListener(`webglcontextcreationerror`,Je,!1),I===null){let t=`webgl2`;if(I=Se(t,e),I===null)throw Se(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}We()}catch(e){throw t.removeEventListener(`webglcontextlost`,Ke,!1),t.removeEventListener(`webglcontextrestored`,qe,!1),t.removeEventListener(`webglcontextcreationerror`,Je,!1),B(`WebGLRenderer: `+e.message),e}function We(){Ce=new tu(I),Ce.init(),Ve=new Ef(I,Ce),we=new Al(I,Ce,e,Ve),L=new wf(I,Ce),we.reversedDepthBuffer&&d&&L.buffers.depth.setReversed(!0),O=I.createFramebuffer(),k=I.createFramebuffer(),A=I.createFramebuffer(),Te=new iu(I),R=new rf,Ee=new Tf(I,Ce,L,R,we,Ve,Te),De=new eu(T),Oe=new xl(I),He=new Ol(I,Oe),ke=new nu(I,Oe,Te,He),Ae=new ou(I,ke,Oe,He,Te),Re=new au(I,we,Ee),Fe=new jl(R),je=new nf(T,De,Ce,we,He,Fe),Me=new Nf(T,R),Ne=new cf,Pe=new hf(Ce),Le=new Dl(T,De,L,Ae,p,s),Ie=new Cf(T,Ae,we),Ue=new Pf(I,Te,we,L),ze=new kl(I,Ce,Te),Be=new ru(I,Ce,Te),Te.programs=je.programs,T.capabilities=we,T.extensions=Ce,T.properties=R,T.renderLists=Ne,T.shadowMap=Ie,T.state=L,T.info=Te}m!==1009&&(w=new cu(m,t.width,t.height,o,r,i));let Ge=new Af(T,I);this.xr=Ge,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let e=Ce.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Ce.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(e){e!==void 0&&(se=e,this.setSize(oe,F,!1))},this.getSize=function(e){return e.set(oe,F)},this.setSize=function(e,n,r=!0){Ge.isPresenting?z(`WebGLRenderer: Can't change size while VR device is presenting.`):(oe=e,F=n,t.width=Math.floor(e*se),t.height=Math.floor(n*se),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(oe*se,F*se).floor()},this.setDrawingBufferSize=function(e,n,r){oe=e,F=n,se=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)B(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){z(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(te)},this.getViewport=function(e){return e.copy(ue)},this.setViewport=function(e,t,n,r){e.isVector4?ue.set(e.x,e.y,e.z,e.w):ue.set(e,t,n,r),L.viewport(te.copy(ue).multiplyScalar(se).round())},this.getScissor=function(e){return e.copy(de)},this.setScissor=function(e,t,n,r){e.isVector4?de.set(e.x,e.y,e.z,e.w):de.set(e,t,n,r),L.scissor(ne.copy(de).multiplyScalar(se).round())},this.getScissorTest=function(){return fe},this.setScissorTest=function(e){L.setScissorTest(fe=e)},this.setOpaqueSort=function(e){ce=e},this.setTransparentSort=function(e){le=e},this.getClearColor=function(e){return e.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor(...arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=h.has(t)}if(e){let e=N.texture.type,t=g.has(e),n=Le.getClearColor(),r=Le.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,I.clearBufferuiv(I.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,I.clearBufferiv(I.COLOR,0,v))}else r|=I.COLOR_BUFFER_BIT}t&&(r|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&I.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Ke,!1),t.removeEventListener(`webglcontextrestored`,qe,!1),t.removeEventListener(`webglcontextcreationerror`,Je,!1),Le.dispose(),Ne.dispose(),Pe.dispose(),R.dispose(),De.dispose(),Ae.dispose(),He.dispose(),Ue.dispose(),je.dispose(),Ge.dispose(),Ge.removeEventListener(`sessionstart`,tt),Ge.removeEventListener(`sessionend`,nt),rt.stop()};function Ke(e){e.preventDefault(),Zn(`WebGLRenderer: Context Lost.`),E=!0}function qe(){Zn(`WebGLRenderer: Context Restored.`),E=!1;let e=Te.autoReset,t=Ie.enabled,n=Ie.autoUpdate,r=Ie.needsUpdate,i=Ie.type;We(),Te.autoReset=e,Ie.enabled=t,Ie.autoUpdate=n,Ie.needsUpdate=r,Ie.type=i}function Je(e){B(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Ye(e){let t=e.target;t.removeEventListener(`dispose`,Ye),Xe(t)}function Xe(e){Ze(e),R.remove(e)}function Ze(e){let t=R.get(e).programs;t!==void 0&&(t.forEach(function(e){je.releaseProgram(e)}),e.isShaderMaterial&&je.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ye);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=pt(e,t,n,r,i);L.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=ke.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;He.setup(i,r,s,n,c);let h,g=ze;if(c!==null&&(h=Oe.get(c),g=Be,g.setIndex(h)),i.isMesh)r.wireframe===!0?(L.setLineWidth(r.wireframeLinewidth*xe()),g.setMode(I.LINES)):g.setMode(I.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),L.setLineWidth(e*xe()),i.isLineSegments?g.setMode(I.LINES):i.isLineLoop?g.setMode(I.LINE_LOOP):g.setMode(I.LINE_STRIP)}else i.isPoints?g.setMode(I.POINTS):i.isSprite&&g.setMode(I.TRIANGLES);if(i.isBatchedMesh){if(Ce.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Oe.get(c).bytesPerElement:1,o=R.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(I,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function Qe(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),me===!0&&Fe.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,lt(e,t,r),e.side=0,e.needsUpdate=!0,lt(e,t,r),e.side=2):lt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Pe.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),he=this.localClippingEnabled,me=Fe.init(this.clippingPlanes,he),me===!0&&Fe.setGlobalState(this.clippingPlanes,t),D!==null&&Ie.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];Qe(o,n,t,e),r.add(o)}else Qe(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=R.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Ce.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let $e=null;function et(e){$e&&$e(e)}function tt(){rt.stop()}function nt(){rt.start()}let rt=new bl;rt.setAnimationLoop(et),typeof self<`u`&&rt.setContext(self),this.setAnimationLoop=function(e){$e=e,Ge.setAnimationLoop(e),e===null?rt.stop():rt.start()},Ge.addEventListener(`sessionstart`,tt),Ge.addEventListener(`sessionend`,nt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){B(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=Ge.enabled===!0&&Ge.isPresenting===!0,r=w!==null&&(N===null||n)&&w.begin(T,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Ge.enabled===!0&&Ge.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ge.cameraAutoUpdate===!0&&Ge.updateCamera(t),t=Ge.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,N),x=Pe.get(e,C.length),x.init(t),x.state.textureUnits=Ee.getTextureUnits(),C.push(x),ge.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),pe.setFromProjectionMatrix(ge,Gn,t.reversedDepth),he=this.localClippingEnabled,me=Fe.init(this.clippingPlanes,he),b=Ne.get(e,S.length),b.init(),S.push(b),Ge.enabled===!0&&Ge.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&it(e,t,-1/0,T.sortObjects)}it(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(ce,le),be=Ge.enabled===!1||Ge.isPresenting===!1||Ge.hasDepthSensing()===!1,be&&Le.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),me===!0&&Fe.beginShadows();let i=x.state.shadowsArray;if(Ie.render(i,e,t),me===!0&&Fe.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];ot(n,r,e,a)}be&&Le.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];at(b,e,n,n.viewport)}}else r.length>0&&ot(n,r,e,t),be&&Le.render(e),at(b,e,t)}N!==null&&M===0&&(Ee.updateMultisampleRenderTarget(N),Ee.updateRenderTargetMipmap(N)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),He.resetDefaultState(),P=-1,ee=null,C.pop(),C.length>0?(x=C[C.length-1],Ee.setTextureUnits(x.state.textureUnits),me===!0&&Fe.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function it(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(pe)){r&&ve.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ge);let i=Ae.update(e),a=e.material;a.visible&&b.push(e,i,a,n,ve.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(pe))){let i=Ae.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),ve.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),ve.copy(e.boundingSphere.center)),ve.applyMatrix4(e.matrixWorld).applyMatrix4(ge)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,ve.z,s,t)}}else a.visible&&b.push(e,i,a,n,ve.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)it(i[e],t,n,r)}function at(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),me===!0&&Fe.setGlobalState(T.clippingPlanes,n),r&&L.viewport(te.copy(r)),i.length>0&&st(i,t,n),a.length>0&&st(a,t,n),o.length>0&&st(o,t,n),L.buffers.depth.setTest(!0),L.buffers.depth.setMask(!0),L.buffers.color.setMask(!0),L.setPolygonOffset(!1)}function ot(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Ce.has(`EXT_color_buffer_half_float`)||Ce.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new Zr(1,1,{generateMipmaps:!0,type:e?Mt:Tt,minFilter:wt,samples:Math.max(4,we.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Rr.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||te;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(ie),ae=T.getClearAlpha(),ae<1&&T.setClearColor(16777215,.5),T.clear(),be&&Le.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),me===!0&&Fe.setGlobalState(T.clippingPlanes,r),st(e,n,r),Ee.updateMultisampleRenderTarget(a),Ee.updateRenderTargetMipmap(a),Ce.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,ct(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(Ee.updateMultisampleRenderTarget(a),Ee.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(ie,ae),d!==void 0&&(r.viewport=d),T.toneMapping=u}function st(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&ct(o,t,n,s,l,c)}}function ct(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function lt(e,t,n){t.isScene!==!0&&(t=ye);let r=R.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=je.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=je.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=De.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Ye),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return dt(e,s),d}else s.uniforms=je.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=je.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Fe.uniform),dt(e,s),r.needsLights=ht(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function ut(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=hd.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function dt(e,t){let n=R.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function ft(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function pt(e,t,n,r,i){t.isScene!==!0&&(t=ye),Ee.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?T.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Rr.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=De.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=R.get(r),y=x.state.lights;if(me===!0&&(he===!0||e!==ee)){let t=e===ee&&r.id===P;Fe.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Fe.numPlanes||v.numIntersection!==Fe.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=lt(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),k=v.uniforms;if(L.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==P&&(P=r.id,w=!0),v.needsLights){let e=ft(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||ee!==e){L.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(I,`projectionMatrix`,e.projectionMatrix),O.setValue(I,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(I,_e.setFromMatrixPosition(e.matrixWorld)),we.logarithmicDepthBuffer&&O.setValue(I,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(I,`isOrthographic`,e.isOrthographicCamera===!0),ee!==e&&(ee=e,w=!0,E=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&O.setValue(I,`sunShadowMap`,y.state.sunShadowMap,Ee),y.state.directionalShadowMap.length>0&&O.setValue(I,`directionalShadowMap`,y.state.directionalShadowMap,Ee),y.state.spotShadowMap.length>0&&O.setValue(I,`spotShadowMap`,y.state.spotShadowMap,Ee),y.state.pointShadowMap.length>0&&O.setValue(I,`pointShadowMap`,y.state.pointShadowMap,Ee)),i.isSkinnedMesh){O.setOptional(I,i,`bindMatrix`),O.setOptional(I,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(I,`boneTexture`,e.boneTexture,Ee))}i.isBatchedMesh&&(O.setOptional(I,i,`batchingTexture`),O.setValue(I,`batchingTexture`,i._matricesTexture,Ee),O.setOptional(I,i,`batchingIdTexture`),O.setValue(I,`batchingIdTexture`,i._indirectTexture,Ee),O.setOptional(I,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(I,`batchingColorTexture`,i._colorsTexture,Ee));let A=n.morphAttributes;if((A.position!==void 0||A.normal!==void 0||A.color!==void 0)&&Re.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(I,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(k.envMapIntensity.value=t.environmentIntensity),k.dfgLUT!==void 0&&(k.dfgLUT.value=Lf()),w){if(O.setValue(I,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&mt(k,E),a&&r.fog===!0&&Me.refreshFogUniforms(k,a),Me.refreshMaterialUniforms(k,r,se,F,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;k.probesSH.value=e.texture,k.probesMin.value.copy(e.boundingBox.min),k.probesMax.value.copy(e.boundingBox.max),k.probesResolution.value.copy(e.resolution)}hd.upload(I,ut(v),k,Ee)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(hd.upload(I,ut(v),k,Ee),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(I,`center`,i.center),O.setValue(I,`modelViewMatrix`,i.modelViewMatrix),O.setValue(I,`normalMatrix`,i.normalMatrix),O.setValue(I,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Ue.update(n,S),Ue.bind(n,S)}}return S}function mt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function ht(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=R.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),R.get(e.texture).__webglTexture=t,R.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=R.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,j=t,M=n;let r=null,i=!1,a=!1;if(e){let o=R.get(e);if(o.__useDefaultFramebuffer!==void 0){L.bindFramebuffer(I.FRAMEBUFFER,o.__webglFramebuffer),te.copy(e.viewport),ne.copy(e.scissor),re=e.scissorTest,L.viewport(te),L.scissor(ne),L.setScissorTest(re),P=-1;return}if(o.__webglFramebuffer===void 0)Ee.setupRenderTarget(e);else if(o.__hasExternalTextures)Ee.rebindTextures(e,R.get(e.texture).__webglTexture,R.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&R.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);Ee.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=R.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&Ee.useMultisampledRTT(e)===!1?R.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,te.copy(e.viewport),ne.copy(e.scissor),re=e.scissorTest}else te.copy(ue).multiplyScalar(se).floor(),ne.copy(de).multiplyScalar(se).floor(),re=fe;if(n!==0&&(r=O),L.bindFramebuffer(I.FRAMEBUFFER,r)&&L.drawBuffers(e,r),L.viewport(te),L.scissor(ne),L.setScissorTest(re),i){let r=R.get(e.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=R.get(e.textures[t]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=R.get(e.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,t.__webglTexture,n)}P=-1};function gt(e){let t=R.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=we.textureFormatReadable(e.format),t.__typeReadable=we.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){B(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=R.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){L.bindFramebuffer(I.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+s);let u=gt(o);if(u.__formatReadable===!1){B(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){B(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&I.readPixels(t,n,r,i,Ve.convert(c),Ve.convert(l),a)}finally{let e=N===null?null:R.get(N).__webglFramebuffer;L.bindFramebuffer(I.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=R.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){L.bindFramebuffer(I.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+s);let d=gt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,f),I.bufferData(I.PIXEL_PACK_BUFFER,a.byteLength,I.STREAM_READ),I.readPixels(t,n,r,i,Ve.convert(l),Ve.convert(u),0),I.bindBuffer(I.PIXEL_PACK_BUFFER,null);let p=N===null?null:R.get(N).__webglFramebuffer;L.bindFramebuffer(I.FRAMEBUFFER,p);let m=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await er(I,m,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,f),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,a),I.bindBuffer(I.PIXEL_PACK_BUFFER,null),I.deleteBuffer(f),I.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Ee.setTexture2D(e,0),I.copyTexSubImage2D(I.TEXTURE_2D,n,0,0,o,s,i,a),L.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Ve.convert(t.format),_=Ve.convert(t.type),v;t.isData3DTexture?(Ee.setTexture3D(t,0),v=I.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Ee.setTexture2DArray(t,0),v=I.TEXTURE_2D_ARRAY):(Ee.setTexture2D(t,0),v=I.TEXTURE_2D),L.activeTexture(I.TEXTURE0),L.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,t.flipY),L.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),L.pixelStorei(I.UNPACK_ALIGNMENT,t.unpackAlignment);let y=L.getParameter(I.UNPACK_ROW_LENGTH),b=L.getParameter(I.UNPACK_IMAGE_HEIGHT),x=L.getParameter(I.UNPACK_SKIP_PIXELS),S=L.getParameter(I.UNPACK_SKIP_ROWS),C=L.getParameter(I.UNPACK_SKIP_IMAGES);L.pixelStorei(I.UNPACK_ROW_LENGTH,h.width),L.pixelStorei(I.UNPACK_IMAGE_HEIGHT,h.height),L.pixelStorei(I.UNPACK_SKIP_PIXELS,l),L.pixelStorei(I.UNPACK_SKIP_ROWS,u),L.pixelStorei(I.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=R.get(e),r=R.get(t),h=R.get(n.__renderTarget),g=R.get(r.__renderTarget);L.bindFramebuffer(I.READ_FRAMEBUFFER,h.__webglFramebuffer),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,R.get(e).__webglTexture,i,d+n),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,R.get(t).__webglTexture,a,m+n)),I.blitFramebuffer(l,u,o,s,f,p,o,s,I.DEPTH_BUFFER_BIT,I.NEAREST);L.bindFramebuffer(I.READ_FRAMEBUFFER,null),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||R.has(e)){let n=R.get(e),r=R.get(t);L.bindFramebuffer(I.READ_FRAMEBUFFER,k),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,n.__webglTexture,i),T?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,r.__webglTexture,a),i===0?T?I.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):I.copyTexSubImage2D(v,a,f,p,l,u,o,s):I.blitFramebuffer(l,u,o,s,f,p,o,s,I.COLOR_BUFFER_BIT,I.NEAREST);L.bindFramebuffer(I.READ_FRAMEBUFFER,null),L.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?I.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?I.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):I.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):I.texSubImage2D(I.TEXTURE_2D,a,f,p,o,s,g,_,h);L.pixelStorei(I.UNPACK_ROW_LENGTH,y),L.pixelStorei(I.UNPACK_IMAGE_HEIGHT,b),L.pixelStorei(I.UNPACK_SKIP_PIXELS,x),L.pixelStorei(I.UNPACK_SKIP_ROWS,S),L.pixelStorei(I.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&I.generateMipmap(v),L.unbindTexture()},this.initRenderTarget=function(e){R.get(e).__webglFramebuffer===void 0&&Ee.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Ee.setTextureCube(e,0):e.isData3DTexture?Ee.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Ee.setTexture2DArray(e,0):Ee.setTexture2D(e,0),L.unbindTexture()},this.resetState=function(){j=0,M=0,N=null,L.reset(),He.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Gn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Rr._getDrawingBufferColorSpace(e),t.unpackColorSpace=Rr._getUnpackColorSpace()}},zf=12,Bf=300,Vf=260,Hf=class{constructor(e){this.surface=e,this.camYaw=0,this.camPitch=.45,this.enabled=!1,this.classic=!1,this.keys=new Set,this.edges=new Set,this.held=new Set,this.joyId=null,this.joyOrigin={x:0,y:0},this.joy={x:0,y:0},this.lookId=null,this.lookLast={x:0,y:0},this.lookStart={x:0,y:0,t:0,moved:0},this.pendingTap=0,this.mouseDown=null,this.lastLook=0,this.joyBase=document.createElement(`div`),this.joyBase.className=`joy-base`,this.joyKnob=document.createElement(`div`),this.joyKnob.className=`joy-knob`,this.joyBase.appendChild(this.joyKnob),document.body.appendChild(this.joyBase),window.addEventListener(`keydown`,e=>this.onKey(e,!0)),window.addEventListener(`keyup`,e=>this.onKey(e,!1)),window.addEventListener(`blur`,()=>{this.keys.clear(),this.held.clear()}),e.addEventListener(`pointerdown`,e=>this.onDown(e)),window.addEventListener(`pointermove`,e=>this.onMove(e)),window.addEventListener(`pointerup`,e=>this.onUp(e)),window.addEventListener(`pointercancel`,e=>this.onUp(e)),e.addEventListener(`contextmenu`,e=>e.preventDefault())}press(e){this.enabled&&(this.edges.add(e),(e===`sticky`||e===`bouncy`||e===`up`||e===`down`)&&this.held.add(e))}release(e){this.held.delete(e)}reset(){this.keys.clear(),this.edges.clear(),this.held.clear(),this.endJoy(),this.lookId=null,this.mouseDown=null,this.pendingTap=0}onKey(e,t){let n=e.code;if(t&&e.repeat){this.keys.add(n);return}if(t?this.keys.add(n):this.keys.delete(n),!this.enabled)return;let r={Space:`jump`,KeyJ:`sticky`,KeyK:`bouncy`,KeyE:`place`,KeyQ:`toggleShape`,KeyF:`interact`,KeyT:`trick`,KeyR:`trick`,Enter:`interact`}[n];r&&(e.preventDefault(),t?this.press(r):this.release(r))}onDown(e){this.enabled&&(e.pointerType===`mouse`?(this.mouseDown={x:e.clientX,y:e.clientY,button:e.button,moved:0},this.lookLast={x:e.clientX,y:e.clientY}):(e.preventDefault(),e.clientX<window.innerWidth*.45&&this.joyId===null?(this.joyId=e.pointerId,this.joyOrigin={x:e.clientX,y:e.clientY},this.joy={x:0,y:0},this.joyBase.style.display=`block`,this.joyBase.style.left=`${e.clientX}px`,this.joyBase.style.top=`${e.clientY}px`,this.joyKnob.style.transform=`translate(-50%, -50%)`):this.lookId===null&&(this.lookId=e.pointerId,this.lookLast={x:e.clientX,y:e.clientY},this.lookStart={x:e.clientX,y:e.clientY,t:performance.now(),moved:0})))}onMove(e){if(e.pointerType===`mouse`){if(!this.mouseDown)return;let t=e.clientX-this.lookLast.x,n=e.clientY-this.lookLast.y;this.mouseDown.moved+=Math.abs(t)+Math.abs(n),this.lookLast={x:e.clientX,y:e.clientY},this.rotate(t*.006,n*.005)}else if(e.pointerId===this.joyId){let t=e.clientX-this.joyOrigin.x,n=e.clientY-this.joyOrigin.y,r=Math.hypot(t,n);r>55&&(t=t/r*55,n=n/r*55),this.joy={x:t/55,y:n/55},this.joyKnob.style.transform=`translate(calc(-50% + ${t}px), calc(-50% + ${n}px))`}else if(e.pointerId===this.lookId){let t=e.clientX-this.lookLast.x,n=e.clientY-this.lookLast.y;this.lookLast={x:e.clientX,y:e.clientY},this.lookStart.moved=Math.max(this.lookStart.moved,Math.hypot(e.clientX-this.lookStart.x,e.clientY-this.lookStart.y)),(this.lookStart.moved>zf||this.classic)&&this.rotate(t*.008,n*.006)}}onUp(e){if(e.pointerType===`mouse`){let t=this.mouseDown;this.mouseDown=null,t&&this.enabled&&t.moved<6&&e.target===this.surface&&(t.button===0?this.edges.add(`sticky`):t.button===2&&this.edges.add(`bouncy`))}else if(e.pointerId===this.joyId&&this.endJoy(),e.pointerId===this.lookId){this.lookId=null;let t=performance.now();this.lookStart.moved<=zf&&t-this.lookStart.t<Bf&&this.enabled&&!this.classic&&e.type===`pointerup`&&this.tap(t)}}tap(e){this.pendingTap&&e-this.pendingTap<Vf?(this.pendingTap=0,this.edges.add(`bouncy`)):this.pendingTap=e}endJoy(){this.joyId=null,this.joy={x:0,y:0},this.joyBase.style.display=`none`}rotate(e,t){this.lastLook=performance.now(),this.camYaw-=e,this.camPitch=Math.max(-.15,Math.min(1.2,this.camPitch+t))}consume(e){this.pendingTap&&performance.now()-this.pendingTap>=Vf&&(this.pendingTap=0,this.enabled&&this.edges.add(`sticky`));let t=this.joy.x,n=-this.joy.y,r=this.keys;(r.has(`KeyW`)||r.has(`ArrowUp`))&&(n+=1),(r.has(`KeyS`)||r.has(`ArrowDown`))&&--n,r.has(`KeyD`)&&(t+=1),r.has(`KeyA`)&&--t,r.has(`ArrowLeft`)&&this.rotate(-e*2.2,0),r.has(`ArrowRight`)&&this.rotate(e*2.2,0);let i=Math.hypot(t,n);i>1&&(t/=i,n/=i),this.enabled||(t=n=0);let a=-Math.sin(this.camYaw),o=-Math.cos(this.camYaw),s=Math.cos(this.camYaw),c=-Math.sin(this.camYaw),l=e=>this.edges.has(e),u={mx:s*t+a*n,mz:c*t+o*n,aimYaw:this.camYaw,jump:l(`jump`),sticky:l(`sticky`)||this.held.has(`sticky`),bouncy:l(`bouncy`)||this.held.has(`bouncy`),place:l(`place`),toggleShape:l(`toggleShape`),interact:l(`interact`),trick:l(`trick`),up:this.enabled&&(this.held.has(`up`)||r.has(`Space`)),down:this.enabled&&(this.held.has(`down`)||r.has(`ShiftLeft`)||r.has(`ShiftRight`))};return this.edges.clear(),u}},Uf=null;function Wf(){if(!Uf)try{Uf=new AudioContext}catch{Uf=null}Uf&&Uf.state===`suspended`&&Uf.resume()}function Gf(e,t,n,r=`sine`,i=.15){if(!Uf||Uf.state!==`running`)return;let a=Uf.currentTime,o=Uf.createOscillator(),s=Uf.createGain();o.type=r,o.frequency.setValueAtTime(e,a),o.frequency.exponentialRampToValueAtTime(t,a+n),s.gain.setValueAtTime(i,a),s.gain.exponentialRampToValueAtTime(.001,a+n),o.connect(s).connect(Uf.destination),o.start(a),o.stop(a+n+.02)}function Kf(e){switch(e.type){case`shoot`:Gf(500,200,.12,`triangle`,.08);break;case`babble`:break;case`note`:case`glue`:case`bounce`:Xf(e);break;case`splat`:Gf(160,90,.1,`triangle`,.05);break;case`pad`:Gf(300,600,.15,`sine`,.1);break;case`bonk`:Gf(120,60,.25,`square`,.06);break;case`jump`:Gf(300,500,.1,`sine`,.06);break;case`block`:Gf(220,180,.08,`square`,.05);break;case`noroom`:Gf(110,100,.12,`square`,.05);break;case`pickup`:case`deliver`:Gf(660,1320,.15,`triangle`,.12),setTimeout(()=>Gf(880,1760,.2,`triangle`,.12),120);break;case`built`:case`star`:[880,1175].forEach((e,t)=>setTimeout(()=>Gf(e,e*1.2,.1,`sine`,.07),t*60));break;case`bonus`:[523,784,1047].forEach((e,t)=>setTimeout(()=>Gf(e,e*1.1,.12,`triangle`,.08),t*55));break;case`bail`:Gf(300,120,.3,`sawtooth`,.05);break;case`trick`:[392,523,659,784].forEach((e,t)=>setTimeout(()=>Gf(e,e*1.5,.18,`triangle`,.12),t*90));break;case`mount`:Gf(80,160,.4,`sawtooth`,.07);break;case`dismount`:Gf(300,200,.1,`sine`,.06);break;case`win`:[523,659,784,1046].forEach((e,t)=>setTimeout(()=>Gf(e,e,.25,`triangle`,.12),t*150))}}var qf=[261.63,293.66,329.63,392,440,523.25,587.33,659.25,784,880],Jf=new Map,Yf=-1;function Xf(e){if(!Uf||e.who===void 0)return;let t=Uf.currentTime;if(t-(Jf.get(e.who)??-1)<.45||t-Yf<.09)return;Jf.set(e.who,t),Yf=t;let n=e.who%qf.length,r=qf[n];(e.type===`bounce`?[0,2,4,5].map(e=>{let t=n+e;return qf[t%qf.length]*2**Math.floor(t/qf.length)}):[e.type===`glue`?r/2:r]).forEach((e,t)=>{let n=Uf.currentTime+t*.09;for(let[t,r]of[[1,.065],[2,.012]]){let i=Uf.createOscillator(),a=Uf.createGain();i.type=`sine`,i.frequency.value=e*t,a.gain.setValueAtTime(0,n),a.gain.linearRampToValueAtTime(r,n+.008),a.gain.exponentialRampToValueAtTime(1e-4,n+.65),i.connect(a).connect(Uf.destination),i.start(n),i.stop(n+.7)}})}var Zf=new H;function Qf(e,t,n,r,i,a){let o=2*Math.PI*i/4,s=Math.max(a-2*i,0),c=Math.PI/4;Zf.copy(t),Zf[r]=0,Zf.normalize();let l=.5*o/(o+s),u=1-Zf.angleTo(e)/c;return Math.sign(Zf[n])===1?u*l:s/(o+s)+l+l*(1-u)}var $f=class e extends So{constructor(e=1,t=1,n=1,r=2,i=.1){let a=r*2+1;if(i=Math.min(e/2,t/2,n/2,i),super(1,1,1,a,a,a),this.type=`RoundedBoxGeometry`,this.parameters={width:e,height:t,depth:n,segments:r,radius:i},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let s=new H,c=new H,l=new H(e,t,n).divideScalar(2).subScalar(i),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,m=new H,h=.5/a;for(let r=0,a=0;r<u.length;r+=3,a+=2)switch(s.fromArray(u,r),c.copy(s),c.x-=Math.sign(c.x)*h,c.y-=Math.sign(c.y)*h,c.z-=Math.sign(c.z)*h,c.normalize(),u[r+0]=l.x*Math.sign(s.x)+c.x*i,u[r+1]=l.y*Math.sign(s.y)+c.y*i,u[r+2]=l.z*Math.sign(s.z)+c.z*i,d[r+0]=c.x,d[r+1]=c.y,d[r+2]=c.z,Math.floor(r/p)){case 0:m.set(1,0,0),f[a+0]=Qf(m,c,`z`,`y`,i,n),f[a+1]=1-Qf(m,c,`y`,`z`,i,t);break;case 1:m.set(-1,0,0),f[a+0]=1-Qf(m,c,`z`,`y`,i,n),f[a+1]=1-Qf(m,c,`y`,`z`,i,t);break;case 2:m.set(0,1,0),f[a+0]=1-Qf(m,c,`x`,`z`,i,e),f[a+1]=Qf(m,c,`z`,`x`,i,n);break;case 3:m.set(0,-1,0),f[a+0]=1-Qf(m,c,`x`,`z`,i,e),f[a+1]=1-Qf(m,c,`z`,`x`,i,n);break;case 4:m.set(0,0,1),f[a+0]=1-Qf(m,c,`x`,`y`,i,e),f[a+1]=1-Qf(m,c,`y`,`x`,i,t);break;case 5:m.set(0,0,-1),f[a+0]=Qf(m,c,`x`,`y`,i,e),f[a+1]=1-Qf(m,c,`y`,`x`,i,t)}}static fromJSON(t){return new e(t.width,t.height,t.depth,t.segments,t.radius)}},ep=new Map,tp=new Map;function np(e,t){let n=ep.get(e);return n||(n=t(),ep.set(e,n)),n}function rp(e,t){let n=tp.get(e);return n||(n=t(),tp.set(e,n)),n}function q(e,t=.3){return rp(`gloss:${e}:${t}`,()=>new uc({color:e,roughness:t,clearcoat:1,clearcoatRoughness:.06}))}function ip(e,t=.7){return rp(`soft:${e}:${t}`,()=>new lc({color:e,roughness:t}))}function ap(e,t=`#ffffff`){return rp(`sheen:${e}:${t}`,()=>new uc({color:e,roughness:.62,sheen:1,sheenRoughness:.45,sheenColor:t}))}function op(e,t=.22){return rp(`metal:${e}:${t}`,()=>new lc({color:e,metalness:1,roughness:t}))}function sp(e,t=2){return rp(`glow:${e}:${t}`,()=>new lc({color:e,emissive:e,emissiveIntensity:t,roughness:.4}))}function cp(e=`#dff4ff`,t=.28){return rp(`glass:${e}:${t}`,()=>new uc({color:e,roughness:.04,metalness:0,clearcoat:1,clearcoatRoughness:.02,transparent:!0,opacity:t,depthWrite:!1,side:2,envMapIntensity:1.6}))}function lp(e=`#10141f`){return rp(`visor:${e}`,()=>new uc({color:e,roughness:.08,metalness:.2,clearcoat:1,clearcoatRoughness:.02,envMapIntensity:1.8}))}function up(e){return rp(`irid:${e}`,()=>new uc({color:e,roughness:.05,metalness:0,iridescence:1,iridescenceIOR:1.6,iridescenceThicknessRange:[200,800],clearcoat:1,transparent:!0,opacity:.55,depthWrite:!1}))}var dp=()=>np(`sphere`,()=>new Xs(1,32,22)),fp=()=>np(`sphereLo`,()=>new Xs(1,16,12)),pp=()=>np(`hemi`,()=>new Xs(1,32,12,0,Math.PI*2,0,Math.PI/2));function J(e,t,n,r,i=3){let a=Math.min(r,e/2-.001,t/2-.001,n/2-.001);return np(`rbox:${e}:${t}:${n}:${a}:${i}`,()=>new $f(e,t,n,i,a))}function mp(e,t,n,r=28,i=!1){return np(`cyl:${e}:${t}:${n}:${r}:${i}`,()=>new To(e,t,n,r,1,i))}function hp(e,t){return np(`cap:${e}:${t}`,()=>new Co(e,t,6,16))}function gp(e,t,n=Math.PI*2,r=12,i=40){return np(`torus:${e}:${t}:${n}:${r}:${i}`,()=>new Zs(e,t,r,i,n))}function _p(e,t,n=24,r=!1){return np(`cone:${e}:${t}:${n}:${r}`,()=>new Eo(e,t,n,1,r))}function Y(e,t,n=0,r=0,i=0,a){let o=new G(e,t);return o.position.set(n,r,i),o.castShadow=!0,o.receiveShadow=!0,a&&a.add(o),o}function X(e,t,n,r,i,a,o=!1){let s=Y(o?fp():dp(),t,n,r,i,a);return Array.isArray(e)?s.scale.set(e[0],e[1],e[2]):s.scale.setScalar(e),s}var vp=new H(0,1,0),yp=new H(0,0,1);function bp(e,t,n,r,i){let a=new H(e.x,e.y,e.z),o=new H(t.x,t.y,t.z),s=o.clone().sub(a),c=s.length(),l=Y(hp(n,Math.round(c*100)/100),r,0,0,0,i);return l.position.copy(a).add(o).multiplyScalar(.5),l.quaternion.setFromUnitVectors(vp,s.normalize()),l}function xp(e,t,n,r,i,a=0){let o=new H(Math.sin(r)*Math.cos(i),Math.sin(i),Math.cos(r)*Math.cos(i));return e.position.set(t.x,t.y,t.z).addScaledVector(o,n+a),e.quaternion.setFromUnitVectors(yp,o),e}function Sp(e,t,n){return new H(e,t,n)}var Cp=()=>sp(`#ffffff`,1.2);function wp(e=1,t=`#141826`){let n=new U;return X([.055*e,.072*e,.03*e],q(t,.12),0,0,0,n),X(.019*e,Cp(),.017*e,.027*e,.024*e,n,!0),X(.009*e,Cp(),-.018*e,-.022*e,.026*e,n,!0),n}function Tp(e,t,n){let r=Y(gp(e,t,Math.PI,8,20),n);return r.rotation.z=Math.PI,r}function Ep(e){let t=new G(fp(),rp(`blush`,()=>new lc({color:`#ff7aa2`,roughness:.6,transparent:!0,opacity:.55,depthWrite:!1})));return t.scale.set(e,e*.6,e*.2),t}function Dp(e,t,n,r={}){let i=r.spread??.36,a=r.eyePitch??.02;for(let o of[-1,1]){let s=wp(r.eyeSize??1);if(xp(s,t,n,o*i,a,-.008),e.add(s),r.cheeks!==!1){let r=Ep(.045);xp(r,t,n,o*(i+.22),-.22,-.004),e.add(r)}}if(r.mouth!==!1){let r=new U;r.add(Tp(.035,.009,q(`#3a1d2a`,.3))),xp(r,t,n,0,-.2,-.002),e.add(r)}}var Op=`#ffd2b0`,kp=Sp(0,1.55,.01),Ap=.28,jp=Sp(.45,.95,.2);function Mp(e){let t=new U;t.name=`head${e}`;let n=kp;switch(Y(mp(.085,.095,.12),ip(Op,.55),0,1.31,0,t),e){case 0:{X(.31000000000000005,q(`#f7f8fb`,.25),n.x,n.y,n.z,t),Y(np(`visorGeo`,()=>new Xs(1,32,16,Math.PI*.14,Math.PI*.72,Math.PI*.26,Math.PI*.42)),lp(),n.x,n.y,n.z,t).scale.setScalar(.32);for(let e of[-1,1]){let r=Y(hp(.025,.035),sp(`#5ff6ff`,2.5));xp(r,n,.325,e*.3,.06),t.add(r);let i=Y(mp(.085,.085,.08),q(`#ff8a3d`,.25),e*.33,n.y,n.z,t);i.rotation.z=Math.PI/2,X(.03,sp(`#ffe066`,1.8),e*.375,n.y,n.z,t,!0)}let e=new U;e.add(Tp(.04,.012,sp(`#5ff6ff`,2.5))),xp(e,n,.326,0,-.12),t.add(e),bp(Sp(.12,n.y+.25,-.05),Sp(.17,n.y+.42,-.06),.012,op(`#cfd6e3`),t),X(.035,sp(`#ff5f8f`,2),.17,n.y+.44,-.06,t,!0);break}case 1:{let e=q(`#c9b6ff`,.38);X([Ap,Ap*.95,Ap*.96],e,n.x,n.y,n.z,t);for(let r of[-1,1]){let i=Y(_p(.1,.2,20),e,r*.17,n.y+.24,n.z-.02,t);i.rotation.z=-r*.45;let a=Y(_p(.06,.12,16),q(`#ffa6c9`,.4),r*.175,n.y+.235,n.z+.035,t);a.rotation.z=-r*.45;for(let e of[-1,1]){let i=Y(mp(.004,.004,.14,6),ip(`#6b5a8e`),r*.26,n.y-.06+e*.025,n.z+.2,t);i.rotation.z=Math.PI/2+e*r*.15}}Dp(t,n,Ap*.96,{eyeSize:1.25,spread:.38}),xp(X([.022,.016,.014],q(`#ff7aa2`,.2),0,0,0,t,!0),n,Ap*.96,0,-.1,.004);let r=new U;X([.07,.05,.035],q(`#ff5f8f`,.25),-.06,0,0,r,!0).rotation.z=.3,X([.07,.05,.035],q(`#ff5f8f`,.25),.06,0,0,r,!0).rotation.z=-.3,X(.03,q(`#ff5f8f`,.25),0,0,.01,r,!0),xp(r,n,Ap,-.7,.75,.01),t.add(r);break}case 2:{Y(J(.56,.48,.5,.14,4),q(`#5fe0c0`,.28),n.x,n.y,n.z,t),Y(J(.44,.3,.06,.07,3),lp(`#0b1220`),n.x,n.y-.01,n.z+.235,t);for(let e of[-1,1]){let r=Y(gp(.045,.014,Math.PI,8,16),sp(`#7dfcff`,2.6),e*.1,n.y+.01,n.z+.27,t);r.rotation.z=0;let i=Y(mp(.07,.07,.06),q(`#ffd23f`,.25),e*.3,n.y,n.z,t);i.rotation.z=Math.PI/2,X(.025,sp(`#ff5f8f`,2),e*.12,n.y-.08,n.z+.268,t,!0)}let e=Y(gp(.04,.011,Math.PI,8,16),sp(`#7dfcff`,2.6),0,n.y-.07,n.z+.27,t);e.rotation.z=Math.PI,Y(mp(.012,.012,.16,8),op(`#d7dde8`),0,n.y+.31,n.z,t),X(.045,sp(`#ff5f8f`,2.2),0,n.y+.4,n.z,t,!0);break}case 4:{let e=Ap*1.32,r=Sp(n.x,n.y-.02,n.z);X([e*1.06,e*.95,e*1.02],q(`#ff5c8d`,.14),r.x,r.y,r.z,t),Dp(t,r,e*1,{eyeSize:1.45,spread:.36});let i=new U,a=op(`#ffcf4a`,.16);Y(mp(.17,.15,.09,24),a,0,0,0,i);for(let e=0;e<5;e++){let t=e/5*Math.PI*2;Y(_p(.04,.12,10),a,Math.cos(t)*.14,.09,Math.sin(t)*.14,i),X(.028,e===0?q(`#ff3b55`,.1):q(`#ffffff`,.15),Math.cos(t)*.14,.16,Math.sin(t)*.14,i,!0)}i.position.set(.06,r.y+e*.92,r.z-.02),i.rotation.z=-.18,t.add(i);break}case 5:Y(J(.56,.48,.52,.16,4),q(`#f5f6fa`,.24),n.x,n.y,n.z,t),Y(J(.46,.23,.12,.08,3),lp(`#0a0d14`),n.x,n.y+.02,n.z+.22,t);for(let e of[-1,1]){let r=Y(J(.1,.036,.02,.012,2),sp(`#00f0ff`,3),e*.11,n.y+.03,n.z+.285,t);r.rotation.z=-e*.28,r.castShadow=!1;let i=Y(mp(.08,.08,.06,20),op(`#e8875f`,.3),e*.29,n.y,n.z,t);i.rotation.z=Math.PI/2}Y(J(.06,.16,.34,.03),q(`#ff5376`,.28),0,n.y+.28,n.z-.04,t);break;default:{X(Ap,q(Op,.45),n.x,n.y,n.z,t),Dp(t,n,Ap,{eyeSize:1.15,spread:.34,eyePitch:0});let e=q(`#ff4d5e`,.28),r=Y(pp(),e,n.x,n.y+.03,n.z-.01,t);r.scale.set(.30500000000000005,Ap*.95,.30500000000000005),r.rotation.x=-.18;let i=Y(mp(.2,.2,.025,28),e,0,n.y+.1,n.z+.27,t);i.scale.set(1,1,.7),i.rotation.x=.12,X(.035,q(`#ffffff`,.3),0,n.y+.32,n.z-.04,t,!0),Y(J(.12,.06,.02,.01),q(`#ffffff`,.3),0,n.y+.2,n.z+.255,t).rotation.x=-.35;for(let e of[-1,1])X([.09,.05,.06],q(`#6b3f2a`,.4),e*.24,n.y+.02,n.z-.06,t,!0),X(.05,q(Op,.45),e*.285,n.y-.02,n.z,t,!0)}}return t}function Np(e,t,n,r=.085){bp(Sp(-.36,1.17,0),Sp(-.44,.84,.03),r,t,e),X(.09,n,-.45,.79,.04,e);let i=Sp(.43,.97,-.05);bp(Sp(.36,1.17,0),i,r,t,e),bp(i,jp.clone().add(Sp(0,0,-.06)),r*.95,t,e),X(.088,n,jp.x,jp.y,jp.z,e);for(let n of[-1,1])X(r*1.18,t,n*.35,1.18,0,e)}function Pp(e){let t=new U;t.name=`body${e}`;let n=(e,n=.32)=>Y(J(.6,.62,.42,.17,4),q(e,n),0,.97,0,t);switch(e){case 0:n(`#f5f6fa`,.3),Y(J(.36,.26,.06,.06),q(`#ff8a3d`,.25),0,1.04,.2,t),[`#5ff6ff`,`#ffe066`,`#ff5f8f`].forEach((e,n)=>{let r=Y(mp(.028,.028,.02,16),sp(e,2),-.09+n*.09,1.06,.235,t);r.rotation.x=Math.PI/2}),Y(J(.62,.08,.44,.04),q(`#2c3548`,.3),0,.72,0,t),Y(J(.1,.07,.04,.02),op(`#e9edf5`,.15),0,.72,.22,t),Y(gp(.13,.04),q(`#d6dbe6`,.25),0,1.28,0,t).rotation.x=Math.PI/2,Np(t,q(`#f5f6fa`,.3),q(`#ff8a3d`,.3));break;case 1:{n(`#2f6bff`,.28);let e=Y(J(.46,.34,.1,.08),q(`#ffd23f`,.18),0,1.04,.18,t);e.rotation.x=-.06;let r=Y(mp(.06,.06,.03,5),sp(`#ffffff`,1.4),0,1.05,.24,t);r.rotation.x=Math.PI/2;for(let e of[-1,1]){let n=X([.16,.11,.16],q(`#ffd23f`,.18),e*.36,1.22,0,t);n.rotation.z=-e*.35}Y(J(.62,.08,.44,.04),q(`#16245a`,.3),0,.72,0,t);let i=Y(J(.52,.66,.04,.02),ap(`#ff4d5e`,`#ffc0c8`),0,.92,-.24,t);i.rotation.x=.12,Np(t,q(`#2f6bff`,.28),q(`#ffffff`,.35));break}case 2:{let e=ap(`#ff7eb6`,`#ffd6ea`);Y(J(.62,.62,.43,.18,4),e,0,.97,0,t),Y(J(.34,.15,.05,.05),ap(`#ff5fa2`,`#ffd6ea`),0,.82,.2,t);let n=Y(gp(.17,.07),e,0,1.28,-.05,t);n.rotation.x=Math.PI/2-.3;for(let e of[-1,1])Y(mp(.008,.008,.16,6),ip(`#ffffff`),e*.05,1.13,.22,t),X(.016,q(`#ffffff`),e*.05,1.05,.22,t,!0);Y(J(.63,.07,.44,.03),ap(`#ff5fa2`),0,.69,0,t),Np(t,e,q(Op,.45));break}case 4:n(`#262a3d`,.22),Y(J(.2,.5,.05,.04),q(`#ffffff`,.3),0,1,.2,t);for(let e of[-1,1]){let n=Y(J(.12,.36,.04,.02),q(`#3a3f58`,.18),e*.15,1.08,.205,t);n.rotation.z=e*.35;let r=Y(_p(.06,.12,16),q(`#ff3b55`,.2),e*.065,1.23,.24,t);r.rotation.z=e*Math.PI/2}X(.032,q(`#ff3b55`,.2),0,1.23,.245,t,!0);for(let e of[1.08,.96,.84])X(.018,q(`#262a3d`,.2),0,e,.228,t,!0);Y(J(.62,.08,.44,.04),q(`#16182a`,.3),0,.72,0,t),Np(t,q(`#262a3d`,.22),q(`#ffffff`,.35));break;case 5:{let e=ap(`#fbfbff`,`#ffffff`);Y(J(.6,.62,.42,.17,4),e,0,.97,0,t);for(let e=0;e<3;e++)Y(J(.615,.055,.435,.025),q(`#24408f`,.3),0,.8+e*.15,0,t);Y(J(.5,.2,.06,.04),q(`#24408f`,.3),0,1.2,-.21,t);let n=X([.07,.05,.04],q(`#ff4d5e`,.22),0,1.16,.22,t,!0);n.castShadow=!1;for(let e of[-1,1]){let n=Y(_p(.05,.16,12),q(`#ff4d5e`,.22),e*.04,1.06,.225,t);n.rotation.z=Math.PI+e*.3}Np(t,e,q(Op,.45));break}default:n(`#7ad151`,.3),Y(J(.5,.42,.06,.1),q(`#2c3548`,.3),0,1,.195,t),Y(J(.06,.4,.07,.03),op(`#e9edf5`,.15),0,1,.22,t);for(let e of[-1,1])Y(J(.07,.6,.46,.03),q(`#2c3548`,.3),e*.18,1,0,t);Y(J(.44,.42,.14,.06),q(`#e9edf5`,.25),0,1.02,-.26,t);for(let e of[-1,1]){Y(hp(.09,.3),q(`#ff8a3d`,.22),e*.13,1,-.35,t),Y(_p(.07,.08,16),op(`#9aa6b8`),e*.13,.78,-.35,t).rotation.x=Math.PI;let n=Y(_p(.055,.18,16),sp(`#ffb347`,3),e*.13,.66,-.35,t);n.rotation.x=Math.PI,n.castShadow=!1}Np(t,q(`#7ad151`,.3),q(`#2c3548`,.35))}return t}function Fp(e){let t=new U;t.name=`legs${e}`;let n=e=>Y(J(.5,.24,.38,.1),e,0,.6,0,t),r=(e,n,r,i=.14)=>{Y(J(.21,i,.32,.07,3),n,e*.14,i/2+.03,.05,t),Y(J(.22,.05,.34,.025),r,e*.14,.025,.05,t)};switch(e){case 0:{let e=q(`#f5f6fa`,.32);n(e);for(let n of[-1,1])bp(Sp(n*.14,.56,0),Sp(n*.14,.2,0),.105,e,t),X([.11,.06,.11],q(`#ff8a3d`,.3),n*.14,.38,.02,t),r(n,q(`#ff8a3d`,.25),q(`#2c3548`,.5),.18);break}case 1:{let e=ap(`#26335f`,`#7a8cd6`);n(e);for(let n of[-1,1])bp(Sp(n*.14,.56,0),Sp(n*.14,.2,0),.1,e,t),r(n,q(`#ff4d5e`,.25),q(`#ffffff`,.4)),Y(J(.1,.02,.12,.008),q(`#ffffff`,.3),n*.14,.175,.1,t);break}case 2:{n(q(`#d7dde8`,.25));let e=op(`#b9c3d3`,.2);for(let n of[-1,1]){bp(Sp(n*.14,.55,0),Sp(n*.14,.36,0),.07,e,t),X(.085,q(`#5fe0c0`,.25),n*.14,.34,.01,t),bp(Sp(n*.14,.32,0),Sp(n*.14,.14,0),.06,e,t);let r=X([.13,.08,.17],q(`#5fe0c0`,.25),n*.14,.08,.05,t);r.scale.y=.08;let i=Y(gp(.12,.012,Math.PI*2,8,32),sp(`#7dfcff`,2.4),n*.14,.02,.05,t);i.rotation.x=Math.PI/2,i.scale.set(1,1.35,1)}break}case 4:{n(q(`#ff7eb6`,.22));let e=np(`coil`,()=>{let e=[];for(let t=0;t<=90;t++){let n=t/90,r=n*Math.PI*2*5;e.push(new H(Math.cos(r)*.09,.52-n*.36,Math.sin(r)*.09))}return new Qs(new Lo(e),180,.024,8,!1)});for(let n of[-1,1])Y(e,op(`#ffd23f`,.18),n*.14,0,0,t),Y(mp(.11,.11,.05,24),q(`#ff7eb6`,.22),n*.14,.53,0,t),r(n,q(`#ff7eb6`,.22),q(`#ffffff`,.4));break}case 5:{let e=q(`#b388ff`,.3);n(e);for(let n of[-1,1]){bp(Sp(n*.14,.56,0),Sp(n*.14,.26,0),.095,e,t),Y(J(.22,.2,.32,.08,3),q(`#ffffff`,.25),n*.14,.2,.04,t),Y(J(.12,.04,.3,.02),op(`#d7dde8`,.2),n*.14,.085,.04,t);for(let e of[-.07,.15]){let r=Y(gp(.045,.024,Math.PI*2,10,20),q(`#ff4fa3`,.15),n*.14,.05,e,t);r.rotation.y=Math.PI/2}}break}default:n(ap(`#ffc93c`,`#fff1b8`));for(let e of[-1,1])bp(Sp(e*.15,.56,0),Sp(e*.15,.44,0),.12,ap(`#ffc93c`,`#fff1b8`),t),bp(Sp(e*.14,.42,0),Sp(e*.14,.24,0),.075,q(Op,.45),t),Y(mp(.085,.08,.12,20),ip(`#ffffff`,.6),e*.14,.2,0,t),Y(gp(.085,.012,Math.PI*2,8,24),q(`#3ec5ff`),e*.14,.24,0,t).rotation.x=Math.PI/2,r(e,q(`#3ec5ff`,.25),q(`#ffffff`,.4))}return t}function Ip(e){let t=new U;t.name=`gun${e}`;let n=jp,r=e=>{let r=Y(J(.07,.2,.1,.03),e,n.x,n.y-.04,n.z,t);r.rotation.x=-.25},i=(e,r,i,a=n.y+.08)=>{let o=Y(e,r,n.x,a,i,t);return o.rotation.x=Math.PI/2,o};switch(e){case 0:r(q(`#2f6bff`,.3)),Y(J(.13,.15,.42,.06),q(`#ff8a3d`,.22),n.x,n.y+.08,n.z+.12,t),i(mp(.04,.045,.22),q(`#ffd23f`,.22),n.z+.42),i(gp(.05,.018),q(`#2f6bff`,.25),n.z+.53),X(.085,cp(`#7fe3ff`,.55),n.x,n.y+.21,n.z+.1,t),X(.06,sp(`#3ec5ff`,.8),n.x,n.y+.19,n.z+.1,t,!0),Y(J(.04,.06,.08,.015),q(`#ffd23f`,.3),n.x,n.y-.01,n.z+.09,t);break;case 1:{r(q(`#ff4d5e`,.25)),X([.1,.1,.16],op(`#e6ebf3`,.12),n.x,n.y+.09,n.z+.08,t),i(mp(.035,.05,.3),op(`#e6ebf3`,.12),n.z+.32,n.y+.09);for(let e=0;e<3;e++)i(gp(.06-e*.006,.014),sp(`#b388ff`,2.4),n.z+.24+e*.08,n.y+.09);X(.04,sp(`#7dfcff`,3),n.x,n.y+.09,n.z+.49,t,!0);let e=Y(J(.02,.12,.14,.01),q(`#ff4d5e`,.25),n.x,n.y+.2,n.z+.04,t);e.rotation.x=-.4;break}case 2:{r(q(`#2c3548`,.3)),Y(J(.16,.18,.46,.07),q(`#9cff57`,.22),n.x,n.y+.09,n.z+.14,t);let e=Y(hp(.065,.16),cp(`#d4ffe0`,.4),n.x,n.y+.25,n.z+.1,t);e.rotation.x=Math.PI/2;let a=Y(hp(.05,.14),sp(`#5dff7a`,1.4),n.x,n.y+.24,n.z+.1,t);a.rotation.x=Math.PI/2,i(mp(.085,.07,.14),q(`#2c3548`,.3),n.z+.43,n.y+.09),i(gp(.08,.02),sp(`#5dff7a`,2.2),n.z+.5,n.y+.09);break}case 4:r(q(`#2c3548`,.3)),Y(hp(.09,.2),q(`#3ec5ff`,.22),n.x,n.y+.09,n.z+.08,t).rotation.x=Math.PI/2;for(let e=0;e<4;e++){let r=e/4*Math.PI*2,i=Y(mp(.022,.022,.34,10),op(`#e6ebf3`,.12),n.x+Math.cos(r)*.05,n.y+.09+Math.sin(r)*.05,n.z+.36,t);i.rotation.x=Math.PI/2}i(gp(.075,.016),sp(`#ffd23f`,2.2),n.z+.5,n.y+.09),i(gp(.075,.016),q(`#3ec5ff`,.22),n.z+.24,n.y+.09);break;case 5:r(q(`#ffd23f`,.25)),Y(J(.22,.14,.36,.06),q(`#7d5cff`,.22),n.x,n.y+.08,n.z+.1,t);for(let e of[-1,1])i(mp(.035,.04,.3),op(`#e6ebf3`,.12),n.z+.38,n.y+.09).position.x=n.x+e*.055,X(.03,sp(`#5dff7a`,2.4),n.x+e*.055,n.y+.09,n.z+.54,t,!0);break;default:{r(q(`#ffffff`,.3)),Y(J(.12,.13,.36,.06),q(`#b388ff`,.22),n.x,n.y+.08,n.z+.1,t),i(mp(.03,.03,.16),q(`#ff7eb6`,.22),n.z+.34);let e=Y(gp(.08,.016),q(`#ff7eb6`,.2),n.x,n.y+.08,n.z+.44,t);e.rotation.x=0;let a=Y(np(`disc`,()=>new wo(1,24)),up(`#ffffff`),n.x,n.y+.08,n.z+.44,t);a.scale.setScalar(.075),a.castShadow=!1;for(let[e,r,i,a]of[[.04,.2,.62,.06],[-.05,.3,.75,.045],[.06,.4,.86,.035]]){let o=X(a,up(`#ffffff`),n.x+e,n.y+r-.1,n.z+i-.1,t);o.castShadow=!1}}}return t}function Lp(e,t){let n=(t%6+6)%6;switch(e){case`head`:return Mp(n);case`body`:return Pp(n);case`legs`:return Fp(n);default:return Ip(n)}}function Rp(e){let t=e*2654435761>>>0||1;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function zp(e){let t=Math.max(Math.cos(e),0),n=Math.sin(e);return{x:.55*t**.62,y:.3+(n<0?.3*n:.62*n)}}var Bp=[`#6ff59a`,`#ff8fbf`,`#71ceff`,`#ffcf4a`,`#b89cff`,`#ff9f6b`,`#5fe8dd`];function Vp(e){let t=Rp(e+7),n=new U;n.name=`pyshka${e}`;let r=new W(Bp[Math.abs(e)%Bp.length]);r.offsetHSL((t()-.5)*.04,0,(t()-.5)*.04);let i=rp(`slime:${r.getHexString()}`,()=>{let e=r.clone().lerp(new W(`#ffffff`),.6);return new uc({color:r,roughness:.22,clearcoat:1,clearcoatRoughness:.04,sheen:.6,sheenColor:e,sheenRoughness:.35,emissive:r,emissiveIntensity:.14,envMapIntensity:1.2})}),a=np(`bun`,()=>{let e=[];for(let t=0;t<=28;t++){let n=zp(-Math.PI/2+Math.PI*t/28);e.push(new V(Math.max(n.x,1e-4),n.y))}let t=new Ks(e,44);return t.computeVertexNormals(),t}),o=new U;o.name=`squish`,n.add(o);let s=1+(t()-.5)*.12;Y(a,i,0,0,0,o).scale.set(s,.92+t()*.16,s);let c=Y(gp(.47,.09,Math.PI*2,10,44),i,0,.04,0,o);c.rotation.x=Math.PI/2,c.scale.set(s,s,.45);let l=X([.11,.15,.11],i,.03,.9,0,o);l.rotation.z=-.5,X(.06,i,.1,1,0,o,!0);let u=.5,d=e=>zp(Math.asin(Math.min((e-.3)/.62,1))).x*s,f=d(u),p=e%5==3?2:+(e%5==1),m=2.1+t()*.4;for(let e of[-1,1]){let t=e*.33,n=Sp(Math.sin(t)*f,u,Math.cos(t)*f),r=Sp(Math.sin(t),.18,Math.cos(t)).normalize(),i;if(p===2){i=new U;let e=Y(gp(.075,.02,Math.PI,8,16),q(`#1d1630`,.2));i.add(e)}else i=wp(m);i.position.copy(n).addScaledVector(r,-.01),i.quaternion.setFromUnitVectors(yp,r),i.name=`studio-eye`,o.add(i);let a=Ep(.075),s=e*.55,c=d(.4)-.012;a.position.set(Math.sin(s)*c,.4,Math.cos(s)*c),a.quaternion.setFromUnitVectors(yp,Sp(Math.sin(s),0,Math.cos(s))),o.add(a)}let h=new U;p===1?(X([.055,.065,.025],q(`#3a1d2a`,.2),0,0,0,h,!0),X([.035,.02,.012],q(`#ff7aa2`,.3),0,-.022,.012,h,!0)):h.add(Tp(.07,.016,q(`#3a1d2a`,.3))),h.position.set(0,.38,d(.38)-.008),h.quaternion.setFromUnitVectors(yp,Sp(0,-.1,1).normalize()),h.name=`studio-mouth`,o.add(h);let g=Math.floor(t()*4);if(g===0){Y(mp(.012,.015,.14,8),ip(`#3fae5a`,.5),-.05,1,0,o);for(let e of[-1,1]){let t=X([.09,.025,.05],q(`#5cd36f`,.3),-.05+e*.08,1.08,0,o,!0);t.rotation.z=e*.4}}else if(g===1){let e=new U;Y(mp(.11,.1,.07,20,!0),op(`#ffcf4a`,.18),0,0,0,e).material=rp(`crownM`,()=>{let e=op(`#ffcf4a`,.18).clone();return e.side=2,e});for(let t=0;t<5;t++){let n=t/5*Math.PI*2;X(.025,q(`#ff5f8f`,.15),Math.cos(n)*.105,.06,Math.sin(n)*.105,e,!0)}e.position.set(-.12,.86,-.02),e.rotation.z=.25,o.add(e)}else if(g===2){let e=new U;X([.08,.055,.04],q(`#ffffff`,.25),-.07,0,0,e,!0).rotation.z=.35,X([.08,.055,.04],q(`#ffffff`,.25),.07,0,0,e,!0).rotation.z=-.35,X(.035,q(`#ffffff`,.25),0,0,.01,e,!0),e.position.set(-.25,.8,.2),e.rotation.set(-.4,-.5,.3),o.add(e)}return n}function Hp(e,t,n,r=8){let i=[],a=e/2-n,o=t/2-n;return[[a,o],[-a,o],[-a,-o],[a,-o]].forEach(([e,t],a)=>{for(let o=0;o<=r;o++){let s=(a+o/r)*(Math.PI/2),c=Math.cos(s),l=Math.sin(s);i.push({x:e+c*n,z:t+l*n,nx:c,nz:l})}}),i}function Up(e,t,n,r,i=1){return np(`ribbon:${e}:${t}:${n}:${r}:${i}`,()=>{let a=Hp(e,t,n);a.push(a[0]);let o=[],s=[],c=[],l=[],u=0;a.forEach((e,t)=>{if(t>0&&(u+=Math.hypot(e.x-a[t-1].x,e.z-a[t-1].z)),o.push(e.x,0,e.z,e.x,r,e.z),s.push(e.nx,0,e.nz,e.nx,0,e.nz),c.push(u/i,0,u/i,1),t>0){let e=(t-1)*2,n=t*2;l.push(e,e+1,n,n,e+1,n+1)}});let d=new Aa;return d.setAttribute(`position`,new va(o,3)),d.setAttribute(`normal`,new va(s,3)),d.setAttribute(`uv`,new va(c,2)),d.setIndex(l),d})}function Wp(e,t,n,r=0,i=0){let a=new is,o=r-e/2,s=r+e/2,c=i-t/2,l=i+t/2;return a.moveTo(o+n,c),a.lineTo(s-n,c),a.absarc(s-n,c+n,n,-Math.PI/2,0,!1),a.lineTo(s,l-n),a.absarc(s-n,l-n,n,0,Math.PI/2,!1),a.lineTo(o+n,l),a.absarc(o+n,l-n,n,Math.PI/2,Math.PI,!1),a.lineTo(o,c+n),a.absarc(o+n,c+n,n,Math.PI,Math.PI*1.5,!1),a}function Gp(e,t,n,r,i=.1,a){return np(`slab:${e}:${t}:${n}:${r}:${i}:${a}`,()=>{let o=Wp(e,t,n);a&&o.holes.push(Wp(a[0],a[1],a[2]));let s=new Hs(o,{depth:Math.max(r-i*2,.001),bevelEnabled:i>0,bevelThickness:i,bevelSize:i,bevelSegments:3,curveSegments:10});return s.rotateX(-Math.PI/2),s.translate(0,i,0),s.computeVertexNormals(),s})}function Kp(e,t,n){return np(`flat:${e}:${t}:${n}`,()=>{let r=new Js(Wp(e,t,n),10);return r.rotateX(-Math.PI/2),r})}function qp(e,t,n,r=!0){let i=document.createElement(`canvas`);i.width=e,i.height=t,n(i.getContext(`2d`));let a=new vo(i);return r&&(a.colorSpace=zn),a.wrapS=a.wrapT=gt,a.anisotropy=4,a}function Jp(e){let t=Rp(e*31+3);return qp(1024,256,e=>{let n=1024;for(let n=0;n<8;n++){let r=n*128,i=t(),a=e.createLinearGradient(0,0,0,256);i>.45?(a.addColorStop(0,`#fff1d6`),a.addColorStop(.35,`#ffd9a6`),a.addColorStop(1,`#f2b98a`)):(a.addColorStop(0,`#cfe9ff`),a.addColorStop(.5,`#8cc7f2`),a.addColorStop(1,`#5a9ad6`)),e.fillStyle=a,e.fillRect(r,0,128,256),i>.45&&(e.fillStyle=`rgba(255,255,255,0.85)`,e.fillRect(r+14,10,100,8)),t()>.5&&(e.fillStyle=i>.45?`rgba(90,170,90,0.75)`:`rgba(60,120,110,0.5)`,e.beginPath(),e.arc(r+25+t()*78,186,22+t()*10,0,Math.PI*2),e.fill(),e.fillRect(r+20+t()*88,200,10,40)),t()>.55&&(e.fillStyle=`rgba(255,255,255,0.35)`,e.fillRect(r+10,192,108,30))}let r=e.createLinearGradient(0,0,n,256);r.addColorStop(0,`rgba(255,255,255,0.35)`),r.addColorStop(.3,`rgba(255,255,255,0.0)`),r.addColorStop(.55,`rgba(255,255,255,0.22)`),r.addColorStop(.62,`rgba(255,255,255,0.0)`),r.addColorStop(1,`rgba(255,255,255,0.18)`),e.fillStyle=r,e.fillRect(0,0,n,256),e.fillStyle=`#f4f7fb`;for(let t=0;t<=8;t++)e.fillRect(t*128-4,0,8,256);e.fillRect(0,244,n,12),e.fillStyle=`rgba(255,255,255,0.7)`,e.fillRect(0,184.32,n,3)})}function Yp(){return qp(256,256,e=>{e.fillStyle=`#000`,e.fillRect(0,0,256,256);let t=Rp(99);e.strokeStyle=`rgba(255,255,255,0.75)`,e.lineCap=`round`;for(let n=0;n<70;n++){e.lineWidth=1.5+t()*2.5;let n=t()*256,r=t()*256,i=10+t()*22;e.beginPath(),e.arc(n,r,i,t()*6,t()*6+1.6+t()*1.5),e.stroke()}})}var Xp=null;function Zp(e,t=.5){return rp(`water:${e}:${t}`,()=>{Xp??(Xp=Yp());let n=Xp.clone();return n.needsUpdate=!0,n.repeat.set(2,2),new uc({color:e,roughness:.04,clearcoat:1,clearcoatRoughness:0,emissive:`#d9fbff`,emissiveMap:n,emissiveIntensity:t,envMapIntensity:1.4})})}function Qp(e,t){e.userData.tick=t}function $p(e){let t=new U,n=q(`#ffffff`,.3);Y(J(.75,.12,1.5,.05),n,0,.32,.2,t);let r=Y(J(.75,.1,.75,.05),n,0,.5,-.78,t);r.rotation.x=-.55,Y(J(.66,.07,1.4,.035),ap(e),0,.41,.2,t);let i=Y(J(.66,.07,.66,.035),ap(e),0,.57,-.74,t);i.rotation.x=-.55;for(let e of[-1,1])for(let n of[-.4,.8])Y(mp(.03,.03,.28,10),op(`#c7cfdb`),e*.3,.14,n,t);return t}function em(e){let t=new U;Y(mp(.04,.04,2.3,10),op(`#e6ebf3`,.2),0,1.15,0,t);let n=Y(_p(1.25,.45,24,!0),rp(`umb:${e}`,()=>new uc({color:e,roughness:.5,sheen:1,sheenColor:`#ffffff`,side:2})),0,2.25,0,t);return n.castShadow=!0,X(.07,q(`#ffffff`),0,2.5,0,t,!0),Y(mp(.25,.3,.12,20),q(`#ffffff`,.3),0,.06,0,t),t}function tm(e=.55,t=`#57c46a`){let n=new U;return Y(mp(e,e*.8,e*.9,24),q(`#f4f1ea`,.35),0,e*.45,0,n),X([e*.95,e*.8,e*.95],ap(t,`#d8ffc8`),0,e*1.2,0,n),X(e*.55,ap(`#7ad97a`,`#e8ffd8`),e*.35,e*1.6,e*.2,n),n}function nm(){let e=new U;e.name=`skyscraper`;let t=12.2,n=.4,r=4.6,i=3.2,a=.5,o=q(`#fbfbfd`,.32),s=ip(`#ece8e1`,.55);Y(Gp(16,16,3,n,.12),s,0,0,0,e);for(let t=0;t<2;t++)Y(J(6-t*.6,.14,1,.05),s,0,.07+t*.14,8.3-t*.5,e);let c=new U;c.position.y=n,e.add(c),Y(Kp(11.6,11.6,1.4),ip(`#f6efe6`,.4),0,.01,0,c).receiveShadow=!0;let l=Y(Up(11.6,11.6,1.4,r),cp(`#e8f7ff`,.22),0,0,0,c);l.castShadow=!1,Y(J(3.4,1,.9,.3),o,0,.5,-1.2,c),Y(J(3.5,.08,1,.04),ip(`#c8946a`,.45),0,1.03,-1.2,c);for(let e of[-1,1]){Y(J(1.8,.45,.8,.2),ap(`#ff8fbf`,`#ffe0ef`),e*3.4,.3,2.6,c),Y(J(1.8,.5,.25,.12),ap(`#ff8fbf`,`#ffe0ef`),e*3.4,.65,2.9,c);let t=tm(.6);t.position.set(e*4.2,0,-3.8),c.add(t);for(let t=0;t<3;t++)Y(mp(.01,.01,1.4,4),op(`#9aa6b8`),e*(1.2+t*1.1),3.8999999999999995,.8,c),X(.22,sp(`#ffe2b0`,1.6),e*(1.2+t*1.1),3.1499999999999995,.8,c,!0).castShadow=!1}for(let e of Hp(12.2,12.2,1.8000000000000003,1))Math.abs(e.nx)>.2&&Math.abs(e.nz)>.2||Y(mp(.18,.18,r,20),o,e.x,r/2,e.z,c);for(let e of[-1,1])Y(mp(.16,.16,r,20),o,e*2.4,r/2,13/2-.4,c);Y(mp(1,1,2.8,28,!0),cp(`#e8f7ff`,.3),0,1.4,t/2-.3,c).castShadow=!1,Y(mp(1.08,1.08,.25,28),o,0,2.92,t/2-.3,c);let u=Y(J(1.9,2.6,.05,.02),cp(`#cfeeff`,.35),0,1.35,t/2-.3,c);u.castShadow=!1,Qp(u,e=>u.rotation.y=e*.6),Y(J(7.2,.28,3.4,.14),o,0,3.9999999999999996,7.5,c);let d=qp(1024,128,e=>{e.fillStyle=`#ffffff`,e.fillRect(0,0,1024,128);let t=e.createLinearGradient(0,0,1024,0);t.addColorStop(0,`#2f6bff`),t.addColorStop(.5,`#b388ff`),t.addColorStop(1,`#ff7eb6`),e.fillStyle=t,e.font=`800 84px -apple-system, "SF Pro Display", "Helvetica Neue", Arial, sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(`SLIME  TOWER`,512,68)});d.wrapS=d.wrapT=_t;let f=Y(np(`signPlane`,()=>new qs(6.4,.8)),new lc({map:d,emissive:`#ffffff`,emissiveMap:d,emissiveIntensity:.35,roughness:.4}),0,4.449999999999999,9.120000000000001,c);f.castShadow=!1,Y(J(6.6,.95,.16,.08),o,0,4.449999999999999,9.02,c);let p=[0,1,2].map(e=>rp(`facade${e}`,()=>{let t=Jp(e);return new uc({map:t,emissive:`#ffffff`,emissiveMap:t,emissiveIntensity:.28,roughness:.12,metalness:.15,clearcoat:1,clearcoatRoughness:.02,envMapIntensity:1.3})})),m=[],h=new ei,g=new Ar,_=Rp(5);for(let n=0;n<=9;n++){let r=5+n*i;if(Y(Gp(13,13,2.2,a,.14),o,0,r-a/2,0,e),n<9){let i=Y(Up(t,t,1.7,2.7,12.8),p[n%3],0,r+a/2,0,e);i.castShadow=n===0}if(n%3==2){for(let e of Hp(12.65,12.65,2,3))for(let t=0;t<2;t++){let n=.28+_()*.14,i=(_()-.5)*.4;h.compose(new H(e.x-e.nz*i*t,r+a/2+n*.4,e.z+e.nx*i*t),g,new H(n,n*.8,n)),m.push(h.clone())}let e=12.65/2;for(let t=-4.125;t<=4.125;t+=.55)for(let[n,i]of[[t,e],[t,-6.325],[e,t],[-6.325,t]]){if(n>6.2250000000000005&&Math.abs(i)<1.3)continue;let e=.26+_()*.14;h.compose(new H(n,r+a/2+e*.4,i),g,new H(e,e*.8,e)),m.push(h.clone())}}}let v=new fo(fp(),ap(`#5cc96b`,`#e0ffd0`),m.length);m.forEach((e,t)=>v.setMatrixAt(t,e));let y=new W;for(let e=0;e<m.length;e++)v.setColorAt(e,y.setHSL(.3+_()*.06,.55,.42+_()*.12));v.castShadow=!0,v.receiveShadow=!0,e.add(v);let b=7.55,x=.95,S=37.25,C=Y(mp(x,x,36.85,32,!0),cp(`#e3f6ff`,.2),b,37.65/2,0,e);C.castShadow=!1;for(let t of[-1,1])Y(mp(.05,.05,36.85,8),op(`#d7dde8`),8.1,37.65/2,t*.5,e);for(let t=0;t<=10;t++){let n=t===0?.5:t<=9?5+(t-1)*i:S,r=Y(gp(x,.08,Math.PI*2,10,40),o,b,n,0,e);r.rotation.x=Math.PI/2,t>0&&t<=9&&Y(J(1.2,.4,1.6,.12),o,13/2-.1,n,0,e)}Y(pp(),q(`#ffffff`,.25),b,S,0,e).scale.set(1.03,.7,1.03),X(.16,sp(`#ff5f8f`,2.2),b,38.05,0,e,!0);let w=new U;Y(mp(.75,.75,1.9,28),q(`#ffcf4a`,.22),0,0,0,w),Y(mp(.77,.77,.9,28),sp(`#fff4d6`,.9),0,.15,0,w).castShadow=!1,Y(mp(.8,.8,.1,28),o,0,.98,0,w),Y(mp(.8,.8,.1,28),o,0,-.98,0,w),w.name=`showcase-cabin`,w.position.set(b,10,0),e.add(w),Qp(w,e=>{let t=.5-.5*Math.cos(e*.25),n=t*t*(3-2*t);w.position.y=1.5+33.65*n});let T=new U;T.position.y=34.05,e.add(T),Y(Kp(12.5,12.5,1.9500000000000002),ip(`#d9b48f`,.55),0,.01,0,T);for(let e=-5;e<=5;e++)Y(J(.04,.012,11.4,.005),ip(`#c49c76`,.6),e*1.05,.02,0,T).castShadow=!1;let E=Y(Up(12.75,12.75,2.08,1.1),cp(`#e8f8ff`,.25),0,0,0,T);E.castShadow=!1,Y(new Qs(new Lo(Hp(12.75,12.75,2.08,8).map(e=>new H(e.x,1.12,e.z)),!0),160,.05,8,!0),o,0,0,0,T);let D=6.2,O=3.4,k=new U;k.position.set(-2.3,0,-2.6),T.add(k),Y(Gp(7,4.2,1.3,.3,.08,[D,O,.95]),o,0,0,0,k);let A=Y(Kp(D,O,.95),Zp(`#29c4f2`,.55),0,.22,0,k);A.castShadow=!1;let j=A.material;Qp(A,e=>{j.emissiveMap.offset.set(e*.03,e*.017)});for(let e of[-1,1]){let t=Y(gp(.22,.03,Math.PI,8,16),op(`#e6ebf3`,.15),D/2-.9+e*.25,.3,1.78,k);t.rotation.y=Math.PI/2}let M=new U;M.position.set(2.7,0,-3.4),T.add(M),Y(mp(1.35,1.4,.55,36),q(`#ffffff`,.28),0,.27,0,M);let N=Y(gp(1.3,.12,Math.PI*2,10,48),q(`#ffffff`,.28),0,.55,0,M);N.rotation.x=Math.PI/2;let P=Y(np(`disc`,()=>new wo(1,24)),Zp(`#5ff0e0`,.8),0,.5,0,M);P.rotation.x=-Math.PI/2,P.scale.setScalar(1.22);let ee=new fo(fp(),q(`#ffffff`,.1),26),te=Rp(11),ne=[];for(let e=0;e<26;e++){let e=te()*Math.PI*2,t=Math.sqrt(te())*1.05;ne.push(new H(Math.cos(e)*t,.5,Math.sin(e)*t))}M.add(ee),Qp(ee,e=>{ne.forEach((t,n)=>{let r=.03+.03*(.5+.5*Math.sin(e*3+n*1.7));h.compose(t,g,new H(r,r,r)),ee.setMatrixAt(n,h)}),ee.instanceMatrix.needsUpdate=!0}),ee.userData.tick(0),[`#ff7eb6`,`#3ec5ff`,`#ffcf4a`,`#7ad151`].forEach((e,t)=>{let n=$p(e);n.position.set(-4.2+t*1.55,0,2.2),n.rotation.y=Math.PI,T.add(n)});let re=em(`#ff7eb6`);re.position.set(-3.45,0,3.6),T.add(re);let ie=em(`#3ec5ff`);ie.position.set(-.35,0,3.6),T.add(ie);for(let[e,t]of[[-5,-5],[-5,5],[4.6,4.8],[5.1,-.2]]){let n=tm(.6);n.position.set(e,0,t),T.add(n)}return Y(J(1.4,2.6,2.2,.5),o,13/2-1.1,1.3,0,T),Y(J(.06,2,1.4,.03),lp(`#1b2a40`),13/2-1.83,1.05,0,T),Y(J(.07,.12,.5,.04),sp(`#7dfcff`,2),13/2-1.84,2.3,0,T),Y(J(1.6,.9,.7,.2),q(`#ffcf4a`,.25),2.6,.45,2.6,T),Y(J(1.7,.08,.8,.04),o,2.6,.94,2.6,T),X(.12,sp(`#ff7eb6`,1.4),2.2,1.06,2.6,T,!0),X(.12,sp(`#5ff0e0`,1.4),2.9,1.06,2.6,T,!0),e}function rm(e=1,t=0){let n=new U;n.name=`tree`,Y(mp(.16,.24,2.2,16),q(`#a7744f`,.5),0,1.1,0,n);let r=Rp(17+t*13),i=[`#4cc95f`,`#6fdb6a`,`#3fb85f`,`#88e07a`];[[0,2.9,0,1.25],[.75,2.5,.3,.8],[-.7,2.6,-.2,.85],[.2,3.7,-.1,.75],[-.25,2.4,.7,.7],[.2,2.5,-.75,.72]].forEach(([e,r,a,o],s)=>X(o,ap(i[(s+t)%i.length],`#e6ffd8`),e,r,a,n));for(let e=0;e<6;e++){let e=r()*Math.PI*2,t=r()*.8-.1;X(.08,q(`#ff5f6d`,.2),Math.cos(e)*Math.cos(t)*1.25,2.9+Math.sin(t)*1.25,Math.sin(e)*Math.cos(t)*1.25,n,!0)}return Y(mp(.9,1,.35,32),q(`#f4f1ea`,.35),0,.175,0,n),Y(mp(.82,.82,.02,32),ip(`#8a6a50`,.9),0,.35,0,n),n.scale.setScalar(e),n}function im(){let e=new U;e.name=`bench`;let t=q(`#e0a46e`,.45),n=q(`#33405a`,.3);for(let n=0;n<3;n++)Y(J(2.4,.08,.2,.04),t,0,.5,-.25+n*.23,e);for(let n=0;n<2;n++){let r=Y(J(2.4,.2,.07,.035),t,0,.82+n*.26,-.42-n*.05,e);r.rotation.x=-.18}for(let t of[-1,1]){let r=Y(gp(.28,.045,Math.PI,8,20),n,t*.95,.04,0,e);r.rotation.y=Math.PI/2,r.scale.set(1,1.6,1),bp(Sp(t*.95,.5,-.32),Sp(t*.95,1.12,-.5),.04,n,e);let i=Y(J(.08,.06,.6,.03),n,t*1.12,.72,-.05,e);i.rotation.x=.05,bp(Sp(t*1.12,.5,.2),Sp(t*1.12,.72,.2),.035,n,e)}return e}function am(){let e=new U;e.name=`lamp`;let t=q(`#33405a`,.28);Y(mp(.28,.34,.3,24),t,0,.15,0,e),Y(mp(.07,.09,3.6,16),t,0,2,0,e),Y(gp(.11,.035),q(`#ffcf4a`,.25),0,1,0,e).rotation.x=Math.PI/2;let n=Y(gp(.45,.045,Math.PI/2,8,20),t,.45,3.8,0,e);n.rotation.z=Math.PI/2,Y(pp(),q(`#33405a`,.28),.9,4.15,0,e).scale.set(.34,.24,.34),Y(mp(.02,.02,.15,6),t,.9,4.32,0,e);let r=X(.24,sp(`#ffe7b0`,2.4),.9,4.08,0,e);r.castShadow=!1;let i=Y(mp(.2,.15,.25,20),q(`#ff7eb6`,.3),-.25,2.6,0,e);i.rotation.z=0,bp(Sp(-.08,2.75,0),Sp(-.25,2.75,0),.02,t,e);for(let t=0;t<5;t++){let n=t/5*Math.PI*2;X(.07,q([`#ffcf4a`,`#ffffff`,`#ff5f8f`][t%3],.3),-.25+Math.cos(n)*.12,2.78,Math.sin(n)*.12,e,!0)}return e}function om(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new Aa,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=sm(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=sm(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function sm(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new ha(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var cm=new Map;function lm(e){let t=cm.get(e);if(t)return t;switch(e){case`matte`:t=new lc({vertexColors:!0,roughness:.82});break;case`soft`:t=new lc({vertexColors:!0,roughness:.55});break;case`rubber`:t=new lc({vertexColors:!0,roughness:.9});break;case`gloss`:t=new uc({vertexColors:!0,roughness:.32,clearcoat:1,clearcoatRoughness:.12});break;case`metal`:t=new lc({vertexColors:!0,roughness:.28,metalness:.85});break;case`glass`:t=new uc({vertexColors:!0,roughness:.06,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.6});break;case`glow`:t=new Ha({vertexColors:!0})}return cm.set(e,t),t}var um=new Map;function dm(e,t){let n=um.get(e);return n||(n=t(),um.set(e,n)),n}var fm=e=>Math.round(e*1e3)/1e3,Z={rbox:(e,t,n,r=Math.min(e,t,n)*.22,i=2)=>dm(`rb${fm(e)},${fm(t)},${fm(n)},${fm(r)},${i}`,()=>new $f(e,t,n,i,Math.min(r,Math.min(e,t,n)/2-.001))),sphere:(e=.5,t=24,n=16)=>dm(`sp${fm(e)},${t},${n}`,()=>new Xs(e,t,n)),capsule:(e,t,n=16)=>dm(`cap${fm(e)},${fm(t)},${n}`,()=>new Co(e,Math.max(.001,t-2*e),6,n)),cyl:(e,t,n,r=32)=>dm(`cy${fm(e)},${fm(t)},${fm(n)},${r}`,()=>new To(e,t,n,r)),torus:(e,t,n=Math.PI*2,r=32)=>dm(`to${fm(e)},${fm(t)},${fm(n)},${r}`,()=>new Zs(e,t,12,r,n)),cone:(e,t,n=24)=>dm(`co${fm(e)},${fm(t)},${n}`,()=>new Eo(e,t,n)),box:()=>dm(`box`,()=>new So(1,1,1))};function pm(e,t=40){return new Ks(e.map(([e,t])=>new V(e,t)),t)}var mm=new ei,hm=new Ar,gm=new ui(0,0,0,`YXZ`),_m=new H,vm=new H,ym=new W,Q=class{constructor(){this.buckets=new Map,this.groundAO=0}add(e,t,n={}){let r=n.s??1;return gm.set(...n.r??[0,0,0]),hm.setFromEuler(gm),mm.compose(_m.set(...n.p??[0,0,0]),hm,typeof r==`number`?vm.set(r,r,r):vm.set(...r)),this.addMatrix(e,t,mm,n.finish??`soft`,n.cast??!0)}addMatrix(e,t,n,r=`soft`,i=!0){let a=e.index?e.clone():bm(e.clone());for(let e of Object.keys(a.attributes))e!==`position`&&e!==`normal`&&a.deleteAttribute(e);a.applyMatrix4(n),ym.set(t);let o=a.attributes.position.count,s=new Float32Array(o*3);for(let e=0;e<o;e++)s[e*3]=ym.r,s[e*3+1]=ym.g,s[e*3+2]=ym.b;a.setAttribute(`color`,new ha(s,3));let c=`${r}|${+!!i}`,l=this.buckets.get(c);return l||this.buckets.set(c,l=[]),l.push(a),this}build(e=!0,t=0){let n=new U;for(let[r,i]of this.buckets){let[a,o]=r.split(`|`),s=om(i,!1);for(let e of i)e.dispose();if(!s)continue;this.groundAO>0&&xm(s,this.groundAO,t),s.computeBoundingSphere();let c=new G(s,lm(a));c.castShadow=o===`1`&&a!==`glow`,c.receiveShadow=e&&a!==`glow`,c.name=a,n.add(c)}return this.buckets.clear(),n}};function bm(e){let t=e.attributes.position.count,n=new(t>65535?Uint32Array:Uint16Array)(t);for(let e=0;e<t;e++)n[e]=e;return e.setIndex(new ha(n,1)),e}function xm(e,t,n){let r=e.attributes.position,i=e.attributes.color;for(let e=0;e<r.count;e++){let a=r.getY(e)+n,o=Math.min(1,Math.max(0,a/1.4)),s=1-t*(1-o*o*(3-2*o));i.setXYZ(e,i.getX(e)*s,i.getY(e)*s,i.getZ(e)*s)}}var Sm=null;function Cm(){if(Sm)return Sm;let e=document.createElement(`canvas`);e.width=e.height=128;let t=e.getContext(`2d`),n=t.createRadialGradient(64,64,0,64,64,64);for(let e=0;e<=10;e++){let t=e/10;n.addColorStop(t,`rgba(0,0,0,${(.6*Math.exp(-4.2*t*t)*(1-t*t)).toFixed(3)})`)}return t.fillStyle=n,t.fillRect(0,0,128,128),Sm=new vo(e),Sm.colorSpace=``,Sm}function wm(){return new Ha({map:Cm(),color:2240602,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})}var Tm=null;function Em(){if(Tm)return Tm;let e=document.createElement(`canvas`);e.width=e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,0,32,32,32);for(let e=0;e<=8;e++){let t=e/8;n.addColorStop(t,`rgba(255,255,255,${(Math.exp(-3.5*t*t)*(1-t)).toFixed(3)})`)}return t.fillStyle=n,t.fillRect(0,0,64,64),Tm=new vo(e),Tm}var Dm={value:0};function Om(e=2074820,t={}){let n=new lc({color:e,roughness:.12,metalness:.05,envMapIntensity:1.2}),r=(t.scale??1).toFixed(3),i=(t.sparkle??1).toFixed(3);return n.onBeforeCompile=e=>{e.uniforms.uTime=Dm,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vWaterPos;`).replace(`#include <project_vertex>`,`#include <project_vertex>
vWaterPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform float uTime;
varying vec3 vWaterPos;
vec2 waveGrad(vec2 p, float t) {
  vec2 g = vec2(0.0);
  g += vec2(0.9, 0.4) * cos(dot(p, vec2(0.9, 0.4)) * 0.55 + t * 1.3) * 0.5;
  g += vec2(-0.5, 0.85) * cos(dot(p, vec2(-0.5, 0.85)) * 0.9 + t * 1.7) * 0.3;
  g += vec2(0.2, -1.0) * cos(dot(p, vec2(0.2, -1.0)) * 1.7 + t * 2.3) * 0.16;
  g += vec2(-0.8, -0.6) * cos(dot(p, vec2(-0.8, -0.6)) * 3.1 + t * 3.1) * 0.08;
  return g;
}`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
vec2 wp = vWaterPos.xz * ${r};
vec2 wg = waveGrad(wp, uTime) * 0.32;
vec3 wn = normalize(vec3(-wg.x, 1.0, -wg.y));
normal = normalize((viewMatrix * vec4(wn, 0.0)).xyz);
float fres = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.0);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.62, 0.9, 0.95), clamp(fres * 0.6 + wg.x * 0.25, 0.0, 0.55));
// lighter crests
diffuseColor.rgb += vec3(0.035, 0.06, 0.06) * smoothstep(0.15, 0.55, wg.x + wg.y) * smoothstep(80.0, 20.0, length(vViewPosition));`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
float glint = waveGrad(wp * 3.7 + 11.0, uTime * 1.6).x * waveGrad(wp * 2.3 - 7.0, uTime * 1.3).y;
// fade glints with distance so far water doesn't alias into white noise
float near = smoothstep(55.0, 12.0, length(vViewPosition));
totalEmissiveRadiance += vec3(1.0, 0.97, 0.88) * smoothstep(0.09, 0.13, glint) * 0.8 * near * ${i};`)},n.customProgramCacheKey=()=>`water${r}${i}`,n}var km=16765616,Am=1908531,jm=16777215,Mm=16752309;function Nm(e,t,n,r={}){let i=r.spread??.11,a=r.r??.055;for(let o of[-i,i])e.add(Z.sphere(a,20,14),r.eye??Am,{p:[o,t,n],s:[1,1.25,.6],finish:`gloss`,cast:!1}),e.add(Z.sphere(a*.35,10,8),jm,{p:[o+a*.3,t+a*.45,n-a*.45],finish:`glow`,cast:!1}),r.blush!==!1&&e.add(Z.sphere(.05,16,10),Mm,{p:[o*1.55,t-.09,n+.015],s:[1.3,.7,.4],finish:`soft`,cast:!1});r.smile!==!1&&e.add(Z.torus(.055,.014,Math.PI,16),8006202,{p:[0,t-.11,n+.005],r:[0,0,Math.PI],finish:`soft`,cast:!1})}function Pm(e){let t=new Q;switch(e){case 0:t.add(Z.rbox(.56,.52,.52,.17),km,{p:[0,.27,0]}),t.add(Z.rbox(.6,.18,.56,.09),8014378,{p:[0,.54,.01]}),t.add(Z.rbox(.6,.34,.16,.08),8014378,{p:[0,.4,.22]}),Nm(t,.3,-.265);break;case 1:t.add(Z.sphere(.42),16767293,{p:[0,.4,0],finish:`gloss`}),t.add(Z.sphere(.43,32,16),16731501,{p:[0,.47,0],s:[1,.75,1],finish:`soft`}),t.add(Z.rbox(.42,.05,.3,.025),16731501,{p:[0,.6,-.38],r:[.15,0,0]}),t.add(Z.sphere(.05),jm,{p:[0,.8,0]}),Nm(t,.38,-.39,{spread:.14,r:.075});break;case 2:t.add(Z.rbox(.56,.5,.5,.16),13226974,{p:[0,.27,0],finish:`metal`}),t.add(Z.rbox(.44,.17,.06,.06),3401471,{p:[0,.3,-.25],finish:`glow`,cast:!1}),t.add(Z.capsule(.025,.3),9082277,{p:[0,.62,0],finish:`metal`}),t.add(Z.sphere(.07),16724821,{p:[0,.79,0],finish:`glow`});for(let e of[-.3,.3])t.add(Z.cyl(.1,.1,.07),16752412,{p:[e,.27,0],r:[0,0,Math.PI/2],finish:`gloss`});t.add(Z.rbox(.2,.05,.03,.02),Am,{p:[0,.13,-.25],cast:!1});break;case 3:t.add(Z.sphere(.31),16755021,{p:[0,.28,0],s:[1.05,.92,1]});for(let e of[-.17,.17])t.add(Z.cone(.1,.2),16755021,{p:[e,.58,.02],r:[0,0,-e*1.2]}),t.add(Z.cone(.055,.12),16761553,{p:[e,.57,-.03],r:[0,0,-e*1.2],cast:!1});Nm(t,.32,-.27,{eye:2855752,r:.06,smile:!1}),t.add(Z.sphere(.035),16739226,{p:[0,.24,-.3],finish:`gloss`,cast:!1});for(let e of[-1,1])for(let n of[-.12,.12])t.add(Z.capsule(.006,.2,6),jm,{p:[e*.2,.23,-.26],r:[0,0,Math.PI/2+n*e],cast:!1});break;case 4:t.add(Z.capsule(.28,.66),14147302,{p:[0,.3,0],finish:`metal`}),t.add(Z.rbox(.36,.06,.08,.03),Am,{p:[0,.34,-.26],cast:!1}),t.add(Z.rbox(.06,.24,.08,.03),Am,{p:[0,.22,-.26],cast:!1});for(let e=0;e<4;e++)t.add(Z.sphere(.1-e*.012),16731501,{p:[0,.68-e*.03,.02+e*.1],finish:`soft`});break;default:t.add(Z.sphere(.3),8313175,{p:[0,.34,0],s:[1,1.18,1],finish:`gloss`});for(let e of[-.12,.12])t.add(Z.sphere(.1),Am,{p:[e,.38,-.24],s:[1,.7,.5],r:[0,0,e*3],finish:`gloss`,cast:!1}),t.add(Z.capsule(.018,.28),8313175,{p:[e*1.2,.76,0],r:[0,0,-e*2.5],finish:`soft`}),t.add(Z.sphere(.055),16773749,{p:[e*1.6,.9,0],finish:`glow`});t.add(Z.torus(.04,.01,Math.PI,12),2976301,{p:[0,.2,-.29],r:[0,0,Math.PI],cast:!1})}return t.build()}var Fm=[16735603,5084927,9411507,2369082,6217834,16316664],Im=[16735603,5084927,9411507,2369082,6217834,16316664];function Lm(e){let t=new Q,n=Fm[e]??Fm[0];switch(e){case 0:t.add(Z.rbox(.64,.62,.38,.17),n,{p:[0,.31,0]}),t.add(Z.sphere(.09,20,14),16765286,{p:[0,.38,-.18],s:[1,1,.3],cast:!1});break;case 1:t.add(Z.rbox(.66,.64,.4,.18),n,{p:[0,.32,0]}),t.add(Z.torus(.2,.08,Math.PI*2,24),n,{p:[0,.6,.1],r:[Math.PI/2-.3,0,0]}),t.add(Z.rbox(.4,.16,.06,.05),3832800,{p:[0,.16,-.2],cast:!1});for(let e of[-.07,.07])t.add(Z.capsule(.012,.16,6),jm,{p:[e,.48,-.21],cast:!1});break;case 2:t.add(Z.rbox(.76,.66,.48,.2),8161957,{p:[0,.33,0],finish:`metal`}),t.add(Z.rbox(.5,.36,.08,.08),16761600,{p:[0,.38,-.24],finish:`gloss`});for(let e of[-.42,.42])t.add(Z.sphere(.17),10135485,{p:[e,.58,0],s:[1,.7,1],finish:`metal`});for(let e of[-.18,.18])for(let n of[.24,.5])t.add(Z.sphere(.025),4871528,{p:[e,n,-.29],finish:`metal`,cast:!1});break;case 3:t.add(Z.rbox(.62,.62,.38,.17),n,{p:[0,.31,0],finish:`gloss`}),t.add(Z.rbox(.22,.5,.04,.04),jm,{p:[0,.34,-.19],cast:!1});for(let e of[-1,1])t.add(Z.cone(.06,.12,16),15087942,{p:[e*.06,.56,-.22],r:[0,0,e*Math.PI/2],finish:`gloss`,cast:!1});t.add(Z.sphere(.03),15087942,{p:[0,.56,-.22],finish:`gloss`,cast:!1});for(let e of[.4,.28,.16])t.add(Z.sphere(.022),Am,{p:[0,e,-.22],cast:!1});break;case 4:t.add(Z.sphere(.4),n,{p:[0,.32,0],s:[.92,.85,.66],finish:`gloss`}),t.add(Z.torus(.3,.04,Math.PI*2,32),2976335,{p:[0,.12,0],r:[Math.PI/2,0,0],s:[1.15,.85,1]}),t.add(Z.sphere(.07),12058551,{p:[.14,.42,-.24],finish:`gloss`,cast:!1});break;default:t.add(Z.rbox(.62,.62,.38,.17),n,{p:[0,.31,0]});for(let e=0;e<3;e++)t.add(Z.rbox(.635,.06,.395,.03),1914199,{p:[0,.13+e*.16,0]});t.add(Z.torus(.17,.05,Math.PI*2,24),15087942,{p:[0,.6,0],r:[Math.PI/2,0,0]})}return t.build()}function Rm(e,t){let n=new Q,r=e===2;n.add(Z.capsule(.1,.34),Im[e]??km,{p:[0,-.15,0],finish:r?`metal`:e===4?`gloss`:`soft`}),n.add(Z.sphere(.09),r?5924474:km,{p:[0,-.38,0],finish:r?`metal`:`soft`});let i=n.build();return i.name=t?`armR`:`armL`,i}function zm(){let e=[];for(let t=0;t<=80;t++){let n=t/80,r=n*Math.PI*2*5;e.push(new H(Math.cos(r)*.09,-.08-n*.48,Math.sin(r)*.09))}return new Qs(new Lo(e),160,.025,8,!1)}var Bm=null;function Vm(e){let t=new Q;switch(e){case 0:t.add(Z.capsule(.12,.62),4026294,{p:[0,-.31,0]}),t.add(Z.rbox(.25,.13,.36,.06),jm,{p:[0,-.64,-.05]}),t.add(Z.rbox(.26,.04,.37,.02),16735603,{p:[0,-.69,-.05],finish:`rubber`});break;case 1:t.add(Z.capsule(.14,.3),16747586,{p:[0,-.13,0]}),t.add(Z.capsule(.09,.42),km,{p:[0,-.4,0]}),t.add(Z.rbox(.24,.14,.36,.06),5084927,{p:[0,-.63,-.05],finish:`gloss`});break;case 2:t.add(Z.capsule(.09,.62),12109010,{p:[0,-.3,0],finish:`metal`}),t.add(Z.sphere(.12),16752412,{p:[0,-.33,0],finish:`gloss`}),t.add(Z.rbox(.28,.12,.4,.05),7042954,{p:[0,-.64,-.05],finish:`metal`});break;case 3:t.add(Bm??(Bm=zm()),16765503,{finish:`metal`}),t.add(Z.sphere(.12),16748459,{p:[0,-.04,0],s:[1,.7,1],finish:`gloss`}),t.add(Z.rbox(.28,.12,.38,.06),16748459,{p:[0,-.64,-.04],finish:`gloss`});break;case 4:t.add(Z.capsule(.12,.42),5420936,{p:[0,-.2,0]}),t.add(Z.rbox(.3,.32,.32,.12),10249796,{p:[0,-.52,0],finish:`gloss`}),t.add(Z.rbox(.31,.14,.46,.07),8343332,{p:[0,-.63,-.06],finish:`gloss`});break;default:t.add(Z.capsule(.11,.5),13073919,{p:[0,-.25,0]}),t.add(Z.rbox(.26,.18,.38,.08),jm,{p:[0,-.54,-.04],finish:`gloss`});for(let e of[-.17,.09])t.add(Z.torus(.05,.03,Math.PI*2,20),16711790,{p:[0,-.66,e],r:[0,Math.PI/2,0],finish:`gloss`})}return t.build()}function Hm(e){let t=new Q,n=(e,n,r,i,a=`gloss`)=>t.add(Z.capsule(n,r),e,{p:i,r:[Math.PI/2,0,0],finish:a});switch(e){case 0:t.add(Z.rbox(.18,.22,.4,.08),16743168,{p:[0,0,-.1],finish:`gloss`}),n(8054146,.07,.34,[0,.04,-.4]),t.add(Z.sphere(.09),8054146,{p:[0,.16,0],finish:`gloss`}),t.add(Z.rbox(.1,.18,.1,.04),4473941,{p:[0,-.14,.02]});break;case 1:t.add(Z.cyl(.13,.13,.22),46296,{p:[0,0,-.05],r:[Math.PI/2,0,0],finish:`gloss`});for(let e=0;e<4;e++){let t=e/4*Math.PI*2;n(14673646,.03,.42,[Math.cos(t)*.065,Math.sin(t)*.065,-.35],`metal`)}t.add(Z.sphere(.12),16766474,{p:[0,.16,.05],finish:`gloss`});break;case 2:n(5940075,.15,.95,[0,.12,-.15]),t.add(Z.torus(.15,.04,Math.PI*2,28),3108677,{p:[0,.12,-.62],finish:`gloss`}),t.add(Z.rbox(.08,.16,.1,.03),3108677,{p:[0,-.06,0]});break;case 3:n(16740518,.035,.5,[0,0,-.2]),t.add(Z.torus(.14,.03,Math.PI*2,28),7395071,{p:[0,0,-.52],finish:`gloss`}),t.add(Z.sphere(.12),14218239,{p:[0,0,-.52],s:[1,1,.3],finish:`glass`,cast:!1});break;case 4:t.add(Z.rbox(.3,.18,.34,.07),6966419,{p:[0,0,-.1],finish:`gloss`}),n(14673646,.05,.42,[-.07,.03,-.42],`metal`),n(14673646,.05,.42,[.07,.03,-.42],`metal`);break;default:t.add(Z.sphere(.14),15921906,{p:[0,0,-.06],s:[1,1,1.5],finish:`gloss`}),n(15681391,.05,.36,[0,0,-.36]);for(let e of[-.3,-.42])t.add(Z.torus(.08,.02,Math.PI*2,24),448160,{p:[0,0,e],finish:`metal`});t.add(Z.sphere(.06),16765286,{p:[0,0,-.56],finish:`glow`})}return t.build()}function Um(e){let t=new U,n=new U;t.add(n);let[r,i,a,o]=e,s=new U;s.add(Vm(a)),s.position.set(-.15,.7,0);let c=new U;c.add(Vm(a)),c.position.set(.15,.7,0),n.add(s,c);let l=Lm(i);l.position.y=.68,n.add(l);let u=i===2?.48:.42,d=new U;d.position.set(-u,1.22,0),d.add(Rm(i,!1));let f=new U;f.position.set(u,1.22,0),f.add(Rm(i,!0));let p=Hm(o);p.position.set(0,-.42,0),p.rotation.x=-Math.PI/2,f.add(p),f.rotation.x=Math.PI/2,n.add(d,f);let m=new U;m.add(Pm(r)),m.position.y=1.3,n.add(m),n.clear();let h=new U;h.rotation.y=Math.PI,n.add(h);let g=Lp(`head`,r);g.position.y=-1.3,m.clear(),m.add(g),h.add(m),h.add(Lp(`body`,i),Lp(`gun`,o));let _=Lp(`legs`,a);s.clear(),c.clear(),s.position.set(-.14,.6,0),c.position.set(.14,.6,0);for(let e of[..._.children]){if(Math.abs(e.position.x)<.05){h.add(e);continue}let t=e.position.x<0?s:c;e.position.sub(t.position),t.add(e)}return h.add(s,c),{root:t,inner:n,legL:s,legR:c,armL:d,armR:f,head:m}}function Wm(e,t){let n=new U;if(e===`head`)n.add(Pm(t));else if(e===`body`){n.add(Lm(t));let e=t===2?.48:.42;for(let r of[-1,1]){let i=Rm(t,r>0);i.position.set(r*e,.54,0),i.rotation.z=r*.25,n.add(i)}}else if(e===`legs`)for(let e of[-1,1]){let r=Vm(t);r.position.set(e*.17,.7,0),n.add(r)}else{let e=Hm(t);e.rotation.y=-Math.PI/2.6,n.add(e)}n.clear();let r=Lp(e,t);r.rotation.y=Math.PI;let i=new Zi().setFromObject(r).getCenter(new H);return r.position.sub(i),n.add(r),n}function Gm(e,t,n,r,i){let a=Math.min(1,n/5),o=r?.6:Math.sin(t*4)*.7*a;e.legL.rotation.x=o,e.legR.rotation.x=r?-.4:-o,e.armL.rotation.x=r?-2.4:-o*.8,e.inner.position.y=r?0:Math.abs(Math.sin(t*4))*.06*a,e.head.rotation.z=Math.sin(i*2)*.04}var Km=class extends Ii{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new So;e.deleteAttribute(`uv`);let t=new lc({side:1}),n=new lc,r=new Jc(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new G(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new fo(e,n,6),o=new Di;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new G(e,qm(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let c=new G(e,qm(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let l=new G(e,qm(17));l.position.set(14.904,12.198,-1.832),l.scale.set(.15,4.265,6.331),this.add(l);let u=new G(e,qm(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new G(e,qm(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new G(e,qm(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function qm(e){return new dc({color:0,emissive:16777215,emissiveIntensity:e})}var Jm=12575478,Ym=2;function Xm(e){let t=window.devicePixelRatio||1,n=new Rf({canvas:e,antialias:t<2,powerPreference:`high-performance`});return n.setPixelRatio(Math.min(t,Ym)),n.outputColorSpace=zn,n.toneMapping=7,n.toneMappingExposure=.95,n.shadowMap.enabled=!0,n.shadowMap.type=1,n}var Zm=null;function Qm(e){if(Zm)return Zm;let t=new Wl(e),n=new Km;return Zm=t.fromScene(n,.04).texture,n.dispose(),t.dispose(),Zm}function $m(e=`city`){return e===`oldtown`?{top:2846678,mid:8369902,horizon:16178356,sun:16766874}:e===`harbor`?{top:2064358,mid:6079221,horizon:12577266,sun:16773572}:{top:1864422,mid:4696821,horizon:10934519,sun:16774102}}var eh=new H(14,30,10).normalize();function th(e=`city`){let t=$m(e),n=new U,r=new Xs(150,40,20),i=r.attributes.position,a=new W(t.top),o=new W(t.mid),s=new W(t.horizon),c=new W(t.sun),l=new W,u=new H,d=new Float32Array(i.count*3);for(let e=0;e<i.count;e++){u.fromBufferAttribute(i,e).normalize();let t=Math.max(0,u.y);t<.3?l.copy(s).lerp(o,(t/.3)**.8):l.copy(o).lerp(a,((t-.3)/.7)**.9);let n=Math.max(0,u.dot(eh));l.lerp(c,n**6*.55+n**40*.4),d.set([l.r,l.g,l.b],e*3)}r.setAttribute(`color`,new ha(d,3));let f=new G(r,new Ha({vertexColors:!0,side:1,fog:!1,depthWrite:!1,toneMapped:e!==`city`}));f.renderOrder=-10,n.add(f);let p=new Q,m=e===`harbor`?11:e===`oldtown`?23:7,h=()=>(m=m*16807%2147483647)/2147483647;for(let e=0;e<11;e++){let t=e/11*Math.PI*2+h(),n=100+h()*30,r=Math.cos(t)*n,i=Math.sin(t)*n,a=26+h()*28,o=4+Math.floor(h()*4);for(let e=0;e<o;e++){let n=4+h()*5*(1-Math.abs(e-o/2)/o),s=(e-o/2)*5.5;p.add(Z.sphere(1,10,7),16777215,{p:[r+s*Math.cos(t+1.57),a+n*.25+h()*2,i+s*Math.sin(t+1.57)],s:[n*1.35,n*.7,n],finish:`glow`})}}let g=p.build(!1);return g.traverse(e=>{if(!(e instanceof G))return;let t=e.geometry.attributes.normal,n=e.geometry.attributes.color,r=new W(13228268),i=new W(16774364),a=new W,o=new H;for(let e=0;e<n.count;e++)o.fromBufferAttribute(t,e),a.copy(r).lerp(new W(16777215),kr.smoothstep(o.y,-.6,.5)),a.lerp(i,Math.max(0,o.dot(eh))*.35),n.setXYZ(e,a.r,a.g,a.b);let s=new Q,c=new wo(6,32);c.lookAt(eh.clone().negate()),s.add(c,16776170,{p:eh.clone().multiplyScalar(140).toArray(),finish:`glow`});let l=s.build(!1).children[0],u=om([e.geometry,l.geometry]);u&&(e.geometry.dispose(),e.geometry=u,u.computeBoundingSphere()),l.geometry.dispose(),e.material=new Ha({vertexColors:!0,fog:!1,transparent:!0,opacity:.95,depthWrite:!1}),e.renderOrder=-9}),n.add(g),n}function nh(e,t){let n=new Pc(13822207,16178360,.95);e.add(n);let r=new Zc(16772822,2.7);r.castShadow=!0,r.shadow.mapSize.set(t,t);let i=r.shadow.camera;return i.left=-24,i.right=24,i.top=24,i.bottom=-24,i.near=1,i.far=90,r.shadow.radius=4,r.shadow.bias=-6e-4,r.shadow.normalBias=.04,e.add(r,r.target),{sun:r,hemi:n}}var rh=class{constructor(e){this.renderer=e,this.frames=0,this.elapsed=0,this.fps=60,this.max=Math.min(window.devicePixelRatio||1,Ym),this.ratio=this.max}get pixelRatio(){return this.ratio}update(e){if(this.frames++,this.elapsed+=e,this.elapsed<1.5)return;this.fps=this.frames/this.elapsed,this.frames=0,this.elapsed=0;let t=this.ratio;if(this.fps<50?t=Math.max(.75,this.ratio-(this.fps<35?.5:.25)):this.fps>56&&this.ratio<this.max&&(t=Math.min(this.max,this.ratio+.125)),t!==this.ratio){this.ratio=t,this.renderer.setPixelRatio(t);let e=this.renderer.getSize(new V);this.renderer.setSize(e.x,e.y,!1)}}reset(){this.frames=0,this.elapsed=0}};function ih(e){e.updateMatrixWorld(!0);let t=new Map,n=e.matrixWorld.clone().invert();e.traverse(r=>{if(!(r instanceof G)||r instanceof fo||Array.isArray(r.material))return;for(let t=r;t;t=t.parent){if(t.userData.tick||!t.visible)return;if(t===e)break}let i=r.geometry.clone();i.applyMatrix4(new ei().multiplyMatrices(n,r.matrixWorld));let a=t.get(r.material);a||(a={meshes:[],geometry:[]},t.set(r.material,a)),a.meshes.push(r),a.geometry.push(i)});for(let[n,r]of t){let t=new Map;r.geometry.forEach((e,n)=>{let r=Object.keys(e.attributes).sort().join(`,`)+!!e.index;t.set(r,[...t.get(r)||[],n])});for(let i of t.values()){let t=om(i.map(e=>r.geometry[e]));if(!t)continue;let a=new G(t,n);a.castShadow=!0,a.receiveShadow=!0,i.forEach(e=>r.meshes[e].removeFromParent()),e.add(a)}r.geometry.forEach(e=>e.dispose())}return e}function ah(e,t,n,r=Math.min(e,t,n)*.08){let i=Math.min(r,e*.2,t*.2,n*.2),a=new is;a.moveTo(-e/2+i*2.4,i),a.lineTo(e/2-i,i),a.lineTo(e/2-i,t-i*2.4),a.closePath();let o=new Hs(a,{depth:n-2*i,bevelEnabled:!0,bevelThickness:i,bevelSize:i,bevelSegments:3,curveSegments:4});return o.translate(0,0,-(n-2*i)/2),o}function oh(e){let t=e.maxX-e.minX,n=e.maxZ-e.minZ,r=e.ramp===0||e.ramp===2,i=e.ramp===0?0:e.ramp===2?Math.PI:e.ramp===1?-Math.PI/2:Math.PI/2;return{x:(e.minX+e.maxX)/2,y:e.minY,z:(e.minZ+e.maxZ)/2,w:r?t:n,h:e.maxY-e.minY,d:r?n:t,ry:i}}var sh=[16735603,3065014,5084927,16752412,10182117],ch=[3065014,5084927,16743074,9159498,16758531,10182117],lh=16183268;function uh(e){let t=new U,n=[],r=[],i=new G(new qs(260,260),new lc({color:11843261,roughness:.9}));i.rotation.x=-Math.PI/2,i.receiveShadow=!0,t.add(i);let a=new Q;a.add(Z.rbox(42,.08,2.5,.04),15985888,{p:[0,0,-19.75],finish:`matte`}),a.add(Z.rbox(42,.08,2.5,.04),15985888,{p:[0,0,19.75],finish:`matte`}),a.add(Z.rbox(2.5,.08,37,.04),15985888,{p:[-19.75,0,0],finish:`matte`}),a.add(Z.rbox(2.5,.08,37,.04),15985888,{p:[19.75,0,0],finish:`matte`});let o=Z.rbox(1.4,.04,.2,.02,1);for(let e=-14;e<=14;e+=3)a.add(o,16777215,{p:[e,.01,-14.5],finish:`matte`}),a.add(o,16777215,{p:[e,.01,14.5],finish:`matte`}),a.add(o,16777215,{p:[-14.5,.01,e],r:[0,Math.PI/2,0],finish:`matte`}),a.add(o,16777215,{p:[14.5,.01,e],r:[0,Math.PI/2,0],finish:`matte`});a.add(Z.cyl(e.plazaRadius,e.plazaRadius,.06,72),16245693,{p:[0,.01,0],finish:`matte`}),a.add(Z.torus(e.plazaRadius-.25,.14,Math.PI*2,96),14861455,{p:[0,.05,0],r:[Math.PI/2,0,0],finish:`soft`}),a.add(Z.cyl(e.plazaRadius-2.2,e.plazaRadius-2.2,.07,72),16510160,{p:[0,.012,0],finish:`matte`}),t.add(a.build(!0));let s=e=>[0,1,2,3].map(()=>{let t=new Q;return t.groundAO=e,t}),c=s(.32),l=s(0),u=c[0],d=l[0],f=1,p=()=>(f=f*16807%2147483647,f/2147483647),m=(t,n,r,i)=>[...e.ramps,...e.platforms].some(e=>e.minX<r+.3&&e.maxX>t-.3&&e.minZ<i+.3&&e.maxZ>n-.3),h=Z.rbox(1.2,1.65,.14,.07,1),g=Z.rbox(.92,1.36,.12,.06,1),_=Z.box(),v=new Gs(.11,0),y=[16735631,16765286,16777215,16747099,13073919];e.buildings.forEach((e,t)=>{let r=e.maxX-e.minX,i=e.maxZ-e.minZ,a=(e.minX+e.maxX)/2,o=(e.minZ+e.maxZ)/2,s=ch[t%ch.length],f=(a<0?0:1)+(o<0?0:2);u=c[f],d=l[f],u.add(Z.rbox(r,e.height,i,.35,3),e.color,{p:[a,e.height/2,o],finish:`soft`}),u.add(Z.rbox(r+.16,.55,i+.16,.2),dh(e.color,.86),{p:[a,.27,o],finish:`soft`}),u.add(Z.rbox(r+.4,.32,i+.4,.15),lh,{p:[a,e.height-.1,o],finish:`soft`});for(let t=2.5;t<e.height-1;t+=2.5)u.add(Z.rbox(r+.12,.14,i+.12,.06,1),lh,{p:[a,t-.05,o],finish:`soft`});if(e.mansard){let t=oe(e),n=t.maxX-t.minX,r=t.maxZ-t.minZ,i=t.maxY-t.minY;u.add(fh(n+.3,i,r+.3),8426948,{p:[(t.minX+t.maxX)/2,t.minY+i/2,(t.minZ+t.maxZ)/2],finish:`gloss`});for(let e of[t.minX+1,t.maxX-1])u.add(Z.rbox(.55,1.1,.55,.12,1),15764076,{p:[e,t.maxY+.25,(t.minZ+t.maxZ)/2],finish:`soft`}),u.add(Z.rbox(.7,.16,.7,.07,1),lh,{p:[e,t.maxY+.82,(t.minZ+t.maxZ)/2],finish:`soft`})}let b=[{alongX:!0,fixed:e.maxZ,n:1,from:e.minX,to:e.maxX},{alongX:!0,fixed:e.minZ,n:-1,from:e.minX,to:e.maxX},{alongX:!1,fixed:e.maxX,n:1,from:e.minZ,to:e.maxZ},{alongX:!1,fixed:e.minX,n:-1,from:e.minZ,to:e.maxZ}];for(let r of b){if(Math.abs(r.fixed)>=31.99)continue;let i=r.to-r.from,a=Math.max(1,Math.floor(i/2.6)),o=i/a,c=Math.abs(r.fixed)<22,l=r.alongX?r.n>0?0:Math.PI:r.n>0?Math.PI/2:-Math.PI/2,f=(e,t,n)=>r.alongX?[e,n,r.fixed+t*r.n]:[r.fixed+t*r.n,n,e];for(let i=0;i<a;i++){let a=r.from+o*(i+.5);if(!(a-.8<r.from+.4||a+.8>r.to-.4)){for(let n=3.6;n+.9<e.height-.3;n+=2.5)if(d.add(h,16777215,{p:f(a,.02,n),r:[0,l,0],cast:!1}),d.add(g,3104670,{p:f(a,.06,n),r:[0,l,0],finish:`glass`,cast:!1}),d.add(_,s,{p:f(a-.82,.05,n),r:[0,l,0],s:[.34,1.5,.07],cast:!1}),d.add(_,s,{p:f(a+.82,.05,n),r:[0,l,0],s:[.34,1.5,.07],cast:!1}),n<6&&d.add(_,3885675,{p:f(a,.3,n-.45),r:[0,l,0],s:[1.3,.08,.08],finish:`metal`,cast:!1}),n<4&&c&&i%2==0){d.add(_,11883067,{p:f(a,.2,n-.92),r:[0,l,0],s:[1.1,.26,.3],cast:!1});for(let e of[-1,1])d.add(v,y[(t+e+1)%y.length],{p:f(a+e*.25,.22,n-.72),r:[0,l,0],s:[1.6,1,1],cast:!1})}if(c&&e.height>=3){let e=o*.85,[t,,i]=f(a,.5,0),[s,c]=r.alongX?[e/2,.5]:[.5,e/2];if(m(t-s,i-c,t+s,i+c))continue;d.add(Z.rbox(o*.72,1.45,.12,.06,1),10476789,{p:f(a,.04,1.05),r:[0,l,0],finish:`glass`,cast:!1}),d.add(Z.rbox(o*.78,1.6,.1,.05,1),16777215,{p:f(a,.01,1.05),r:[0,l,0],cast:!1}),n.push({minX:t-s,minY:1.7,minZ:i-c,maxX:t+s,maxY:2.35,maxZ:i+c});let h=sh[Math.floor(p()*sh.length)];u.add(Z.rbox(e,.12,1,.06,1),h,{p:f(a,.48,2.05),r:[.38,l,0],finish:`soft`}),u.add(Z.rbox(e+.04,.14,.14,.07,1),16777215,{p:f(a,.98,1.92),r:[0,l,0],finish:`soft`})}}}}});for(let e of[...c,...l])t.add(e.build(!0));let b=new Q;b.groundAO=.25;for(let t of e.ramps){let e=oh(t);b.add(ah(e.w,e.h,e.d,.12),15849909,{p:[e.x,e.y,e.z],r:[0,e.ry,0],finish:`soft`})}for(let t of e.platforms)b.add(Z.rbox(t.maxX-t.minX,t.maxY-t.minY,t.maxZ-t.minZ,.12),15256480,{p:[(t.minX+t.maxX)/2,(t.minY+t.maxY)/2,(t.minZ+t.maxZ)/2],finish:`soft`});t.add(b.build(!0));let x=new Q;for(let t of e.cars){let e=t.alongX?Math.PI/2:0,n=(e,n,r)=>t.alongX?[t.x+r,n,t.z-e]:[t.x+e,n,t.z+r];x.add(Z.rbox(1.9,.75,4,.32),t.color,{p:n(0,.72,0),r:[0,e,0],finish:`gloss`}),x.add(Z.rbox(1.7,.7,2.2,.34),t.color,{p:n(0,1.38,.1),r:[0,e,0],finish:`gloss`}),x.add(Z.rbox(1.74,.44,2,.2),2705006,{p:n(0,1.36,.1),r:[0,e,0],finish:`glass`,cast:!1}),x.add(Z.rbox(1.95,.18,4.05,.08),15921906,{p:n(0,.42,0),r:[0,e,0],finish:`soft`});for(let e of[-.62,.62])x.add(Z.sphere(.13,16,12),16774850,{p:n(e,.82,-1.97),s:[1,1,.5],finish:`glow`,cast:!1}),x.add(Z.sphere(.11,16,12),16731469,{p:n(e,.82,1.98),s:[1,1,.5],finish:`glow`,cast:!1});for(let e of[-1.3,1.3])for(let r of[-.88,.88]){let i=t.alongX?[0,0,0]:[0,Math.PI/2,0];x.add(Z.torus(.27,.12,Math.PI*2,18),2829626,{p:n(r,.38,e),r:i,finish:`rubber`}),x.add(Z.cyl(.2,.2,.1,20),14673646,{p:n(r*1.04,.38,e),r:t.alongX?[Math.PI/2,0,0]:[0,0,Math.PI/2],finish:`metal`})}r.push(t.alongX?{x:t.x,z:t.z,sx:5.2,sz:2.9}:{x:t.x,z:t.z,sx:2.9,sz:5.2})}t.add(x.build(!0));let S=new Q;S.groundAO=.2;for(let i of e.props)if(i.kind!==`crate`){let e=i.kind===`tree`?rm(.85):i.kind===`bench`?im():am();e.position.set(i.x,0,i.z),i.kind===`bench`&&Math.abs(i.x)>Math.abs(i.z)&&(e.rotation.y=Math.PI/2),i.kind===`tree`&&n.push({minX:i.x-1,minY:1.9,minZ:i.z-1,maxX:i.x+1,maxY:3.6,maxZ:i.z+1}),t.add(ih(e))}else{let e=i.h??1,t=(i.y??0)+e/2;S.add(Z.rbox((i.w??1)-.04,e-.04,(i.d??1)-.04,.1),(i.y??0)%2?14853739:15777155,{p:[i.x,t,i.z],finish:`soft`}),i.y||r.push({x:i.x,z:i.z,sx:(i.w??1)+.8,sz:(i.d??1)+.8})}t.add(S.build(!0));let C=e.fountain,w=new Q;w.groundAO=.25,w.add(Z.rbox(C.stepHalf*2,C.stepH,C.stepHalf*2,.12),15655888,{p:[C.x,C.stepH/2,C.z],finish:`soft`}),w.add(Z.rbox(C.basinHalf*2,C.basinH,C.basinHalf*2,.3),lh,{p:[C.x,C.basinH/2,C.z],finish:`soft`}),w.add(pm([[.001,0],[C.pillarHalf,0],[C.pillarHalf*.95,.15],[C.pillarHalf*.55,.4],[C.pillarHalf*.45,1.2],[C.pillarHalf*.55,1.55],[C.pillarHalf*1.3,1.75],[C.pillarHalf*1.45,1.92],[C.pillarHalf*1.2,C.pillarH],[.001,C.pillarH]]),lh,{p:[C.x,0,C.z],finish:`soft`}),w.add(Z.cyl(C.pillarHalf*1.15,C.pillarHalf*1.15,.05,40),6080767,{p:[C.x,C.pillarH-.02,C.z],finish:`glass`,cast:!1}),w.add(Z.sphere(.22),16765286,{p:[C.x,C.pillarH+.25,C.z],finish:`gloss`}),t.add(w.build(!0));let T=new G(Z.rbox(C.basinHalf*2-.5,.08,C.basinHalf*2-.5,.04),Om(3981544,{scale:3,sparkle:.6}));T.position.set(C.x,C.basinH-.02,C.z),T.receiveShadow=!0,t.add(T);let E=new G(Z.sphere(.9,32,16),new uc({color:12577535,roughness:.05,transparent:!0,opacity:.35,depthWrite:!1,clearcoat:1}));return E.scale.set(1,.5,1),E.position.set(C.x,C.pillarH,C.z),E.name=`spray`,t.add(E),t.add(ph(r)),{root:t,cameraBlockers:n}}function dh(e,t){return new W(e).multiplyScalar(t).getHex()}function fh(e,t,n){let r=Z.rbox(e,t,n,.3).clone(),i=r.attributes.position;for(let e=0;e<i.count;e++){let n=(i.getY(e)+t/2)/t,r=1-.22*n*n;i.setX(e,i.getX(e)*r),i.setZ(e,i.getZ(e)*r)}return r}function ph(e){let t=[],n=[],r=[];e.forEach((e,i)=>{let a=e.y??.06,o=e.sx/2,s=e.sz/2;t.push(e.x-o,a,e.z-s,e.x+o,a,e.z-s,e.x+o,a,e.z+s,e.x-o,a,e.z+s),n.push(0,0,1,0,1,1,0,1);let c=i*4;r.push(c,c+2,c+1,c,c+3,c+2)});let i=new Aa;i.setAttribute(`position`,new va(t,3)),i.setAttribute(`uv`,new va(n,2)),i.setIndex(r);let a=new G(i,wm());return a.renderOrder=1,a}var mh=15981736,hh=15127216,gh=11827531,_h=9067064,vh=13222580,yh=14246970,bh=16775920,xh=2310254;function Sh(e,t,n){let r=new is;r.moveTo(-e/2,0),r.lineTo(e/2,0),r.lineTo(0,t),r.closePath();let i=new Hs(r,{depth:n,bevelEnabled:!0,bevelThickness:.08,bevelSize:.08,bevelSegments:1});return i.translate(0,0,-n/2),i}function Ch(e){let t=Se,n=new U,r=[],i=[0,1,2,3].map(()=>{let e=new Q;return e.groundAO=.22,e}),a=[0,1,2,3].map(()=>new Q),o=(e,t)=>(e<0?0:1)+(t<-6?0:2),s=new G(new qs(260,160).rotateX(-Math.PI/2),new lc({color:mh,roughness:.95}));s.position.set(0,0,66),s.receiveShadow=!0,n.add(s);let c=Dh();n.add(c);let l=new Q;l.groundAO=.2;let u=new Q,d=t.east-t.beachMaxX,f=t.south-t.seawallZ;u.add(Z.rbox(d,.1,f,.04),hh,{p:[(t.east+t.beachMaxX)/2,0,(t.south+t.seawallZ)/2],finish:`matte`,cast:!1}),u.add(Z.rbox(.6,.12,f,.04),13481100,{p:[t.beachMaxX+.3,.01,(t.south+t.seawallZ)/2],finish:`matte`,cast:!1});for(let e=t.beachMaxX+3;e<t.east;e+=3)u.add(Z.box(),14205597,{p:[e,.055,(t.south+t.seawallZ)/2],s:[.06,.01,f],finish:`matte`,cast:!1});for(let e=t.seawallZ+3;e<t.south;e+=3)u.add(Z.box(),14205597,{p:[(t.east+t.beachMaxX)/2,.055,e],s:[d,.01,.06],finish:`matte`,cast:!1});u.add(Z.box(),14467725,{p:[(t.west+t.beachMaxX)/2,.005,t.seawallZ+1.2],s:[t.beachMaxX-t.west,.01,2.4],finish:`matte`,cast:!1});for(let[e,t,n]of[[-29,-7,16740241],[-18,-7.5,5097983],[-27,12,16765286],[-16,9,8315009]])u.add(Z.rbox(1,.04,1.9,.02),n,{p:[e,.02,t],r:[0,.3,0],finish:`matte`,cast:!1}),u.add(Z.rbox(1,.045,.3,.02),bh,{p:[e,.025,t],r:[0,.3,0],finish:`matte`,cast:!1});n.add(u.build(!0));let p=l;for(let n of e.solids.filter(e=>e.maxZ===t.seawallZ&&e.maxY===1)){let e=n.maxX-n.minX,r=(n.minX+n.maxX)/2;if(n.maxX<=t.beachMaxX+.01){for(let e=n.minX+1;e<n.maxX;e+=3)p.add(Z.cyl(.09,.11,1.1,10),gh,{p:[e,.55,t.seawallZ-.2]});p.add(Z.box(),15259300,{p:[r,.85,t.seawallZ-.2],s:[e,.06,.06]}),p.add(Z.box(),15259300,{p:[r,.45,t.seawallZ-.2],s:[e,.05,.05]})}else{p.add(Z.rbox(e,.75,.6,.12),vh,{p:[r,.375,t.seawallZ-.25]}),p.add(Z.rbox(e+.1,.12,.7,.05),bh,{p:[r,.8,t.seawallZ-.25]});for(let e=n.minX+.6;e<n.maxX;e+=2.4)p.add(Z.capsule(.05,.45,8),xh,{p:[e,1.05,t.seawallZ-.25],finish:`metal`});p.add(Z.capsule(.04,e,8),xh,{p:[r,1.25,t.seawallZ-.25],r:[0,0,Math.PI/2],finish:`metal`})}}e.buildings.forEach((e,t)=>{let n=i[o((e.minX+e.maxX)/2,e.minZ)],s=a[o((e.minX+e.maxX)/2,e.minZ)],c=e.maxX-e.minX,l=e.maxZ-e.minZ,u=(e.minX+e.maxX)/2,d=(e.minZ+e.maxZ)/2;if(e.height<3){for(let t=0;t<5;t++)n.add(Z.rbox(c,e.height,l/5,.05),t%2?bh:e.color,{p:[u,e.height/2,e.minZ+l*(t+.5)/5]});n.add(Sh(l+.5,1,c+.4),yh,{p:[u,e.height,d],r:[0,Math.PI/2,0]}),s.add(Z.rbox(.12,1.7,1,.04),xh,{p:[e.maxX+.02,.9,d],cast:!1}),r.push({x:u+.4,z:d,sx:c+1.6,sz:l+1});return}n.add(Z.rbox(c-.1,e.height,l,.2,2),e.color,{p:[u,e.height/2,d]}),n.add(Z.rbox(c+.05,.5,l+.1,.1),wh(e.color,.82),{p:[u,.25,d]}),n.add(Sh(c+.5,2.2+t%3*.5,l+.6),t%4==3?4942730:yh,{p:[u,e.height,d],finish:`gloss`}),n.add(Z.rbox(c+.2,.2,.3,.08),bh,{p:[u,e.height-.1,e.minZ-.1]});let f=Math.max(1,Math.round(c/2.6));for(let r=3.4;r+1<e.height;r+=2.4){for(let n=0;n<f;n++){let i=e.minX+c*(n+.5)/f;s.add(Z.rbox(1.1,1.5,.12,.05),bh,{p:[i,r,e.minZ-.03],cast:!1}),s.add(Z.rbox(.82,1.22,.1,.04),2973066,{p:[i,r,e.minZ-.07],finish:`glass`,cast:!1});for(let n of[-1,1])s.add(Z.rbox(.36,1.4,.08,.03),t%2?2792847:4029641,{p:[i+n*.75,r,e.minZ-.06],cast:!1})}if(t%2==0&&r<4){n.add(Z.rbox(c*.6,.12,.8,.05),bh,{p:[u,r-.85,e.minZ-.4]});for(let t=u-c*.28;t<=u+c*.28+.01;t+=.4)s.add(Z.cyl(.03,.03,.7,6),xh,{p:[t,r-.45,e.minZ-.75],cast:!1})}}if(s.add(Z.rbox(1.1,2.1,.12,.08),t%3==0?2792847:t%3==1?xh:11883067,{p:[u,1.05,e.minZ-.04],cast:!1}),t%3==1)for(let t=0;t<6;t++)n.add(Z.rbox(c*.8/6,.08,1.4,.03),t%2?bh:15087942,{p:[e.minX+c*.1+c*.8*(t+.5)/6,2.55,e.minZ-.65],r:[.35,0,0]})});let m=t.pier,h=l;h.add(Z.rbox(m.maxX-m.minX,.3,m.maxZ-m.minZ,.08),gh,{p:[(m.minX+m.maxX)/2,m.y-.15,(m.minZ+m.maxZ)/2]});for(let e=m.minZ+.5;e<m.maxZ;e+=1)h.add(Z.box(),_h,{p:[(m.minX+m.maxX)/2,m.y+.005,e],s:[m.maxX-m.minX-.1,.01,.05],cast:!1});for(let e=m.minZ+.6;e<m.maxZ;e+=4)for(let t of[m.minX+.3,m.maxX-.3])h.add(Z.cyl(.18,.2,m.y+.6,10),_h,{p:[t,(m.y-.6)/2,e]});let g=(e,t,n)=>{for(let r=t+.15;r<=n;r+=2)h.add(Z.rbox(.14,1,.14,.04),bh,{p:[e,m.y+.5,r]});h.add(Z.rbox(.12,.12,n-t,.05),bh,{p:[e,m.y+1,(t+n)/2]})};g(m.minX+.12,m.minZ,m.maxZ),g(m.maxX-.12,m.minZ,m.boardFrom),g(m.maxX-.12,m.boardTo,m.maxZ),h.add(Z.rbox(m.maxX-m.minX,.12,.12,.05),bh,{p:[(m.minX+m.maxX)/2,m.y+1,m.minZ+.12]});for(let e of[-30,-18])h.add(Z.torus(.32,.1,Math.PI*2,20),e===-30?16735581:16777215,{p:[m.minX+.05,m.y+.55,e],r:[0,Math.PI/2,0],finish:`gloss`});let _=oh(t.pierRamp);h.add(ah(_.w,_.h,_.d,.06),gh,{p:[_.x,_.y,_.z],r:[0,_.ry,0]}),Th(l,t.boat,16763196,!0),Th(l,{minX:8,maxX:12,minZ:-32,maxZ:-23,y:1.2},15087942,!1),Th(l,{minX:-22,maxX:-18.5,minZ:-30,maxZ:-22,y:1},5097983,!1),Eh(l,-40,-48);let v=t.jetty,y=t.lighthouse,b=l;b.add(Z.rbox(v.maxX-v.minX,v.y+.4,v.maxZ-v.minZ,.15),vh,{p:[(v.minX+v.maxX)/2,(v.y-.4)/2,(v.minZ+v.maxZ)/2]});for(let e of[v.minX+.15,v.maxX-.15])b.add(Z.rbox(.3,1,v.maxZ-v.minZ,.1),12103841,{p:[e,v.y+.5,(v.minZ+v.maxZ)/2]});b.add(Z.rbox(v.maxX-v.minX,1,.3,.1),12103841,{p:[(v.minX+v.maxX)/2,v.y+.5,v.minZ+.15]});for(let e=v.minZ+2;e<v.maxZ;e+=3)b.add(Z.sphere(.9,10,8),10261895,{p:[v.minX-.6,0,e],s:[1,.6,1.3]});for(let e=v.minZ+3.5;e<v.maxZ;e+=3.3)b.add(Z.sphere(.8,10,8),10722446,{p:[v.maxX+.6,0,e],s:[1.2,.6,1]});let x=y.height/6;for(let e=0;e<6;e++){let t=y.half*(1-e/6*.18),n=y.half*(1-.18*((e+1)/6));b.add(Z.cyl(n,t,x,28),e%2?15087942:bh,{p:[y.x,e*x+x/2,y.z],finish:`gloss`})}b.add(Z.cyl(y.half*1.05,y.half*1.05,.25,28),xh,{p:[y.x,y.height+.12,y.z]});for(let e=0;e<10;e++)b.add(Z.cyl(.04,.04,1.4,6),xh,{p:[y.x+Math.cos(e/10*Math.PI*2)*1.1,y.height+.9,y.z+Math.sin(e/10*Math.PI*2)*1.1],finish:`metal`});b.add(Z.cone(1.45,1.2,28),15087942,{p:[y.x,y.height+2.2,y.z],finish:`gloss`}),b.add(Z.sphere(.2,12,8),16765286,{p:[y.x,y.height+2.9,y.z],finish:`gloss`});let S=t.gallery,C=t.galleryRamp;b.add(Z.rbox(S.maxX-S.minX,.35,S.maxZ-S.minZ,.08),gh,{p:[(S.minX+S.maxX)/2,S.maxY-.17,(S.minZ+S.maxZ)/2]});for(let e of[S.minX+.3,S.maxX-.3])for(let t of[S.minZ+.3,S.maxZ-.3])b.add(Z.cyl(.13,.13,S.maxY,8),_h,{p:[e,S.maxY/2,t]});let w=oh(C);b.add(ah(w.w,w.h,w.d,.06),gh,{p:[w.x,w.y,w.z],r:[0,w.ry,0]});for(let e=S.minZ;e<=C.maxZ;e+=1.5){let t=e<C.minZ?S.maxY:C.minY+(C.maxZ-e)/(C.maxZ-C.minZ)*(C.maxY-C.minY);b.add(Z.cyl(.05,.05,t+1,6),bh,{p:[v.minX+.15,(t+1)/2,e]})}for(let e=S.maxX-.15,t=S.minZ;t<=S.maxZ;t+=.65)b.add(Z.cyl(.05,.05,1,6),bh,{p:[e,S.maxY+.5,t]});b.add(Z.rbox(.12,.12,S.maxZ-S.minZ,.05),bh,{p:[S.maxX-.15,S.maxY+1,(S.minZ+S.maxZ)/2]});let T=new Lo([new H(v.minX+.15,C.minY+1,C.maxZ),new H(v.minX+.15,C.maxY+1,C.minZ),new H(v.minX+.15,S.maxY+1,S.minZ)]);b.add(new Qs(T,8,.06,6,!1),bh,{cast:!1});let E=new G(Z.cyl(.9,.9,1.3,20),new lc({color:16774338,emissive:16765803,emissiveIntensity:1.4,roughness:.2}));E.position.set(y.x,y.height+.9,y.z),E.name=`lighthouse-lantern`,n.add(E);let D=t.lifeguard,O=t.lifeguardRamp,k=l,A=(D.minX+D.maxX)/2,j=(D.minZ+D.maxZ)/2;k.add(Z.rbox(D.maxX-D.minX,.3,D.maxZ-D.minZ,.08),gh,{p:[A,D.maxY-.15,j]});for(let e of[D.minX+.3,D.maxX-.3])for(let t of[D.minZ+.3,D.maxZ-.3])k.add(Z.cyl(.12,.14,D.maxY,8),bh,{p:[e,D.maxY/2,t]});for(let e of[D.minZ+.3,D.maxZ-.3])for(let t of[D.minX+.3,D.maxX-.3])k.add(Z.cyl(.06,.06,2.4,6),bh,{p:[t,D.maxY+1.2,e]});for(let e=0;e<4;e++)k.add(new Eo(2.3,.9,1,1,!1,e/4*Math.PI*2,Math.PI/2),e%2?bh:15087942,{p:[A,D.maxY+2.85,j],r:[0,Math.PI/4,0],finish:`gloss`});k.add(Z.rbox(1.6,.5,.08,.04),15087942,{p:[A,D.maxY+.45,D.minZ+.1],cast:!1}),k.add(Z.rbox(.3,.3,.09,.03),bh,{p:[A,D.maxY+.45,D.minZ+.06],cast:!1});let M=oh(O);k.add(ah(M.w,M.h,M.d,.06),gh,{p:[M.x,M.y,M.z],r:[0,M.ry,0]}),r.push({x:A,z:j,sx:4.5,sz:4.5});let N=l,P=[16740241,5097983,16765286,8315009,11765995];e.props.forEach((e,t)=>{if(e.kind===`umbrella`){N.add(Z.cyl(.05,.05,2.4,8),bh,{p:[e.x,1.2,e.z]});for(let n=0;n<8;n++)N.add(new Eo(1.5,.7,3,1,!1,n/8*Math.PI*2,Math.PI/4),n%2?bh:P[t%P.length],{p:[e.x,2.45,e.z]});N.add(Z.sphere(.08,8,6),bh,{p:[e.x,2.82,e.z]}),r.push({x:e.x+.4,z:e.z+.3,sx:3,sz:3})}else if(e.kind===`palm`){for(let t=0;t<6;t++)N.add(Z.cyl(.2-t*.015,.24-t*.015,.75,10),t%2?11106895:12619356,{p:[e.x+t*t*.012,.37+t*.72,e.z],r:[0,0,-.05-t*.02]});let n=e.x+.45;for(let r=0;r<7;r++){let i=r/7*Math.PI*2+t;N.add(Z.sphere(1,12,6),r%2?4173419:5423740,{p:[n+Math.cos(i)*1.1,4.35,e.z+Math.sin(i)*1.1],r:[0,-i,.35],s:[1.5,.12,.42]})}for(let[t,r]of[[.2,0],[-.1,.18],[-.1,-.18]])N.add(Z.sphere(.16,10,8),8016432,{p:[n+t,4.25,e.z+r]});r.push({x:e.x+.5,z:e.z,sx:2.8,sz:2.8})}});let ee=new U;for(let t of e.props){if(t.kind!==`lamp`&&t.kind!==`bench`)continue;let e=t.kind===`lamp`?am():im();e.position.set(t.x,0,t.z),ee.add(e)}n.add(ih(ee));let te=l;for(let e=t.seawallZ+1;e<t.south+12;e+=4.5){te.add(Z.sphere(1,16,10),e%2?15388826:14861451,{p:[t.west-2,0,e],s:[4.2,5.8+Math.sin(e)*1.2,3.4]});for(let n=0;n<3;n++)te.add(Z.cone(.25,1,5),9224026,{p:[t.west+.3+n*.2,.4,e+n-1],r:[0,0,-.3+n*.2],cast:!1})}for(let e=t.seawallZ;e<t.south+12;e+=11){let n=[5084927,15167313,2792847][Math.abs(Math.round(e))%3];te.add(Z.rbox(6,7,10.6,.2),n,{p:[t.east+3,3.5,e+5.5]});for(let r=0;r<9;r++)te.add(Z.box(),wh(n,.85),{p:[t.east+.02,3.5,e+.8+r*1.15],s:[.06,6.6,.5],cast:!1});te.add(Z.rbox(.15,3.6,3.2,.06),15856113,{p:[t.east-.02,1.8,e+5.5],cast:!1}),te.add(Sh(10.8,1.4,6.4),10134706,{p:[t.east+3,7,e+5.5],r:[0,Math.PI/2,0]})}te.add(Z.rbox(.6,14,.6,.1),16758531,{p:[t.east+2,7,t.seawallZ-2]}),te.add(Z.rbox(12,.6,.6,.1),16758531,{p:[t.east-1,14,t.seawallZ-2]}),te.add(Z.rbox(1.6,1.4,1.6,.15),2829626,{p:[t.east+2,13,t.seawallZ-2]}),te.add(Z.cyl(.03,.03,6,4),2829626,{p:[t.east-6,11,t.seawallZ-2],cast:!1}),te.add(Z.rbox(2.4,1.2,1.4,.1),15087942,{p:[t.east-6,7.6,t.seawallZ-2]});for(let e of L){if(e.kind===`crate`){l.add(Z.rbox(e.w,e.h,e.d,.05),13212258,{p:[e.x,e.h/2,e.z]});for(let t of[.25,.65])l.add(Z.box(),_h,{p:[e.x,e.h*t,e.z],s:[e.w+.02,.06,e.d+.02],cast:!1})}else{l.add(Z.cyl(e.w/2,e.w/2*.92,e.h,14),4029641,{p:[e.x,e.h/2,e.z]});for(let t of[.2,.8])l.add(Z.torus(e.w/2,.03,Math.PI*2,14),2310254,{p:[e.x,e.h*t,e.z],r:[Math.PI/2,0,0],finish:`metal`,cast:!1})}r.push({x:e.x,z:e.z,sx:e.w+.9,sz:e.d+.9})}l.add(Z.torus(.32,.09,Math.PI*2,18),15259300,{p:[17,.99,-13.1],r:[Math.PI/2,0,0],cast:!1}),l.add(Z.sphere(.6,12,6),2792847,{p:[18.15,.78,-13.1],s:[1,.25,1],cast:!1});let ne=l;for(let[e,n]of[[-14,-14.2],[12,-14.2],[27,-16],[-24,-14.2]])ne.add(Z.sphere(.18,12,8),bh,{p:[e,e<t.beachMaxX?1:1.42,n],s:[1,.9,1.5]}),ne.add(Z.sphere(.1,10,8),bh,{p:[e,e<t.beachMaxX?1.18:1.6,n-.2]}),ne.add(Z.cone(.04,.12,6),16758531,{p:[e,e<t.beachMaxX?1.17:1.59,n-.33],r:[-Math.PI/2,0,0]}),ne.add(Z.sphere(.12,8,6),10135224,{p:[e,e<t.beachMaxX?1.03:1.45,n+.05],s:[1.6,.4,1.2]});for(let[e,t,n]of[[4,-40,16735581],[-14,-44,16765286],[32,-46,16735581],[15,-55,16777215]])ne.add(Z.sphere(.5,14,10),n,{p:[e,.1,t],s:[1,.8,1],finish:`gloss`}),ne.add(Z.cone(.25,.8,10),n,{p:[e,.7,t],finish:`gloss`});n.add(l.build(!0));for(let e of[...i,...a])n.add(e.build(!0));return n.add(ph(r)),{root:n,cameraBlockers:[],water:c}}function wh(e,t){return new W(e).multiplyScalar(t).getHex()}function Th(e,t,n,r){let i=t.maxX-t.minX,a=t.maxZ-t.minZ,o=(t.minX+t.maxX)/2,s=(t.minZ+t.maxZ)/2,c=Z.rbox(i,t.y+.4,a,Math.min(i,a)*.3,3).clone(),l=c.attributes.position;for(let e=0;e<l.count;e++){let n=(l.getZ(e)+a/2)/a,r=Math.max(0,1-n*2.2),i=1-(l.getY(e)+(t.y+.4)/2)/(t.y+.4);l.setX(e,l.getX(e)*(1-.6*r*r)*(1-.25*i))}c.computeVertexNormals(),e.add(c,n,{p:[o,(t.y+.4)/2-.4,s],finish:`gloss`}),e.add(Z.box(),bh,{p:[o,t.y-.35,s],s:[i*.98,.14,a*.9],cast:!1}),e.add(Z.rbox(i-.5,.1,a-1.2,.04),14267530,{p:[o,t.y+.01,s+.4],cast:!1}),e.add(Z.rbox(.3,.8,a-.8,.1),wh(n,.85),{p:[t.maxX-.15,t.y+.4,s+.3]}),r||e.add(Z.rbox(.3,.8,a-.8,.1),wh(n,.85),{p:[t.minX+.15,t.y+.4,s+.3]}),e.add(Z.rbox(i-.6,.8,.3,.1),wh(n,.85),{p:[o,t.y+.4,t.maxZ-.15]}),e.add(Z.rbox(i*.5,.8,.3,.1),wh(n,.85),{p:[o,t.y+.4,t.minZ+.3]}),e.add(Z.rbox(i-1.6,1.9,2.7,.15),bh,{p:[o+.2,t.y+.95,t.maxZ-1.65]}),e.add(Z.rbox(i-1.5,.2,3,.08),xh,{p:[o+.2,t.y+1.95,t.maxZ-1.65]}),e.add(Z.rbox(i-1.7,.6,.08,.04),2973066,{p:[o+.2,t.y+1.35,t.maxZ-3.02],finish:`glass`,cast:!1}),e.add(Z.cyl(.07,.07,3.5,8),bh,{p:[o,t.y+2,t.minZ+2.5]}),e.add(Z.torus(.3,.08,Math.PI*2,16),16735581,{p:[t.maxX+.05,t.y-.1,s],r:[0,Math.PI/2,0],finish:`gloss`,cast:!1});for(let n of[t.minZ+3,s+.5])e.add(Z.rbox(.8,.5,.6,.06),8112374,{p:[o-.6,t.y+.3,n]})}function Eh(e,t,n){e.add(pm([[.001,-.5],[.9,-.3],[1.1,.4],[.001,.4]],16),bh,{p:[t,.1,n],s:[1,1,3],finish:`gloss`}),e.add(Z.cyl(.06,.06,7,8),_h,{p:[t,3.9,n]});let r=new Aa;r.setAttribute(`position`,new va([0,.8,.3,0,7,.3,0,.8,3,0,.8,-.3,0,6,-.3,0,.8,-2.6],3)),r.computeVertexNormals(),e.add(r,bh,{p:[t+.08,.4,n]}),e.add(r,16765286,{p:[t-.08,.4,n],r:[0,Math.PI,0]})}function Dh(){let e=new G(new qs(320,160,1,1).rotateX(-Math.PI/2),Om(2074820));return e.position.set(0,.02,Se.seawallZ-.4-80),e.receiveShadow=!0,e.name=`sea`,e}var Oh=14182718,kh=11883311,Ah=15851711,jh=14271386,Mh=13482912,Nh=8176478,Ph=11037507,Fh=8079915,Ih=16775920,Lh=[4165466,3046796,5217641,7049018],Rh=6272410,zh=16763196;function Bh(e,t){return new W(e).multiplyScalar(t).getHex()}function Vh(e,t,n,r,i){let a=n.maxX-n.minX,o=n.maxZ-n.minZ,s=(n.minX+n.maxX)/2,c=(n.minZ+n.maxZ)/2;if(e.add(Z.rbox(a-.08,n.height,o-.08,.18,2),n.color,{p:[s,n.height/2,c]}),e.add(Z.rbox(a+.04,.6,o+.04,.08,1),Bh(n.color,.8),{p:[s,.3,c]}),e.add(Z.rbox(a+.16,.22,o+.16,.08,1),Ih,{p:[s,n.height-.11,c]}),n.roof===`gable`){let r=a>=o,l=r?o:a,u=r?a:o,d=Math.min(3,l*.4),f=r?Math.PI/2:0;e.add(Sh(l+.5,d,u+.3),i%5==4?kh:Oh,{p:[s,n.height,c],r:[0,f,0],finish:`gloss`});for(let e of[-1,1])for(let i=.2;i<.95;i+=.25){let a=e*((l+.5)/2)*(1-i),o=n.height+d*i+.06;t.add(Z.cyl(.06,.06,u+.3,6),Bh(Oh,.86),{p:r?[s,o,c+a]:[s+a,o,c],r:r?[0,0,Math.PI/2]:[Math.PI/2,0,0],cast:!1})}if(t.add(Z.cyl(.13,.13,u+.4,8),kh,{p:[s,n.height+d+.05,c],r:r?[0,0,Math.PI/2]:[Math.PI/2,0,0],finish:`gloss`}),i%3==0){let i=r?n.minX+a*.72:s+l*.22,u=r?c+l*.22:n.minZ+o*.3;e.add(Z.rbox(.7,1.9,.7,.08),Bh(n.color,.9),{p:[i,n.height+d*.6+.4,u]}),e.add(Z.rbox(.9,.18,.9,.06),Ih,{p:[i,n.height+d*.6+1.4,u]}),t.add(Z.cyl(.12,.12,.35,8),kh,{p:[i,n.height+d*.6+1.6,u],cast:!1})}}else{e.add(Z.box(),15311482,{p:[s,n.height+.01,c],s:[a-.2,.02,o-.2],finish:`matte`,cast:!1});for(let e=n.minX+1;e<n.maxX;e+=1)t.add(Z.box(),13863523,{p:[e,n.height+.025,c],s:[.04,.01,o-.3],cast:!1});for(let[t,r,i,l]of[[s,n.minZ+.1,a,.2],[n.minX+.1,c,.2,o],[n.maxX-.1,c,.2,o]])e.add(Z.rbox(i,.35,l,.06),Ih,{p:[t,n.height+.17,r]})}let l=r===0||r===2?o:a,u=Math.max(1,Math.round(l/2.4)),d=(e,t,i)=>{let a=(r===0||r===2?n.minZ:n.minX)+l*(e+.5)/u;return r===0?[n.maxX+i,t,a]:r===2?[n.minX-i,t,a]:r===1?[a,t,n.maxZ+i]:[a,t,n.minZ-i]},f=r===0||r===2?Math.PI/2:0,p=Lh[i%Lh.length];for(let e=2.6;e+1.2<n.height;e+=2.5)for(let n=0;n<u;n++)if(!(e<3&&n===Math.floor(u/2))){t.add(Z.box(),Ih,{p:d(n,e,.03),r:[0,f,0],s:[1,1.35,.1],cast:!1}),t.add(Z.box(),3498367,{p:d(n,e,.06),r:[0,f,0],s:[.78,1.12,.06],finish:`glass`,cast:!1});for(let r of[-1,1]){let i=d(n,e,.06);f?i[2]+=r*.72:i[0]+=r*.72,t.add(Z.box(),p,{p:i,r:[0,f,0],s:[.4,1.3,.06],cast:!1})}if((i+n)%3==0){let r=d(n,e-.78,.14);t.add(Z.box(),Oh,{p:r,r:[0,f,0],s:[.9,.2,.2],cast:!1});for(let r of[-.28,0,.28]){let a=d(n,e-.6,.14);f?a[2]+=r:a[0]+=r,t.add(Z.sphere(.1,8,6),[16735603,16765286,16748480][(i+n)%3],{p:a,cast:!1})}}}let m=d(Math.floor(u/2),1.15,.04);t.add(Z.box(),Ih,{p:m,r:[0,f,0],s:[1.25,2.3,.1],cast:!1}),t.add(Z.box(),[Fh,3046796,10173740][i%3],{p:[m[0],1.08,m[2]],r:[0,f,0],s:[1,2.1,.12],cast:!1});let h=d(Math.floor(u/2),2.45,.35);t.add(Z.rbox(1.5,.08,.7,.03),Oh,{p:h,r:[.25*!f,f,0],cast:!1})}function Hh(e){let t=se;return e.minZ>=t.south-.01?3:e.maxZ<=t.north+.01?1:e.maxX<=t.west+.01?0:e.minX>=t.east-.01||e.minX>=30?2:1}function Uh(e,t,n,r,i=1){e.add(Z.cyl(.2*i,.3*i,2.6*i,10),9067064,{p:[t,1.3*i,n]});let a=[5025616,6079326,4169546,7327578];for(let[o,s,c,l]of[[0,3.4,0,1.6],[.8,2.9,.4,1.1],[-.7,3,-.4,1.15],[.1,4.3,-.1,1]])e.add(Z.sphere(1,14,10),a[r+Math.round(o*3)&3],{p:[t+o*i,s*i,n+c*i],s:l*i})}function Wh(e,t,n,r){let i=t.ramp===0||t.ramp===2,a=i?t.maxX-t.minX:t.maxZ-t.minZ,o=t.maxY-t.minY,s=i?t.maxZ-t.minZ:t.maxX-t.minX,c=Math.hypot(a,o),l=Math.atan2(o,a),u=(t.minX+t.maxX)/2,d=(t.minZ+t.maxZ)/2,f=(t.minY+t.maxY)/2-.12,p=t.ramp===0?0:t.ramp===2?Math.PI:t.ramp===1?-Math.PI/2:Math.PI/2,m=new ei().compose(new H(u,f,d),new Ar().setFromEuler(new ui(0,p,l,`YXZ`)),new H(1,1,1));if(e.addMatrix(Z.rbox(c,.24,s,.06),n,m,`soft`),!r)return;let h=e=>{let n=t.minY+o*(t.ramp===2||t.ramp===3?1-e:e);return new H(i?t.minX+a*e:r===`minX`?t.minX+.08:t.maxX-.08,n,i?r===`minZ`?t.minZ+.08:t.maxZ-.08:t.minZ+a*e)};for(let t=0;t<=1.001;t+=1/6){let n=h(t);e.add(Z.cyl(.05,.05,1,6),Ih,{p:[n.x,n.y+.5,n.z]})}let g=h(0),_=h(1);e.add(new Qs(new Zo(g.clone().setY(g.y+1),_.clone().setY(_.y+1)),1,.06,6),Ih,{})}function Gh(e){let t=se,n=new U,r=[],i=[],a=[0,1,2,3].map(()=>{let e=new Q;return e.groundAO=.22,e}),o=[0,1,2,3].map(()=>new Q),s=(e,t)=>(e<0?0:1)+(t<-6?0:2),c=new G(new qs(300,300).rotateX(-Math.PI/2),new lc({color:Nh,roughness:.95}));c.receiveShadow=!0,n.add(c);let l=new Q,u=t.east+8-t.parkEdge,d=t.south-t.north;l.add(Z.box(),Mh,{p:[(t.parkEdge+t.east+8)/2,.02,(t.north+t.south)/2],s:[u,.04,d+16],finish:`matte`,cast:!1});for(let e=t.parkEdge+2;e<t.east;e+=2)l.add(Z.box(),12364172,{p:[e,.045,(t.north+t.south)/2],s:[.05,.01,d],finish:`matte`,cast:!1});for(let e=t.north+2;e<t.south;e+=2)l.add(Z.box(),12364172,{p:[(t.parkEdge+t.east)/2,.045,e],s:[t.east-t.parkEdge,.01,.05],finish:`matte`,cast:!1});l.add(Z.cyl(6,6,.05,40),14930869,{p:[t.tower.x,.03,t.tower.z+9],finish:`matte`,cast:!1}),l.add(Z.cyl(4.6,4.6,.06,40),13216133,{p:[t.tower.x,.035,t.tower.z+9],finish:`matte`,cast:!1});for(let[e,t,n,r]of[[-40,6,-2,6],[-20,0,-20,26],[-38,-24,-2,-24],[-34,-24,-34,22]]){let i=Math.hypot(n-e,r-t);l.add(Z.box(),15325096,{p:[(e+n)/2,.025,(t+r)/2],r:[0,Math.atan2(n-e,r-t),0],s:[2.6,.05,i],finish:`matte`,cast:!1})}n.add(l.build(!0)),_e().forEach((e,t)=>{let n=s((e.minX+e.maxX)/2,(e.minZ+e.maxZ)/2);Vh(a[n],o[n],e,Hh(e),t)});let f=new Q;f.groundAO=.2;let p=t.terraceA,m=t.terraceB,h=oh(t.stairA);f.add(ah(h.w,h.h,h.d,.05),Ah,{p:[h.x,h.y,h.z],r:[0,h.ry,0]});for(let e=t.stairA.minX+.35;e<t.stairA.maxX;e+=.35){let n=(e-t.stairA.minX)/(t.stairA.maxX-t.stairA.minX)*t.stairA.maxY;f.add(Z.box(),jh,{p:[e,n+.01,(t.stairA.minZ+t.stairA.maxZ)/2],s:[.04,.02,1.5],cast:!1})}let g=oh(t.rampAB);f.add(ah(g.w,g.h,g.d,.05),Ph,{p:[g.x,g.y,g.z],r:[0,g.ry,0]});{let e=t.rampRail,n=(e.minZ+e.maxZ)/2,r=t.rampAB.minY,i=t.rampAB.maxY;for(let a=e.minX;a<=e.maxX+.01;a+=.6){let e=r+(a-t.rampAB.minX)/(t.rampAB.maxX-t.rampAB.minX)*(i-r);f.add(Z.cyl(.045,.045,1,6),Ih,{p:[a,e+.5,n]})}let a=new H(e.minX,r+.1+1,n),o=new H(e.maxX,i+1,n);f.add(new Qs(new Zo(a,o),1,.06,6),Ih,{})}for(let e of ye)f.add(Z.rbox(e.maxX-e.minX,e.maxY-e.minY,e.maxZ-e.minZ,.08),15250592,{p:[(e.minX+e.maxX)/2,(e.minY+e.maxY)/2,(e.minZ+e.maxZ)/2]}),f.add(Z.rbox(e.maxX-e.minX+.2,.16,e.maxZ-e.minZ+.2,.05),Ih,{p:[(e.minX+e.maxX)/2,e.maxY+.08,(e.minZ+e.maxZ)/2]});for(let[e,t,n]of[[3,-29,p.maxY],[11,-34.8,p.maxY],[13,-30,m.maxY],[18.4,-30,m.maxY]])f.add(Z.cyl(.32,.24,.5,14),Oh,{p:[e,n+.25,t],finish:`gloss`}),f.add(Z.sphere(.45,12,8),5814362,{p:[e,n+.75,t]});for(let[e,t]of[[13,-35.6],[18.6,-35.6],[13,-31.5],[18.6,-31.5]])f.add(Z.cyl(.07,.07,2.4,8),Fh,{p:[e,m.maxY+1.2,t]});for(let e=13;e<=18.7;e+=.7)f.add(Z.box(),Ph,{p:[e,m.maxY+2.4,-33.55],s:[.1,.1,4.6]});for(let e of[-35.6,-31.5])f.add(Z.box(),Fh,{p:[15.8,m.maxY+2.35,e],s:[5.8,.12,.12]});for(let e=13.3;e<18.6;e+=1.1)f.add(Z.sphere(.45,10,8),6073935,{p:[e,m.maxY+2.55,-33.5+Math.sin(e*3)*1.2],s:[1.3,.45,1.1]});let _=t.tower,v=_.x,y=_.z,b=_.floor+_.room,x=_.maxX-_.minX;f.add(Z.rbox(x,_.floor,x,.12,2),Ah,{p:[v,_.floor/2,y]});for(let e=.5;e<_.floor;e+=1.2)for(let[t,n]of[[-1,-1],[1,-1],[-1,1],[1,1]]){let r=Math.round(e/1.2)%2==0;f.add(Z.rbox(r?.9:.6,.55,r?.6:.9,.06),jh,{p:[v+t*(x/2-.2),e,y+n*(x/2-.2)]})}f.add(Z.rbox(x+.3,.3,x+.3,.08),Ih,{p:[v,_.floor-.15,y]});let S=16174986;f.add(Z.box(),S,{p:[v,_.floor+_.room/2,_.minZ+.2],s:[x,_.room,.4]}),f.add(Z.box(),S,{p:[_.minX+.2,_.floor+_.room/2,y],s:[.4,_.room,x]}),f.add(Z.box(),S,{p:[_.maxX-.2,_.floor+_.room/2,y],s:[.4,_.room,x]}),f.add(Z.box(),S,{p:[(_.minX+_.door[0])/2,_.floor+_.room/2,_.maxZ-.2],s:[_.door[0]-_.minX,_.room,.4]}),f.add(Z.box(),S,{p:[(_.door[1]+_.maxX)/2,_.floor+_.room/2,_.maxZ-.2],s:[_.maxX-_.door[1],_.room,.4]}),f.add(Z.box(),S,{p:[v,_.floor+2.1+(_.room-2.1)/2,_.maxZ-.2],s:[_.door[1]-_.door[0],_.room-2.1,.4]}),f.add(Z.box(),9071184,{p:[v,_.floor+.02,y],s:[x-.8,.04,x-.8],finish:`matte`,cast:!1}),f.add(Z.rbox(x+.6,.6,x+.6,.12),Ih,{p:[v,b+.3,y]}),f.add(new Eo(x*.62,6.5,4,1),Rh,{p:[v,_.top+3.25,y],r:[0,Math.PI/4,0],finish:`gloss`}),f.add(Z.sphere(.3,14,10),zh,{p:[v,_.top+6.7,y],finish:`metal`}),f.add(Z.cyl(.04,.04,1.6,6),zh,{p:[v,_.top+7.5,y],finish:`metal`}),f.add(Z.cone(.18,.5,8),zh,{p:[v+.3,_.top+7.9,y],r:[0,0,-Math.PI/2],finish:`metal`});for(let[e,t,n]of[[_.minX+.9,_.floor+1.6,.8],[_.minX+1.6,_.floor+2.7,.5],[_.maxX-1,_.floor+2.2,.7]]){f.add(Z.torus(n,.09,Math.PI*2,24),zh,{p:[e,t,_.minZ+.6],finish:`metal`});for(let r=0;r<6;r++)f.add(Z.box(),zh,{p:[e,t,_.minZ+.6],r:[0,0,r*.52],s:[n*2,.08,.06],finish:`metal`})}f.add(Z.cyl(.35,.35,1.4,16),8079915,{p:[v,_.floor+.7,_.minZ+1.4],r:[0,0,Math.PI/2]});let C=(e,t,n)=>{let r=_.floor+3.05;f.add(Z.cyl(.95,.95,.12,36),Ih,{p:[e,r,t],r:[Math.PI/2,n,0],finish:`gloss`}),f.add(Z.torus(.95,.08,Math.PI*2,36),zh,{p:[e,r,t],r:[0,n,0],finish:`metal`});let i=Math.sin(n),a=Math.cos(n);for(let o=0;o<12;o++){let s=o/12*Math.PI*2,c=.75,l=Math.cos(s)*c;f.add(Z.box(),2829626,{p:[e+a*l+i*.07,r+Math.sin(s)*c,t-i*l+a*.07],r:[0,n,s],s:[o%3?.12:.22,.05,.02],cast:!1})}f.add(Z.box(),2829626,{p:[e+i*.09+a*.12,r+.2,t+a*.09-i*.12],r:[0,n,-.9],s:[.06,.55,.02],cast:!1}),f.add(Z.box(),2829626,{p:[e+i*.1,r+.3,t+a*.1],r:[0,n,.1],s:[.05,.7,.02],cast:!1})};C(v,_.maxZ+.07,0),C(v,_.minZ-.07,Math.PI),C(_.maxX+.07,y,Math.PI/2),C(_.minX-.07,y,-Math.PI/2);let w=new ei().compose(new H(_.door[0]+.05,_.floor+1,_.maxZ+.55),new Ar().setFromEuler(new ui(0,-1.1,0)),new H(1,1,1));f.addMatrix(Z.rbox(.1,2,1,.04).clone().translate(0,0,.5),Fh,w,`soft`),f.add(Z.torus(1,.06,Math.PI,24),Ph,{p:[v,_.floor+2.05,_.maxZ+.02]});let T=ce(),E=[`maxZ`,`maxX`,`minZ`,`minX`];T.ramps.forEach((e,t)=>Wh(f,e,Ph,E[t])),T.landings.forEach((e,t)=>{let n=e.maxY-e.minY;f.add(Z.rbox(e.maxX-e.minX,n,e.maxZ-e.minZ,.08),t===3?Ph:jh,{p:[(e.minX+e.maxX)/2,(e.minY+e.maxY)/2,(e.minZ+e.maxZ)/2]})});let D=T.balcony;f.add(Z.rbox(D.maxX-D.minX,.4,D.maxZ-D.minZ,.08),Ph,{p:[(D.minX+D.maxX)/2,D.maxY-.2,(D.minZ+D.maxZ)/2]});for(let e=_.minX-_.stair+.1;e<=_.maxX;e+=.6)f.add(Z.cyl(.045,.045,1,6),Ih,{p:[e,_.floor+.5,D.maxZ-.08]});f.add(Z.box(),Ih,{p:[(_.minX-_.stair+_.maxX)/2,_.floor+1,D.maxZ-.08],s:[_.maxX-_.minX+_.stair,.1,.1]});for(let e of[_.minX+.6,_.maxX-.6])f.add(Z.box(),Fh,{p:[e,_.floor-.9,_.maxZ+.75],r:[.7,0,0],s:[.14,1.6,.14]});r.push({x:v,z:y,sx:x+5,sz:x+5});let O=t.pond,k=t.island,A=t.bridge;for(let t of e.solids.filter(e=>e.maxY===O.rimH))f.add(Z.rbox(t.maxX-t.minX+.1,O.rimH,t.maxZ-t.minZ+.1,.12),jh,{p:[(t.minX+t.maxX)/2,O.rimH/2,(t.minZ+t.maxZ)/2]});let j=new G(new qs(O.maxX-O.minX-2*O.rim+.2,O.maxZ-O.minZ-2*O.rim+.2).rotateX(-Math.PI/2),Om(3121104,{scale:1.6,sparkle:.7}));j.position.set((O.minX+O.maxX)/2,.14,(O.minZ+O.maxZ)/2),j.receiveShadow=!0,j.name=`pond`,n.add(j),f.add(Z.rbox(k.maxX-k.minX,k.maxY,k.maxZ-k.minZ,.4,2),9228138,{p:[(k.minX+k.maxX)/2,k.maxY/2,(k.minZ+k.maxZ)/2]}),f.add(Z.rbox(k.maxX-k.minX+.3,.3,k.maxZ-k.minZ+.3,.14),jh,{p:[(k.minX+k.maxX)/2,.15,(k.minZ+k.maxZ)/2]}),Uh(f,k.minX+.8,k.minZ+.9,3,.75),f.add(Z.rbox(A.maxX-A.minX,.22,A.maxZ-A.minZ,.06),Ph,{p:[(A.minX+A.maxX)/2,A.maxY-.11,(A.minZ+A.maxZ)/2]});for(let e=A.minZ+.25;e<A.maxZ;e+=.5)f.add(Z.box(),Fh,{p:[(A.minX+A.maxX)/2,A.maxY+.005,e],s:[A.maxX-A.minX-.1,.01,.04],cast:!1});for(let e of[A.minX+.08,A.maxX-.08]){for(let t=A.minZ;t<=A.maxZ+.01;t+=1)f.add(Z.cyl(.05,.05,.9,6),Ih,{p:[e,A.maxY+.45,t]});f.add(Z.box(),Ih,{p:[e,A.maxY+.9,(A.minZ+A.maxZ)/2],s:[.09,.09,A.maxZ-A.minZ]})}for(let e of le().slice(2)){let t=e.maxX-e.minX>e.maxZ-e.minZ,n=t?e.maxX-e.minX:e.maxZ-e.minZ,r=(e.minX+e.maxX)/2,i=(e.minZ+e.maxZ)/2;f.add(Z.box(),Ih,{p:[r,k.maxY+.55,i],s:t?[n,.08,.08]:[.08,.08,n]});for(let a=0;a<=n+.01;a+=.5)f.add(Z.rbox(.09,.7,.05,.02),Ih,{p:t?[e.minX+a,k.maxY+.35,i]:[r,k.maxY+.35,e.minZ+a],cast:!1})}let M=oh(t.bridgeRamp);f.add(ah(M.w,M.h,M.d,.04),Ph,{p:[M.x,M.y,M.z],r:[0,M.ry,0]});for(let[e,t]of[[-27,-13],[-17,-7],[-26,-6.5],[-16.5,-13.5],[-19,-14]])f.add(Z.cyl(.42,.42,.03,12),5025616,{p:[e,.17,t],cast:!1});f.add(Z.sphere(.12,8,6),16748480,{p:[-26.9,.24,-12.9],cast:!1});for(let[e,t,n]of[[-25.5,-14,.4],[-18,-11.5,2.2],[-27.5,-7.5,-1]])f.add(Z.sphere(.24,12,8),16769126,{p:[e,.3,t],s:[1.3,.9,1],finish:`gloss`}),f.add(Z.sphere(.14,10,8),16769126,{p:[e+Math.cos(n)*.25,.48,t+Math.sin(n)*.25],finish:`gloss`}),f.add(Z.cone(.05,.12,6),16747546,{p:[e+Math.cos(n)*.4,.47,t+Math.sin(n)*.4],r:[0,-n-Math.PI/2,Math.PI/2],cast:!1});let N=t.bandstand;f.add(Z.rbox(N.half*2,N.y,N.half*2,.15),Ah,{p:[N.x,N.y/2,N.z]}),f.add(Z.rbox(N.half*2-.2,.06,N.half*2-.2,.03),11827531,{p:[N.x,N.y+.03,N.z],cast:!1});for(let e of[-1,1])for(let t of[-1,1]){let n=N.x+e*(N.half-.3),r=N.z+t*(N.half-.3);f.add(Z.cyl(.15,.18,N.roof-N.y,12),Ih,{p:[n,(N.roof+N.y)/2,r],finish:`gloss`})}for(let[e,t,n,r]of[[-1,-1,1,-1],[-1,1,1,1],[-1,-1,-1,1]]){let i=N.x+e*(N.half-.3),a=N.z+t*(N.half-.3),o=N.x+n*(N.half-.3),s=N.z+r*(N.half-.3);f.add(Z.box(),Ih,{p:[(i+o)/2,N.y+.85,(a+s)/2],s:[Math.abs(o-i)+.1,.08,Math.abs(s-a)+.1]});for(let e=.1;e<1;e+=.1)f.add(Z.cyl(.03,.03,.8,6),Ih,{p:[i+(o-i)*e,N.y+.45,a+(s-a)*e],cast:!1})}for(let e=0;e<8;e++)f.add(new Eo(N.half*1.5,2.2,4,1,!1,e/8*Math.PI*2,Math.PI/4),e%2?Ih:15087942,{p:[N.x,N.roof+1.1,N.z],r:[0,Math.PI/4,0],finish:`gloss`});f.add(Z.sphere(.22,12,8),zh,{p:[N.x,N.roof+2.3,N.z],finish:`metal`});let P=oh(t.bandstandSteps);f.add(ah(P.w,P.h,P.d,.04),Ah,{p:[P.x,P.y,P.z],r:[0,P.ry,0]}),i.push({minX:N.x-N.half-.4,maxX:N.x+N.half+.4,minY:N.roof,maxY:N.roof+1.6,minZ:N.z-N.half-.4,maxZ:N.z+N.half+.4}),r.push({x:N.x,z:N.z,sx:N.half*2+3,sz:N.half*2+3}),e.props.forEach((e,t)=>{let n=a[s(e.x,e.z)];if(e.kind===`tree`)Uh(n,e.x,e.z,t),i.push({minX:e.x-1.2,minY:2.2,minZ:e.z-1.2,maxX:e.x+1.2,maxY:4.6,maxZ:e.z+1.2}),r.push({x:e.x+.4,z:e.z+.3,sx:4,sz:4});else if(e.kind===`umbrella`){n.add(Z.cyl(.05,.05,2.4,8),Ih,{p:[e.x,1.2,e.z]});for(let r=0;r<8;r++)n.add(new Eo(1.6,.6,3,1,!1,r/8*Math.PI*2,Math.PI/4),r%2?Ih:[3046796,15087942,4165466][t%3],{p:[e.x,2.45,e.z]});n.add(Z.cyl(.6,.6,.06,20),Ih,{p:[e.x,.75,e.z],finish:`gloss`});for(let r=0;r<3;r++){let i=r*2.1+t,a=e.x+Math.cos(i)*1.05,o=e.z+Math.sin(i)*1.05;n.add(Z.rbox(.42,.06,.42,.02),3046796,{p:[a,.45,o]}),n.add(Z.rbox(.42,.42,.06,.02),3046796,{p:[a+Math.cos(i)*.2,.68,o+Math.sin(i)*.2],r:[0,-i+Math.PI/2,0]})}r.push({x:e.x+.3,z:e.z+.3,sx:3.4,sz:3.4})}});for(let[e,n]of t.hedges)for(let r=e;r<n-.01;r+=2)f.add(Z.rbox(1.1,1,Math.min(2.05,n-r),.4),4169546,{p:[t.parkEdge-.6,.5,r+Math.min(2,n-r)/2]});for(let[e,t]of[[-14,-20],[-36,14],[-10,16],[-36,-10]]){f.add(Z.cyl(1.6,1.8,.3,20),jh,{p:[e,.15,t]});for(let n=0;n<10;n++)f.add(Z.sphere(.22,8,6),[16735603,16765286,11765995,16748480][n%4],{p:[e+Math.cos(n*.63)*1.1,.45,t+Math.sin(n*.63)*1.1],cast:!1});f.add(Z.sphere(.5,12,8),5814362,{p:[e,.5,t]})}for(let[e,n]of t.stalls.entries()){let t=(n.minX+n.maxX)/2,i=(n.minZ+n.maxZ)/2,a=n.maxX-n.minX;f.add(Z.rbox(a,n.maxY,n.maxZ-n.minZ,.06),Ph,{p:[t,n.maxY/2,i]});for(let e of[n.minX+.1,n.maxX-.1])f.add(Z.cyl(.06,.06,2.6,6),Fh,{p:[e,1.3,n.minZ+.1]});for(let t=0;t<6;t++)f.add(Z.rbox(a/6,.08,2,.03),t%2?Ih:e?4165466:15087942,{p:[n.minX+a*(t+.5)/6,2.55,i+.4],r:[.25,0,0]});for(let t=0;t<3;t++){f.add(Z.rbox(1,.3,.8,.04),13212258,{p:[n.minX+.7+t*1.3,n.maxY+.15,i]});for(let r=0;r<5;r++)f.add(Z.sphere(.13,8,6),[16726832,16752412,9159498][(t+e)%3],{p:[n.minX+.4+t*1.3+r%3*.28,n.maxY+.38,i-.15+Math.floor(r/3)*.3],cast:!1})}r.push({x:t,z:i,sx:a+1,sz:2.5})}for(let t of e.props)if(t.kind===`lamp`)f.add(Z.cyl(.22,.28,.35,12),3095378,{p:[t.x,.17,t.z],finish:`gloss`}),f.add(Z.cyl(.07,.09,3.3,8),3095378,{p:[t.x,1.9,t.z],finish:`gloss`}),f.add(Z.torus(.1,.03,Math.PI*2,12),zh,{p:[t.x,1,t.z],r:[Math.PI/2,0,0],finish:`metal`}),f.add(Z.rbox(.42,.55,.42,.06),3095378,{p:[t.x,3.75,t.z],finish:`gloss`}),f.add(Z.rbox(.32,.42,.44,.02),16773560,{p:[t.x,3.75,t.z],finish:`glow`}),f.add(Z.rbox(.44,.42,.32,.02),16773560,{p:[t.x,3.75,t.z],finish:`glow`}),f.add(Z.cone(.36,.3,4),3095378,{p:[t.x,4.17,t.z],r:[0,Math.PI/4,0],finish:`gloss`}),r.push({x:t.x,z:t.z,sx:1.1,sz:1.1});else if(t.kind===`bench`){for(let e=0;e<3;e++)f.add(Z.rbox(2.2,.07,.16,.03),14722158,{p:[t.x,.48,t.z-.2+e*.2],finish:`gloss`});for(let e=0;e<2;e++)f.add(Z.rbox(2.2,.16,.06,.03),14722158,{p:[t.x,.75+e*.22,t.z-.36-e*.04],r:[-.18,0,0],finish:`gloss`});for(let e of[-.95,.95])f.add(Z.rbox(.07,.48,.5,.03),3095378,{p:[t.x+e,.24,t.z],finish:`gloss`}),f.add(Z.rbox(.07,.6,.07,.03),3095378,{p:[t.x+e,.8,t.z-.38],r:[-.18,0,0],finish:`gloss`}),f.add(Z.rbox(.08,.06,.5,.03),3095378,{p:[t.x+e*1.05,.68,t.z-.02],finish:`gloss`});r.push({x:t.x,z:t.z,sx:2.8,sz:1.4})}n.add(f.build(!0));for(let e of[...a,...o])n.add(e.build(!0));return n.add(ph(r)),i.push({minX:_.minX-.3,maxX:_.maxX+.3,minY:b,maxY:_.top+4,minZ:_.minZ-.3,maxZ:_.maxZ+.3}),{root:n,cameraBlockers:i,batteryGlow:Kh()}}function Kh(){let e=se.tower,t=e.floor+1.1,n=[new qs(2.4,2.6).translate(e.x,t,e.maxZ+.05),new qs(2.6,2.6).translate(e.x,e.floor+3.05,e.maxZ+.2),new qs(2.6,2.6).rotateY(Math.PI/2).translate(e.maxX+.2,e.floor+3.05,e.z),new qs(2.6,2.6).rotateY(-Math.PI/2).translate(e.minX-.2,e.floor+3.05,e.z),new qs(2.6,2.6).rotateY(Math.PI).translate(e.x,e.floor+3.05,e.minZ-.2)],r=om(n);n.forEach(e=>e.dispose());let i=new G(r,new Ha({map:Em(),color:8124415,transparent:!0,depthWrite:!1,blending:2,side:2,fog:!1}));return i.name=`battery-glow`,i.castShadow=!1,i}function qh(e,t){let n=e.course,i=n.points,a=n.length,o=e=>r(n,e),{jumps:s,gap:c,rampHeight:l,rampLength:u}=n,d=t===`harbor`,[p,m]=f.boardwalk,h=e=>d&&e>=p&&e<m,g=[0];for(let e=1;e<i.length;e++)g.push(g[e-1]+Math.hypot(i[e].x-i[e-1].x,i[e].z-i[e-1].z));let _=i.map((e,t)=>{let n=o(Math.max(0,g[t]-.001)),r=o(g[t]+.001),i=-n.dz-r.dz,a=n.dx+r.dx,s=1/(i*-r.dz+a*r.dx);return{x:i*s,z:a*s}});function v(e,t){let n=0;for(;n<i.length-2&&e>g[n+1];)n++;let r=(e-g[n])/(g[n+1]-g[n]);return[i[n].x+(i[n+1].x-i[n].x)*r+t*(_[n].x+(_[n+1].x-_[n].x)*r),.015,i[n].z+(i[n+1].z-i[n].z)*r+t*(_[n].z+(_[n+1].z-_[n].z)*r)]}let y=new U,b=d?16054267:16174185;if(d){let e=new G(new qs(700,700).rotateX(-Math.PI/2),Om(2074820));e.position.set(160,-.3,-170),e.name=`race-sea`,e.receiveShadow=!0,y.add(e)}for(let e=0;e<a;e+=70){let t=new Q,r=Math.min(e+70,a),f=c?[c.start,c.end]:[],p=[e,...g.filter(t=>t>e&&t<r),...f.filter(t=>t>e&&t<r),r].sort((e,t)=>e-t),m=new Map;for(let e=1;e<p.length;e++){let t=p[e-1],n=p[e],r=c&&t>=c.start&&t<c.end?0:-7,i=v(t,r),a=v(t,7),o=v(n,r),s=v(n,7),l=h(t)?11827531:d?6122106:5860224;if(m.has(l)||m.set(l,[]),m.get(l).push(...i,...a,...o,...a,...s,...o),d&&!h(t))for(let e of[-7,7]){let r=v(t,e),i=v(n,e);m.set(13222580,[...m.get(13222580)??[],r[0],-.35,r[2],i[0],-.35,i[2],r[0],.01,r[2],i[0],-.35,i[2],i[0],.01,i[2],r[0],.01,r[2]])}}for(let[e,n]of m){let r=new Aa;r.setAttribute(`position`,new va(n,3)),r.computeVertexNormals(),t.add(r,e,{cast:!1,finish:e===11827531?`soft`:`matte`}),r.dispose()}for(let n=e;n<r;n+=2){let e=o(n+1),i=Math.min(2.1,r-n+.1);if(h(n)){t.add(new So(14,.02,.06),9067064,{p:[e.x,.03,e.z],r:[0,e.yaw,0],cast:!1});for(let n of[-1,1])t.add(new So(.2,.2,i),16775920,{p:[e.x-e.dz*n*6.8,1,e.z+e.dx*n*6.8],r:[0,e.yaw,0]}),t.add(new So(.22,1,.22),9067064,{p:[e.x-e.dz*n*6.8,.5,e.z+e.dx*n*6.8],r:[0,e.yaw,0]})}else{for(let n of[-1,1])t.add(new So(.35,1.1,i),b,{p:[e.x-e.dz*n*6.8,.55,e.z+e.dx*n*6.8],r:[0,e.yaw,0]});if(d&&n%4<2)for(let n of[-1,1])t.add(new So(.37,.25,2.12),3108789,{p:[e.x-e.dz*n*6.8,.85,e.z+e.dx*n*6.8],r:[0,e.yaw,0],cast:!1});n%8<2&&t.add(new So(.15,.025,2),16777215,{p:[e.x,.065,e.z],r:[0,e.yaw,0]})}}let _=0;for(let n=1;n<i.length-1;n++){if(_+=Math.hypot(i[n].x-i[n-1].x,i[n].z-i[n-1].z),_<e||_>=r)continue;let a=i[n],s=o(_-.1),c=o(_+.1);for(let e of[-1,1]){let n=a.x-s.dz*e*6.8,r=a.z+s.dx*e*6.8,i=a.x-c.dz*e*6.8,o=a.z+c.dx*e*6.8;t.add(new So(.4,1.1,Math.hypot(i-n,o-r)+.4),b,{p:[(n+i)/2,.55,(r+o)/2],r:[0,Math.atan2(i-n,o-r),0]})}}for(let n=e+8;n<r;n+=14){let r=o(n);if(d){Yh(t,n,r);continue}let i=Math.floor(e/140)%4;for(let e of[-1,1]){let n=r.x-r.dz*e*11,a=r.z+r.dx*e*11;if(i===0)t.add(Z.cyl(.3,.45,3),9859668,{p:[n,1.5,a]}),t.add(new Gs(2.6,1),7650701,{p:[n,4,a]}),t.add(new So(3,.4,.8),14858624,{p:[n,.7,a+4]});else if(i===1){t.add(new So(9,.12,14),4833225,{p:[n+e*4,-.25,a]});for(let e=0;e<5;e++)t.add(new So(3,.14,.7),14203275,{p:[n,0,a+e]});t.add(Z.cyl(.12,.12,3),16445909,{p:[n,1.5,a]})}else if(i===2)t.add(new So(1,7.5,1),11253969,{p:[n-e*3,3.75,a]});else{t.add(new So(3.5,1.5,2.5),14659197,{p:[n,.75,a]}),t.add(new So(4.2,.3,3),e>0?15960732:7981498,{p:[n,2.8,a]});for(let e=-1;e<=1;e++)t.add(new Gs(.35,0),15978082,{p:[n+e,1.7,a]})}}i===2&&t.add(new So(17,.35,1),11253969,{p:[r.x,7.5,r.z],r:[0,r.yaw,0]})}let x=[];for(let i of s.filter(t=>t>=e&&t<r)){let e=o(i+u/2),r=i===n.optionalJump,a=r?-3.5:0;t.add(ah(u,l,r?5:10,0),d?5097983:16756304,{p:[e.x-e.dz*a,0,e.z+e.dx*a],r:[0,Math.PI/2+e.yaw,0]});for(let e of[-1,1]){let n=[];for(let t=0;t<=24;t++){let s=t/24,c=o(i+s*u),d=a+e*(r?2.5:5),f=s*l+1.8+.55*(Math.cosh(2*s-1)-1),p=new H(c.x-c.dz*d,f,c.z+c.dx*d);n.push(p),t%2==0&&x.push(p)}t.add(new Qs(new Lo(n),24,.025,3,!1),6771783,{cast:!1})}}let S=t.build();if(x.length){let e=new lc({color:16777215,emissive:16777215,emissiveIntensity:1.3,roughness:.35}),t=new fo(new Xs(.13,6,4),e,x.length),n=[16762997,16745081,16770720,11068597];x.forEach((e,r)=>{t.setMatrixAt(r,new ei().makeTranslation(e.x,e.y,e.z)),t.setColorAt(r,new W(n[r%n.length]))}),t.name=`ramp-string-lights`,S.add(t)}let C=o((e+r)/2);S.userData.center={x:C.x,z:C.z},y.add(S)}if(d){let e=f.lighthouse,t=new Q;t.add(Z.cyl(20,22,.6,40),15324060,{p:[e.x,-.25,e.z],cast:!1}),t.add(Z.cyl(13,16,1.2,32),9224026,{p:[e.x,0,e.z],cast:!1});for(let n=0;n<9;n++)t.add(Z.sphere(1.6,10,8),10261895,{p:[e.x+Math.cos(n*.7)*17,0,e.z+Math.sin(n*.7)*17],s:[1.3,.7,1]});for(let n=0;n<8;n++)t.add(Z.cyl(2.6-n*.12,2.7-n*.12,2.6,24),n%2?15087942:16775920,{p:[e.x,1.3+n*2.6,e.z],finish:`gloss`});t.add(Z.cyl(1.4,1.4,1.8,16),16774338,{p:[e.x,22.6,e.z],finish:`glow`}),t.add(Z.cone(2.2,2,20),15087942,{p:[e.x,24.5,e.z],finish:`gloss`}),t.add(Z.cyl(2.4,2.4,.3,24),2310254,{p:[e.x,21.6,e.z]});let n=t.build();n.userData.center={x:e.x,z:e.z},y.add(n)}let x=new Q,S=o(a);for(let e=0;e<14;e++)for(let t=0;t<2;t++)x.add(new So(1,.03,1),(e+t)%2?16777215:2502726,{p:[S.x-S.dz*(-6.5+e)+S.dx*t,.04,S.z+S.dx*(-6.5+e)+S.dz*t],r:[0,S.yaw,0]});for(let e of[-6.5,6.5])x.add(Z.cyl(.18,.18,6),16735603,{p:[S.x-S.dz*e,3,S.z+S.dx*e]});x.add(new So(13.5,1,.3),16735603,{p:[S.x,5.5,S.z],r:[0,S.yaw,0]});let C=x.build();return C.userData.center={x:S.x,z:S.z},y.add(C),{root:y,...Jh(e,t)}}function Jh(e,t){let n=t===`harbor`,r=e.gate,i=(r.minZ+r.maxZ)/2,a=r.maxX-r.minX,o=(r.minX+r.maxX)/2,s=new Q;for(let e of[r.minX,r.maxX])s.add(Z.capsule(.24,4.5),5767043,{p:[e,2.25,i],cast:!1});s.add(Z.rbox(a+.5,.55,.55),5767043,{p:[o,4.3,i],cast:!1});let c=s.build(!1);c.name=`race-gate-arch`;let l=new lc({vertexColors:!0,emissive:2293589,emissiveIntensity:1,roughness:.25});c.children[0].material=l;let u=new Q;u.add(Z.rbox(.65,1.65,.65),16767557,{p:[0,.8,0],finish:`gloss`,cast:!1}),u.add(Z.cone(1.1,1.25,4),16767557,{p:[0,-.5,0],r:[Math.PI,0,0],finish:`gloss`,cast:!1});let d=u.build(!1);d.name=`race-gate-arrow`,d.position.set(o,6.4,i);let f=new U;f.add(c,d);let p=new Q;for(let e=0;e<=a;e+=.5)p.add(Z.cyl(.055,.055,3.3),16765286,{p:[e,1.65,0]});let m=new Q;for(let e of[r.minX,r.maxX])m.add(Z.rbox(.5,3.8,.5,.1),n?16775920:16765286,{p:[e,1.9,i],finish:`gloss`,cast:!1});n&&m.add(Z.rbox(a*.6,.9,.12,.08),3108789,{p:[o,3.4,i],finish:`gloss`,cast:!1}),t===`oldtown`&&m.add(Z.rbox(a*.6,.9,.12,.08),14182718,{p:[o,3.4,i],finish:`gloss`,cast:!1});let h=p.build();return h.position.set(r.minX,0,i),{gate:h,cues:f,arrow:d,archMaterial:l,entry:m.build(),gatePos:{x:r.minX,z:i}}}function Yh(e,t,n){let[r,i]=f.boardwalk,a=(e,t)=>[n.x-n.dz*e*t,n.z+n.dx*e*t];if(t<r||t>f.cliffRoad){let[r,i]=a(1,16);e.add(new So(18,2.4,15),9224026,{p:[r,.9,i],r:[0,n.yaw,0],cast:!1}),e.add(new So(18.2,2,15.2),14205066,{p:[r,-.2,i],r:[0,n.yaw,0],cast:!1});let[o,s]=a(1,12+t%3);e.add(Z.cyl(.25,.35,2.6,8),9067064,{p:[o,3.2,s]}),e.add(Z.cone(2,4,8),4165466,{p:[o,5.6,s]});let[c,l]=a(-1,9+t%5);if(e.add(Z.sphere(1.2,8,6),10261895,{p:[c,-.1,l],s:[1.4,.8,1.1]}),t%28<14){let[t,n]=a(-1,24);e.add(Z.sphere(.5,10,8),16735581,{p:[t,-.1,n],finish:`gloss`}),e.add(Z.cone(.25,.8,8),16735581,{p:[t,.5,n],finish:`gloss`})}}else if(t<i){for(let n of[-1,1]){let[r,i]=a(n,6.3);if(e.add(Z.cyl(.25,.25,1.4,8),7227950,{p:[r,-.6,i]}),t%28<14){let[t,r]=a(n,7.2);e.add(Z.cyl(.07,.09,4,8),2310254,{p:[t,2,r],finish:`metal`}),e.add(Z.sphere(.28,10,8),16774064,{p:[t,4.1,r],finish:`glow`})}}if(t%42<14){let[t,r]=a(1,7.05);e.add(Z.torus(.35,.1,Math.PI*2,16),16735581,{p:[t,.9,r],r:[0,n.yaw+Math.PI/2,0],finish:`gloss`,cast:!1})}}else for(let n of[-1,1]){let[r,i]=a(n,10+t%4);e.add(Z.sphere(1.3,8,6),10722446,{p:[r,-.1,i],s:[1.3,.7,1.2]})}}var Xh=70,Zh=15851711,Qh=14271386,$h=6272410,eg=16763196;function tg(t){let n=t.course,a=Pe(n),o=n.length,s=new U,c=Math.ceil(o/Xh),l=Array.from({length:c},()=>{let e=new Q;return e.groundAO=.2,e}),u=Array.from({length:c},()=>new Q),d=e=>Math.max(0,Math.min(c-1,Math.floor(e/Xh))),f=n.points.map(e=>e.x),p=n.points.map(e=>e.z),m=new G(new qs(Math.max(...f)-Math.min(...f)+120,Math.max(...p)-Math.min(...p)+120).rotateX(-Math.PI/2),new lc({color:13877924,roughness:.95}));m.position.set((Math.max(...f)+Math.min(...f))/2,-.01,(Math.max(...p)+Math.min(...p))/2),m.receiveShadow=!0,m.name=`flight-ground`,s.add(m);for(let[e,t]of ke.parks)for(let i=e;i<t;i+=8){let e=r(n,i);l[d(i)].add(Z.box(),8176478,{p:[e.x,.01,e.z],r:[0,e.yaw,0],s:[62,.02,9],finish:`matte`,cast:!1})}let h=r(n,ke.arch);{let e=l[d(ke.arch)];for(let t=ke.arch-40;t<ke.arch+45;t+=6){let i=r(n,t);e.add(Z.box(),15325096,{p:[i.x,.02,i.z],r:[0,i.yaw,0],s:[14,.02,6.2],finish:`matte`,cast:!1})}let t=new G(new qs(9,92).rotateX(-Math.PI/2),Om(3121104,{scale:1.4,sparkle:.6}));t.rotation.y=h.yaw,t.position.set(h.x,.05,h.z),t.receiveShadow=!0,t.userData.center={x:h.x,z:h.z},s.add(t)}a.houses.forEach((e,t)=>{let r=(e.minX+e.maxX)/2,a=(e.minZ+e.maxZ)/2,o=i(n,r,a),s=o.x-r,c=o.z-a,f=Math.abs(s)>Math.abs(c)?s>0?0:2:c>0?1:3;Vh(l[d(e.d)],u[d(e.d)],e,f,t+3)}),a.trees.forEach((e,t)=>Uh(l[d(e.d)],e.x,e.z,t,e.s*1.25));for(let e of a.chimneys){let t=l[d(e.d)],n=e.maxX-e.minX;t.add(Z.rbox(n,e.maxY-e.minY,n,.08),15250592,{p:[(e.minX+e.maxX)/2,(e.minY+e.maxY)/2,(e.minZ+e.maxZ)/2]}),t.add(Z.rbox(n+.2,.18,n+.2,.06),16775920,{p:[(e.minX+e.maxX)/2,e.maxY+.09,(e.minZ+e.maxZ)/2]})}{let e=l[d(a.arch.d)],t=a.arch.deck;for(let t of a.arch.piers)e.add(Z.rbox(t.maxX-t.minX,t.maxY,t.maxZ-t.minZ,.12),Zh,{p:[(t.minX+t.maxX)/2,t.maxY/2,(t.minZ+t.maxZ)/2]});e.add(Z.rbox(t.maxX-t.minX,t.maxY-t.minY,t.maxZ-t.minZ,.12),Qh,{p:[(t.minX+t.maxX)/2,(t.minY+t.maxY)/2,(t.minZ+t.maxZ)/2]});let n=t.maxX-t.minX>t.maxZ-t.minZ;e.add(Z.torus(5.6,.45,Math.PI,32),Zh,{p:[h.x,.6,h.z],r:[0,n?0:Math.PI/2,0]});for(let r of[-1,1])for(let i=-9;i<=9;i+=1.5){let a=n?h.x+i:h.x+r*1.5,o=n?h.z+r*1.5:h.z+i;e.add(Z.rbox(.5,.7,.5,.08),16775920,{p:[n?a:r>0?t.maxX:t.minX,t.maxY+.35,n?r>0?t.maxZ:t.minZ:o]})}for(let[n,r]of[[-5,-3],[5,3],[-6,4]])e.add(Z.sphere(.6,10,8),5814362,{p:[h.x+n*.4,t.maxY+.4,h.z+r*.4],s:[1.4,.6,1]})}{let e=a.cathedral,t=l[d(e.d)],i=(e.minX+e.maxX)/2,o=(e.minZ+e.maxZ)/2,s=e.maxX-e.minX;t.add(Z.rbox(s,e.maxY,s,.15),Zh,{p:[i,e.maxY/2,o]});for(let n=4;n<e.maxY;n+=5)t.add(Z.rbox(s+.3,.35,s+.3,.08),Qh,{p:[i,n,o]});for(let[n,r,a]of[[0,1,0],[0,-1,Math.PI],[1,0,Math.PI/2],[-1,0,-Math.PI/2]])t.add(Z.cyl(1.4,1.4,.12,32),16775920,{p:[i+n*(s/2+.05),e.maxY-5,o+r*(s/2+.05)],r:[Math.PI/2,a,0],finish:`gloss`}),t.add(Z.torus(1.4,.1,Math.PI*2,32),eg,{p:[i+n*(s/2+.1),e.maxY-5,o+r*(s/2+.1)],r:[0,a,0],finish:`metal`}),t.add(Z.rbox(1.2,2.4,.2,.3),3817301,{p:[i+n*(s/2+.02),e.maxY-1.8,o+r*(s/2+.02)],r:[0,a,0],finish:`gloss`,cast:!1});t.add(new Eo(s*.75,9,4,1),$h,{p:[i,e.maxY+4.5,o],r:[0,Math.PI/4,0],finish:`gloss`}),t.add(Z.sphere(.4,12,8),eg,{p:[i,e.maxY+9.2,o],finish:`metal`}),t.add(Z.rbox(12,9,8,.2),16507828,{p:[i+(e.minX>r(n,e.d).x?7:-7),4.5,o]})}for(let[t,i]of[[0,5767043],[o,16735603]]){let a=r(n,t),o=l[d(t)],s=e(n,t);for(let e of[-1,1])o.add(Z.rbox(.8,s+6,.8,.15),Zh,{p:[a.x-a.dz*e*9.5,(s+6)/2,a.z+a.dx*e*9.5]});o.add(Z.rbox(19.8,1.1,.4,.12),i,{p:[a.x,s+5.8,a.z],r:[0,a.yaw,0],finish:`gloss`});for(let e=0;e<12;e++)for(let n=0;n<2;n++)u[d(t)].add(Z.box(),(e+n)%2?16777215:2502726,{p:[a.x-a.dz*(-5.5+e)+a.dx*n*.55,s+5.3+n*0,a.z+a.dx*(-5.5+e)+a.dz*n*.55],r:[0,a.yaw,0],s:[.98,.04,.5],cast:!1});o.add(Z.cyl(6,6,.06,40),14930869,{p:[a.x,.02,a.z],finish:`matte`,cast:!1})}for(let e=0;e<c;e++){let t=new U;t.add(l[e].build(!0),u[e].build(!0));let i=r(n,Math.min(o,(e+.5)*Xh));t.userData.center={x:i.x,z:i.z},t.name=`flight-chunk`,s.add(t)}return s.add(ng(t),rg(t)),{root:s,...Jh(t,`oldtown`)}}function ng(t){let n=t.course,i=new is;i.moveTo(-1.1,0),i.lineTo(0,.85),i.lineTo(1.1,0),i.lineTo(1.1,-.45),i.lineTo(0,.4),i.lineTo(-1.1,-.45),i.closePath();let a=new Hs(i,{depth:.08,bevelEnabled:!1}).rotateX(-Math.PI/2),o=[],s=n.air.rings;for(let e=8;e<n.length-6;e+=12)s.some(t=>Math.abs(t-e)<5)||o.push(e);let c=new fo(a,new Ha({color:10354640,transparent:!0,opacity:.85,depthWrite:!1,fog:!1,side:2}),o.length),l=new ei,u=new Ar,d=new ui,f=new H,p=new H(1,1,1);return o.forEach((t,i)=>{let a=r(n,t),o=e(n,t)+.6,s=e(n,t+3)+.6;u.setFromEuler(d.set(Math.atan2(s-o,3),a.yaw,0,`YXZ`)),l.compose(f.set(a.x,o,a.z),u,p),c.setMatrixAt(i,l)}),c.name=`flight-chevrons`,c.frustumCulled=!1,c.renderOrder=2,c}function rg(t){let n=t.course,i=n.rail+.4,a=[16735603,16765286,5097983,11765995],o=[];for(let e=12;e<n.length-6;e+=24)for(let t of[-1,1])o.push([e,t]);let s=new fo(new Xs(.45,12,10),new lc({color:16777215,roughness:.3,emissive:2236962}),o.length),c=new ei,l=new W;return o.forEach(([t,o],u)=>{let d=r(n,t),f=e(n,t)+1;c.makeScale(1,1.2,1).setPosition(d.x-d.dz*o*i,f,d.z+d.dx*o*i),s.setMatrixAt(u,c),s.setColorAt(u,l.set(a[u%a.length]))}),s.name=`flight-corridor`,s.frustumCulled=!1,s}function ig(){let e=new Q,t=rt.roof;for(let n=22.4;n<26.8;n+=.3)for(let r of[-29.25,-26.95])e.add(Z.rbox(.28,.04,.28,.02),1423538,{p:[n,t+.04,r]});e.add(Z.rbox(4,.04,2.2,.1),3329255,{p:[24.5,t+.14,-28.1],finish:`gloss`});for(let n of[23,27])for(let r of[-24.5,-22.5])e.add(Z.cyl(.06,.06,1.8),14333578,{p:[n,t+.9,r]});for(let n=23;n<=27;n+=.35)e.add(Z.rbox(.13,.1,2.5,.04),15320984,{p:[n,t+1.85,-23.5]});for(let n of[23.6,25,26.4])e.add(Z.rbox(.7,.24,1.5,.1),16777215,{p:[n,t+.15,-23.5]}),e.add(Z.rbox(.62,.06,1.3,.03),16745649,{p:[n,t+.3,-23.5]});for(let n of[28.7,23]){e.add(Z.cyl(.08,.13,1.8),13013602,{p:[n,t+.9,-29]});for(let r=0;r<6;r++)e.add(Z.sphere(.4,16,8),4373110,{p:[n+Math.cos(r)*.35,t+1.8,-29+Math.sin(r)*.35],s:[1.5,.15,.6],r:[0,-r,0]})}return e.add(Z.rbox(.5,.12,.35,.05),16770544,{p:[28.7,t+.1,-27.3]}),e.build()}var ag={speed:1,jump:1,knockback:1,stun:1,fireCooldown:.28,blobScale:1,projSpeed:1,aimRange:16,aimCone:.9,glueTime:5,maxBlocks:10,padLaunch:1,padScale:1,multishot:1,rideSpeed:1,personalSpace:0},og=[`head`,`body`,`legs`,`gun`],sg={head:[{id:`cube`,stats:{glueTime:6.5}},{id:`bighead`,stats:{blobScale:1.35}},{id:`robot`,stats:{aimRange:24}},{id:`cat`,stats:{stun:.4}},{id:`knight`,stats:{knockback:.75}},{id:`alien`,stats:{aimCone:.8}}],body:[{id:`tshirt`,stats:{speed:1.06}},{id:`hoodie`,stats:{maxBlocks:13}},{id:`tank`,stats:{knockback:.45,speed:.95}},{id:`tuxedo`,stats:{personalSpace:.8}},{id:`slimesuit`,stats:{padLaunch:1.2}},{id:`stripes`,stats:{rideSpeed:1.15}}],legs:[{id:`jeans`,stats:{knockback:.9}},{id:`shorts`,stats:{speed:1.1}},{id:`robolegs`,stats:{jump:1.1,speed:.96}},{id:`springs`,stats:{jump:1.28}},{id:`boots`,stats:{knockback:.7,speed:.95}},{id:`wheels`,stats:{speed:1.3,jump:.9}}],gun:[{id:`blaster`,stats:{}},{id:`rapid`,stats:{fireCooldown:.12}},{id:`bazooka`,stats:{blobScale:1.8,fireCooldown:.55}},{id:`bubble`,stats:{padScale:1.4}},{id:`twin`,stats:{multishot:2,fireCooldown:.36}},{id:`ray`,stats:{projSpeed:1.5,aimRange:26}}]},cg=[`speed`,`jump`,`knockback`,`stun`,`blobScale`,`projSpeed`,`padLaunch`,`padScale`,`rideSpeed`];function lg(e){let t={...ag};return og.forEach((n,r)=>{let i=sg[n][e[r]]??sg[n][0];for(let[e,n]of Object.entries(i.stats))cg.includes(e)?t[e]*=n:t[e]=n}),t}function ug(e){let t=e+1831565813|0,n=Math.imul(t^t>>>15,1|t);return n=n+Math.imul(n^n>>>7,61|n)^n,[((n^n>>>14)>>>0)/4294967296,t]}function dg(e){let[t,n]=ug(e.rng);return e.rng=n,t}function fg(e,t,n){return t+(n-t)*dg(e)}var pg=Math.PI*2,mg=2.6,hg=7,gg=.45,_g=[`flip`,`roll`,`twist`],vg={flip:100,roll:120,twist:80,spin:60};function yg(e,t,n,r,i,a,o){e.events.push({type:t,x:n,y:r,z:i,who:a,info:o})}function bg(e){let t=Ve(e.level).mission,n=M[t.vehicle];n.parts.forEach((r,i)=>{e.pickups.push({id:e.nextId++,vehicle:n.id,part:r.id,pos:{...t.partSpots[i]},status:`world`,carrier:null})}),e.garages.push({id:e.nextId++,vehicle:n.id,x:t.garage.x,z:t.garage.z,radius:t.garage.radius,delivered:[],built:!1})}function xg(e,t,n,r,i,a){let o=M[t],s={id:e.nextId++,kind:t,pos:{x:n,y:r,z:i},vel:{x:0,y:0,z:0},grounded:!0,radius:o.radius,height:o.height,padCd:0,yaw:a,speed:0,rider:null,airTime:0,spin:0,flip:0,roll:0,twist:0,spinDone:0,trick:null,trickT:0,combo:[],nextTrick:0,lastClimb:0};return e.vehicles.push(s),s}function Sg(e,t){if(t.riding!==null)return null;let n=null,r=mg;for(let i of e.vehicles){if(i.rider!==null)continue;let e=Math.hypot(i.pos.x-t.pos.x,i.pos.z-t.pos.z);e<r&&Math.abs(i.pos.y-t.pos.y)<1.5&&(n=i,r=e)}return n}function Cg(e,t,n){if(t.riding!==null){let r=e.vehicles.find(e=>e.id===t.riding);if(t.riding=null,!r)return;r.rider=null,r.speed=0;let i=Math.cos(r.yaw),a=-Math.sin(r.yaw);for(let e of[1.2,-1.2]){let o=r.pos.x+i*e,s=r.pos.z+a*e;if(!n.blocked(o,s,r.pos.y,t.radius,t.height)){t.pos={x:o,y:r.pos.y,z:s};break}}t.vel={x:0,y:0,z:0},t.grounded=!1,yg(e,`dismount`,t.pos.x,t.pos.y,t.pos.z,t.id);return}let r=Sg(e,t);r&&(r.rider=t.id,t.riding=r.id,yg(e,`mount`,r.pos.x,r.pos.y,r.pos.z,t.id))}function wg(e){for(let t of e.players){let n=0;for(let r of e.pickups){if(r.status===`carried`&&r.carrier===t.id){let i=e.time*2+n*1.3;r.pos={x:t.pos.x+Math.cos(i)*.35,y:t.pos.y+2.3+n*.55,z:t.pos.z+Math.sin(i)*.35},n++;continue}if(r.status!==`world`)continue;let i=r.pos.x-t.pos.x,a=r.pos.y-(t.pos.y+.9),o=r.pos.z-t.pos.z;i*i+a*a+o*o<2.25&&(r.status=`carried`,r.carrier=t.id,yg(e,`pickup`,r.pos.x,r.pos.y,r.pos.z,t.id,r.part))}for(let n of e.garages){if(Math.hypot(t.pos.x-n.x,t.pos.z-n.z)>n.radius||t.pos.y>1.5)continue;for(let r of e.pickups)r.status===`carried`&&r.carrier===t.id&&r.vehicle===n.vehicle&&(r.status=`delivered`,r.carrier=null,n.delivered.push(r.part),yg(e,`deliver`,n.x,1,n.z,t.id,r.part));let r=M[n.vehicle];!n.built&&r.parts.every(e=>e.accessory||n.delivered.includes(e.id))&&(n.built=!0,xg(e,n.vehicle,n.x,0,n.z,0),yg(e,`built`,n.x,1,n.z,t.id,n.vehicle))}}}function Tg(e,t,n,r,a){let o=M[t.kind],s=t.rider!==null,c=0,l=0,u=0;s&&n&&(c=n.mx*-Math.sin(t.yaw)+n.mz*-Math.cos(t.yaw),l=n.mx*Math.cos(t.yaw)+n.mz*-Math.sin(t.yaw),u=+!!n.up-!!n.down),t.yaw-=l*o.turnRate*r;let d=-Math.sin(t.yaw),f=-Math.cos(t.yaw),p=s?e.players.find(e=>e.id===t.rider):void 0,m=c>0?c*o.maxSpeed*(p?p.stats.rideSpeed:1):c*o.reverseSpeed,h=(Math.abs(c)>.05?o.accel:o.brake*.5)*r,g=d*m-t.vel.x,_=f*m-t.vel.z,y=Math.hypot(g,_),b=y>h?h/y:1;t.vel.x+=g*b,t.vel.z+=_*b;let x=o.climb??5,S=o.ceiling??25,C=s?u*x:-4;C>0&&(C*=Math.max(0,Math.min(1,(S-t.pos.y)/4))),t.pos.y>S&&(C=Math.min(C,-(t.pos.y-S)*1.5)),t.vel.y+=Eg(C-t.vel.y,(s?14:9)*r);let w=!1,T=e.world.half,E=t.radius,D=t.height,O=t.pos.x+t.vel.x*r;a.blocked(O,t.pos.z,t.pos.y,E,D)||Math.abs(O)>T-E?(w||(w=Math.abs(t.vel.x)>2),t.vel.x=-t.vel.x*.55):t.pos.x=O;let k=t.pos.z+t.vel.z*r;a.blocked(t.pos.x,k,t.pos.y,E,D)||Math.abs(k)>T-E?(w||(w=Math.abs(t.vel.z)>2),t.vel.z=-t.vel.z*.55):t.pos.z=k;let A=t.pos.y+t.vel.y*r;if(t.vel.y>0)for(let e of[a.statics,a.dynamics])for(let n of e)t.pos.x+E<=n.minX||t.pos.x-E>=n.maxX||t.pos.z+E<=n.minZ||t.pos.z-E>=n.maxZ||n.minY<t.pos.y+D-.01||n.minY>=A+D||(A=n.minY-D,w||(w=t.vel.y>2),t.vel.y=-Math.min(2,t.vel.y*.4));let j=a.groundAt(t.pos.x,t.pos.z,t.pos.y+v,E);A<=j?(t.pos.y=j,t.vel.y=Math.max(0,t.vel.y),t.grounded=!0):(t.pos.y=A,t.grounded=!1),w&&yg(e,`bonk`,t.pos.x,t.pos.y+.6,t.pos.z,t.rider??void 0);let N=Ke(e),P=Ve(e.level).bounds;if(e.race.phase===`racing`&&N){let e=i(N.course,t.pos.x,t.pos.z);if(e.distance>N.course.rail){let n=N.course.rail/e.distance;t.pos.x=e.x+(t.pos.x-e.x)*n,t.pos.z=e.z+(t.pos.z-e.z)*n,t.vel.x*=.9,t.vel.z*=.9}}else if(P)for(let[e,n,r]of[[`x`,P.minX,P.maxX],[`z`,P.minZ,P.maxZ]]){let i=t.pos[e];i<n?(t.vel[e]=Math.max(t.vel[e],(n-i)*4),t.pos[e]=Math.max(i,n-2)):i>r&&(t.vel[e]=Math.min(t.vel[e],(r-i)*4),t.pos[e]=Math.min(i,r+2))}if(t.speed=t.vel.x*d+t.vel.z*f,s&&Math.hypot(t.vel.x,t.vel.z)>1.5&&(e.rideTime+=r),t.pos.y<-5||we(e,t.pos.x,t.pos.y,t.pos.z)){let n=Ve(e.level).mission.garage;t.pos={x:n.x,y:0,z:n.z},t.vel={x:0,y:0,z:0},t.speed=0}}function Eg(e,t){return e>t?t:e<-t?-t:e}function Dg(e,t,n,a,o){let s=M[t.kind];if(s.flies){Tg(e,t,n,a,o);return}t.padCd-=a;let c=-Math.sin(t.yaw),l=-Math.cos(t.yaw),u=0,d=0;if(t.rider!==null&&n){let r=Math.cos(t.yaw),i=-Math.sin(t.yaw);u=n.mx*c+n.mz*l,d=n.mx*r+n.mz*i,n.jump&&t.grounded&&(t.vel.y=s.hopVel,t.grounded=!1,yg(e,`jump`,t.pos.x,t.pos.y,t.pos.z,t.rider)),n.trick&&!t.grounded&&t.trick===null&&(t.trick=_g[t.nextTrick++%_g.length],t.trickT=0)}if(t.grounded){u>.05?t.speed+=u*(t.speed<0?s.brake:s.accel)*a:u<-.05?t.speed+=u*(t.speed>0?s.brake:s.accel*.5)*a:t.speed-=t.speed*s.drag*2*a,t.speed-=t.speed*s.drag*.2*a;let n=t.rider===null?void 0:e.players.find(e=>e.id===t.rider),r=s.maxSpeed*(n?n.stats.rideSpeed:1);t.speed=Math.max(-s.reverseSpeed,Math.min(r,t.speed));let i=Math.min(1,Math.abs(t.speed)/3)*Math.sign(t.speed);t.yaw-=d*s.turnRate*i*a}else{let e=d*hg*a;t.yaw-=e,t.spin+=e}let f=-Math.sin(t.yaw),p=-Math.cos(t.yaw);t.vel.x=f*t.speed,t.vel.z=p*t.speed;let m=t.grounded,h=t.pos.y;j(t,a,o,e.world.half)&&Math.abs(t.speed)>2&&(t.speed*=-.3,yg(e,`bonk`,t.pos.x,t.pos.y+.6,t.pos.z,t.rider??void 0)),t.grounded?t.lastClimb=Math.min((t.pos.y-h)/a,Math.abs(t.speed)):m&&t.vel.y<=0&&t.lastClimb>1&&(t.vel.y=t.lastClimb*.9,t.vel.y+=-22*a);let g=Ke(e);if(e.race.phase===`racing`&&g){let e=g.course,n=i(e,t.pos.x,t.pos.z);if(n.distance>e.rail){let r=e.rail/n.distance;t.pos.x=n.x+(t.pos.x-n.x)*r,t.pos.z=n.z+(t.pos.z-n.z)*r,t.speed*=.96}let a=(t.pos.x-n.x)*-n.dz+(t.pos.z-n.z)*n.dx,o=e.jumps.find(t=>n.progress>=t&&n.progress<=t+e.rampLength);if(o!==void 0&&(o!==e.optionalJump||a<-.5)){let r=e.rampHeight/e.rampLength,i=(n.progress-o)*r;t.pos.y<=i+.3&&(t.vel.y<=0||t.pos.y<i)&&(t.pos.y=i,t.vel.y=0,t.grounded=!0,t.lastClimb=Math.abs(t.speed)*r,n.progress>o+e.rampLength-.3&&(t.vel.y=(Math.abs(t.speed)*r+2)*s.launch,t.grounded=!1))}if(e.gap&&n.progress>e.gap.start&&n.progress<e.gap.end&&a<-.5&&t.pos.y<.15){let i=r(e,n.progress-10);t.pos.x=i.x,t.pos.z=i.z,t.speed=0}}if(t.padCd<=0&&t.vel.y<=.5){for(let n of e.pads)if(!(Math.hypot(t.pos.x-n.pos.x,t.pos.z-n.pos.z)>1.4*n.scale||Math.abs(t.pos.y-n.pos.y)>.4)){t.vel.y=16,t.grounded=!1,t.padCd=.4,n.squish=1,t.rider!==null&&t.trick===null&&(t.trick=`flip`,t.trickT=0),yg(e,`bounce`,n.pos.x,n.pos.y,n.pos.z,t.id);break}}if(t.grounded)t.trick?kg(e,t):t.combo.length&&Og(e,t),t.airTime=0,t.spin=0,t.spinDone=0,t.flip=t.roll=t.twist=0,t.trick=null,t.combo=[];else{if(t.airTime+=a,t.trick){t.trickT=Math.min(1,t.trickT+a/gg);let e=pg*(1-(1-t.trickT)**2);t.flip=t.trick===`flip`?e:0,t.roll=t.trick===`roll`?e:0,t.twist=t.trick===`twist`?e:0,t.trickT>=1&&(t.combo.push(t.trick),t.trick=null,t.flip=t.roll=t.twist=0)}Math.abs(t.spin)>=pg*(t.spinDone+1)-.3&&(t.spinDone++,t.combo.push(`spin`))}if(t.rider!==null&&Math.abs(t.speed)>1.5&&(e.rideTime+=a),t.pos.y<-5||we(e,t.pos.x,t.pos.y,t.pos.z)){let n=Ve(e.level).mission.garage;t.pos={x:n.x,y:0,z:n.z},t.vel={x:0,y:0,z:0},t.speed=0}}function Og(e,t){if(t.rider===null)return;let n=t.combo.reduce((e,t)=>e+vg[t],0)*t.combo.length,r=Math.floor(dg(e)*6);e.tricks++,e.race.points+=e.race.phase===`racing`?n:0,yg(e,`trick`,t.pos.x,t.pos.y+1,t.pos.z,t.rider,`${t.combo.join(`+`)}|${n}|${r}`),Ze(e,Math.min(6,2*t.combo.length),t.pos.x,t.pos.y+1.5,t.pos.z,`trick`)}function kg(e,t){t.speed*=.5,yg(e,`bail`,t.pos.x,t.pos.y+1,t.pos.z,t.rider??void 0)}function Ag(e,t){let n=e.vehicles.find(e=>e.id===t.riding);if(!n){t.riding=null;return}let r=M[n.kind];t.pos={x:n.pos.x,y:n.pos.y+r.seatY,z:n.pos.z},t.vel={...n.vel},t.grounded=n.grounded,t.yaw=n.yaw}function jg(e){return e.tricks>0||e.rideTime>=Ve(e.level).mission.rideGoal}function Mg(e,t,n=1){let r=Ve(n),i={level:n,race:Ue(),elevator:{y:.26,target:0,wait:2},tick:0,time:0,rng:e|0,nextId:1,world:r.createWorld(),players:[],creatures:[],projectiles:[],pads:[],blocks:[],pickups:[],garages:[],vehicles:[],rideTime:0,tricks:0,splats:[],events:[],status:`playing`,winTime:0};return Ng(i,t),[...r.creatureSpawns,...r.hintSpawn?[r.hintSpawn]:[]].forEach((e,t)=>{let n={id:i.nextId++,seed:Math.floor(dg(i)*1e9),pos:{x:e.x,y:0,z:e.z},vel:{x:0,y:0,z:0},grounded:!0,radius:y,height:b,padCd:0,yaw:dg(i)*Math.PI*2,home:{x:e.x,z:e.z},target:{x:e.x,z:e.z},mode:`wander`,thinkTimer:0,stuck:0,hitCd:0,hopCd:0,orbit:dg(i)*Math.PI*2,orbitDir:dg(i)<.5?1:-1,blocker:i.creatures.length%2==1,talk:0,phrase:0,talkCd:fg(i,.5,3),chatUntil:0,chatPartner:null,twirl:0,hinter:t>=r.creatureSpawns.length};i.creatures.push(n)}),bg(i),i}function Ng(e,t){let n={id:e.nextId++,look:t,pos:{...Ve(e.level).spawn},vel:{x:0,y:0,z:0},grounded:!0,radius:h,height:g,padCd:0,yaw:0,shape:`cube`,fireCd:0,stun:0,jumpBuffer:0,walkPhase:0,riding:null,stats:lg(t)};return e.players.push(n),n}function Pg(e,t,n,r,i,a){e.events.push({type:t,x:n,y:r,z:i,who:a})}function Fg(e){let t=Ve(e.level),n=Ke(e)?.gate,r=e.race.phase,i=r===`racing`||r===`finished`||r===`failed`?e.world.raceSolids??[]:[];return new A([...e.world.solids,...i,...r===`locked`&&n?[n]:[]],[...e.blocks.map(D),...t.tower?[at(e.elevator.y)]:[]])}function Ig(e,t,n){e.events=[],e.tick++,e.status===`playing`&&(e.time+=n),Ve(e.level).tower&&ot(e,t,n);let r=Fg(e);for(let n of e.players){let i=t[n.id];i&&Rg(e,n,i,r)}for(let i of e.vehicles){let a=i.rider===null?void 0:e.players.find(e=>e.id===i.rider);Dg(e,i,a?t[a.id]:void 0,n,r)}for(let i of e.players)i.riding===null?qg(e,i,t[i.id],n,r):(i.fireCd-=n,i.stun=0,Ag(e,i));for(let t of e.creatures)Qg(e,t,n,r);e_(e,n,r),n_(e,n),wg(e);for(let t of e.splats)t.life-=n;e.splats=e.splats.filter(e=>e.life>0),$e(e,n),!Ke(e)&&e.status===`playing`&&jg(e)&&(e.status=`won`,e.winTime=e.time,Pg(e,`win`,0,0,0))}function Lg(e){return[-Math.sin(e),-Math.cos(e)]}function Rg(e,t,n,r){n.interact&&Cg(e,t,r),n.toggleShape&&(t.shape=t.shape===`cube`?`ramp`:`cube`),n.jump&&t.riding===null&&(t.jumpBuffer=.15),t.fireCd<=0&&(n.sticky||n.bouncy)&&zg(e,t,n.sticky?`sticky`:`bouncy`,n.aimYaw),n.place&&t.riding===null&&Gg(e,t,n.aimYaw,r)}function zg(e,t,n,r){t.riding!==null&&(r=e.vehicles.find(e=>e.id===t.riding)?.yaw??r);let i=t.stats;t.fireCd=i.fireCooldown,t.yaw=r;for(let a=0;a<i.multishot;a++)Bg(e,t,n,r+(a-(i.multishot-1)/2)*.12)}function Bg(e,t,n,r){let i=t.stats,[a,o]=Lg(r),s=t.pos.x+a*.6+-o*.3,c=t.pos.y+1.1,l=t.pos.z+o*.6+a*.3,u,d,f;if(n===`sticky`){let n=null,r=i.aimRange;for(let s of e.creatures){if(s.stuck>0)continue;let e=s.pos.x-t.pos.x,c=s.pos.z-t.pos.z,l=Math.hypot(e,c);l<.5||l>r||(e*a+c*o)/l<i.aimCone||(n=s,r=l)}let p=22*i.projSpeed;if(n){let e=n.pos.x-s,t=n.pos.y+.5-c,r=n.pos.z-l,i=Math.hypot(e,t,r),a=i/p;u=e/i*p,d=t/i*p+.5*Vg*a,f=r/i*p}else u=a*p,d=2.5,f=o*p}else{let e=12*i.projSpeed;u=a*e,d=5,f=o*e}e.projectiles.push({id:e.nextId++,kind:n,owner:t.id,pos:{x:s,y:c,z:l},vel:{x:u+t.vel.x*.3,y:d,z:f+t.vel.z*.3},life:3,scale:n===`sticky`?i.blobScale:1}),Pg(e,`shoot`,s,c,l,t.id)}var Vg=6,Hg=16;function Ug(e){let[t,n]=Lg(e);return Math.abs(t)>Math.abs(n)?t>0?0:2:n>0?1:3}function Wg(e,t,n,r){let i=Ug(n),a=i===0?1:i===2?-1:0,o=i===1?1:i===3?-1:0,s=Math.floor(t.pos.x+a*1.4),c=Math.floor(t.pos.z+o*1.4),l=e.world.half,u=r.groundAt(s+.5,c+.5,t.pos.y+1.2,.45),d=Math.round(u*1e3)/1e3,f={x:s,y:d,z:c,dir:i,ok:!1};if(Math.abs(s+.5)>l-.5||Math.abs(c+.5)>l-.5)return f;for(let e of[r.statics,r.dynamics])for(let t of e)if(!(t.maxX<=s+.01||t.minX>=s+.99||t.maxZ<=c+.01||t.minZ>=c+.99)&&!(t.minY>=d+1-.01)&&!(E(t,s+.5,c+.5)<=d+.01))return f;let p=[...e.players,...e.creatures];for(let e of p)if(e.pos.x+e.radius>s&&e.pos.x-e.radius<s+1&&e.pos.z+e.radius>c&&e.pos.z-e.radius<c+1&&e.pos.y<d+1-.01&&e.pos.y+e.height>d)return f;return f.ok=!0,f}function Gg(e,t,n,r){let i=Wg(e,t,n,r);if(t.yaw=n,!i.ok)return Pg(e,`noroom`,i.x+.5,i.y+.5,i.z+.5,t.id),!1;e.blocks.length>=t.stats.maxBlocks&&e.blocks.shift();let a={id:e.nextId++,shape:t.shape,x:i.x,y:i.y,z:i.z,dir:i.dir};return e.blocks.push(a),r.dynamics=e.blocks.map(D),Pg(e,`block`,i.x+.5,i.y+.5,i.z+.5,t.id),!0}function Kg(e,t,n,r=1){if(!(t.padCd>0||t.vel.y>.5))for(let i of e.pads){let a=t.pos.x-i.pos.x,o=t.pos.z-i.pos.z;if(a*a+o*o>(1.2*i.scale+t.radius*.5)**2||Math.abs(t.pos.y-i.pos.y)>.35)continue;t.vel.y=16*r,t.grounded=!1,t.padCd=.4,i.squish=1;let s=e.creatures.find(e=>e.id===n);s&&(s.phrase=100+Math.floor(dg(e)*3),s.talk=3,s.stuck=0),Pg(e,`bounce`,i.pos.x,i.pos.y,i.pos.z,n);return}}function qg(e,t,n,r,i){let a=t.stats;t.fireCd-=r,t.padCd-=r,t.jumpBuffer-=r,t.stun-=r;let o=n?n.mx:0,s=n?n.mz:0,c=Math.hypot(o,s);c>1&&(o/=c,s/=c);let l=t.stun>0?0:1,u=(t.grounded?40:12)*l,d=Ve(e.level).tower&&t.pos.y>=rt.roof-.2&&t.pos.y<rt.roof+.5&&(t.pos.x>22.5&&t.pos.x<26.5&&t.pos.z>-29.2&&t.pos.z<-27||Math.hypot(t.pos.x-27.755,t.pos.z+28.21)<.8);d&&c>.1&&e.tick%18==0&&Pg(e,`splat`,t.pos.x,t.pos.y+.2,t.pos.z);let f=o*m*a.speed*(d?.4:1),p=s*m*a.speed*(d?.4:1);t.vel.x+=Yg(f-t.vel.x,u*r),t.vel.z+=Yg(p-t.vel.z,u*r),l===0&&t.grounded&&(t.vel.x*=.92,t.vel.z*=.92),c>.1&&l&&(t.yaw=Xg(t.yaw,Math.atan2(-o,-s),r*12)),t.jumpBuffer>0&&t.grounded&&t.stun<=0&&(t.vel.y=_*a.jump,t.grounded=!1,t.jumpBuffer=0,Pg(e,`jump`,t.pos.x,t.pos.y,t.pos.z,t.id)),j(t,r,i,e.world.half),Kg(e,t,t.id,a.padLaunch),t.grounded&&(t.walkPhase+=Math.hypot(t.vel.x,t.vel.z)*r*1.6);let h=we(e,t.pos.x,t.pos.y,t.pos.z);(t.pos.y<-5||h)&&(t.pos={...Ve(e.level).spawn},t.vel={x:0,y:0,z:0})}function Jg(e){let t=Ve(e.level).mission;return(t.hint??t.liftOnly??[]).some(t=>e.pickups[t]?.status===`world`)}function Yg(e,t){return e>t?t:e<-t?-t:e}function Xg(e,t,n){let r=t-e;for(;r>Math.PI;)r-=Math.PI*2;for(;r<-Math.PI;)r+=Math.PI*2;return e+Yg(r,n)}function Zg(e,t){let n=null,r=1/0;for(let i of e.players){let e=Math.hypot(i.pos.x-t.pos.x,i.pos.z-t.pos.z);e<r&&(r=e,n=i)}return[n,r]}function Qg(e,t,n,r){t.padCd-=n,t.hitCd-=n,t.hopCd-=n,t.thinkTimer-=n,t.talk=Math.max(0,t.talk-n),t.twirl=Math.max(0,t.twirl-n);let i=t.stuck>0;t.stuck-=n;let[a,o]=Zg(e,t),s=0,c=0,l=0;if(t.stuck>0)t.vel.x=0,t.vel.z=0,t.talk=0,t.twirl=0;else{if(i&&(t.thinkTimer=0),a){let e=Math.abs(a.pos.y-t.pos.y);t.mode===`wander`&&o<9&&e<2.5?t.mode=`crowd`:t.mode===`crowd`&&(o>15||e>4)&&(t.mode=`wander`,t.thinkTimer=0)}let r=e.race.phase===`racing`?t.dash:void 0,u=e.race.phase===`racing`&&!!Ke(e)?.course.air,d=!!t.hinter&&o<12&&Jg(e);if(d&&(t.talkCd-=n,t.talkCd<=0&&!(t.phrase>=100&&t.phrase!==200&&t.talk>0)&&(t.phrase=200,t.talk=3.4,t.talkCd=fg(e,6,9),Pg(e,`babble`,t.pos.x,t.pos.y+1.4,t.pos.z,t.id))),r?.bounce)t.mode=`wander`,a&&o<18&&t.grounded&&t.hopCd<=0&&(t.vel.y=11.5,t.grounded=!1,t.hopCd=3,t.twirl=.5,t.talk<=0&&(t.phrase=Math.floor(dg(e)*16),t.talk=1.4));else if(u)t.mode=`wander`;else if(r){if(t.mode=`wander`,a&&o<30){let i=r.toB?r.bx:r.ax,a=r.toB?r.bz:r.az;c=i-t.pos.x,l=a-t.pos.z,Math.hypot(c,l)<.5&&(r.toB=!r.toB),s=4.6,t.talk<=0&&dg(e)<n*.4&&(t.phrase=Math.floor(dg(e)*16),t.talk=1.4)}}else if(t.mode===`crowd`&&a){t.orbit+=t.orbitDir*n*.5;let r=t.orbit,i=Math.hypot(a.vel.x,a.vel.z);t.blocker&&i>1&&(r=Math.atan2(a.vel.z,a.vel.x)+t.orbitDir*.45);let u=C+a.stats.personalSpace;c=a.pos.x+Math.cos(r)*u-t.pos.x,l=a.pos.z+Math.sin(r)*u-t.pos.z,s=Math.min(S,Math.hypot(c,l)*2.5),d||(t.talkCd-=n),!d&&t.talkCd<=0&&o<5&&t.chatUntil<=e.tick/60&&!(t.phrase>=100&&t.talk>0)&&(t.phrase=Math.floor(dg(e)*16),t.talk=w,t.talkCd=fg(e,4,10),Pg(e,`babble`,t.pos.x,t.pos.y+1.4,t.pos.z,t.id)),t.twirl<=0&&dg(e)<n*.12&&(t.twirl=.8)}else{if(t.thinkTimer<=0||Math.hypot(t.target.x-t.pos.x,t.target.z-t.pos.z)<.6){let n=dg(e)*Math.PI*2,r=t.hinter?fg(e,.5,2):fg(e,2,7);t.target={x:t.home.x+Math.cos(n)*r,z:t.home.z+Math.sin(n)*r},t.thinkTimer=fg(e,2.5,5)}c=t.target.x-t.pos.x,l=t.target.z-t.pos.z,s=x}for(let n of e.creatures){if(n===t)continue;let i=t.pos.x-n.pos.x,a=t.pos.z-n.pos.z,o=Math.hypot(i,a);if(o>1.15||o<.001||Math.abs(t.pos.y-n.pos.y)>1)continue;!r&&!(e.race.phase===`racing`&&n.dash)&&t.id<n.id&&t.grounded&&n.grounded&&t.stuck<=0&&n.stuck<=0&&t.chatUntil+6<e.tick/60&&n.chatUntil+6<e.tick/60&&(t.chatPartner=n.id,n.chatPartner=t.id,t.chatUntil=n.chatUntil=e.tick/60+4.8,t.twirl=n.twirl=.25,t.vel.x+=i/o,t.vel.z+=a/o,n.vel.x-=i/o,n.vel.z-=a/o);let u=(1.15-o)*3;c+=i/o*u,l+=a/o*u,s=Math.max(s,1.5)}if(t.chatUntil>e.tick/60&&t.grounded&&!(t.phrase>=100&&t.talk>0)){let r=e.creatures.find(e=>e.id===t.chatPartner);if(s=0,r){t.yaw=Xg(t.yaw,Math.atan2(t.pos.x-r.pos.x,t.pos.z-r.pos.z),n*8);let i=Math.floor((t.chatUntil-e.tick/60)/1.2)%2==(t.id<r.id?0:1);!i&&t.phrase<100&&(t.talk=0),i&&t.talk<=0&&(t.phrase=Math.floor(dg(e)*16),t.talk=1.1,Pg(e,`babble`,t.pos.x,t.pos.y,t.pos.z,t.id))}}let f=Math.hypot(c,l);if(f>.01&&(c/=f,l/=f),t.twirl>0?t.yaw+=n*14:t.mode===`crowd`&&a&&o<3?t.yaw=Xg(t.yaw,Math.atan2(-(a.pos.x-t.pos.x),-(a.pos.z-t.pos.z)),n*8):f>.01&&(t.yaw=Xg(t.yaw,Math.atan2(-c,-l),n*6)),t.chatUntil>e.tick/60&&t.grounded){let r=e.creatures.find(e=>e.id===t.chatPartner);r&&(t.yaw=Xg(t.yaw,Math.atan2(t.pos.x-r.pos.x,t.pos.z-r.pos.z),n*10))}let p=t.grounded?20:5;t.vel.x+=Yg(c*s-t.vel.x,p*n),t.vel.z+=Yg(l*s-t.vel.z,p*n)}j(t,n,r,e.world.half)&&t.grounded&&t.hopCd<=0&&t.stuck<=0&&(t.vel.y=t.mode===`crowd`?7.5:6,t.grounded=!1,t.hopCd=1.2,t.mode===`wander`&&(t.thinkTimer=0)),Kg(e,t,t.id),(t.pos.y<-5||we(e,t.pos.x,t.pos.y,t.pos.z))&&(t.pos={x:t.home.x,y:0,z:t.home.z},t.vel={x:0,y:0,z:0});for(let n of e.players)$g(e,t,n,r)}function $g(e,t,n,r){let i=n.pos.x-t.pos.x,a=n.pos.z-t.pos.z,o=Math.hypot(i,a),s=n.radius+t.radius+.05;if(o>s||n.pos.y>t.pos.y+t.height-.2||n.pos.y+n.height<t.pos.y)return;t.hitCd<=0&&Pg(e,`note`,t.pos.x,t.pos.y,t.pos.z,t.id);let c=o>.01?i/o:1,l=o>.01?a/o:0,u=n.riding===null?void 0:e.vehicles.find(e=>e.id===n.riding);if(u){if(t.hitCd>0)return;t.hitCd=1.2,u.kind===`drone`?(u.vel.x=c*6*n.stats.knockback,u.vel.z=l*6*n.stats.knockback,u.vel.y=3):(u.speed=(c*-Math.sin(u.yaw)+l*-Math.cos(u.yaw))*6*n.stats.knockback,u.vel.y=4,u.grounded=!1),t.stuck<=0&&(t.vel.x=-c*3,t.vel.z=-l*3),Pg(e,`bonk`,n.pos.x,n.pos.y+1,n.pos.z,n.id);return}let d=s-o,f=t.stuck>0?1:.6,p=n.pos.x+c*d*f,m=n.pos.z+l*d*f;r.blocked(p,m,n.pos.y,n.radius,n.height)||(n.pos.x=p,n.pos.z=m),t.stuck<=0&&(t.pos.x-=c*d*(1-f),t.pos.z-=l*d*(1-f));let h=-(n.vel.x*c+n.vel.z*l);if(t.stuck<=0&&t.hitCd<=0&&h>2){t.hitCd=1;let r=4*n.stats.knockback;n.vel.x=c*r,n.vel.z=l*r,n.vel.y=3,n.grounded=!1,n.stun=.25*n.stats.stun,Pg(e,`bonk`,n.pos.x,n.pos.y+1,n.pos.z,n.id)}}function e_(e,t,n){let r=[];for(let i of e.projectiles){i.life-=t;let a=i.kind===`sticky`?Vg:Hg;i.vel.y-=a*t;let o=i.pos.x,s=i.pos.y,c=i.pos.z;i.pos.x+=i.vel.x*t,i.pos.y+=i.vel.y*t,i.pos.z+=i.vel.z*t;let l=i.life>0;if(l)for(let t of e.creatures){let n=i.pos.x-t.pos.x,r=i.pos.y-(t.pos.y+.6),a=i.pos.z-t.pos.z,o=.85*i.scale;if(!(n*n+r*r+a*a>o*o)){if(Qe(e,t,i.kind),i.kind===`sticky`){let n=e.players.find(e=>e.id===i.owner);t.stuck=n?n.stats.glueTime:5,t.mode=`wander`,Pg(e,`glue`,t.pos.x,t.pos.y+.6,t.pos.z,t.id)}else t.stuck=0,t.phrase=100+Math.floor(dg(e)*3),t.talk=3,t.vel.x=i.vel.x*.65,t.vel.z=i.vel.z*.65,t.vel.y=11,t.grounded=!1,Pg(e,`bounce`,t.pos.x,t.pos.y,t.pos.z,t.id);l=!1;break}}if(l){let t=i.pos.y<=0,r=t?null:n.pointInside(i.pos.x,i.pos.y,i.pos.z);if(t||r){let a=0,u=t;if(r){let e=E(r,i.pos.x,i.pos.z);(s>=e-.05||e-i.pos.y<.25)&&(u=!0,a=e)}i.kind===`sticky`?(e.splats.push({id:e.nextId++,pos:{x:i.pos.x,y:u?a+.02:i.pos.y,z:i.pos.z},life:2.5}),Pg(e,`splat`,i.pos.x,i.pos.y,i.pos.z),l=!1):u?(t_(e,i.pos.x,a,i.pos.z,n,e.players.find(e=>e.id===i.owner)?.stats.padScale??1),l=!1):(i.pos.x=o,i.pos.z=c,i.pos.y=s,i.vel.x=0,i.vel.z=0)}}(Math.abs(i.pos.x)>e.world.half+5||Math.abs(i.pos.z)>e.world.half+5)&&(l=!1),l&&r.push(i)}e.projectiles=r}function t_(e,t,n,r,i,a){let o=i.groundAt(t,r,n+v,.05);e.pads.length>=4&&e.pads.shift(),e.pads.push({id:e.nextId++,pos:{x:t,y:Math.max(o,n),z:r},life:30,squish:1,scale:a}),Pg(e,`pad`,t,n,r)}function n_(e,t){for(let n of e.pads)n.life-=t,n.squish=Math.max(0,n.squish-t*3);e.pads=e.pads.filter(e=>e.life>0)}var r_=[16757575,16748465,9167103,11967743,8317090,16769126,16751482],i_=[16731501,5084927,10182117,3065014,16752412],a_=1908531,o_=new lc({color:7208778,roughness:.1,transparent:!0,opacity:.5,depthWrite:!1}),s_=null;function c_(){if(s_)return s_;let e=[];for(let t=0;t<=24;t++){let n=-Math.PI/2+Math.PI*t/24,r=.58*Math.max(0,Math.cos(n))**.72,i=n<0?.3+.3*Math.sin(n):.3+.62*Math.sin(n);e.push([Math.max(.001,r),i])}return s_=pm(e,36),s_.computeVertexNormals(),s_}function l_(e){let t=e,n=()=>{let[e,n]=ug(t);return t=n,e},r=r_[Math.floor(n()*r_.length)],i=n()<.55?i_[Math.floor(n()*i_.length)]:null,a=new U,o=new U;a.add(o);let s=new Q;s.add(c_(),r,{finish:`gloss`});for(let e of[-.22,.22])s.add(Z.sphere(.13,20,12),u_(r,.85),{p:[e,.04,-.12],s:[1,.55,1.2],finish:`gloss`});for(let e of[-.3,.3])s.add(Z.sphere(.08,16,10),16740241,{p:[e,.42,-.47],s:[1.2,.7,.4],finish:`soft`,cast:!1});if(i){let e=new Xs(.6,40,16,0,Math.PI*2,0,1.15);s.add(e,i,{p:[0,.35,.02],r:[.45,0,0],s:[1.06,1,1.06],finish:`soft`}),s.add(Z.sphere(.07,16,10),i,{p:[.4,.45,-.42],finish:`soft`});for(let e of[-.5,.5])s.add(Z.capsule(.04,.18,8),i,{p:[.42+e*.08,.35,-.42],r:[0,0,e],finish:`soft`})}else s.add(Z.sphere(.09,20,14),u_(r,1.1),{p:[.18,.92,.05],s:[1,.6,1],finish:`gloss`});o.add(s.build());let c=new Q;for(let e of[-.16,.16])c.add(Z.sphere(.13,24,16),16777215,{p:[e,.58,-.44],s:[1,1.1,.6],finish:`gloss`,cast:!1}),c.add(Z.sphere(.07,20,14),a_,{p:[e,.57,-.52],s:[1,1.1,.5],finish:`gloss`,cast:!1}),c.add(Z.sphere(.022,10,8),16777215,{p:[e+.025,.6,-.555],finish:`glow`,cast:!1});let l=c.build();o.add(l);let u=new Q;for(let e of[-.16,.16])u.add(Z.torus(.07,.018,Math.PI,16),a_,{p:[e,.56,-.5],cast:!1});let d=u.build();d.visible=!1,o.add(d);let f=new Q().add(Z.torus(.08,.02,Math.PI,16),8006202,{p:[0,.4,-.58],r:[0,0,Math.PI],cast:!1}).build();o.add(f);let p=new Q().add(Z.sphere(.07,16,12),8006202,{p:[0,.38,-.565],s:[1,.8,.5],cast:!1}).build();p.visible=!1,o.add(p);let m=new G(Z.sphere(.5),o_);m.scale.set(1.5,1.3,1.5),m.position.y=.48,m.visible=!1,a.add(m),o.clear();let h=Vp(e);return h.rotation.y=Math.PI,o.add(h),l.visible=!1,f.visible=!1,{root:a,blob:o,goo:m,eyes:l,happy:d,smile:f,mouth:p}}function u_(e,t){let n=new W(e).multiplyScalar(t);return n.r=Math.min(1,n.r),n.g=Math.min(1,n.g),n.b=Math.min(1,n.b),n.getHex()}var d_=16742938,f_=3817301;function p_(e,t){let n=new U,r=new Q;r.add(Z.torus(.29,.11,Math.PI*2,40),2500664,{r:[0,Math.PI/2,0],finish:`rubber`}),r.add(Z.cyl(.21,.21,.08,32),16765503,{r:[0,0,Math.PI/2],finish:`gloss`}),r.add(Z.cyl(.07,.07,.2,20),15133682,{r:[0,0,Math.PI/2],finish:`metal`});for(let e=0;e<3;e++)r.add(Z.capsule(.022,.4,8),16777215,{r:[e/3*Math.PI,0,0],finish:`metal`});let i=r.build();if(i.name=`spin`,n.add(i),n.position.set(0,.4,e),t){let e=new Q;for(let t of[-.12,.12])e.add(Z.capsule(.045,.66),f_,{p:[t,.06,-.3],r:[Math.PI/2-.2,0,0],finish:`metal`});n.add(e.build())}return n}var m_={frontWheel:()=>p_(-.72,!1),rearWheel:()=>p_(.7,!0),frame:()=>{let e=new Q;e.add(Z.capsule(.05,.95),f_,{p:[0,.7,-.15],r:[Math.PI/2-.35,0,0],finish:`metal`}),e.add(Z.capsule(.05,.7),f_,{p:[0,.55,.3],r:[Math.PI/2+.6,0,0],finish:`metal`}),e.add(Z.rbox(.36,.28,.52,.12),d_,{p:[0,.9,-.2],finish:`gloss`}),e.add(Z.rbox(.3,.1,.72,.05),2237230,{p:[0,.94,.3],finish:`soft`}),e.add(Z.rbox(.3,.06,.42,.03),d_,{p:[0,.97,.78],r:[-.15,0,0],finish:`gloss`}),e.add(Z.rbox(.38,.2,.3,.08),16777215,{p:[0,.8,-.2],finish:`gloss`}),e.add(Z.sphere(.06),16724821,{p:[0,.95,.98],s:[1.5,.7,.5],finish:`glow`});let t=new U;return t.add(e.build()),t},handlebar:()=>{let e=new Q;for(let t of[-.12,.12])e.add(Z.capsule(.035,.85),15133682,{p:[t,.75,-.6],r:[.3,0,0],finish:`metal`});e.add(Z.capsule(.03,.78),f_,{p:[0,1.14,-.5],r:[0,0,Math.PI/2],finish:`metal`});for(let t of[-.36,.36])e.add(Z.capsule(.045,.16),2237230,{p:[t,1.14,-.5],r:[0,0,Math.PI/2],finish:`rubber`});e.add(Z.rbox(.3,.24,.05,.05),16777215,{p:[0,1,-.67],r:[.3,0,0],finish:`gloss`}),e.add(Z.sphere(.07),16774064,{p:[0,1,-.71],s:[1,1,.5],finish:`glow`}),e.add(Z.rbox(.3,.06,.4,.03),d_,{p:[0,.82,-.75],r:[.15,0,0],finish:`gloss`});let t=new U;return t.add(e.build()),t},engine:()=>{let e=new Q;e.add(Z.rbox(.32,.32,.38,.1),12109010,{p:[0,.48,.02],finish:`metal`});for(let t=0;t<3;t++)e.add(Z.rbox(.38,.04,.3,.02),8161957,{p:[0,.62+t*.07,-.05],finish:`metal`});e.add(Z.capsule(.05,.9),15133682,{p:[.2,.55,.45],r:[Math.PI/2-.3,0,0],finish:`metal`}),e.add(Z.cyl(.07,.07,.06,20),2237230,{p:[.2,.68,.88],r:[Math.PI/2-.3,0,0],finish:`rubber`});let t=new U;return t.add(e.build()),t}};function h_(e,t,n=4.5,r=.7){let i=new Eo(r,n,20,1,!0);i.rotateX(Math.PI/2),i.translate(0,e,t-n/2);let a=i.attributes.position,o=new Float32Array(a.count*3);for(let e=0;e<a.count;e++){let r=Math.max(0,1-(t-a.getZ(e))/n);o.set([r,r,r*.85],e*3)}i.setAttribute(`color`,new ha(o,3));let s=new G(i,new Ha({color:16773560,vertexColors:!0,transparent:!0,opacity:.22,depthWrite:!1,side:2,blending:2,fog:!1}));return s.name=`headlight-beam`,s.castShadow=!1,s}m_.flashlight=()=>{let e=new Q;e.add(Z.cyl(.075,.095,.24,20),f_,{p:[0,1.04,-.8],r:[Math.PI/2,0,0],finish:`metal`}),e.add(Z.torus(.095,.025,Math.PI*2,24),16765503,{p:[0,1.04,-.92],finish:`gloss`}),e.add(Z.cyl(.085,.085,.02,20),16775106,{p:[0,1.04,-.925],r:[Math.PI/2,0,0],finish:`glow`}),e.add(Z.rbox(.06,.12,.08,.02),2237230,{p:[0,.95,-.76],finish:`rubber`});let t=new U;return t.add(e.build(),h_(1.04,-.94)),t};var g_=3791300,__=16740193;function v_(e){let t=new U,n=new Q;n.add(Z.torus(.15,.065,Math.PI*2,32),2500664,{r:[0,Math.PI/2,0],finish:`rubber`}),n.add(Z.cyl(.11,.11,.07,24),__,{r:[0,0,Math.PI/2],finish:`gloss`}),n.add(Z.cyl(.04,.04,.16,12),15133682,{r:[0,0,Math.PI/2],finish:`metal`});let r=n.build();return r.name=`spin`,t.add(r),t.position.set(0,.22,e),t}var y_={frontWheel:()=>{let e=v_(-.62),t=new Q;for(let e of[-.07,.07])t.add(Z.capsule(.025,.3,8),15133682,{p:[e,.1,.02],finish:`metal`});return t.add(Z.rbox(.2,.05,.3,.02),g_,{p:[0,.27,-.02],r:[.2,0,0],finish:`gloss`}),e.add(t.build()),e},rearWheel:()=>{let e=v_(.6),t=new Q;return t.add(Z.rbox(.18,.04,.34,.02),__,{p:[0,.2,.04],r:[-.25,0,0],finish:`gloss`}),e.add(t.build()),e},deck:()=>{let e=new Q;e.add(Z.rbox(.34,.08,1.15,.04),g_,{p:[0,.26,0],finish:`gloss`}),e.add(Z.rbox(.3,.015,1,.007),2829626,{p:[0,.305,.02],finish:`rubber`});for(let t of[-.36,-.12,.12,.36])e.add(Z.rbox(.24,.005,.05,.002),16777215,{p:[0,.315,t],finish:`matte`});e.add(Z.capsule(.03,.42,8),15133682,{p:[0,.23,-.55],r:[Math.PI/2-.4,0,0],finish:`metal`}),e.add(Z.capsule(.022,.2,8),3817301,{p:[.17,.12,.25],r:[0,0,.6],finish:`metal`});let t=new U;return t.add(e.build()),t},handlebar:()=>{let e=new Q;e.add(Z.capsule(.035,.95,12),15133682,{p:[0,.78,-.66],r:[-.12,0,0],finish:`metal`}),e.add(Z.cyl(.055,.055,.12,16),__,{p:[0,.5,-.63],r:[-.12,0,0],finish:`gloss`}),e.add(Z.capsule(.03,.62,10),3817301,{p:[0,1.24,-.72],r:[0,0,Math.PI/2],finish:`metal`});for(let t of[-.27,.27])e.add(Z.capsule(.045,.16,10),__,{p:[t,1.24,-.72],r:[0,0,Math.PI/2],finish:`rubber`});e.add(Z.sphere(.05,12,8),16765503,{p:[.12,1.29,-.72],finish:`gloss`}),e.add(Z.sphere(.055,12,8),16774064,{p:[0,1.02,-.79],s:[1,1,.5],finish:`glow`});let t=new U;return t.add(e.build()),t}},b_=16765503,x_=1.25,S_=3065014,C_=.68;function w_(e,t){let n=new U;for(let r of[-.68,C_]){let i=new Q;i.add(Z.cyl(.11,.13,.16,20),16054011,{p:[r,.66,e],finish:`gloss`}),i.add(Z.cyl(.06,.06,.06,16),f_,{p:[r,.76,e],finish:`metal`}),i.add(Z.torus(.4,.03,Math.PI*2,40),t,{p:[r,.74,e],r:[Math.PI/2,0,0],finish:`gloss`});for(let t=0;t<3;t++){let n=t*2.094+.5;i.add(Z.capsule(.018,.32,6),16054011,{p:[r+Math.cos(n)*.24,.72,e+Math.sin(n)*.24],r:[Math.PI/2,Math.atan2(-Math.cos(n),-Math.sin(n)),0],finish:`gloss`})}n.add(i.build());let a=new Q;for(let e of[-1,1])a.add(Z.rbox(.34,.016,.07,.008),3817301,{p:[e*.18,0,0],r:[0,0,e*.12],finish:`gloss`});a.add(Z.sphere(.035,10,8),t,{finish:`gloss`});let o=a.build();o.name=`rotor`,o.position.set(r,.8,e),o.rotation.y=r*3+e,n.add(o)}return n}var T_={pitbike:m_,scooter:y_,drone:{propFront:()=>w_(-.68,S_),propRear:()=>w_(C_,__),frame:()=>{let e=new Q;e.add(Z.rbox(.62,.22,.84,.1),b_,{p:[0,.56,0],finish:`gloss`}),e.add(Z.rbox(.5,.025,.7,.012),2829626,{p:[0,.68,.02],finish:`rubber`});for(let t of[-.22,0,.22])e.add(Z.rbox(.36,.006,.04,.003),16777215,{p:[0,.695,t],finish:`matte`});for(let[t,n]of[[-1,-1],[1,-1],[-1,1],[1,1]]){let r=Math.hypot(C_,C_)-.12;e.add(Z.capsule(.045,r,10),16054011,{p:[t*C_/2,.6,n*C_/2],r:[Math.PI/2,Math.atan2(-t,-n)+Math.PI,0],finish:`gloss`})}e.add(Z.sphere(.05,12,8),8126362,{p:[-.33,.58,-.38],finish:`glow`}),e.add(Z.sphere(.05,12,8),16731501,{p:[.33,.58,-.38],finish:`glow`}),e.add(Z.rbox(.3,.06,.08,.03),2829626,{p:[0,.6,-.43],finish:`gloss`});let t=new U;return t.add(e.build()),t},battery:()=>{let e=new Q;e.add(Z.rbox(.42,.16,.56,.06),3835647,{p:[0,.37,.04],finish:`gloss`}),e.add(Z.rbox(.44,.04,.5,.02),16054011,{p:[0,.38,.04],finish:`gloss`}),e.add(Z.rbox(.3,.035,.1,.015),8124415,{p:[0,.455,.2],finish:`glow`});for(let t of[-1,1])e.add(Z.rbox(.012,.09,.03,.005),b_,{p:[t*.215,.39,-.02],r:[.5,0,0],finish:`glow`}),e.add(Z.rbox(.012,.09,.03,.005),b_,{p:[t*.215,.35,.03],r:[.5,0,0],finish:`glow`});let t=new U;return t.add(e.build()),t},camera:()=>{let e=new Q;e.add(Z.cyl(.03,.03,.1,10),f_,{p:[0,.42,-.36],finish:`metal`}),e.add(Z.sphere(.12,20,14),16054011,{p:[0,.34,-.38],finish:`gloss`}),e.add(Z.cyl(.065,.075,.06,20),2829626,{p:[0,.33,-.48],r:[Math.PI/2,0,0],finish:`gloss`}),e.add(Z.sphere(.05,16,10),6273279,{p:[0,.33,-.5],s:[1,1,.5],finish:`glass`}),e.add(Z.sphere(.022,8,6),16723285,{p:[.08,.4,-.46],finish:`glow`});let t=new U;return t.add(e.build()),t},skids:()=>{let e=new Q;for(let t of[-.3,.3]){e.add(Z.capsule(.035,.95,10),16054011,{p:[t,.04,0],r:[Math.PI/2,0,0],finish:`gloss`});for(let n of[-.22,.22])e.add(Z.capsule(.025,.46,8),3817301,{p:[t*.8,.24,n],r:[0,0,t>0?.35:-.35],finish:`metal`});for(let n of[-.47,.47])e.add(Z.sphere(.05,10,8),__,{p:[t,.05,n],finish:`gloss`})}let t=new U;return t.add(e.build()),t}}},E_={pitbike:!1,scooter:!0,drone:!0};function D_(e,t){return T_[e][t]()}function O_(e,t){let n=new U,r=new U;r.position.y=.6,n.add(r);let i=new U;i.position.y=-.6,r.add(i);let a=new Map,o=[],s=[];for(let n of t){let t=D_(e,n);i.add(t),a.set(n,t);let r=t.getObjectByName(`spin`);r&&o.push(r),t.traverse(e=>e.name===`rotor`&&s.push(e)),e===`drone`&&t.scale.setScalar(x_)}let c=new U;return e===`drone`?c.position.set(0,.7*x_,.05):E_[e]?c.position.set(0,.31,.12):c.position.set(0,.25,.15),i.add(c),{root:n,pivot:r,seat:c,parts:a,wheels:o,rotors:s,lean:0,pitch:0}}var k_=12,A_=class{constructor(e,t,n,r=!1){this.i=0,this.m=new ei,this.q=new Ar,this.e=new ui,this.v=new H,this.s=new H,this.c=new W,this.mesh=new fo(e,t,n),this.mesh.count=0,this.mesh.castShadow=r,this.mesh.receiveShadow=r,this.mesh.frustumCulled=!1,this.mesh.setColorAt(0,new W(16777215))}begin(){this.i=0}push(e,t,n,r,i,a,o,s=0,c=0){this.i>=this.mesh.instanceMatrix.count||(this.e.set(c,s,0),this.q.setFromEuler(this.e),this.m.compose(this.v.set(e,t,n),this.q,this.s.set(r,i,a)),this.mesh.setMatrixAt(this.i,this.m),this.mesh.setColorAt(this.i,this.c.set(o)),this.i++)}end(){this.mesh.count=this.i,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}},j_=[16735603,16763196,6217834,5084927,10182117,16752412],M_=(e={})=>new uc({color:16777215,roughness:.25,clearcoat:1,clearcoatRoughness:.08,...e}),N_=class{constructor(e,t,n){this.scene=new Ii,this.players=new Map,this.creatures=new Map,this.pickups=new Map,this.vehicles=new Map,this.garages=new Map,this.lastYaw=new Map,this.particles=[],this.occluders=[],this.cameraRay=new hl,this.camDist=7,this.indoor=0,this.yawHint=null,this.indoorBox=null,this.gateCues=new U,this.gateArrow=new U,this.arrowProbe=new H,this.gate=new U,this.road=new U,this.rayO=new H,this.rayD=new H,this.rayHits=[],this.camFrame=0,this.meshHit=1/0,this.time=0,this.rings=null,this.flames=null,this.ringList=[],this.ringR=1.6,this.tmpE=new ui,this.bandanas=new Map,this.harborSea=null,this.stars=null,this.starList=[],this.tmpM=new ei,this.tmpQ=new Ar,this.tmpV=new H,this.tmpS=new H,this.yAxis=new H(0,1,0),this.ghostPath=null,this.windowGlow=null,this.batteryGlow=null,this.area=null,this.lift=new G(new To(.72,.72,.2,24),new lc({color:16764746})),this.camera=new Kc(62,t,.1,400);let r=$m(e.world.theme);this.scene.background=new W(r.horizon),this.scene.fog=new Fi(r.horizon,60,150),this.scene.environment=Qm(n),this.scene.environmentIntensity=.55;let i=window.matchMedia?.(`(pointer: coarse)`).matches;if(this.sun=nh(this.scene,i?1024:2048).sun,this.sky=th(e.world.theme),this.scene.add(this.sky),Ke(e)){let t=Ke(e),n=t.course.air?tg(t):qh(t,e.world.theme);this.gateCues=n.cues,this.gateArrow=n.arrow,this.gateArchMaterial=n.archMaterial,this.gate=n.gate,this.road=n.root,this.scene.add(n.cues,n.root,n.gate,n.entry),this.starList=o(Ke(e).course),this.stars=new fo(L_(),new lc({color:16765503,emissive:16753664,emissiveIntensity:.7,roughness:.3,metalness:.3}),this.starList.length),this.stars.name=`race-stars`,this.stars.frustumCulled=!1,this.scene.add(this.stars),this.ringList=l(Ke(e).course);let r=new lc({color:16742938,emissive:16734720,emissiveIntensity:1.6,roughness:.4});this.ringR=s(t.course),this.rings=new fo(new Zs(this.ringR,.13,10,40),r,this.ringList.length),this.flames=new fo(new Eo(.2,.7,7,1,!0).translate(0,.35,0),new Ha({color:16752704,transparent:!0,opacity:.8,blending:2,depthWrite:!1,fog:!1}),this.ringList.length*k_);for(let e=0;e<this.flames.count;e++)this.flames.setColorAt(e,new W(e%3==0?16769126:e%3==1?16747546:16731418));this.rings.name=`race-rings`,this.flames.name=`race-ring-flames`;for(let e of[this.rings,this.flames])e.frustumCulled=!1,e.castShadow=!1,this.scene.add(e)}let a=[];if(e.world.theme===`oldtown`){let t=Gh(e.world);this.scene.add(t.root,t.batteryGlow),this.area=t.root,this.batteryGlow=t.batteryGlow,a=t.cameraBlockers}else if(e.world.theme===`harbor`){let t=Ch(e.world);this.scene.add(t.root),this.harborSea=t.water,a=t.cameraBlockers}else{let t=uh(e.world);this.scene.add(t.root);let n=ig();this.scene.add(this.lift,n);let r=nm();r.scale.setScalar(.65),r.position.set(26,0,-26),this.scene.add(r);let i=r.getObjectByName(`showcase-cabin`);i&&(i.visible=!1),ih(r),this.occluders=[n],this.scene.userData.studioTower=r,this.spray=t.root.getObjectByName(`spray`),this.windowGlow=z_(),this.scene.add(this.windowGlow);let o=3.5,s=rt.roof,c=rt.x-4.05,l=rt.x+4.05,u=rt.z-4.05,d=rt.z+4.05;this.indoorBox=[c,l+1.2,u,d],a=[...t.cameraBlockers,{minX:c-.1,maxX:c+.1,minY:o,maxY:s,minZ:u,maxZ:d},{minX:l-.1,maxX:l+.1,minY:o,maxY:s,minZ:u,maxZ:d},{minX:c,maxX:l,minY:o,maxY:s,minZ:u-.1,maxZ:u+.1},{minX:c,maxX:l,minY:o,maxY:s,minZ:d-.1,maxZ:d+.1},{minX:c,maxX:l,minY:rt.mid+1.88,maxY:rt.mid+2.2,minZ:u,maxZ:d}]}this.scene.updateMatrixWorld(!0),this.col=new A([...e.world.solids,...e.world.raceSolids??[],...a]),this.projectiles=new A_(Z.sphere(.5,24,16),M_(),32,!0);let c=new Xs(.5,32,12,0,Math.PI*2,0,Math.PI/2);this.pads=new A_(c,M_({roughness:.18}),8,!0),this.cubes=new A_(Z.rbox(.98,.98,.98,.14),M_({roughness:.35}),16,!0);let u=ah(.98,.98,.98,.07);this.ramps=new A_(u,M_({roughness:.35}),16,!0),this.splats=new A_(Z.sphere(.5,20,10),M_({transparent:!0,opacity:.85}),40),this.parts=new A_(Z.sphere(.5,10,8),new lc({color:16777215,roughness:.4}),160);let d=new qs(1,1);d.rotateX(-Math.PI/2),this.shadows=new A_(d,wm(),48),this.shadows.mesh.renderOrder=2;for(let e of[this.projectiles,this.pads,this.cubes,this.ramps,this.splats,this.parts,this.shadows])this.scene.add(e.mesh);this.ghost=new G(Z.rbox(1,1,1,.14),new Ha({color:16777215,transparent:!0,opacity:.3,depthWrite:!1})),this.ghost.visible=!1,this.scene.add(this.ghost),this.ghostBike=R_(Ve(e.level).mission.vehicle===`drone`),this.ghostBike.visible=!1,this.scene.add(this.ghostBike);for(let t of e.pickups){let e=new U,n=D_(t.vehicle,t.part),r=new U,i=new Zi().setFromObject(n.children[0]??n).getCenter(new H);n.position.set(-i.x,-.5,-i.z),r.add(n),r.scale.setScalar(1.3);let a=new G(Z.torus(.75,.05,Math.PI*2,48),new Ha({color:16769126}));a.rotation.x=Math.PI/2,a.position.y=-.55;let o=P_(16769126);o.position.y=-.6,e.add(r,a,o),V_(e),this.scene.add(e),this.pickups.set(t.id,e)}for(let t of e.garages){this.scene.add(B_(t.x,t.z,t.radius));let e=O_(t.vehicle,M[t.vehicle].parts.map(e=>e.id));e.root.position.set(t.x,.12,t.z),e.root.rotation.y=.6,this.scene.add(e.root);let n=P_(5032432);n.position.set(t.x,0,t.z),this.scene.add(n),this.garages.set(t.id,{model:e,beam:n})}this.sync(e,0,.6,0)}ensureEntities(e){for(let t of e.players)if(!this.players.has(t.id)){let e=Um(t.look);this.scene.add(e.root),this.players.set(t.id,e)}for(let t of e.creatures)if(!this.creatures.has(t.id)){let e=l_(t.seed);this.scene.add(e.root),this.creatures.set(t.id,e)}}handleEvents(e){for(let t of e)switch(Kf(t),t.type){case`pickup`:case`deliver`:this.burst(t.x,t.y,t.z,24,[16766474,16739072,16777215],6,.18);break;case`bonus`:t.info?.startsWith(`ring`)&&this.burst(t.x,t.y,t.z,30,[16769126,16747546,16731418],7,.16);break;case`star`:this.burst(t.x,t.y,t.z,14,[16765503,16777215,16753664],4,.12);break;case`built`:case`trick`:this.burst(t.x,t.y,t.z,40,[16766474,16740518,5032432,8054146],8,.2);break;case`glue`:this.burst(t.x,t.y,t.z,16,[7208778,3715072],4,.15);break;case`splat`:this.burst(t.x,t.y,t.z,6,t.y>20?[5300223,16777215]:[7208778],2.5,.1);break;case`pad`:case`bounce`:this.burst(t.x,t.y+.2,t.z,12,[16740518,16761570],5,.14);break;case`bonk`:this.burst(t.x,t.y,t.z,10,[16777215,16773749],4,.14);break;case`block`:this.burst(t.x,t.y-.4,t.z,8,[16777215],2.5,.12);break;case`noroom`:this.burst(t.x,t.y,t.z,6,[16724787],2,.1)}}burst(e,t,n,r,i,a,o){for(let s=0;s<r;s++){this.particles.length>150&&this.particles.shift();let r=Math.random()*Math.PI*2,c=Math.random()*.8+.2;this.particles.push({x:e,y:t,z:n,vx:Math.cos(r)*a*c,vy:a*(.5+Math.random()),vz:Math.sin(r)*a*c,life:.7,max:.7,color:i[s%i.length],size:o})}}syncRings(e,t){let n=this.rings,r=this.flames;if(n&&r&&(n.visible=r.visible=this.road.visible,n.visible)){n.material.emissiveIntensity=1.5+Math.sin(t*17)*.25+Math.sin(t*7.3)*.2;for(let i=0;i<this.ringList.length;i++){let a=this.ringList[i],o=+!e.race.rings.includes(i);this.tmpQ.setFromEuler(this.tmpE.set(0,a.yaw,0)),this.tmpM.compose(this.tmpV.set(a.x,a.y,a.z),this.tmpQ,this.tmpS.set(o,o,o)),n.setMatrixAt(i,this.tmpM);for(let e=0;e<k_;e++){let n=-.5+e/11*(Math.PI+1),s=i*k_+e,c=Math.cos(n)*this.ringR,l=Math.sin(n)*this.ringR,u=o*(.6+.5*Math.abs(Math.sin(t*11+s*1.7))+.2*Math.sin(t*23+s));this.tmpQ.setFromEuler(this.tmpE.set(0,a.yaw,(n-Math.PI/2)*.35)),this.tmpV.set(c,l,0).applyAxisAngle(this.yAxis,a.yaw).add(this.tmpS.set(a.x,a.y,a.z)),this.tmpM.compose(this.tmpV,this.tmpQ,this.tmpS.set(o,u,o)),r.setMatrixAt(s,this.tmpM)}}n.instanceMatrix.needsUpdate=!0,r.instanceMatrix.needsUpdate=!0}}setGhostPath(e){this.ghostPath=e}syncGhostBike(e,t){let n=this.ghostPath,r=this.ghostBike,i=n?n.length/4:0,a=e.race.elapsed*10;if(r.visible=!!n&&e.race.phase===`racing`&&a<i-1,!r.visible||!n)return;let o=Math.floor(a),s=a-o,c=o*4,l=c+4,u=n[l+3]-n[c+3];u>Math.PI?u-=Math.PI*2:u<-Math.PI&&(u+=Math.PI*2),r.position.set(n[c]+(n[l]-n[c])*s,n[c+1]+(n[l+1]-n[c+1])*s,n[c+2]+(n[l+2]-n[c+2])*s),r.rotation.y=n[c+3]+u*s,r.material.opacity=.48+Math.sin(t*5)*.08}dispose(){this.scene.traverse(e=>{e instanceof fo?e.dispose():e instanceof G&&e.geometry.dispose()}),this.scene.clear()}toScreen(e,t,n,r,i){let a=new H(e,t,n).project(this.camera);return a.z>1?null:{x:(a.x+1)/2*r,y:(1-a.y)/2*i}}sync(e,t,n,r,i,a=!1){this.gate.visible=!!Ke(e),this.road.visible=!!Ke(e)&&e.race.phase!==`locked`;for(let e of this.road.children){let t=e.userData.center;e.visible=this.road.visible&&(!t||Math.hypot(t.x-this.camera.position.x,t.z-this.camera.position.z)<120)}this.gate.rotation.y=e.race.phase===`locked`?0:-Math.PI/2,this.lift.position.set(rt.liftX,e.elevator.y-.1,rt.z);let o=this.scene.userData.studioTower;o&&o.traverse(t=>{t.userData.tick&&t.visible&&t.userData.tick(e.tick/60)}),this.time+=r;let s=this.time;if(Dm.value=s,this.gateCues.visible=!!Ke(e)&&e.race.phase===`open`,this.gateCues.visible){let e=-1;for(let t of[6.4,5.6,4.9,4.3])if(this.arrowProbe.set(this.gateArrow.position.x,t+1.6,this.gateArrow.position.z).project(this.camera),this.arrowProbe.y<.5&&this.arrowProbe.z<1){e=t;break}e<0&&(e=4.3),this.gateArrow.position.y=e+Math.sin(s*3)*.2,this.gateArrow.scale.setScalar(e<5?.6:1),this.gateArrow.rotation.y=s*1.7,this.gateArchMaterial.emissiveIntensity=.9+Math.sin(s*3)*.3}if(this.harborSea&&(this.harborSea.visible=e.race.phase!==`racing`),this.syncGhostBike(e,s),this.syncRings(e,s),this.stars&&(this.stars.visible=this.road.visible,this.stars.visible)){let t=e.race.stars;this.tmpQ.setFromAxisAngle(this.yAxis,s*2.4);for(let e=0;e<this.starList.length;e++){let n=this.starList[e],r=t.includes(e)?0:1+Math.sin(s*4+e)*.08;this.tmpM.compose(this.tmpV.set(n.x,n.y+Math.sin(s*2+e)*.12,n.z),this.tmpQ,this.tmpS.set(r,r,r)),this.stars.setMatrixAt(e,this.tmpM)}this.stars.instanceMatrix.needsUpdate=!0}if(this.batteryGlow){let t=e.pickups.some(e=>e.part===`battery`&&e.status===`world`);this.batteryGlow.visible=t&&e.race.phase!==`racing`,t&&(this.batteryGlow.material.opacity=.55+Math.sin(s*3.3)*.15+(Math.sin(s*29)>.6?.25:0))}if(this.area&&(this.area.visible=e.race.phase!==`racing`),this.windowGlow){let t=e.pickups.some(e=>e.part===`flashlight`&&e.status===`world`);this.windowGlow.visible=t,t&&(this.windowGlow.material.opacity=.75+Math.sin(s*2.1)*.12+Math.sin(s*13.7)*.05)}this.ensureEntities(e);let c=new A(e.race.phase===`locked`||e.race.phase===`open`?e.world.solids:[...e.world.solids,...e.world.raceSolids??[]],e.blocks.map(D));this.shadows.begin();let l=(e,t,n,r)=>{let i=c.groundAt(e,n,t+.3,.05),a=Math.max(0,1-(t-i)/6);if(a<=0)return;let o=r*(.6+.4*a);this.shadows.push(e,i+.03,n,o,1,o,16777215)};for(let t of e.players){let e=this.players.get(t.id);e.root.position.set(t.pos.x,t.pos.y,t.pos.z),e.root.rotation.y=t.yaw,Gm(e,t.walkPhase,Math.hypot(t.vel.x,t.vel.z),!t.grounded,s),e.inner.rotation.z=t.stun>0?Math.sin(s*40)*.15:0,t.riding===null&&l(t.pos.x,t.pos.y,t.pos.z,1.1)}for(let t of e.creatures){let n=this.creatures.get(t.id);n.root.position.set(t.pos.x,t.pos.y,t.pos.z),n.root.rotation.y=t.yaw;let r=!!t.dash&&e.race.phase===`racing`,i=this.bandanas.get(t.id);r&&!i&&(i=I_(),n.blob.add(i),this.bandanas.set(t.id,i)),i&&(i.visible=r);let a=t.stuck>0;n.goo.visible=a,n.blob.traverse(e=>{e.name===`studio-eye`&&(e.scale.y=a?.12:1),e.name===`studio-mouth`&&(e.scale.y=t.talk>0&&!a?1.5:1)}),n.eyes.visible=!a,n.happy.visible=a;let o=t.talk>0&&!a;if(n.mouth.visible=o,n.smile.visible=!o,o&&(n.mouth.scale.y=.6+Math.abs(Math.sin(s*16+t.id))*.8),a){let e=1+Math.sin(s*6)*.04;n.goo.scale.set(1.5*e,1.3/e,1.5*e);let r=1+Math.sin(s*2+t.id)*.03;n.blob.scale.set(1,r,1),n.blob.position.y=0}else{let e=Math.hypot(t.vel.x,t.vel.z),r=Math.sin(s*(t.mode===`crowd`?12:7)+t.id),i=o?Math.sin(s*9)*.04:0,a=1+r*.09*Math.min(1,e/2+.3)+i;n.blob.scale.set(1/Math.sqrt(a),a,1/Math.sqrt(a)),n.blob.position.y=t.grounded?Math.max(0,r)*.12*Math.min(1,e):0,n.eyes.scale.y=Math.sin(s*.8+t.id*3)>.985?.15:1}l(t.pos.x,t.pos.y,t.pos.z,1.4)}let u=e.players.find(e=>e.id===i)??e.players[0],d=e.pickups.some(e=>e.status===`carried`&&e.carrier===u?.id);for(let t of e.pickups){let e=this.pickups.get(t.id);e.visible=t.status!==`delivered`,e.position.set(t.pos.x,t.pos.y,t.pos.z);let n=e.children[0];n.rotation.y=s*2;let r=t.status===`carried`;n.position.y=r?0:Math.sin(s*2+t.id)*.12,n.scale.setScalar(r?.6:1.3),e.children[1].visible=!r,e.children[2].visible=!r,t.status===`world`&&l(t.pos.x,t.pos.y-.6,t.pos.z,1.3)}for(let t of e.garages){let n=this.garages.get(t.id);n.model.root.visible=!t.built;for(let[e,r]of n.model.parts)r.visible=t.delivered.includes(e);n.model.root.rotation.y=.6+Math.sin(s*.7)*.25;let r=e.vehicles.some(e=>e.rider===null);n.beam.visible=d||t.built&&r&&u?.riding===null}for(let t of e.vehicles){let n=this.vehicles.get(t.id);n||(n=O_(t.kind,M[t.kind].parts.map(e=>e.id)),this.scene.add(n.root),this.vehicles.set(t.id,n)),n.root.position.set(t.pos.x,t.pos.y,t.pos.z);let i=e.garages.find(e=>e.vehicle===t.kind)?.delivered??[];for(let e of M[t.kind].parts)e.accessory&&(n.parts.get(e.id).visible=i.includes(e.id));let a=this.lastYaw.get(t.id)??t.yaw;this.lastYaw.set(t.id,t.yaw);let o=r>0?(t.yaw-a)/r:0;if(n.root.rotation.y=t.yaw,M[t.kind].flies){let e=t.rider!==null,i=M[t.kind].maxSpeed,a=t.vel.x*Math.cos(t.yaw)-t.vel.z*Math.sin(t.yaw),c=t.grounded?0:Math.max(-.3,Math.min(.2,-t.speed/i*.26)),l=t.grounded?0:Math.max(-.35,Math.min(.35,o*.16-a*.03));n.pitch+=(c-n.pitch)*Math.min(1,r*5),n.lean+=(l-n.lean)*Math.min(1,r*5),n.pivot.rotation.set(n.pitch,0,n.lean),n.root.position.y+=t.grounded?0:Math.sin(s*3.1+t.id)*.05;let u=e?38:t.grounded?0:14;for(let e of n.rotors)e.rotation.y+=u*r*(e.position.x>0==e.position.z>0?1:-1)}else{let e=t.grounded?Math.max(-.45,Math.min(.45,o*.12*Math.min(1,Math.abs(t.speed)/5))):0;n.lean+=(e-n.lean)*Math.min(1,r*10),n.pivot.rotation.set(t.flip,t.twist,n.lean+t.roll)}for(let e of n.wheels)e.rotation.x-=t.speed*r/.4;l(t.pos.x,t.pos.y,t.pos.z,2.2)}for(let t of e.players){let n=this.players.get(t.id),r=t.riding===null?void 0:this.vehicles.get(t.riding);if(r){n.root.parent!==r.seat&&r.seat.add(n.root),n.root.position.set(0,0,0),n.root.rotation.set(0,0,0);let i=e.vehicles.find(e=>e.id===t.riding)?.kind,a=i?E_[i]:!1;n.legL.rotation.x=a?-.15:1.1,n.legR.rotation.x=a?.2:1.1,n.armL.rotation.x=1.3,a&&(n.armR.rotation.x=1.1),n.inner.position.y=0}else n.root.parent!==this.scene&&this.scene.add(n.root)}this.projectiles.begin();for(let t of e.projectiles){let e=t.kind===`sticky`?7208778:16740518,n=.36*t.scale;this.projectiles.push(t.pos.x,t.pos.y,t.pos.z,n,n,n,e)}this.projectiles.end(),this.pads.begin();for(let t of e.pads){let e=t.squish,n=Math.min(1,t.life/2),r=2.4*t.scale*(1+e*.2)*(.6+.4*n);this.pads.push(t.pos.x,t.pos.y,t.pos.z,r,.5*(1-e*.5)+.06*Math.sin(s*5+t.id),r,16736162)}this.pads.end(),this.splats.begin();for(let t of e.splats)this.splats.push(t.pos.x,t.pos.y,t.pos.z,.7,.12,.7,7208778);this.splats.end(),this.cubes.begin(),this.ramps.begin();for(let t of e.blocks){let e=j_[t.id%j_.length];if(t.shape===`cube`)this.cubes.push(t.x+.5,t.y+.5,t.z+.5,1,1,1,e);else{let e=t.dir===0?0:t.dir===2?Math.PI:t.dir===1?-Math.PI/2:Math.PI/2;this.ramps.push(t.x+.5,t.y+.01,t.z+.5,1,1,1,16763196,e)}}this.cubes.end(),this.ramps.end(),this.parts.begin();let f=[];for(let e of this.particles){if(e.life-=r,e.life<=0)continue;e.vy-=15*r,e.x+=e.vx*r,e.y+=e.vy*r,e.z+=e.vz*r;let t=e.size*(e.life/e.max);this.parts.push(e.x,e.y,e.z,t,t,t,e.color,e.life*8),f.push(e)}if(this.particles=f,this.parts.end(),this.shadows.end(),this.spray){let e=1+Math.sin(s*3)*.06;this.spray.scale.set(e,.5/e,e)}if(u){let i=u.pos.x,o=u.pos.z,s=this.indoorBox&&i>this.indoorBox[0]&&i<this.indoorBox[1]&&o>this.indoorBox[2]&&o<this.indoorBox[3]&&u.pos.y>rt.mid-.6&&u.pos.y<rt.mid+1.2;this.indoor+=(+!!s-this.indoor)*Math.min(1,r*5);let c=this.indoor,l=u.pos.y+1.6-.55*c,d=n+(.06-n)*c,f=Math.sin(t)*Math.cos(d),p=Math.sin(d),m=Math.cos(t)*Math.cos(d),h=7.5-1.5*c,g=this.col.raycast(i,l,o,f,p,m,h);if(l>8){if(this.camFrame++%3==0){this.rayO.set(i,l,o),this.rayD.set(f,p,m),this.cameraRay.set(this.rayO,this.rayD),this.cameraRay.far=h,this.rayHits.length=0;let e=this.cameraRay.intersectObjects(this.occluders,!0,this.rayHits)[0];this.meshHit=e?e.distance:1/0}g=Math.min(g,this.meshHit)}let _=Math.max(.35,Math.min(h,g-.3));if(this.yawHint=null,c>.5&&g<3){let e=g,n=t;for(let r of[.6,-.6,1.2,-1.2,1.8,-1.8,2.4,-2.4,Math.PI]){let a=t+r,s=this.col.raycast(i,l,o,Math.sin(a)*Math.cos(d),p,Math.cos(a)*Math.cos(d),h);if(s>e+.8&&(e=s,n=a,s>=h-.1))break}n!==t&&(this.yawHint=n)}this.camDist=_<this.camDist?_:this.camDist+(_-this.camDist)*Math.min(1,r*4);let v=Math.max(.3,l+p*this.camDist);c>.01&&(v=Math.min(v,v+(rt.mid+1.6-v)*c)),this.camera.position.set(i+f*this.camDist,v,o+m*this.camDist),this.camera.lookAt(i,l,o),this.sun.position.set(i+14,l+30,o+10),this.sun.target.position.set(i,l,o),this.sky.position.copy(this.camera.position),this.ghost.visible=a,a&&this.updateGhost(e,u.id,t)}}updateGhost(e,t,n){let r=Wg(e,e.players.find(e=>e.id===t),n,Fg(e));this.ghost.position.set(r.x+.5,r.y+.5,r.z+.5),this.ghost.material.color.set(r.ok?16777215:16724787)}};function P_(e){let t=new To(.32,.45,40,24,1,!0);t.translate(0,20,0);let n=t.attributes.position,r=new Float32Array(n.count*3);for(let e=0;e<n.count;e++){let t=1-n.getY(e)/40;r.set([t,t,t],e*3)}return t.setAttribute(`color`,new ha(r,3)),new G(t,new Ha({color:e,vertexColors:!0,transparent:!0,opacity:.28,depthWrite:!1,side:2,blending:2,fog:!1}))}var F_=null;function I_(){if(!F_){let e=new Q;e.add(Z.torus(.5,.075,Math.PI*2,32),15087942,{p:[0,.66,0],r:[Math.PI/2,0,0],s:[1.04,1.04,1],finish:`soft`});for(let t of[-.45,.45])e.add(Z.capsule(.06,.34,8),15087942,{p:[t*.25,.6,.6],r:[-1.1,0,t],finish:`soft`});e.add(Z.sphere(.09,12,8),15087942,{p:[0,.66,.52],finish:`soft`});for(let t=0;t<8;t++)e.add(Z.sphere(.035,8,6),16777215,{p:[Math.cos(t*.785)*.565,.66,Math.sin(t*.785)*.565],finish:`matte`,cast:!1});F_=e.build()}let e=F_.clone();return e.name=`hooligan-bandana`,e}function L_(){let e=new is;for(let t=0;t<=10;t++){let n=t/10*Math.PI*2+Math.PI/2,r=t%2?.24:.55;t===0?e.moveTo(Math.cos(n)*r,Math.sin(n)*r):e.lineTo(Math.cos(n)*r,Math.sin(n)*r)}let t=new Hs(e,{depth:.12,bevelEnabled:!0,bevelThickness:.06,bevelSize:.05,bevelSegments:1});return t.translate(0,0,-.06),t}function R_(e=!1){let t=e?[new So(.8,.28,1.05).translate(0,.7,0),...[[-1,-1],[1,-1],[-1,1],[1,1]].map(([e,t])=>new Zs(.5,.06,6,20).rotateX(Math.PI/2).translate(e*.85,.95,t*.85)),new So(2.3,.06,.12).rotateY(Math.PI/4).translate(0,.75,0),new So(2.3,.06,.12).rotateY(-Math.PI/4).translate(0,.75,0),new Co(.22,.6,3,8).translate(0,1.55,0),new Xs(.24,10,8).translate(0,2.2,0)]:[new Zs(.32,.1,6,16).rotateY(Math.PI/2).translate(0,.4,-.72),new Zs(.32,.1,6,16).rotateY(Math.PI/2).translate(0,.4,.7),new So(.3,.32,1.3).translate(0,.85,0),new Co(.22,.5,3,8).rotateX(-.5).translate(0,1.45,.05),new Xs(.24,10,8).translate(0,1.95,-.2),new So(.8,.06,.06).translate(0,1.15,-.5)],n=om(t.map(e=>e.toNonIndexed()));t.forEach(e=>e.dispose());let r=new G(n,new Ha({color:8384767,transparent:!0,opacity:.5,depthWrite:!1,fog:!1}));return r.name=`ghost-bike`,r.renderOrder=3,r}function z_(){let e=rt.mid+1.05,t=[new qs(4.6,1.9).translate(rt.x,e,rt.z+4.02),new qs(4.6,1.9).rotateY(-Math.PI/2).translate(rt.x-4.02,e,rt.z+1.6),new qs(2.2,1.2).translate(rt.x,e-.1,rt.z+4.04)],n=om(t);t.forEach(e=>e.dispose());let r=new G(n,new Ha({map:Em(),color:16765562,transparent:!0,depthWrite:!1,blending:2,side:2,fog:!1}));return r.name=`flashlight-window-glow`,r.castShadow=!1,r}function B_(e,t,n){let r=new Q;r.add(Z.cyl(n,n,.1,48),5084927,{p:[0,.05,0],finish:`gloss`,cast:!1}),r.add(Z.cyl(n-.3,n-.3,.12,48),16765286,{p:[0,.06,0],finish:`gloss`,cast:!1});for(let e of[-n+.1,n-.1])r.add(Z.capsule(.1,3.7),16777215,{p:[e,1.8,-n+.1],finish:`gloss`}),r.add(Z.sphere(.16),16735603,{p:[e,3.7,-n+.1],finish:`gloss`});r.add(Z.rbox(n*2,.62,.16,.08),16735603,{p:[0,3.3,-n+.1],finish:`gloss`}),r.add(Z.rbox(1.2,.8,.12,.2),16777215,{p:[0,4.1,-n+.1],finish:`gloss`});for(let e of[-n+.02,-n+.18])r.add(Z.capsule(.07,.6),5924474,{p:[.05,4.05,e],r:[0,0,.7],finish:`metal`}),r.add(Z.torus(.13,.05,Math.PI*1.5,20),5924474,{p:[-.17,4.25,e],finish:`metal`});let i=r.build();return i.position.set(e,0,t),i}function V_(e){e.traverse(e=>e.castShadow=!1)}var H_=.5,U_=(e,t,n)=>`${e},${t},${Math.round(n*100)}`;function W_(e,t,n,r){let i=h,a=g,o=e=>(e+.5)*H_,s=Math.floor(n.x/H_),c=Math.floor(n.z/H_),l={ix:s,iz:c,y:e.groundAt(o(s),o(c),n.y+v,i),parent:null},u=new Set([U_(s,c,l.y)]),d=[l],f=r.map(()=>null),p=r.length,m=e=>{r.forEach((t,n)=>{if(f[n])return;let r=o(e.ix)-t.x,i=e.y+.9-t.y,a=o(e.iz)-t.z;r*r+i*i+a*a<1.35*1.35&&(f[n]=e,p--)})};m(l);let _=[[1,0],[-1,0],[0,1],[0,-1]];for(let n=0;n<d.length&&p>0;n++){let r=d[n];for(let[n,s]of _){let c=r.ix+n,l=r.iz+s,f=o(c),p=o(l);if(Math.abs(f)>t-i||Math.abs(p)>t-i||e.blocked(f,p,r.y,i,a))continue;let h=e.groundAt(f,p,r.y+v,i),g=U_(c,l,h);if(u.has(g))continue;u.add(g);let _={ix:c,iz:l,y:h,parent:r};d.push(_),m(_)}}return f.map(e=>{if(!e)return null;let t=[];for(let n=e;n;n=n.parent)t.push({x:o(n.ix),y:n.y,z:o(n.iz)});return t.reverse()})}var G_=e=>`slimecity.best.L${e}`;function K_(e){try{let t=JSON.parse(localStorage.getItem(G_(e))??`null`);return t&&typeof t.time==`number`&&t.medal in Fe?t:null}catch{return null}}function q_(e,t){let n=K_(e),r=!n||t.time<n.time,i=n?{time:Math.min(n.time,t.time),medal:Fe[t.medal]>Fe[n.medal]?t.medal:n.medal,stars:Math.max(n.stars,t.stars)}:t;try{localStorage.setItem(G_(e),JSON.stringify(i))}catch{}return{previous:n,best:i,newTime:r}}var J_=3e3,Y_=e=>`slimecity.ghost.L${e}`,X_=class{constructor(){this.buf=new Int16Array(J_*4),this.n=0,this.next=0}reset(){this.n=0,this.next=0}sample(e){if(e.race.elapsed+1e-6<this.next||this.n>=J_)return;let t=e.players[0],n=e.vehicles.find(e=>e.id===t?.riding);if(!n)return;this.next=(this.n+1)/10;let r=Math.atan2(Math.sin(n.yaw),Math.cos(n.yaw));this.buf.set([Math.round(n.pos.x*10),Math.round(n.pos.y*20),Math.round(n.pos.z*10),Math.round(r*1e4)],this.n*4),this.n++}save(e){let t=new Uint8Array(this.buf.buffer,0,this.n*8),n=``;for(let e=0;e<t.length;e+=4096)n+=String.fromCharCode(...t.subarray(e,e+4096));try{localStorage.setItem(Y_(e),JSON.stringify({v:1,hz:10,data:btoa(n)}))}catch{}}};function Z_(e){try{let t=JSON.parse(localStorage.getItem(Y_(e))??`null`);if(!t||t.v!==1||t.hz!==10)return null;let n=atob(t.data),r=new Uint8Array(n.length);for(let e=0;e<n.length;e++)r[e]=n.charCodeAt(e);let i=new Int16Array(r.buffer,0,r.length>>1),a=new Float32Array(i.length);for(let e=0;e<i.length;e+=4)a[e]=i[e]/10,a[e+1]=i[e+1]/20,a[e+2]=i[e+2]/10,a[e+3]=i[e+3]/1e4;return a.length>=8?a:null}catch{return null}}var Q_={en:{title:`Slime City`,subtitle:`Build your hero!`,code:`Code`,wheels:[`Head`,`Body`,`Legs`,`Gun`],heroParts:{cube:[`Cubehead`,`Thinks in squares. Glued pyshki stay stuck longer.`],bighead:[`Big Head`,`Huge head, huge ideas: bigger sticky blobs.`],robot:[`Robot`,`Beep-boop! Auto-aim locks on from farther away.`],cat:[`Cat`,`Always lands on its paws: way less dizzy after a shove.`],knight:[`Knight`,`Heavy helmet: pyshki push you less.`],alien:[`Alien`,`Antennas sense pyshki: wider auto-aim.`],tshirt:[`T-shirt`,`Light and breezy: a bit faster.`],hoodie:[`Hoodie`,`Deep pockets: carries 3 extra blocks.`],tank:[`Tank`,`Tank body: almost unpushable, but a bit slow.`],tuxedo:[`Tuxedo`,`So fancy that pyshki keep a polite distance.`],slimesuit:[`Slime suit`,`Extra boing on pink slime pads.`],stripes:[`Sailor`,`Born to ride: the pit bike goes faster.`],jeans:[`Jeans`,`Thick denim: pushed around a little less.`],shorts:[`Shorts`,`Air-cooled knees: faster!`],robolegs:[`Robo legs`,`Hydraulics: higher jump, slightly slower.`],springs:[`Springs`,`Boing! Much higher jump.`],boots:[`Boots`,`Stompy boots: hard to push, a bit slow.`],wheels:[`Wheels`,`Zoom! Super fast, but low jumps.`],blaster:[`Blaster`,`Trusty and balanced. Does what it says.`],rapid:[`Rapid`,`Pew-pew-pew! Rapid fire.`],bazooka:[`Bazooka`,`Giant blobs, slow reload.`],bubble:[`Bubble wand`,`Huge pink bounce pads.`],twin:[`Twin shot`,`Two blobs at once!`],ray:[`Ray gun`,`Long-range goo beam.`]},stats:{speed:`Speed`,jump:`Jump`,knockback:`Push`,stun:`Dizzy`,fireRate:`Fire rate`,blobScale:`Blob size`,projSpeed:`Range`,aimRange:`Aim range`,aimCone:`Wide aim`,glueTime:`Glue time`,maxBlocks:`Blocks`,padLaunch:`Pad boing`,padScale:`Pad size`,multishot:`Blobs`,rideSpeed:`Bike speed`,personalSpace:`Personal space`,balanced:`Balanced`},random:`Random`,play:`Play`,mission:`Find 6 pit bike parts, build the bike and ride!`,desktopHelp:`WASD move · drag to look · Space jump · Click/J sticky · Right-click/K bouncy · E block · Q cube/ramp · F ride`,sticky:`Sticky`,bouncy:`Bouncy`,jump:`Jump`,block:`Block`,cube:`Cube`,ramp:`Ramp`,blocks:`Blocks`,partNames:{frontWheel:`Front wheel`,rearWheel:`Rear wheel`,frame:`Frame`,handlebar:`Handlebar`,engine:`Engine`,flashlight:`Flashlight`},got:`Got it:`,delivered:`Bike parts`,built:`Pit bike ready!`,ride:`Ride`,exit:`Exit`,trick:`TRICK!`,tricks:{flip:`Backflip!`,spin:`Spin 360!`},hintFind:`Find the glowing bike parts!`,hintBring:`Bring the parts to the garage!`,hintMount:`Hop on your pit bike!`,hintGate:`Ride through the green gate!`,hintRide:`Ride! Bounce off a pink slime pad for a trick!`,hintLight:`Gate locked, too dark! Find the flashlight (tower lift?)`,headlightOn:`Headlight on! The gate is open`,hintPhrase:`They say someone lost a flashlight upstairs…`,glued:`Glued!`,bonk:`Oof!`,noRoom:`No room here`,win:`You did it!`,winSub:`You built a pit bike and rode it!`,time:`Time`,again:`Play again`,newHero:`New hero`,settings:`Settings`,classic:`Classic buttons`,classicHelp:`Separate Sticky and Bouncy buttons instead of tap / double-tap on the right side.`,language:`Language`,close:`OK`,tapHint:`Tap = sticky · Double-tap = bouncy · Drag = look`,phrases:[`How do I get to the library?`,`Young man!`,`Hey, you weren't in line!`,`How much for the cucumbers?`,`I just have a question!`,`I was here first!`,`Just a loaf of bread for me!`,`So skinny! Eat something!`,`No cutting in line!`,`Got change for a fifty?`,`Put a hat on, you'll catch a cold!`,`Back in my day…`,`Which bus is this?`,`Homegrown cucumbers!`,`And whose kid are you?`,`Hot buns! Fresh buns!`]},ru:{title:`Слайм-Сити`,subtitle:`Собери своего героя!`,code:`Код`,wheels:[`Голова`,`Тело`,`Ноги`,`Бластер`],heroParts:{cube:[`Кубоголов`,`Мыслит квадратно. Приклеенные пышки держатся дольше.`],bighead:[`Большая голова`,`Большая голова — большие кляксы: липкий шар крупнее.`],robot:[`Робот`,`Бип-буп! Автоприцел ловит издалека.`],cat:[`Кот`,`Всегда приземляется на лапы: почти не кружится голова.`],knight:[`Рыцарь`,`Тяжёлый шлем: пышки толкают слабее.`],alien:[`Пришелец`,`Антенны чуют пышек: автоприцел шире.`],tshirt:[`Футболка`,`Лёгкая и свежая: чуть быстрее.`],hoodie:[`Худи`,`Глубокие карманы: +3 блока.`],tank:[`Танк`,`Танковый корпус: почти не сдвинуть, но медленнее.`],tuxedo:[`Смокинг`,`Так элегантно, что пышки держат дистанцию.`],slimesuit:[`Слайм-костюм`,`Розовые лужи подкидывают выше.`],stripes:[`Тельняшка`,`Рождён гонять: питбайк быстрее.`],jeans:[`Джинсы`,`Плотная джинса: толкают чуть слабее.`],shorts:[`Шорты`,`Коленки проветриваются: быстрее!`],robolegs:[`Робоноги`,`Гидравлика: прыжок выше, шаг чуть медленнее.`],springs:[`Пружины`,`Бдыщ! Прыжок гораздо выше.`],boots:[`Сапоги`,`Топ-топ: трудно сдвинуть, но медленнее.`],wheels:[`Колёса`,`Вжух! Очень быстро, но прыжок ниже.`],blaster:[`Бластер`,`Надёжный и сбалансированный.`],rapid:[`Скорострел`,`Пиу-пиу-пиу! Быстрая стрельба.`],bazooka:[`Базука`,`Огромные кляксы, долгая перезарядка.`],bubble:[`Пузыри`,`Огромные розовые батуты.`],twin:[`Двустволка`,`Две кляксы сразу!`],ray:[`Луч`,`Дальнобойный слизе-луч.`]},stats:{speed:`Скорость`,jump:`Прыжок`,knockback:`Толчки`,stun:`Головокружение`,fireRate:`Скорострельность`,blobScale:`Размер кляксы`,projSpeed:`Дальность`,aimRange:`Дальность прицела`,aimCone:`Широкий прицел`,glueTime:`Время клея`,maxBlocks:`Блоки`,padLaunch:`Прыгучесть луж`,padScale:`Размер луж`,multishot:`Кляксы`,rideSpeed:`Скорость байка`,personalSpace:`Личное пространство`,balanced:`Сбалансировано`},random:`Случайно`,play:`Играть`,mission:`Найди 6 деталей питбайка, собери его и катайся!`,desktopHelp:`WASD — ходить · тяни мышью — смотреть · Пробел — прыжок · Клик/J — липкая · ПКМ/K — прыгучая · E — блок · Q — куб/рампа · F — сесть`,sticky:`Липкая`,bouncy:`Прыгучая`,jump:`Прыжок`,block:`Блок`,cube:`Куб`,ramp:`Рампа`,blocks:`Блоки`,partNames:{frontWheel:`Переднее колесо`,rearWheel:`Заднее колесо`,frame:`Рама`,handlebar:`Руль`,engine:`Мотор`,flashlight:`Фонарик`},got:`Есть:`,delivered:`Детали`,built:`Питбайк готов!`,ride:`Сесть`,exit:`Слезть`,trick:`ТРЮК!`,tricks:{flip:`Сальто!`,spin:`Вертушка 360!`},hintFind:`Найди светящиеся детали байка!`,hintBring:`Неси детали в гараж!`,hintMount:`Садись на питбайк!`,hintGate:`Езжай через зелёные ворота!`,hintRide:`Катайся! Прыгни с розовой слизи — будет трюк!`,hintLight:`Ворота закрыты, темно! Найди фонарик (лифт в башне?)`,headlightOn:`Фара горит! Ворота открыты`,hintPhrase:`Говорят, наверху кто-то фонарик потерял…`,glued:`Приклеен!`,bonk:`Ой!`,noRoom:`Тут нет места`,win:`Ура, получилось!`,winSub:`Ты собрал питбайк и прокатился!`,time:`Время`,again:`Ещё раз`,newHero:`Новый герой`,settings:`Настройки`,classic:`Классические кнопки`,classicHelp:`Отдельные кнопки «Липкая» и «Прыгучая» вместо тапа / двойного тапа справа.`,language:`Язык`,close:`ОК`,tapHint:`Тап — липкая · Двойной тап — прыгучая · Тяни — смотреть`,phrases:[`Как пройти в библиотеку?`,`Молодой человек!`,`А вы тут не стояли!`,`Почём огурцы?`,`Я только спросить!`,`Я за вами занимала!`,`Мне только хлебушка!`,`Худенький какой! Кушать надо!`,`Куда без очереди?!`,`А сдачи не будет?`,`Шапку надень, простудишься!`,`Вот в наше время…`,`Это какой автобус?`,`Огурчики свои, с дачи!`,`А ты чей будешь?`,`Пирожки горячие!`]}},$_=`slimecity.lang`,ev=(()=>{try{let e=localStorage.getItem($_);return[`en`,`ru`,`pl`,`lt`,`de`].includes(e||``)?e:`en`}catch{return`en`}})(),tv=[];function nv(){return ev}function rv(e){ev=e;try{localStorage.setItem($_,e)}catch{}document.documentElement.lang=e,tv.forEach(e=>e())}function iv(e){tv.push(e)}function av(){return{...Q_[ev===`ru`?`ru`:`en`],...ev===`pl`||ev===`lt`||ev===`de`?ov[ev]:{},phrases:lv[ev],hintGate:fv[ev]}}var ov={pl:{mission:`Znajdź 6 części motoru, zbuduj go i jedź!`,partNames:{frontWheel:`Przednie koło`,rearWheel:`Tylne koło`,frame:`Rama`,handlebar:`Kierownica`,engine:`Silnik`,flashlight:`Latarka`},got:`Mam:`,delivered:`Części`,built:`Motor gotowy!`,ride:`Jedź`,exit:`Zsiądź`,hintFind:`Znajdź świecące części motoru!`,hintBring:`Zanieś części do garażu!`,hintMount:`Wskakuj na motor!`,hintRide:`Jedź! Odbij się od różowego glutu i zrób trik!`,hintLight:`Brama zamknięta, ciemno! Znajdź latarkę (winda w wieży?)`,headlightOn:`Reflektor świeci! Brama otwarta`,hintPhrase:`Podobno ktoś na górze zgubił latarkę…`},lt:{mission:`Surask 6 motociklo dalis, surink jį ir važiuok!`,partNames:{frontWheel:`Priekinis ratas`,rearWheel:`Galinis ratas`,frame:`Rėmas`,handlebar:`Vairas`,engine:`Variklis`,flashlight:`Žibintuvėlis`},got:`Turiu:`,delivered:`Dalys`,built:`Motociklas paruoštas!`,ride:`Važiuoti`,exit:`Nulipti`,hintFind:`Surask šviečiančias motociklo dalis!`,hintBring:`Nešk dalis į garažą!`,hintMount:`Sėsk ant motociklo!`,hintRide:`Važiuok! Atšok nuo rožinės gleivės ir padaryk triuką!`,hintLight:`Vartai uždaryti, tamsu! Surask žibintuvėlį (bokšto liftas?)`,headlightOn:`Žibintas dega! Vartai atviri`,hintPhrase:`Sako, viršuje kažkas pametė žibintuvėlį…`},de:{mission:`Finde 6 Pitbike-Teile, bau das Bike und fahr los!`,partNames:{frontWheel:`Vorderrad`,rearWheel:`Hinterrad`,frame:`Rahmen`,handlebar:`Lenker`,engine:`Motor`,flashlight:`Taschenlampe`},got:`Hab ich:`,delivered:`Teile`,built:`Pitbike fertig!`,ride:`Fahren`,exit:`Absteigen`,hintFind:`Finde die leuchtenden Bike-Teile!`,hintBring:`Bring die Teile zur Garage!`,hintMount:`Steig auf dein Pitbike!`,hintRide:`Fahr los! Spring von einem rosa Schleimkissen für einen Trick!`,hintLight:`Tor zu, zu dunkel! Finde die Taschenlampe (Turm-Aufzug?)`,headlightOn:`Scheinwerfer an! Das Tor ist offen`,hintPhrase:`Man sagt, oben hat jemand eine Taschenlampe verloren…`}},sv=[`en`,`ru`,`pl`,`lt`,`de`];function cv(){rv(sv[(sv.indexOf(ev)+1)%sv.length])}var lv={en:Q_.en.phrases,ru:Q_.ru.phrases,pl:[`Którędy do biblioteki?`,`Ja tu stałam!`,`Ile kosztują ogórki?`,`Zjedz coś!`,`Ale miękkie bułeczki!`,`Masz drobne?`],lt:[`Kur biblioteka?`,`Aš čia stovėjau!`,`Kiek kainuoja agurkai?`,`Pavalgyk!`,`Kokios minkštos bandelės!`,`Ar turi smulkių?`],de:[`Wo ist die Bibliothek?`,`Ich war zuerst hier!`,`Was kosten die Gurken?`,`Iss etwas!`,`Frische Brötchen!`,`Hast du Kleingeld?`]},uv={en:[`That's it, I'm flying!`,`Hello birds, here I come!`,`Next stop: the moon!`],ru:[`Всё, я полетела!`,`Птичкам привет, скоро буду у вас!`,`Следующая остановка — Луна!`],pl:[`No to lecę!`,`Ptaki, zaraz do was dołączę!`,`Następny przystanek: Księżyc!`],lt:[`Viskas, aš skrendu!`,`Paukščiai, tuoj būsiu pas jus!`,`Kita stotelė — Mėnulis!`],de:[`Ich fliege los!`,`Hallo Vögel, ich komme!`,`Nächster Halt: der Mond!`]};function dv(e){return uv[ev][e%uv[ev].length]}var fv={en:`Ride through the green gate!`,ru:`Езжай через зелёные ворота!`,pl:`Przejedź przez zieloną bramę!`,lt:`Važiuok pro žalius vartus!`,de:`Fahre durch das grüne Tor!`},pv={en:{hintFind:`Harbor! Find the 4 scooter parts`,hintBring:`Bring the parts to the scooter shop!`,hintMount:`Hop on your scooter!`,built:`Scooter ready!`,race:`Race! ↑ Forward · coast road to the lighthouse`,complete:`Level 2 complete!`,completeSub:`You built a scooter and raced the coast!`,teaser:`Level 3: Drone`,teaserSub:`Up next — take to the skies!`,again:`Race again`,parts:{frontWheel:`Front wheel`,rearWheel:`Rear wheel`,deck:`Deck`,handlebar:`Handlebar`},ride:`Ride`,nextLevel:`Next level →`,nextSub:`Level 2 · Build a scooter at the harbor`},ru:{hintFind:`Гавань! Найди 4 детали самоката`,hintBring:`Неси детали в мастерскую самокатов!`,hintMount:`Вставай на самокат!`,built:`Самокат готов!`,race:`Гонка! ↑ Вперёд · по берегу к маяку`,complete:`Уровень 2 пройден!`,completeSub:`Ты собрал самокат и промчался по побережью!`,teaser:`Уровень 3: Дрон`,teaserSub:`Дальше — взлетаем в небо!`,again:`Ещё заезд`,parts:{frontWheel:`Переднее колесо`,rearWheel:`Заднее колесо`,deck:`Дека`,handlebar:`Руль`},ride:`Ехать`,nextLevel:`Дальше →`,nextSub:`Уровень 2 · Собери самокат в гавани`},pl:{hintFind:`Port! Znajdź 4 części hulajnogi`,hintBring:`Zanieś części do warsztatu hulajnóg!`,hintMount:`Wskakuj na hulajnogę!`,built:`Hulajnoga gotowa!`,race:`Wyścig! ↑ Naprzód · wybrzeżem do latarni`,complete:`Poziom 2 ukończony!`,completeSub:`Zbudowałeś hulajnogę i pognałeś wybrzeżem!`,teaser:`Poziom 3: Dron`,teaserSub:`Następny — w górę, w niebo!`,again:`Jeszcze raz`,parts:{frontWheel:`Przednie koło`,rearWheel:`Tylne koło`,deck:`Deska`,handlebar:`Kierownica`},ride:`Jedź`,nextLevel:`Dalej →`,nextSub:`Poziom 2 · Zbuduj hulajnogę w porcie`},lt:{hintFind:`Uostas! Surask 4 paspirtuko dalis`,hintBring:`Nešk dalis į paspirtukų dirbtuvę!`,hintMount:`Lipk ant paspirtuko!`,built:`Paspirtukas paruoštas!`,race:`Lenktynės! ↑ Pirmyn · pakrante iki švyturio`,complete:`2 lygis įveiktas!`,completeSub:`Surinkai paspirtuką ir nulėkei pakrante!`,teaser:`3 lygis: Dronas`,teaserSub:`Toliau — kylame į dangų!`,again:`Dar kartą`,parts:{frontWheel:`Priekinis ratas`,rearWheel:`Galinis ratas`,deck:`Lenta`,handlebar:`Vairas`},ride:`Važiuoti`,nextLevel:`Toliau →`,nextSub:`2 lygis · Surink paspirtuką uoste`},de:{hintFind:`Hafen! Finde die 4 Rollerteile`,hintBring:`Bring die Teile zur Rollerwerkstatt!`,hintMount:`Steig auf deinen Roller!`,built:`Roller fertig!`,race:`Rennen! ↑ Vorwärts · die Küste entlang zum Leuchtturm`,complete:`Level 2 geschafft!`,completeSub:`Du hast einen Roller gebaut und die Küste bezwungen!`,teaser:`Level 3: Drohne`,teaserSub:`Als Nächstes — ab in die Lüfte!`,again:`Nochmal fahren`,parts:{frontWheel:`Vorderrad`,rearWheel:`Hinterrad`,deck:`Trittbrett`,handlebar:`Lenker`},ride:`Fahren`,nextLevel:`Weiter →`,nextSub:`Level 2 · Baue einen Roller am Hafen`}},mv={en:{hintFind:`Old town! Find the 6 drone parts`,hintBring:`Bring the parts to the drone workshop!`,hintMount:`Hop on your drone!`,built:`Drone ready!`,race:`Flight! ↑ Forward · ▲▼ altitude · fly through the rings`,complete:`Level 3 complete!`,completeSub:`You built a drone and flew over the old town!`,teaser:`Level 4: Car`,teaserSub:`Coming soon — buckle up!`,again:`Fly again`,parts:{propFront:`Front propellers`,propRear:`Rear propellers`,frame:`Frame`,battery:`Battery`,camera:`Camera`,skids:`Landing skids`},ride:`Fly`,nextLevel:`Next level →`,nextSub:`Level 3 · Build a drone in the old town`,hintPhrase:`Something buzzes up in the clock tower… a battery?`,up:`Up`,down:`Down`,hintGate:`Fly through the green gate!`},ru:{hintFind:`Старый город! Найди 6 деталей дрона`,hintBring:`Неси детали в мастерскую дронов!`,hintMount:`Вставай на дрон!`,built:`Дрон готов!`,race:`Полёт! ↑ Вперёд · ▲▼ высота · пролетай сквозь кольца`,complete:`Уровень 3 пройден!`,completeSub:`Ты собрал дрон и пролетел над старым городом!`,teaser:`Уровень 4: Машина`,teaserSub:`Скоро — пристегнись!`,again:`Ещё полёт`,parts:{propFront:`Передние пропеллеры`,propRear:`Задние пропеллеры`,frame:`Рама`,battery:`Батарейка`,camera:`Камера`,skids:`Полозья`},ride:`Лететь`,nextLevel:`Дальше →`,nextSub:`Уровень 3 · Собери дрон в старом городе`,hintPhrase:`Что-то жужжит в часовой башне… батарейка?`,up:`Вверх`,down:`Вниз`,hintGate:`Пролети через зелёные ворота!`},pl:{hintFind:`Stare miasto! Znajdź 6 części drona`,hintBring:`Zanieś części do warsztatu dronów!`,hintMount:`Wskakuj na drona!`,built:`Dron gotowy!`,race:`Lot! ↑ Naprzód · ▲▼ wysokość · leć przez obręcze`,complete:`Poziom 3 ukończony!`,completeSub:`Zbudowałeś drona i przeleciałeś nad starym miastem!`,teaser:`Poziom 4: Auto`,teaserSub:`Już wkrótce — zapnij pasy!`,again:`Leć jeszcze raz`,parts:{propFront:`Przednie śmigła`,propRear:`Tylne śmigła`,frame:`Rama`,battery:`Bateria`,camera:`Kamera`,skids:`Płozy`},ride:`Leć`,nextLevel:`Dalej →`,nextSub:`Poziom 3 · Zbuduj drona na starym mieście`,hintPhrase:`Coś bzyczy w wieży zegarowej… bateria?`,up:`W górę`,down:`W dół`,hintGate:`Przeleć przez zieloną bramę!`},lt:{hintFind:`Senamiestis! Surask 6 drono dalis`,hintBring:`Nešk dalis į dronų dirbtuvę!`,hintMount:`Lipk ant drono!`,built:`Dronas paruoštas!`,race:`Skrydis! ↑ Pirmyn · ▲▼ aukštis · skrisk pro žiedus`,complete:`3 lygis įveiktas!`,completeSub:`Surinkai droną ir praskridai virš senamiesčio!`,teaser:`4 lygis: Automobilis`,teaserSub:`Jau greitai — prisisek diržą!`,again:`Skristi dar kartą`,parts:{propFront:`Priekiniai sraigtai`,propRear:`Galiniai sraigtai`,frame:`Rėmas`,battery:`Baterija`,camera:`Kamera`,skids:`Nusileidimo pavažos`},ride:`Skristi`,nextLevel:`Toliau →`,nextSub:`3 lygis · Surink droną senamiestyje`,hintPhrase:`Laikrodžio bokšte kažkas zyzia… baterija?`,up:`Aukštyn`,down:`Žemyn`,hintGate:`Praskrisk pro žalius vartus!`},de:{hintFind:`Altstadt! Finde die 6 Drohnenteile`,hintBring:`Bring die Teile zur Drohnenwerkstatt!`,hintMount:`Steig auf deine Drohne!`,built:`Drohne fertig!`,race:`Flug! ↑ Vorwärts · ▲▼ Höhe · flieg durch die Ringe`,complete:`Level 3 geschafft!`,completeSub:`Du hast eine Drohne gebaut und bist über die Altstadt geflogen!`,teaser:`Level 4: Auto`,teaserSub:`Bald — anschnallen!`,again:`Nochmal fliegen`,parts:{propFront:`Vordere Propeller`,propRear:`Hintere Propeller`,frame:`Rahmen`,battery:`Akku`,camera:`Kamera`,skids:`Landekufen`},ride:`Fliegen`,nextLevel:`Weiter →`,nextSub:`Level 3 · Baue eine Drohne in der Altstadt`,hintPhrase:`Im Uhrturm summt etwas… ein Akku?`,up:`Hoch`,down:`Runter`,hintGate:`Flieg durch das grüne Tor!`}};function hv(e=2){return(e===3?mv:pv)[ev]}var gv={en:{trickNames:{flip:`Backflip`,roll:`Barrel roll`,twist:`Table twist`,spin:`Spin 360`},finish:`Finish!`,timeUp:`Time’s up`,timeUpSub:`Steer around glued pyshki. Jump the ramps!`,tryAgain:`Try again`,medals:{gold:`Gold`,silver:`Silver`,bronze:`Bronze`},best:`Best`,newBest:`New record!`,stars:`Stars`,bonus:`Bonus`,points:`Tricks`,ring:`Fire ring!`,star:`Star`,hit:`Gotcha!`,trick:`TRICK`,bail:`Wobbly landing!`,race:`Race! ↑ Forward · steer around green pyshki`,trickPhrases:[`Grandma saw that!`,`Gravity who?`,`Like a flying pancake!`,`The pyshki applaud!`,`Pure butter!`,`Somebody call the circus!`]},ru:{trickNames:{flip:`Сальто`,roll:`Бочка`,twist:`Вертолёт`,spin:`Вертушка 360`},finish:`Финиш!`,timeUp:`Время вышло`,timeUpSub:`Объезжай приклеенных пышек. Прыгай с трамплинов!`,tryAgain:`Ещё раз`,medals:{gold:`Золото`,silver:`Серебро`,bronze:`Бронза`},best:`Рекорд`,newBest:`Новый рекорд!`,stars:`Звёзды`,bonus:`Бонус`,points:`Трюки`,ring:`Огненное кольцо!`,star:`Звезда`,hit:`Попал!`,trick:`ТРЮК`,bail:`Кривое приземление!`,race:`Гонка! ↑ Вперёд · объезжай зелёных пышек`,trickPhrases:[`Бабушка бы ахнула!`,`Гравитация? Не слышал!`,`Как блинчик в полёте!`,`Пышки аплодируют!`,`Как по маслу!`,`Зовите цирк!`]},pl:{trickNames:{flip:`Salto`,roll:`Beczka`,twist:`Helikopter`,spin:`Obrót 360`},finish:`Meta!`,timeUp:`Koniec czasu`,timeUpSub:`Omijaj przyklejone pyszki. Skacz z ramp!`,tryAgain:`Jeszcze raz`,medals:{gold:`Złoto`,silver:`Srebro`,bronze:`Brąz`},best:`Rekord`,newBest:`Nowy rekord!`,stars:`Gwiazdki`,bonus:`Bonus`,points:`Triki`,ring:`Ogniste koło!`,star:`Gwiazdka`,hit:`Trafiony!`,trick:`TRIK`,bail:`Krzywe lądowanie!`,race:`Wyścig! ↑ Naprzód · omijaj zielone pyszki`,trickPhrases:[`Babcia by zemdlała!`,`Grawitacja? Nie znam!`,`Jak latający naleśnik!`,`Pyszki biją brawo!`,`Gładko jak masło!`,`Dzwońcie po cyrk!`]},lt:{trickNames:{flip:`Salto`,roll:`Statinė`,twist:`Sraigtasparnis`,spin:`Apsisukimas 360`},finish:`Finišas!`,timeUp:`Laikas baigėsi`,timeUpSub:`Apvažiuok priklijuotas spurgytes. Šok nuo rampų!`,tryAgain:`Dar kartą`,medals:{gold:`Auksas`,silver:`Sidabras`,bronze:`Bronza`},best:`Rekordas`,newBest:`Naujas rekordas!`,stars:`Žvaigždės`,bonus:`Premija`,points:`Triukai`,ring:`Ugnies žiedas!`,star:`Žvaigždė`,hit:`Pataikiau!`,trick:`TRIUKAS`,bail:`Kreivas nusileidimas!`,race:`Lenktynės! ↑ Pirmyn · apvažiuok žalias spurgytes`,trickPhrases:[`Močiutė apalptų!`,`Gravitacija? Nežinau tokios!`,`Kaip skraidantis blynas!`,`Spurgytės ploja!`,`Kaip per sviestą!`,`Kvieskit cirką!`]},de:{trickNames:{flip:`Rückwärtssalto`,roll:`Fassrolle`,twist:`Hubschrauber`,spin:`360er-Dreh`},finish:`Ziel!`,timeUp:`Zeit um`,timeUpSub:`Fahr um festgeklebte Pyschki herum. Spring über die Rampen!`,tryAgain:`Nochmal`,medals:{gold:`Gold`,silver:`Silber`,bronze:`Bronze`},best:`Bestzeit`,newBest:`Neuer Rekord!`,stars:`Sterne`,bonus:`Bonus`,points:`Tricks`,ring:`Feuerring!`,star:`Stern`,hit:`Erwischt!`,trick:`TRICK`,bail:`Wackelige Landung!`,race:`Rennen! ↑ Vorwärts · fahr um die grünen Pyschki`,trickPhrases:[`Oma hat das gesehen!`,`Schwerkraft? Nie gehört!`,`Wie ein fliegender Pfannkuchen!`,`Die Pyschki klatschen!`,`Butterweich!`,`Ruft den Zirkus!`]}};function _v(){return gv[ev]}var vv=class{constructor(){this.els=new Map,this.root=document.createElement(`div`),this.root.className=`bubbles`,document.body.appendChild(this.root)}show(e){this.root.style.display=e?``:`none`}clear(){this.root.innerHTML=``,this.els.clear()}update(e,t,n){let r=av(),i=new Set;for(let a of e.creatures){let o=a.stuck>0;if(!o&&a.talk<=0)continue;let s=Math.hypot(a.pos.x-n.x,a.pos.y-n.y,a.pos.z-n.z);if(s>22)continue;let c=t(a.pos.x,a.pos.y+1.2+a.id%3*.32,a.pos.z);if(!c)continue;i.add(a.id);let l=o?`z z z`:a.phrase===200?e.level===3?hv(3).hintPhrase:r.hintPhrase:a.phrase>=100?dv(a.phrase-100):r.phrases[a.phrase%r.phrases.length],u=this.els.get(a.id);if(!u){let e=document.createElement(`div`);e.className=`bubble`,e.appendChild(document.createElement(`span`)),this.root.appendChild(e),u={el:e,text:``},this.els.set(a.id,u)}if(u.text!==l){u.text=l;let e=u.el.firstChild;e.textContent=l,u.el.classList.toggle(`zzz`,o),e.classList.remove(`pop`),e.offsetWidth,e.classList.add(`pop`)}let d=Math.max(.85,Math.min(1.1,9/s)),f=o?1:Math.min(1,a.talk/.3);u.el.style.transform=`translate(${c.x}px, ${c.y}px) translate(-50%, -100%) scale(${d.toFixed(3)})`,u.el.style.opacity=f.toFixed(2),u.el.style.zIndex=String(1e3-Math.round(s*10))}for(let[e,t]of this.els)i.has(e)||(t.el.remove(),this.els.delete(e))}},yv=`slimecity.look`;function bv(){try{let e=localStorage.getItem(yv);if(e&&/^[0-5]{4}$/.test(e))return e.split(``).map(Number)}catch{}return[0,0,0,0]}function xv(e){try{localStorage.setItem(yv,e.join(``))}catch{}}function Sv(e){let t=[],n=e=>`${e>0?`+`:`−`}${Math.round(Math.abs(e)*100)}%`;for(let[r,i]of Object.entries(e)){let e=ag[r];switch(r){case`fireCooldown`:t.push({key:`fireRate`,text:n(e/i-1),good:i<e});break;case`knockback`:case`stun`:t.push({key:r,text:n(i-1),good:i<1});break;case`aimCone`:t.push({key:r,text:`▲`,good:!0});break;case`aimRange`:t.push({key:r,text:`+${i-e} m`,good:!0});break;case`glueTime`:t.push({key:r,text:`+${(i-e).toFixed(1)} s`,good:!0});break;case`maxBlocks`:t.push({key:r,text:`+${i-e}`,good:!0});break;case`multishot`:t.push({key:r,text:`×${i}`,good:!0});break;case`personalSpace`:t.push({key:r,text:`+${i} m`,good:!0});break;default:t.push({key:r,text:n(i-1),good:i>1})}}return t}var Cv=class{constructor(e,t,n){this.onChange=e,this.onPlay=t,this.thumb=n,this.slot=0,this.tabs=[],this.texts=[],this.look=bv(),this.el=document.createElement(`div`),this.el.className=`screen creator`;let r=wv(`creator-top`),i=wv(`title`),a=wv(`subtitle`);this.langBtn=document.createElement(`button`),this.langBtn.className=`lang-btn`,this.langBtn.addEventListener(`click`,()=>cv()),r.append(i,a,this.langBtn),this.texts.push({el:i,key:`title`},{el:a,key:`subtitle`});let o=wv(`builder`),s=wv(`code-row`),c=wv(`code-label`);this.codeEl=wv(`code`);let l=document.createElement(`button`);l.className=`btn-small random-btn`,l.addEventListener(`click`,()=>this.randomize()),s.append(c,this.codeEl,l),this.texts.push({el:c,key:`code`},{el:l,key:`random`});let u=wv(`tabs`);og.forEach((e,t)=>{let n=document.createElement(`button`);n.className=`tab`,n.addEventListener(`click`,()=>this.selectSlot(t)),u.appendChild(n),this.tabs.push(n)}),this.cardsEl=wv(`cards`);let d=wv(`quirk`);this.quirkName=wv(`quirk-name`),this.quirkText=wv(`quirk-text`),this.chipsEl=wv(`chips`),d.append(this.quirkName,this.quirkText,this.chipsEl);let f=document.createElement(`button`);f.className=`btn btn-play`,f.id=`play-btn`,f.addEventListener(`click`,()=>this.onPlay(this.look)),this.texts.push({el:f,key:`play`});let p=wv(`mission`),m=wv(`help desktop-only`);this.texts.push({el:p,key:`mission`},{el:m,key:`desktopHelp`}),o.append(s,u,this.cardsEl,d,f,p,m),this.el.append(r,o),document.body.appendChild(this.el),iv(()=>this.refresh()),this.refresh()}selectSlot(e){this.slot=e,this.refresh()}setPart(e,t){let n=[...this.look];n[e]=(t%6+6)%6,this.look=n,xv(n),this.refresh(),this.onChange(this.look)}randomize(){this.look=this.look.map(()=>Math.floor(Math.random()*6)),xv(this.look),this.refresh(),this.onChange(this.look)}refresh(){let e=av();for(let t of this.texts)t.el.textContent=e[t.key];this.langBtn.innerHTML=`<span class="lang-all">EN · RU · PL · LT · DE </span><span class="lang-cur">🌐 `+nv().toUpperCase()+`</span>`,this.codeEl.textContent=this.look.join(``),og.forEach((t,n)=>{let r=this.tabs[n];r.classList.toggle(`on`,n===this.slot),r.innerHTML=``;let i=document.createElement(`img`);i.src=this.thumb(t,this.look[n]),i.alt=``;let a=document.createElement(`span`);a.textContent=e.wheels[n],r.append(i,a)});let t=og[this.slot];this.cardsEl.innerHTML=``,sg[t].forEach((n,r)=>{let i=document.createElement(`button`);i.className=`card`+(this.look[this.slot]===r?` on`:``),i.dataset.slot=t,i.dataset.part=String(r);let a=document.createElement(`img`);a.src=this.thumb(t,r),a.alt=``;let o=document.createElement(`span`);o.className=`card-name`,o.textContent=e.heroParts[n.id]?.[0]??n.id;let s=document.createElement(`span`);s.className=`card-num`,s.textContent=String(r),i.append(s,a,o),i.addEventListener(`click`,()=>this.setPart(this.slot,r)),this.cardsEl.appendChild(i)});let n=sg[t][this.look[this.slot]],[r,i]=e.heroParts[n.id]??[n.id,``];this.quirkName.textContent=r,this.quirkText.textContent=i,this.chipsEl.innerHTML=``;let a=Sv(n.stats);a.length||a.push({key:`balanced`,text:`✓`,good:!0});for(let t of a){let n=document.createElement(`span`);n.className=`chip `+(t.good?`good`:`bad`),n.textContent=`${e.stats[t.key]??t.key} ${t.text}`,this.chipsEl.appendChild(n)}}show(e){this.el.style.display=e?``:`none`}};function wv(e){let t=document.createElement(`div`);return t.className=e,t}var Tv=`slimecity.controls.v3.classicButtons`,Ev=(()=>{try{return localStorage.getItem(Tv)!==`0`}catch{return!0}})(),Dv=[];function Ov(){return Ev}function kv(e){Ev=e;try{localStorage.setItem(Tv,e?`1`:`0`)}catch{}Dv.forEach(t=>t(e))}function Av(e){Dv.push(e)}var jv=class{constructor(e=()=>{}){this.onOpenChange=e,this.isOpen=!1,this.el=document.createElement(`div`),this.el.className=`screen settings`,this.el.innerHTML=`
      <div class="settings-card">
        <div class="settings-title"></div>
        <label class="settings-row">
          <span class="settings-label"></span>
          <input type="checkbox" class="switch" />
        </label>
        <div class="settings-help"></div>
        <div class="settings-row">
          <span class="lang-label"></span>
          <button class="lang-btn settings-lang"></button>
        </div>
        <button class="btn btn-play settings-close"></button>
      </div>`,document.body.appendChild(this.el);let t=e=>this.el.querySelector(e);this.title=t(`.settings-title`),this.label=t(`.settings-label`),this.help=t(`.settings-help`),this.langLabel=t(`.lang-label`),this.langBtn=t(`.settings-lang`),this.toggle=t(`.switch`),this.closeBtn=t(`.settings-close`),this.toggle.checked=Ev,this.toggle.addEventListener(`change`,()=>kv(this.toggle.checked)),this.langBtn.addEventListener(`click`,()=>cv()),this.closeBtn.addEventListener(`click`,()=>this.open(!1)),this.el.addEventListener(`pointerdown`,e=>{e.target===this.el&&this.open(!1)}),iv(()=>this.refresh()),this.refresh(),this.el.style.display=`none`}gearButton(){let e=document.createElement(`button`);return e.className=`gear-btn`,e.setAttribute(`aria-label`,`Settings`),e.textContent=`⚙`,e.addEventListener(`pointerdown`,e=>e.stopPropagation()),e.addEventListener(`click`,()=>this.open(!0)),e}open(e){this.isOpen=e,this.toggle.checked=Ev,this.el.style.display=e?``:`none`,this.onOpenChange(e)}refresh(){let e=av();this.title.textContent=e.settings,this.label.textContent=e.classic,this.help.textContent=e.classicHelp,this.langLabel.textContent=e.language,this.langBtn.textContent=`EN · RU · PL · LT · DE (`+nv().toUpperCase()+`)`,this.closeBtn.textContent=e.close}};function Mv(e){return`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}var Nv=class{constructor(e,t){this.bonusTimer=0,this.toastTimer=0,this.trickTimer=0,this.labels=[],this.shape=`cube`,this.lastShown=``,this.tapHintTimer=0,this.el=document.createElement(`div`),this.el.className=`screen hud`,this.el.innerHTML=`
      <div class="hud-top">
        <div class="hud-left">
          <div class="pill parts"><span class="wrench-icon">🔧</span><span class="v"></span><span class="carry"></span></div>
          <div class="hint"></div>
        </div>
        <div class="hud-right"><div class="pill time"></div></div>
      </div>
      <div class="tap-hint"></div><div class="controls-tip"></div>
      <div class="gate-compass" hidden><span>➤</span></div>
      <div class="toast"></div>
      <div class="trick"></div>
      <div class="bonus-pop"></div>
      <button class="ride-btn" data-a="interact"></button>
      <div class="buttons">
        <button class="act act-sticky" data-a="sticky"><span class="ic"></span><span class="lb"></span></button>
        <button class="act act-bouncy" data-a="bouncy"><span class="ic"></span><span class="lb"></span></button>
        <button class="act act-jump" data-a="jump"><span class="ic">⤒</span><span class="lb"></span></button>
        <button class="act act-trick" data-a="trick"><span class="ic">🤸</span><span class="lb">TRICK</span></button>
        <button class="act act-up" data-a="up"><span class="ic">▲</span><span class="lb"></span></button>
        <button class="act act-down" data-a="down"><span class="ic">▼</span><span class="lb"></span></button>
        <div class="block-group">
          <button class="act act-block" data-a="place"><span class="ic"></span><span class="lb"></span><span class="count"></span></button>
          <button class="shape-btn" data-a="toggleShape"></button>
        </div>
      </div>`,document.body.appendChild(this.el);let n=e=>this.el.querySelector(e);this.compassEl=n(`.gate-compass`),this.compassArrow=n(`.gate-compass span`),this.partsEl=n(`.parts .v`),this.carryEl=n(`.parts .carry`),this.timeEl=n(`.time`),this.hintEl=n(`.hint`),this.blocksEl=n(`.act-block .count`),this.shapeBtn=n(`.shape-btn`),this.rideBtn=n(`.ride-btn`),this.toastEl=n(`.toast`),this.trickEl=n(`.trick`),this.bonusEl=n(`.bonus-pop`),this.iconEl=n(`.wrench-icon`),this.trickLabel=n(`.act-trick .lb`),this.tapHintEl=n(`.tap-hint`),n(`.hud-right`).prepend(t.gearButton());let r=t=>{e.classic=t,this.el.classList.toggle(`classic`,t),this.el.classList.toggle(`modern`,!t)};r(Ov()),Av(r),this.labels=[{el:n(`.act-sticky .lb`),key:`sticky`},{el:n(`.act-bouncy .lb`),key:`bouncy`},{el:n(`.act-jump .lb`),key:`jump`},{el:n(`.act-block .lb`),key:`block`}],this.el.querySelectorAll(`button[data-a]`).forEach(t=>{let n=t.dataset.a;t.addEventListener(`pointerdown`,r=>{r.preventDefault(),r.stopPropagation(),t.classList.add(`down`),e.press(n)});let r=()=>{t.classList.remove(`down`),e.release(n)};t.addEventListener(`pointerup`,r),t.addEventListener(`pointerleave`,r),t.addEventListener(`pointercancel`,r),t.addEventListener(`contextmenu`,e=>e.preventDefault())}),iv(()=>{this.lastShown=``,this.refreshText()}),this.refreshText()}refreshText(){let e=av();for(let t of this.labels)t.el.textContent=e[t.key];let t=hv(3);this.el.querySelector(`.act-up .lb`).textContent=t.up,this.el.querySelector(`.act-down .lb`).textContent=t.down,this.shapeBtn.textContent=this.shape===`cube`?`■ ${e.cube}`:`◢ ${e.ramp}`,this.tapHintEl.textContent=e.tapHint,this.el.querySelector(`.controls-tip`).textContent=window.matchMedia(`(pointer: coarse)`).matches?`Left thumb: move · Drag: look · Sticky / Bouncy: shoot`:e.desktopHelp}showTapHint(){this.tapHintTimer=4,this.tapHintEl.classList.add(`on`)}show(e){this.el.style.display=e?``:`none`,e&&(this.lastShown=``)}clearPopups(){this.toastTimer=this.trickTimer=0,this.toastEl.classList.remove(`on`),this.trickEl.classList.remove(`on`)}update(e,t,n,r){let i=e.players.find(e=>e.id===t);if(!i)return;let a=av(),s=e.garages[0],c=s?M[s.vehicle].parts.length:0,l=s?s.delivered.length:0,u=e.pickups.filter(e=>e.status===`carried`&&e.carrier===i.id).length,d=Ve(e.level),f=e.level>=2?hv(e.level):null,p=d.tower&&Math.hypot(i.pos.x-rt.liftX,i.pos.z-rt.z)<3,m=Sg(e,i)!==null,h=i.riding!==null,g=a.hintFind,_=qe(e);u>0?g=a.hintBring:s?.built&&!_&&d.race?g=a.hintLight:s?.built&&(g=h?a.hintRide:a.hintMount),f&&(g=u>0?f.hintBring:s?.built?f.hintMount:f.hintFind);let v=!!d.race&&e.race.phase===`open`;if(v&&(g=f?.hintGate??a.hintGate),this.compassEl.hidden=!v||!h,v&&h){let e=d.race.gateAt,t=Math.atan2(e.x-i.pos.x,i.pos.z-e.z)+r;this.compassArrow.style.transform=`rotate(${t-Math.PI/2}rad)`,this.compassEl.title=a.hintGate,this.compassEl.setAttribute(`aria-label`,a.hintGate)}e.race.phase===`racing`&&(g=f?f.race:_v().race),e.race.phase===`racing`&&(this.toastTimer=0,this.toastEl.classList.remove(`on`),this.tapHintEl.classList.remove(`on`));let y=e.race.phase===`racing`?e.race.remaining:e.time,b=e.race.phase===`racing`,x=b&&d.race?o(d.race.course).length:0,S=[b,e.race.stars.length,l,u,Mv(y),e.blocks.length,i.shape,g,m,h,p].join(`|`);S!==this.lastShown&&(this.lastShown=S,this.iconEl.textContent=b?`⭐`:`🔧`,this.partsEl.textContent=b?`${e.race.stars.length}/${x}`:`${l}/${c}`,this.carryEl.textContent=u&&!b?`+${u}`:``,this.timeEl.textContent=Mv(y),this.hintEl.textContent=g,this.blocksEl.textContent=`${i.stats.maxBlocks-e.blocks.length}`,this.rideBtn.style.display=m||h||p?``:`none`,this.rideBtn.textContent=p&&!h?document.documentElement.lang===`ru`?`↕ Лифт`:`↕ Elevator`:h?`${a.exit}`:s?.vehicle===`scooter`?`🛴 ${f.ride}`:s?.vehicle===`drone`?`🚁 ${f.ride}`:`🏍 ${a.ride}`,this.el.classList.toggle(`riding`,h),this.trickLabel.textContent=_v().trick,i.shape!==this.shape&&(this.shape=i.shape,this.refreshText()));let C=h?e.vehicles.find(e=>e.id===i.riding):void 0,w=!!C&&M[C.kind].flies;this.el.classList.toggle(`flying`,w),this.el.classList.toggle(`airborne`,!!C&&!C.grounded&&!w),this.tapHintTimer>0&&(this.tapHintTimer-=n,this.tapHintTimer<=0&&this.tapHintEl.classList.remove(`on`)),this.toastTimer>0&&(this.toastTimer-=n,this.toastTimer<=0&&this.toastEl.classList.remove(`on`)),this.bonusTimer>0&&(this.bonusTimer-=n,this.bonusTimer<=0&&this.bonusEl.classList.remove(`on`)),this.trickTimer>0&&(this.trickTimer-=n,this.trickTimer<=0&&this.trickEl.classList.remove(`on`))}toast(e,t=1.2){this.toastEl.textContent=e,this.toastEl.classList.remove(`on`),this.toastEl.offsetWidth,this.toastEl.classList.add(`on`),this.toastTimer=t}trick(e){let t=av(),n=_v(),[r,i,a]=e.split(`|`);this.trickEl.innerHTML=``;let o=document.createElement(`div`);o.textContent=i?`${t.trick} ${i}`:t.trick;let s=document.createElement(`div`);s.className=`trick-name`,s.textContent=r.split(`+`).map(e=>n.trickNames[e]??e).join(` + `);let c=document.createElement(`div`);c.className=`trick-quip`,c.textContent=n.trickPhrases[+a%n.trickPhrases.length]??``,this.trickEl.append(o,s,c),this.trickEl.classList.remove(`on`),this.trickEl.offsetWidth,this.trickEl.classList.add(`on`),this.trickTimer=1.6}bonus(e,t){this.bonusEl.textContent=e,this.bonusEl.dataset.kind=t,this.bonusEl.classList.remove(`on`),this.bonusEl.offsetWidth,this.bonusEl.classList.add(`on`),this.bonusTimer=1.3}onEvents(e,t,n){let r=av();if(t.race.phase===`racing`){let t=_v();for(let r of e)if(r.type===`bonus`){let[e,n]=(r.info??``).split(`:`),i=e===`ring`?t.ring:e===`hit`?t.hit:e===`trick`?t.trick:t.bonus;this.bonus(`+${n}s ${i}`,e)}else r.type===`star`?this.bonus(`⭐ ${t.star}!`,`star`):r.type===`trick`&&r.who===n?this.trick(r.info??``):r.type===`bail`&&r.who===n&&this.bonus(t.bail,`bail`)}else for(let i of e){let e=i.who===n,a=t.level>=2?hv(t.level).parts:r.partNames;if(i.type===`pickup`&&e)this.toast(`${r.got} ${a[i.info??``]??i.info}`,1.6);else if(i.type===`deliver`&&e){let e=t.garages[0];i.info===`flashlight`&&e.built?this.toast(r.headlightOn,2.2):this.toast(`${r.delivered} ${e.delivered.length}/${M[e.vehicle].parts.length}`,1.4)}else i.type===`built`?this.toast(i.info===`scooter`?hv(2).built:i.info===`drone`?hv(3).built:r.built,2.2):i.type===`trick`&&e?this.trick(i.info??``):i.type===`bail`&&e?this.bonus(_v().bail,`bail`):i.type===`glue`?this.toast(r.glued,.9):i.type===`bonk`&&e?this.toast(r.bonk,.7):i.type===`noroom`&&e&&this.toast(r.noRoom,.9)}}},Pv={gold:`🥇`,silver:`🥈`,bronze:`🥉`},Fv=class{constructor(e,t){this.time=0,this.outcome=`won`,this.summary=null,this.level=1,this.el=document.createElement(`div`),this.el.className=`screen win`,this.el.innerHTML=`
      <div class="win-card">
        <div class="win-icon">🏍️</div>
        <div class="win-title"></div>
        <div class="win-sub"></div>
        <div class="win-medal" hidden><span class="medal-icon"></span><span class="medal-name"></span></div>
        <div class="win-time"></div>
        <div class="win-best" hidden></div>
        <div class="win-stats" hidden></div>
        <div class="teaser" hidden>
          <div class="drone" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></div>
          <div class="car" aria-hidden="true"><b></b><u></u><i></i><i></i></div>
          <div class="teaser-text"><div class="teaser-title"></div><div class="teaser-sub"></div></div>
        </div>
        <div class="win-buttons">
          <button class="btn btn-play again"></button>
          <button class="btn btn-secondary hero"></button>
        </div>
      </div>`,document.body.appendChild(this.el),this.el.querySelector(`.again`).addEventListener(`click`,e),this.el.querySelector(`.hero`).addEventListener(`click`,t),iv(()=>this.refresh()),this.show(!1)}refresh(){let e=av(),t=e=>this.el.querySelector(e);t(`.win-title`).textContent=e.win,t(`.win-sub`).textContent=e.winSub,t(`.win-time`).textContent=`${e.time}: ${Mv(this.time)}`,t(`.again`).textContent=e.again,t(`.hero`).textContent=e.newHero;let n=hv(this.level===3?3:2),r=_v(),i=this.outcome,a=this.summary,o=t(`.win-medal`),s=t(`.win-best`),c=t(`.win-stats`);if(o.hidden=s.hidden=c.hidden=!a||i===`failed`,o.className=`win-medal ${a?.medal??``}`,a){t(`.medal-icon`).textContent=Pv[a.medal],t(`.medal-name`).textContent=r.medals[a.medal],s.textContent=a.newTime?`${r.newBest} ${Pv[a.best.medal]}`:`${r.best}: ${Mv(a.best.time)} ${Pv[a.best.medal]}`,s.classList.toggle(`record`,a.newTime),c.innerHTML=``;for(let[e,t,n]of[[`⭐`,r.stars,`${a.stars}/${a.starsTotal}`],[`⏱`,r.bonus,`+${Math.round(a.bonus)}s`],[`🤸`,r.points,`${a.points}`]]){let r=document.createElement(`span`);r.className=`stat`,r.title=t,r.textContent=`${e} ${n}`,c.append(r)}}t(`.win-icon`).textContent=i===`next`?`🏁`:i===`failed`?`⏱`:i===`complete`?this.level===3?`🚁`:`🛴`:`🏍️`,t(`.teaser`).hidden=i!==`complete`,t(`.drone`).hidden=this.level===3,t(`.car`).hidden=this.level!==3,this.el.classList.toggle(`complete`,i===`complete`),this.el.classList.toggle(`level3`,this.level===3),i===`next`?(t(`.win-title`).textContent=r.finish,t(`.win-sub`).textContent=n.nextSub,t(`.again`).textContent=n.nextLevel):i===`failed`?(t(`.win-title`).textContent=r.timeUp,t(`.win-sub`).textContent=r.timeUpSub,t(`.again`).textContent=r.tryAgain):i===`complete`&&(t(`.win-title`).textContent=n.complete,t(`.win-sub`).textContent=n.completeSub,t(`.again`).textContent=this.level===2?n.nextLevel:n.again,t(`.teaser-title`).textContent=n.teaser,t(`.teaser-sub`).textContent=n.teaserSub)}open(e,t=`won`,n=null,r=1){this.level=r,this.time=e,this.outcome=t,this.summary=n,this.refresh(),this.show(!0)}show(e){this.el.style.display=e?``:`none`}},Iv=document.getElementById(`game`),Lv=Xm(Iv);Lv.setSize(window.innerWidth,window.innerHeight,!1);var Rv=new rh(Lv);rv(nv());var zv=`creator`,$=null,Bv=null,Vv=0,Hv=0,Uv=0,Wv=!1,Gv=!1,Kv=0,qv=new X_,Jv=null,Yv=null,Xv=new Hf(Iv),Zv=new jv(e=>{Gv=e,Xv.reset()}),Qv=new Nv(Xv,Zv);Qv.show(!1);var $v=new vv;$v.show(!1);var ey=new Ii;ey.background=new W(Jm),ey.environment=Qm(Lv),ey.environmentIntensity=.6;var ty=new Kc(40,1,.1,400),ny=th();ey.add(ny);var{sun:ry}=nh(ey,1024);ry.position.set(3,8,5);var iy=new Q;iy.add(pm([[.001,-.32],[1.3,-.32],[1.38,-.26],[1.4,-.12],[1.34,-.03],[1.24,0],[.001,0]]),16743074,{finish:`gloss`}),iy.add(Z.torus(1.3,.05,Math.PI*2,64),16777215,{p:[0,-.05,0],r:[Math.PI/2,0,0],finish:`gloss`});var ay=iy.build(!0);ey.add(ay);var oy=new G(new qs(1.6,1.6).rotateX(-Math.PI/2),wm());oy.position.y=.01,ey.add(oy);var sy=new U;ey.add(sy);var cy=null,ly=0;function uy(e){cy&&(sy.remove(cy.root),cy.root.traverse(e=>e instanceof G&&e.geometry.dispose())),cy=Um(e),cy.root.rotation.y=Math.PI,sy.add(cy.root),ly=1}var dy=new Ii;dy.background=new W(15660287),dy.environment=Qm(Lv),dy.environmentIntensity=.7,dy.add(new Pc(16777215,14207152,1.2));var fy=new Zc(16777215,2.2);fy.position.set(2,4,-5),dy.add(fy);var py=new Kc(30,1,.01,50),my=new Map,hy=document.createElement(`canvas`);hy.width=hy.height=128;function gy(e,t){let n=`${e}${t}`,r=my.get(n);if(r)return r;let i=Wm(e,t);dy.add(i);let a=new Zi().setFromObject(i),o=a.getCenter(new H),s=a.getSize(new H).length(),c=new H(.55,.3,-1).normalize();py.position.copy(o).addScaledVector(c,s/2/Math.tan(15*Math.PI/180)*1.05),py.lookAt(o);let l=128/Lv.getPixelRatio();Lv.setScissorTest(!0),Lv.setScissor(0,0,l,l),Lv.setViewport(0,0,l,l),Lv.render(dy,py);let u=hy.getContext(`2d`);u.clearRect(0,0,128,128),u.drawImage(Iv,0,Iv.height-128,128,128,0,0,128,128);let d=hy.toDataURL(`image/png`);Lv.setScissorTest(!1);let f=Lv.getSize(new V);return Lv.setViewport(0,0,f.x,f.y),dy.remove(i),i.traverse(e=>e instanceof G&&e.geometry.dispose()),my.set(n,d),d}var _y=new Cv(uy,e=>by(e),gy);_y.el.querySelector(`.creator-top`)?.prepend(Zv.gearButton()),uy(_y.look);var vy=new Fv(()=>{$?.race.phase===`failed`?(Ye($),wy()):by(_y.look,Math.min(3,($?.level??0)+1))},()=>yy());function yy(){zv=`creator`,Xv.enabled=!1,Xv.reset(),vy.show(!1),Qv.show(!1),$v.show(!1),$v.clear(),_y.show(!0),document.body.classList.remove(`playing`),xy()}function by(e,t=1){Wf(),$=Mg(Yv??Date.now()&65535^24301,e,t),Vv=$.players[0].id,Bv?.dispose(),Bv=new N_($,window.innerWidth/window.innerHeight,Lv),Xv.camYaw=0,Xv.camPitch=.4,Xv.reset(),Xv.enabled=!0,Hv=0,zv=`play`,Kv=0,_y.show(!1),vy.show(!1),Qv.show(!0),Qv.clearPopups(),$v.clear(),$v.show(!0),document.body.classList.add(`playing`),window.matchMedia?.(`(pointer: coarse)`).matches&&!Ov()&&Qv.showTapHint(),Rv.reset(),xy()}function xy(){let e=window.innerWidth,t=window.innerHeight;Lv.setSize(e,t,!1),ty.aspect=e/t,t>e*1.05?(ty.position.set(0,1.7,11.5),ty.lookAt(0,.9,0),ty.setViewOffset(e,t,0,t*.2,e,t)):(ty.position.set(0,1.5,5.6),ty.lookAt(0,.95,0),ty.setViewOffset(e,t,e*.23,0,e,t)),ty.updateProjectionMatrix(),ny.position.copy(ty.position),Bv&&(Bv.camera.aspect=e/t,Bv.camera.fov=t>e?72:62,Bv.camera.updateProjectionMatrix())}window.addEventListener(`resize`,xy),document.addEventListener(`visibilitychange`,()=>Rv.reset()),xy();function Sy(e){$&&Bv&&((e.place||e.toggleShape)&&(Uv=2.5),Ig($,{[Vv]:e},p),$.race.phase===`racing`&&(Jv!==$.race&&(Jv=$.race,qv.reset(),Bv.setGhostPath(Z_($.level))),qv.sample($)),Bv.handleEvents($.events),Qv.onEvents($.events,$,Vv),($.status===`won`||$.race.phase===`failed`)&&zv===`play`&&(zv=`won`,Kv=2.2))}function Cy(e){let t=Ke(e);if(!t||e.race.phase!==`finished`)return null;let n=Ie(t,e.winTime),r=e.race.stars.length,{best:i,newTime:a}=q_(e.level,{time:e.winTime,medal:n,stars:r});return a&&Jv===e.race&&qv.save(e.level),{medal:n,best:i,newTime:a,stars:r,starsTotal:o(t.course).length,bonus:e.race.bonus,points:e.race.points,hits:e.race.hits}}function wy(){zv=`play`,Kv=0,vy.show(!1),Qv.show(!0),$v.show(!0),Xv.enabled=!0,Xv.reset()}function Ty(e){let t=$?.players.find(e=>e.id===Vv);if(!$||!t||t.riding===null)return;let n=$.vehicles.find(e=>e.id===t.riding),r=!!n&&M[n.kind].flies;if(!n||!n.grounded&&!r||performance.now()-Xv.lastLook<1200)return;let i=n.yaw-Xv.camYaw;for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;Xv.camYaw+=i*Math.min(1,e*2.5*Math.min(1,Math.abs(n.speed)/3)),Xv.camPitch+=((r?.34:.3)-Xv.camPitch)*Math.min(1,e*2)}function Ey(e){let t=Bv?.yawHint;if(t==null||performance.now()-Xv.lastLook<1200)return;let n=t-Xv.camYaw;for(;n>Math.PI;)n-=Math.PI*2;for(;n<-Math.PI;)n+=Math.PI*2;Xv.camYaw+=n*Math.min(1,e*3)}var Dy=performance.now();function Oy(e){requestAnimationFrame(Oy);let t=Math.min(1,(e-Dy)/1e3),n=Math.min(.1,t);if(Dy=e,Rv.update(t),zv===`creator`){sy.rotation.y+=n*.6,ly=Math.max(0,ly-n*3);let t=1+Math.sin(ly*Math.PI)*.08;sy.scale.set(t,2-t,t),cy&&(cy.head.rotation.z=Math.sin(e/500)*.05),Lv.render(ey,ty);return}if(!$||!Bv)return;if(!Wv&&!Gv){Hv+=n;let e=0;for(;Hv>=.016666666666666666&&e<6;)Sy(Xv.consume(p)),Hv-=p,e++;e===6&&(Hv=0)}Uv-=n,Kv>0&&(Kv-=t,Kv<=0&&zv===`won`&&$&&(Xv.enabled=!1,Xv.reset(),Qv.show(!1),$v.show(!1),vy.open($.winTime,$.race.phase===`failed`?`failed`:$.level===1?`next`:`complete`,Cy($),$.level))),Ty(n),Ey(n),Bv.sync($,Xv.camYaw,Xv.camPitch,n,Vv,Uv>0&&zv===`play`),Qv.update($,Vv,n,Xv.camYaw);let r=window.innerWidth,i=window.innerHeight,a=Bv;$v.update($,(e,t,n)=>a.toScreen(e,t,n,r,i),a.camera.position);let o=performance.now();Lv.render(Bv.scene,Bv.camera),ky.render=ky.render*.9+(performance.now()-o)*.1,ky.total=ky.total*.9+(performance.now()-e)*.1}var ky={total:0,render:0};requestAnimationFrame(Oy);var Ay={get state(){return $},get mode(){return zv},get playerId(){return Vv},get input(){return Xv},get look(){return _y.look},get view(){return Bv},start(e=_y.look){by(e)},setSeed(e){Yv=e},startLevel(e,t=_y.look){by(t,e)},openGates(){$&&Je($)},startRace(){$&&(Ye($),wy(),Xv.camYaw=0)},raceFinish(){$&&(Xe($),Ay.tick())},get raceState(){return $?.race},get raceCourse(){return $?Ke($)?.course??null:null},showCreator:yy,pickPart(e,t){_y.setPart(e,t)},heroStats(e=_y.look){return lg(e)},slots:og,renderInfo(){return{...Lv.info.render,geometries:Lv.info.memory.geometries,pixelRatio:Lv.getPixelRatio(),cpuTotalMs:+ky.total.toFixed(2),cpuRenderMs:+ky.render.toFixed(2),fps:Rv.fps}},setPaused(e){Wv=e},setClassic(e){kv(e)},teleportTo(e){let t=Ve($?.level??1).mission,n=(t.hint??t.liftOnly??[])[0],r=n===void 0?null:t.partSpots[n],i=r?[r.x,r.y-.9,r.z+($?.level===3?1.6:0)]:null,a={elevator:[rt.liftX,$?.elevator.y??.26,-26],pool:[24.5,rt.roof,-28.1],spa:[27.755,rt.roof,-28.21],garage:[t.garage.x,0,t.garage.z],hidden:i,battery:i},o=$?.players[0];if(o?.riding!=null&&$){let e=$.vehicles.find(e=>e.id===o.riding);e&&(e.rider=null),o.riding=null}let s=a[e];s&&Ay.teleport(s[0],s[1],s[2])},teleport(e,t,n){let r=$?.players[0];r&&(r.pos={x:e,y:t,z:n},r.vel={x:0,y:0,z:0},r.grounded=!1)},setCamera(e,t=Xv.camPitch){Xv.camYaw=e,Xv.camPitch=t},fire(e=`sticky`,t=Xv.camYaw){let n=$?.players[0];$&&n&&zg($,n,e,t)},place(e=Xv.camYaw){let t=$?.players[0];return $&&t?Gg($,t,e,Fg($)):!1},tick(e=1,t={}){for(let n=0;n<e;n++)Sy({...We(Xv.camYaw),...t})},reach(){if(!$)return[];let e=Ve($.level),t=e.mission.liftOnly??[],n=W_(Fg($),$.world.half,e.spawn,e.mission.partSpots).map(e=>e!==null);if(!t.length)return n;let r=$.elevator.y;$.elevator.y=rt.mid;let i=W_(Fg($),$.world.half,{x:rt.liftX,y:rt.mid,z:rt.z},e.mission.partSpots);return $.elevator.y=r,n.map((e,n)=>t.includes(n)?!e&&i[n]!==null:e)},collectAll(){if(!$)return;for(let e of $.pickups)e.status===`world`&&(Ay.teleport(e.pos.x,e.pos.y-.9,e.pos.z),Ay.tick(1));let e=$.garages[0];Ay.teleport(e.x,0,e.z),Ay.tick(2)},interact(){Ay.tick(1,{interact:!0})}};window.__game=Ay;