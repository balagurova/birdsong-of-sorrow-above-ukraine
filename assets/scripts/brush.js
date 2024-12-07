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

    p.createCanvas(400, 400, p.WEBGL);
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
    brush.stroke('#E3DBD7'); // Set brush stroke color
    brush.strokeWeight(2);

    // Draw randomness on the edges
    const spacing = 0.12; // Space between lines
    const pad = 10; // padding

    for (let i = pad; i < p.height - pad; i += spacing) {
      brush.line(
        pad + p.random(0, 10),
        i + p.random(0, 10),
        p.width - pad - p.random(0, 5),
        i + p.random(0, 20)
      ); // Draw vertical line
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
