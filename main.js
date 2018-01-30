// Define global variables
var width = 960,
    height = 500,
    centered,
    us_geo_data = "https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json",
    us_states_names = "https://s3-us-west-2.amazonaws.com/vida-public/geo/us-state-names.tsv",
    config = {
        coveredCharges: "Average Covered Charges",
        state: "Provider State",
        totalPayments: "Average Total Payments",
        barColor: "#6ea865"
    };

// Bars Data
var bars_data = [
    {
        "Provider State": "AK",
        "Average Covered Charges": "59078.2784598214"
    },
    {
        "Provider State": "AL",
        "Average Covered Charges": "61181.4369089227"
    },
    {
        "Provider State": "AR",
        "Average Covered Charges": "44818.5625"
    },
    {
        "Provider State": "AZ",
        "Average Covered Charges": "65754.4788504464"
    },
    {
        "Provider State": "CA",
        "Average Covered Charges": "100830.153520886"
    },
    {
        "Provider State": "CO",
        "Average Covered Charges": "68100.9391741071"
    },
    {
        "Provider State": "CT",
        "Average Covered Charges": "48955.7301580256"
    },
    {
        "Provider State": "DC",
        "Average Covered Charges": "60255.4931640625"
    },
    {
        "Provider State": "DE",
        "Average Covered Charges": "43735.3149414063"
    },
    {
        "Provider State": "FL",
        "Average Covered Charges": "77337.8813831676"
    },
    {
        "Provider State": "GA",
        "Average Covered Charges": "55852.6706923739"
    },
    {
        "Provider State": "HI",
        "Average Covered Charges": "41059.1026278409"
    },
    {
        "Provider State": "IA",
        "Average Covered Charges": "41698.3305555556"
    },
    {
        "Provider State": "ID",
        "Average Covered Charges": "41783.8566623264"
    },
    {
        "Provider State": "IL",
        "Average Covered Charges": "62686.7212346717"
    },
    {
        "Provider State": "IN",
        "Average Covered Charges": "52429.3961219394"
    },
    {
        "Provider State": "KS",
        "Average Covered Charges": "48067.6885964912"
    },
    {
        "Provider State": "KY",
        "Average Covered Charges": "47007.7856657609"
    },
    {
        "Provider State": "LA",
        "Average Covered Charges": "53119.2979329427"
    },
    {
        "Provider State": "MA",
        "Average Covered Charges": "39318.5713141026"
    },
    {
        "Provider State": "MD",
        "Average Covered Charges": "26383.2026941636"
    },
    {
        "Provider State": "ME",
        "Average Covered Charges": "37363.4869290865"
    },
    {
        "Provider State": "MI",
        "Average Covered Charges": "41147.6743285124"
    },
    {
        "Provider State": "MN",
        "Average Covered Charges": "42913.2444069602"
    },
    {
        "Provider State": "MO",
        "Average Covered Charges": "52679.6893872893"
    },
    {
        "Provider State": "MS",
        "Average Covered Charges": "57754.7923339844"
    },
    {
        "Provider State": "MT",
        "Average Covered Charges": "35968.5696231618"
    },
    {
        "Provider State": "NC",
        "Average Covered Charges": "49195.471705163"
    },
    {
        "Provider State": "ND",
        "Average Covered Charges": "39473.4904296875"
    },
    {
        "Provider State": "NE",
        "Average Covered Charges": "50565.7337688578"
    },
    {
        "Provider State": "NH",
        "Average Covered Charges": "52829.2380756579"
    },
    {
        "Provider State": "NJ",
        "Average Covered Charges": "91061.2406529018"
    },
    {
        "Provider State": "NM",
        "Average Covered Charges": "53526.8279622396"
    },
    {
        "Provider State": "NV",
        "Average Covered Charges": "86361.0890925481"
    },
    {
        "Provider State": "NY",
        "Average Covered Charges": "50859.44697051"
    },
    {
        "Provider State": "OH",
        "Average Covered Charges": "49334.3986399581"
    },
    {
        "Provider State": "OK",
        "Average Covered Charges": "54621.7205033736"
    },
    {
        "Provider State": "OR",
        "Average Covered Charges": "44843.267177484"
    },
    {
        "Provider State": "PA",
        "Average Covered Charges": "62473.41015625"
    },
    {
        "Provider State": "RI",
        "Average Covered Charges": "37476.8927556818"
    },
    {
        "Provider State": "SC",
        "Average Covered Charges": "64861.5377604167"
    },
    {
        "Provider State": "SD",
        "Average Covered Charges": "42988.0791529605"
    },
    {
        "Provider State": "TN",
        "Average Covered Charges": "57804.5298763736"
    },
    {
        "Provider State": "TX",
        "Average Covered Charges": "68662.0707585424"
    },
    {
        "Provider State": "UT",
        "Average Covered Charges": "41221.4077435662"
    },
    {
        "Provider State": "VA",
        "Average Covered Charges": "54787.5018872893"
    },
    {
        "Provider State": "VT",
        "Average Covered Charges": "37162.11328125"
    },
    {
        "Provider State": "WA",
        "Average Covered Charges": "61376.2659855769"
    },
    {
        "Provider State": "WI",
        "Average Covered Charges": "43179.516801883"
    },
    {
        "Provider State": "WV",
        "Average Covered Charges": "35550.3622750947"
    },
    {
        "Provider State": "WY",
        "Average Covered Charges": "48963.7436079545"
    }
]

var cost_data = {}
bars_data.forEach(function (d) {
    cost_data[d[config.state]] = {};
    cost_data[d[config.state]].charge = d[config.coveredCharges];
})


function createMap() {

    // Define the projection boundaries
    var projection = d3.geoAlbers()
        .scale(1070)
        .translate([(width) / 2, (height) / 2]);

    // Define the path
    var path = d3.geoPath()
        .projection(projection);

    // Define the div for the zone tooltip
    var tooltip = d3.select("#map")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Define bars tooltips
    var divs = $("div.tooltips");
    if (divs.length === 0) {
        var div = d3.select("#map")
            .append("div")
            .attr("class", "tooltips")
            .style("opacity", 0);
    } else {
        var div = d3.select("div.tooltips");
    }

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


    var state_ids = [0],
        id_state_map = {0: ""},
        id_name_map = {0: null},
        short_name_id_map = {0: null};


    d3.tsv(us_states_names, function (error, names) {
        for (var i = 0; i < names.length; i++) {
            id_name_map[names[i].id] = names[i];
            short_name_id_map[names[i].code] = names[i].id;
        }

        var y = d3.scaleLinear().range([height, 0]);

        y.domain([0, d3.max(barsJson, function (d) {
            return +d[config.totalPayments];
        })]);

        d3.json(us_geo_data, function (err, us) {
            if (err) console.log;

            g.append("g")
                .attr("id", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features) // An extension of GeoJSON that encodes topology!
                .enter()
                .append("path")
                .attr("class", "state-path")
                .attr("state", function (d) {
                    return d.state;
                })
                .attr("d", path)
                //.on("mouseover", mouseover)
                .on("click", clicked);

            svg.selectAll('.state-path')
                .append("path")
                .attr("d", path)
                .attr("centroid", function (d) {
                    var centroid = path.centroid(d);
                    if (cost_data[id_name_map[d.id].code]) {
                        centroid[1] = centroid[1] - cost_data[id_name_map[d.id].code].charge / 1000;
                        cost_data[id_name_map[d.id].code].centroid = centroid;
                    }
                });

            g.append("path")
                .datum(topojson.mesh(us, us.objects.states, function (a, b) {
                    return a !== b;
                }))
                .attr("id", "state-borders")
                .attr("d", path);


            for (var state in cost_data) {
                g.append("rect")
                    .attr("class", "bar")
                    .style("fill", config.barColor)
                    .attr("width", 10)
                    .attr("state", state)
                    .attr("transform", function (d) {
                        var centroid = cost_data[state].centroid;
                        centroid[0] = centroid[0] - 10;
                        return "translate(" + centroid + ")";
                    })
                    .attr("height", function (d) {
                        if (cost_data[state]) {
                            return cost_data[state].charge / 1000;
                        } else {
                            return 0;
                        }
                    })
                    .on("mouseover", function (d) {
                        var state = $(this).attr("state");
                        var centroid = cost_data[state].centroid;
                        var x = centroid[0] - 15;
                        var y = centroid[1] - cost_data[state].charge / 1000 - 20;
                        div.transition().duration(200).style("opacity", 1);
                        div.html(state + "<br/>" + "$" +
                            Math.round(cost_data[state].charge / 1000) + "K")
                            .style("left", x + "px")
                            .style("top", y + "px");
                    }).on("mouseout", function (d) {
                    div.transition().duration(500).style("opacity", 0);
                });
            }

            // Legend
            /*
            var legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(-500,20)";
                });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", config.barColor);

             legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                    return "Charge";
                });
            */

        });
    });

    function mouseover(d, i) {
        console.log('Hovered >> ', d);
    }

    function clicked(d, i) {
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
            div.html("<strong>Hi, I'm Tooltip !</strong>")

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

        // Highlight the clicked province
        g.selectAll("path")
            .classed("active", centered && function (d) {
                return d === centered;
            });

        // Zoom
        g.transition()
            .duration(750)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.3 / k + "px");
    }
}


// Load map function
createMap();