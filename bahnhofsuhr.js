


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
	var backgroundColor = 		args.backgroundColor 		=== undefined ? '#FAFAFA' : args.backgroundColor;
	
	// RGB color of the minute/hour hands and the minute indices
	var foregroundColor = 		args.foregroundColor 		=== undefined ? 'rgb(62, 62, 62)' : args.foregroundColor;
	
	// RGB color of the seconds hand
	var secondsColor = 		args.secondsColor 			=== undefined ? 'rgb(223, 62, 89)' : args.secondsColor;
	
	// Width of the larger indices in % of the clock diameter
	var fiveMinuteStepWidth = 	args.fiveMinuteStepWidth 	=== undefined ? 3.5 : args.fiveMinuteStepWidth;
	
	// Width of the smaller indices in % of the clock diameter
	var minuteStepWidth = 		args.minuteStepWidth 		=== undefined ? 1.4 : args.minuteStepWidth;
	
	// Distance of the indices to the face's outer border in % of the clock diameter
	var stepPadding = 			args.stepPadding 			=== undefined ? 1.5 : args.stepPadding;
	
	// Length of the larger indices in % of the clock diameter
	var fiveMinuteStepLength = 	args.fiveMinuteStepLength 	=== undefined ? 12 : args.fiveMinuteStepLength;
	
	// Length of the smaller indices in % of the clock diameter
	var minuteStepLength = 		args.minuteStepLength 		=== undefined ? 3.5 : args.minuteStepLength;
	
	// The hour hand trapezoid's side closest to the center in % of the clock diameter
	var hourHandInnerWidth = 	args.hourHandInnerWidth 	=== undefined ? 6.4 : args.hourHandInnerWidth;
	
	// The hour hand trapezoid's far side from the center in % of the clock diameter
	var hourHandOuterWidth = 	args.hourHandOuterWidth 	=== undefined ? 5.2 : args.hourHandOuterWidth;
	
	// The hour hand's length in % of the clock diameter
	var hourHandLength = 		args.hourHandLength 		=== undefined ? 44 : args.hourHandLength;
	
	// Distance from the inner end of the hour hand to the face's center
	var hourHandPivot = 		args.hourHandPivot 			=== undefined ? 12 : args.hourHandPivot;
	
	// The minute hand trapezoid's side closest to the center in % of the clock diameter
	var minuteHandInnerWidth = 	args.minuteHandInnerWidth 	=== undefined ? 5.2 : args.minuteHandInnerWidth;
	
	// The minute hand trapezoid's far side from the center in % of the clock diameter
	var minuteHandOuterWidth = 	args.minuteHandOuterWidth 	=== undefined ? 3.6 : args.minuteHandOuterWidth;
	
	// Distance from the outer end of the minute hand to the face's center in % of its length
	var minuteHandLength = 		args.minuteHandLength 		=== undefined ? 58 : args.minuteHandLength;
	
	// Distance from the inner end of the minute hand to the face's center
	var minuteHandPivot = 		args.minuteHandPivot 		=== undefined ? 12 : args.minuteHandPivot;
	
	// Total length of the seconds hand
	var secondsHandLength = 	args.secondsHandLength 		=== undefined ? 52.2 : args.secondsHandLength;
	
	// Width of the narrow part of the seconds hand
	var secondsHandWidth = 		args.secondsHandWidth 		=== undefined ? 1.4 : args.secondsHandWidth;
	
	// Radius of the circle on the tip of the seconds hand
	var secondsHandRadius = 	args.secondsHandRadius 		=== undefined ? 5.25 : args.secondsHandRadius;
	
	// Distance from the shorter end of the seconds hand to the face's center
	var secondsHandPivot = 		args.secondsHandPivot 		=== undefined ? 16.5 : args.secondsHandPivot;
	
	// How long the seconds hand will stop at a full minute, in milliseconds
	var minuteGap = 			args.minuteGap 				=== undefined ? 2000 : args.minuteGap;
	
	// How long it takes the minutes hand to jump to the next minute, in milliseconds
	var minuteHandJumpDuration =args.minuteHandJumpDuration === undefined ? 5000 : args.minuteHandJumpDuration;

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
	var borderWidth =			args.borderWidth 			=== undefined ? 2.5 : args.borderWidth;

	// Border color
	var borderColor =			args.borderColor 			=== undefined ? "#999999" : args.borderColor;

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
	var handsCanvas = document.createElement("canvas");
	//handsCanvas.style.willChange = "transform";

	var innerContainer = document.createElement("div");
	//innerContainer.style.willChange = "transform";
	
	handsCanvas.style.position = "absolute";
	faceCanvas.style.position = "absolute";

	innerContainer.appendChild(faceCanvas);

	var logo = document.createElement("img");
	if(showLogo){
		logo.src = logoPath;
		logo.style.position = "absolute";
		innerContainer.appendChild(logo);
	}

	innerContainer.appendChild(handsCanvas);
	container.appendChild(innerContainer);

	var timeOffset = 0; // is changed when setTime is called

	var defaultSize = 100; // Use as reference size, then scale everything according to clockDiameter.
	var center = defaultSize / 2;
	var clockDiameter = 0;

	var renderBorderWidth;
	
	var handsCtx = handsCanvas.getContext('2d');
	var faceCtx = faceCanvas.getContext('2d');
	
	// Scale
	var scaleFactor = 0;

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
	
	//setTime(1530106317561);
	scale();
	animationLoop();

	/* Set time to be displayed, in milliseconds since January 1, 1970, 00:00:00 UTC */
	function setTime(newTime){
		var currentTime = Date.now();
		timeOffset = newTime - currentTime;
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
		
		innerContainer.style.width = (containerWidth - 2*marginLeft) + "px";
		innerContainer.style.height = (containerHeight - 2*marginTop) + "px";

		faceCanvas.width = clockDiameter;
		faceCanvas.height = clockDiameter;
		handsCanvas.width = clockDiameter;
		handsCanvas.height = clockDiameter;

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
			handsCanvas.style.filter = shadow;
			handsCanvas.style.WebkitFilter = shadow;
			handsCanvas.style.MozFilter = shadow;
		}

		renderClockFace();
	}

	function renderClockFace(){
		faceCtx.fillStyle = foregroundColor;
		faceCtx.scale(scaleFactor, scaleFactor);
		faceCtx.save();
		
		renderClockCircle();
		renderFiveMinuteSteps();
		renderMinuteSteps();
	}
		
	// Render basic circle
	function renderClockCircle(){
		faceCtx.save();
		faceCtx.beginPath();
		
		faceCtx.fillStyle = backgroundColor;
		
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
			faceCtx.fill();
			faceCtx.stroke();
			
		} else {
			faceCtx.arc(
				center,
				center,
				defaultSize/2,
				0,
				2 * Math.PI,
				false
			);
			faceCtx.fill();
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
		
	// Display on visible canvas
	function render(){
		
		var currentdate = new Date(Date.now() + timeOffset); 
		var currentMinute = currentdate.getMinutes();
		var currentSecond = currentdate.getSeconds();
		var currentMillisecond = currentSecond*1000 + currentdate.getMilliseconds() + (performance.now()%1);
		var currentHour = currentdate.getHours()*3600 + currentMinute*60 + currentSecond;
		
		handsCtx.clearRect(0, 0, handsCanvas.width, handsCanvas.height);
		
		handsCtx.save();
		handsCtx.scale(scaleFactor, scaleFactor);
		handsCtx.translate(center, center);
		
		handsCtx.lineWidth = 1/scaleFactor;
		
		renderHourHand();
		renderMinutesHand();
		renderSecondsHand();
		
		handsCtx.restore();
		
		function renderSecondsHand(){
			handsCtx.save();
		
			var secondsDegree = (currentMillisecond/(60000 - minuteGap)) * 2 * Math.PI;
			if(secondsDegree > 2*Math.PI){
				secondsDegree = 2*Math.PI;
			}
			
			handsCtx.rotate(secondsDegree + 1.5*Math.PI);
		
			handsCtx.fillStyle = secondsColor;
			
			handsCtx.beginPath();
			
			handsCtx.rect(
				-secondsHandPivot,
				-secondsHandWidth/2,
				 secondsHandLength-secondsHandRadius,
				 secondsHandWidth
			);
			
			handsCtx.moveTo(
				secondsHandLength - secondsHandPivot,
				0
			);
			handsCtx.arc(
				secondsHandLength - secondsHandRadius - secondsHandPivot,
				0,
				secondsHandRadius,
				0,
				2 * Math.PI,
				false
			);
			handsCtx.fill();
			handsCtx.restore();
		}
		
		function renderMinutesHand(){
			handsCtx.save();
			
			var minutesDegree = currentMinute/60 * 2*Math.PI;

			if(currentMillisecond < minuteHandJumpDuration){
				minutesDegree = minutesDegree
					- (1/60*2*Math.PI)
					+ (1/60*2*Math.PI)
					*(
						1 - Math.pow(
							(0-currentMillisecond+minuteHandJumpDuration)
							/minuteHandJumpDuration
						, 20)
						*Math.cos(currentMillisecond*(0.03))
				);
			}
			
			handsCtx.rotate(minutesDegree + 1.5*Math.PI);
			
			handsCtx.fillStyle = foregroundColor;
			handsCtx.beginPath();
			handsCtx.moveTo(
				-minuteHandPivot,
				-minuteHandInnerWidth/2
			);
			handsCtx.lineTo(
				minuteHandLength - minuteHandPivot,
				-minuteHandOuterWidth/2
			);
			handsCtx.lineTo(
				minuteHandLength - minuteHandPivot,
				minuteHandOuterWidth/2
			);
			handsCtx.lineTo(
				-minuteHandPivot,
				minuteHandInnerWidth/2
			);
			handsCtx.closePath();
			
			handsCtx.fill();
			
			handsCtx.restore();
		}
		
		function renderHourHand(){
			handsCtx.save();
			
			var hoursDegree = currentHour/(12*3600) * 2*Math.PI;
			
			handsCtx.rotate(hoursDegree + 1.5*Math.PI);
			
			handsCtx.fillStyle = foregroundColor;
			handsCtx.beginPath();
			handsCtx.moveTo(
				-hourHandPivot,
				-hourHandInnerWidth/2
			);
			handsCtx.lineTo(
				hourHandLength - hourHandPivot,
				-hourHandOuterWidth/2
			);
			handsCtx.lineTo(
				hourHandLength - hourHandPivot,
				hourHandOuterWidth/2
			);
			handsCtx.lineTo(
				-hourHandPivot,
				hourHandInnerWidth/2
			);
			handsCtx.closePath();
			
			handsCtx.fill();
			
			handsCtx.restore();
		}

	}
	
	function animationLoop(){
		render();
		requestAnimationFrame(animationLoop);
	};

	return {
		/* Fit clock to container size */
		scale: scale

		/* Set time to be displayed, in milliseconds since January 1, 1970, 00:00:00 UTC */
		,setTime: setTime
	};
	
}
