let sketchOne = function (p) {
  let monthHeight = 400;
  const xPadding = 30; // Padding from the left and right edges
  let font, csvData;
  let birds = [];
  let months = [];
  let exclusionZones = [];
  let images = []; // Array to hold images

  p.preload = function () {
    for (let i = 1; i <= 12; i++) {
      let filename = i.toString().padStart(2, '0') + '.png'; // Generate '01.png', '02.png', etc.
      let path = `./assets/images/bg/${filename}`;
      images.push(p.loadImage(path));
    }

    csvData = p.loadTable(
      './assets/data/civilian_casualties.csv',
      'csv',
      'header'
    );
  };

  p.setup = function () {
    let canvasHeight = monthHeight * months.length;

    // Get the div with ID 'one'
    let container = document.getElementById('one');
    // Check if the container exists
    if (container) {
      let canvasWidth = container.offsetWidth;
      p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
    } else {
      console.error("Div with ID 'one' not found.");
      p.createCanvas(p.windowWidth, canvasHeight, p.WEBGL);
    }

    p.angleMode(p.DEGREES);
    initializeBirds();

    p.noLoop();
  };

  // Check if a point is inside a rectangular zone
  function isInsideRect(x, y, zone) {
    return (
      x >= zone.x &&
      x <= zone.x + zone.width &&
      y >= zone.y &&
      y <= zone.y + zone.height
    );
  }

  // Check if a point is inside a buffer zone
  function isInsideBufferZone(x, y, zone, bufferSize) {
    return (
      x >= zone.x - bufferSize &&
      x <= zone.x + zone.width + bufferSize &&
      y >= zone.y - bufferSize &&
      y <= zone.y + zone.height + bufferSize &&
      !isInsideRect(x, y, zone) // Exclude the main exclusion zone
    );
  }

  // Determine zone status
  function isInsideExclusionZoneOrBuffer(x, y) {
    for (const zone of exclusionZones) {
      if (isInsideRect(x, y, zone)) {
        return 'exclusion'; // Inside exclusion zone
      }
      if (isInsideBufferZone(x, y, zone, 50)) {
        // Buffer size: 50px
        return 'buffer'; // Inside buffer zone
      }
    }
    return 'none'; // Not inside any zone
  }

  // Initialize birds
  function initializeBirds() {
    birds = [];
    const topConstraint = monthHeight * 0.8;

    for (let i = 0; i < months.length; i++) {
      const totalBirds = p.int(csvData.getString(i, 'Killed')) || 0;
      const childrenKilled =
        p.int(csvData.getString(i, 'Children Killed')) || 0;
      const highlightCount = p.int(csvData.getString(i, 'Highlighted')) || 0;
      const lowerLimit = i === 0 ? topConstraint : monthHeight * i;
      const upperLimit =
        i === months.length - 1
          ? lowerLimit + monthHeight * 0.9
          : lowerLimit + monthHeight;

      // Define Gaussian parameters for clustering birds
      const yRangeCenter = (lowerLimit + upperLimit) / 2; // Center of the range
      const yRangeDeviation = (upperLimit - lowerLimit) / 4; // Spread

      const xRangeCenter = p.width / 2; // Center horizontally
      const xRangeDeviation = p.width / 4; // Spread

      // Define a cluster center for highlighted birds
      const clusterCenterX = p.random(xRangeCenter, xRangeCenter); // Small spread around x center
      const clusterCenterY = p.random(yRangeCenter, yRangeCenter); // Small spread around y center
      const clusterDeviation = 75; // Spread for highlighted birds

      let highlightAssigned = 0;

      const monthBirds = Array.from({ length: totalBirds }, (_, birdIndex) => {
        let bird;
        do {
          let yPosition, xPosition;
          if (highlightAssigned < highlightCount) {
            // Place highlighted birds near the cluster center
            do {
              yPosition = p.randomGaussian(clusterCenterY, clusterDeviation);
              xPosition = p.randomGaussian(clusterCenterX, clusterDeviation);
            } while (
              isInsideExclusionZoneOrBuffer(xPosition, yPosition) !== 'none' ||
              xPosition < xPadding ||
              xPosition > p.width - xPadding // Ensure xPosition stays within padding
            );
          } else if (totalBirds > 2000) {
            // Use Gaussian distribution for placement of other birds
            do {
              yPosition = p.randomGaussian(yRangeCenter, yRangeDeviation);
              xPosition = p.randomGaussian(xRangeCenter, xRangeDeviation);
            } while (
              xPosition < xPadding ||
              xPosition > p.width - xPadding // Ensure xPosition stays within padding
            );
          } else {
            // Use uniform random placement for fewer birds
            yPosition = p.random(lowerLimit, upperLimit);
            xPosition = p.random(xPadding, p.width - xPadding);
          }

          const zoneStatus = isInsideExclusionZoneOrBuffer(
            xPosition,
            yPosition
          );

          // Birds outside exclusion zones and in buffer zones should have reduced density
          if (
            zoneStatus === 'none' ||
            (zoneStatus === 'buffer' && Math.random() < 0.3)
          ) {
            let birdColor;

            // Assign color based on type and highlight logic
            if (highlightAssigned < highlightCount) {
              birdColor = '#DFC282'; // Yellow color for highlighted birds
              highlightAssigned++;
            } else {
              birdColor = birdIndex < childrenKilled ? '#7B86FF' : '#fff';
            }

            bird = {
              x: xPosition,
              y: yPosition,
              color: birdColor,
            };
          }
        } while (!bird); // Retry until a valid position is found

        return bird;
      });

      birds.push(monthBirds);
    }
  }

  p.draw = function () {
    p.translate(-p.width / 2, -p.height / 2);

    let y = 0; // Starting y-coordinate
    let imageIndex = 0;

    images.forEach((img) => {
      // Calculate the height to maintain the aspect ratio
      let scaledHeight = Math.round((img.height / img.width) * p.width); // Round to the nearest integer

      // Draw the image at the calculated position and size
      p.image(img, 0, y, p.width, scaledHeight);

      // Update y-coordinate for the next image
      y += scaledHeight - 10; // Subtract 5 for overlap if needed, ensuring it's rounded
    });

    // Draw main birds
    for (let monthIndex = 0; monthIndex < months.length; monthIndex++) {
      for (let bird of birds[monthIndex]) {
        p.push();
        p.translate(bird.x, bird.y);
        p.noStroke();
        BirdShapes.bird(p, 0, 0, p.random(10, 15), bird.color);
        p.pop();
      }
    }

    // Draw exclusion zones and buffer zones for debugging
    exclusionZones.forEach((zone) => {
      // Main exclusion zone
      p.noFill();
      p.noStroke();
      // p.stroke(255, 0, 0);
      p.rect(zone.x, zone.y, zone.width, zone.height);

      // Buffer zone
      const bufferSize = 50; // Buffer size: 50px
      // p.stroke(0, 255, 0);
      p.noStroke();
      p.rect(
        zone.x - bufferSize,
        zone.y - bufferSize,
        zone.width + 2 * bufferSize,
        zone.height + 2 * bufferSize
      );
    });
  };

  p.updateData = function (newData) {
    months = newData.months || [];
    initializeBirds();
    p.redraw();
  };

  p.updateStoryData = function (data) {
    exclusionZones = data.zones;
    initializeBirds();
    p.redraw();
  };
};

window.p5Instance = new p5(sketchOne, 'one');
