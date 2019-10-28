
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

var temp;


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

        var maxValue = 0;
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

            if (totalDaysAvailable > maxValue)
            {
                maxValue = totalDaysAvailable;
            }

            arrayItem.totalDaysAvailable = totalDaysAvailable;
            arrayItem.values = rooms;
        });

        _vis.setData(nestedSubset);

        // Get neighbourhood names
        var neighbourhoods = [];
        nestedSubset.forEach(function (arrayItem) {
            var item = arrayItem.key;
            neighbourhoods.push(item);
        });

        var xScale = d3.scaleBand()
            .range([MARGINS.left, _vis.width - MARGINS.left])
            .domain(neighbourhoods);

        var yScale = d3.scaleLinear()
            .range([_vis.height - MARGINS.bottom, MARGINS.top])
            .domain([0, maxValue]);

        _vis.setupScales(xScale, yScale);
        _vis.setupAxes("Neighbourhood Group", "Available Days");
        _vis.createBars("neighbourhoodGroup", "totalDaysAvailable");
    });
}