//create responsive method so I'm not calling functions/is reusable
var responsive = new Object;

responsive.width = function() {
    // if (window.screen.width < minResponsive) {
    //     return window.screen.width * window.innerWidth
    // }
    // else {
    //     return baseWidth
    // }
}

responsive.ticks = function(tickNum) {
    if (window.innerWidth< minResponsive) {
        return tickNum / 2;
    }
    else {
        return tickNum
    }
}

responsive.height = function(baseHeight) {
    if (window.innerWidth < minResponsive) {
        return baseHeight * 8 / 10
    }
    else {
        return baseHeight
    }
}
var minResponsive = 795
var baseHeight = window.innerHeight/3.8;
// var baseWidth = window.innerWidth * 4/8
var width = window.innerWidth * 4/10;
var height = responsive.height(baseHeight);
var margin = { top: 0, right: 0, bottom: 0, left: 40 }
// var sliderFreeInput = document.getElementById("timeSlider");


//Creates looping through year interactivity for both the slider and play function
function loopThrough(year) {
    var year = year
    console.log(year)
    d3.select('#mapTitleDate')
        .text(year)

    d3.selectAll(".label")
        .style("visibility", function() {
            if (this.id.includes(year)) {
                return "visible"
            }
            else { return "hidden" }
        })
        .style('fill', 'white')


    d3.selectAll('.mapImg')
        .style('opacity', function() {
            if (this.src.includes(year)) {
                return "1"
            } else {(console.log(this.src))}

            d3.selectAll('g.tick')
                .select('line') //grab the tick line
                .attr('class', 'not') //style with a custom class and CSS
                .style('stroke', 'white')
                .style('stroke-width', .1 + 'px');

            d3.selectAll('g.tick')
                .filter(function(d) {
                    var val = parseTime2(year).toString();
                    return d == val;
                })
                .select('line') //grab the tick line
                .attr('class', 'highlighted') //style with a custom class and CSS
                .style('stroke', '#6dc925')
                .style('stroke-width', .5 + 'px');
        })


}


var overlay = d3.selectAll('.openingOverlay')
overlay.style('width', window.innerWidth+'px')
overlay.style('height', window.innerHeight+50+'px')
       .style('border-right', 'solid .5px gray')
// overlay.style('right', 0+'px')
// 				overlay.on('click', function(){
				    
// 					overlay
// 					.transition()
// 					.duration(500)
// 					.style('right', '95%')	
// 				})



 overlay.on('click',function(){
           var active  = overlay.active ? false : true,
            //   newRight = active ? '0px' : window.innerWidth - 50 + 'px';
               newRight = active ? window.innerWidth - 50 + 'px' : '0px';
            
            overlay
					.transition()
					.duration(500)
					.style('right', newRight)
					.style('border-right', 'dashed .5px gray')

            overlay.active = active;
                    
         })








function renderMap(data) {
    var imagesContainer = d3.selectAll('.imagesContainer');
    var images = imagesContainer.selectAll('img')
        .data(data)
        .enter()
        .append('img')
        .attr('class', 'mapImg')
        .attr('id', function(d) { return (d.xpath) })
        .style('opacity', function(d) {
            if (d.path.includes('1994')) {
                return (1)
            }
            else {
                return (0)
            }
        })
        .attr('src', function(d) { return "highresimages_malawi_year_processed/" + d.path })
}

//This is the global slider function that targets specific classes
function renderSlider(data) {
    //I'm bringing data into this to access date range for tics
    x.domain([parseTime2(1991), parseTime2(2017)]);

    var tickAxis = d3.selectAll(".dateRangeTicks").append('svg')
        .attr('width', width)
        .attr('height', 15)
    var axisx = tickAxis.append('g')
        .attr("transform", "translate(" + margin.left + "," + -3 + ")")
        .attr('class', 'timelineTicks')
        .call(d3.axisBottom(x).ticks(responsive.ticks(data.length)).tickFormat(d3.timeFormat("%y")).tickSize(0));
    axisx.selectAll("line")
        .style("stroke", function() {
            return 'gray'
        })
        // .style('x2', '100')
        // .style('stroke-width', '.10')

    var dateRange = d3.selectAll('.dateRange')
    dateRange.style('width', width-margin.left + "px")
    dateRange.style('margin-left', margin.left + 4 + "px")
    dateRange.on("input", function() {
        loopThrough(this.value);
    })
}

///Play and stop buttons
var myTimer;
d3.select("#start").on("click", function() {
    d3.select("#start")
        .transition()
        .style('visibility', 'hidden')

    d3.select('#stop')
        .transition()
        .style('visibility', 'visible')


    clearInterval(myTimer);
    myTimer = setInterval(function() {
        var b = d3.selectAll(".dateRange");
        var t = (+b.property("value") + 1) % (+b.property("max") + 1);
        if (t == 0) { t = +b.property("min"); }
        b.property("value", t);
        loopThrough(t)
    }, 1000);

});

d3.select("#stop").on("click", function() {
    d3.select("#start")
        .transition()
        //   .style('opacity', '1')
        .style('visibility', 'visible')


    d3.select('#stop')
        .transition()
        // .style('opacity', '0')
        .style('visibility', 'hidden')


    clearInterval(myTimer);
});


// function combineCharts (data){
//     var combineCharts = d3.selectAll('.combineCharts')
    
//     combineCharts.on('click', function(){
//         d3.selectAll('.chartDivVegetation')
//             .transition()
//             .style('position','absolute')
//         d3.selectAll('.chartDivGDP')
//             .transition()
//             .style('position','absolute')
//     })
    
    


    
// }

// d3.select("#start").on("click", function() {
// 	clearInterval (myTimer);
// });

//////////////Variables for line Chart////////////////////////////////

var numberFormat = d3.format(".3n");

var parseTime = d3.timeParse("%y");
var parseTime2 = d3.timeParse("%Y");

var x = d3.scaleTime()
    .rangeRound([15, width-margin.left-5]);

var y = d3.scaleLinear()
    .rangeRound([height-15, +10]);


var bisectDate = d3.bisector(function(d) { return d.key; }).left

function customSize(heightOrWidth, num) {
    return heightOrWidth - num
}
var timeFormat = d3.timeFormat("%Y")

////////////////Render Line Charts///////////////////////

function renderlinechart(data) {


    var div = d3.selectAll('.lineChartsDiv')
        .append('div')
        .attr('class', 'chartDiv' + data[0].class)
        .style('height', height-20 + "px")


//Create seperate div for each measure
    d3.selectAll('.chartDiv' + data[0].class)
        .data(data)
        .append('div')
        .attr("class", "dataSummary")

//Append SVG for each DIV
    var svg = div.append('svg')
        .attr('class', function(d) { return d.class + "_svg" })
        .attr('height', height)
        .attr('width', width+50)

//Append main chart g
    var g = svg.append('g')
        .attr('class', data[0].class + "_g")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")");

//Append Chart Titles
    g.append('text')
        .attr("class", 'chartText')
        .attr("id", 'chartText'+data[0].class)
        .html(data[0].class.replace(/_/g, " "))
        .style("text-anchor", "middle")
        .attr('dx', "-80")
        .attr("dy", "-30")
        .attr("transform", function() {
            return "rotate(-90)"
        })
        // .style('fill', 'gray')

    x.domain([parseTime2(1991), parseTime2(2017)]);
    y.domain(d3.extent(data, function(d) { return d.value.avg; }));


    var line = d3.line()
        .x(function(d) { return x(d.key); })
        .y(function(d) { return y(+d.value.avg); })
        .curve(d3.curveCardinal);


    var axisx = g.append('g')
        .data(data)
        .attr('class', 'tick')
        .call(d3.axisBottom(x).ticks(responsive.ticks(data.length)).tickFormat(d3.timeFormat("%y")).tickSize(customSize(height, 15)));
    axisx.selectAll("text")
        .style("fill", "black")

    axisx.selectAll("line")
        .style("stroke", function() {
            return 'white'
        });

    axisx
        .attr('text-anchor', "middle")
        .select(".domain")
        .remove();

    var axisy = g.append('g')
        .call(d3.axisLeft(y).ticks(responsive.ticks(5)).tickSize(0));

    axisy
        .attr('text-anchor', "middle")
        .append("text")
        .attr("fill", "gray")
        .attr("y", 10)
        .attr("x", 50)
        .attr("dy", "1em")
        .attr('text-anchor', "end")
    // .text(function(d){return data[0].class})

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr('stroke', "white")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1)
        .attr('d', line)

    function annotationCheck(data) {
        if (data) {
            return data
        }
        else {
            return ""
        }
    }


    var annotations = g.append('g')
        .selectAll(".annotations")
        .data(data)
        .enter()
        .append("g")
        .attr("class", function(d) { return "annotations" })
        .attr("id", function(d) { return "annotations" + timeFormat(d.key) })
        .attr("transform", function(d, i) { return "translate(" + x(d.key) + "," + y(d.value.avg) + ")"; })

    annotations.append('circle')
        .attr('r', 8)
        .style('visibility', function(d) {
            if (d.annotation) {
                return "visible"
            }
            else { return "hidden" }

        })
        .style('fill', 'white')
        .style('opacity', '.4')

    var chartDiv = d3.selectAll('.chartDiv' + data[0].class)

    chartDiv.selectAll(".label")
        .data(data)
        .enter()
        .append("div")
        .attr("class", function(d) { return "label" })
        .attr("id", function(d) { return "label" + timeFormat(d.key) })
        .style('visibility', 'hidden')


    ////Label for tooltip
    var label = g.append('g')
        .selectAll(".label")
        .data(data)
        .enter()
        .append("g")
        .attr("class", function(d) { return "label" })
        .attr("id", function(d) { return "label" + timeFormat(d.key) })
        .style('visibility', 'hidden')
        .attr("transform", function(d, i) { return "translate(" + x(d.key) + "," + y(d.value.avg) + ")"; })

    //Lable for annotations
    var annotationsLabel = g.append('g')
        .selectAll(".label")
        .data(data)
        .enter()
        .append("g")
        .attr("class", function(d) { return "label" })
        .attr("id", function(d) { return "label" + timeFormat(d.key) })
        .style('visibility', 'hidden')
        .attr("transform", function(d, i) { return "translate(" + x(d.key) + "," + 15 + ")"; })

    var annotationlabelText = annotationsLabel.append('text')
        .attr('class', function(d) { return timeFormat(d.key) })
        .html(function(d) { return '&nbsp' + "<tspan class = 'annotationText'>" + annotationCheck(d.annotation) + "</tspan>" })

    //Circle for tooltip    
    var circles = label.append('circle')
        .attr('r', 2)
        .style('stroke', "10px")
        .style('stroke-fill', 'white')

    //Text for lable    
    var labelText = label.append('text')
        .attr('class', function(d) { return timeFormat(d.key) })
        .html(function(d) { return "&nbsp &nbsp" + numberFormat(d.value.avg) })

    //Rect for linechart ineractivity
    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on("click", click)
        .on("touchmove", click)
        // .on('mouseover', hover)

    //Adds tooltip and gathers data
    function click() {

        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 0),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.key > d1.key - x0 ? d1 : d0;

        var year = timeFormat(d.key)
        loopThrough(year)
        document.getElementById("timeSlider").value = year;
    }
    
    var vegTextLink = d3.select('#chartTextVegetation');
    var infoLink = d3.selectAll('.fa-info-circle');
    
    vegTextLink.on('mouseover',function(){
        vegTextLink
            .style('fill', 'green')
        d3.selectAll('.fa-info-circle')
            .style('color', 'green')
    })
    
     infoLink.on('mouseover',function(){
        vegTextLink
            .style('fill', 'green')
        d3.selectAll('.fa-info-circle')
            .style('color', 'green')
    })
    
    
    vegTextLink.on('mouseout',function(){
        vegTextLink
            .style('fill', 'white')
        d3.selectAll('.fa-info-circle')
            .style('color', 'gray')
    })
    
    infoLink.on('mouseout',function(){
        vegTextLink
            .style('fill', 'white')
        d3.selectAll('.fa-info-circle')
            .style('color', 'gray')
    })
    
    var gdp = d3.selectAll(".chartDivGDP")
    var productivity = d3.selectAll(".chartDivAgri_val_added_per_worker")
    var scatterPlotWrapper = d3.selectAll('.scatterplotWrapper')
        .style('opacity', 0);
        
        

// infoLink.on('cl')
    vegTextLink.on('click',function(){
           var active  = gdp.active ? false : true,
               newOpacity = active ? 0 : 1,
               newDisplay = active ? "none" : "block",
               newOpacityReverse = active ? 1 : 0;

            // active(scatterPlotWrapper)
            gdp 
                // .transition()
                .style('opacity', newOpacity)
                // .delay(150)
                .style('display', newDisplay)
            productivity
                        // .transition()
                        .style('opacity', newOpacity)
                        .style('display', newDisplay)
            scatterPlotWrapper
            // .transition()
                        // .delay(100)

            .style('opacity', newOpacityReverse)
            gdp.active = active;

                    
    })
 


}
//Load list of images to create img tags for each.

d3.csv("highresimages_malawi_year_processed/image_names_list.csv").then(function(data) {

    data.forEach(function(d, i) {
        d.path = d.path.replace("'", '').replace("'", '')
    });

    renderMap(data)

});


//Load, parse and render NDVI per year: malawi
d3.csv("data/malawi_landsat_5_7_8_1990-2018.csv").then(function(data) {

    data.forEach(function(d) {
        var dateArray = d.date.split("-", 3)
        var yearOnly = dateArray[2]
        var monthOnly = dateArray[1]
        var dayOnly = dateArray[0]

        d.year = +yearOnly
        d.month = monthOnly
        d.day = dayOnly
    });


//Annotations    
    function vegitationAnnotations(dateMarker) {
        if (dateMarker == 94) {
            return "The drought of all droughts"
        }
        else if (dateMarker == 16) {
            return "Drought"
        }
        else if (dateMarker == 01) {
            return "Drought"
        }
        else { return "" }
    }

    var sortDataByYearMean = d3.nest()
        .key(function(d) { return d.year; })
        .rollup(function(v) {
            return {
                count: v.length,
                avg: d3.mean(v, function(d) { return d.ndvi; })
            };
        })
        .entries(data);

//Make a unique class for data so my linechart divs have different classes
    sortDataByYearMean.forEach(function(d) {
        d.class = 'Vegetation'
        d.annotation = vegitationAnnotations(+d.key)
        d.key = parseTime(d.key)
    });


    renderlinechart(sortDataByYearMean);
    renderSlider(sortDataByYearMean)
//Render worldbank AFTER NDVI
    d3.csv("data/worldBank.csv").then(function(data) {

        var gdp = []
        var agriculture = []

        function productivityAnnotations(dateMarker) {
            if (dateMarker == 2001) {
                return "Starter Pack Subsidy Program"
            }
            else { return "" }
        }


        function gdpAnnotations(dateMarker) {
            if (dateMarker == 2005) {
                return "FISP Agricultural Subsidy"
            }
            else { return "" }
        }





        data.forEach(function(d) {

            if (+d['GDP per capita growth (annual %) [NY.GDP.PCAP.KD.ZG]'] && d.Time != "1990") {
                var object = new Object()
                object.countryName = d['Country Name']
                object.key = parseTime2(+d.Time)
                object.value = new Object()
                object.value.avg = +d['GDP per capita growth (annual %) [NY.GDP.PCAP.KD.ZG]']
                object.class = 'GDP';
                object.annotation = gdpAnnotations(+d.Time)
                gdp.push(object)
            }

            if (+d['Agriculture, value added per worker (constant 2010 US$) [NV.AGR.EMPL.KD]']) {
                var object = new Object()
                object.key = parseTime2(+d.Time)
                object.value = new Object()
                object.value.avg = +d['Agriculture, value added per worker (constant 2010 US$) [NV.AGR.EMPL.KD]']
                object.class = 'Agri_val_added_per_worker';
                object.annotation = productivityAnnotations(+d.Time)

                agriculture.push(object)

            }
        })



        renderlinechart(gdp);
        renderlinechart(agriculture);
        

    });


});