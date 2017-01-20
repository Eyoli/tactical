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