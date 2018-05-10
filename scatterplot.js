var parseYear= d3.timeParse("%y");
var parseMonth = d3.timeParse("%b");
var humanMonth = d3.timeFormat("%B")
var humanYear = d3.timeFormat("%y")
//Reimagined from Nadieh Bremer's veroni overlay scatterplot


////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////

// //Quick fix for resizing some things for mobile-ish viewers
var mobileScreen = (window.innerWidth < 500 ? true : false);

//Scatterplot
var margin2 = {left: window.innerWidth*.1, top: 20, right: 20, bottom: 20},
	width2 = window.innerWidth* 8.5/10,
	height2 = window.innerHeight * 2/3;

var svgScatter = d3.selectAll(".scatterplotWrapper").append("svg")
			.attr("width", (width2 + margin2.left + margin2.right))
			.attr("height", (height2 + margin2.top + margin2.bottom));
			
var wrapper = svgScatter.append("g").attr("class", "chordWrapper")

			.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");




function renderScatterplot(data){

//////////////////////////////////////////////////////
///////////// Initialize Axes & Scales ///////////////
//////////////////////////////////////////////////////

var opacityCircles = 1; 

//Set the color for each region

var color = d3.scaleQuantize()
    .domain(d3.extent(data, function(d) { return d.ndvi}))
    .range(['#ff0000','#ff0000', '#fcdb00', '#8cdd00', '#31b201',
      '#079401', '#008400', '#036301', '#012e01', '#011301']);
							 
//Set the new x axis range
var xScale = d3.scaleTime()
	.range([0, width2])
	.domain(d3.extent(data, function(d) { return d.year})); //I prefer this exact scale over the true range and then using "nice"
	//.domain(d3.extent(countries, function(d) { return d.GDP_perCapita; }))
	//.nice();
//Set new x-axis
var xAxis = d3.axisBottom()
	.ticks(21)
// 	.tickFormat(function (d) {
// 		return xScale.tickFormat((mobileScreen ? 4 : 8),function(d) { 
// 			var prefix = d3.formatPrefix(d); 
// 			return "$" + prefix.scale(d) + prefix.symbol;
// 		})(d);
// 	})	
	.scale(xScale);	
//Append the x-axis
wrapper.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(" + 0 + "," + height2 + ")")
	.call(xAxis);

var humanMonth = d3.timeFormat("%B")

//Set the new y axis range
var yScale = d3.scaleTime()
	.rangeRound([height2,1])
	.domain([parseMonth("Jan"), parseMonth("Dec")])
	// .nice();
	
var yAxis = d3.axisLeft()
	.ticks(12)  //Set rough # of ticks
	.scale(yScale);	
//Append the y-axis
wrapper.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
		.call(yAxis);
		
//Scale for the bubble size
var rScale = d3.scaleLinear()
			.range([mobileScreen ? 1 : 2, mobileScreen ? 5 : 20])
			.domain(d3.extent(data, function(d) { 
			    return d.monthSatelliteCount; }));
	
////////////////////////////////////////////////////////////	
/////////////////// Scatterplot Rect ////////////////////
////////////////////////////////////////////////////////////	

//Initiate a group element for the circles	
var rectGroup = wrapper.append("g")
	.attr("class", "rectGroup"); 
	
	
	var humanMonth = d3.timeFormat("%b")
	var humanYear = d3.timeFormat("%y")

//Place the country circles
rectGroup.selectAll(".months")
	.data(data) //Sort so the biggest circles are below
	.enter().append("rect")
		.attr("class", function(d,i) {return "months" + humanMonth(d.month) + "_" + humanYear(d.year) + "y"; })
		.style("opacity", opacityCircles)
		.style("fill", function(d) {return color(d.ndvi);})
		.attr("x", function(d) {return (xScale(d.year))-(rScale(d.monthSatelliteCount)/2);})
		.attr("y", function(d) {return (yScale(d.month))-(rScale(d.monthSatelliteCount)/2);})
		.attr("width", function(d) {return rScale(d.monthSatelliteCount);})
		.attr("height", function(d) {return rScale(d.monthSatelliteCount);});
			
////////////////////////////////////////////////////////////// 
//////////////////////// Voronoi ///////////////////////////// 
////////////////////////////////////////////////////////////// 

//Initiate the voronoi function
//Use the same variables of the data in the .x and .y as used in the cx and cy of the circle call
//The clip extent will make the boundaries end nicely along the chart area instead of splitting up the entire SVG
//(if you do not do this it would mean that you already see a tooltip when your mouse is still in the axis area, which is confusing)

// const voronoiDiagram = d3.voronoi()
//   .x(d => xScale(d.x))
//   .y(d => yScale(d.y))
//   .size([width2, height2])(data);







// var voronoi = d3.voronoi()
// 	.x(function(d) { return xScale(d.year); })
// 	.y(function(d) { return yScale(d.month); })
//     .extent([[-margin2.left, -margin2.top], [width2 + margin2.right, height2 + margin2.top]])

//Initiate a group element to place the voronoi diagram in




// wrapper.selectAll(".point")
// 						.data(data)
// 					.enter().append("circle")
// 						.attr("class", "point")
// 						.attr("r", 3)
// 						.attr("cx", function(d){ return xScale(d.year); })
// 						.attr("cy", function(d){ return yScale(d.month); });

		// .attr("x", function(d) {return (xScale(d.year))-(rScale(d.monthSatelliteCount)/2);})
		// .attr("y", function(d) {return (yScale(d.month))-(rScale(d.monthSatelliteCount)/2);})


var voronoi = d3.voronoi()
				.x(function(d) { return  (xScale(d.year)+20); })
				.y(function(d) { return (yScale(d.month)+20); })
				.extent([[0, 0], [width2+40, height2+40]])

				
var voronoiGroup = wrapper.append("g")
				.attr("class", "voronoi");



voronoiGroup.selectAll("path")
					.data(voronoi(data).polygons())
					.enter()
					.append('g')
					.append("path")
					.style('fill', 'none')
					.style('stroke-width', '0px')
					.style('stroke', 'white')
					.attr("transform", "translate(" + -20 + "," + -20+ ")")
					.attr("d", function(d) {
						return d ? "M" + d.join("L") + "Z" : null; })
					.style("pointer-events", "all")
					.on("mouseover", function(d){showTooltip(d)})
					.on("mouseout", function(d){hideTooltip(d)})
					.on("touchmove", function(d){showTooltip(d)})
			
					// .datum(function(d) { return d.point; })

			
					
					
					
					
					// .on("mouseout",  removeTooltip);
				// .attr("transform", "translate(" + -10 + "," + -10 + ")")


function showTooltip (d) {
	console.log(this)
	console.log(d.data)
	var thisClass = ".months" + humanMonth(d.data.month) + "_" + humanYear(d.data.year) + "y";
	d3.selectAll(thisClass)
		.style("fill", function(d) {return "white";})

}

function hideTooltip (d) {
	var thisClass = ".months" + humanMonth(d.data.month) + "_" + humanYear(d.data.year) + "y";
	d3.selectAll(thisClass)
		var thisClass = ".months" + humanMonth(d.data.month) + "_" + humanYear(d.data.year) + "y";
			d3.selectAll(thisClass)
			.style("fill", function(d) {return color(d.ndvi);})
}

//function showToolt



  
}







d3.csv("data/malawi_landsat_5_7_8_1990-2018.csv").then(function(data) {

    //First data cleaning to make it readable for averaging: I need to turn this into functions so I'm not
    //Looping through the data 3 times
    
    
    data.forEach(function(d){
        var dateArray = d.date.split("-", 3)
        var yearOnly = dateArray[2]
        var monthOnly = dateArray[1]
        var dayOnly = dateArray[0]
        d.year = +yearOnly
        d.month = monthOnly
        d.day = dayOnly
    });
    

    // function getYear(d){
    //     var dateArray = d.date.split("-", 3)
    //     var yearOnly = +dateArray[2]
    //     return(yearOnly)
    // }
    //First parse to get monthly averages and count. I could base my code around this but it's too much of a headache to remember
    //key names and nested key/value pairs.
    
    var sortDataByMonthMean = d3.nest()
    .key(function(d) { return d.year; })
    .key(function(d) { return d.month; })
    .rollup(function(v) { return {
        count: v.length,
        avg: d3.mean(v, function(d) { return d.ndvi; })
    }; })
    .entries(data);
    
    // console.log(sortDataByMonthMean)
    //I'm re-organizing my data to make it more readable to me: re-title object key names to make more flexible
   
    var sortDataByMonthMeanArray = []
    sortDataByMonthMean.forEach(function(d){
    // console.log(d.values)
        d.values.forEach(function(values){
            var object = new Object();
            object.year = parseYear(d.key)
            object.month = parseMonth(values.key)
            object.monthSatelliteCount = values.value.count
            object.ndvi = values.value.avg
            sortDataByMonthMeanArray.push(object);
        });
    // d.class = 'Vegetation'
    // d.key = parseTimeYear(d.key)
    });
    
    renderScatterplot(sortDataByMonthMeanArray);
    
});