/**********************************

LABEL!

**********************************/

Label.FONTSIZE = 40;
Label.MAX_TEXT_WIDTH = 10; // Set the max width to 300 pixels

function Label(model, config){

    var self = this;
    self._CLASS_ = "Label";

    // Mah Parents!
    self.loopy = model.loopy;
    self.model = model;
    self.config = config;

    // Default values...
    _configureProperties(self, config, {
        x: 0,
        y: 0,
        text: "...",
        maxTextWidth: Label.MAX_TEXT_WIDTH // Add a maxTextWidth property
    });

    // Draw
    var _circleRadius = 0;
    self.draw = function(ctx){

        // Retina
        var x = self.x*2;
        var y = self.y*2;

        // DRAW HIGHLIGHT???
        if(self.loopy.sidebar.currentPage.target == self){
            var bounds = self.getBounds();
            ctx.save();
            ctx.scale(2,2); // RETINA
            ctx.beginPath();
            ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height);
            ctx.fillStyle = HIGHLIGHT_COLOR;
            ctx.fill();
            ctx.restore();
        }

        // Translate!
        ctx.save();
        ctx.translate(x,y);

        // Text!
        ctx.font = "100 "+Label.FONTSIZE+"px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000";

        // Break lines if necessary
        var lines = self.breakText(ctx); // Pass the context to breakText
        ctx.translate(0, -(Label.FONTSIZE*lines.length)/2);
        for(var i=0; i<lines.length; i++){
            var line = lines[i];
            ctx.fillText(line, 0, 0);
            ctx.translate(0, Label.FONTSIZE);
        }

        // Restore
        ctx.restore();

    };

	//////////////////////////////////////
    // BREAK TEXT INTO LINES /////////////
    //////////////////////////////////////

    self.breakText = function(ctx){
        var words = self.text.split(' ');
        var lines = [];
        var currentLine = words[0];

        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = ctx.measureText(currentLine + " " + word).width;
            if (width < self.maxTextWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine); // Push the last line

        return lines;
    };

	//////////////////////////////////////
	// KILL LABEL /////////////////////////
	//////////////////////////////////////

	self.kill = function(){

		// Remove from parent!
		model.removeLabel(self);

		// Killed!
		publish("kill",[self]);

	};

	//////////////////////////////////////
	// HELPER METHODS ////////////////////
	//////////////////////////////////////

	self.getBounds = function(){

		var ctx = self.model.context;

		// Get MAX width...
		var lines = self.breakText();
		var maxWidth = 0;
		for(var i=0; i<lines.length; i++){
			var line = lines[i];
			var w = (ctx.measureText(line).width + 10)*2;
			if(maxWidth<w) maxWidth=w;
		}

		// Dimensions, then:
		var w = maxWidth;
		var h = (Label.FONTSIZE*lines.length)/2;

		// Bounds, then:
		return {
			x: self.x-w/2,
			y: self.y-h/2-Label.FONTSIZE/2,
			width: w,
			height: h+Label.FONTSIZE/2
		};

	};

	self.isPointInLabel = function(x, y){
		return _isPointInBox(x,y, self.getBounds());
	};

	self.getBoundingBox = function(){
		var bounds = self.getBounds();
		return {
			left: bounds.x,
			top: bounds.y,
			right: bounds.x + bounds.width,
			bottom: bounds.y + bounds.height
		};
	};

}