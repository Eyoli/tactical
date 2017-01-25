function GraphicObject(x, y) {
    this.x = x;
    this.y = y;
    
    this.onCollisionWith(object) {
        
    };
}

function Rectangle(topLeft, topRight, bottomLeft, bottomRight) {
    this.topLeft = topLeft;
    this.topRight = topRight;
    this.bottomLeft = bottomLeft;
    this.bottomRight = bottomRight;
}

function Physics2d(area) {
    this.area = area;
    
    this.objects = [];
    
    this.addObject = function(object) {
        this.objects.add(object);
    };
    
    this.detectCollisions = function(depth) {
        
    }
}

window.onload = function() {

    var pause = false;
    
    var canvas = document.getElementById('canvas');
    
    canvas.addEventListener("click", function(event) {
        pause = !pause;
    });
    
    var expectedFPS = 60;

    function animate() {
        
        if(!pause) {
            
        }

        window.requestAnimationFrame(animate);
    }
    
    window.requestAnimationFrame(animate);
};