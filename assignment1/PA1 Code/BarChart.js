class BarChart {
    data;          // contains our dataset
    width;
    height;

    svgContainer;  // the SVG element where we will be drawing our vis

    // D3 axes
    xAxis;
    yAxis;

    // D3 scales
    xAxisScale;
    yAxisScale;
    colourScale;

    constructor(svgContainer)
    {
        this.svgContainer = svgContainer;
        // dynamically change our SVG container's dimensions with the current browser dimensions
        this.width = svgContainer.node().getBoundingClientRect().width;
        this.height = svgContainer.node().getBoundingClientRect().height;
    }

    setData(data)
    {
        this.data = data;
    }


    setupScales(xAxisScale, yAxisScale, colourScale)
    {
        this.xAxisScale = xAxisScale;
        this.yAxisScale = yAxisScale;
        this.colourScale = colourScale;
    }

    /**
     * Function setupAxes initializes D3 axes for our Scatterplot
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

        // call our axes inside "group" (<g></g>) objects inside our SVG container
        this.svgContainer.append("g")
            .attr("transform", `translate(0, ${this.height - MARGINS.bottom })`)
            .style("stroke-width", .1)
            .call(this.xAxis);
        this.svgContainer.append("g")
            .attr("transform", `translate(${MARGINS.left}, 0)`)
            .style("stroke-width", .1)
            .call(this.yAxis);

        // add text labels
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
     * Function createCircles initializes the datapoints in our scatterplot
     * @param xAxisSelector the data property for values to appear in x-axis
     * @param yAxisSelector the data property for values to appear in y-axis
     */
    createBars(xAxisSelector, yAxisSelector)
    {
        var layer = this.svgContainer.selectAll(".stack")
            .data(this.data)
            .enter().append("g")
            .attr("class", "stack")
            .style("fill", function (d, i) {
                return _vis.colourScale(i);
            });

        layer.selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter()
            .append("rect")
            .attr("x", function (d) {
                // use the D3 scales we created earlier to map our data values to pixels on screen
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


    createLegend(keys, svgContainer)
    {
        // TODO: Need a Legend title
        svgContainer.append("text")
            .attr("x", 70)
            .attr("y", 50)
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text("Types of Rooms");

        var legend = svgContainer.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (MARGINS.right) + ','+ (MARGINS.top/2 ) + ')');

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