//Import feelings.txt into array - each line is a seperate part of the array
var feelings = new Array();
$.get('feelings.txt', function(data){
    feelings = data.split('\n');
});

//Wordrap function to prevent longer feelings from disappearing out of the div taken from http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
    }
    context.fillText(line, x, y);
}