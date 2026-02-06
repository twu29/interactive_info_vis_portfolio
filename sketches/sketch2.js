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
    
    // Draw minute person
    drawPerson(p, minuteAngle, 110, false);
    
    // Draw hour person
    drawPerson(p, hourAngle, 75, true);
    
    p.pop();
  };
  
  function drawPerson(p, angle, length, isHour) {
    p.push();
    p.rotate(angle);
    
    // Position at end of hand
    let x = length;
    let y = 0;
    
    // Draw the person
    p.stroke(30);
    p.strokeWeight(2);
    p.fill(255);
    
    // Head
    p.circle(x, y, 16);
    
    // Body
    p.line(x, y + 8, x, y + 25);
    
    // Arms - pose changes based on angle to show movement
    let armOffset = p.sin(angle * 3) * 3;
    p.line(x, y + 12, x - 8, y + 18 + armOffset);
    p.line(x, y + 12, x + 8, y + 18 - armOffset);
    
    // Legs
    let legOffset = p.sin(angle * 4) * 2;
    p.line(x, y + 25, x - 5, y + 38 + legOffset);
    p.line(x, y + 25, x + 5, y + 38 - legOffset);
    
    // Draw the clock hand line
    p.stroke(60);
    p.strokeWeight(isHour ? 6 : 4);
    p.line(0, 0, x - 25, y);
    
    p.pop();
  }
  
  p.windowResized = function () { 
    p.resizeCanvas(p.windowWidth, p.windowHeight); 
  };
});