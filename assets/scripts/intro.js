let intro = function (p, containerId, n) {
  let birdsDrawn = 0;
  let birdPositions = [];

  p.setup = function () {
    const canvasContainer = document.getElementById(containerId);
    const canvasWidth = canvasContainer.clientWidth;
    const canvasHeight = canvasContainer.clientHeight;
    p.createCanvas(canvasWidth, canvasHeight);
  };

  p.draw = function () {
    if (p.frameCount % 10 === 0 && birdsDrawn < n) {
      let x, y, size, isOverlapping;
      const marginX = p.width / 3;
      const marginY = p.height / 3;

      do {
        x = p.random(20, p.width - 20);
        y = p.random(20, p.height - 20);
        size = p.random(10, 30);

        isOverlapping =
          (x > marginX && x < 2 * marginX && y > marginY && y < 2 * marginY) ||
          (x > 2 * marginX && y > marginY && y < 2 * marginY);

        for (let i = 0; i < birdPositions.length; i++) {
          const bird = birdPositions[i];
          const distance = p.dist(x, y, bird.x, bird.y);
          if (distance < (size + bird.size) / 2 + 5) {
            isOverlapping = true;
            break;
          }
        }
      } while (isOverlapping);

      p.fill('#202297');
      p.noStroke();
      BirdShapes.bird(p, x, y, size, '#202297');
      birdPositions.push({ x, y, size });
      birdsDrawn++;
    }

    if (birdsDrawn >= n) {
      p.noLoop();
    }
  };
};
