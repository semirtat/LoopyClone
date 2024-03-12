/**********************************
LABELLER
**********************************/
function Labeller(loopy){
	var self = this;
	self.loopy = loopy;
	self.tryMakingLabel = function(){
	// ONLY WHEN EDITING w LABEL
	if(self.loopy.mode!=Loopy.MODE_EDIT) return;
	if(self.loopy.tool!=Loopy.TOOL_LABEL) return;
	// And if ALREADY EDITING LABEL, just GO TO TOP.
	if(self.loopy.sidebar.currentPage.id == "Label"){
	loopy.sidebar.showPage("Edit");
	return;
	}
	// Otherwise, make it & edit it!
	var newLabel = loopy.model.addLabel({
	x: Mouse.x,
	y: Mouse.y+10 // whatever, to make text actually centered.
	});
	// Check if the label is too long and add line breaks
	var labelText = newLabel.text;
	var maxLength = 20; // Adjust this value to determine what "too long" means
	if (labelText.length > maxLength) {
	var words = labelText.split(" ");
	var newLabelText = "";
	var currentLine = "";
	for (var i = 0; i < words.length; i++) {
	var word = words[i];
	if (currentLine.length + word.length <= maxLength) {
	currentLine += (currentLine ? " " : "") + word;
	} else {
	newLabelText += (newLabelText ? "\n" : "") + currentLine;
	currentLine = word;
	}
	}
	if (currentLine) {
	newLabelText += (newLabelText ? "\n" : "") + currentLine;
	}
	newLabel.text = newLabelText;
	}
	loopy.sidebar.edit(newLabel);
	};
	}