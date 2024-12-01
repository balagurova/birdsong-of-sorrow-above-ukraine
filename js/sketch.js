let birdX, birdY;
let total, injured, lossesQuantity;
let injuredArray;
let lineQuantity;
let refugees;
let date;
let rndL;
let scribble;
let refugeesArray;
// let bubbleData = [];
// let data = [];
// let url;
let dt;
let x = 0;
let y = 10;
let s = 2;
let d = 0;
let rndHW, rndH;
let w;
let numberOfLeaves, numberOfWheat;
let remainder;


function preload() {

  url ='https://data.unhcr.org/population/?widget_id=314858&sv_id=54&population_group=5460';
  data = loadJSON(url);
  table = loadTable('https://proxy.hxlstandard.org/data.csv?tagger-match-all=on&tagger-01-header=total+population%28flash+appeal%29&tagger-01-tag=%23population%2Btotal&tagger-02-header=people+affected%28flash+appeal%29&tagger-02-tag=%23affected%2Btotal&tagger-03-header=people+affected+-+idps&tagger-03-tag=%23affected%2Bidps&tagger-04-header=people+in+need%28flash+appeal%29&tagger-04-tag=%23affected%2Bpin&tagger-05-header=pin+-+idps&tagger-05-tag=%23affected%2Bpin%2Bidps&tagger-06-header=people+targeted%28flash+appeal%29&tagger-06-tag=%23affected%2Bpin%2Bidps&tagger-07-header=people+targeted+-+idps&tagger-07-tag=%23targeted%2Bidps&tagger-11-header=refugees%28unhcr%29&tagger-11-tag=%23affected%2Brefugees&tagger-12-header=civilian+casualities%28unhcr%29+-+killed&tagger-12-tag=%23affected%2Bkilled&tagger-13-header=civilian+casualities%28unhcr%29+-+injured&tagger-13-tag=%23affected%2Binjured&tagger-14-header=date&tagger-14-tag=%23date&tagger-16-header=ukraine+flash+appeal+2022+-+required+%28us%24m%29&tagger-16-tag=%23value%2Bfunding%2Bflash%2Brequired%2Busd&tagger-17-header=ukraine+flash+appeal+2022+-+funded+%28us%24m%29&tagger-17-tag=%23value%2Bfunding%2Bflash%2Bfunded%2Busd&tagger-18-header=ukraine+flash+appeal+2022+-+%25+coverage&tagger-18-tag=%23value%2Bfunding%2Bflash%2Bpct&tagger-19-header=ukraine+humanitarian+response+plan+2022+-+required+%28us%24m%29&tagger-19-tag=%23value%2Bfunding%2Bhrp%2Brequired%2Busd&tagger-20-header=ukraine+humanitarian+response+plan+2022+-+funded+%28us%24m%29&tagger-20-tag=%23value%2Bfunding%2Bhrp%2Bfunded%2Busd&tagger-21-header=ukraine+humanitarian+response+plan+2022+-+%25+coverage&tagger-21-tag=%23value%2Bfunding%2Bhrp%2Bpct&tagger-22-header=ukraine+regional+refugee+response+plan+2022+-+required+%28us%24m%29&tagger-22-tag=%23value%2Bfunding%2Brrrp%2Brequired%2Busd&tagger-23-header=ukraine+regional+refugee+response+plan+2022+-+funded+%28us%24m%29&tagger-23-tag=%23value%2Bfunding%2Brrrp%2Bfunded%2Busd&tagger-24-header=ukraine+regional+refugee+response+plan+2022+-+%25+coverage&tagger-24-tag=%23value%2Bfunding%2Brrrp%2Bpct&tagger-25-header=cerf+-+contributions+%28us%24m%29&tagger-25-tag=%23value%2Bcerf%2Bcontributions&tagger-26-header=cerf+-+allocations+%28us%24m%29&tagger-26-tag=%23value%2Bcerf%2Ballocations&tagger-27-header=ukraine+humanitarian+fund+-+contributions+%28us%24m%29&tagger-27-tag=%23value%2Bfunding%2Buhf%2Bcontributions&tagger-28-header=ukraine+humanitarian+fund+-+allocations+%28us%24m%29&tagger-28-tag=%23value%2Bfunding%2Buhf%2Ballocations&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2Fe%2F2PACX-1vQIdedbZz0ehRC0b4fsWiP14R7MdtU1mpmwAkuXUPElSah2AWCURKGALFDuHjvyJUL8vzZAt3R1B5qg%2Fpub%3Foutput%3Dcsv&header-row=2&dest=data_view://docs.google.com/spreadsheets/d/e/2PACX-1vQIdedbZz0ehRC0b4fsWiP14R7MdtU1mpmwAkuXUPElSah2AWCURKGALFDuHjvyJUL8vzZAt3R1B5qg/pub?', 'csv', 'header');
}

function loadData() {
  refugees = data.data[0].individuals;
  lossesArray = table.getColumn('Civilian casualities(OHCHR) - Killed');
  total = parseFloat(lossesArray.slice(-1))
  injuredArray = table.getColumn('Civilian casualities(OHCHR) - Injured');
  injured = parseFloat(injuredArray.slice(-1))
  refugeesArray = table.getColumn('Refugees(UNHCR)');
  refugeeesTotal = parseFloat(refugeesArray.slice(-1))
  lineQuantity = refugeeesTotal / 1000;
}

scribble = new Scribble(); 

function setup() {

  pixelDensity(1);
  createCanvas(500, 500).parent("canvasID");
  loadData();

  if (window.innerWidth < 800) {
    createCanvas(window.innerWidth * 0.91, lineQuantity).parent("#canvasID");
  } else {
    createCanvas(window.innerWidth / 2, lineQuantity).parent("#canvasID");
  }

  noLoop();
  colorMode(HSL, 360, 100, 100);
  document.getElementById("refugees").innerHTML = Intl.NumberFormat().format(refugees);
  document.getElementById("injuredN").innerHTML = Intl.NumberFormat().format(injured);
  document.getElementById("total").innerHTML = Intl.NumberFormat().format(total);

  let options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  dt = new Date(Date.parse(table.getColumn('Date').slice(-1)))
  dt = dt.toLocaleDateString('en-UK', options)
  document.getElementById("date").innerHTML = dt;
}

function draw() {
  background(205, 97, 65)
  
  for (let i = 0; i < lineQuantity; i++) {
    x = 0;
    y = 0 + s;
    stroke(205, 97, random(45, 65))
    line(0, i, width, i)
    s += 1;
  }

  for (let i = 0; i < total; i++) {
    d = 0;
    birdX = random(20, width - 20) + d;
    birdY = random(20, height - 370) + d;
    drawSmallBird()
    d += 100;
  }

  drawWheat()
  drawRemainder()

}


function drawSmallBird() {
  stroke(255)

  if(window.innerWidth > 800){
    strokeWeight(1.5)
  }
  else{
    strokeWeight(1.3)
  }
  
  
  birdSize = random(2, 6);
  line(birdX, birdY, birdX + birdSize, birdY + birdSize)
  line(birdX + birdSize, birdY + birdSize, birdX + birdSize * 2, birdY)
}



function drawWheat() {

  if(window.innerWidth > 800){
    strokeWeight(1.5)
  }
  else{
    strokeWeight(1.3)
  }
  
  numOfLeaves = 30;
  remainder = injured % numOfLeaves;
  numOfWheat = (injured - remainder) / numOfLeaves / 2;



  for (i = 0; i < numOfWheat; i++) {
    stroke(58, 98, 52)
    
    if(window.innerWidth > 800){
      rndH = random(20, 250);
      w = 24;
    }
    else{
      rndH = random(20, 250);
      w = 10;
    }
    
    
    

    
    scribble.roughness = 0.3;
    scribble.scribbleLine(w, height, w, height - rndH  - 5)



    push()
    translate(w, height - rndH)

    for (j = 0; j < numOfLeaves; j++) {
      rndL = random(9,14)*(-1)*width*0.001;
      

      if(window.innerWidth > 800){
        translate(0, -4)
      }
      else{
        translate(0, -3)
      }
        
     
      scribble.scribbleLine(0, 0, -rndL, rndL)
      scribble.scribbleLine(0, 0, rndL, rndL)
    }
    pop()
    // rndHW = random(20, width - 20)
   
    if(window.innerWidth > 800){
      translate(width / numOfWheat - 0.3, 0)

    }
    else{
      translate(width / numOfWheat - 0.25, 0)

    }
    
    // w+=10;


  }
}

function drawRemainder() {

  stroke(58, 98, 48)
  //remainder

  if (remainder > 0) {
    scribble.scribbleLine(w, height, w, height - rndH - 5)
    translate(w, height - rndH)
    for (l = 0; l < remainder / 2; l++) {
      rndL = random(9,14)*(-1);
      translate(0, -4*width*0.0015)
      scribble.scribbleLine(0, 0, -rndL, rndL)
      scribble.scribbleLine(0, 0, rndL, rndL)
    }

  }
}

const btnVisibility = () => {
  console.log(window.scrollY);
  if (window.scrollY > 6200) {
    document.getElementById("footer").style.visibility = "hidden";
  } else {
    document.getElementById("footer").style.visibility = "visible";
  }
};

document.addEventListener("scroll", () => {
    btnVisibility();
});
