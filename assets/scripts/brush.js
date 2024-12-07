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

    p.createCanvas(1626, 1200, p.WEBGL);
    p.pixelDensity(2);
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
    brush.stroke('#424992'); // Set brush stroke color
    brush.strokeWeight(0.5);

    // Draw randomness on the edges
    const spacing = 0.15; // Space between lines
    const pad = 10; // padding

    for (let i = pad; i < p.height - pad; i += spacing) {
      brush.line(
        pad + p.random(0, 15),
        i + p.random(-15, 15),
        p.width - pad - p.random(0, 15),
        i + p.random(-15, 15)
      ); // Draw vertical line
    }
    // for (let i = pad; i < p.width - pad; i += spacing) {
    //   brush.line(i, pad, i, p.height - pad); // Draw vertical line
    // }

    p.noLoop();
  };
};

new p5(sketchBrush, 'brush');
