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
    
    // Determine pose based on 10-minute intervals
    let poseIndex = p.floor(m / 10);
    
    // Check if hands are close (within 15 degrees) - collision detection
    let angleDiff = p.abs(hourAngle - minuteAngle);
    let areHandsClose = angleDiff < 0.26 || angleDiff > (2 * p.PI - 0.26); // ~15 degrees in radians
    
    // Draw minute person (longer arm)
    // If hands are close, offset the minute person
    let minuteOffset = areHandsClose ? 15 : 0;
    drawPerson(p, minuteAngle, 50, false, poseIndex, minuteOffset);
    
    // Draw hour person (shorter arm)
    drawPerson(p, hourAngle, 20, true, poseIndex, 0);
    
    p.pop();
  };
  
  function drawPerson(p, angle, length, isHour, poseIndex, offset) {
    p.push();
    p.rotate(angle);
    
    // Draw the clock hand line FIRST (behind the person)
    p.stroke(60);
    p.strokeWeight(isHour ? 6 : 4);
    p.line(0, 0, length + 35, 0);
    
    // Position where person is (at end of hand)
    let x = length + 35;
    let y = offset; // Offset for collision avoidance
    
    // Choose pose based on 10-minute interval (0-5 poses)
    if (poseIndex % 2 === 0) {
      // HANGING POSE (0, 2, 4 = 0-9, 20-29, 40-49 minutes)
      drawHangingPose(p, x, y, angle);
    } else {
      // SITTING POSE (1, 3, 5 = 10-19, 30-39, 50-59 minutes)
      drawSittingPose(p, x, y, angle);
    }
    
    p.pop();
  }
  
  function drawHangingPose(p, x, y, angle) {
    // Draw the person HANGING from the hand
    p.stroke(0);
    p.strokeWeight(4);
    p.fill(0);
    
    // Arms reaching UP to grab the hand
    let armSwing = p.sin(angle * 2) * 2;
    p.line(x - 6 + armSwing, y + 8, x - 8, y - 5);
    p.line(x + 6 + armSwing, y + 8, x + 8, y - 5);
    
    // Head
    p.circle(x, y + 8, 18);
    
    // Body
    p.line(x, y + 17, x, y + 33);
    
    // Legs dangling
    let legSwing = p.sin(angle * 3) * 4;
    p.line(x, y + 33, x - 6 + legSwing, y + 48);
    p.line(x, y + 33, x + 6 - legSwing, y + 48);
  }
  
  function drawSittingPose(p, x, y, angle) {
    // Draw the person SITTING on the hand
    p.stroke(0);
    p.strokeWeight(4);
    p.fill(0);
    
    // Head (sitting upright)
    p.circle(x, y - 5, 18);
    
    // Body (sitting upright)
    p.line(x, y + 4, x, y + 20);
    
    // Arms relaxed at sides
    let armBob = p.sin(angle * 2) * 1.5;
    p.line(x, y + 8, x - 12, y + 18 + armBob);
    p.line(x, y + 8, x + 12, y + 18 - armBob);
    
    // Legs bent (sitting position)
    p.line(x, y + 20, x - 8, y + 28); // Upper left leg
    p.line(x - 8, y + 28, x - 8, y + 40); // Lower left leg
    p.line(x, y + 20, x + 8, y + 28); // Upper right leg
    p.line(x + 8, y + 28, x + 8, y + 40); // Lower right leg
  }
  
  p.windowResized = function () { 
    p.resizeCanvas(p.windowWidth, p.windowHeight); 
  };
});