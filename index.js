const app = require('express')();
const express = require('express');
const server = require('http').Server(app);
const path = require("path");
const fs = require("fs");
const io = require("socket.io")(server);
const multer = require('multer');

const nl = require('novation-launchpadmk2');
const launchpad = new nl.Launchpad("Launchpad MK2", true);
let draw;
let fps = 5;

let LaunchGrid = [
	[104, 105, 106, 107, 108, 109, 110, 111, 0],
	[81, 82, 83, 84, 85, 86, 87, 88, 89],
	[71, 72, 73, 74, 75, 76, 77, 78, 79],
	[61, 62, 63, 64, 65, 66, 67, 68, 69],
	[51, 52, 53, 54, 55, 56, 57, 58, 59],
	[41, 42, 43, 44, 45, 46, 47, 48, 49],
	[31, 32, 33, 34, 35, 36, 37, 38, 39],
	[21, 22, 23, 24, 25, 26, 27, 28, 29],
	[11, 12, 13, 14, 15, 16, 17, 18, 19]
];

var port = 65515;

// // Uploading // //
var storage = multer.diskStorage({
	destination: './anims',
	filename: function(req, file, cb) {
		cb(null, file.originalname.substring(0, file.originalname.indexOf(".")) + '=' + Date.now() + path.extname(file.originalname));
	}
});
var upload = multer({ storage: storage });

app.post('/upload', upload.single("song"), function(req, res) {
  if (req.file) {
    console.log(req.file);
  }
	res.redirect('back');
});

launchpad.getDevice();

app.get('/', function (req, res) {
	res.sendFile('/pages/index.html', {root: '.'})
});

app.use('/imgs', express.static(__dirname + '/imgs'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/anims', express.static(__dirname + '/anims'));
app.use('/pages', express.static(__dirname + '/pages'));

// // Socket.io // //

io.on("connection", function(socket) {
  socket.on("Export", function(savedata) {
		let parsed = JSON.parse(savedata);
		let name = Object.keys(parsed.animations)[0]
		fs.writeFile(`./anims/${name}.json`, savedata, 'utf8', function (err) {
			console.log(err);
		});
		console.log("Created");
	});
});

// // Launchpad Functions // //

launchpad.on("DeviceReady", function () {
  console.log("Launchpad is ready");
  //draw = setInterval(start, fps/1000);
});

var buttons = [];
var buttonstrig = [];
var anims = {};
var frame = 0;

launchpad.on("KeyDown", function (key, vel) {
  if (key == 111) {
    clearInterval(draw);
  } else if (key == 104) {
    fs.readFile('./anims/coolpound.json', function(err, data) {
      let parsed = JSON.parse(data);

      // console.log(parsed);
      AnimationSetup(parsed.buttons, parsed.animations);
    });
  }

  if (buttons.includes(key)) {
    let bindex = buttons.indexOf(key);
    let anim = anims[buttonstrig[bindex]];
    let frames = Object.keys(anim).length;

		if (!draw) {
			frame = 0;
			launchpad.resetLeds();
	    draw = setInterval(start, fps/1000, frames, anim);
		}
  }
});

// // Other Code // //

function start(frames, anim) {
  frame++;
  if (frame <= frames) {
    let currentframe = anim[`frame${frame}`];
    for (let i = 0; i < currentframe.length; i++) {
      if (currentframe[i] != 0) {
        let x = i % LaunchGrid[0].length;
        let y = Math.floor(i / LaunchGrid.length);
        let led = LaunchGrid[y][x];

        launchpad.LedOn(led, currentframe[i]);
      } else {
				let x = i % LaunchGrid[0].length;
				let y = Math.floor(i / LaunchGrid.length);

				launchpad.LedOff(LaunchGrid[y][x]);
			}
    }
  } else {
    clearInterval(draw);
		draw = null;
  }
}

function AnimationSetup(lbuttons, animations) {
  let keys = Object.keys(lbuttons);
  anims = animations;

  for (let k = 0; k < keys.length; k++) {
    let key = keys[k];

    if (key.includes("button")) {
      let match = key.match(/[0-9]/g);
      let led = key.indexOf(match[0]);

      buttons.push(parseInt(key.substring(led)));
      buttonstrig.push(lbuttons[key]);
    }
  }

}

server.listen(port, function() {
  console.log("Listening on localhost: " + port);
});
