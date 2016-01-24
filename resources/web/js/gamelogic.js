step = 0; // Current step
steps = 500; // Total number of steps to perform the effect
accel = 0.05; // Acceleration
vX = 4; // X velocity

const topPlayer = {name:"saucer" , torpedoDirection:1, torpedoIndex: 0, torpedoPrefix: "top"};
const bottomPlayer = {name: "rwithgun", torpedoDirection:-1, torpedoIndex:0, torpedoPrefix: "bottom"};
var myObj = topPlayer;
var torpedoPrefix = "torpedo"
var torpedoSteps = {};

var frogPefix="frog";
var frogIndexes = [0, 1, 2, 3, 4, 5 ,6 ,7, 8, 9];

function moveObj(name, Xpix, Ypix, makeContinous = true) {
	obj = document.getElementById(name);

	var px = parseInt(obj.style.left) + Xpix;
	var py = parseInt(obj.style.top) + Ypix;

	if (px > playGroundRect.leftTopX && py > playGroundRect.leftTopY
			&& (px + obj.width) < playGroundRect.rightBottomX
			&& (py + obj.height) < playGroundRect.rightBottomY) {
		obj.style.left = px;
		obj.style.top = py;
	}
	if(makeContinous){
		setTimeout('makeMovementContinous("'+name+'", '+Xpix+','+Ypix+')', 0);	
	}
	
	
}
var movementArray = new Array();
var movementArrayMaxLength = 20;

function initGameLogic(){
	setTimeout("autoMove()", 0);
}
function autoMove(){
	if(movementArray.length != 0){
		var command = movementArray.shift();
		setTimeout(command.command, command.waitTime);
	}
	setTimeout("autoMove()", 10);
}

function makeMovementContinous(name, Xpix, Ypix){
	var waitTime = 0;
	for(i=0; i < 10; i++){
		waitTime +=50;
		if(movementArray.length < movementArrayMaxLength)
		{
			movementArray.push({command: 'moveObj("'+name+'", '+Xpix+','+Ypix+', false)', waitTime: waitTime});
		}
		
	}
}

function fireTorpedo(name, torpedoId) {
	// Get the position of the saucer
	var obj = document.getElementById(name);
	var px = parseInt(obj.style.left);
	var py = parseInt(obj.style.top);

	// Fire topredo to the right of the saucer
	var t = document.getElementById(torpedoId);
	t.style.left = px + document.getElementById(myObj.name).width/2;
	t.style.top = py + 20 * myObj.torpedoDirection;

	step = 0;
	accel = 0.05;
	vX = 1;

	window.setTimeout('moveTorpedo("'+ torpedoId +'");', 0);
}

function moveTorpedo(torpedoId) {
	var actualStep = torpedoSteps[torpedoId];
	if(actualStep == undefined)
	{
		actualStep = 1;
	}
	torpedoSteps[torpedoId] = ++actualStep;
	if (actualStep >= steps){
		torpedoSteps[torpedoId] = 0;
		return; // no more torpedo movement
	}

	// Move torpedo to the right by the given velocity and acceleration
	var torpedo = document.getElementById(torpedoId);
	var py = parseInt(torpedo.style.top);
	vX += parseInt(accel); // Increase velocity by the amount of acceleration
	torpedo.style.top = py + vX * myObj.torpedoDirection;
	var torpedoLeft = parseInt(torpedo.style.left);
	var torpedoTop = parseInt(torpedo.style.top);

	
	for(i = 0 ; i < frogIndexes.length; i++)
	{
		var frog = document.getElementById(frogPefix + frogIndexes[i] );
		if(frog != undefined){
			var frogLeft = parseInt(frog.style.left);
			var frogTop = parseInt(frog.style.top);
			var frogRight = frogLeft + frog.width;
			var frogBottom = frogTop + frog.height;
			
			if(torpedoLeft > frogLeft && torpedoLeft < frogRight &&
			   torpedoTop < frogBottom && torpedoTop > 	frogTop)
			{
				// only detect host player hits
				if(torpedoId.startsWith(myObj.torpedoPrefix)){
					torpedoSteps[torpedoId] = 0
					torpedo.style.left = "-100px";
					return;
				}
				
			}
		}
	}
	window.setTimeout('moveTorpedo("'+torpedoId+'");', 0);
}

function ProcessKeypress(e) {
	var moveBy = 5;

	if (e.keyCode)
		keycode = e.keyCode;
	else
		keycode = e.which;
	ch = String.fromCharCode(keycode);

	var objectToMove = myObj.name;
	var moveObjectByX = 0;
	var moveObjectByY = 0;

	if (ch == 'a') {
		moveObjectEachSide(objectToMove, -moveBy, 0);
	} else if (ch == 'd') {
		moveObjectEachSide(objectToMove, moveBy, 0);
	}
	else if (ch == 's') {
		sendFireTorpedo();
	}
}
function moveObjectEachSide(obj, x, y) {
	sendCommand('moveObj("' + obj + '", ' + x + ', ' + y + ')');
	moveObj(obj, x, y);
}
function sendFireTorpedo() {
	myObj.torpedoIndex = (myObj.torpedoIndex + 1) % 10;
	sendCommand('fireTorpedo("' + myObj.name + '","'+ myObj.torpedoPrefix + myObj.torpedoIndex +'")');	
	fireTorpedo(myObj.name, myObj.torpedoPrefix + myObj.torpedoIndex);
}
