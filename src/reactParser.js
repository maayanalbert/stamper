var esprima = require("esprima");



function getNumLines(code){
	var program = esprima.parseScript(code, {
    comment: true,
    tolerant: true,
    loc: true
  });



	var maxLine = program.loc.end.line
	
	for(var n = 0; n< program.comments.length; n++){
		
		var comment = program.comments[n]


		var maxLine = Math.max(comment.loc.end.line, maxLine)
	}	

	return maxLine
}

exports.getNumLines = getNumLines;
