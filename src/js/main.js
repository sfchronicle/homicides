require("./lib/social"); //Do not delete
var d3 = require('d3');

// colors for bubble graph
var margin = {
  top: 15,
  right: 15,
  bottom: 25,
  left: 80
};
var colors = {
  'CA': '#D13D59',
  'TX': '#6C85A5',
  'IL': 'red'
}

// parse the date / time
var parseYear = d3.timeParse("%Y");

// bubble graph ---------------------------------------------------------------

if (screen.width > 768){//768) {
  console.log("everything else");
  var margin = {
    top: 15,
    right: 35,
    bottom: 40,
    left: 80
  };
  var width = 800 - margin.left - margin.right;
  var height = 450 - margin.top - margin.bottom;
} else if (screen.width <= 768 && screen.width > 480) {
  console.log("ipad");
  var margin = {
    top: 15,
    right: 35,
    bottom: 40,
    left: 60
  };
  var width = 720 - margin.left - margin.right;
  var height = 450 - margin.top - margin.bottom;
} else if (screen.width <= 480 && screen.width > 340) {
  console.log("big phone");
  var margin = {
    top: 15,
    right: 40,
    bottom: 40,
    left: 30
  };
  var width = 360 - margin.left - margin.right;
  var height = 350 - margin.top - margin.bottom;
} else if (screen.width <= 340) {
  console.log("mini iphone")
  var margin = {
    top: 15,
    right: 45,
    bottom: 40,
    left: 30
  };
  var width = 310 - margin.left - margin.right;
  var height = 350 - margin.top - margin.bottom;
}

// convert strings to numbers
bubbleData.forEach(function(d) {
  d.YearText = d.Year;
  d.Year = parseYear(d.Year);
  d.Percent = Math.round(d.Percent*1000)/10;
  d.Number = Math.round(d.Number);
  d.NumberThous = Math.round(d.Number/1000);
})

// x-axis scale
// var x = d3.scaleTime()
//     .range([0, width]);
var x = d3.scaleLinear()
    .range([0, width]);

// y-axis scale
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

// color bands
// var color = d3.scale.ordinal()
//     .range(["#FFE599", "#DE8067"]);

// var color = d3.scale.category10();
// var color = "red";

// use x-axis scale to set x-axis
// var xAxis = d3.axisBottom(x)
//     .tickFormat(d3.time.format("%Y"));
//
// // use y-axis scale to set y-axis
// var yAxis = d3.axisLeft(y)
//     .orient("left")

// var valueline = d3.svg.line()
//   .x(function(d) {return x(d.salaryK); })
//   .y(function(d) {return y(d.salaryK/3); });

// create SVG container for chart components
var svg = d3.select(".bubble-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

console.log(bubbleData);
x.domain([50,5000])
// x.domain(d3.extent([parseYear(2010),parseYear(2017)]));//.nice();
y.domain([-10,500]); //.nice();

var xMin = x.domain()[0];
var xMax = x.domain()[1];

//color in the dots
svg.selectAll(".dot")
    .data(bubbleData)
    .enter().append("circle")
    .attr("r", function(d) {
      return 7;
      // if (screen.width <= 480) {
      //   return d.Number/50000;//(d.NumberEmerg/1400)+5;
      // } else {
      //   return 20*(d.Number/50000-6.9)/5+1;//(d.NumberEmerg/800)+6.5;
      // }
    })
    .attr("cx", function(d) { return x(d.population/1000); })
    .attr("cy", function(d) { return y(d.homicides); })
    .attr("opacity",0.9)
    .style("fill", function(d) {
      // return "red";
      return color_function(d.state) || colors.fallback;
    })
    .on("mouseover", function(d) {
        tooltip.html(`
            <div>City: <span class='bold'>${d.city}</span></div>
            <div>Homicides: <span class='bold'>${d.homicides}</span></div>
            <div>Population: <span class='bold'>${d.population}</span></div>
        `);
        tooltip.style("visibility", "visible");
    })
    .on("mousemove", function() {
      if (screen.width <= 480) {
        return tooltip
          .style("top",(d3.event.pageY+40)+"px")//(d3.event.pageY+40)+"px")
          .style("left",10+"px");
      } else {
        return tooltip
          .style("top", (d3.event.pageY+20)+"px")
          .style("left",(d3.event.pageX-80)+"px");
      }
    })
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

function color_function(city) {
  if (city == "CA") {
    return "blue";
  } else if (city == "TX") {
    return "red";
  } else if (city == "IL") {
    return "green";
  } else if (city == "NY") {
    return "yellow";
  }
}

var node = svg.selectAll(".circle")
    .data(bubbleData)
    .enter().append("g")
    .attr("class","node");

if (screen.width <= 480) {
  var font_str = "11px";
} else {
  var font_str = "13px";
}

var xMin = x.domain()[0];
var xMax = x.domain()[1];

var line80 = [
  {x: xMin, y: 80},
  {x: xMax, y: 80}
];

var line90 = [
  {x: xMin, y: 90},
  {x: xMax, y: 90}
];

// define the line
var linefunc = d3.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

// Add the X Axis
if (screen.width <= 480) {
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)" )
      .append("text")
      .attr("class", "label")
      .attr("x", width-10)
      .attr("y", -10)
      .style("text-anchor", "end")
      .style("fill","black")
      .text("Population (K)");
} else {
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .append("text")
      .attr("class", "label")
      .attr("x", width-10)
      .attr("y", -10)
      .style("text-anchor", "end")
      .style("fill","black")
      .text("Population (K)");
}


// Add the Y Axis
if (screen.width <= 480) {
  svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0)
      .attr("dy", "20px")
      .style("text-anchor", "end")
      .style("fill","black")
      .text("Homicide count");
} else {
  svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("x", 0)
      .attr("dy", "20px")
      .style("text-anchor", "end")
      .style("fill","black")
      .text("Homicide count");
}

// show tooltip
var tooltip = d3.select(".bubble-graph")
    .append("div")
    .attr("class","tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
