
/* READ ME

    Welcome to Stamper!
    
    What you have before you is a p5.js sketch formatted in artboard-like items called Stamps. 
    
    You can think of these big Stamps titled "setup", "draw", and "sizeDot" as functions. They can call one another and use global variables.
    
    You can also import file and media Stamps in the bar above and use the console Stamp to debug your code.
    
    Anything in p5.js should work in Stamper. You can upload existing p5 sketches to Stamper or download this Sketch and open it up somewhere else. 
    
    Happy stamping, we're excited to see what you make! 
    
    - Maayan & Cam
    
*/



var xPos = 0
var maxSize = 20


function setup(){
  createCanvas(200, 200)
  background(175, 112, 248)
  noStroke()
}

function sizeDot(x=mouseX, y=mouseY){
  // generate a random size
  var size = random(0, maxSize)
  
  // set the opacity
  var opacity = map(size, 
      0, maxSize, 
      0, 255)
  
  // draw a dot   
  fill(255, opacity);
  ellipse(x,y,size, size);
  
  
}

function draw(){
  // update xPos and background
  background(175, 112, 248, 10)
  xPos = (xPos +2) % width
  
  // draw a row of dots
  for(var i = 0; 
      i < height/maxSize; 
      i++){
        sizeDot(xPos, i*maxSize )
  }
  
}
