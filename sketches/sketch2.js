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
    
    // Draw clock numbers
    p.fill(30);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(20);
    for (let i = 1; i <= 12; i++) {
      let angle = p.map(i, 0, 12, -p.PI / 2, 3 * p.PI / 2);
      let x = p.cos(angle) * 120;
      let y = p.sin(angle) * 120;
      p.text(i, x, y);
    }
    
    // Draw center dot
    p.fill(30);
    p.noStroke();
    p.circle(0, 0, 8);
    
    // Get current time
    let h = p.hour() % 12;
    let m = p.minute();
    let s = p.second();
    
    // Calculate angles (in radians, -PI/2 to start at top)
    let hourAngle = p.map(h + m / 60, 0, 12, -p.PI / 2, 3 * p.PI / 2);
    let minuteAngle = p.map(m + s / 60, 0, 60, -p.PI / 2, 3 * p.PI / 2);
    
    // Draw minute hand
    p.push();
    p.rotate(minuteAngle);
    p.stroke(60);
    p.strokeWeight(4);
    p.line(0, 0, 80, 0);
    p.pop();
    
    // Draw hour hand
    p.push();
    p.rotate(hourAngle);
    p.stroke(60);
    p.strokeWeight(6);
    p.line(0, 0, 40, 0);
    p.pop();
    
    p.pop();
  };
  
  p.windowResized = function () { 
    p.resizeCanvas(p.windowWidth, p.windowHeight); 
  };
});
