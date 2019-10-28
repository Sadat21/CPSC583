
/**
 * Call our functions on window load event
 */
window.onload = function(){
    setup();
};

/**
 * object to keep track of our magic numbers for margins
 * @type {{top: number, left: number, bottom: number, right: number}}
 */
const MARGINS = {top: 100, right: 10, bottom: 60, left: 150};

// Global variables
var _vis;
var _legend;

/**
 * Function setup: sets up our visualization environment.
 * You can change the code to not have static paths and elementID's
 */
function setup(){
    _vis = new BarChart(d3.select("#vis"));
    _legend = d3.select("#legend");
    loadData("AB_NYC_2019_Subset_2.csv");
}

function loadData(dataPath)
{
    // call D3's loading function for CSV and load the data to our global variable _data
    d3.csv(dataPath).then(function(data){
        var subset = data.map(function (d) {
            return {
                daysAvailable: d.availability_365,
                neighbourhoodGroup: d.neighbourhood_group,
                roomType: d.room_type
            }});

        var nestedSubset = d3.nest()
            .key(function (d) {
            return d.neighbourhoodGroup;
            })
            .entries(subset);

        nestedSubset.forEach(function (arrayItem) {
            var rooms = d3.nest()
               .key(function (d) {return d.roomType})
                .rollup(function (v) {
                    return d3.sum(v, function (d) {
                        return d.daysAvailable;
                    })
                })
               .entries(arrayItem.values);

            const totalDaysAvailable = d3.sum(rooms, function (d) {
                return d.value;
            });

            arrayItem.totalDaysAvailable = totalDaysAvailable;
            rooms.forEach(function (item) {
                arrayItem[item.key] = item.value;
            });
            arrayItem.values = rooms;
        });

        // TODO: Make the string array dynamic
        var colourKeys = ["Entire home/apt", "Private room", "Shared room"];
        var dataIntermediate = colourKeys.map(function(home){
            return nestedSubset.map(function(d){
                return {x: d['key'], y: (d[home] === undefined ? 0 : d[home]) };
            })
        });

        nestedSubset = myStack(dataIntermediate);

        _vis.setData(nestedSubset);

        console.log(nestedSubset);

        // Get neighbourhood names
        var neighbourhoods = [];
        nestedSubset[0].forEach(function (arrayItem) {
            var item = arrayItem.x;
            neighbourhoods.push(item);
        });

        // Get maxValue
        var maxValue = d3.max(nestedSubset[nestedSubset.length - 1], function(d) { return d.y0 + d.y; });

        var xScale = d3.scaleBand()
            .range([MARGINS.left, _vis.width - MARGINS.left])
            .domain(neighbourhoods)
            // TODO: Make this dynamic
            .padding(0.5);

        var yScale = d3.scaleLinear()
            .range([_vis.height - MARGINS.bottom, MARGINS.top])
            .domain([0, maxValue]);

        var colourScale = d3.scaleOrdinal(d3.schemeAccent);

        _vis.setupScales(xScale, yScale, colourScale);
        _vis.setupAxes("Neighbourhood Group", "Available Days in a Year");
        _vis.createBars("x", "totalDaysAvailable");
        _vis.createLegend(colourKeys, _legend)
    });
}

/**
 * My hack solution for d3.stack()
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