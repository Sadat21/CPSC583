/**
 * Class that creates the bar chart and legend for the bar chart
 *
 * Some useful links used:
 *  * D3 Documentation: https://github.com/d3/d3/wiki
 *  * Coskun Sahin's CPSC 583 Tutorial Slides
 */
class BarChart {
    // SVG element fields
    svgContainer;
    width;
    height;

    // Data used for bar chart
    data;


    // D3 axes
    xAxis;
    yAxis;

    // D3 scales
    xAxisScale;
    yAxisScale;
    colourScale;

    /**
     * Sets up the svg element local fields
     * @param svgContainer svg element to create the chart for
     */
    constructor(svgContainer)
    {
        this.svgContainer = svgContainer;
        // dynamically change our SVG container's dimensions with the current browser dimensions
        this.width = svgContainer.node().getBoundingClientRect().width;
        this.height = svgContainer.node().getBoundingClientRect().height;
    }

    /**
     * Sets the data object
     * @param data
     */
    setData(data)
    {
        this.data = data;
    }

    /**
     * Initializes the d3 scales
     * @param xAxisScale x-axis scale
     * @param yAxisScale y-axis scale
     * @param colourScale colour scale used to differentiate within the bars
     */
    setupScales(xAxisScale, yAxisScale, colourScale)
    {
        this.xAxisScale = xAxisScale;
        this.yAxisScale = yAxisScale;
        this.colourScale = colourScale;
    }

    /**
     * Initializes D3 axes for our Bar Chart
     * @param xLabel the label of the x-axis
     * @param yLabel the label of the y-axis
     */
    setupAxes(xLabel, yLabel)
    {
        // call d3's axisBottom for the x-axis
        this.xAxis = d3.axisBottom(this.xAxisScale)
            .tickSizeOuter(0);
        // call d3's axisLeft for the y-axis
        this.yAxis = d3.axisLeft(this.yAxisScale)
            .tickSize(-this.width + MARGINS.left*2)
            .tickSizeOuter(0)
            .ticks(10)
            .tickPadding(10);

        // Create the axes for the bar chart
        this.svgContainer.append("g")
            .attr("transform", `translate(0, ${this.height - MARGINS.bottom })`)
            .style("stroke-width", .1)
            .call(this.xAxis);
        this.svgContainer.append("g")
            .attr("transform", `translate(${MARGINS.left}, 0)`)
            .style("stroke-width", .1)
            .call(this.yAxis);

        // add text labels to the x and y axes
        this.svgContainer.append("text")
            .attr("x", MARGINS.left/2)
            .attr("y", (this.height)/2)
            .attr("transform", `rotate(-90, ${MARGINS.left / 2}, ${this.height/2})`)
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text(yLabel);
        this.svgContainer.append("text")
            .attr("x", (this.width)/2)
            .attr("y", (MARGINS.top/2))
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text(xLabel);
    }

    /**
     * Function creates the bars for the chart
     * @param xAxisSelector the key used to parse the x-axis values
     *
     * Used ideas from: https://bl.ocks.org/mtandre/bea54a387eb5506ad5d46cb5e74d9bce
     */
    createBars(xAxisSelector)
    {
        // Create top level <g></g> group
        var stackChart = this.svgContainer.selectAll(".stack")
            .data(this.data)
            .enter().append("g")
            .attr("class", "stack")
            .style("fill", function (d, i) {
                return _vis.colourScale(i);
            });

        // Draw the stacked bars
        stackChart.selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return _vis.xAxisScale(d[xAxisSelector]);
            })
            .attr("y", function (d) {
                return _vis.yAxisScale(d.y + d.y0);
            })
            .attr("height", function (d) {
                return _vis.yAxisScale(d.y0) - _vis.yAxisScale(d.y + d.y0);
            })
            .attr("width", _vis.xAxisScale.bandwidth())
            .append("svg:title")
            .text(function(d){
                return d.y;
            });
    }

    /**
     * Creates the legend for the bar chart
     * @param keys Names of the colours differentiating the bars
     * @param svgContainer svg element where the legend will be drawn
     */
    createLegend(keys, svgContainer)
    {
        // Creates legend title
        svgContainer.append("text")
            .attr("x", 70)
            .attr("y", 50)
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text("Types of Rooms");

        // Create top level <g></g>
        var legend = svgContainer.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (MARGINS.right) + ','+ (MARGINS.top/2 ) + ')');

        // Create the different colours fpr the legend
        legend.selectAll('rect')
            .data(keys)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', function(d, i){
                return (i + 1) * 30;
            })
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', function(d, i){
                return _vis.colourScale(i);
            });

        // Create the text labels for the different colours
        legend.selectAll('text')
            .data(keys)
            .enter()
            .append('text')
            .text(function(d){
                return d;
            })
            .attr('x', 40)
            .attr('y', function(d, i){
                return (i + 1) * 30;
            })
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'hanging');
    }
}