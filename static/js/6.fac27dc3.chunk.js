(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{59:function(e,t,i){},60:function(e,t,i){"use strict";var a=i(0),s=i.n(a);i(59);t.a=function(e){var t=e.type,i=e.disabled,a=e.className,n=e.text,r=e.onClick,l=i?"button disabled":"button",c=a?"".concat(a," ").concat(l):l;return r?s.a.createElement("button",{className:c,disabled:i,type:t,onClick:r},n):s.a.createElement("button",{className:c,disabled:i,type:t},n)}},61:function(e,t,i){"use strict";i.d(t,"a",function(){return a}),i.d(t,"b",function(){return r});var a,s=i(8),n=i(9);!function(e){e[e.REPEAT=0]="REPEAT",e[e.ALTERNATE=1]="ALTERNATE",e[e.STOP=2]="STOP"}(a||(a={}));var r=function(){function e(t,i){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:a.STOP;Object(s.a)(this,e),this.playing=void 0,this.timer=0,this.target=void 0,this.step=void 0,this.loop=void 0,this.alternated=void 0,this.timer=0,this.target=t,this.step=i,this.loop=n,this.alternated=!1,this.playing=!0}return Object(n.a)(e,[{key:"update",value:function(e){!this.isComplete()&&this.playing?this.timer+=this.step:this.loop===a.REPEAT?this.timer=this.timer%this.target:this.loop===a.ALTERNATE?(this.setStep(-1*this.step),this.alternated?this.timer=this.target:this.timer=0):this.loop===a.STOP&&(this.timer=this.target,this.stop())}},{key:"stop",value:function(){this.playing=!1}},{key:"play",value:function(){this.playing=!0}},{key:"getValue",value:function(){return this.timer}},{key:"setTarget",value:function(e){this.target=e}},{key:"setStep",value:function(e){this.alternated=e<0,this.step=e}},{key:"isComplete",value:function(){return this.alternated?this.timer<=0:this.timer>=this.target}}]),e}()},62:function(e,t,i){"use strict";var a;i.d(t,"b",function(){return a}),i.d(t,"f",function(){return n}),i.d(t,"d",function(){return r}),i.d(t,"e",function(){return l}),i.d(t,"a",function(){return s}),i.d(t,"c",function(){return c}),function(e){e[e.INVISIBLE=0]="INVISIBLE",e[e.VISIBLE=1]="VISIBLE",e[e.VISIBLY_SATISFIED=2]="VISIBLY_SATISFIED",e[e.MARKED=3]="MARKED"}(a||(a={}));var s,n=function(e){return e===a.VISIBLE||e===a.VISIBLY_SATISFIED},r=function(e){return e===a.MARKED||e===a.INVISIBLE},l=function(e){return e.visibility===a.MARKED};!function(e){e[e.BOMB=0]="BOMB",e[e.CLEAN=1]="CLEAN"}(s||(s={}));var c=function(e){return null===e||void 0===e}},64:function(e,t,i){"use strict";function a(e){e=Math.floor(e);var t=Math.floor(e/3600),i=Math.floor((e-3600*t)/60),a=e-3600*t-60*i,s="";return t>0&&(s+=t<10?"0".concat(t):"".concat(t)),s+=i<10?"0".concat(i,":"):"".concat(i,":"),s+=a<10?"0".concat(a):"".concat(a)}i.d(t,"a",function(){return a})},65:function(e,t,i){"use strict";var a=i(8),s=i(9),n=i(61),r=i(62);i.d(t,"a",function(){return l});var l=function(){function e(t){var i,s;Object(a.a)(this,e),this.invisiblePieceCanvas=void 0,this.invisibleMarkedPieceCanvas=void 0,this.staticPieceCanvas=[],this.pieceAnimations=[],this.pieceLength=void 0,this.gapSize=void 0,this.simpleRender=void 0,this.exampleCellValue=(i=0,s=8,Math.floor(Math.random()*s)+i),this.pieceLength=t.defaultCellSize,this.gapSize=t.gridGapSize,this.simpleRender=t.simpleRender,this.setSpinningCubes(t.spinningCubes),this.invisiblePieceCanvas=document.createElement("canvas"),this.invisiblePieceCanvas.height=this.pieceLength+2,this.invisiblePieceCanvas.width=this.pieceLength+2,this.drawInvisiblePiece(this.invisiblePieceCanvas.getContext("2d"),1,1),this.invisibleMarkedPieceCanvas=document.createElement("canvas"),this.invisibleMarkedPieceCanvas.height=this.pieceLength+2,this.invisibleMarkedPieceCanvas.width=this.pieceLength+2,this.drawInvisiblePiece(this.invisibleMarkedPieceCanvas.getContext("2d"),1,1,"#3396ff");for(var n=0;n<18;n++){this.staticPieceCanvas[n]=document.createElement("canvas"),this.staticPieceCanvas[n].width=this.pieceLength+2,this.staticPieceCanvas[n].height=this.pieceLength+2;var r=this.staticPieceCanvas[n].getContext("2d");if(n<8)this.drawVisibleCell(r,1,1.5,n+1);else if(n<16){var l=n%8+1;this.drawVisibleCell(r,1,1.5,l,"#3396ff")}else n<17?this.drawVisibleCell(r,1,1.5,0):this.drawVisibleCell(r,1,1.5,void 0)}}return Object(s.a)(e,[{key:"setCellSize",value:function(e){this.pieceLength=e,this.invisiblePieceCanvas.height=e,this.invisiblePieceCanvas.width=e,this.invisibleMarkedPieceCanvas.height=e,this.invisibleMarkedPieceCanvas.width=e;for(var t=0;t<18;t++){this.staticPieceCanvas[t].width=e,this.staticPieceCanvas[t].height=e;var i=this.staticPieceCanvas[t].getContext("2d");if(t<8)this.drawVisibleCell(i,0,0,t+1);else if(t<16){var a=t%8+1;this.drawVisibleCell(i,0,0,a,"#3396ff")}else t<17?this.drawVisibleCell(i,0,0,0):this.drawVisibleCell(i,0,0,void 0)}}},{key:"setGapSize",value:function(e){this.gapSize=e}},{key:"setSpinningCubes",value:function(e){this.pieceAnimations=[];for(var t=e+1;t>=1;t--)this.pieceAnimations.push(new n.b(90*t,Math.pow(t+1,.035*t)-1,n.a.ALTERNATE))}},{key:"setSimpleRender",value:function(e){this.simpleRender=e}},{key:"update",value:function(e){if(!this.simpleRender){for(var t=0;t<this.pieceAnimations.length;t++)this.pieceAnimations[t].update(e);var i=this.invisiblePieceCanvas.getContext("2d"),a=this.invisibleMarkedPieceCanvas.getContext("2d");i.clearRect(0,0,this.pieceLength,this.pieceLength),a.clearRect(0,0,this.pieceLength,this.pieceLength),this.drawInvisiblePiece(i,1,1),this.drawInvisiblePiece(a,1,1,"#3396ff")}}},{key:"drawPlaceHolder",value:function(e,t,i){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:r.b.INVISIBLE;switch(e.save(),a){case r.b.INVISIBLE:this.drawInvisiblePiece(e,t,i);break;case r.b.MARKED:this.drawInvisiblePiece(e,t,i,"#3396ff");break;case r.b.VISIBLE:this.drawVisibleCell(e,t,i,this.exampleCellValue);break;case r.b.VISIBLY_SATISFIED:this.drawVisibleCell(e,t,i,this.exampleCellValue,"#3396ff")}e.restore()}},{key:"drawPiece",value:function(e,t,i,a){if(t.visibility===r.b.INVISIBLE)e.drawImage(this.invisiblePieceCanvas,i,a),t.hover&&this.drawHover(e,i+1,a+1);else if(t.visibility===r.b.MARKED)e.drawImage(this.invisibleMarkedPieceCanvas,i,a);else{var s=this.getIndexByCell(t);e.drawImage(this.staticPieceCanvas[s],i,a)}}},{key:"getIndexByCell",value:function(e){return Object(r.c)(e.value)?17:0===e.value?16:e.visibility===r.b.VISIBLY_SATISFIED?e.value-1+8:e.value-1}},{key:"drawInvisiblePiece",value:function(e,t,i,a){if(e.save(),e.beginPath(),e.strokeStyle=a||"#FFF",this.drawRectangle(e,t,i,this.pieceLength/8,this.pieceLength),e.lineWidth=2,e.stroke(),e.closePath(),e.restore(),!this.simpleRender){e.save();for(var s=this.pieceLength,n=0,r=1;r<this.pieceAnimations.length;r++){var l=r%2===0?1:-1;this.drawRotatingSquare(e,n+t,n+i,s,r,l,a),n+=s/4/2,s=s/4*3}e.restore()}}},{key:"drawRotatingSquare",value:function(e,t,i,a,s,n,r){var l=a/8,c=a/2+2*l,o=t+a/4-l,h=i+a/4-l;e.save(),e.beginPath(),e.translate(o+c/2,h+c/2),e.rotate(this.pieceAnimations[s].getValue()*Math.PI/180),e.translate(-1*(o+c/2),-1*(h+c/2)),this.drawRectangle(e,o,h,l,c),e.lineWidth=2,e.strokeStyle=r||"gray",e.closePath(),e.stroke(),e.restore()}},{key:"drawRectangle",value:function(e,t,i,a,s){e.moveTo(t+a,i),e.lineTo(t+s-a,i),e.quadraticCurveTo(t+s,i,t+s,i+a),e.lineTo(t+s,i+s-a),e.quadraticCurveTo(t+s,i+s,t+s-a,i+s),e.lineTo(t+a,i+s),e.quadraticCurveTo(t,i+s,t,i+s-a),e.lineTo(t,i+a),e.quadraticCurveTo(t,i,t+a,i)}},{key:"drawHover",value:function(e,t,i){e.save();for(var a=1,s=1;s<=this.gapSize/2;s++)e.beginPath(),e.strokeStyle="rgba(255,255,255, ".concat(a,")"),this.drawRectangle(e,t-s,i-s,this.pieceLength/8,this.pieceLength+2*s),s+1>=this.gapSize/2?e.lineWidth=1:e.lineWidth=2,a-=.1,e.stroke(),e.closePath();e.restore()}},{key:"drawVisibleCell",value:function(e,t,i,a,s){e.save(),e.beginPath();var n=this.pieceLength;if(Object(r.c)(a)){e.save(),e.beginPath(),e.arc(t+n/2,i+n/2,n/2,0,2*Math.PI),e.strokeStyle="#690721",e.lineWidth=4,e.stroke(),e.closePath(),e.restore(),e.save(),e.beginPath(),n-=6,e.arc(t+3+n/2,i+3+n/2,n/2,0,2*Math.PI),e.strokeStyle="#f00f4b",e.lineWidth=3;var l=t+n/2,c=i+n/2,o=e.createRadialGradient(l,c,this.pieceLength/6,l,c,this.pieceLength/2);o.addColorStop(0,"#333"),o.addColorStop(1,"#690721"),e.fillStyle=o,e.fill(),e.stroke(),e.closePath(),e.restore()}else if(0===a)this.drawRectangle(e,t,i,this.pieceLength/8,this.pieceLength),e.lineWidth=3,e.strokeStyle="gray";else{s?(e.fillStyle=s,e.strokeStyle=s):(e.fillStyle="#FFFFFF",e.strokeStyle="#FFFFFF"),e.font="normal ".concat(this.pieceLength,"px sans-serif");var h=this.pieceLength/2+2,d=i+this.pieceLength/2+h,u=t+this.pieceLength/2;e.textAlign="center",e.textBaseline="bottom",e.arc(t+n/2,i+n/2,n/2,0,2*Math.PI),e.lineWidth=2,e.fillText(String(a),u,d)}e.closePath(),e.stroke(),e.restore()}}]),e}()},71:function(e,t,i){e.exports=i.p+"static/media/hourglass.63a5448b.svg"},91:function(e,t,i){},98:function(e,t,i){"use strict";i.r(t),i.d(t,"default",function(){return S});var a=i(1),s=i.n(a),n=i(3),r=i(8),l=i(9),c=i(16),o=i(15),h=i(17),d=i(0),u=i.n(d),m=i(6),v=i(10),g=i(27),p=i(20),f=(i(91),i(59),i(71)),b=i.n(f),w=i(65),C=i(60),E=i(64),I=i(22),S=function(e){function t(e){var i;return Object(r.a)(this,t),(i=Object(c.a)(this,Object(o.a)(t).call(this,e))).keepUpdating=!0,i.canvas=void 0,i.context2D=void 0,i.game=void 0,i.stats=void 0,i.pieceRenderer=void 0,i.playAgain=Object(n.a)(s.a.mark(function e(){var t,a,n,r,l,c;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=i.game,a=t.difficulty,n=t.width,r=t.height,l=t.bombs,e.next=3,g.a.Create(a,n,r,l);case 3:c=e.sent,i.setState({gameId:c.id});case 5:case"end":return e.stop()}},e)})),i.draw=function(e){var t=e-i.state.lastFrame;i.pieceRenderer.update(t),i.context2D.fillStyle="#333",i.context2D.fillRect(0,0,i.state.dimentions,i.state.dimentions),i.pieceRenderer.drawPlaceHolder(i.context2D,0,0),i.keepUpdating&&i.setState({rafId:requestAnimationFrame(i.draw),lastFrame:e})},i.state={loading:!0,dimentions:0,winningText:""},i}return Object(h.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=Object(n.a)(s.a.mark(function e(){var t,i,a;return s.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.a.GetById(this.props.match.params.id);case 2:return this.game=e.sent,e.next=5,I.a.GetStats(this.game.difficulty);case 5:this.stats=e.sent,t={defaultCellSize:120,gridGapSize:5,spinningCubes:7,simpleRender:!1,vibration:!1,timestamp:new Date},i=!1,a="You win!",Math.floor(this.game.time)>=this.stats.worstTime&&(a="New Low Score!",0===Math.floor(this.game.time)?(i=!0,this.stats.worstTime=1):this.stats.worstTime=Math.floor(this.game.time)),(Math.floor(this.game.time)<=this.stats.bestTime||0===this.stats.bestTime)&&(a="New High Score!",0===Math.floor(this.game.time)?(i=!0,this.stats.bestTime=1):this.stats.bestTime=Math.floor(this.game.time)),i&&(this.game.time=1),this.setState({loading:!1,winningText:a,moves:this.game.totalMoves,time:this.game.time,difficulty:this.game.difficulty,lastFrame:0,dimentions:t.defaultCellSize+1}),this.canvas=document.getElementById("piece-canvas"),this.context2D=this.canvas.getContext("2d"),this.pieceRenderer=new w.a(t),requestAnimationFrame(this.draw);case 17:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"componentWillUnmount",value:function(){this.game&&this.game.logAndDestroy(),this.state.rafId&&cancelAnimationFrame(this.state.rafId),this.keepUpdating=!1}},{key:"render",value:function(){if(this.state.loading)return u.a.createElement(p.a,null);if(this.state.gameId)return u.a.createElement(m.a,{to:"/game/".concat(this.state.gameId)});var e=this.game,t=e.difficulty,i=e.bombs,a=e.width,s=e.height;return u.a.createElement("div",{className:"game-won"},u.a.createElement("canvas",{id:"piece-canvas",width:this.state.dimentions,height:this.state.dimentions},"This Device doesn't support the canvas element!"),u.a.createElement("div",{className:"game-won--statement"},this.state.winningText),u.a.createElement("div",{className:"game-won--statement"},t," (",a,"x",s,":",i,")"),u.a.createElement("div",{className:"divider"}),u.a.createElement("ul",{className:"game-won__stats"},u.a.createElement("li",{className:"game-won__stats__item"},u.a.createElement("span",null,"Moves"),u.a.createElement("br",null),u.a.createElement("span",null,this.state.moves)),u.a.createElement("li",{className:"game-won__stats__item"},u.a.createElement("span",null,"Score"),u.a.createElement("br",null),u.a.createElement("span",null,Object(E.a)(this.state.time))),u.a.createElement("li",{className:"game-won__stats__item--icon"},u.a.createElement("img",{src:b.a,alt:"watch"})),u.a.createElement("li",{className:"game-won__stats__item"},u.a.createElement("span",null,"Best"),u.a.createElement("br",null),u.a.createElement("span",null,Object(E.a)(this.stats.bestTime))),u.a.createElement("li",{className:"game-won__stats__item"},u.a.createElement("span",null,"Worst"),u.a.createElement("br",null),u.a.createElement("span",null,Object(E.a)(this.stats.worstTime)))),u.a.createElement("div",{className:"divider"}),u.a.createElement("div",{className:"game-won__options"},u.a.createElement(C.a,{className:"game-won__options__item link-button",type:"button",text:"Play Again",onClick:this.playAgain}),u.a.createElement(v.b,{className:"game-won__options__item link-button",to:"/"},"Main Menu")))}}]),t}(d.Component)}}]);
//# sourceMappingURL=6.fac27dc3.chunk.js.map