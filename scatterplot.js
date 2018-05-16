var parseYear= d3.timeParse("%y");
var parseMonth = d3.timeParse("%b");


// //Quick fix for resizing some things for mobile-ish viewers
var mobileScreen = (window.innerWidth < 500 ? true : false);

//Scatterplot
var margin2 ={ top: 20, right: 0, bottom:20, left: 40 },
	width2 = width,
	height2 = (height)*2;


// var baseHeight = window.innerHeight/4.5;
// var baseWidth = window.innerWidth * .45

var svgScatter = d3.selectAll(".scatterplotWrapperMonths").append("svg")
			.attr("width", width2)
			.attr("height", height2);
			
var wrapper = svgScatter.append("g").attr("class", "chordWrapperYear")

			.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



// var minResponsive = 795
// var baseHeight = window.innerHeight / 3.6;
// var baseWidth = window.innerWidth * .57
// var width = baseWidth;
// var height = responsive.height(baseHeight);
// var margin = { top: 0, right: 0, bottom: 0, left: 40 }


function renderScatterplotMonths(data){

//////////////////////////////////////////////////////
///////////// Initialize Axes & Scales ///////////////
//////////////////////////////////////////////////////

var opacityCircles = 1; 

//Set the color for each region

var color = d3.scaleQuantize()
    .domain(d3.extent(data, function(d) { return d.ndvi}))
    .range(['#ff0000','#ff0000', '#fcdb00', '#8cdd00', '#31b201',
      '#079401', '#008400', '#036301', '#012e01', '#011301']);

console.log(d3.extent(data, function(d) { return d.year}))							 
//Set the new x axis range
var xScale = d3.scaleTime()
	.range([0, width2-(margin2.left+25)])
	.domain(d3.extent(data, function(d) { return d.year})); //I prefer this exact scale over the true range and then using "nice"
	//.domain(d3.extent(countries, function(d) { return d.GDP_perCapita; }))
	//.nice();
//Set new x-axis



var xAxis = d3.axisBottom()
// .ticks(100)
	// .ticks(data, function(d) { return d.year.length})
	.scale(xScale)
	.ticks(28)
	.tickSize(height2)
// 	.tickFormat(function (d) {
// 		return xScale.tickFormat((mobileScreen ? 4 : 8),function(d) { 
// 			var prefix = d3.formatPrefix(d); 
// 			return "$" + prefix.scale(d) + prefix.symbol;
// 		})(d);
// 	})	


// 	;	
//Append the x-axis
wrapper.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(" + margin2.left/2+ "," + 0 + ")")
	.call(xAxis);



var humanMonth = d3.timeFormat("%b")

//Set the new y axis range
var yScale = d3.scaleTime()
	.rangeRound([height2-30,0])
	.domain([parseMonth("Jan"), parseMonth("Dec")])
	// .nice();
	
var yAxis = d3.axisLeft()
	.ticks(12)  //Set rough # of ticks
	.tickFormat(d3.timeFormat("%b"))
	.scale(yScale);	
	

//Append the y-axis
wrapper.append("g")
		.attr("class", "y axis")
		.attr('text-anchor', "end")
		// .attr("y", 10)
  //      .attr("x", 50)
        .attr("dy", "1em")
		.attr("transform", "translate(" + 15 + "," + 0 + ")")
		.call(yAxis);
		
//Scale for the bubble size
var rScale = d3.scaleLinear()
			.range([mobileScreen ? 1 : 2, mobileScreen ? 5 : 20])
			.domain(d3.extent(data, function(d) { 
			    return d.monthSatelliteCount; }));
	
////////////////////////////////////////////////////////////	
/////////////////// Scatterplot Rect ////////////////////
////////////////////////////////////////////////////////////	
var titleText = wrapper.append('g')
		.append('text')
        .attr("class", 'chartText')
        .attr("id", 'chartText'+data[0].class)
        .html("Satellite Images by Month")
        .style("text-anchor", "middle")
        .attr('dx', "-160")
        .attr("dy", "-30")
        .attr("transform", function() {
            return "rotate(-90)"
        })
//Initiate a group element for the circles	
var rectGroup = wrapper.append("g")
	.attr("class", "rectGroup")
	

 .attr("transform", "translate(" + margin2.left/2 + "," + 0 + ")")

	var humanYear = d3.timeFormat("%Y")

//Place the country circles
rectGroup.selectAll(".months")
	.data(data) //Sort so the biggest circles are below
	.enter().append("rect")
		.attr("class", function(d,i) {
			
			console.log(humanMonth(d.month))
			return "months" + humanMonth(d.month) + "_" + humanYear(d.year) + "y"; })
		.style("opacity", opacityCircles)
		.style("fill", function(d) {return color(d.ndvi);})
		.attr("x", function(d) {return (xScale(d.year))-(rScale(d.monthSatelliteCount)/2);})
		.attr("y", function(d) {return (yScale(d.month))-(rScale(d.monthSatelliteCount)/2);})
		.attr("width", function(d) {return rScale(d.monthSatelliteCount);})
		.attr("height", function(d) {return rScale(d.monthSatelliteCount);});
			


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
					.style('opacity', '0')
					.style('background-color', 'rgba(0,0,0,0)')
					.style('stroke-width', '0px')
					.style('stroke', 'white')
					.attr("transform", "translate(" + 0 + "," + -20+ ")")
					.attr("d", function(d) {
						return d ? "M" + d.join("L") + "Z" : null; })
					.style("pointer-events", "all")
					.on("mousemove", function(d){showTooltip(d)})
					.on("mouseout", function(d){hideTooltip(d)})
					.on("touchmove", function(d){showTooltip(d)})
			
					// .datum(function(d) { return d.point; })

			
					
					
					
					
					// .on("mouseout",  removeTooltip);
				// .attr("transform", "translate(" + -10 + "," + -10 + ")")

var formatNum = d3.format(".1f")

function showTooltip (d) {
	var newData= d.data;
	var thisClass = ".months" + humanMonth(d.data.month) + "_" + humanYear(d.data.year) + "y";
	d3.selectAll(thisClass)
		.style('opacity', 1)
		.style("fill", function(d) {return "white";})
	d3.selectAll('.scatterTooltip')
		.style('background-color', 'rgba(0,0,0,.8)')
		 .style("left", (d3.event.pageX-(window.innerWidth/2)) + "px")
      .style("top", (d3.event.pageY) + "px")
		.html(humanMonth(d.data.month) + ", "+ humanYear(d.data.year) + "</br> " + newData.monthSatelliteCount + " satellite images."  + "</br> " + "NDVI: " + formatNum(newData.ndvi))
		
}

function hideTooltip (d) {
	var thisClass = ".months" + humanMonth(d.data.month) + "_" + humanYear(d.data.year) + "y";
	d3.selectAll(thisClass)
		var thisClass = ".months" + humanMonth(d.data.month) + "_" + humanYear(d.data.year) + "y";
			d3.selectAll(thisClass)
			.style("fill", function(d) {return color(d.ndvi);})
			
		d3.selectAll('.scatterTooltip')
		.text('')
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
    
    
     var sortDataByYearMean = d3.nest()
    .key(function(d) { return d.year; })
    .rollup(function(v) { return {
        count: v.length,
        avg: d3.mean(v, function(d) { return d.ndvi; })
    }; })
    .entries(data);
    

    var sortDataByYearMeanArray = []
    sortDataByYearMean.forEach(function(d){

            var object = new Object();
            object.month = "jan"
            object.year = parseYear(d.key)
            object.monthSatelliteCount = d.value.count
            object.ndvi = d.value.avg
            sortDataByYearMeanArray.push(object);

    });


    var sortDataByMonthMean = d3.nest()
    .key(function(d) { return d.year; })
    .key(function(d) { return d.month; })
    .rollup(function(v) { return {
        count: v.length,
        avg: d3.mean(v, function(d) { return d.ndvi; })
    }; })
    .entries(data);
    
    
    
//I'm re-organizing my data to make it more readable to me: re-title object key names to make more flexible
   
    var sortDataByMonthMeanArray = []
    sortDataByMonthMean.forEach(function(d){

        d.values.forEach(function(values){
            var object = new Object();
            object.year = parseYear(d.key)
            object.month = parseMonth(values.key)
            object.monthSatelliteCount = values.value.count
            object.ndvi = values.value.avg
            sortDataByMonthMeanArray.push(object);
        });

    });
    
    renderScatterplotMonths(sortDataByMonthMeanArray);

});