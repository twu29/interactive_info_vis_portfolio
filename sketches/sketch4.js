registerSketch('sk4', function (p) {
  // Timer State
  let isRunning = false;
  let isPaused = false;
  let startTime = 0;
  let elapsedTimeBeforePause = 0;
  let totalGoalMinutes = 0; 
  
  // Visuals
  let rotationAngle = 0;
  const innerRadius = 130; 
  const outerRadius = 520; 
  
  const colorPink = '#F8C8DC'; 
  const colorLightBG = '#F5F5F5'; 
  const colorText = '#4A4A4A'; 

  let input, startBtn, pauseBtn, resetBtn;

  p.setup = function () {
    p.createCanvas(1100, 800);
    p.angleMode(p.DEGREES);

    let uiX = 50;
    
    // --- UI PLACEMENT ---
    
    // 1. Input Box (Placed at y: 210)
    input = p.createInput('0');
    input.position(uiX, 210); 
    input.style('width', '60px');
    input.style('font-size', '18px');
    input.style('border', '1px solid #ccc');
    input.style('padding', '5px');

    // 2. Buttons (Moved further down to y: 300 to leave a big gap)
    startBtn = p.createButton('START');
    startBtn.position(uiX, 300); 
    startBtn.mousePressed(handleStart);
    styleBtn(startBtn, colorLightBG, '#55B585'); 

    pauseBtn = p.createButton('PAUSE');
    pauseBtn.position(uiX + 95, 300);
    pauseBtn.mousePressed(handlePause);
    styleBtn(pauseBtn, colorLightBG, '#E6A23C'); 

    resetBtn = p.createButton('RESET');
    resetBtn.position(uiX, 355);
    resetBtn.mousePressed(handleReset);
    styleBtn(resetBtn, colorLightBG, '#F56C6C'); 
    resetBtn.style('width', '180px');
  };

  function styleBtn(btn, bg, textCol) {
    btn.style('padding', '10px 15px');
    btn.style('color', textCol);
    btn.style('background-color', bg);
    btn.style('border', '1px solid #ddd');
    btn.style('border-radius', '8px');
    btn.style('cursor', 'pointer');
    btn.style('font-weight', 'bold');
    btn.style('font-size', '14px');
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

    // --- TIMER LOGIC ---
    let totalElapsedMs = elapsedTimeBeforePause;
    if (isRunning) totalElapsedMs += p.millis() - startTime;

    let totalGoalMs = totalGoalMinutes * 60 * 1000;
    let remainingMs = p.max(0, totalGoalMs - totalElapsedMs);
    let displayM = p.floor(remainingMs / 60000);
    let displayS = p.floor((remainingMs % 60000) / 1000);
    
    let progress = totalGoalMs > 0 ? p.constrain(totalElapsedMs / totalGoalMs, 0, 1) : 0;
    let progressPercent = p.floor(progress * 100);

    // --- UI TEXT ---
    // Countdown Time
    p.fill(255);
    p.noStroke();
    p.textAlign(p.LEFT);
    p.textSize(70);
    p.text(p.nf(displayM, 2) + ":" + p.nf(displayS, 2), 50, 110);
    
    // LABEL: Placed at y: 190 (Clearly ABOVE the input box at 210)
    p.textSize(16);
    p.fill(200);
    p.text("GOAL MINUTES:", 50, 195); 
    
    if (isRunning) {
      p.fill(200, 255, 200);
      p.textSize(14);
      p.text("● RECORDING...", 50, 430); 
    } else if (isPaused) {
      p.fill(255, 230, 150);
      p.textSize(14);
      p.text("║║ PAUSED", 50, 430);
    }

    // --- RECORD PLAYER ---
    p.push();
    p.translate(650, 420); 
    p.fill(30);
    p.rect(-320, -320, 640, 640, 40);

    if (isRunning) rotationAngle += 0.8;

    p.push();
    p.rotate(rotationAngle);
    p.fill(10);
    p.stroke(40);
    p.ellipse(0, 0, outerRadius);
    p.noFill();
    p.stroke(25);
    for (let d = innerRadius; d < outerRadius; d += 12) p.ellipse(0, 0, d);

    if (progress > 0) {
      let currentD = p.map(progress, 0, 1, innerRadius, outerRadius);
      p.noStroke();
      p.fill(colorPink);
      p.ellipse(0, 0, currentD);
    }
    p.pop();

    p.fill(255);
    p.noStroke();
    p.ellipse(0, 0, innerRadius);
    p.fill(colorText);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(32);
    p.text(progressPercent + "%", 0, 0);

    // DRAW THE SHORT ARM
    drawVeryShortArm(p, progress);
    p.pop();
  };

  function drawVeryShortArm(pInst, progress) {
    pInst.push();
    // Pivot stays in top right
    pInst.translate(240, -240); 
    let armAngle = pInst.map(progress, 0, 1, 2, 20);
    pInst.rotate(armAngle);

    // Shadow
    pInst.stroke(0, 80);
    pInst.strokeWeight(6);
    pInst.line(4, 4, -80, 120);

    // Silver Arm (Very Short)
    pInst.stroke(200);
    pInst.strokeWeight(7);
    pInst.line(0, 0, -80, 120);
    
    // Headshell
    pInst.fill(60);
    pInst.noStroke();
    pInst.rect(-95, 115, 30, 20, 2);
    
    // Needle
    pInst.stroke(255);
    pInst.strokeWeight(1.5);
    pInst.line(-80, 135, -80, 140);
    pInst.pop();
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});