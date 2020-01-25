// // // Declaration // // //
const socket = io("localhost:65515");


// // Socket.io and Other Code // //
function exportanimation() {
  socket.emit("Export", saved);
}


// // p5.js Code // //
let canv;
let canv2;
let canv3;
let scale = 50;
let w = 9;
let h = 9;
let debug = false;
let canvas1;
let canvas2;
let canvas3;

let buttontrigger = document.getElementById("buttontrigger");
let animationname = document.getElementById("animationname");
let keyframe = document.getElementById('keyframe');
let color = document.getElementById("color");
let colors = [
  [225, 225, 225],
  [200, 200, 200],
  [230, 230, 230],
  [250, 250, 250],
  [240, 150, 180],
  [240, 50, 45],
  [220, 40, 55],
  [200, 40, 45],
  [255, 220, 200],
  [240, 140, 80],
  [175, 85, 30],
  [150, 80, 50],
  [240, 220, 145],
  [240, 255, 125],
  [200, 220, 80],
  [150, 165, 50],
  [185, 250, 190],
  [155, 250, 120],
  [155, 255, 80],
  [145, 250, 95],
  [155, 255, 220],
  [60, 255, 145],
  [25, 240, 55],
  [15, 205, 40],
  [155, 255, 230],
  [85, 255, 180],
  [65, 255, 135],
  [65, 210, 90],
  [155, 255, 230],
  [28, 230, 140],
  [20, 200, 115],
  [15, 175, 113],
  [160, 255, 255],
  [35, 250, 210],
  [40, 240, 205],
  [40, 230, 190],
  [155, 255, 255],
  [30, 235, 250],
  [20, 215, 250],
  [35, 190, 245],
  [170, 225, 240],
  [55, 215, 215],
  [50, 190, 215],
  [50, 160, 220],
  [125, 130, 115],
  [20, 30, 215],
  [20, 25, 240],
  [30, 20, 245],
  [240, 230, 255],
  [125, 115, 235],
  [120, 70, 215],
  [105, 60, 200],
  [255, 140, 215],
  [240, 75, 250],
  [235, 60, 230],
  [225, 50, 250],
  [240, 160, 200],
  [240, 25, 160],
  [235, 20, 145],
  [180, 15, 90],
  [230, 65, 60],
  [235, 145, 70],
  [240, 235, 120],
  [120, 190, 80],
  [65, 220, 100],
];

let colorR = 0;
let colorG = 0;
let colorB = 0;

var keyframes = 1;
var animframes = {};
var animcount = [];
var tilescolored = [
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0
];
var buttons = {};

// // p5 Canveses // //

// Main Canvas //

var drawCanv = function(c2) {
  canvas1 = c2;

  c2.setup = function() {
    canv = c2.createCanvas(w*scale, h*scale);
  }

  c2.draw = function() {
    let x = Math.floor(c2.mouseX / scale);
    let y = Math.floor(c2.mouseY / scale);
    c2.scale(scale);

    c2.background(225);
    c2.noStroke();

    if (c2.mouseIsPressed && c2.mouseX > 0 && c2.mouseX < c2.width && c2.mouseY > 0 && c2.mouseY < c2.height) {
      let x2 = y * h + x;
      tilescolored[x2] = parseInt(color.value);
      animframes[`frame${keyframe.value}`] = tilescolored;
      if (debug == 1) {
        console.log("Drawing");
      }
    }

    if (tilescolored[0].length != 0) {
      for (let i = 0; i < tilescolored.length; i++) {
        let ledx = i % w;
        let ledy = Math.floor(i / h);

        let vel = tilescolored[i];
        let ledcolor = colors[vel];
        let r = ledcolor[0];
        let g = ledcolor[1];
        let b = ledcolor[2];

        c2.fill(r, g, b);
        c2.rect(ledx, ledy, 1, 1);
        // console.log(ledx);
      }
    }
    c2.fill(0);
    c2.rect(0, 1, 8, 0.1);
    c2.rect(8, 1, 0.1, 9);
    c2.rect(3, 5, 2, 0.1);
    c2.rect(4, 4, 0.1, 2);
    c2.fill(colorR, colorG, colorB);
    c2.rect(x, y, 1, 1);
  }

}
new p5(drawCanv, 'canvas');

// Velocity Color Picker //

var drawColors = function(c3) {
  canvas3 = c3;
  let miniscale = scale/2
  let press = 0;

  c3.setup = function() {
    canv3 = c3.createCanvas(w*miniscale, h*miniscale);
  }

  c3.draw = function() {
    c3.scale(miniscale);
    c3.background(225);
    c3.noStroke();

    colors.forEach((item, i) => {
      let r = item[0];
      let g = item[1];
      let b = item[2];

      let offset = 0;

      let x = i % 4;
      let y = Math.floor(i / 4);
      if (y > h-1) {
        offset = 4;
        y = y % h;
      }

      c3.fill(r, g, b);
      c3.rect(x+offset, y, 1, 1);
    });

    if (c3.mouseIsPressed) {
      if (press == 0 && c3.mouseX > 0 && c3.mouseX < c3.width && c3.mouseY > 0 && c3.mouseY < c3.height) {
        //1 * 4 + (canvas3.mouseX / (scale/2))
        let x = Math.floor(c3.mouseX / miniscale);
        let y = Math.floor(c3.mouseY / miniscale);

        if (x > 3) {
          y = y + (h-1);
        }
        color.value = y * 4 + x;
        setColor(color.value, false);
      }
      press = 1;
    } else {
      press = 0;
    }
  }
}
new p5(drawColors, 'velocities');

//  Chosen Color  //

var drawColor = function(c) {
  canvas2 = c;
  c.setup = function() {
    canv2 = c.createCanvas(scale, scale);
  }

  c.draw = function() {
    c.background(colorR, colorG, colorB);

  }

  color.addEventListener("change", function(e) {
    setColor(e, true);
  });
}
new p5(drawColor, 'chosencolor');

// // Outside Functions // //
document.addEventListener("keydown", keyboardPressed);
buttontrigger.addEventListener("change", animsetup);

function keyboardPressed(e) {
  let keyCode = e.keyCode;
  let val = parseInt(keyframe.value);
  if (keyCode == 39) {
    val++;
    if (val > keyframes) {
      keyframes++;
    }

    keyframe.value = val;
    onkeyframeChange(val);
  } else if (keyCode == 37) {
    val--;
    if (val < 0) {
      val = 0;
    }

    keyframe.value = val;
    onkeyframeChange(val);
  } else if (e.ctrlKey) {
    switch (e.keyCode) {
      case 83:
        e.preventDefault();
        e.stopPropagation();
        saveAnimation();
        break;
      case 65:
        e.preventDefault();
        e.stopPropagation();
        newAnim();
        break;
    }
  }
}

function setColor(e, emitted) {
  if (debug == 1) {
    console.log("Change Color");
  }
  if (emitted) {
    let val = e.target.value;
    if (val > 63) {
      color.value = 63;
    } else if (val < 0) {
      color.value = 0;
    }
    colorR = colors[color.value][0];
    colorG = colors[color.value][1];
    colorB = colors[color.value][2];
  } else {
    let val = e;
    if (val > 63) {
      color.value = 63;
    } else if (val < 0) {
      color.value = 0;
    }
    colorR = colors[color.value][0];
    colorG = colors[color.value][1];
    colorB = colors[color.value][2];
  }
}

function animsetup(e) {
  if (debug == 1) {
    console.log("AnimSetup");
  }
  let button = e.target.value;
  // var keyframes = 1;
  // var animframes = {};
  // var animcount = [];
  // var animations = {};
  // var buttons = {};
  if (animcount.length < 1) {
    buttons[`button${button}`] = animationname.value;
    animcount.push(animationname.value);
    animframes["frame1"] = [
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    tilescolored = [
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
  } else {
    saveAnimation();
  }
}

function newAnim() {
  if (debug == 1) {
    console.log("newAnim");
  }
  saveAnimation();

  let animname = prompt("Animation Name?");
  let trigger = prompt("Launchpad Led (Trigger)?");
  let trigger2 = prompt("Launchpad Led (Type Again)");

  if (animcount.includes(animname)) {
    alert("Animation name already used! Please try again!");
  } else {
    if (trigger == trigger2) {
      if (buttons.hasOwnProperty(`button${trigger}`)) {
        alert("Trigger already used! Please try again!");
      } else {
        animframes = {};
        keyframes = 1;
        keyframe.value = 1;

        buttons[`button${trigger}`] = animname;
        animcount.push(animname);
        animframes["frame1"] = [
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
        tilescolored = [
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
      }
    } else {
      alert("Triggers do not match! Please try again!");
    }
  }
}

var saved = "{}";
function saveAnimation() {
  if (debug == 1) {
    console.log("saveAnim");
  }
  if (Object.keys(JSON.parse(saved)).length == 0) {
    let parsed = {
      buttons: buttons,

      animations: {

      }
    }
    for (let i = 0; i < animcount.length; i++) {
      let anim = animcount[i];

      parsed.animations[anim] = animframes;
    }
    saved = JSON.stringify(parsed);
    alert("Successfully Saved!");
  } else {
    let parsed = JSON.parse(saved);
    let anim = animcount[animcount.length - 1]
    parsed.animations[anim] = animframes;
    parsed.buttons = buttons;

    saved = JSON.stringify(parsed);
    alert("Successfully Saved!");
  }

}

function onkeyframeChange(val) {
  if (debug == 1) {
    console.log(val);
  }

  if (animframes.hasOwnProperty(`frame${val}`)) {
    tilescolored = animframes[`frame${val}`];
  } else {
    animframes[`frame${val}`] = [
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0
    ];
    tilescolored = [
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
  }
}

window.onbeforeunload = function (e) {
    // Cancel the event
    e.preventDefault();

    // Chrome requires returnValue to be set
    e.returnValue = 'Do you Really want to quit?';
};
