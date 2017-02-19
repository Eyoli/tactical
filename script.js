"use strict";

function CircleWrapper(physicalObject) {
	this.physicalObject = physicalObject;
	
	
	
	this.display = function(context) {
		context.beginPath();
		context.arc(this.physicalObject.x, this.physicalObject.y, this.physicalObject.r, 0, 2*Math.PI);
		
		// context.moveTo(this.physicalObject.x, this.physicalObject.y);
		// context.lineTo(this.physicalObject.x + 50 * Math.cos(this.physicalObject.alpha), this.physicalObject.y + 50 * Math.sin(this.physicalObject.alpha));
		
		context.stroke();
						
		if(this.physicalObject.pv) {
			var healthLineTotalWidth = 2*this.physicalObject.r;
			var healthLineWidth = (this.physicalObject.pv / this.physicalObject.pvMax) * healthLineTotalWidth;
			var startX = this.physicalObject.x - this.physicalObject.r;
			var startY = this.physicalObject.y + this.physicalObject.r + 10;
			
			var grd = context.createLinearGradient(startX, 0, startX + healthLineWidth, 0);
			grd.addColorStop(0,"red");
			grd.addColorStop(1,"white");

			// Fill with gradient
			context.fillStyle = grd;
			context.strokeRect(startX, startY, healthLineTotalWidth, 8);
			context.fillRect(startX, startY, healthLineWidth, 8);
		}
	};
}

function Rectangle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

window.onload = function() {
	var pause = false;
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext("2d");
	
	canvas.addEventListener("click", function(event) {
		pause = !pause;
	});
	
	var expectedFPS = 60;
	
	var p1 = new PhysicalObject(500, 300, 40, 3, 0);
	var p2 = new DestructibleObject(500, 500, 30, 2, 0, 100);
	var p3 = new DestructibleObject(600, 300, 30, 1.5, 0, 100);
	p3.setSide(1);
		
	var wholeArea = new Rectangle(0, 0, canvas.width, canvas.height);
	var physics2d = new Physics2d(wholeArea);
	physics2d.addObject(p1);
	physics2d.addObject(p2);
	physics2d.addObject(p3);
	
	physics2d.addWrapper(new CircleWrapper(p1));
	physics2d.addWrapper(new CircleWrapper(p2));
	physics2d.addWrapper(new CircleWrapper(p3));
	physics2d.addWrapper(new CircleWrapper(physics2d.mouseObject));
	
	physics2d.addTargetAssociation(new RetardedTargetAssociation(p2, p1, 300));
	physics2d.addTargetAssociation(new StayAwayTargetAssociation(p3, p2, 200));
	physics2d.addTargetAssociation(new MissileTargetAssociation(p3, p2, 500, 300, 200));
	physics2d.addTargetAssociation(new BasicTargetAssociation(p1, physics2d.mouseObject));
	
	function animate() {
		if(!pause) {
			
			physics2d.detectCollisions(1);
			physics2d.animate();
			physics2d.triggerActionOnTarget();
			
			context.clearRect(0, 0, canvas.width, canvas.height);
			physics2d.display(context);
		}
		window.requestAnimationFrame(animate);
	}
	
	window.requestAnimationFrame(animate);
};