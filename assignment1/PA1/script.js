/**
 * Some useful links used:
 *  * D3 Documentation: https://github.com/d3/d3/wiki
 *  * Coskun Sahin's CPSC 583 Tutorial Slides
 */

/**
 * Call our functions on window load event
 */
window.onload = function(){
    setup();
};

/**
 * Object to keep track of our magic numbers for margins
 * @type {{top: number, left: number, bottom: number, right: number}}
 */
const MARGINS = {top: 100, right: 10, bottom: 60, left: 150};

// Global variables for svg elements
var _vis;
var _legend;

/**
 * Initialize the global svg elements
 */
function setup(){
    _vis = new BarChart(d3.select("#vis"));
    _legend = d3.select("#legend");
    loadAndCleanData("AB_NYC_2019_Subset_2.csv");
}

/**
 * Loads and cleans up the data to be used to create a Bar Chart
 *
 * Useful link: http://learnjsdata.com/group_data.html
 * @param dataPath
 */
function loadAndCleanData(dataPath)
{
    d3.csv(dataPath).then(function(data){

        // Only pull out the columns that we want
        var subset = data.map(function (d) {
            return {
                daysAvailable: d.availability_365,
                neighbourhoodGroup: d.neighbourhood_group,
                roomType: d.room_type
            }});

        // Group data by neighbourhoodGroups
        subset = d3.nest()
            .key(function (d) {
            return d.neighbourhoodGroup;
            })
            .entries(subset);

        // Parse out individual room types with there values and bring it to the top level
        subset.forEach(function (arrayItem) {
            var rooms = d3.nest()
               .key(function (d) {return d.roomType})
                .rollup(function (v) {
                    return d3.sum(v, function (d) {
                        return d.daysAvailable;
                    })
                })
               .entries(arrayItem.values);

            rooms.forEach(function (item) {
                arrayItem[item.key] = item.value;
            });
        });

        // Make sure all neighbourhoods have a value for the following colour keys
        const colourKeys = ["Entire home/apt", "Private room", "Shared room"];
        var dataIntermediate = colourKeys.map(function(home){
            return subset.map(function(d){
                return {x: d['key'], y: (d[home] === undefined ? 0 : d[home]) };
            })
        });

        // Get data in final form
        subset = myStack(dataIntermediate);

        // Get neighbourhood names
        var neighbourhoods = [];
        subset[0].forEach(function (arrayItem) {
            var item = arrayItem.x;
            neighbourhoods.push(item);
        });

        // Get maxValue
        var maxValue = d3.max(subset[subset.length - 1], function(d) { return d.y0 + d.y; });

        setupBarChart(subset, colourKeys, neighbourhoods, maxValue)
    });
}

/**
 * Code that assigns and calls all setup functions for the bar chart
 * @param finalData Cleaned data
 * @param colourKeys Keys for differentiated bar colours
 * @param xAxisNames X-Axis label names
 * @param maxYValue Largest Y axis value needed
 */
function setupBarChart(finalData, colourKeys, xAxisNames, maxYValue) {
    // Set the data
    _vis.setData(finalData);

    // Create scales
    var xScale = d3.scaleBand()
        .range([MARGINS.left, _vis.width - MARGINS.left])
        .domain(xAxisNames)
        .padding(0.5);

    var yScale = d3.scaleLinear()
        .range([_vis.height - MARGINS.bottom, MARGINS.top])
        .domain([0, maxYValue]);

    var colourScale = d3.scaleOrdinal(d3.schemeAccent);

    // Create Bar chart
    _vis.setupScales(xScale, yScale, colourScale);
    _vis.setupAxes("Neighbourhood Group", "Available Days in a Year");
    _vis.createBars("x");
    _vis.createLegend(colourKeys, _legend)
}

/**
 * My hack solution for d3.stack()
 * Adds the y0 coordinate for each element
 * @param array
 */
function myStack(array) {
    array[0].forEach(function (arrayElement) {
        arrayElement.y0 = 0;
    });
    for (var i = 1; i < array.length; i++)
    {
        for (var j = 0; j < array[i].length; j++)
        {
            array[i][j].y0 = array[i - 1][j].y0 + array[i - 1][j].y;
        }
    }
    return array;
}