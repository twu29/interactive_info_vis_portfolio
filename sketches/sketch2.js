// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
  let hourWalkAngle = 0; // Continuous walking position for hour person
  let minuteWalkAngle = 0; // Continuous walking position for minute person
  
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
    
    // Calculate clock hand angles
    let hourAngle = p.map(h + m / 60, 0, 12, -p.PI / 2, 3 * p.PI / 2);
    let minuteAngle = p.map(m + s / 60, 0, 60, -p.PI / 2, 3 * p.PI / 2);
    
    // Draw clock hands (simple lines)
    p.stroke(100, 100, 100, 150);
    p.strokeWeight(4);
    p.push();
    p.rotate(minuteAngle);
    p.line(0, 0, 90, 0);
    p.pop();
    
    p.strokeWeight(6);
    p.push();
    p.rotate(hourAngle);
    p.line(0, 0, 60, 0);
    p.pop();
    
    // Update walking positions - they continuously walk around
    hourWalkAngle += 0.005; 
    minuteWalkAngle += 0.015;
    
    // Keep angles in range
    if (hourWalkAngle > p.TWO_PI) hourWalkAngle -= p.TWO_PI;
    if (minuteWalkAngle > p.TWO_PI) minuteWalkAngle -= p.TWO_PI;
    
    // Draw walking minute person OUTSIDE the clock
    drawWalkingPerson(p, minuteWalkAngle, 165, false, false);
    
    // Draw walking hour person INSIDE the clock
    drawWalkingPerson(p, hourWalkAngle, 100, true, true);
    
    p.pop();
  };
  
  function drawWalkingPerson(p, angle, radius, isHour, isInside) {
    p.push();
    
    // Position on the clock edge
    let x = p.cos(angle) * radius;
    let y = p.sin(angle) * radius;
    
    // Move to position
    p.translate(x, y);
    
    // Rotate so person faces forward along the circle (walking direction)
    // If inside, flip the direction so they face the right way
    if (isInside) {
      p.rotate(angle - p.PI / 2); 
    } else {
      p.rotate(angle + p.PI / 2); 
    }
    
    // Walking animation based on angle traveled
    let walkCycle = angle * 5; 
    let step = p.sin(walkCycle) * 8; 
    let armSwing = p.sin(walkCycle) * 6; 
    let bounce = p.abs(p.sin(walkCycle * 2)) * 2; 
    
    // Draw the walking person
    p.stroke(0);
    p.strokeWeight(4);
    p.fill(0);
    
    // Head 
    p.circle(0, -20 - bounce, 18);
    
    // Body
    p.line(0, -11 - bounce, 0, 5 - bounce);
    
    // Arms swinging 
    p.line(0, -8 - bounce, -8, 2 - bounce + armSwing);
    p.line(0, -8 - bounce, 8, 2 - bounce - armSwing);
    
    // Legs walking
    p.line(0, 5 - bounce, -5, 20 + step); 
    p.line(0, 5 - bounce, 5, 20 - step); 
    
    // Feet 
    p.line(-5, 20 + step, -8, 20 + step);
    p.line(5, 20 - step, 8, 20 - step);
    
    p.pop();
  }
  
  p.windowResized = function () { 
    p.resizeCanvas(p.windowWidth, p.windowHeight); 
  };
});