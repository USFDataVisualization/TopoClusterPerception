

var datasets = {"opacity_1" : "opacity/000_10_70000_0_7_1",
                "opacity_5" : "opacity/000_10_70000_0_7_5",
                "opacity_10" : "opacity/000_10_70000_0_7_10",
                "opacity_50" : "opacity/000_10_70000_0_7_50",
                "opacity_100" : "opacity/000_10_70000_0_7_100",
                "points_500" : "point_count/000_7_500_20_7_100",
                "points_2500" : "point_count/000_7_2500_20_7_100",
                "points_12500" : "point_count/000_7_12500_20_7_100" };

var ds_names = Object.keys(datasets);
var loaded_data = {};

function clear_chart( chart_name ){
	$(chart_name).empty();
}

function add_scales( chart_name, xExt, yExt ){
	var lc_svg = d3.select(chart_name);
	var lc_svg_width  = +lc_svg.attr("width");
	var lc_svg_height = +lc_svg.attr("height");

	var lc_margin = {left: 25, right: 5, top: 5, bottom: 20},
		lc_width  = lc_svg_width  - lc_margin.left - lc_margin.right,
		lc_height = lc_svg_height - lc_margin.top  - lc_margin.bottom;

	var xAxis = d3.scaleLinear().domain( xExt ).range([ 0, lc_width ]);
	var yAxis = d3.scaleLinear().domain( yExt ).range([ lc_height, 0]);

    lc_svg.append("g")
        .attr("transform", "translate(" + (lc_margin.left) + "," + (lc_margin.top) + ")")
        .call(d3.axisLeft(yAxis).ticks(5));

    lc_svg.append("g")
            .attr("transform", "translate(" + (lc_margin.left) + "," + (lc_margin.top+lc_height) + ")")
            .call(d3.axisBottom(xAxis).ticks(10));

}

function add_linechart( chart_name, data, xExt, yExt, class_name ){

	var lc_svg = d3.select(chart_name);
	var lc_svg_width  = +lc_svg.attr("width");
	var lc_svg_height = +lc_svg.attr("height");

	var lc_margin = {left: 25, right: 5, top: 5, bottom: 20},
		lc_width  = lc_svg_width  - lc_margin.left - lc_margin.right,
		lc_height = lc_svg_height - lc_margin.top  - lc_margin.bottom;

	var xAxis = d3.scaleLinear().domain( xExt ).range([ 0, lc_width ]);
	var yAxis = d3.scaleLinear().domain( yExt ).range([ lc_height, 0]);

    lc_svg.append("clipPath")       // define a clip path
                        .attr("id", "boxclip") // give the clipPath an ID
                        .append("rect")          // shape it as an ellipse
                            .attr("x", 0)         // position the x-centre
                            .attr("y", 0)         // position the y-centre
                            .attr("width", lc_width)         // set the x radius
                            .attr("height", lc_height);

    svg_grp = lc_svg.append("g")
                    .attr("transform", "translate(" + lc_margin.left + "," + lc_margin.top + ")");

    let stroke = 3;
    if( (yExt[1]-yExt[0]) < 15 ) stroke = 4;
    if( (yExt[1]-yExt[0]) < 10 ) stroke = 5;
    if( (yExt[1]-yExt[0]) < 5 ) stroke = 6;
    if( (yExt[1]-yExt[0]) < 3 ) stroke = 7;

	svg_grp.append("path")
		  .datum( data )
                .attr("clip-path", "url(#boxclip)")
                .attr("class", class_name)
		        .attr("stroke-width", stroke + "px")
		        .attr("d", d3.line()
			            .x(function(d) { return xAxis(d[0]); })
			            .y(function(d) { return yAxis(d[1]); })
			);
}

function add_image(chart_name, url, x, y, w, h, border_class ){
	var lc_svg = d3.select(chart_name);
	var lc_svg_width  = +lc_svg.attr("width");
	var lc_svg_height = +lc_svg.attr("height");

    svg_grp = lc_svg.append("g");

    svg_grp.append("svg:image")
        .attr('x', x)
        .attr('y', y)
        .attr('width', w)
        .attr('height', h)
        .attr("xlink:href", url);

    svg_grp.append("rect")
        .attr('x', x)
        .attr('y', y)
        .attr('width', w)
        .attr('height', h)
        .attr("class", border_class)
        .attr("stroke-width","2px")
        .attr("fill", "none");

}

function updateVis(){
    var x_range, y_range;
    xExt = [0,0];
    yExt = [0,1];
    ds_names.forEach( function(key) {
        ds = loaded_data[key];
        if( document.getElementById(key).checked ){
            xExt[1] = Math.max(xExt[1], d3.max( ds['threshold'], function(f){ if( f == 'inf') return 0; return f;  } ) );
            yExt[1] = Math.max(yExt[1], d3.max( ds['clusters'] ) );
        }
    });
    xExt[1] *= 1.1;

    xExt[0] = xExt[1]*document.getElementById("override_x_min").value;
    xExt[1] = xExt[1]*document.getElementById("override_x_max").value;
    yExt[0] = yExt[1]*document.getElementById("override_y_min").value;
    yExt[1] = yExt[1]*document.getElementById("override_y_max").value;

    var chart_name = "#linechart";
	clear_chart(chart_name);
	add_scales(chart_name, xExt, yExt)
	var offset = -0.10;
	let curr = 0;
    ds_names.forEach( function(key) {
        ds = loaded_data[key];
        if( document.getElementById(key).checked ){
            var data = [];
            for( i = 0; i < ds['threshold'].length; i++ ){
                if( ds['threshold'][i] == 'inf' ){
                    data.push( [ xExt[1], ds['clusters'][i]+offset ] );
                }
                else{
                    data.push( [ ds['threshold'][i], ds['clusters'][i]+offset ] );
                }
            }
            add_linechart( chart_name, data, xExt, yExt, key + "_line" );
            offset += 0.05;

            let curr_x = Math.floor(curr/2);
            let curr_y = curr%2;
            add_image(chart_name, datasets[key] + ".png", curr_x*210 + 5, curr_y*210 + 5, 200,200, key + "_line");
            add_image(chart_name, datasets[key] + ".png.hist.png", curr_x*210 + 150,curr_y*210 + 150, 50,50, key + "_line");
            curr += 1;

        }
    });



    console.log( xExt );
    console.log( yExt );

}

// load datasets
function load_ds( idx ){
    if( idx >= ds_names.length ){
        updateVis();
    }
    else{
        key = ds_names[idx];
        d3.json( datasets[key] + ".json", function( dinput ){
            loaded_data[key] = dinput;
            load_ds(idx+1);
        });
    }
}

load_ds(0);
