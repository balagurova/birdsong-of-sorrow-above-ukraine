window.gridDone = false;

let sketchGrid = function (p) {
  let cols, rows;
  let months = [];
  let squareSize;
  let canvasMargin = 80;
  let squareSpacing = 32;
  let canvasHeight;
  let img; // Variable to hold the image

  p.preload = function () {
    font = p.loadFont('./assets/fonts/opensans.ttf');
    font2 = p.loadFont('./assets/fonts/Sebastian Bobby.otf');
    csvData = p.loadTable(
      './assets/data/civilian_casualties.csv',
      'csv',
      'header'
    );
    img = p.loadImage('./assets/images/bg.png'); // Load the image
  };

  p.setup = function () {
    for (let i = 0; i < csvData.getRowCount(); i++) {
      let month = csvData.getString(i, 'Month');
      let totalBirds = p.int(csvData.getString(i, 'Killed'));
      months.push({ month, totalBirds });
    }
    p.pixelDensity(4);
    adjustGridLayout();
    p.createCanvas(p.windowWidth, canvasHeight, p.WEBGL);
    p.angleMode(p.DEGREES);
    p.textFont(font);
    p.textSize(12);
    initializeBirds();
  };

  p.draw = function () {
    p.background('#F9EFE9');

    // Draw the birds and text
    for (let monthIndex = 0; monthIndex < months.length; monthIndex++) {
      let col = monthIndex % cols;
      let row = Math.floor(monthIndex / cols);
      let xOffset = canvasMargin / 2 + col * (squareSize + squareSpacing);
      let yOffset = canvasMargin / 2 + row * (squareSize + squareSpacing);

      p.push();
      p.translate(-p.windowWidth / 2 + xOffset, -canvasHeight / 2 + yOffset);

      // Draw the image instead of the rectangle
      p.image(img, 0, 0, squareSize, squareSize); // Resize the image to fit the square size

      p.fill(0);
      p.text(months[monthIndex].month, 0, -8);
      p.text(months[monthIndex].totalBirds, squareSize - 25, -8);

      for (let bird of birds[monthIndex]) {
        p.fill('#202297');
        p.noStroke();
        BirdShapes.bird(p, bird.x, bird.y, p.random(10, 25), '#fff');
      }
      p.pop();
    }

    p.noLoop();
    window.sketchCompleted();
  };

  function adjustGridLayout() {
    if (p.windowWidth > 800) {
      cols = 4;
    } else if (p.windowWidth > 500) {
      cols = 2;
    } else {
      cols = 1;
    }

    rows = p.ceil(months.length / cols);

    let totalHorizontalSpace = canvasMargin + squareSpacing * (cols - 1);
    squareSize = (p.windowWidth - totalHorizontalSpace) / cols;

    let totalVerticalSpace = canvasMargin + squareSpacing * (rows - 1);
    canvasHeight = rows * squareSize + totalVerticalSpace;

    document.getElementById('grid').style.height = `${canvasHeight}px`;
  }

  function initializeBirds() {
    birds = [];
    for (let i = 0; i < months.length; i++) {
      let monthBirds = [];
      for (let j = 0; j < months[i].totalBirds; j++) {
        let bird = {
          x: p.random(15, squareSize - 15),
          y: p.random(15, squareSize - 15),
        };
        monthBirds.push(bird);
      }
      birds.push(monthBirds);
    }
  }

  p.windowResized = function () {
    adjustGridLayout();
    p.resizeCanvas(p.windowWidth, canvasHeight);
    p.redraw();
  };
};

new p5(sketchGrid, 'grid');
