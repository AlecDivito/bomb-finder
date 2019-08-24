(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{103:function(e,t,a){"use strict";a.r(t);var n=a(68),r=a(1),c=a.n(r),i=a(3),s=a(61),u=a(9),o=a(10),l=a(16),b=a(15),h=a(17),m=a(0),f=a.n(m),p=(a(69),function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(l.a)(this,Object(b.a)(t).call(this,e))).focus=function(){a.setState({focus:!0})},a.blur=function(){a.props.value||a.setState({focus:!1}),a.props.onBlur&&a.props.onBlur()},a.state={focus:!!e.value},a}return Object(h.a)(t,e),Object(o.a)(t,[{key:"render",value:function(){var e=this.props,t=e.type,a=e.name,n=e.text,r=e.value,c=e.error,i=e.onChange,s=this.state.focus,u=n||a,o="form-input ".concat(s?"focus":""),l=r||"";return f.a.createElement("div",{className:o},f.a.createElement("label",{htmlFor:a},u),f.a.createElement("input",{type:t,id:a,name:a,value:l,onChange:i,onFocus:this.focus,onBlur:this.blur,autoComplete:"off",required:!0}),c?f.a.createElement("span",{className:"error"},c):null)}}]),t}(f.a.Component)),d=(a(76),a(70)),v=a(60),g=a(6),O=a(27),j=a(65),w=a(20);function y(e){if(null===e)return!0;for(var t in e)if(Object.getOwnPropertyNames(e).includes(t))return!1;return!0}a.d(t,"default",function(){return k});var k=function(e){function t(){var e,a;Object(u.a)(this,t);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(a=Object(l.a)(this,(e=Object(b.a)(t)).call.apply(e,[this].concat(r)))).handleChange=function(e){var t,n=e.target;t="checkbox"===n.type?n.checked:"text"===n.type?n.value:parseInt(n.value,10);var r=n.name;a.setState(Object(s.a)({},r,t),a.validate)},a.validate=function(){var e=j.a.validate(a.state);a.setState({errors:e})},a.handleSubmit=function(){var e=Object(i.a)(c.a.mark(function e(t){var n,r,i,s,u,o,l;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),y(n=j.a.validate(a.state))){e.next=5;break}return a.setState({errors:n}),e.abrupt("return");case 5:if(!a.state.save){e.next=8;break}return e.next=8,j.a.save(a.state);case 8:return r=a.state,i=r.width,s=r.height,u=r.bombs,(o=r.name)||(o="custom (".concat(i,"x").concat(s,":").concat(u,")")),e.next=12,O.a.Create(o,i,s,u);case 12:l=e.sent,a.setState({gameId:l.id});case 14:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a}return Object(h.a)(t,e),Object(o.a)(t,[{key:"componentDidMount",value:function(){var e=Object.assign({},new j.a,{gameId:void 0,errors:{}});this.setState(Object(n.a)({},e))}},{key:"render",value:function(){return this.state?this.state.gameId?f.a.createElement(g.a,{to:"/game/".concat(this.state.gameId)}):f.a.createElement("div",{className:"custom"},f.a.createElement("h3",null,"Create New Game"),f.a.createElement("form",{className:"custom__form",onSubmit:this.handleSubmit},f.a.createElement("div",{className:"custom__form--inline"},f.a.createElement(p,{type:"number",name:"width",error:this.state.errors.width,value:this.state.width,onBlur:this.validate,onChange:this.handleChange}),f.a.createElement(p,{type:"number",name:"height",error:this.state.errors.height,value:this.state.height,onBlur:this.validate,onChange:this.handleChange})),f.a.createElement(p,{type:"number",name:"bombs",error:this.state.errors.bombs,value:this.state.bombs,onBlur:this.validate,onChange:this.handleChange}),f.a.createElement(d.a,{text:"Save Game Configuration",name:"save",checked:this.state.save,onChange:this.handleChange}),this.state.save?f.a.createElement(p,{type:"text",name:"name",error:this.state.errors.name,value:this.state.name,onBlur:this.validate,onChange:this.handleChange}):null,f.a.createElement(v.a,{type:"submit",disabled:!y(this.state.errors),text:"Start Game"}))):f.a.createElement(w.a,null)}}]),t}(f.a.Component)},59:function(e,t,a){},60:function(e,t,a){"use strict";var n=a(0),r=a.n(n);a(59);t.a=function(e){var t=e.type,a=e.disabled,n=e.className,c=e.text,i=e.onClick,s=a?"button disabled":"button",u=n?"".concat(n," ").concat(s):s;return i?r.a.createElement("button",{className:u,disabled:a,type:t,onClick:i},c):r.a.createElement("button",{className:u,disabled:a,type:t},c)}},61:function(e,t,a){"use strict";function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}a.d(t,"a",function(){return n})},65:function(e,t,a){"use strict";a.d(t,"a",function(){return B});var n,r,c,i,s,u,o,l,b,h,m,f,p,d,v,g,O,j=a(1),w=a.n(j),y=a(3),k=a(4),x=a(9),C=a(10),E=a(5),N=(a(26),a(2)),S=a(28),D=[{id:"00000000-0000-0000-0000-000000000001",name:"easy",width:8,height:8,bombs:10},{id:"00000000-0000-0000-0000-000000000002",name:"medium",width:16,height:16,bombs:40},{id:"00000000-0000-0000-0000-000000000003",name:"hard",width:24,height:24,bombs:99}],B=(n=Object(N.c)("cgc"),r=Object(N.a)("cgc",!0),c=Object(N.a)("cgc"),i=Object(N.a)("cgc"),s=Object(N.a)("cgc"),u=Object(N.a)("cgc"),o=Object(N.a)("cgc"),l=Object(N.a)("cgc"),n((h=function(){function e(){Object(x.a)(this,e),this.tableName="cgc",Object(k.a)(this,"id",m,this),Object(k.a)(this,"name",f,this),Object(k.a)(this,"width",p,this),Object(k.a)(this,"height",d,this),Object(k.a)(this,"bombs",v,this),Object(k.a)(this,"isDeleted",g,this),Object(k.a)(this,"createdAt",O,this),this.save=!1}return Object(C.a)(e,null,[{key:"save",value:function(){var t=Object(y.a)(w.a.mark(function t(a){var n;return w.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=Object.assign(new e,a,{id:Object(S.a)(),createdAt:new Date}),t.next=3,N.b.save(n);case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()},{key:"delete",value:function(){var t=Object(y.a)(w.a.mark(function t(a){var n;return w.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=Object.assign(new e,a),t.next=3,N.b.remove(n);case 3:return t.abrupt("return",t.sent);case 4:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()},{key:"getAll",value:function(){var t=Object(y.a)(w.a.mark(function t(){var a,n;return w.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,N.b.getAll(new e);case 2:if(a=t.sent,0!==a.filter(function(e){return/^[0]{8}-[0]{4}-[0]{4}-[0]{4}-[0]{11}[1-3]$/.test(e.id)}).length){t.next=11;break}return t.next=7,this.addDefaultTemplateGames();case 7:n=t.sent,a=n,t.next=12;break;case 11:a=a.filter(function(e){return!e.isDeleted});case 12:return t.abrupt("return",a);case 13:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}()},{key:"getById",value:function(){var t=Object(y.a)(w.a.mark(function t(a){return w.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,N.b.getById(new e,a);case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()},{key:"validate",value:function(e){var t={};return Object.keys(e).forEach(function(a){switch(a){case"width":case"height":e[a]>50?t[a]="".concat(a," is too high!"):e[a]<5&&(t[a]="".concat(a," is too low!"));break;case"bombs":e.bombs>e.width*e.height-1?t.bombs="Too many bombs! (Max: ".concat(e.width*e.height-1,")"):e.bombs<1&&(t.bombs="Too few bombs! (Min: 1)");break;case"name":e.save&&"string"===typeof e.name&&(e.name.length>16?t.name="Name is too long!":0===e.name.length&&(t.name="Name cannot be empty!"))}}),t}},{key:"addDefaultTemplateGames",value:function(){var t=Object(y.a)(w.a.mark(function t(){var a,n;return w.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:a=D.map(function(t){return Object.assign(new e,t)}),n=0;case 2:if(!(n<a.length)){t.next=8;break}return t.next=5,N.b.save(a[n]);case 5:n++,t.next=2;break;case 8:return t.abrupt("return",a);case 9:case"end":return t.stop()}},t)}));return function(){return t.apply(this,arguments)}}()}]),e}(),m=Object(E.a)(h.prototype,"id",[r],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return""}}),f=Object(E.a)(h.prototype,"name",[c],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){}}),p=Object(E.a)(h.prototype,"width",[i],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 8}}),d=Object(E.a)(h.prototype,"height",[s],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 8}}),v=Object(E.a)(h.prototype,"bombs",[u],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 10}}),g=Object(E.a)(h.prototype,"isDeleted",[o],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return!1}}),O=Object(E.a)(h.prototype,"createdAt",[l],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return new Date}}),b=h))||b)},68:function(e,t,a){"use strict";a.d(t,"a",function(){return r});var n=a(61);function r(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{},r=Object.keys(a);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(a).filter(function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable}))),r.forEach(function(t){Object(n.a)(e,t,a[t])})}return e}},69:function(e,t,a){},70:function(e,t,a){"use strict";var n=a(0),r=a.n(n);a(71);t.a=function(e){var t=e.text,a=e.name,n=e.checked,c=e.onChange;return r.a.createElement("label",{className:"checkbox"},r.a.createElement("input",{type:"checkbox",name:a,checked:n,onChange:c}),r.a.createElement("span",null,t))}},71:function(e,t,a){},76:function(e,t,a){}}]);
//# sourceMappingURL=5.94942b6d.chunk.js.map