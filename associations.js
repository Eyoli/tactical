"use strict";

function AbstractBehavior(object) {
	this.object = object;
	
	this.actionOnTarget = function(physics) {};
}

function RetardedTargetAssociation(object, target, farthest) {
	AbstractBehavior.call(this, object);
	
	this.target = target;
	
	this.actionOnTarget = function(physics) {
		var dx = this.target.x - this.object.x;
		var dy = this.target.y - this.object.y;
		var d = Math.sqrt(dx*dx + dy*dy);
		if(d > farthest) {
			if(dx > 0) {
				this.object.alpha = Math.atan(dy / dx);
			} else {
				this.object.alpha = Math.PI + Math.atan(dy / dx);
			}
		}
	};
}

function InitialTargetAssociation(object, target, farthest) {
	AbstractBehavior.call(this, object);
	
	this.farthest = farthest;
	this.distance = 0;
	
	var dx = target.x - this.object.x;
	var dy = target.y - this.object.y;
	var d = Math.sqrt(dx*dx + dy*dy);
	if(dx > 0) {
		this.object.alpha = Math.atan(dy / dx);
	} else {
		this.object.alpha = Math.PI + Math.atan(dy / dx);
	}
	
	this.actionOnTarget = function(physics) {
		this.distance += this.object.v;
	
		if(this.farthest && this.distance > this.farthest) {
			this.object.destroyed = true;
		}
	};
}

function BasicTargetAssociation(object, target) {
	AbstractBehavior.call(this, object);
	
	this.target = target;
	
	this.actionOnTarget = function(physics) {
		var dx = this.target.x - this.object.x;
		var dy = this.target.y - this.object.y;

		if(dx > 0) {
			this.object.alpha = Math.atan(dy / dx);
		} else {
			this.object.alpha = Math.PI + Math.atan(dy / dx);
		}
		
	};
}

function StayAwayTargetAssociation(object, target, closest) {
	AbstractBehavior.call(this, object);
	
	this.target = target;
	
	this.actionOnTarget = function(physics) {
		var dx = this.target.x - this.object.x;
		var dy = this.target.y - this.object.y;
		var d = Math.sqrt(dx*dx + dy*dy);

		if(d > closest) {
			if(dx > 0) {
				this.object.alpha = Math.atan(dy / dx);
			} else {
				this.object.alpha = Math.PI + Math.atan(dy / dx);
			}
		} else {
			if(dx > 0) {
				this.object.alpha = Math.PI + Math.atan(dy / dx);
			} else {
				this.object.alpha = Math.atan(dy / dx);
			}
		}
	};
}

function MissileTargetAssociation(object, target, timeBetweenShot, maxRange, minRange) {
	AbstractBehavior.call(this, object);
	
	this.target = target;
	this.timeBetweenShot = timeBetweenShot;
	this.lastShot = 0;
	this.maxRange = maxRange;
	this.minRange = minRange;
	
	this.actionOnTarget = function(physics) {
		var currentTime = (new Date()).getTime();
		
		var dx = this.target.x - this.object.x;
		var dy = this.target.y - this.object.y;
		var d = Math.sqrt(dx*dx + dy*dy);
	
		if(currentTime - this.lastShot > this.timeBetweenShot && d <= this.maxRange && d >= this.minRange) {
			var p = new DestructibleObject(this.object.x, this.object.y, 10, 4, 0, 1);
			p.setSide(this.object.side);
			
			physics.addObject(p);
			physics.addWrapper(new CircleWrapper(p));
			physics.addTargetAssociation(new InitialTargetAssociation(p, this.target, 300));
			
			this.lastShot = currentTime;
		}
	};
}