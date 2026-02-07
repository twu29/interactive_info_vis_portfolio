registerSketch('sk4', function (p) {
  // Timer State
  let isRunning = false;
  let isPaused = false;
  let startTime = 0;
  let elapsedTimeBeforePause = 0;
  let totalGoalMinutes = 25;
  
  // UI Elements
  let input, startBtn, pauseBtn, resetBtn;

  p.setup = function () {
    p.createCanvas(1100, 800);
    
    let uiX = 50;
    
    input = p.createInput('10');
    input.position(uiX, 180);
    input.style('width', '80px');
    input.style('font-size', '18px');
    input.style('border', '1px solid #ccc');
    input.style('padding', '5px');
  };

  function handleStart() {
    if (!isRunning) {
      if (!isPaused) {
        totalGoalMinutes = parseFloat(input.value()) || 1;
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
  }

  p.draw = function () {
    p.background(15);

    // TIMER LOGIC (COUNT DOWN)
    let totalElapsedMs = elapsedTimeBeforePause;
    if (isRunning) {
      totalElapsedMs += p.millis() - startTime;
    }

    let totalGoalMs = totalGoalMinutes * 60 * 1000;
    let remainingMs = p.max(0, totalGoalMs - totalElapsedMs);
    
    let displayM = p.floor(remainingMs / 60000);
    let displayS = p.floor((remainingMs % 60000) / 1000);

    // DRAW TIME DISPLAY
    p.fill(255);
    p.noStroke();
    p.textAlign(p.LEFT);
    p.textSize(70);
    p.text(p.nf(displayM, 2) + ":" + p.nf(displayS, 2), 50, 100);
    
    p.textSize(14);
    p.fill(180);
    p.text("GOAL MINUTES", 50, 165);
  };
});