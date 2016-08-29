
// Example showing how to produce a tone using Web Audio API.
// Load the file webaudio_tools.js before loading this file.
// This code will write to a DIV with an id="soundStatus".
var oscillator;
var amp;
var keyRef = {}
var keyRef = [["C", 0], ["C#/Db", 1], ["D", 2], ["D#/Eb", 3],["E", 4], ["F", 5],["F#/Gb", 6],["G", 7],["G#/Ab", 8],["A", 9], ["A#/Bb", 10], ["B", 11] , ["C", 12]];
var major = [0 , 2, 4, 5, 7, 9, 11, 12 ];
var minor = [0 , 2, 3, 5, 7, 8, 11, 12 ];
var kodaly = ["do", "re", "mi", "fa", "so", "la", "ti", "do2"];
var currentKey;
var keyType = "maj";

var tones = {
"C" :	{ tones : [130.81,	261.62,	523.24,	1046.48], color:	"#990000"},
"C#/Db" : { tones : [138.59,	277.18,	554.36,	1108.72], color:		"#e34234" },
"D": { tones : [	146.83,	293.66,	587.32,	1174.64], color:	"#FFC200"},
"D#/Eb": { tones : [	155.56,	311.12,	622.24,	1244.48], color:	"#32cd32" },
"E": { tones : [	164.81,	329.62,	659.24,	1318.48], color:	"#33FF33" },
"F": { tones : [	174.61,	349.22,	698.44,	1396.88], color:	"#0BDA51" },
"F#/Gb": { tones : [	185,	370,	740,	1480], color:	"#40e0d0" },
"G": { tones : [	196,	392,	784,	1568], color:	"#2956B2" },
"G#/Ab"	: { tones : [207.65,	415.3,	830.6,	1661.2], color:	"#333399" },
"A"	: { tones : [220,	440,	880,	1760], color:	"#3964C3" },
"A#/Bb"	: { tones : [233.08,	466.16,	932.32,	1864.64], color:	"#C54B8C" },
"B": { tones : [	246.94,	493.88,	987.76,	1975.52], color:	"#FF0080" }
};

var tonelist = [];

function toneList(obj, pushArray){
	var counter = 0;
	for (j = 0; j<4; j++) { // manual add of four octaves for list
		for (var i in obj){
			if (obj.hasOwnProperty(i)){
				pushArray.push([i, obj[i]["tones"][j], obj[i]["color"]  ]);
				document.getElementById(i).setAttribute("style", "background: " + obj[i]["color"]  );
				console.log(counter + " " + pushArray[counter][0] + " " + pushArray[counter][1] + " " + pushArray[counter][2] );
				counter++;
			}
		}
	}
}




// Create an oscillator and an amplifier.
function initAudio()
{
	// Use audioContext from webaudio_tools.js
	if( audioContext )
	{
		oscillator = audioContext.createOscillator();
		fixOscillator(oscillator);
		oscillator.frequency.value = 440;
		amp = audioContext.createGain();
		amp.gain.value = 0;

		// Connect oscillator to amp and amp to the mixer of the audioContext.
		// This is like connecting cables between jacks on a modular synth.
		oscillator.connect(amp);
		amp.connect(audioContext.destination);
		oscillator.start(0);
		toneList(tones, tonelist);
		changeKey(0); // starts in C major
	//	writeMessageToID( "soundStatus", "<p>Audio initialized." + tones["C"]["tones"][3] + "</p>");

	}
}

// Set the frequency of the oscillator and start it running.
function startTone( frequency )
{
	var now = audioContext.currentTime;

	oscillator.frequency.setValueAtTime(frequency, now);

	// Ramp up the gain so we can hear the sound.
	// We can ramp smoothly to the desired value.
	// First we should cancel any previous scheduled events that might interfere.
	amp.gain.cancelScheduledValues(now);
	// Anchor beginning of ramp at current value.
	amp.gain.setValueAtTime(amp.gain.value, now);
	amp.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);

	// writeMessageToID( "soundStatus", "<p>Play tone at frequency = " + frequency  + "</p>");
}

function stopTone()
{
	var now = audioContext.currentTime;
	amp.gain.cancelScheduledValues(now);
	amp.gain.setValueAtTime(amp.gain.value, now);
	amp.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + 0.3);
//	writeMessageToID( "soundStatus", "<p>Stop tone.</p>");
}

function changeKey(key){
	currentKey = key;
	var myScale;
	if (keyType == "min") { myScale = minor;  } else { myScale = major;  };
	for (i=0; i<kodaly.length; i++){
		var myKey = Number(myScale[i]) + Number(key);
		console.log(myKey + "" + kodaly[i] + "  " + tonelist[myKey][2] + " " + tonelist[myKey][1]   );
		document.getElementById(kodaly[i]).setAttribute("style", "background: " + tonelist[myKey][2] );
		document.getElementById(kodaly[i]).setAttribute("onmouseover", "startTone(" + tonelist[myKey][1]  + ")" );
		document.getElementById( kodaly[i] ).getElementsByTagName( 'span' )[0].textContent=tonelist[myKey][0];
	}

}

function setScale(mykey){
 keyType = mykey;
console.log("key is " + mykey);
 document.getElementById("maj").className = "";
  document.getElementById("min").className = "";
 document.getElementById(mykey).className += "selected";
 changeKey(currentKey);
}

// init once the page has finished loading.
window.onload = initAudio;
