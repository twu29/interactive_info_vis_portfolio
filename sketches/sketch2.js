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
    
    // Draw clock hands
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
    
    // Walking positions 
    hourWalkAngle += 0.005; 
    minuteWalkAngle += 0.015; 
    
    // Keep angles in range
    if (hourWalkAngle > p.TWO_PI) hourWalkAngle -= p.TWO_PI;
    if (minuteWalkAngle > p.TWO_PI) minuteWalkAngle -= p.TWO_PI;
    
    // Draw walking minute person OUTSIDE the clock (with top hat)
    drawWalkingPerson(p, minuteWalkAngle, 165, false, false, 'tophat');
    
    // Draw walking hour person INSIDE the clock (with baseball cap)
    drawWalkingPerson(p, hourWalkAngle, 100, true, true, 'cap');
    
    p.pop();
  };
  
  function drawWalkingPerson(p, angle, radius, isHour, isInside, hatType) {
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
    
    // Draw hat FIRST (behind head)
    if (hatType === 'tophat') {
      drawTopHat(p, 0, -20 - bounce);
    } else if (hatType === 'cap') {
      drawBaseballCap(p, 0, -20 - bounce);
    }
    
    // Head (bounces slightly while walking)
    p.fill(0);
    p.stroke(0);
    p.strokeWeight(4);
    p.circle(0, -20 - bounce, 18);
    
    // Body
    p.line(0, -11 - bounce, 0, 5 - bounce);
    
    // Arms swinging (opposite to legs)
    p.line(0, -8 - bounce, -8, 2 - bounce + armSwing);
    p.line(0, -8 - bounce, 8, 2 - bounce - armSwing);
    
    // Legs walking
    p.line(0, 5 - bounce, -5, 20 + step); 
    p.line(0, 5 - bounce, 5, 20 - step); 
    
    // Feet (little horizontal lines)
    p.line(-5, 20 + step, -8, 20 + step);
    p.line(5, 20 - step, 8, 20 - step);
    
    p.pop();
  }
  
  function drawTopHat(p, x, y) {
    // Classic tall top hat
    p.fill(0);
    p.stroke(0);
    p.strokeWeight(2);
    
    // Hat brim
    p.rect(x - 12, y - 10, 24, 3);
    
    // Hat top (tall cylinder)
    p.rect(x - 8, y - 26, 16, 16);
    
    // Hat top circle
    p.line(x - 8, y - 26, x + 8, y - 26);
  }
  
  function drawBaseballCap(p, x, y) {
    // Baseball cap with bill
    p.fill(0);
    p.stroke(0);
    p.strokeWeight(3);
    
    // Cap dome 
    p.arc(x, y - 2, 20, 16, p.PI, p.TWO_PI);
    
    // Cap bill 
    p.strokeWeight(2);
    p.line(x - 10, y - 2, x - 18, y);
    p.line(x - 10, y + 2, x - 18, y + 3);
    p.line(x - 18, y, x - 18, y + 3);
  }
  
  p.windowResized = function () { 
    p.resizeCanvas(p.windowWidth, p.windowHeight); 
  };
});