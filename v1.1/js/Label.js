/**********************************
LABEL!
**********************************/

Label.FONTSIZE = 40;

function Label(model, config) {
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
        text: "..."
    });

    // Break text into lines
    self.breakText = function () {
        const maxCharsPerLine = 20;
        const lines = [];
        let currentLine = '';

        for (let i = 0; i < self.text.length; i++) {
            const char = self.text[i];

            if (currentLine.length === maxCharsPerLine) {
                lines.push(currentLine);
                currentLine = '';
            }

            if (char !== '\n') {
                currentLine += char;
            } else {
                lines.push(currentLine);
                currentLine = '';
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    };

    // Draw
    var _circleRadius = 0;
    self.draw = function (ctx) {
        // Retina
        var x = self.x * 2;
        var y = self.y * 2;

        // DRAW HIGHLIGHT???
        if (self.loopy.sidebar.currentPage.target == self) {
            var bounds = self.getBounds();
            ctx.save();
            ctx.scale(2, 2); // RETINA
            ctx.beginPath();
            ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height);
            ctx.fillStyle = HIGHLIGHT_COLOR;
            ctx.fill();
            ctx.restore();
        }

        // Translate!
        ctx.save();
        ctx.translate(x, y);

        // Text!
        ctx.font = "100 " + Label.FONTSIZE + "px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000";

        const lines = self.breakText();
        const lineHeight = Label.FONTSIZE;
        const totalHeight = lines.length * lineHeight;
        ctx.translate(0, -totalHeight / 2 + lineHeight / 2); // Adjust the vertical position

        lines.forEach((line, index) => {
            ctx.fillText(line, 0, index * lineHeight);
        });

        // Restore
        ctx.restore();
    };

    //////////////////////////////////////
    // KILL LABEL /////////////////////////
    //////////////////////////////////////

    self.kill = function () {
        // Remove from parent!
        model.removeLabel(self);

        // Killed!
        publish("kill", [self]);
    };

    //////////////////////////////////////
    // HELPER METHODS ////////////////////
    //////////////////////////////////////

    self.getBounds = function () {
        var ctx = self.model.context;

        // Get MAX width...
        var lines = self.breakText();
        var maxWidth = 0;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var w = (ctx.measureText(line).width + 10) * 2;
            if (maxWidth < w) maxWidth = w;
        }

        // Dimensions, then:
        var w = maxWidth;
        var h = (Label.FONTSIZE * lines.length) / 2;

        // Bounds, then:
        return {
            x: self.x - w / 2,
            y: self.y - h / 2 - Label.FONTSIZE / 2,
            width: w,
            height: h + Label.FONTSIZE / 2
        };
    };

    self.isPointInLabel = function (x, y) {
        return _isPointInBox(x, y, self.getBounds());
    };

    self.getBoundingBox = function () {
        var bounds = self.getBounds();
        return {
            left: bounds.x,
            top: bounds.y,
            right: bounds.x + bounds.width,
            bottom: bounds.y + bounds.height
        };
    };
}