// Instance-mode sketch for Hidden Time - Feature 1
registerSketch('sk3', function (p) {
  
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  
  p.draw = function () {
    p.background(245, 240, 230);
    
    // Draw window frame
    p.push();
    p.translate(p.width / 2, p.height / 2);
    
    // Window background
    p.fill(200, 220, 240);
    p.noStroke();
    p.rect(-150, -100, 300, 200);
    
    // Window frame
    p.stroke(80, 60, 40);
    p.strokeWeight(8);
    p.noFill();
    p.rect(-150, -100, 300, 200);
    
    // Blind holder at top
    p.fill(120, 100, 80);
    p.noStroke();
    p.rect(-150, -108, 300, 16);
    
    // Draw blind slats (static, fully closed)
    p.stroke(100, 90, 80);
    p.strokeWeight(1);
    for (let i = 0; i < 200; i += 12) {
      p.fill(180, 170, 160);
      p.rect(-150, -100 + i, 300, 10);
    }
    
    // Draw pull string
    p.stroke(100, 90, 80);
    p.strokeWeight(2);
    p.line(0, 100, 0, 140);
    
    // Pull string circle
    p.fill(140, 120, 100);
    p.noStroke();
    p.circle(0, 140, 12);
    
    p.pop();
  };
  
  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});