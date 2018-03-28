var data = [

    {"region":"Hotel","Sector":"New Brunswick","count":0},
    {"region":"Health","Sector":"New Brunswick","count":2},
    {"region":"Education","Sector":"New Brunswick","count":0},
    {"region":"Airport","Sector":"New Brunswick","count":2},
    {"region":"Commercial","Sector":"New Brunswick","count":0},
    {"region":"Residential","Sector":"New Brunswick","count":0},
    {"region":"Municipal","Sector":"New Brunswick","count":68},

    {"region":"Hotel","Sector":"Prince Edward Island","count":0},
    {"region":"Health","Sector":"Prince Edward Island","count":0},
    {"region":"Education","Sector":"Prince Edward Island","count":0},
    {"region":"Airport","Sector":"Prince Edward Island","count":0},
    {"region":"Commercial","Sector":"Prince Edward Island","count":2},
    {"region":"Residential","Sector":"Prince Edward Island","count":0},
    {"region":"Municipal","Sector":"Prince Edward Island","count":0},

    {"region":"Hotel","Sector":"British Columbia","count":9},
    {"region":"Health","Sector":"British Columbia","count":0},
    {"region":"Education","Sector":"British Columbia","count":11},
    {"region":"Airport","Sector":"British Columbia","count":12},
    {"region":"Commercial","Sector":"British Columbia","count":54},
    {"region":"Residential","Sector":"British Columbia","count":17},
    {"region":"Municipal","Sector":"British Columbia","count":277},

    {"region":"Hotel","Sector":"Alberta","count":0},
    {"region":"Health","Sector":"Alberta","count":24},
    {"region":"Education","Sector":"Alberta","count":50},
    {"region":"Airport","Sector":"Alberta","count":1},
    {"region":"Commercial","Sector":"Alberta","count":50},
    {"region":"Residential","Sector":"Alberta","count":4},
    {"region":"Municipal","Sector":"Alberta","count":12},

    {"region":"Hotel","Sector":"Saskatchewan","count":14},
    {"region":"Health","Sector":"Saskatchewan","count":6},
    {"region":"Education","Sector":"Saskatchewan","count":134},
    {"region":"Airport","Sector":"Saskatchewan","count":0},
    {"region":"Commercial","Sector":"Saskatchewan","count":30},
    {"region":"Residential","Sector":"Saskatchewan","count":0},
    {"region":"Municipal","Sector":"Saskatchewan","count":21},

    {"region":"Hotel","Sector":"Manitoba","count":6},
    {"region":"Health","Sector":"Manitoba","count":0},
    {"region":"Education","Sector":"Manitoba","count":0},
    {"region":"Airport","Sector":"Manitoba","count":0},
    {"region":"Commercial","Sector":"Manitoba","count":48},
    {"region":"Residential","Sector":"Manitoba","count":2},
    {"region":"Municipal","Sector":"Manitoba","count":604},

    {"region":"Hotel","Sector":"Ontario","count":30},
    {"region":"Health","Sector":"Ontario","count":757},
    {"region":"Education","Sector":"Ontario","count":336},
    {"region":"Airport","Sector":"Ontario","count":190},
    {"region":"Commercial","Sector":"Ontario","count":443},
    {"region":"Residential","Sector":"Ontario","count":90},
    {"region":"Municipal","Sector":"Ontario","count":4810},

    {"region":"Hotel","Sector":"Quebec","count":0},
    {"region":"Health","Sector":"Quebec","count":0},
    {"region":"Education","Sector":"Quebec","count":29},
    {"region":"Airport","Sector":"Quebec","count":133},
    {"region":"Commercial","Sector":"Quebec","count":71},
    {"region":"Residential","Sector":"Quebec","count":2},
    {"region":"Municipal","Sector":"Quebec","count":34},

];

var width = 500,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.category20();

var pie = d3.layout.pie()
    .value(function(d) { return d.count; })
    .sort(null);

var arc = d3.svg.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 20);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var path = svg.selectAll("path");

  var regionsBySector = d3.nest()
      .key(function(d) { return d.Sector; })
      .entries(data)
      .reverse();

    console.log(regionsBySector);

  var label = d3.select("form").selectAll("label")
      .data(regionsBySector)
    .enter().append("label");

  label.append("input")
      .attr("type", "radio")
      .attr("name", "Sector")
      .attr("value", function(d) { return d.key; })
      .on("change", change)
    .filter(function(d, i) { return !i; })
      .each(change)
      .property("checked", true);

  label.append("span")
      .text(function(d) { return d.key; });

  function change(region) {
    var data0 = path.data(),
        data1 = pie(region.values);

    path = path.data(data1, key);

    path.enter().append("path")
        .each(function(d, i) { this._current = findNeighborArc(i, data0, data1, key) || d; })
        .attr("fill", function(d) { return color(d.data.region); })
      .append("title")
        .text(function(d) { return d.data.region; });

    path.exit()
        .datum(function(d, i) { return findNeighborArc(i, data1, data0, key) || d; })
      .transition()
        .duration(750)
        .attrTween("d", arcTween)
        .remove();

    path.transition()
        .duration(750)
        .attrTween("d", arcTween);
  }

function key(d) {
  return d.data.region;
}

function type(d) {
  d.count = +d.count;
  return d;
}

function findNeighborArc(i, data0, data1, key) {
  var d;
  return (d = findPreceding(i, data0, data1, key)) ? {startAngle: d.endAngle, endAngle: d.endAngle}
      : (d = findFollowing(i, data0, data1, key)) ? {startAngle: d.startAngle, endAngle: d.startAngle}
      : null;
}

// Find the element in data0 that joins the highest preceding element in data1.
function findPreceding(i, data0, data1, key) {
  var m = data0.length;
  while (--i >= 0) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

// Find the element in data0 that joins the lowest following element in data1.
function findFollowing(i, data0, data1, key) {
  var n = data1.length, m = data0.length;
  while (++i < n) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

function arcTween(d) {
  var i = d3.interpolate(this._current, d);
  this._current = i(0);
  return function(t) { return arc(i(t)); };
}
