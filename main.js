// Define global variables
var width = 960,
    height = 500,
    centered,
    map_id = "map",
    bar_tp_cs = "bar-tp", // Bar tooltip class
    zone_tp_cs = "zone-tp", // Zone tooltip class
    us_geo_data = "https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json",
    us_states_names = "https://s3-us-west-2.amazonaws.com/vida-public/geo/us-state-names.tsv",
    colors = {low: '#d8edd2', moderate: '#fefac6', considerable: '#fbdec2', high: '#febdc7', extrem: '#b2b2b2'},
    config = {
        coveredCharges: "Average Covered Charges",
        state: "Provider State",
        totalPayments: "Average Total Payments",
        barColor: "#6ea865"
    },
    pie_config = {
        size: {w: 120, h: 120},
        color: d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888"])
    };


// Bars fake data
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
        .scale(1030)
        .translate([(width) / 2, (height) / 2]);

    // Define the path
    var path = d3.geoPath()
        .projection(projection);

    // Define the div for the zone tooltip
    var zone_tp = buildTooltip(zone_tp_cs)

    // Define bars tooltips
    var bar_tp = buildTooltip(bar_tp_cs)

    // Define the svg for the map
    var svg = d3.select("#" + map_id)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", clicked)

    // Define the g for each zone
    var g = svg.append("g");

    var id_name_map = {0: null},
        short_name_id_map = {0: null};

    d3.tsv(us_states_names, function (error, names) {
        for (var i = 0; i < names.length; i++) {
            id_name_map[names[i].id] = names[i];
            short_name_id_map[names[i].code] = names[i].id;
        }

        var y = d3.scaleLinear().range([height, 0]);

        y.domain([0, d3.max(bars_data, function (d) {
            return +d[config.totalPayments];
        })]);

        d3.json(us_geo_data, function (err, us) {
            if (err) console.error;

            // Main map
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
                .on("click", clicked);

            g.append("path")
                .datum(topojson.mesh(us, us.objects.states, function (a, b) {
                    return a !== b;
                }))
                .attr("id", "state-borders")
                .attr("d", path);


            // Barcharts
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

            for (var state in cost_data) {
                g.append("rect")
                    .attr("class", "bar")
                    .style("fill", config.barColor)
                    .attr("width", 10)
                    .attr("state", state)
                    .attr("transform", function (d) {
                        var centroid = cost_data[state].centroid;
                        centroid[0] = centroid[0] - 5;
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
                        var x = d3.event.pageX;
                        var y = d3.event.pageY;

                        bar_tp.transition().duration(200).style("opacity", 1);

                        // Tooltip content
                        bar_tp.html(state + "<br/>" + "$" +
                            Math.round(cost_data[state].charge / 1000) + "K")
                            .style("left", x + "px")
                            .style("top", y + "px");

                    }).on("mouseout", function (d) {
                    bar_tp.transition().duration(500).style("opacity", 0);
                });
            }

            // Coloring map
            svg.selectAll('.state-path')
                .style("fill", function (d) {
                    var val = cost_data[id_name_map[d.id].code];
                    if (val && val.charge) {
                        if (val.charge < 40000) return colors.low;
                        else if (val.charge > 60000) return colors.considerable;
                        else return colors.high;
                    } else {
                        return "#ddd";
                    }
                })
                .attr("d", path);
        });
    });


    function clicked(d) {
        var x, y, k;

        // Clear zone tooltip
        $('.' + zone_tp_cs).empty();

        // IF zoomed-in state is on
        if (d && centered !== d) {

            // Change the center of the projection
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            centered = d;

            // Show tooltip
            zone_tp.transition()
                .duration(200)
                .style("opacity", .9);

            // Write staff on tooltip
            zone_tp.html(
                '<div class="content">' +
                '<h4 class="title">Hi, I\'m Tooltip !</h4>' +
                '<p>I\'m gonna use Piechart below...</p>' +
                '</div>'
            );


            /* ==== Draw Piechart ===== */

            // Piechart fake Data
            var pie_data = [
                {name: 'low', y: Math.floor(Math.random() * 30) + 1},
                {name: 'medium', y: Math.floor(Math.random() * 30) + 1},
                {name: 'high', y: Math.floor(Math.random() * 30) + 1}
            ];

            // adapt data to d3
            var piechart_fake_data = [];
            pie_data.forEach(function (d, i) {
                piechart_fake_data[i] = d.y;
            })
            buildPieChart("." + zone_tp_cs, pie_config, piechart_fake_data);

            /* ======================== */

            // Place the tooltip
            zone_tp.style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1]) + "px");

        } else {
            x = width / 2;
            y = height / 2;
            k = 1;
            centered = null;

            // Hide tooltip
            $("." + zone_tp_cs).css('opacity', 0);
        }

        // Highlight clicked province
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


function buildPieChart(parent, conf, data) {
    var size = conf.size,
        color = conf.color,
        radius = Math.min(size.w, size.h) / 2;

    // Default size
    if (!size) {
        size = {w: 120, h: 120}
    }

    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d;
        });

    // Define piechart svg
    var svg = d3.select("#" + map_id + " " + parent)
        .append("svg")
        .attr("width", size.w)
        .attr("height", size.h)
        .append("g")
        .attr("transform", "translate(" + size.w / 2 + "," + size.h / 2 + ")");

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data);
        });

    g.append("text")
        .attr("transform", function (d) {
            return "translate(" + labelArc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .text(function (d) {
            return d.data;
        });
}


// target should be a class
function buildTooltip(target) {
    var _target = $("." + target);
    if (_target.length === 0) {
        return d3.select("#" + map_id)
            .append("div")
            .attr("class", target)
            .style("opacity", 0);
    } else {
        return d3.select("." + target);
    }
}

// Load map
createMap();