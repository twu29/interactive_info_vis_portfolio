// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  let blindHeight = 0;
  let targetHeight = 0;
  let isPulled = false;
  
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
    p.stroke(90, 70, 50);
    p.strokeWeight(8);
    p.noFill();
    p.rect(-150, -100, 300, 200);
    
    // Blind holder at top
    p.fill(120, 100, 80);
    p.noStroke();
    p.rect(-150, -108, 300, 16);
    
    // Animate blind with smooth transition
    blindHeight = p.lerp(blindHeight, targetHeight, 0.1);
    
    // Draw blind slats (animated)
    p.stroke(100, 90, 80);
    p.strokeWeight(1);
    for (let i = 0; i < blindHeight; i += 12) {
      p.fill(180, 170, 160);
      p.rect(-150, -100 + i, 300, 10);
    }
    
    // Draw pull string (moves with blind)
    p.stroke(100, 90, 80);
    p.strokeWeight(2);
    p.line(0, -100 + blindHeight, 0, -100 + blindHeight + 40);
    
    // Pull string circle - highlight on hover
    let stringX = p.width / 2;
    let stringY = p.height / 2 - 100 + blindHeight + 40;
    let d = p.dist(p.mouseX, p.mouseY, stringX, stringY);
    
    if (d < 20) {
      p.fill(180, 160, 140); // Lighter when hovering
    } else {
      p.fill(140, 120, 100);
    }
    p.noStroke();
    p.circle(0, -100 + blindHeight + 40, 12);
    
    // Interactive instructions
    p.fill(100);
    p.textSize(14);
    p.textAlign(p.CENTER);
    p.text('Click to pull the blind', 0, 140);
    
    p.pop();
  };
  
  p.mousePressed = function () {
    // Check if clicking near the pull string
    let stringX = p.width / 2;
    let stringY = p.height / 2 - 100 + blindHeight + 40;
    let d = p.dist(p.mouseX, p.mouseY, stringX, stringY);
    
    if (d < 30) {
      isPulled = !isPulled;
      targetHeight = isPulled ? 180 : 0;
    }
  };
  
  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});