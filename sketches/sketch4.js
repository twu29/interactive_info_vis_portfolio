// Instance-mode sketch for tab 3
registerSketch('sk4', function (p) {
  // Timer State
  let isRunning = false;
  let isPaused = false;
  let startTime = 0;
  let elapsedTimeBeforePause = 0;
  let totalGoalMinutes = 0; 
  
  // Visuals 
  let rotationAngle = 0;
  const innerRadius = 100; // Smaller center
  const outerRadius = 420; // Smaller vinyl (Diameter)
  
  const colorPink = '#F8C8DC'; 
  const colorLightBG = '#F5F5F5'; 
  const colorText = '#4A4A4A'; 

  let input, startBtn, pauseBtn, resetBtn;

  p.setup = function () {
    p.createCanvas(800, 800);
    p.angleMode(p.DEGREES);

    let uiX = 50;
    
    // --- UI PLACEMENT ---
    input = p.createInput('0');
    input.position(uiX, 190); 
    input.style('width', '60px');
    input.style('font-size', '18px');
    input.style('border', '1px solid #ccc');
    input.style('padding', '5px');

    startBtn = p.createButton('START');
    startBtn.position(uiX, 280); 
    startBtn.mousePressed(handleStart);
    styleBtn(startBtn, colorLightBG, '#55B585'); 

    pauseBtn = p.createButton('PAUSE');
    pauseBtn.position(uiX + 90, 280);
    pauseBtn.mousePressed(handlePause);
    styleBtn(pauseBtn, colorLightBG, '#E6A23C'); 

    resetBtn = p.createButton('RESET');
    resetBtn.position(uiX, 335);
    resetBtn.mousePressed(handleReset);
    styleBtn(resetBtn, colorLightBG, '#F56C6C'); 
    resetBtn.style('width', '170px');
  };

  function styleBtn(btn, bg, textCol) {
    btn.style('padding', '10px 12px');
    btn.style('color', textCol);
    btn.style('background-color', bg);
    btn.style('border', '1px solid #ddd');
    btn.style('border-radius', '8px');
    btn.style('cursor', 'pointer');
    btn.style('font-weight', 'bold');
    btn.style('font-size', '13px');
  }

  function handleStart() {
    let val = parseFloat(input.value());
    if (val > 0 && !isRunning) {
      if (!isPaused) {
        totalGoalMinutes = val;
        elapsedTimeBeforePause = 0;
      }
      startTime = p.millis();
      isRunning = true;
      isPaused = false;
    }
  }

  function handlePause() {
    if (isRunning) {
      elapsedTimeBeforePause += p.millis() - startTime;
      isRunning = false;
      isPaused = true;
    }
  }

  function handleReset() {
    isRunning = false;
    isPaused = false;
    elapsedTimeBeforePause = 0;
    rotationAngle = 0;
    totalGoalMinutes = 0;
    input.value('0');
  }

  p.draw = function () {
    p.background(15); 

    // Timer
    let totalElapsedMs = elapsedTimeBeforePause;
    if (isRunning) totalElapsedMs += p.millis() - startTime;

    let totalGoalMs = totalGoalMinutes * 60 * 1000;
    let remainingMs = p.max(0, totalGoalMs - totalElapsedMs);
    let displayM = p.floor(remainingMs / 60000);
    let displayS = p.floor((remainingMs % 60000) / 1000);
    
    let progress = totalGoalMs > 0 ? p.constrain(totalElapsedMs / totalGoalMs, 0, 1) : 0;
    let progressPercent = p.floor(progress * 100);

    // UI
    p.fill(255);
    p.noStroke();
    p.textAlign(p.LEFT);
    p.textSize(60);
    p.text(p.nf(displayM, 2) + ":" + p.nf(displayS, 2), 50, 100);
    
    p.textSize(15);
    p.fill(180);
    p.text("GOAL MINUTES", 50, 190); 

    p.push();
    p.translate(510, 430); 
    
    // Plinth 
    p.fill(28);
    p.rect(-260, -260, 520, 520, 30);

    if (isRunning) rotationAngle += 0.8;

    p.push();
    p.rotate(rotationAngle);
    
    // Black Vinyl
    p.fill(10);
    p.stroke(40);
    p.ellipse(0, 0, outerRadius);
    
    // Grooves
    p.noFill();
    p.stroke(25);
    for (let d = innerRadius; d < outerRadius; d += 10) p.ellipse(0, 0, d);

    // Pink Progress
    if (progress > 0) {
      let currentD = p.map(progress, 0, 1, innerRadius, outerRadius);
      p.noStroke();
      p.fill(colorPink);
      p.ellipse(0, 0, currentD);
    }
    p.pop();

    // White Center Label
    p.fill(255);
    p.noStroke();
    p.ellipse(0, 0, innerRadius);
    p.fill(colorText);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);
    p.text(progressPercent + "%", 0, 0);

    // Shortened Arm
    drawVeryShortArm(p, progress);
    p.pop();
  };

  function drawVeryShortArm(pInst, progress) {
    pInst.push();
    pInst.translate(190, -190); 
    let armAngle = pInst.map(progress, 0, 1, 2, 22);
    pInst.rotate(armAngle);

    // Silver Arm
    pInst.stroke(200);
    pInst.strokeWeight(6);
    pInst.line(0, 0, -80, 110);
    
    // Head
    pInst.fill(60);
    pInst.noStroke();
    pInst.rect(-95, 105, 30, 20, 2);
    
    // Needle
    pInst.stroke(255);
    pInst.strokeWeight(1.5);
    pInst.line(-80, 125, -80, 130);
    pInst.pop();
  }

  p.windowResized = function () {
    p.resizeCanvas(800, 800); 
  };
});