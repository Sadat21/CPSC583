class BarChart {
    data;          // contains our dataset
    width;
    height;

    svgContainer;  // the SVG element where we will be drawing our vis
    datapoints;    // SVG elements per data point

    // D3 axes
    xAxis;
    yAxis;

    // D3 scales
    xAxisScale;
    yAxisScale;

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


    setupScales(xAxisScale, yAxisScale)
    {
        this.xAxisScale = xAxisScale;

        this.yAxisScale = yAxisScale;
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
            .tickSize(-this.height + MARGINS.bottom + MARGINS.top)
            .ticks(10)
            .tickPadding(10);
        // call d3's axisLeft for the y-axis
        this.yAxis = d3.axisLeft(this.yAxisScale)
            .tickSize(-this.width + MARGINS.left*2)
            .ticks(10)
            .tickPadding(10);

        // call our axes inside "group" (<g></g>) objects inside our SVG container
        this.svgContainer.append("g")
            .attr("transform", `translate(0, ${this.height - MARGINS.bottom })`)
            .call(this.xAxis);
        this.svgContainer.append("g")
            .attr("transform", `translate(${MARGINS.left}, 0)`)
            .call(this.yAxis);

        // add text labels
        this.svgContainer.append("text")
            .attr("x", MARGINS.left)
            .attr("y", (this.height)/2)
            .attr("transform", `rotate(-90, ${MARGINS.left / 3}, ${this.height/2})`)
            .style("text-anchor", "middle")
            .text(yLabel);
        this.svgContainer.append("text")
            .attr("x", (this.width)/2)
            .attr("y", (this.height - MARGINS.top))
            .style("text-anchor", "middle")
            .text(xLabel);

    }

    /**
     * Function createCircles initializes the datapoints in our scatterplot
     * @param xAxisSelector the data property for values to appear in x-axis
     * @param yAxisSelector the data property for values to appear in y-axis
     */
    createBars(xAxisSelector, yAxisSelector)
    {
        // Use D3's selectAll function to create instances of SVG:circle virtually
        // per item in our data array
        this.datapoints = this.svgContainer.selectAll("rect")
            .data(this.data)    // use the data we loaded from CSV
            .enter()            // access the data item (e.g., this.data[0])
            .append("rect")   // add the circle element into our SVG container
            .attr("r", 8)       // change some of the attributes of our circles
            // function(d){ return d; } -> allows us to access the data we entered
            .attr("cx", function(d){
                // use the D3 scales we created earlier to map our data values to pixels on screen
                return _vis.xAxisScale(d[xAxisSelector]);
            })
            .attr("cy", function(d){
                return _vis.yAxisScale(d[yAxisSelector]);
            })
            // change some styling
            .style("fill", "coral")
            .style("stroke", "white")
            // add a text to show up on hover
            .append("svg:title")
            .text(function(d){
                return d.Country;
            });
    }
}