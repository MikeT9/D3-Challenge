var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(healthData) {

  // Print the tvData
  console.log(healthData);

 // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
      });
  
      // Step 2: Create scale functions
      // ==============================
      var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([0, width]);
  
      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.poverty)])
        .range([height, 0]);
  
      // Step 3: Create axis functions
      // ==============================
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
      // Step 4: Append Axes to the chart
      // ==============================
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      chartGroup.append("g")
        .call(leftAxis);
  
      // Step 5: Create Circles
      // ==============================
      var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");

      var circlesLabel = chartGroup.selectAll("label")
        .data(healthData)
        .enter()
        .append("text")
        .attr("class", "StAbbr")
        .text(d=>d.abbr)
        .attr("text-anchor", "middle")
        .attr("font-size", "10")
        .attr("fill", "white")
        .attr("dy", d => yLinearScale(d.healthcare))
        .attr("dx", d => xLinearScale(d.poverty));

      // Step 6: Initialize tool tip
      // ==============================
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>healthcare: ${d.healthcare}<br>poverty: ${d.poverty}`);
        });
  
      // Step 7: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);
  
      // Step 8: Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
  
      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Healthcare");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty");
}).catch(function(error) {
  console.log(error);
});