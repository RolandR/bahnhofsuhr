


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
	var shadowColor =			args.shadowColor 			=== undefined ? "rgba(0, 0, 20, 0.4)" : args.shadowColor;

	// Debug mode
	var debugMode =				args.debugMode 				=== undefined ? false : args.debugMode;

	// Show border around clock face, true or false
	var showBorder =			args.showBorder 			=== undefined ? false : args.showBorder;

	// Border width, in percent of clock diameter
	var borderWidth =			args.borderWidth 			=== undefined ? 2 : args.borderWidth;

	// Border color
	var borderColor =			args.borderColor 			=== undefined ? "rgb(150, 150, 150)" : args.borderColor;

	// Show Logo (or any image) on the clock face
	var showLogo =				args.showLogo 				=== undefined ? false : args.showLogo;

	// Path of Logo file
	var logoPath =				args.logoPath 				=== undefined ? "./mobatime-logo.svg" : args.logoPath;

	// Logo position from top, in percent of clock diameter
	var logoTop =				args.logoTop 				=== undefined ? 65 : args.logoTop;

	// Logo width, in percent of clock diameter
	var logoWidth =				args.logoWidth 				=== undefined ? 20 : args.logoWidth;

	// Allow clock to be displayed in fullscreen
	var fullscreenable =		args.fullscreenable 		=== undefined ? false : args.fullscreenable;

	// Background color when fullscreen
	var fullscreenBackground =	args.fullscreenBackground 	=== undefined ? "#FFFFFF" : args.fullscreenBackground;


	var faceCanvas = document.createElement("canvas");
	var hourHand = document.createElement("canvas");
	var minuteHand = document.createElement("canvas");
	var secondsHand = document.createElement("canvas");
	var hoursRender = document.createElement("canvas");
	var minutesRender = document.createElement("canvas");
	var secondsRender = document.createElement("canvas");

	var innerContainer = document.createElement("div");
	var renderContainer = document.createElement("div");
	
	hoursRender.style.position = "absolute";
	minutesRender.style.position = "absolute";
	secondsRender.style.position = "absolute";

	renderContainer.appendChild(hoursRender);
	renderContainer.appendChild(minutesRender);
	renderContainer.appendChild(secondsRender);

	if(debugMode){
		var debug = document.getElementById("debug");
		debug.appendChild(hourHand);
		debug.appendChild(minuteHand);
		debug.appendChild(secondsHand);
	}

	faceCanvas.style.position = "absolute";
	renderContainer.style.position = "absolute";

	innerContainer.appendChild(faceCanvas);

	var logo = document.createElement("img");
	if(showLogo){
		logo.src = logoPath;
		logo.style.position = "absolute";
		innerContainer.appendChild(logo);
	}

	innerContainer.appendChild(renderContainer);

	container.appendChild(innerContainer);

	var timeOffset = 0; // is changed when setTime is called

	var defaultSize = 100; // Use as reference size, then scale everything according to clockDiameter.
	var center = defaultSize / 2;
	var clockDiameter = 0;

	var initialRender = true; // If true, all hands will be forced to render. Render resets this to false.

	var hoursCtx = hoursRender.getContext('2d');
	var minutesCtx = minutesRender.getContext('2d');
	var secondsCtx = secondsRender.getContext('2d');

	var handPadding = 10; // To prevent effects from antialiasing causing parts to be cut off
	var previousSecond = -1; // Used so that the hour hand only renders once every second

	var renderBorderWidth;
	
	var faceCtx = faceCanvas.getContext('2d');
	
	// Scale
	var scaleFactor = 0;

	var running = false;
	
	var requestAnimFrame = (function(){
		return  window.requestAnimationFrame ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	window.addEventListener("focus", function(){
		initialRender = true;
	});

	var fullscreen = false;
	var defaultContainerPosition = container.style.position || "static";
	var defaultWidth = container.style.width;
	var defaultHeight = container.style.height;
	var defaultBackground = container.style.backgroundColor;
	var defaultPaddingTop = container.style.paddingTop || "0px";
	var defaultPaddingLeft = container.style.paddingLeft || "0px";
	var defaultPaddingRight = container.style.paddingRight || "0px";
	var defaultPaddingBottom = container.style.paddingBottom || "0px";

	if(fullscreenable){
		container.style.cursor = "pointer";
		
		container.addEventListener("click", function(){
			if(!fullscreen){
				goFullscreen();
			} else {
				leaveFullscreen();
			}
		});

		window.addEventListener("keydown", function(e){
			if(e.code == "Escape"){
				leaveFullscreen();
			}
		});

		window.addEventListener("resize", function(e){
			if(fullscreen){
				scale();
			}
		});

		var goFullscreen = function(){

			innerContainer.style.transitionProperty = "margin-left";
			innerContainer.style.transitionDuration = "300ms";
			innerContainer.style.transitionFunction = "ease-out";
			
			container.style.top = "0px";
			container.style.left = "0px";
			container.style.right = "0px";
			container.style.bottom = "0px";
			container.style.width = "auto";
			container.style.height = "auto";
			container.style.paddingTop = "10px";
			container.style.paddingLeft = "10px";
			container.style.paddingRight = "10px";
			container.style.paddingBottom = "10px";
			container.style.backgroundColor = fullscreenBackground;
			container.style.position = "absolute";
			fullscreen = true;
			scale();
		}

		var leaveFullscreen = function(){
			innerContainer.style.transitionProperty = "none";
			innerContainer.style.transitionDuration = "0ms";
			
			container.style.position = defaultContainerPosition;
			container.style.width = defaultWidth;
			container.style.height = defaultHeight;
			container.style.backgroundColor = defaultBackground;
			container.style.paddingTop = defaultPaddingTop;
			container.style.paddingLeft = defaultPaddingLeft;
			container.style.paddingRight = defaultPaddingRight;
			container.style.paddingBottom = defaultPaddingBottom;
			fullscreen = false;
			scale();
		}
	}

	scale();

	/* Set time to be displayed, in milliseconds since January 1, 1970, 00:00:00 UTC */
	function setTime(newTime){
		var currentTime = Date.now();
		timeOffset = newTime - currentTime;
		initialRender = true;
	}

	function scale(){
		
		var containerHeight = container.clientHeight;
		var containerWidth = container.clientWidth;
		
		if(getComputedStyle){
			var computedStyle = getComputedStyle(container);
			containerHeight -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
			containerWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
		}

		var marginTop = 0;
		var marginLeft = 0;
		
		if(containerWidth > containerHeight){
			clockDiameter = containerHeight;
			marginLeft = (containerWidth - containerHeight)/2;
			marginTop = 0;
		} else {
			clockDiameter = containerWidth;
			marginTop = (containerHeight - containerWidth)/2;
			marginLeft = 0;
		}

		innerContainer.style.marginLeft = marginLeft + "px";
		innerContainer.style.marginTop = marginTop + "px";

		faceCanvas.width = clockDiameter;
		faceCanvas.height = clockDiameter;
		hoursRender.width = clockDiameter;
		hoursRender.height = clockDiameter;
		minutesRender.width = clockDiameter;
		minutesRender.height = clockDiameter;
		secondsRender.width = clockDiameter;
		secondsRender.height = clockDiameter;

		if(showLogo){
			var width = (logoWidth/100)*clockDiameter;
			logo.style.width = width +"px";
			logo.style.marginTop = ((logoTop/100)*clockDiameter) + "px";
			logo.style.marginLeft = (clockDiameter/2 - width/2) + "px";
		}

		if(showBorder){
			var borderScale = clockDiameter / (clockDiameter*2*(borderWidth/100));
			clockDiameter -= clockDiameter / borderScale;
			renderBorderWidth = borderWidth + borderWidth / (borderScale - 1);
			center = defaultSize/2 + renderBorderWidth;
		}

		scaleFactor = clockDiameter/defaultSize;

		if(showShadow){
			var xOffset = (shadowXOffset / 100) * clockDiameter;
			var yOffset = (shadowYOffset / 100) * clockDiameter;
			var blur = (shadowBlur / 100) * clockDiameter;
			var shadow = "drop-shadow("+xOffset+"px "+yOffset+"px "+blur+"px "+shadowColor+")";
			renderContainer.style.filter = shadow;
			renderContainer.style.WebkitFilter = shadow;
			renderContainer.style.MozFilter = shadow;
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

		initialRender = true;

		if(!running){
			animationLoop();
			running = true;
		}
	}
		
	// Render basic circle
	function renderClockCircle(){
		faceCtx.save();
		faceCtx.beginPath();
		faceCtx.arc(
			center,
			center,
			defaultSize/2,
			0,
			2 * Math.PI,
			false
		);
		faceCtx.fillStyle = backgroundColor;
		faceCtx.fill();
		
		if(showBorder){
			faceCtx.beginPath();
			faceCtx.arc(
				center,
				center,
				defaultSize/2 + renderBorderWidth/2,
				0,
				2 * Math.PI,
				false
			);
			faceCtx.strokeStyle = borderColor;
			faceCtx.lineWidth = renderBorderWidth;
			faceCtx.stroke();
		}
		
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
		
		var currentdate = new Date(Date.now() + timeOffset); 
		//var currentdate = new Date((currentdate.getTime()-1400000000000)*10000);
		var currentHour = currentdate.getHours();
		var currentMinute = currentdate.getMinutes();
		var currentSecond = currentdate.getSeconds();
		var currentMillisecond = currentSecond*1000 + currentdate.getMilliseconds();
		currentHour = currentHour*3600 + currentMinute*60 + currentSecond;

		if(currentSecond != previousSecond || initialRender){

			hoursCtx.clearRect(0, 0, hoursRender.width, hoursRender.height);

			hoursCtx.save();

			hoursCtx.translate(
				center*scaleFactor,
				center*scaleFactor
			);
			hoursCtx.rotate(1.5*Math.PI);
			
			var hoursDegree = currentHour/(12*3600) * 2*Math.PI;
			
			hoursCtx.save();
			hoursCtx.rotate(hoursDegree);
			hoursCtx.drawImage(hourHand, 0 - hourHand.width + hourHand.width * (hourTipToPivot * 0.01), 0 - hourHand.height / 2);
			hoursCtx.restore();
			
			hoursCtx.restore();

		}

		previousSecond = currentSecond;
		
		if(currentMillisecond < minuteHandJumpDuration*2 || initialRender){

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

			minutesCtx.clearRect(0, 0, minutesRender.width, minutesRender.height);

			minutesCtx.save();

			minutesCtx.translate(
				center*scaleFactor,
				center*scaleFactor
			);
			minutesCtx.rotate(1.5*Math.PI);

			minutesCtx.save();
			minutesCtx.rotate(minutesDegree);
			minutesCtx.drawImage(minuteHand, 0 - minuteHand.width + minuteHand.width * (minuteTipToPivot * 0.01), 0 - minuteHand.height / 2);
			minutesCtx.restore();
			
			minutesCtx.restore();
		}

		secondsCtx.clearRect(0, 0, secondsRender.width, secondsRender.height);

		secondsCtx.save();

		secondsCtx.translate(
			center*scaleFactor,
			center*scaleFactor
		);
		secondsCtx.rotate(1.5*Math.PI);
		
		var secondsDegree = (currentMillisecond/(60000 - minuteGap)) * 2 * Math.PI;
		if(secondsDegree > 2*Math.PI){
			secondsDegree = 2*Math.PI;
		}
		
		secondsCtx.save();
		secondsCtx.rotate(secondsDegree);
		secondsCtx.drawImage(secondsHand, 0 - secondsHand.width + secondsHand.width * (secondsHandPivot * 0.01), 0 - secondsHand.height / 2);
		secondsCtx.restore();
		
		secondsCtx.restore();

		initialRender = false;
	}
	
	function animationLoop(){
		render();
		requestAnimFrame(animationLoop);
	};

	return {
		/* Fit clock to container size */
		scale: scale

		/* Set time to be displayed, in milliseconds since January 1, 1970, 00:00:00 UTC */
		,setTime: setTime
	};
	
}
