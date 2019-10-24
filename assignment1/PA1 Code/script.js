/**
 * Call our functions on window load event
 */
window.onload = function(){
    setup();
};

// Global variables
var _data;  // contains our data array
var _vis;   // the svg container where we will draw our visualization
var _vis_width = 0;     // dimensions of the visualization
var _vis_height = 0;

const PADDING_FOR_LABELS = 150;

function setup() {
    _vis = d3.select("#vis").node();

    // grab our container's dimension
    _vis_width = d3.select("#vis").node().getBoundingClientRect().width;
    _vis_height = d3.select("#vis").node().getBoundingClientRect().height;
    loadData("AB_NYC_2019_Subset_2.csv");
}

function loadData(dataPath)
{
    // call D3's loading function for CSV and load the data to our global variable _data
    d3.csv(dataPath).then(function(data){
        _data = data;
        setupBars();
    });
}

/**
 * Function setupBars: sets up rectangles to represent each data point in our dataset
 */
function setupBars()
{
    // divide the width of our vis to the number of columns
    var x_pad = Math.floor(_vis_width / _data.length);

    // for each item in our dataset, create a column on the x-axis and label it
    for (var i = 0; i < _data.length; i++)
    {
        // create a string that follows the HTML tag for drawing a rectangle
        // e.g., <rect x='0' y='0' width='100' height='100' style='fill:black; strokewidth:0;'></rect>
        // the rectangle's ID should match an index within our data (e.g., column_0 corresponds to _data[0])
        // default height is the height of the visualization - some padding for labels
        var rect = "<rect id='column_" + i + "' x='" + i * x_pad + "' y='0' width='" + (x_pad / 1.5) + "' height='" +
            (_vis_height - PADDING_FOR_LABELS) + "' style='fill:coral; stroke-width: 1; stroke:white;'></rect>";
        //append the line within the SVG container element
        _vis.innerHTML += rect;

        // create labels using the Country name (Capitalize this because it's capitalized in our CSV file)
        var label = "<text x='" + i * x_pad + "' y='" + (_vis_height - PADDING_FOR_LABELS + 10) + "' " +
            "transform='rotate(90," + i * x_pad + "," + (_vis_height - PADDING_FOR_LABELS + 10) + ")'>" +
            _data[i].Country + "</text>";
        //append the label within the SVG container element
        _vis.innerHTML += label;
    }
}

/**
 * Function changeBarHeights: changes the heights of the bars in our visualization with values
 * from a given data attribute
 * @param attr the data attribute containing the value to be applied to each bar's height
 * @param maxAttrValue the maximum value the attribute can have
 * assume the min value is 0
 */
function changeBarHeights(attr, maxAttrValue){
    for (var i = 0; i < _data.length; i++){
        var newHeight = mapValue(_data[i][attr], 0, maxAttrValue, 0, _vis_height - PADDING_FOR_LABELS);
        var bar = document.getElementById("column_" + i);

        var oldY = bar.getAttribute("y");
        var oldHeight = bar.getAttribute("height");
        var newY = _vis_height - PADDING_FOR_LABELS - newHeight;

        bar.setAttribute("y", oldY);
        bar.setAttribute("height", oldHeight);

        var animate = "<animate id='animate_bar_" + i + "' attributeName='y' from='" + oldY + "' " +
            "to='" + newY + "' dur='1s' begin='indefinite'" +
            "repeatCount='1' fill='freeze'></animate>" +
            "<animate attributeName='height' from='"+ oldHeight +"' to='"+ newHeight +"' dur='1s' " +
            "begin='animate_bar_"+ i +".begin' fill='freeze'></animate>" +
            "<title>"+ _data[i][attr] +"</title>";
        bar.innerHTML = animate;
        document.getElementById('animate_bar_' + i).beginElement();
    }
}

/**
 * Function maps a value from an old range of values to a new range
 * @param value the number to be remapped to a given range
 * @param origMin the minimum value of the original range
 * @param origMax the maximum value of the original range
 * @param newMin the minimum value of the new range
 * @param newMax the maximum value of the new range
 */
function mapValue(value, origMin, origMax, newMin, newMax){
    return (value - origMin) * (newMax - newMin) / (origMax - origMin) + newMin;
}