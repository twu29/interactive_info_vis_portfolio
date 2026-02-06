// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  let blindHeight = 190;
  let targetHeight = 190;
  let isPulled = true;
  let stars = [];
  let shootingStar = null;
  let timeShown = 0;
  let autoCloseDelay = 3000;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    // Initialize stars for night sky
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: p.random(-150, 150),
        y: p.random(-100, 100),
        size: p.random(1, 3),
        twinkle: p.random(0, p.TWO_PI),
      });
    }
  };

  p.draw = function () {
    p.background(245, 240, 230);

    // Get current time
    let h = p.hour();
    let m = p.minute();
    let isNight = h < 6 || h >= 18; // Night time: 6pm to 6am

    // Auto-close blind after 3 seconds
    if (!isPulled && p.millis() - timeShown > autoCloseDelay) {
      isPulled = true;
      targetHeight = 190;
    }

    // Draw window frame
    p.push();
    p.translate(p.width / 2, p.height / 2);

    // Window background
    p.noStroke();
    if (isNight) {
      // Night sky gradient
      for (let i = -100; i < 100; i++) {
        let inter = p.map(i, -100, 100, 0, 1);
        let c = p.lerpColor(p.color(10, 10, 40), p.color(30, 20, 60), inter);
        p.stroke(c);
        p.line(-150, i, 150, i);
      }
      p.noStroke();

      // Draw stars with twinkling effect
      for (let star of stars) {
        let brightness = p.map(
          p.sin(star.twinkle + p.frameCount * 0.05),
          -1,
          1,
          100,
          255
        );
        p.fill(255, 255, 200, brightness);
        p.circle(star.x, star.y, star.size);
      }

      // Shooting star
      if (p.random(1) < 0.01 && shootingStar === null) {
        shootingStar = {
          x: p.random(-150, 150),
          y: p.random(-100, -50),
          vx: p.random(3, 6),
          vy: p.random(2, 4),
          life: 30,
        };
      }

      if (shootingStar) {
        p.stroke(255, 255, 255, shootingStar.life * 8);
        p.strokeWeight(2);
        p.line(
          shootingStar.x,
          shootingStar.y,
          shootingStar.x - shootingStar.vx * 5,
          shootingStar.y - shootingStar.vy * 5
        );
        shootingStar.x += shootingStar.vx;
        shootingStar.y += shootingStar.vy;
        shootingStar.life--;

        if (shootingStar.life <= 0) {
          shootingStar = null;
        }
      }
    } else {
      // Day sky gradient
      for (let i = -100; i < 100; i++) {
        let inter = p.map(i, -100, 100, 0, 1);
        let c = p.lerpColor(
          p.color(135, 206, 235),
          p.color(200, 230, 255),
          inter
        );
        p.stroke(c);
        p.line(-150, i, 150, i);
      }
      p.noStroke();

      // Draw sun
      p.fill(255, 220, 0);
      p.circle(100, -60, 32);

      // Sun rays
      p.stroke(255, 230, 100);
      p.strokeWeight(2);
      for (let a = 0; a < p.TWO_PI; a += p.PI / 8) {
        let x1 = 100 + p.cos(a + p.frameCount * 0.02) * 18;
        let y1 = -60 + p.sin(a + p.frameCount * 0.02) * 18;
        let x2 = 100 + p.cos(a + p.frameCount * 0.02) * 24;
        let y2 = -60 + p.sin(a + p.frameCount * 0.02) * 24;
        p.line(x1, y1, x2, y2);
      }
      p.noStroke();

      // Draw flowers at bottom
      let flowerPositions = [-120, -70, -20, 30, 80, 130];
      let petalColors = [
        [255, 100, 150],
        [255, 200, 50],
        [150, 100, 255],
        [255, 150, 200],
      ];

      for (let i = 0; i < flowerPositions.length; i++) {
        let fx = flowerPositions[i];

        // Stem
        p.stroke(50, 150, 50);
        p.strokeWeight(2);
        p.line(fx, 100, fx, 70);

        // Flower petals
        p.noStroke();
        let colorIndex = i % petalColors.length;
        p.fill(...petalColors[colorIndex]);

        for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / 5) {
          let px = fx + p.cos(a) * 8;
          let py = 70 + p.sin(a) * 8;
          p.circle(px, py, 12);
        }

        // Flower center
        p.fill(255, 220, 0);
        p.circle(fx, 70, 8);
      }

      // Grass
      p.fill(100, 180, 100);
      p.rect(-150, 85, 300, 15);
    }

    // Digital time display when blind is open
    if (blindHeight < 100) {
      let timeY = 0;

      p.noStroke();

      // glow
      if (isNight) {
        p.fill(255, 255, 255, 50);
      } else {
        p.fill(80, 80, 80, 50);
      }
      p.textSize(52);
      p.textAlign(p.CENTER, p.CENTER);
      p.textFont("Georgia");
      p.textStyle(p.BOLD);
      let timeStr = p.nf(h, 2) + ":" + p.nf(m, 2);
      p.text(timeStr, 0, timeY);

      // main text
      if (isNight) {
        p.fill(255);
      } else {
        p.fill(80);
      }
      p.textSize(48);
      p.textAlign(p.CENTER, p.CENTER);
      p.textFont("Georgia");
      p.textStyle(p.BOLD);
      p.text(timeStr, 0, timeY);
    }

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
    p.noStroke();
    for (let i = 0; i < blindHeight; i += 12) {
      // Main slat
      p.fill(165, 155, 145);
      p.rect(-150, -100 + i, 300, 10);

      // Slat shadow/depth
      p.fill(140, 130, 120);
      p.rect(-150, -100 + i + 8, 300, 2);

      // Slat highlight
      p.fill(190, 180, 170);
      p.rect(-150, -100 + i, 300, 1);
    }

    // Draw pull string
    p.stroke(100, 90, 80);
    p.strokeWeight(2);
    p.line(0, -100 + blindHeight, 0, -100 + blindHeight + 40);

    // Pull string circle hover check (screen coords)
    let stringX = p.width / 2;
    let stringY = p.height / 2 - 100 + blindHeight + 40;
    let d = p.dist(p.mouseX, p.mouseY, stringX, stringY);

    if (d < 20) {
      p.fill(180, 160, 140);
    } else {
      p.fill(140, 120, 100);
    }
    p.noStroke();
    p.circle(0, -100 + blindHeight + 40, 12);

    // Interactive instructions
    p.fill(100);
    p.textSize(14);
    p.textAlign(p.CENTER);
    p.textStyle(p.NORMAL);
    p.textFont("Georgia");
    p.text("Click to pull the blind", 0, 140);

    p.pop();
  };

  p.mousePressed = function () {
    // Check if clicking near the pull string 
    let stringX = p.width / 2;
    let stringY = p.height / 2 - 100 + blindHeight + 40;
    let d = p.dist(p.mouseX, p.mouseY, stringX, stringY);

    if (d < 30) {
      if (isPulled) {
        // Open the blind
        isPulled = false;
        targetHeight = 0;
        timeShown = p.millis();
      } else {
        // Close the blind immediately if user clicks again
        isPulled = true;
        targetHeight = 190;
      }
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
