"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 32;
}

function isWater(tilevalue){
  if (0.5 <= tilevalue){
	  return true;
  }
  else {
	  return false;
  }
}

function isSand(tilevalue){
  if (0.3 <= tilevalue && tilevalue < 0.5){
	  return true;
  }
  else {
	  return false;
  }
}

function isRock(tilevalue){
  if (tilevalue < 0.3){
	  return true;
  }
  else {
	  return false;
  }
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  console.log(i, j);
  
  ticks++;
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  let tilevalue = noise(i, j);
  //let tilebrightnessvariation = (tilevalue-0.5) * 100;
  let tilebrightnessvariation = (noise(j, i) - 0.5) * 25; //just flipping the coordinates is lazy, but w/e
  
  //let tile_is_water = false;
  //let tile_is_sand = false;
  //let tile_is_rock = false;
  
  //if (isWater(tilevalue)){
  //  tile_is_water = true;
  //}
  //else if (tilevalue > 0.3){
  //else if (isSand(tilevalue)){
  //  tile_is_sand = true;
  //}
  //else {
  //  tile_is_rock = true;
  //}
  
  noStroke();
  fill(tilevalue * 255)
  
  push();
  
  //tile colors
  if (isWater(tilevalue)){
    fill(80, 100, 200);
  }
  else if (isSand(tilevalue)){
    fill(160+tilebrightnessvariation, 150+tilebrightnessvariation, 100+tilebrightnessvariation);
  }
  else if (isRock(tilevalue)){
    fill(120+tilebrightnessvariation);
  }
  
  
  beginShape();
  vertex(0, 0);
  vertex(0, th);
  vertex(tw, th);
  vertex(tw, 0);
  endShape(CLOSE);
  
  //tile details
  if (isWater(tilevalue)){
    fill(130, 150, 250);
	
	let squiggleheight = th*0.1;
	
    beginShape();
    vertex(0, th*0.25);
    vertex(tw*0.25, th*0.4);
    vertex(tw*0.5, th*0.25);
	vertex(tw*0.75, th*0.4);
	vertex(tw, th*0.25);
	vertex(tw, th*0.25+squiggleheight);
	vertex(tw*0.75, th*0.4+squiggleheight);
	vertex(tw*0.5, th*0.25+squiggleheight);
	vertex(tw*0.25, th*0.4+squiggleheight);
	vertex(0, th*0.25+squiggleheight);
    endShape(CLOSE);
	
	beginShape();
    vertex(0, th*0.5);
    vertex(tw*0.25, th*0.65);
    vertex(tw*0.5, th*0.5);
	vertex(tw*0.75, th*0.65);
	vertex(tw, th*0.5);
	vertex(tw, th*0.5+squiggleheight);
	vertex(tw*0.75, th*0.65+squiggleheight);
	vertex(tw*0.5, th*0.5+squiggleheight);
	vertex(tw*0.25, th*0.65+squiggleheight);
	vertex(0, th*0.5+squiggleheight);
    endShape(CLOSE);
	
	//autotiling
	//sand to the left
	if (isSand( noise(i-1, j) )){
		console.log("sand left of water");
		fill(160+tilebrightnessvariation, 150+tilebrightnessvariation, 100+tilebrightnessvariation);
		//circle(0, th*0.25, th*0.5);
		arc(0, th*0.25, tw*0.5, th*0.5, -0.5*PI, 0.5*PI);
		arc(0, th*0.75, tw*0.5, th*0.5, -0.5*PI, 0.5*PI);
	}
	//sand to the right
	if (isSand( noise(i+1, j) )){
		fill(160+tilebrightnessvariation, 150+tilebrightnessvariation, 100+tilebrightnessvariation);
		arc(tw, th*0.25, tw*0.5, th*0.5, 0.5*PI, 1.5*PI);
		arc(tw, th*0.75, tw*0.5, th*0.5, 0.5*PI, 1.5*PI);
	}
	//sand on top
	if (isSand( noise(i, j-1) )){
		fill(160+tilebrightnessvariation, 150+tilebrightnessvariation, 100+tilebrightnessvariation);
		arc(0.25*tw, 0, tw*0.5, th*0.5, 0, PI);
		arc(0.75*tw, 0, tw*0.5, th*0.5, 0, PI);
	}
	//sand on bottom
	if (isSand( noise(i, j+1) )){
		fill(160+tilebrightnessvariation, 150+tilebrightnessvariation, 100+tilebrightnessvariation);
		arc(0.25*tw, th, tw*0.5, th*0.5, PI, 2*PI);
		arc(0.75*tw, th, tw*0.5, th*0.5, PI, 2*PI);
	}
	
	//rock to the left
	if (isRock( noise(i-1, j) )){
		fill(120+tilebrightnessvariation);
		triangle(0, 0, tw*0.25, th*0.5, 0, th*0.5);
		
		fill(110+tilebrightnessvariation);
		triangle(0, th*0.5, tw*0.25, th*0.5, 0, th);
	}
	//rock to the right
	if (isRock( noise(i+1, j) )){
		fill(120+tilebrightnessvariation);
		triangle(tw, 0, tw*0.75, th*0.5, tw, th*0.5);
		
		fill(110+tilebrightnessvariation);
		triangle(tw, th*0.5, tw*0.75, th*0.5, tw, th);
	}
	//rock on top
	if (isRock( noise(i, j-1) )){
		fill(130+tilebrightnessvariation);
		triangle(0, 0, tw*0.25, th*0.5, tw*0.5, 0);
		
		fill(110+tilebrightnessvariation);
		triangle(tw*0.5, 0, tw*0.75, th*0.5, tw, 0);
	}
	//rock on bottom
	if (isRock( noise(i, j+1) )){
		fill(145+tilebrightnessvariation);
		triangle(0, th, tw*0.25, th*0.5, tw*0.5, th);
		triangle(tw*0.5, th, tw*0.75, th*0.5, tw, th);
	}
  }
  else if (isSand(tilevalue)){
    fill(175+tilebrightnessvariation, 165+tilebrightnessvariation, 115+tilebrightnessvariation);
	circle(tw*0.25, th*0.25, tw*0.25);
	circle(tw*0.5, th*0.5, tw*0.2);
	circle(tw*0.75, th*0.75, tw*0.25);
	
	fill(170+tilebrightnessvariation, 160+tilebrightnessvariation, 110+tilebrightnessvariation);
	circle(tw*0.75, th*0.25, tw*0.25);
	circle(tw*0.25, th*0.75, tw*0.175);
	
	//the following code is identical to above in case i want to vary it more later
	//rock to the left
	if (isRock( noise(i-1, j) )){
		fill(120+tilebrightnessvariation);
		triangle(0, 0, tw*0.25, th*0.5, 0, th*0.5);
		
		fill(110+tilebrightnessvariation);
		triangle(0, th*0.5, tw*0.25, th*0.5, 0, th);
	}
	//rock to the right
	if (isRock( noise(i+1, j) )){
		fill(120+tilebrightnessvariation);
		triangle(tw, 0, tw*0.75, th*0.5, tw, th*0.5);
		
		fill(110+tilebrightnessvariation);
		triangle(tw, th*0.5, tw*0.75, th*0.5, tw, th);
	}
	//rock on top
	if (isRock( noise(i, j-1) )){
		fill(130+tilebrightnessvariation);
		triangle(0, 0, tw*0.25, th*0.5, tw*0.5, 0);
		
		fill(110+tilebrightnessvariation);
		triangle(tw*0.5, 0, tw*0.75, th*0.5, tw, 0);
	}
	//rock on bottom
	if (isRock( noise(i, j+1) )){
		fill(145+tilebrightnessvariation);
		triangle(0, th, tw*0.25, th*0.5, tw*0.5, th);
		triangle(tw*0.5, th, tw*0.75, th*0.5, tw, th);
	}
  }
  else if (isRock(tilevalue)){
    fill(145+tilebrightnessvariation);
	//i tried making this more realistic-looking, but it didn't feel right
	//triangle(0, th*0.25, tw*0.125, 0, tw*0.25, th*0.25);
	//triangle(tw*0.25, th*0.5, tw*0.5, 0, tw*0.75, th*0.5);
	//triangle(0, th, tw*0.165, th*0.65, tw*0.35, th);
	//triangle();
	triangle(tw*0.25, th*0.5, tw*0.5, 0, tw*0.75, th*0.5);
	triangle(0, th, tw*0.25, th*0.5, tw*0.5, th);
	triangle(tw*0.5, th, tw*0.75, th*0.5, tw, th);
	
	fill(130+tilebrightnessvariation);
	triangle(0, 0, tw*0.5, 0, tw*0.25, th*0.5);
	triangle(tw*0.25, th*0.5, tw*0.75, th*0.5, tw*0.5, th);
	
	fill(110+tilebrightnessvariation);
	triangle(tw*0.5, 0, tw*0.75, th*0.5, tw, 0);
	triangle(0, th*0.5, tw*0.25, th*0.5, 0, th);
	triangle(tw*0.75, th*0.5, tw, th*0.5, tw, th);
  }

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    fill(255, 255, 0, 180);
	
	if(isWater(tilevalue)){
		//yellow fish
		fill(255, 255, 0);
		ellipse(tw/2, th/2, tw*0.5, th*0.4);
		triangle(tw*0.15, th*0.25, tw*0.4, th*0.5, tw*0.15, th*0.75);
		fill(80);
		circle(tw*0.6, th*0.5, tw*0.1);
	}
	else if(isSand(tilevalue)){
		//red crab
		fill(255, 0, 0);
		ellipse(tw/2, th/2, tw*0.5, th*0.25);
		
		stroke(255, 0, 0);
		strokeWeight(tw*0.05);
		
		//legs
		line(tw*0.3, th*0.5, tw*0.15, th*0.6);
		line(tw*0.7, th*0.5, tw*0.85, th*0.6);
		
		line(tw*0.4, th*0.5, tw*0.25, th*0.65);
		line(tw*0.6, th*0.5, tw*0.75, th*0.65);
		
		line(tw*0.45, th*0.5, tw*0.35, th*0.7);
		line(tw*0.55, th*0.5, tw*0.65, th*0.7);
		
		//arms
		line(tw*0.35, th*0.45, tw*0.25, th*0.3);
		line(tw*0.65, th*0.45, tw*0.75, th*0.3);
		
		//claws
		noStroke();
		arc(tw*0.25, th*0.3, tw*0.15, th*0.15, -0.25*PI, 1.5*PI);
		arc(tw*0.75, th*0.3, tw*0.15, th*0.15, -0.5*PI, 1.25*PI);
		
		//eyes
		fill(80);
		circle(tw*0.45, th*0.4, tw*0.1);
		circle(tw*0.55, th*0.4, tw*0.1);
	}
	else if(isRock(tilevalue)){
		//pink starfish
		fill(200, 80, 100);
		ellipse(tw/2, th/2, tw*0.25, th*0.25);
		
		//draw a star
		//x = tw*0.5
		//y = th*0.5
		//radius1 = tw*0.25
		//radius2 = tw*0.55
		//npoints = 5
		let dist1 = 0.15
		let dist2 = 0.35
		
		beginShape();
		vertex(tw*(0.5 + cos(0) * dist2), th*(0.5 + sin(0) * dist2));
		vertex(tw*(0.5 + cos(0.2*PI) * dist1), th*(0.5 + sin(0.2*PI) * dist1));
		
		vertex(tw*(0.5 + cos(0.4*PI) * dist2), th*(0.5 + sin(0.4*PI) * dist2));
		vertex(tw*(0.5 + cos(0.6*PI) * dist1), th*(0.5 + sin(0.6*PI) * dist1));
		
		vertex(tw*(0.5 + cos(0.8*PI) * dist2), th*(0.5 + sin(0.8*PI) * dist2));
		vertex(tw*(0.5 + cos(PI) * dist1), th*(0.5 + sin(PI) * dist1));
		
		vertex(tw*(0.5 + cos(1.2*PI) * dist2), th*(0.5 + sin(1.2*PI) * dist2));
		vertex(tw*(0.5 + cos(1.4*PI) * dist1), th*(0.5 + sin(1.4*PI) * dist1));
		
		vertex(tw*(0.5 + cos(1.6*PI) * dist2), th*(0.5 + sin(1.6*PI) * dist2));
		vertex(tw*(0.5 + cos(1.8*PI) * dist1), th*(0.5 + sin(1.8*PI) * dist1));
		
		vertex(tw*(0.5 + cos(2*PI) * dist2), th*(0.5 + sin(2*PI) * dist2));
		vertex(tw*(0.5 + cos(2.2*PI) * dist1), th*(0.5 + sin(2.2*PI) * dist1));
		
		//vertex(tw*0.55, th*0.4);
		//vertex(tw*0.75, th*0.45);
		endShape(CLOSE);
	}
  }

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(0, 0);
  vertex(0, th);
  vertex(tw, th);
  vertex(tw, 0);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("(" + [i, j] + ")", 0, 0);
}

function p3_drawAfter() {}
