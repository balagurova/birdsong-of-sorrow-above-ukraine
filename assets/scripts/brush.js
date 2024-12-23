let sketchBrush = function (p) {
  brush.instance(p);

  p.setup = function () {
    let container = document.getElementById('brush');
    if (!container) {
      console.error("Div with ID 'one' not found.");
      return;
    }

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    p.createCanvas(1626, 400, p.WEBGL);
    p.pixelDensity(1);
    brush.load();

    let saveButton = p.createButton('Save Canvas');
    saveButton.position(10, 10); // Adjust the position as needed
    saveButton.mousePressed(() => p.save('canvas.png'));
  };

  p.draw = function () {
    p.background('#F9EFE9');
    p.translate(-p.width / 2, -p.height / 2);

    // Set up brush
    brush.pick('2B');
    brush.stroke('#424992');
    brush.strokeWeight(0.2);

    const spacing = 1; // Line spacing
    const padding = 20; // Padding at the top and bottom of the canvas

    for (let i = padding; i < p.height - padding; i += spacing) {
      // Skip some lines with a low probability to create gaps
      if (p.random(1) < 0.1) {
        continue;
      }

      let xStart, xEnd;

      // Apply more randomness for lines in the top and bottom regions

      // Standard randomness for lines in the middle region
      xStart = p.random(0, 10);
      xEnd = p.width - p.random(0, 10);

      let yStartOffset = 0;
      let yEndOffset = 0;

      // Add vertical randomness with a lower probability
      if (p.random(1) < 0.3) {
        // 30% chance for angled lines
        yStartOffset = p.random(-spacing / 3, spacing / 3);
        yEndOffset = p.random(-spacing / 3, spacing / 3) + p.random(5);
      }

      brush.line(
        xStart,
        i + yStartOffset, // Slightly random start position
        xEnd,
        i + yEndOffset // Slightly random end position
      );
    }

    // for (let i = pad; i < p.width - pad; i += spacing) {
    //   brush.line(
    //     i + p.random(0, 10),
    //     pad + p.random(0, 5),
    //     i + p.random(0, 10),
    //     p.height - pad - p.random(0, 10)
    //   );
    // }

    p.noLoop();
  };
};

new p5(sketchBrush, 'brush');
