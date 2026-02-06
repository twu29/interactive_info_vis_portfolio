// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  
  p.draw = function () {
    p.background(250, 248, 245);
    
    // Draw clock circle
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.noFill();
    p.stroke(30);
    p.strokeWeight(3);
    p.circle(0, 0, 280);
    
    // Draw center dot
    p.fill(30);
    p.noStroke();
    p.circle(0, 0, 8);
    
    p.pop();
  };
  
  p.windowResized = function () { 
    p.resizeCanvas(p.windowWidth, p.windowHeight); 
  };
});

