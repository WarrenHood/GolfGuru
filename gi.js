subdir = 'pages/Out/';
lastPage = 89;
dps = 300;
angInt = 0.5;
angle = 0;
finished = true;
canTurn = true;
turning = false;
hidden = false;
tbSpeed = 0.08;
currentToggler = 1;
framewidth = screen.width;
frameheight = screen.height;
function g(x){return document.getElementById(x);}
window.onload = function(){
	front = document.getElementById('front');
	front.style.transformOrigin = 'top left';
	back = document.getElementById('back');
	ui = document.getElementById('ui');
	ui.style.height = '100%';
	ui.style.width = '100%';
	frontLoad('cover');
	backLoad('contents');
	ui.onmousedown = downHandle;
	ui.onmouseup = upHandle;
	g('toggler').onclick = toggleInteract;
	g('currentPage').value = current || 'cover';
	g('currentPage').onchange = function(){turnTo(g('currentPage').value)}
	g('currentPage').style.left = screen.width / 2.2 +'px';
	g('currentPage').style.height = screen.height * 0.025+'px';
	g('toggleToolbar').style.height = screen.height * 0.03+'px';
	g('toggleToolbar').style.width = screen.height * 0.03+'px';
	g('toggleToolbar').style.left = screen.width*0.98 -screen.height * 0.03+'0px';
	g('toggleToolbar').onclick = tbTog;
	g('toolbar').style.left = '0px';
	g('toolbar').style.height = screen.height * 0.03 +'px';
	g('toolbar').style.top = '0px';
	g('toggler').style.left = screen.width *0.8+'px';
	g('toggler').style.height = g('toolbar').style.height +'px;';
	g('toggler').style.width = g('toolbar').style.height +'px;';
	ratio = (screen.width*0.93)/framewidth;
	}
function tbTog(){
	if(hidden)showToolbar();
	else hideToolbar();
}
function hideToolbar(){
	hidden = true;
	var tb = g('toolbar');
	slideInterval = setInterval(function(){
		if(parseFloat(tb.style.left) > -screen.width + parseFloat(g('toggleToolbar').style.width)*2.23)tb.style.left = parseFloat(tb.style.left) - screen.width*tbSpeed +'px';
		else slideInterval = clearInterval(slideInterval);
	},50);
}
function showToolbar(){
	hidden = false;
	var tb = g('toolbar');
		slideInterval = setInterval(function(){
		if(parseFloat(tb.style.left) < 0)tb.style.left = parseFloat(tb.style.left) + screen.width*tbSpeed +'px';
		else slideInterval = clearInterval(slideInterval);
		},50);
}
function startTransparent(){
	front.style.background = 'rgba(0,300,300,0.15)';
}
function stopTransparent(){
	front.style.background = 'white';
}
function frontLoad(f){
	current = f;
	g('currentPage').value = current || 'cover';
	front.src = subdir + f + '.htm';
}
function backLoad(f){
	back.src = subdir + f + '.htm';
}
function frontAngle(a){
	angle = a;
	front.style.transform = 'rotateY('+a+'deg)';
}
function calcAngleX(x){
	return Math.acos(x/screen.width)*180/Math.PI;
}
function downHandle(e){
	e = e || event;
	console.log('downhandle');

		turnMode = 'next';
		console.log('nexting');
		startTransparent();
			if(e.clientX >= screen.width *2/3){
		if(nextPgSrc(current) != null){
		if(!canTurn){
		stopTransparent();
		canTurn = true;
		clearInterval(turnInterval);
		nextIt();	
		}
		ui.onmousemove = nextTurn;
		backLoad(nextPgSrc(current));
		}
	}
	else if(e.clientX <= screen.width/3){
		if(prevPgSrc(current) != null){
		turnMode = 'prev';	
		console.log('preving');
		startTransparent();
		if(!canTurn){
		stopTransparent();
			canTurn = true;
			clearInterval(turnInterval);
			prevIt();
		}
		ui.onmousemove = prevTurn;
		backLoad(prevPgSrc(current));
		}
	}
}
function nextTurn(e){
	e = e || event;
	front.style.transformOrigin = '0% 0%';
	angle = calcAngleX(e.clientX);
	frontAngle(angle);
}
function prevTurn(e){
	e = e || event;
	front.style.transformOrigin = '100% 100%';
	angle = calcAngleX(screen.width - e.clientX);
	frontAngle(angle);
}
function nextPgSrc(pg){
	if(pg == 'cover')return 'contents';
	if(pg == 'contents')return 1;
	if(pg < lastPage)return parseInt(pg) + 1;
}
function prevPgSrc(pg){
	if(pg == 'cover')return null;
	if(pg == 'contents')return 'cover';
	if(pg == 1)return 'contents';
	return parseInt(pg) - 1;
}
function upHandle(){
	ui.onmousemove = null;
	if(angle >= 40){
		if(turnMode == 'next')turnToNext();
		else turnToPrev();
	}
	else {frontAngle(0);stopTransparent();}
}
function turnToNext(){
	if(nextPgSrc(current) != null && canTurn){
		front.style.transformOrigin = '0% 0%';
		turnMode = 'next';
		console.log('nexting');
		backLoad(nextPgSrc(current));
	canTurn = false;
	if(!angle)angle = 0;
	turnInterval = setInterval(function(){
		frontAngle(angle+angInt);
		if(angle> 90){stopTransparent();
		canTurn = true;
		clearInterval(turnInterval);
		nextIt();
		}},1000/dps);}
}
function turnToPrev(){
	if(prevPgSrc(current) != null && canTurn){
		turnMode = 'prev';	
		front.style.transformOrigin = '100% 100%';
		console.log('preving');
		backLoad(prevPgSrc(current));
	canTurn = false;
	if(!angle)angle = 0;
	turnInterval = setInterval(function(){
		frontAngle(angle+angInt);
		if(angle > 90){
			stopTransparent();
			canTurn = true;
			clearInterval(turnInterval);
			prevIt();
			}},1000/dps);}
}
function nextIt(){
	frontLoad(nextPgSrc(current));
	front.style.zIndex = '-1';
	frontAngle(0);
	setTimeout(function(){front.style.zIndex='1';},100);
}
function prevIt(){
	frontLoad(prevPgSrc(current));
	front.style.zIndex = '-1';
	frontAngle(0);
	setTimeout(function(){front.style.zIndex='1';},100);
}
function toggleInteract(){
	if(currentToggler == 1)currentToggler = 2;
	else if(currentToggler == 2)currentToggler = 1;
	g('toggler').src = 'pointer' + currentToggler + '.bmp';
	ui.style.zIndex = parseInt(ui.style.zIndex)*-1;
}
function turnTo(pg){
	if(turning){frontAngle(0);if(ptoload)frontLoad(p);clearInterval(inter);}
	p = pg;
	if(pg == 'contents')var p = -1;
	if(pg == 'cover')var p = -2;
	canTurn = true;
	backLoad(pg);
	if(toPg(current) > toPg(pg))var ptoload = parseInt(toPg(pg))+1;
	else if(toPg(current) < toPg(pg))ptoload = parseInt(toPg(pg))-1;
	if(ptoload == 0)ptoload = 'contents';
	if(ptoload == -1)ptoload = 'cover';
	frontLoad(ptoload);
	current = ptoload;
	finished = false;
	var inter = setInterval(function(){
		if(current == pg){
			dps = 300;
			angInt = 0.5;
			clearInterval(inter);angInt = 0.5;
			finished = true;
		}
		else if(toPg(current) < p && canTurn){
			/*current = toPg(current)+Math.ceil(Math.abs(toPg(current)- p)/2)+1;
			if(current == -1)current = 'cover';
			if(current == 0)current = 'contents';*/
			turnToNext();}
		else if(toPg(current) > p && canTurn){
			/*current = toPg(current)-Math.ceil(Math.abs(toPg(current)- p)/2)+1;
			if(current == -1)current = 'cover';
			if(current == 0)current = 'contents';*/
			turnToPrev();}
		},10);
}
function toPg(p){
	if(p == 'cover')return - 1;
	if(p == 'contents')return 0;
	return p;
}

(function() {
function init() {
    var mouseEventTypes = {
        touchstart : "mousedown",
        touchmove : "mousemove",
        touchend : "mouseup"
    };

    for (originalType in mouseEventTypes) {
        document.addEventListener(originalType, function(originalEvent) {
            if(originalEvent.type == 'click')
                return;
            if (originalEvent.type != 'touchstart' && originalEvent.type !='touchend'){
                originalEvent.preventDefault();
            }
            event = document.createEvent("MouseEvents");
            touch = originalEvent.changedTouches[0];
            event.initMouseEvent(mouseEventTypes[originalEvent.type], true, true, window, 0, touch.screenX, touch.screenY, touch.clientX, touch.clientY, touch.ctrlKey, touch.altKey, touch.shiftKey, touch.metaKey, 0, null);
            originalEvent.target.dispatchEvent(event);
            event.preventDefault();         
        });
    }
}

init();
})();