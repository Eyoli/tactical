"use strict";

function RetardedTargetAssociation(hunter, target, farthest) {
	this.hunter = hunter;
	this.target = target;
	
	this.actionOnTarget = function(physics) {
		var dx = this.target.x - this.hunter.x;
		var dy = this.target.y - this.hunter.y;
		var d = Math.sqrt(dx*dx + dy*dy);
		if(d > farthest) {
			if(dx > 0) {
				this.hunter.alpha = Math.atan(dy / dx);
			} else {
				this.hunter.alpha = Math.PI + Math.atan(dy / dx);
			}
		}
	};
}

function InitialTargetAssociation(hunter, target, farthest) {
	this.hunter = hunter;
	this.target = target;
	this.farthest = farthest;
	
	var dx = this.target.x - this.hunter.x;
	var dy = this.target.y - this.hunter.y;
	var d = Math.sqrt(dx*dx + dy*dy);
	if(dx > 0) {
		this.hunter.alpha = Math.atan(dy / dx);
	} else {
		this.hunter.alpha = Math.PI + Math.atan(dy / dx);
	}
	
	this.actionOnTarget = function(physics) {
		/*var dx = this.target.x - this.hunter.x;
		var dy = this.target.y - this.hunter.y;
		var d = Math.sqrt(dx*dx + dy*dy);
	
		if(this.farthest && d > this.farthest) {
			physics.remove(this.hunter);
		}*/
	};
}

function BasicTargetAssociation(hunter, target) {
	this.hunter = hunter;
	this.target = target;
	
	this.actionOnTarget = function(physics) {
		var dx = this.target.x - this.hunter.x;
		var dy = this.target.y - this.hunter.y;
		var d = Math.sqrt(dx*dx + dy*dy);

		if(dx > 0) {
			this.hunter.alpha = Math.atan(dy / dx);
		} else {
			this.hunter.alpha = Math.PI + Math.atan(dy / dx);
		}
		
	};
}

function StayAwayTargetAssociation(hunter, target, closest) {
	this.hunter = hunter;
	this.target = target;
	
	this.actionOnTarget = function(physics) {
		var dx = this.target.x - this.hunter.x;
		var dy = this.target.y - this.hunter.y;
		var d = Math.sqrt(dx*dx + dy*dy);

		if(d > closest) {
			if(dx > 0) {
				this.hunter.alpha = Math.atan(dy / dx);
			} else {
				this.hunter.alpha = Math.PI + Math.atan(dy / dx);
			}
		} else {
			if(dx > 0) {
				this.hunter.alpha = Math.PI + Math.atan(dy / dx);
			} else {
				this.hunter.alpha = Math.atan(dy / dx);
			}
		}
	};
}

function MissileTargetAssociation(hunter, target, timeBetweenShot, maxRange, minRange) {
	this.hunter = hunter;
	this.target = target;
	this.timeBetweenShot = timeBetweenShot;
	this.lastShot = 0;
	this.maxRange = maxRange;
	this.minRange = minRange;
	
	this.actionOnTarget = function(physics) {
		var currentTime = (new Date()).getTime();
		
		var dx = this.target.x - this.hunter.x;
		var dy = this.target.y - this.hunter.y;
		var d = Math.sqrt(dx*dx + dy*dy);
	
		if(currentTime - this.lastShot > this.timeBetweenShot && d <= this.maxRange && d >= this.minRange) {
			var p = new PhysicalObject(this.hunter.x, this.hunter.y, 10, 4, 0);
			physics.addObject(p);
			physics.addWrapper(new CircleWrapper(p));
			physics.addTargetAssociation(new InitialTargetAssociation(p, this.target, 300));
			
			this.lastShot = currentTime;
		}
	};
}