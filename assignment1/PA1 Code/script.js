
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
const MARGINS = {top: 10, right: 10, bottom: 60, left: 60};

// Global variables
var _vis;


/**
 * Function setup: sets up our visualization environment.
 * You can change the code to not have static paths and elementID's
 */
function setup(){
    _vis = new BarChart(d3.select("#vis"));
    loadData("AB_NYC_2019_Subset_2.csv");
}

function loadData(dataPath)
{
    // call D3's loading function for CSV and load the data to our global variable _data
    d3.csv(dataPath).then(function(data){
        _vis.setData(data.map(function (d) {
            return {
                daysAvailable: d.availability_365,
                neighbourhoodGroup: d.neighbourhood_group,
                roomType: d.room_type
            }
        }));

        var xScale = d3.scaleBand()
            .range([MARGINS.left, _vis.width - MARGINS.left])
            .domain(["Manhattan", "Queens", "Bronx", "Brooklyn"]);

        var yScale = d3.scaleLinear()
            .range([_vis.height - MARGINS.bottom, MARGINS.top])
            .domain([40, 100]);

        _vis.setupScales(xScale, yScale);
        _vis.setupAxes("Neighbourhood", "Available Days");
        _vis.createBars("neighbourhoodGroup", "daysAvailable");
    });
}