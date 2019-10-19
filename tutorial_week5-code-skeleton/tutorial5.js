/**
 * Call our functions on window load event
 */
window.onload = function(){
    setupVis1();
    setupVis2();
    setupVis3();
    setupVis4();
    setupVis5();
};

const SAMPLE_DATA = [
    { "month" : "January", "point" : [5, 20], "r" : 10 },
    { "month" : "February", "point" : [480, 90], "r" : 1 },
    { "month" : "March", "point" : [250, 50], "r" : 3 },
    { "month" : "April", "point" : [100, 33], "r" : 3 },
    { "month" : "May", "point" : [330, 95], "r" : 4 },
    { "month" : "June", "point" : [300, 40], "r" : 8 },
    { "month" : "July", "point" : [410, 35], "r" : 6 },
    { "month" : "August", "point" : [475, 44], "r" : 4 },
    { "month" : "September", "point" : [25, 67], "r" : 1 },
    { "month" : "October", "point" : [85, 21], "r" : 5 },
    { "month" : "November", "point" : [220, 88], "r" : 10 },
    { "month" : "December", "point" : [400, 4], "r" : 7 },
];

const WIDTH = 1000;
const HEIGHT = 300;
const PAD = 10;
const MARGIN = 50;

let xScale = d3.scaleLinear()
    .domain([0, d3.max(SAMPLE_DATA, function (d) {
        return d.point[0];
    })])
    .range([MARGIN, WIDTH-MARGIN]);

let yScale = d3.scaleLinear()
    .domain([0, d3.max(SAMPLE_DATA, function (d) {
        return d.point[1];
    })])
    .range([MARGIN, HEIGHT-MARGIN]);

function configureBox(id) {
    return d3.select("#" + id)
        .attr("width", WIDTH)
        .attr("height", HEIGHT);
}

function configureCircle(svg) {
    return svg.selectAll("circle")
        .data(SAMPLE_DATA)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d.point[0])
        })
        .attr("cy", function (d) {
            return yScale(d.point[1])
        })
        .attr("r", 5)
        .style("fill", "coral")
        .style("stroke", "none");
}

function configureText(svg) {
    return svg.selectAll("text")
        .data(SAMPLE_DATA)
        .enter()
        .append("text")
        .text(function (d) {
            return d.month;
        })
        .attr("x", function (d) {
            return xScale(d.point[0] +PAD)
        })
        .attr("y", function (d) {
            return yScale(d.point[1])
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "teal")
        .style("text-anchor", "start")
        .style("alignment-baseline", "middle");
}

// code modified from Scott Murray's example
// https://alignedleft.com/tutorials/d3/scales
function setupVis1(){
    console.log("Point 1")
    let svg = configureBox("vis1");
    configureCircle(svg);
    configureText(svg)
}

function setupVis2(){
    let sizeScale = d3.scalePow()
        .exponent(2)
        .domain([0, d3.max(SAMPLE_DATA, function (d) {
            return d.r;
        })])
        .range([5, 50]);

    let fontScale = d3.scalePow()
        .exponent(2)
        .domain([0, d3.max(SAMPLE_DATA, function (d) {
            return d.r;
        })])
        .range([9, 18]);

    let svg = configureBox("vis2");
    configureCircle(svg)
        .attr("r", function (d) {
            return sizeScale(d.r);
        })
        .style("fill", "blue");
    configureText(svg)
        .attr("x", function (d) {
            return xScale(d.point[0]) + sizeScale(d.r) + 2;
        })
        .attr("font-size", function (d) {
            return fontScale(d.r);
        });
}

function setupVis3(){
    let colourScale = d3.scaleOrdinal(d3["schemeDark2"]);
    let svg = configureBox("vis3");
    configureCircle(svg)
        .attr("r", 10)
        .style("fill", function (d) {
            return colourScale(d.month)
        });

    configureText(svg);

}

function setupVis4(){
    let colourScale = d3.scaleQuantize()
        .domain(0, d3.max(SAMPLE_DATA), function (d) {
            return d.r;
        })
        .range(["deeppink", "pink", "paleturquoise", "darkturquoise"]);
    let svg = configureBox("vis4");
    configureCircle(svg)
        .attr("r", 10)
        .style("fill", function (d) {
            return colourScale(d.r)
        });

    configureText(svg);
}

// code modified from Jerome Freye's example @ http://bl.ocks.org/jfreyre/b1882159636cc9e1283a
function setupVis5(){
    const NUM_SQ = 100;
    let colourScale = d3.scaleLinear()
        .domain([0,100])
        .interpolate(d3.interpolateHc1)
        .range("blue", "yellow");

    let svg = configureBox("vis5");
    for( let i=0; i < NUM_SQ; i++)
    {
        svg.append("div")
            .attr("style", function () {
                return 'background-color: ${colourScale(i)}';
            })
    }

}


