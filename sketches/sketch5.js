// Instance-mode sketch for NBA Efficiency vs Usage Chart
registerSketch('sk5', function (p) {
  let players = [];
  let hoveredPlayer = null;
  let dataLoaded = false;

  let margin, chartLeft, chartRight, chartTop, chartBottom;
  let fgaMin, fgaMax, efgMin, efgMax, ptsMin, ptsMax;
  let fgaMedian, efgMedian;
  let centerX, centerY;

  p.preload = function() {
    p.loadJSON('nba24-25playoff.json', function(rawData) {
      players = rawData
        .filter(player => {
          const fga = parseFloat(player.FGA);
          const pts = parseFloat(player.PTS);
          const efg = parseFloat(player['eFG%']);
          return player.Player !== 'League Average' &&
                 !isNaN(fga) && fga > 0 &&
                 !isNaN(pts) && pts > 0 &&
                 !isNaN(efg) && efg > 0;
        })
        .map(player => ({
          player: player.Player,
          pos: player.Pos,
          team_id: player.Team,
          fga_per_g: parseFloat(player.FGA),
          efg_pct: parseFloat(player['eFG%']),
          pts_per_g: parseFloat(player.PTS)
        }));

      dataLoaded = true;
      console.log(`Loaded ${players.length} players`);
    });
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    calculateDimensions();
    if (dataLoaded) calculateDataRanges();
  };

  function calculateDimensions() {
    margin = { top: 90, right: 200, bottom: 60, left: 100 };
    chartLeft = margin.left;
    chartRight = p.width - margin.right;
    chartTop = margin.top;
    chartBottom = p.height - margin.bottom;
  }

  function calculateDataRanges() {
    const fgaValues = players.map(d => d.fga_per_g);
    const efgValues = players.map(d => d.efg_pct);
    const ptsValues = players.map(d => d.pts_per_g);

    fgaMin = Math.min(...fgaValues);
    fgaMax = Math.max(...fgaValues);
    efgMin = Math.min(...efgValues);
    efgMax = Math.max(...efgValues);
    ptsMin = Math.min(...ptsValues);
    ptsMax = Math.max(...ptsValues);

    fgaMedian = median(fgaValues);
    efgMedian = median(efgValues);

    // Center axes at the exact visual middle
    centerX = (chartLeft + chartRight) / 2;
    centerY = (chartTop + chartBottom) / 2;
  }

  p.draw = function () {
    p.background(245, 240, 230);

    if (!dataLoaded || players.length === 0) {
      p.fill(0);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(20);
      p.text('Loading data...', p.width / 2, p.height / 2);
      return;
    }

    drawTitle();
    drawGrid();
    drawAxes();
    drawPlayers();
    drawAnnotations();
    drawLegend();

    if (hoveredPlayer) {
      drawTooltip(hoveredPlayer);
    }
  };

  function drawTitle() {
    p.fill(0);
    p.noStroke();
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(22);
    p.textStyle(p.BOLD);
    p.text('Efficiency vs. Usage: What Drives Scoring in the 2024–2025 NBA Playoffs?', p.width / 2, 14);
  }

  function drawGrid() {
    p.stroke(210, 200, 185);
    p.strokeWeight(1);

    const cols = 8;
    const rows = 8;
    for (let i = 0; i <= cols; i++) {
      const x = chartLeft + ((chartRight - chartLeft) / cols) * i;
      p.line(x, chartTop, x, chartBottom);
    }
    for (let i = 0; i <= rows; i++) {
      const y = chartTop + ((chartBottom - chartTop) / rows) * i;
      p.line(chartLeft, y, chartRight, y);
    }
  }

  function drawAxes() {
    const arrowSize = 10;

    p.stroke(0);
    p.strokeWeight(2);

    // Horizontal axis (full width through median Y)
    p.line(chartLeft, centerY, chartRight, centerY);
    // Vertical axis (full height through median X)
    p.line(centerX, chartTop, centerX, chartBottom);

    // Arrowheads
    p.fill(0);
    p.noStroke();

    // Right arrow (High Usage)
    p.triangle(chartRight, centerY,
               chartRight - arrowSize, centerY - arrowSize / 2,
               chartRight - arrowSize, centerY + arrowSize / 2);
    // Left arrow (Low Usage)
    p.triangle(chartLeft, centerY,
               chartLeft + arrowSize, centerY - arrowSize / 2,
               chartLeft + arrowSize, centerY + arrowSize / 2);
    // Up arrow (Efficient)
    p.triangle(centerX, chartTop,
               centerX - arrowSize / 2, chartTop + arrowSize,
               centerX + arrowSize / 2, chartTop + arrowSize);
    // Down arrow (Inefficient)
    p.triangle(centerX, chartBottom,
               centerX - arrowSize / 2, chartBottom - arrowSize,
               centerX + arrowSize / 2, chartBottom - arrowSize);

    // Axis endpoint labels
    p.textStyle(p.BOLD);
    p.textSize(14);

    // X-axis labels
    p.textAlign(p.LEFT, p.CENTER);
    p.text('HIGH USAGE', chartRight + 8, centerY);

    p.textAlign(p.RIGHT, p.CENTER);
    p.text('LOW USAGE', chartLeft - 8, centerY);

    // Y-axis labels
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text('EFFICIENT', centerX, chartTop - 8);

    p.textAlign(p.CENTER, p.TOP);
    p.text('INEFFICIENT', centerX, chartBottom + 8);
  }

  function drawPlayers() {
    // Non-hovered first
    for (let player of players) {
      if (hoveredPlayer !== player) drawPlayer(player, false);
    }
    // Hovered on top
    if (hoveredPlayer) drawPlayer(hoveredPlayer, true);
  }

  function drawPlayer(player, isHovered) {
    const x = mapPlayerX(player.fga_per_g);
    const y = mapPlayerY(player.efg_pct);

    let dotSize = p.map(player.pts_per_g, ptsMin, ptsMax, 8, 35);
    if (isHovered) dotSize *= 1.3;

    const posColor = getPositionColor(player.pos);

    if (isHovered) {
      p.fill(posColor[0], posColor[1], posColor[2], 100);
      p.noStroke();
      p.circle(x, y, dotSize + 8);
    }

    p.fill(posColor[0], posColor[1], posColor[2], isHovered ? 255 : 200);
    p.stroke(0);
    p.strokeWeight(isHovered ? 2.5 : 1.5);
    p.circle(x, y, dotSize);
  }

  const POSITION_COLORS = {
    'PG': [66, 133, 244],   // Blue
    'SG': [234, 67, 53],    // Red
    'SF': [52, 168, 83],    // Green
    'PF': [251, 188, 4],    // Yellow
    'C':  [171, 71, 188]    // Purple
  };

  function getPositionColor(pos) {
    return POSITION_COLORS[pos] || [150, 150, 150];
  }

  function drawAnnotations() {
    if (players.length === 0) return;

    // Find the three notable players
    let highestUsage = players[0];
    let highestEFG = players[0];
    let highestScore = players[0];

    for (let pl of players) {
      if (pl.fga_per_g > highestUsage.fga_per_g) highestUsage = pl;
      if (pl.efg_pct > highestEFG.efg_pct) highestEFG = pl;
      if (pl.pts_per_g > highestScore.pts_per_g) highestScore = pl;
    }

    const annotations = [
      { player: highestUsage,  label: 'Highest Usage'  },
      { player: highestEFG,    label: 'Highest eFG%'   },
      { player: highestScore,  label: 'Highest Scorer' }
    ];

    // Deduplicate — if the same player holds multiple records, merge labels
    const seen = new Map();
    for (let a of annotations) {
      const key = a.player.player;
      if (seen.has(key)) {
        seen.get(key).label += ' / ' + a.label;
      } else {
        seen.set(key, { ...a });
      }
    }

    // Pre-compute all dot positions and radii for overlap testing
    const dotInfos = players.map(pl => ({
      x: mapPlayerX(pl.fga_per_g),
      y: mapPlayerY(pl.efg_pct),
      r: p.map(pl.pts_per_g, ptsMin, ptsMax, 8, 35) / 2
    }));

    const entries = Array.from(seen.values());
    const boxH = 36;
    const pad = 8; // extra padding around dots when checking overlap

    // 8 candidate directions at multiple distances
    const baseDirections = [
      { anchorX: 0.5, anchorY: 1,   dx: 0,  dy: -1 },  // top
      { anchorX: 0,   anchorY: 1,   dx: 1,  dy: -1 },  // top-right
      { anchorX: 0,   anchorY: 0.5, dx: 1,  dy: 0  },  // right
      { anchorX: 0,   anchorY: 0,   dx: 1,  dy: 1  },  // bottom-right
      { anchorX: 0.5, anchorY: 0,   dx: 0,  dy: 1  },  // bottom
      { anchorX: 1,   anchorY: 0,   dx: -1, dy: 1  },  // bottom-left
      { anchorX: 1,   anchorY: 0.5, dx: -1, dy: 0  },  // left
      { anchorX: 1,   anchorY: 1,   dx: -1, dy: -1 }   // top-left
    ];

    // Try each direction at 3 increasing distances
    const distMultipliers = [1, 2, 3];

    for (let a of entries) {
      const px = mapPlayerX(a.player.fga_per_g);
      const py = mapPlayerY(a.player.efg_pct);
      const dotR = p.map(a.player.pts_per_g, ptsMin, ptsMax, 8, 35) / 2;

      p.textSize(11);
      p.textStyle(p.BOLD);
      const nameText = a.player.player;
      const tagText = a.label;
      const boxW = Math.max(p.textWidth(nameText), p.textWidth(tagText)) + 14;

      // Test each direction at multiple distances, pick the one with fewest dot overlaps
      let bestBx = 0, bestBy = 0, bestOverlaps = Infinity;

      for (let mult of distMultipliers) {
        for (let dir of baseDirections) {
          const offset = dotR + 10 + (mult - 1) * 25;
          const bx = px + dir.dx * offset - dir.anchorX * boxW;
          const by = py + dir.dy * offset - dir.anchorY * boxH;

          // Skip if box goes outside chart
          if (bx < chartLeft || bx + boxW > chartRight ||
              by < chartTop || by + boxH > chartBottom) continue;

          // Count how many dots overlap with this box (with padding)
          let overlaps = 0;
          for (let d of dotInfos) {
            const closestX = Math.max(bx - pad, Math.min(d.x, bx + boxW + pad));
            const closestY = Math.max(by - pad, Math.min(d.y, by + boxH + pad));
            const dist = Math.sqrt((d.x - closestX) ** 2 + (d.y - closestY) ** 2);
            if (dist < d.r) overlaps++;
          }

          // Prefer closer placements when overlap count is equal
          const score = overlaps * 1000 + mult;
          if (score < bestOverlaps) {
            bestOverlaps = score;
            bestBx = bx;
            bestBy = by;
          }
        }
        // If we found a zero-overlap placement, stop searching further distances
        if (bestOverlaps < 1000) break;
      }

      // Leader line from dot edge to nearest box edge
      p.stroke(80);
      p.strokeWeight(1);
      p.drawingContext.setLineDash([4, 3]);
      const lineEndX = Math.max(bestBx, Math.min(px, bestBx + boxW));
      const lineEndY = Math.max(bestBy, Math.min(py, bestBy + boxH));
      p.line(px, py, lineEndX, lineEndY);
      p.drawingContext.setLineDash([]);

      // Label background
      p.fill(255, 255, 255, 240);
      p.stroke(120);
      p.strokeWeight(1);
      p.rect(bestBx, bestBy, boxW, boxH, 4);

      // Player name
      p.noStroke();
      p.fill(30);
      p.textAlign(p.LEFT, p.TOP);
      p.textSize(11);
      p.textStyle(p.BOLD);
      p.text(nameText, bestBx + 7, bestBy + 4);

      // Tag line
      p.fill(100);
      p.textStyle(p.NORMAL);
      p.textSize(10);
      p.text(tagText, bestBx + 7, bestBy + 19);
    }
  }

  function drawTooltip(player) {
    const x = mapPlayerX(player.fga_per_g);
    const y = mapPlayerY(player.efg_pct);

    const tooltipWidth = 210;
    const tooltipHeight = 90;
    let tooltipX = x + 20;
    let tooltipY = y - tooltipHeight / 2;

    if (tooltipX + tooltipWidth > p.width - 10) tooltipX = x - tooltipWidth - 20;
    if (tooltipY < 10) tooltipY = 10;
    if (tooltipY + tooltipHeight > p.height - 10) tooltipY = p.height - tooltipHeight - 10;

    p.fill(255, 255, 255, 250);
    p.stroke(100);
    p.strokeWeight(2);
    p.rect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 5);

    p.fill(0);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(14);
    p.textStyle(p.BOLD);
    p.text(player.player, tooltipX + 10, tooltipY + 10);

    const posCol = getPositionColor(player.pos);
    p.fill(posCol[0], posCol[1], posCol[2]);
    p.noStroke();
    p.circle(tooltipX + 18, tooltipY + 36, 10);
    p.fill(0);
    p.textStyle(p.NORMAL);
    p.textSize(12);
    p.text(`${player.pos} • ${player.team_id}`, tooltipX + 28, tooltipY + 28);
    p.text(`${player.pts_per_g.toFixed(1)} PPG`, tooltipX + 10, tooltipY + 45);
    p.text(`${player.fga_per_g.toFixed(1)} FGA | ${(player.efg_pct * 100).toFixed(1)}% eFG`, tooltipX + 10, tooltipY + 62);
  }

  function drawLegend() {
    const positions = [
      { abbr: 'PG', full: 'Point Guard', pos: 'PG' },
      { abbr: 'SG', full: 'Shooting Guard', pos: 'SG' },
      { abbr: 'SF', full: 'Small Forward', pos: 'SF' },
      { abbr: 'PF', full: 'Power Forward', pos: 'PF' },
      { abbr: 'C',  full: 'Center', pos: 'C' }
    ];

    const legendX = chartRight + 20;
    let curY = chartTop + 10;

    // Position legend
    p.fill(0);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(13);
    p.textStyle(p.BOLD);
    p.text('Position', legendX, curY);
    curY += 22;

    p.textSize(11);
    p.textAlign(p.LEFT, p.CENTER);

    for (let i = 0; i < positions.length; i++) {
      const col = getPositionColor(positions[i].pos);

      p.fill(col[0], col[1], col[2]);
      p.stroke(0);
      p.strokeWeight(1);
      p.circle(legendX + 8, curY + 2, 12);

      p.noStroke();
      p.textStyle(p.BOLD);
      p.text(positions[i].abbr, legendX + 20, curY + 2);

      p.fill(60);
      p.textStyle(p.NORMAL);
      p.text(positions[i].full, legendX + 38, curY + 2);

      curY += 22;
    }

    // Dot size
    curY += 10;
    p.fill(0);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(13);
    p.textStyle(p.BOLD);
    p.text('Dot Size', legendX, curY);
    curY += 18;
    p.textSize(11);
    p.textStyle(p.NORMAL);
    p.fill(60);
    p.text('Points scored per game', legendX, curY);

    // Glossary
    curY += 28;
    p.fill(0);
    p.textSize(13);
    p.textStyle(p.BOLD);
    p.text('Glossary', legendX, curY);
    curY += 20;

    const glossary = [
      ['eFG%', 'Effective Field Goal %'],
      ['FGA', 'Field Goal Attempts'],
      ['PPG', 'Points Per Game']
    ];

    p.textSize(11);
    for (let i = 0; i < glossary.length; i++) {
      p.fill(0);
      p.textStyle(p.BOLD);
      p.text(glossary[i][0], legendX, curY);

      p.fill(60);
      p.textStyle(p.NORMAL);
      p.text(glossary[i][1], legendX + 38, curY);

      curY += 18;
    }
  }

  p.mouseMoved = function() {
    if (!dataLoaded) return;

    let found = null;
    let minDist = 20;

    for (let player of players) {
      const x = mapPlayerX(player.fga_per_g);
      const y = mapPlayerY(player.efg_pct);

      const d = p.dist(p.mouseX, p.mouseY, x, y);
      if (d < minDist) {
        minDist = d;
        found = player;
      }
    }

    hoveredPlayer = found;
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    calculateDimensions();
    if (dataLoaded) calculateDataRanges();
  };

  // Map data value to pixel, pinning the median at the visual center
  function mapPlayerX(fga) {
    if (fga <= fgaMedian) {
      return mapValue(fga, fgaMin, fgaMedian, chartLeft, centerX);
    } else {
      return mapValue(fga, fgaMedian, fgaMax, centerX, chartRight);
    }
  }

  function mapPlayerY(efg) {
    if (efg <= efgMedian) {
      return mapValue(efg, efgMin, efgMedian, chartBottom, centerY);
    } else {
      return mapValue(efg, efgMedian, efgMax, centerY, chartTop);
    }
  }

  function mapValue(value, inMin, inMax, outMin, outMax) {
    if (inMax === inMin) return (outMin + outMax) / 2;
    return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
  }

  function median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }
});
