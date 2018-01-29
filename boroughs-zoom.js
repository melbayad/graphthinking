// Define global variables
var width = 960,
    height = 500,
    centered;

var geojson = "https://gist.githubusercontent.com/oikonang/6bce54dd9dc0eb702b66fcb5d62b76a9/raw/1bad0960f4578268c5b20bd9077b88f34ac3e170/nyc.geojson",
    usjson = "https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json",
    total_neight = "https://gist.githubusercontent.com/oikonang/6bce54dd9dc0eb702b66fcb5d62b76a9/raw/1bad0960f4578268c5b20bd9077b88f34ac3e170/total_neight.csv",
    BAR_COLOR = "red";


function createUSMap() {

    // Define the projection boundaries
    var projection = d3.geoAlbersUsa()
    // .center([-73.94, 40.70])
        .scale(1070)
        .translate([(width) / 2, (height) / 2]);

    // Define the path
    var path = d3.geoPath()
        .projection(projection);

    // Define the div for the tooltip
    var div = d3.select("#map")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Define the svg for the map
    var svg = d3.select("#map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", clicked);

    // Define the g for each neighborhood
    var g = svg.append("g");

    d3.json(usjson, function (err, us) {
        if (err) console.log;
        console.log(' ======== Json loaded ======== ');
        console.log(err, us);

        g.append("g")
            .attr("id", "states") // neighborhood
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter()
            .append("path")
            .attr("d", path)
            .on("click", clicked);

        g.append("path")
            .datum(topojson.mesh(us, us.objects.states, function (a, b) {
                return a !== b;
            }))
            .attr("id", "state-borders")
            .attr("d", path)
    });

    function clicked(d) {
        console.log('>> Clicked Zone >>');

        var x, y, k;

        // IF zoomed-in state is on
        if (d && centered !== d) {

            // Change the center of the projection
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            centered = d;

            // Show tooltip
            div.transition()
                .duration(200)
                .style("opacity", .9);

            // Write staff on tooltip
            div.html("<strong>Tooltip hello !</strong>")

            // Place the tooltip
            div.style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1]) + "px");


        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            centered = null;

            // Hide the tooltip
            $(".tooltip").css('opacity', 0);
        }

        g.selectAll("path")
            .classed("active", centered && function (d) {
                return d === centered;
            });

        g.transition()
            .duration(750)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
    }
}


// Load US map function
createUSMap();