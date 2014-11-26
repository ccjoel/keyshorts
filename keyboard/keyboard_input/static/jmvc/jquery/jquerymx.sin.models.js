(function(i){var e={undHash:/_|-/,colons:/::/,words:/([A-Z]+)([A-Z][a-z])/g,lowUp:/([a-z\d])([A-Z])/g,dash:/([a-z\d])([A-Z])/g,replacer:/\{([^\}]+)\}/g,dot:/\./},l=function(a,b,c){return a[b]!==undefined?a[b]:c&&(a[b]={})},j=function(a){var b=typeof a;return a&&(b=="function"||b=="object")},m,k=i.String=i.extend(i.String||{},{getObject:m=function(a,b,c){a=a?a.split(e.dot):[];var f=a.length,d,h,g,n=0;b=i.isArray(b)?b:[b||window];if(f==0)return b[0];for(;d=b[n++];){for(g=0;g<f-1&&j(d);g++)d=l(d,a[g],
c);if(j(d)){h=l(d,a[g],c);if(h!==undefined){c===false&&delete d[a[g]];return h}}}},capitalize:function(a){return a.charAt(0).toUpperCase()+a.substr(1)},camelize:function(a){a=k.classize(a);return a.charAt(0).toLowerCase()+a.substr(1)},classize:function(a,b){a=a.split(e.undHash);for(var c=0;c<a.length;c++)a[c]=k.capitalize(a[c]);return a.join(b||"")},niceName:function(a){return k.classize(a," ")},underscore:function(a){return a.replace(e.colons,"/").replace(e.words,"$1_$2").replace(e.lowUp,"$1_$2").replace(e.dash,
"_").toLowerCase()},sub:function(a,b,c){var f=[];c=typeof c=="boolean"?!c:c;f.push(a.replace(e.replacer,function(d,h){d=m(h,b,c);if(j(d)){f.push(d);return""}else return""+d}));return f.length<=1?f[0]:f},_regs:e})})(jQuery);
(function(i){var j=false,p=i.makeArray,q=i.isFunction,l=i.isArray,m=i.extend,s=i.String.getObject,n=function(a,c){return a.concat(p(c))},t=/xyz/.test(function(){})?/\b_super\b/:/.*/,r=function(a,c,d){d=d||a;for(var b in a)d[b]=q(a[b])&&q(c[b])&&t.test(a[b])?function(h,g){return function(){var f=this._super,e;this._super=c[h];e=g.apply(this,arguments);this._super=f;return e}}(b,a[b]):a[b]};clss=i.Class=function(){arguments.length&&clss.extend.apply(clss,arguments)};m(clss,{proxy:function(a){var c=
p(arguments),d;a=c.shift();l(a)||(a=[a]);d=this;return function(){for(var b=n(c,arguments),h,g=a.length,f=0,e;f<g;f++)if(e=a[f]){if((h=typeof e=="string")&&d._set_called)d.called=e;b=(h?d[e]:e).apply(d,b||[]);if(f<g-1)b=!l(b)||b._use_call?[b]:b}return b}},newInstance:function(){var a=this.rawInstance(),c;if(a.setup)c=a.setup.apply(a,arguments);if(a.init)a.init.apply(a,l(c)?c:arguments);return a},setup:function(a){this.defaults=m(true,{},a.defaults,this.defaults);return arguments},rawInstance:function(){j=
true;var a=new this;j=false;return a},extend:function(a,c,d){function b(){if(!j)return this.constructor!==b&&arguments.length?arguments.callee.extend.apply(arguments.callee,arguments):this.Class.newInstance.apply(this.Class,arguments)}if(typeof a!="string"){d=c;c=a;a=null}if(!d){d=c;c=null}d=d||{};var h=this,g=this.prototype,f,e,k,o;j=true;o=new this;j=false;r(d,g,o);for(f in this)if(this.hasOwnProperty(f))b[f]=this[f];r(c,this,b);if(a){k=a.split(/\./);e=k.pop();k=g=s(k.join("."),window,true);g[e]=
b}m(b,{prototype:o,namespace:k,shortName:e,constructor:b,fullName:a});b.prototype.Class=b.prototype.constructor=b;e=b.setup.apply(b,n([h],arguments));if(b.init)b.init.apply(b,e||n([h],arguments));return b}});clss.callback=clss.prototype.callback=clss.prototype.proxy=clss.proxy})(jQuery);

(function(a){var e=jQuery.cleanData;a.cleanData=function(b){for(var c=0,d;(d=b[c])!==undefined;c++)a(d).triggerHandler("destroyed");e(b)}})(jQuery);
(function(e){var v=function(a,b,c){var d,f=a.bind&&a.unbind?a:e(j(a)?[a]:a);if(b.indexOf(">")===0){b=b.substr(1);d=function(i){i.target===a&&c.apply(this,arguments)}}f.bind(b,d||c);return function(){f.unbind(b,d||c);a=b=c=d=null}},k=e.makeArray,w=e.isArray,j=e.isFunction,l=e.extend,q=e.String,r=e.each,x=Array.prototype.slice,y=function(a,b,c,d){var f=a.delegate&&a.undelegate?a:e(j(a)?[a]:a);f.delegate(b,c,d);return function(){f.undelegate(b,c,d);f=a=c=d=b=null}},s=function(a,b,c,d){return d?y(a,d,
b,c):v(a,b,c)},m=function(a,b){var c=typeof b=="string"?a[b]:b;return function(){a.called=b;return c.apply(a,[this.nodeName?e(this):this].concat(x.call(arguments,0)))}},z=/\./g,A=/_?controllers?/ig,t=function(a){return q.underscore(a.replace("jQuery.","").replace(z,"_").replace(A,""))},B=/[^\w]/,u=/\{([^\}]+)\}/g,C=/^(?:(.*?)\s)?([\w\.\:>]+)$/,n,o=function(a,b){return e.data(a,"controllers",b)};e.Class("jQuery.Controller",{setup:function(){this._super.apply(this,arguments);if(!(!this.shortName||this.fullName==
"jQuery.Controller")){this._fullName=t(this.fullName);this._shortName=t(this.shortName);var a=this,b=this.pluginName||this._fullName,c;e.fn[b]||(e.fn[b]=function(d){var f=k(arguments),i=typeof d=="string"&&j(a.prototype[d]),D=f[0];return this.each(function(){var g=o(this);if(g=g&&g[b])i?g[D].apply(g,f.slice(1)):g.update.apply(g,f);else a.newInstance.apply(a,[this].concat(f))})});this.actions={};for(c in this.prototype)if(!(c=="constructor"||!j(this.prototype[c])))if(this._isAction(c))this.actions[c]=
this._action(c)}},hookup:function(a){return new this(a)},_isAction:function(a){return B.test(a)?true:e.inArray(a,this.listensTo)>-1||e.event.special[a]||p[a]},_action:function(a,b){u.lastIndex=0;if(!b&&u.test(a))return null;a=b?q.sub(a,[b,window]):a;b=w(a);var c=(b?a[1]:a).match(C);return{processor:p[c[2]]||n,parts:c,delegate:b?a[0]:undefined}},processors:{},listensTo:[],defaults:{}},{setup:function(a,b){var c=this.constructor;a=(typeof a=="string"?e(a):a.jquery?a:[a])[0];var d=c.pluginName||c._fullName;
this.element=e(a).addClass(d);(o(a)||o(a,{}))[d]=this;this.options=l(l(true,{},c.defaults),b);this.called="init";this.bind();return[this.element,this.options].concat(k(arguments).slice(2))},bind:function(a,b,c){if(a===undefined){this._bindings=[];a=this.constructor;b=this._bindings;c=a.actions;var d=this.element;for(funcName in c)if(c.hasOwnProperty(funcName)){ready=c[funcName]||a._action(funcName,this.options);b.push(ready.processor(ready.delegate||d,ready.parts[2],ready.parts[1],funcName,this))}var f=
m(this,"destroy");d.bind("destroyed",f);b.push(function(i){e(i).unbind("destroyed",f)});return b.length}if(typeof a=="string"){c=b;b=a;a=this.element}return this._binder(a,b,c)},_binder:function(a,b,c,d){if(typeof c=="string")c=m(this,c);this._bindings.push(s(a,b,c,d));return this._bindings.length},_unbind:function(){var a=this.element[0];r(this._bindings,function(b,c){c(a)});this._bindings=[]},delegate:function(a,b,c,d){if(typeof a=="string"){d=c;c=b;b=a;a=this.element}return this._binder(a,c,d,
b)},update:function(a){l(this.options,a);this._unbind();this.bind()},destroy:function(){if(this._destroyed)throw this.constructor.shortName+" controller already deleted";var a=this.constructor.pluginName||this.constructor._fullName;this._destroyed=true;this.element.removeClass(a);this._unbind();delete this._actions;delete this.element.data("controllers")[a];e(this).triggerHandler("destroyed");this.element=null},find:function(a){return this.element.find(a)},_set_called:true});var p=e.Controller.processors;
n=function(a,b,c,d,f){return s(a,b,m(f,d),c)};r("change click contextmenu dblclick keydown keyup keypress mousedown mousemove mouseout mouseover mouseup reset resize scroll select submit focusin focusout mouseenter mouseleave".split(" "),function(a,b){p[b]=n});var h,E=function(a,b){for(h=0;h<b.length;h++)if(typeof b[h]=="string"?a.constructor._shortName==b[h]:a instanceof b[h])return true;return false};e.fn.extend({controllers:function(){var a=k(arguments),b=[],c,d,f;this.each(function(){c=e.data(this,
"controllers");for(f in c)if(c.hasOwnProperty(f)){d=c[f];if(!a.length||E(d,a))b.push(d)}});return b},controller:function(){return this.controllers.apply(this,arguments)[0]}})})(jQuery);
(function(c){var f=function(a){return a!==undefined?(this.array[0]=a):this.array[0]},g=function(a){return a!==undefined?(this.array[1]=a):this.array[1]};c.Vector=function(){this.update(c.makeArray(arguments))};c.Vector.prototype={app:function(a){var b,d=[];for(b=0;b<this.array.length;b++)d.push(a(this.array[b]));return(new c.Vector).update(d)},plus:function(){var a,b=arguments[0]instanceof c.Vector?arguments[0].array:c.makeArray(arguments),d=this.array.slice(0),e=new c.Vector;for(a=0;a<b.length;a++)d[a]=
(d[a]?d[a]:0)+b[a];return e.update(d)},minus:function(){var a,b=arguments[0]instanceof c.Vector?arguments[0].array:c.makeArray(arguments),d=this.array.slice(0),e=new c.Vector;for(a=0;a<b.length;a++)d[a]=(d[a]?d[a]:0)-b[a];return e.update(d)},equals:function(){var a,b=arguments[0]instanceof c.Vector?arguments[0].array:c.makeArray(arguments),d=this.array.slice(0),e=new c.Vector;for(a=0;a<b.length;a++)if(d[a]!=b[a])return null;return e.update(d)},x:f,left:f,width:f,y:g,top:g,height:g,toString:function(){return"("+
this.array[0]+","+this.array[1]+")"},update:function(a){var b;if(this.array)for(b=0;b<this.array.length;b++)delete this.array[b];this.array=a;for(b=0;b<a.length;b++)this[b]=this.array[b];return this}};c.Event.prototype.vector=function(){if(this.originalEvent.synthetic){var a=document.documentElement,b=document.body;return new c.Vector(this.clientX+(a&&a.scrollLeft||b&&b.scrollLeft||0)-(a.clientLeft||0),this.clientY+(a&&a.scrollTop||b&&b.scrollTop||0)-(a.clientTop||0))}else return new c.Vector(this.pageX,
this.pageY)};c.fn.offsetv=function(){if(this[0]==window)return new c.Vector(window.pageXOffset?window.pageXOffset:document.documentElement.scrollLeft,window.pageYOffset?window.pageYOffset:document.documentElement.scrollTop);else{var a=this.offset();return new c.Vector(a.left,a.top)}};c.fn.dimensionsv=function(a){return this[0]==window||!a?new c.Vector(this.width(),this.height()):new c.Vector(this[a+"Width"](),this[a+"Height"]())}})(jQuery);
(function(){var g=jQuery.event,m=function(a,e,d,h){var f,b,c,k,j,i,l,n;for(f=0;f<e.length;f++){b=e[f];k=b.indexOf(".")<0;if(!k){c=b.split(".");b=c.shift();l=new RegExp("(^|\\.)"+c.slice(0).sort().join("\\.(?:.*\\.)?")+"(\\.|$)")}c=(a[b]||[]).slice(0);for(j=0;j<c.length;j++){i=c[j];if(n=k||l.test(i.namespace))if(h){if(i.selector===h)d(b,i.origHandler||i.handler)}else if(h===null)d(b,i.origHandler||i.handler,i.selector);else i.selector||d(b,i.origHandler||i.handler)}}};g.find=function(a,e,d){a=($._data(a)||
{}).events;var h=[];if(!a)return h;m(a,e,function(f,b){h.push(b)},d);return h};g.findBySelector=function(a,e){a=$._data(a).events;var d={},h=function(f,b,c){f=d[f]||(d[f]={});(f[b]||(f[b]=[])).push(c)};if(!a)return d;m(a,e,function(f,b,c){h(c||"",f,b)},null);return d};g.supportTouch="ontouchend"in document;$.fn.respondsTo=function(a){return this.length?g.find(this[0],$.isArray(a)?a:[a]).length>0:false};$.fn.triggerHandled=function(a,e){a=typeof a=="string"?$.Event(a):a;this.trigger(a,e);return a.handled};
g.setupHelper=function(a,e,d){if(!d){d=e;e=null}var h=function(b){var c=b.selector||"";if(c){b=g.find(this,a,c);b.length||$(this).delegate(c,e,d)}else g.find(this,a,c).length||g.add(this,e,d,{selector:c,delegate:this})},f=function(b){var c=b.selector||"";if(c){b=g.find(this,a,c);b.length||$(this).undelegate(c,e,d)}else g.find(this,a,c).length||g.remove(this,e,d,{selector:c,delegate:this})};$.each(a,function(){g.special[this]={add:h,remove:f,setup:function(){},teardown:function(){}}})}})(jQuery);
(function(c){var h=function(a,b){var d=Array.prototype.slice.call(arguments,2);return function(){var e=[this].concat(d,c.makeArray(arguments));return b.apply(a,e)}},g=c.event,i=window.getSelection?function(){window.getSelection().removeAllRanges()}:function(){};c.Drag=function(){};c.extend(c.Drag,{lowerName:"drag",current:null,distance:0,mousedown:function(a,b){if(!(!(a.button===0||a.button==1)||this.current)){var d=new c.Drag,e=a.delegateTarget||b,f=a.handleObj.selector,j=this;this.current=d;d.setup({element:b,
delegate:a.delegateTarget||b,selector:a.handleObj.selector,moved:false,_distance:this.distance,callbacks:{dragdown:g.find(e,["dragdown"],f),draginit:g.find(e,["draginit"],f),dragover:g.find(e,["dragover"],f),dragmove:g.find(e,["dragmove"],f),dragout:g.find(e,["dragout"],f),dragend:g.find(e,["dragend"],f)},destroyed:function(){j.current=null}},a)}}});c.extend(c.Drag.prototype,{setup:function(a,b){c.extend(this,a);this.element=c(this.element);this.event=b;this.allowOtherDrags=this.moved=false;var d=
h(this,this.mousemove),e=h(this,this.mouseup);this._mousemove=d;this._mouseup=e;this._distance=a.distance?a.distance:0;this.mouseStartPosition=b.vector();c(document).bind("mousemove",d);c(document).bind("mouseup",e);if(!this.callEvents("down",this.element,b)){this.noSelection(this.delegate);i()}},destroy:function(){c(document).unbind("mousemove",this._mousemove);c(document).unbind("mouseup",this._mouseup);if(!this.moved)this.event=this.element=null;this.selection(this.delegate);this.destroyed()},
mousemove:function(a,b){if(!this.moved){if(Math.sqrt(Math.pow(b.pageX-this.event.pageX,2)+Math.pow(b.pageY-this.event.pageY,2))<this._distance)return false;this.init(this.element,b);this.moved=true}a=b.vector();this._start_position&&this._start_position.equals(a)||this.draw(a,b)},mouseup:function(a,b){this.moved&&this.end(b);this.destroy()},noSelection:function(a){a=a||this.delegate;document.documentElement.onselectstart=function(){return false};document.documentElement.unselectable="on";this.selectionDisabled=
this.selectionDisabled?this.selectionDisabled.add(a):c(a);this.selectionDisabled.css("-moz-user-select","-moz-none")},selection:function(){if(this.selectionDisabled){document.documentElement.onselectstart=function(){};document.documentElement.unselectable="off";this.selectionDisabled.css("-moz-user-select","")}},init:function(a,b){a=c(a);var d=this.movingElement=this.element=c(a);this._cancelled=false;this.event=b;this.mouseElementPosition=this.mouseStartPosition.minus(this.element.offsetv());this.callEvents("init",
a,b);if(this._cancelled!==true){this.startPosition=d!=this.movingElement?this.movingElement.offsetv():this.currentDelta();this.makePositioned(this.movingElement);this.oldZIndex=this.movingElement.css("zIndex");this.movingElement.css("zIndex",1E3);!this._only&&this.constructor.responder&&this.constructor.responder.compile(b,this)}},makePositioned:function(a){var b;b=a.css("position");if(!b||b=="static"){b={position:"relative"};if(window.opera){b.top="0px";b.left="0px"}a.css(b)}},callEvents:function(a,
b,d,e){var f=this.callbacks[this.constructor.lowerName+a];for(a=0;a<f.length;a++)f[a].call(b,d,this,e);return f.length},currentDelta:function(){return new c.Vector(parseInt(this.movingElement.css("left"),10)||0,parseInt(this.movingElement.css("top"),10)||0)},draw:function(a,b){if(!this._cancelled){i();this.location=a.minus(this.mouseElementPosition);this.move(b);if(!this._cancelled){b.isDefaultPrevented()||this.position(this.location);!this._only&&this.constructor.responder&&this.constructor.responder.show(a,
this,b)}}},position:function(a){var b=this.currentDelta();b=this.movingElement.offsetv().minus(b);this.required_css_position=a.minus(b);this.offsetv=a;a=this.movingElement[0].style;if(!this._cancelled&&!this._horizontal)a.top=this.required_css_position.top()+"px";if(!this._cancelled&&!this._vertical)a.left=this.required_css_position.left()+"px"},move:function(a){this.callEvents("move",this.element,a)},over:function(a,b){this.callEvents("over",this.element,a,b)},out:function(a,b){this.callEvents("out",
this.element,a,b)},end:function(a){if(!this._cancelled){!this._only&&this.constructor.responder&&this.constructor.responder.end(a,this);this.callEvents("end",this.element,a);if(this._revert){var b=this;this.movingElement.animate({top:this.startPosition.top()+"px",left:this.startPosition.left()+"px"},function(){b.cleanup.apply(b,arguments)})}else this.cleanup();this.event=null}},cleanup:function(){this.movingElement.css({zIndex:this.oldZIndex});this.movingElement[0]!==this.element[0]&&!this.movingElement.has(this.element[0]).length&&
!this.element.has(this.movingElement[0]).length&&this.movingElement.css({display:"none"});this._removeMovingElement&&this.movingElement.remove();this.movingElement=this.element=this.event=null},cancel:function(){this._cancelled=true;!this._only&&this.constructor.responder&&this.constructor.responder.clear(this.event.vector(),this,this.event);this.destroy()},ghost:function(a){var b=this.movingElement.clone().css("position","absolute");(a?c(a):this.movingElement).after(b);b.width(this.movingElement.width()).height(this.movingElement.height());
b.offset(this.movingElement.offset());this.movingElement=b;this.noSelection(b);this._removeMovingElement=true;return b},representative:function(a,b,d){this._offsetX=b||0;this._offsetY=d||0;b=this.mouseStartPosition;this.movingElement=c(a);this.movingElement.css({top:b.y()-this._offsetY+"px",left:b.x()-this._offsetX+"px",display:"block",position:"absolute"}).show();this.noSelection(this.movingElement);this.mouseElementPosition=new c.Vector(this._offsetX,this._offsetY)},revert:function(a){this._revert=
a===undefined?true:a;return this},vertical:function(){this._vertical=true;return this},horizontal:function(){return this._horizontal=true},only:function(a){return this._only=a===undefined?true:a},distance:function(a){if(a!==undefined){this._distance=a;return this}else return this._distance}});g.setupHelper(["dragdown","draginit","dragover","dragmove","dragout","dragend"],"mousedown",function(a){c.Drag.mousedown.call(c.Drag,a,this)})})(jQuery);

(function(i){var j=function(b,c,e,d,a,g){return c>=d&&c<d+g&&b>=e&&b<e+a};i.fn.within=function(b,c,e){var d=[];this.each(function(){var a=jQuery(this);if(this==document.documentElement)return d.push(this);a=e?jQuery.data(this,"offsetCache")||jQuery.data(this,"offsetCache",a.offset()):a.offset();j(b,c,a.left,a.top,this.offsetWidth,this.offsetHeight)&&d.push(this)});return this.pushStack(jQuery.unique(d),"within",b+","+c)};i.fn.withinBox=function(b,c,e,d,a){var g=[];this.each(function(){var f=jQuery(this);
if(this==document.documentElement)return this.ret.push(this);var h=a?jQuery.data(this,"offset")||jQuery.data(this,"offset",f.offset()):f.offset(),k=f.width();f=f.height();(res=!(h.top>c+d||h.top+f<c||h.left>b+e||h.left+k<b))&&g.push(this)});return this.pushStack(jQuery.unique(g),"withinBox",jQuery.makeArray(arguments).join(","))}})(jQuery);
(function(){jQuery.fn.compare=function(a){try{a=a.jquery?a[0]:a}catch(e){return null}if(window.HTMLElement){var b=HTMLElement.prototype.toString.call(a);if(b=="[xpconnect wrapped native prototype]"||b=="[object XULElement]"||b==="[object Window]")return null}if(this[0].compareDocumentPosition)return this[0].compareDocumentPosition(a);if(this[0]==document&&a!=document)return 8;b=(this[0]!==a&&this[0].contains(a)&&16)+(this[0]!=a&&a.contains(this[0])&&8);var c=document.documentElement;if(this[0].sourceIndex){b+=
this[0].sourceIndex<a.sourceIndex&&4;b+=this[0].sourceIndex>a.sourceIndex&&2;b+=(this[0].ownerDocument!==a.ownerDocument||this[0]!=c&&this[0].sourceIndex<=0||a!=c&&a.sourceIndex<=0)&&1}else{c=document.createRange();var d=document.createRange();c.selectNode(this[0]);d.selectNode(a);c.compareBoundaryPoints(Range.START_TO_START,d)}return b}})(jQuery);
(function(f){var m=f.event,k=["dropover","dropon","dropout","dropinit","dropmove","dropend"];f.Drop=function(a,b){jQuery.extend(this,a);this.element=f(b)};f.each(k,function(){m.special[this]={add:function(){var a=f(this),b=a.data("dropEventCount")||0;a.data("dropEventCount",b+1);b==0&&f.Drop.addElement(this)},remove:function(){var a=f(this),b=a.data("dropEventCount")||0;a.data("dropEventCount",b-1);b<=1&&f.Drop.removeElement(this)}}});f.extend(f.Drop,{lowerName:"drop",_rootElements:[],_elements:f(),
last_active:[],endName:"dropon",addElement:function(a){for(var b=0;b<this._rootElements.length;b++)if(a==this._rootElements[b])return;this._rootElements.push(a)},removeElement:function(a){for(var b=0;b<this._rootElements.length;b++)if(a==this._rootElements[b]){this._rootElements.splice(b,1);return}},sortByDeepestChild:function(a,b){a=a.element.compare(b.element);if(a&16||a&4)return 1;if(a&8||a&2)return-1;return 0},isAffected:function(a,b,c){return c.element!=b.element&&c.element.within(a[0],a[1],
c._cache).length==1},deactivate:function(a,b,c){b.out(c,a);a.callHandlers(this.lowerName+"out",a.element[0],c,b)},activate:function(a,b,c){b.over(c,a);a.callHandlers(this.lowerName+"over",a.element[0],c,b)},move:function(a,b,c){a.callHandlers(this.lowerName+"move",a.element[0],c,b)},compile:function(a,b){if(this.dragging||b){if(!this.dragging){this.dragging=b;this.last_active=[]}for(var c,e,d,g=[],i=this.dragging,h=0;h<this._rootElements.length;h++){b=this._rootElements[h];c=f.event.findBySelector(b,
k);for(e in c){d=e?jQuery(e,b):[b];for(var j=0;j<d.length;j++)this.addCallbacks(d[j],c[e],i)&&g.push(d[j])}}this.add(g,a,i)}},addCallbacks:function(a,b,c){var e=f.data(a,"_dropData");if(e){if(!c){for(var d in b)e[d]=e[d]?e[d].concat(b[d]):b[d];return false}}else{f.data(a,"_dropData",new f.Drop(b,a));return true}},add:function(a,b,c){for(var e=0,d;e<a.length;){d=f.data(a[e],"_dropData");d.callHandlers(this.lowerName+"init",a[e],b,c);if(d._canceled)a.splice(e,1);else e++}this._elements.push.apply(this._elements,
a)},show:function(a,b,c){if(this._elements.length){var e=[],d=true,g=0,i,h,j,l=this.last_active;for(i=this;g<this._elements.length;)if(h=f.data(this._elements[g],"_dropData")){g++;i.isAffected(a,b,h)&&e.push(h)}else this._elements.splice(g,1);e.sort(this.sortByDeepestChild);c.stopRespondPropagate=function(){d=false};h=e.slice();this.last_active=e;for(a=0;a<l.length;a++){i=l[a];for(g=0;j=h[g];)if(i==j){h.splice(g,1);break}else g++;j||this.deactivate(i,b,c);if(!d)return}for(g=0;g<h.length;g++){this.activate(h[g],
b,c);if(!d)return}for(g=0;g<e.length;g++){this.move(e[g],b,c);if(!d)return}}},end:function(a,b){for(var c,e=this.lowerName+"end",d=0;d<this.last_active.length;d++){c=this.last_active[d];this.isAffected(a.vector(),b,c)&&c[this.endName]&&c.callHandlers(this.endName,null,a,b)}for(d=0;d<this._elements.length;d++)(c=f.data(this._elements[d],"_dropData"))&&c.callHandlers(e,null,a,b);this.clear()},clear:function(){this._elements.each(function(){f.removeData(this,"_dropData")});this._elements=f();delete this.dragging}});
f.Drag.responder=f.Drop;f.extend(f.Drop.prototype,{callHandlers:function(a,b,c,e){for(var d=this[a]?this[a].length:0,g=0;g<d;g++)this[a][g].call(b||this.element[0],c,this,e)},cache:function(a){this._cache=a!=null?a:true},cancel:function(){this._canceled=true}})})(jQuery);
(function(f){f.Drag.prototype.scrolls=function(a,c){a=f(a);for(var b=0;b<a.length;b++)this.constructor.responder._elements.push(a.eq(b).data("_dropData",new f.Scrollable(a[b],c))[0])};f.Scrollable=function(a,c){this.element=jQuery(a);this.options=f.extend({distance:30,delta:function(b,g){return(g-b)/2},direction:"xy"},c);this.x=this.options.direction.indexOf("x")!=-1;this.y=this.options.direction.indexOf("y")!=-1};f.extend(f.Scrollable.prototype,{init:function(a){this.element=jQuery(a)},callHandlers:function(a,
c,b,g){this[a](c||this.element[0],b,this,g)},dropover:function(){},dropon:function(){this.clear_timeout()},dropout:function(){this.clear_timeout()},dropinit:function(){},dropend:function(){},clear_timeout:function(){if(this.interval){clearTimeout(this.interval);this.interval=null}},distance:function(a){return(30-a)/2},dropmove:function(a,c,b,g){this.clear_timeout();var d=c.vector();b=f(a==document.documentElement?window:a);var h=b.dimensionsv("outer"),e=b.offsetv();b=e.y()+h.y()-d.y();var k=d.y()-
e.y();h=e.x()+h.x()-d.x();d=d.x()-e.x();var i=0,j=0;e=this.options.distance;if(b<e&&this.y)j=this.options.delta(b,e);else if(k<e&&this.y)j=-this.options.delta(k,e);if(h<e&&this.options&&this.x)i=this.options.delta(h,e);else if(d<e&&this.x)i=-this.options.delta(d,e);if(i||j){var l=this;this.interval=setTimeout(function(){l.move(f(a),g.movingElement,i,j,c,c.clientX,c.clientY,c.screenX,c.screenY)},15)}},move:function(a,c,b,g,d){a.scrollTop(a.scrollTop()+g);a.scrollLeft(a.scrollLeft()+b);c.trigger(f.event.fix({type:"mousemove",
clientX:d.clientX,clientY:d.clientY,screenX:d.screenX,screenY:d.screenY,pageX:d.pageX,pageY:d.pageY}))}})})(jQuery);
(function(b){var c=b(),j=0,d=b(window),k=0,l=0,m;b(function(){k=d.width();l=d.height()});b.event.special.resize={setup:function(){if(this!==window){c.push(this);b.unique(c)}return this!==window},teardown:function(){c=c.not(this);return this!==window},add:function(h){h.origHandler=h.handler;h.handler=function(a,e){var f=this===window;if(f&&a.originalEvent){a=d.width();f=d.height();if(a!=k||f!=l){k=a;l=f;clearTimeout(m);m=setTimeout(function(){d.trigger("resize")},1)}}else if(j===0){j++;e=e===false?
a.target:this;b.event.handle.call(e,a);if(!a.isPropagationStopped()){for(var g=c.index(this),n=c.length,i,o;++g<n&&(i=c[g])&&(f||b.contains(e,i));){b.event.handle.call(i,a);if(a.isPropagationStopped())for(;++g<n&&(o=c[g]);)if(!b.contains(i,o)){g--;break}}a.stopImmediatePropagation()}j--}else h.origHandler.call(this,a,e)}}};b([document,window]).bind("resize",function(){})})(jQuery);