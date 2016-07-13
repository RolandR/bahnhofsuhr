


// By Roland Rytz


function Bahnhofsuhr(containerId, args){

	if(typeof containerId != "string" || containerId === ""){
		console.error("Bahnhofsuhr: No html element ID provided for container, aborting.\nUsage: Bahnhofsuhr(string containerID, optional object arguments)");
		return null;
	}

	var container = document.getElementById(containerId);

	if(container === null){
		console.error("Bahnhofsuhr: Could not find html element with id '"+containerId+"', aborting.\nUsage: Bahnhofsuhr(string containerID, optional object arguments)");
		return null;
	}

	

	args = args === undefined ? {} : args;

	// RGB color of the clock face
	var backgroundColor = 		args.backgroundColor 		=== undefined ? 'rgb(239, 239, 239)' : args.backgroundColor;
	
	// RGB color of the minute/hour hands and the minute indices
	var foregroundColor = 		args.foregroundColor 		=== undefined ? 'rgb(62, 62, 62)' : args.foregroundColor;
	
	// RGB color of the seconds hand
	var secondsColor = 		args.secondsColor 			=== undefined ? 'rgb(223, 62, 89)' : args.secondsColor;
	
	// Width of the larger indices in % of the clock diameter
	var fiveMinuteStepWidth = 	args.fiveMinuteStepWidth 	=== undefined ? 3.25 : args.fiveMinuteStepWidth;
	
	// Width of the smaller indices in % of the clock diameter
	var minuteStepWidth = 		args.minuteStepWidth 		=== undefined ? 1.3 : args.minuteStepWidth;
	
	// Distance of the indices to the face's outer border in % of the clock diameter
	var stepPadding = 			args.stepPadding 			=== undefined ? 2.8 : args.stepPadding;
	
	// Length of the larger indices in % of the clock diameter
	var fiveMinuteStepLength = 	args.fiveMinuteStepLength 	=== undefined ? 11.6 : args.fiveMinuteStepLength;
	
	// Length of the smaller indices in % of the clock diameter
	var minuteStepLength = 		args.minuteStepLength 		=== undefined ? 3.2 : args.minuteStepLength;
	
	// The hour hand trapezoid's side closest to the center in % of the clock diameter
	var hourHandInnerWidth = 	args.hourHandInnerWidth 	=== undefined ? 6.2 : args.hourHandInnerWidth;
	
	// The hour hand trapezoid's far side from the center in % of the clock diameter
	var hourHandOuterWidth = 	args.hourHandOuterWidth 	=== undefined ? 5.1 : args.hourHandOuterWidth;
	
	// The hour hand's length in % of the clock diameter
	var hourHandLength = 		args.hourHandLength 		=== undefined ? 43 : args.hourHandLength;
	
	// Distance from the outer end of the hour hand to the face's center in % of its length
	var hourTipToPivot = 		args.hourTipToPivot 		=== undefined ? 73 : args.hourTipToPivot;
	
	// The minute hand trapezoid's side closest to the center in % of the clock diameter
	var minuteHandInnerWidth = 	args.minuteHandInnerWidth 	=== undefined ? 5 : args.minuteHandInnerWidth;
	
	// The minute hand trapezoid's far side from the center in % of the clock diameter
	var minuteHandOuterWidth = 	args.minuteHandOuterWidth 	=== undefined ? 3.5 : args.minuteHandOuterWidth;
	
	// Distance from the outer end of the minute hand to the face's center in % of its length
	var minuteHandLength = 		args.minuteHandLength 		=== undefined ? 56.5 : args.minuteHandLength;
	
	// Distance from the outer end of the minute hand to the face's center in % of its length
	var minuteTipToPivot = 		args.minuteTipToPivot 		=== undefined ? 79 : args.minuteTipToPivot;
	
	// Total length of the seconds hand
	var secondsHandLength = 	args.secondsHandLength 		=== undefined ? 51 : args.secondsHandLength;
	
	// Width of the narrow part of the seconds hand
	var secondsHandWidth = 		args.secondsHandWidth 		=== undefined ? 1.4 : args.secondsHandWidth;
	
	// Radius of the circle on the tip of the seconds hand
	var secondsHandRadius = 	args.secondsHandRadius 		=== undefined ? 5.2 : args.secondsHandRadius;
	
	// Distance from the outer end of the seconds hand to the face's center in % of its length
	var secondsHandPivot = 		args.secondsHandPivot 		=== undefined ? 69 : args.secondsHandPivot;
	
	// How long the seconds hand will stop at a full minute, in milliseconds
	var minuteGap = 			args.minuteGap 				=== undefined ? 2000 : args.minuteGap;
	
	// How long it takes the minutes hand to jump to the next minute, in milliseconds
	var minuteHandJumpDuration =args.minuteHandJumpDuration === undefined ? 350 : args.minuteHandJumpDuration;

	// Show shadows from hands, true or false
	var showShadow =			args.showShadow 			=== undefined ? true : args.showShadow;

	// X offset of the shadows, in percent of the clock diameter
	var shadowXOffset =			args.shadowXOffset 			=== undefined ? 1.5 : args.shadowXOffset;

	// Y offset of the shadows, in percent of the clock diameter
	var shadowYOffset =			args.shadowYOffset 			=== undefined ? 2.5 : args.shadowYOffset;

	// Blurring of the shadows, in percent of the clock diameter
	var shadowBlur =			args.shadowBlur 			=== undefined ? 1 : args.shadowBlur;

	// Shadow color
	var shadowColor =			args.shadowColor 			=== undefined ? "rgba(0, 0, 0, 0.4)" : args.shadowColor;

	// Debug mode
	var debugMode =				args.debugMode 				=== undefined ? false : args.debugMode;


	var faceCanvas = document.createElement("canvas");
	var hourHand = document.createElement("canvas");
	var minuteHand = document.createElement("canvas");
	var secondsHand = document.createElement("canvas");
	var renderCanvas = document.createElement("canvas");

	if(debugMode){
		var debug = document.getElementById("debug");
		debug.appendChild(hourHand);
		debug.appendChild(minuteHand);
		debug.appendChild(secondsHand);
	}

	faceCanvas.style.position = "absolute";
	renderCanvas.style.position = "absolute";
	renderCanvas.style.imageRendering = "-webkit-optimize-contrast";
	//secondsHand.style.imageRendering = "pixelated";

	container.appendChild(faceCanvas);
	container.appendChild(renderCanvas);


	var defaultSize = 100; // Use as reference size, then scale everything according to clockDiameter.
	var clockDiameter = 0;

	var renderCtx = renderCanvas.getContext('2d');

	var handPadding = 10; // To prevent effects from antialiasing causing parts to be cut off
	
	var faceCtx = faceCanvas.getContext('2d');
	var center = defaultSize / 2;
	
	// Scale
	var scaleFactor = 0;

	var running = false;
	
	var requestAnimFrame = (function(){
		return  window.requestAnimationFrame ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	scale();

	function scale(){
		
		var containerHeight = container.clientHeight;
		var containerWidth = container.clientWidth;
		
		if(getComputedStyle){
			var computedStyle = getComputedStyle(container);
			containerHeight -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
			containerWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
		}
		
		if(containerWidth > containerHeight){
			clockDiameter = containerHeight;
			faceCanvas.style.marginLeft = (containerWidth - containerHeight)/2 + "px";
			renderCanvas.style.marginLeft = (containerWidth - containerHeight)/2 + "px";
			faceCanvas.style.marginTop = "0px";
			renderCanvas.style.marginTop = "0px";
		} else {
			clockDiameter = containerWidth;
			faceCanvas.style.marginTop = (containerHeight - containerWidth)/2 + "px";
			renderCanvas.style.marginTop = (containerHeight - containerWidth)/2 + "px";
			faceCanvas.style.marginLeft = "0px";
			renderCanvas.style.marginLeft = "0px";
		}
		clockDiameter = clockDiameter;
		scaleFactor = clockDiameter/defaultSize;
		
		faceCanvas.width = clockDiameter;
		faceCanvas.height = clockDiameter;
		renderCanvas.width = clockDiameter;
		renderCanvas.height = clockDiameter;

		if(showShadow){
			var xOffset = (shadowXOffset / 100) * clockDiameter;
			var yOffset = (shadowYOffset / 100) * clockDiameter;
			var blur = (shadowBlur / 100) * clockDiameter;
			var shadow = "drop-shadow("+xOffset+"px "+yOffset+"px "+blur+"px "+shadowColor+")";
			renderCanvas.style.filter = shadow;
			renderCanvas.style.WebkitFilter = shadow;
			renderCanvas.style.MozFilter = shadow;
		}

		renderAll();
	}

	function renderAll(){
		faceCtx.fillStyle = foregroundColor;
		faceCtx.scale(scaleFactor, scaleFactor);
		faceCtx.save();
		
		renderClockCircle();
		renderFiveMinuteSteps();
		renderMinuteSteps();
		renderHourHand();
		renderMinutesHand();
		renderSecondsHand();

		if(!running){
			animationLoop();
			running = true;
		}
	}
		
	// Render basic circle
	function renderClockCircle(){
		faceCtx.beginPath();
		faceCtx.arc(
			center,
			center,
			defaultSize/2,
			0,
			2 * Math.PI,
			false
		);
		faceCtx.save();
		faceCtx.fillStyle = backgroundColor;
		faceCtx.fill();
		faceCtx.restore();
	}
		
	// Render five minute steps
	function renderFiveMinuteSteps(){
		faceCtx.translate(
			center,
			center
		);
		
		for(var i = 0; i < 12; i++){
			faceCtx.save();
			faceCtx.translate(
				defaultSize/2 - fiveMinuteStepLength/2 - stepPadding,
				0
			);
			
			faceCtx.fillRect(
				0-fiveMinuteStepLength/2,
				0-fiveMinuteStepWidth/2,
				fiveMinuteStepLength,
				fiveMinuteStepWidth
			);
			faceCtx.restore();
	  
			faceCtx.rotate(Math.PI / 6);
		}
	}
		
	// Render minute steps
	function renderMinuteSteps(){
		for(var i = 0; i < 60; i++){
			if(i%5 != 0){
				faceCtx.save();
				faceCtx.translate(
					defaultSize/2 - minuteStepLength/2 - stepPadding,
					0
				);
				
				faceCtx.fillRect(
					0-minuteStepLength/2,
					0-minuteStepWidth/2,
					minuteStepLength,
					minuteStepWidth
				);
				faceCtx.restore();
			}
			faceCtx.rotate(Math.PI / 30);
		}
	}
		
	// Render static hour hand
	function renderHourHand(){
		
		hourHand.width = Math.ceil(((hourHandLength + handPadding)*scaleFactor)/2)*2;
		if(hourHandInnerWidth > hourHandOuterWidth){
			hourHand.height = Math.ceil(((hourHandInnerWidth + handPadding)*scaleFactor)/2)*2;
		} else {
			hourHand.height = Math.ceil(((hourHandOuterWidth + handPadding)*scaleFactor)/2)*2;
		}
		var halfHourCanvasHeight = hourHand.height / 2;
		
		var hourHandContext = hourHand.getContext('2d');

		var paddingOffset = handPadding * (1 - hourTipToPivot * 0.01);
		
		hourHandContext.fillStyle = foregroundColor;
		hourHandContext.beginPath();
		hourHandContext.moveTo(
			Math.round(paddingOffset*scaleFactor),
			halfHourCanvasHeight - (hourHandInnerWidth/2)*scaleFactor
		);
		hourHandContext.lineTo(
			Math.round((hourHandLength + paddingOffset)*scaleFactor),
			halfHourCanvasHeight - (hourHandOuterWidth/2)*scaleFactor
		);
		hourHandContext.lineTo(
			Math.round((hourHandLength + paddingOffset)*scaleFactor),
			halfHourCanvasHeight + (hourHandOuterWidth/2)*scaleFactor
		);
		hourHandContext.lineTo(
			Math.round(paddingOffset*scaleFactor),
			halfHourCanvasHeight + (hourHandInnerWidth/2)*scaleFactor
		);
		
		hourHandContext.closePath();
		hourHandContext.fill();
	}
		
	// Render static minute hand
	function renderMinutesHand(){
		
		minuteHand.width = Math.ceil(((minuteHandLength + handPadding)*scaleFactor)/2)*2;
		if(minuteHandInnerWidth > minuteHandOuterWidth){
			minuteHand.height = Math.ceil(((minuteHandInnerWidth + handPadding)*scaleFactor)/2)*2;
		} else {
			minuteHand.height = Math.ceil(((minuteHandOuterWidth + handPadding)*scaleFactor)/2)*2;
		}
		var halfMinuteCanvasHeight = minuteHand.height / 2;
		
		var minuteHandContext = minuteHand.getContext('2d');

		var paddingOffset = handPadding * (1 - minuteTipToPivot * 0.01);
		
		minuteHandContext.fillStyle = foregroundColor;
		minuteHandContext.beginPath();
		minuteHandContext.moveTo(
			Math.floor(paddingOffset*scaleFactor),
			halfMinuteCanvasHeight - (minuteHandInnerWidth/2)*scaleFactor
		);
		minuteHandContext.lineTo(
			Math.floor((minuteHandLength + paddingOffset)*scaleFactor),
			halfMinuteCanvasHeight - (minuteHandOuterWidth/2)*scaleFactor
		);
		minuteHandContext.lineTo(
			Math.floor((minuteHandLength + paddingOffset)*scaleFactor),
			halfMinuteCanvasHeight + (minuteHandOuterWidth/2)*scaleFactor
		);
		minuteHandContext.lineTo(
			Math.floor(paddingOffset*scaleFactor),
			halfMinuteCanvasHeight + (minuteHandInnerWidth/2)*scaleFactor
		);
		
		minuteHandContext.closePath();
		minuteHandContext.fill();
	}
		
	// Render static seconds hand
	function renderSecondsHand(){
		
		secondsHand.width = Math.ceil((secondsHandLength + handPadding)*scaleFactor/2)*2;
		secondsHand.height = Math.ceil((secondsHandRadius*2 + handPadding/2)*scaleFactor/2)*2;
		
		var halfSecondsCanvasWidth = secondsHand.height / 2;
		
		var secondsHandContext = secondsHand.getContext('2d');
		secondsHandContext.fillStyle = secondsColor;
		
		secondsHandContext.fillRect(
			Math.floor((handPadding * (1 - secondsHandPivot * 0.01))*scaleFactor),
			Math.floor(halfSecondsCanvasWidth - (secondsHandWidth/2)*scaleFactor),
			Math.round((secondsHandLength - secondsHandRadius)*scaleFactor),
			Math.round((secondsHandWidth)*scaleFactor)
		);
		
		secondsHandContext.beginPath();
		secondsHandContext.arc(
			Math.floor((secondsHandLength - secondsHandRadius + handPadding * (1 - secondsHandPivot * 0.01))*scaleFactor),
			halfSecondsCanvasWidth,
			(secondsHandRadius)*scaleFactor,
			0,
			2 * Math.PI,
			false
		);
		secondsHandContext.fill();

	}
		
	// Display on visible canvas
	function render(){
		
		renderCtx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);
		
		var currentdate = new Date(); 
		//var currentdate = new Date((currentdate.getTime()-1400000000000)*10000);
		var currentHour = currentdate.getHours();
		var currentMinute = currentdate.getMinutes();
		var currentSecond = currentdate.getSeconds();
		var currentMillisecond = currentSecond*1000 + currentdate.getMilliseconds();
		currentHour = currentHour*3600 + currentMinute*60 + currentSecond;

		renderCtx.save();

		renderCtx.translate(
			clockDiameter/2,
			clockDiameter/2
		);
		renderCtx.rotate(1.5*Math.PI);
		
		var hoursDegree = currentHour/(12*3600) * 2*Math.PI;
		
		renderCtx.save();
		renderCtx.rotate(hoursDegree);
		renderCtx.drawImage(hourHand, 0 - hourHand.width + hourHand.width * (hourTipToPivot * 0.01), 0 - hourHand.height / 2);
		renderCtx.restore();
		
		var minutesDegree = currentMinute/60 * 2*Math.PI;
		
		if(currentMillisecond < minuteHandJumpDuration){
			minutesDegree = minutesDegree
				- (1/60*2*Math.PI)
				+ (1/60*2*Math.PI)
				*(
					1 - (
						(0-currentMillisecond+minuteHandJumpDuration)
						/minuteHandJumpDuration
					)
					*Math.cos(currentMillisecond*(0.04))
				);
		}
		
		renderCtx.save();
		renderCtx.rotate(minutesDegree);
		renderCtx.drawImage(minuteHand, 0 - minuteHand.width + minuteHand.width * (minuteTipToPivot * 0.01), 0 - minuteHand.height / 2);
		renderCtx.restore();
		
		var secondsDegree = (currentMillisecond/(60000 - minuteGap)) * 2 * Math.PI;
		if(secondsDegree > 2*Math.PI){
			secondsDegree = 2*Math.PI;
		}
		
		renderCtx.save();
		renderCtx.rotate(secondsDegree);
		renderCtx.drawImage(secondsHand, 0 - secondsHand.width + secondsHand.width * (secondsHandPivot * 0.01), 0 - secondsHand.height / 2);
		renderCtx.restore();
		
		renderCtx.restore();
	}
	
	function animationLoop(){
		render();
		requestAnimFrame(animationLoop);
	};

	return {
		scale: scale
	};
}
