(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{100:function(e,t,i){"use strict";i.r(t),i.d(t,"default",function(){return S});var a=i(1),n=i.n(a),s=i(3),r=i(8),l=i(9),c=i(16),o=i(15),h=i(17),u=i(0),d=i.n(u),m=i(6),v=i(10),g=i(27),f=i(20),p=(i(93),i(59),i(73)),b=i.n(p),w=i(66),C=i(60),E=i(67),I=i(22),S=function(e){function t(e){var i;return Object(r.a)(this,t),(i=Object(c.a)(this,Object(o.a)(t).call(this,e))).keepUpdating=!0,i.canvas=void 0,i.context2D=void 0,i.game=void 0,i.stats=void 0,i.pieceRenderer=void 0,i.playAgain=Object(s.a)(n.a.mark(function e(){var t,a,s,r,l,c;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=i.game,a=t.difficulty,s=t.width,r=t.height,l=t.bombs,e.next=3,g.a.Create(a,s,r,l);case 3:c=e.sent,i.setState({gameId:c.id});case 5:case"end":return e.stop()}},e)})),i.draw=function(e){var t=e-i.state.lastFrame;i.pieceRenderer.update(t),i.context2D.fillStyle="#333",i.context2D.fillRect(0,0,i.state.dimentions,i.state.dimentions),i.pieceRenderer.drawPlaceHolder(i.context2D,0,0),i.keepUpdating&&i.setState({rafId:requestAnimationFrame(i.draw),lastFrame:e})},i.state={loading:!0,dimentions:0,winningText:""},i}return Object(h.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=Object(s.a)(n.a.mark(function e(){var t,i,a;return n.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.a.GetById(this.props.match.params.id);case 2:return this.game=e.sent,e.next=5,I.a.GetStats(this.game.difficulty);case 5:this.stats=e.sent,t={defaultCellSize:120,gridGapSize:5,spinningCubes:7,simpleRender:!1,vibration:!1,timestamp:new Date},i=!1,a="You win!",Math.floor(this.game.time)>=this.stats.worstTime&&(a="New Low Score!",0===Math.floor(this.game.time)?(i=!0,this.stats.worstTime=1):this.stats.worstTime=Math.floor(this.game.time)),(Math.floor(this.game.time)<=this.stats.bestTime||0===this.stats.bestTime)&&(a="New High Score!",0===Math.floor(this.game.time)?(i=!0,this.stats.bestTime=1):this.stats.bestTime=Math.floor(this.game.time)),i&&(this.game.time=1),this.setState({loading:!1,winningText:a,moves:this.game.totalMoves,time:this.game.time,difficulty:this.game.difficulty,lastFrame:0,dimentions:t.defaultCellSize+1}),this.canvas=document.getElementById("piece-canvas"),this.context2D=this.canvas.getContext("2d"),this.pieceRenderer=new w.a(t),requestAnimationFrame(this.draw);case 17:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"componentWillUnmount",value:function(){this.game&&this.game.logAndDestroy(),this.state.rafId&&cancelAnimationFrame(this.state.rafId),this.keepUpdating=!1}},{key:"render",value:function(){if(this.state.loading)return d.a.createElement(f.a,null);if(this.state.gameId)return d.a.createElement(m.a,{to:"/game/".concat(this.state.gameId)});var e=this.game,t=e.difficulty,i=e.bombs,a=e.width,n=e.height;return d.a.createElement("div",{className:"game-won"},d.a.createElement("canvas",{id:"piece-canvas",width:this.state.dimentions,height:this.state.dimentions},"This Device doesn't support the canvas element!"),d.a.createElement("div",{className:"game-won--statement"},this.state.winningText),d.a.createElement("div",{className:"game-won--statement"},t," (",a,"x",n,":",i,")"),d.a.createElement("div",{className:"divider"}),d.a.createElement("ul",{className:"game-won__stats"},d.a.createElement("li",{className:"game-won__stats__item"},d.a.createElement("span",null,"Moves"),d.a.createElement("br",null),d.a.createElement("span",null,this.state.moves)),d.a.createElement("li",{className:"game-won__stats__item"},d.a.createElement("span",null,"Score"),d.a.createElement("br",null),d.a.createElement("span",null,Object(E.a)(this.state.time))),d.a.createElement("li",{className:"game-won__stats__item--icon"},d.a.createElement("img",{src:b.a,alt:"watch"})),d.a.createElement("li",{className:"game-won__stats__item"},d.a.createElement("span",null,"Best"),d.a.createElement("br",null),d.a.createElement("span",null,Object(E.a)(this.stats.bestTime))),d.a.createElement("li",{className:"game-won__stats__item"},d.a.createElement("span",null,"Worst"),d.a.createElement("br",null),d.a.createElement("span",null,Object(E.a)(this.stats.worstTime)))),d.a.createElement("div",{className:"divider"}),d.a.createElement("div",{className:"game-won__options"},d.a.createElement(C.a,{className:"game-won__options__item link-button",type:"button",text:"Play Again",onClick:this.playAgain}),d.a.createElement(v.b,{className:"game-won__options__item link-button",to:"/"},"Main Menu")))}}]),t}(u.Component)},59:function(e,t,i){},60:function(e,t,i){"use strict";var a=i(0),n=i.n(a);i(59);t.a=function(e){var t=e.type,i=e.disabled,a=e.className,s=e.text,r=e.onClick,l=i?"button disabled":"button",c=a?"".concat(a," ").concat(l):l;return r?n.a.createElement("button",{className:c,disabled:i,type:t,onClick:r},s):n.a.createElement("button",{className:c,disabled:i,type:t},s)}},62:function(e,t,i){"use strict";i.d(t,"a",function(){return a}),i.d(t,"b",function(){return r});var a,n=i(8),s=i(9);!function(e){e[e.REPEAT=0]="REPEAT",e[e.ALTERNATE=1]="ALTERNATE",e[e.STOP=2]="STOP"}(a||(a={}));var r=function(){function e(t,i){var s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:a.STOP;Object(n.a)(this,e),this.playing=void 0,this.timer=0,this.target=void 0,this.step=void 0,this.loop=void 0,this.alternated=void 0,this.timer=0,this.target=t,this.step=i,this.loop=s,this.alternated=!1,this.playing=!0}return Object(s.a)(e,[{key:"update",value:function(e){!this.isComplete()&&this.playing?this.timer+=this.step:this.loop===a.REPEAT?this.timer=this.timer%this.target:this.loop===a.ALTERNATE?(this.setStep(-1*this.step),this.alternated?this.timer=this.target:this.timer=0):this.loop===a.STOP&&(this.timer=this.target,this.stop())}},{key:"stop",value:function(){this.playing=!1}},{key:"play",value:function(){this.playing=!0}},{key:"getValue",value:function(){return this.timer}},{key:"setTarget",value:function(e){this.target=e}},{key:"setStep",value:function(e){this.alternated=e<0,this.step=e}},{key:"isComplete",value:function(){return this.alternated?this.timer<=0:this.timer>=this.target}}]),e}()},63:function(e,t,i){"use strict";var a;i.d(t,"b",function(){return a}),i.d(t,"g",function(){return s}),i.d(t,"e",function(){return r}),i.d(t,"f",function(){return l}),i.d(t,"a",function(){return n}),i.d(t,"c",function(){return c}),i.d(t,"d",function(){return o}),function(e){e[e.INVISIBLE=0]="INVISIBLE",e[e.VISIBLE=1]="VISIBLE",e[e.VISIBLY_SATISFIED=2]="VISIBLY_SATISFIED",e[e.MARKED=3]="MARKED"}(a||(a={}));var n,s=function(e){return e===a.VISIBLE||e===a.VISIBLY_SATISFIED},r=function(e){return e===a.MARKED||e===a.INVISIBLE},l=function(e){return e.visibility===a.MARKED};!function(e){e[e.BOMB=0]="BOMB",e[e.CLEAN=1]="CLEAN"}(n||(n={}));var c=function(e){switch(e){case 0:return 1;case 1:return 2;case 2:return 3;case 3:return 4;case 4:return 5;case 5:return 6;case 6:return 7;case 7:case 8:return 8;default:return null}},o=function(e){return null===e||void 0===e}},64:function(e,t,i){"use strict";function a(e,t){return Math.floor(Math.random()*t)+e}i.d(t,"a",function(){return a})},66:function(e,t,i){"use strict";i.d(t,"a",function(){return c});var a=i(8),n=i(9),s=i(62),r=i(63),l=i(64),c=function(){function e(t){Object(a.a)(this,e),this.invisiblePieceCanvas=void 0,this.invisibleMarkedPieceCanvas=void 0,this.staticPieceCanvas=[],this.pieceAnimations=[],this.pieceLength=void 0,this.gapSize=void 0,this.simpleRender=void 0,this.exampleCellValue=Object(l.a)(0,8),this.pieceLength=t.defaultCellSize,this.gapSize=t.gridGapSize,this.simpleRender=t.simpleRender,this.setSpinningCubes(t.spinningCubes),this.invisiblePieceCanvas=document.createElement("canvas"),this.invisiblePieceCanvas.height=this.pieceLength+2,this.invisiblePieceCanvas.width=this.pieceLength+2,this.drawInvisiblePiece(this.invisiblePieceCanvas.getContext("2d"),1,1),this.invisibleMarkedPieceCanvas=document.createElement("canvas"),this.invisibleMarkedPieceCanvas.height=this.pieceLength+2,this.invisibleMarkedPieceCanvas.width=this.pieceLength+2,this.drawInvisiblePiece(this.invisibleMarkedPieceCanvas.getContext("2d"),1,1,"#3396ff");for(var i=0;i<18;i++){this.staticPieceCanvas[i]=document.createElement("canvas"),this.staticPieceCanvas[i].width=this.pieceLength+2,this.staticPieceCanvas[i].height=this.pieceLength+2;var n=this.staticPieceCanvas[i].getContext("2d");if(i<8)this.drawVisibleCell(n,1,1.5,i+1);else if(i<16){var s=i%8+1;this.drawVisibleCell(n,1,1.5,s,"#3396ff")}else i<17?this.drawVisibleCell(n,1,1.5,0):this.drawVisibleCell(n,1,1.5,void 0)}}return Object(n.a)(e,[{key:"setCellSize",value:function(e){this.pieceLength=e,this.invisiblePieceCanvas.height=e,this.invisiblePieceCanvas.width=e,this.invisibleMarkedPieceCanvas.height=e,this.invisibleMarkedPieceCanvas.width=e;for(var t=0;t<18;t++){this.staticPieceCanvas[t].width=e,this.staticPieceCanvas[t].height=e;var i=this.staticPieceCanvas[t].getContext("2d");if(t<8)this.drawVisibleCell(i,0,0,t+1);else if(t<16){var a=t%8+1;this.drawVisibleCell(i,0,0,a,"#3396ff")}else t<17?this.drawVisibleCell(i,0,0,0):this.drawVisibleCell(i,0,0,void 0)}}},{key:"setGapSize",value:function(e){this.gapSize=e}},{key:"setSpinningCubes",value:function(e){this.pieceAnimations=[];for(var t=e+1;t>=1;t--)this.pieceAnimations.push(new s.b(90*t,Math.pow(t+1,.035*t)-1,s.a.ALTERNATE))}},{key:"setSimpleRender",value:function(e){this.simpleRender=e}},{key:"update",value:function(e){if(!this.simpleRender){for(var t=0;t<this.pieceAnimations.length;t++)this.pieceAnimations[t].update(e);var i=this.invisiblePieceCanvas.getContext("2d"),a=this.invisibleMarkedPieceCanvas.getContext("2d");i.clearRect(0,0,this.pieceLength,this.pieceLength),a.clearRect(0,0,this.pieceLength,this.pieceLength),this.drawInvisiblePiece(i,1,1),this.drawInvisiblePiece(a,1,1,"#3396ff")}}},{key:"drawPlaceHolder",value:function(e,t,i){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:r.b.INVISIBLE;switch(e.save(),a){case r.b.INVISIBLE:this.drawInvisiblePiece(e,t,i);break;case r.b.MARKED:this.drawInvisiblePiece(e,t,i,"#3396ff");break;case r.b.VISIBLE:this.drawVisibleCell(e,t,i,this.exampleCellValue);break;case r.b.VISIBLY_SATISFIED:this.drawVisibleCell(e,t,i,this.exampleCellValue,"#3396ff")}e.restore()}},{key:"drawPiece",value:function(e,t,i,a){if(t.visibility===r.b.INVISIBLE)e.drawImage(this.invisiblePieceCanvas,i,a),t.hover&&this.drawHover(e,i+1,a+1);else if(t.visibility===r.b.MARKED)e.drawImage(this.invisibleMarkedPieceCanvas,i,a);else{var n=this.getIndexByCell(t);e.drawImage(this.staticPieceCanvas[n],i,a)}}},{key:"getIndexByCell",value:function(e){return Object(r.d)(e.value)?17:0===e.value?16:e.visibility===r.b.VISIBLY_SATISFIED?e.value-1+8:e.value-1}},{key:"drawInvisiblePiece",value:function(e,t,i,a){if(e.save(),e.beginPath(),e.strokeStyle=a||"#FFF",this.drawRectangle(e,t,i,this.pieceLength/8,this.pieceLength),e.lineWidth=2,e.stroke(),e.closePath(),e.restore(),!this.simpleRender){e.save();for(var n=this.pieceLength,s=0,r=1;r<this.pieceAnimations.length;r++){var l=r%2===0?1:-1;this.drawRotatingSquare(e,s+t,s+i,n,r,l,a),s+=n/4/2,n=n/4*3}e.restore()}}},{key:"drawRotatingSquare",value:function(e,t,i,a,n,s,r){var l=a/8,c=a/2+2*l,o=t+a/4-l,h=i+a/4-l;e.save(),e.beginPath(),e.translate(o+c/2,h+c/2),e.rotate(this.pieceAnimations[n].getValue()*Math.PI/180),e.translate(-1*(o+c/2),-1*(h+c/2)),this.drawRectangle(e,o,h,l,c),e.lineWidth=2,e.strokeStyle=r||"gray",e.closePath(),e.stroke(),e.restore()}},{key:"drawRectangle",value:function(e,t,i,a,n){e.moveTo(t+a,i),e.lineTo(t+n-a,i),e.quadraticCurveTo(t+n,i,t+n,i+a),e.lineTo(t+n,i+n-a),e.quadraticCurveTo(t+n,i+n,t+n-a,i+n),e.lineTo(t+a,i+n),e.quadraticCurveTo(t,i+n,t,i+n-a),e.lineTo(t,i+a),e.quadraticCurveTo(t,i,t+a,i)}},{key:"drawHover",value:function(e,t,i){e.save();for(var a=1,n=1;n<=this.gapSize/2;n++)e.beginPath(),e.strokeStyle="rgba(255,255,255, ".concat(a,")"),this.drawRectangle(e,t-n,i-n,this.pieceLength/8,this.pieceLength+2*n),n+1>=this.gapSize/2?e.lineWidth=1:e.lineWidth=2,a-=.1,e.stroke(),e.closePath();e.restore()}},{key:"drawVisibleCell",value:function(e,t,i,a,n){e.save(),e.beginPath();var s=this.pieceLength;if(Object(r.d)(a)){e.save(),e.beginPath(),e.arc(t+s/2,i+s/2,s/2,0,2*Math.PI),e.strokeStyle="#690721",e.lineWidth=4,e.stroke(),e.closePath(),e.restore(),e.save(),e.beginPath(),s-=6,e.arc(t+3+s/2,i+3+s/2,s/2,0,2*Math.PI),e.strokeStyle="#f00f4b",e.lineWidth=3;var l=t+s/2,c=i+s/2,o=e.createRadialGradient(l,c,this.pieceLength/6,l,c,this.pieceLength/2);o.addColorStop(0,"#333"),o.addColorStop(1,"#690721"),e.fillStyle=o,e.fill(),e.stroke(),e.closePath(),e.restore()}else if(0===a)this.drawRectangle(e,t,i,this.pieceLength/8,this.pieceLength),e.lineWidth=3,e.strokeStyle="gray";else{n?(e.fillStyle=n,e.strokeStyle=n):(e.fillStyle="#FFFFFF",e.strokeStyle="#FFFFFF"),e.font="normal ".concat(this.pieceLength,"px sans-serif");var h=this.pieceLength/2+2,u=i+this.pieceLength/2+h,d=t+this.pieceLength/2;e.textAlign="center",e.textBaseline="bottom",e.arc(t+s/2,i+s/2,s/2,0,2*Math.PI),e.lineWidth=2,e.fillText(String(a),d,u)}e.closePath(),e.stroke(),e.restore()}}]),e}()},67:function(e,t,i){"use strict";function a(e){e=Math.floor(e);var t=Math.floor(e/3600),i=Math.floor((e-3600*t)/60),a=e-3600*t-60*i,n="";return t>0&&(n+=t<10?"0".concat(t,":"):"".concat(t,":")),n+=i<10?"0".concat(i,":"):"".concat(i,":"),n+=a<10?"0".concat(a):"".concat(a)}i.d(t,"a",function(){return a})},73:function(e,t,i){e.exports=i.p+"static/media/hourglass.63a5448b.svg"},93:function(e,t,i){}}]);
//# sourceMappingURL=6.17828aff.chunk.js.map