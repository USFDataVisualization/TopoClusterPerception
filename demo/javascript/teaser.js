

var datasets = {"opacity_1" : "data/teaser_opacity/000_10_70000_0_7_1",
                "opacity_5" : "data/teaser_opacity/000_10_70000_0_7_5",
                "opacity_10" : "data/teaser_opacity/000_10_70000_0_7_10",
                "opacity_50" : "data/teaser_opacity/000_10_70000_0_7_50",
                "opacity_100" : "data/teaser_opacity/000_10_70000_0_7_100",
                "points_500" : "data/teaser_points/000_7_500_20_7_100",
                "points_2500" : "data/teaser_points/000_7_2500_20_7_100",
                "points_12500" : "data/teaser_points/000_7_12500_20_7_100" };



function add_teaser_scales( chart_name, xExt, yExt, lc_margin = {left: 25, right: 5, top: 5, bottom: 20}, ticksY = 3 ){
	var lc_svg = d3.select(chart_name);
	var lc_svg_width  = +lc_svg.attr("width");
	var lc_svg_height = +lc_svg.attr("height");

	let lc_width  = lc_svg_width  - lc_margin.left - lc_margin.right,
		lc_height = lc_svg_height - lc_margin.top  - lc_margin.bottom;

	var xAxis = d3.scaleLinear().domain( xExt ).range([ 0, lc_width ]);
	var yAxis = d3.scaleLinear().domain( yExt ).range([ lc_height, 0]);

    lc_svg.append("g")
        .attr("transform", "translate(" + (lc_svg_width-lc_margin.right) + "," + (lc_margin.top) + ")")
        .call(d3.axisRight(yAxis).ticks(ticksY).tickFormat(d3.format("d")));

    lc_svg.append("g")
            .attr("transform", "translate(" + (lc_margin.left) + "," + (lc_margin.top+lc_height) + ")")
            .call(d3.axisBottom(xAxis).ticks(5));

}


function update_plot( chart_name, use_ds, xExt, yExt, offset_amnt = 0.05, ticksY = 3){

	var lc_svg = d3.select(chart_name);
	var lc_svg_width  = +lc_svg.attr("width");
	var lc_svg_height = +lc_svg.attr("height");

    x_off = Math.floor( use_ds.length/2 )*210
    let margin = {left: x_off+10, right: lc_svg_width-190-x_off, top: 215, bottom: lc_svg_height-400};

	clear_chart(chart_name);
	add_teaser_scales(chart_name, xExt, yExt, margin, ticksY )
	var offset = -Math.floor( use_ds.length / 2 ) * offset_amnt;
	let curr = 0;
    use_ds.forEach( function(key) {
        ds = loaded_data[key];
        var data = [];
        for( i = 0; i < ds['threshold'].length; i++ ){
            if( ds['threshold'][i] == 'inf' ){
                data.push( [ xExt[1], ds['clusters'][i]+offset ] );
            }
            else{
                data.push( [ ds['threshold'][i], ds['clusters'][i]+offset ] );
            }
        }
        add_linechart( chart_name, data, xExt, yExt, key + "_line", margin, 3.5 );
        offset += offset_amnt;

        let curr_x = Math.floor(curr/2);
        let curr_y = curr%2;
        add_image(chart_name, datasets[key] + ".png", curr_x*210 + 5, curr_y*210 + 5, 200,200, key + "_line");
        add_image(chart_name, datasets[key] + ".png.hist.png", curr_x*210 + 150,curr_y*210 + 150, 50,50, key + "_line");

    	var lc_svg = d3.select(chart_name);
        lc_svg.append("g")
                .append("text")
                    .attr("x", curr_x*210 + 8)
                    .attr("y", curr_y*210 + 15)
                    .attr("font-size", "10px")
                    .text(titles[key]);

        curr += 1;
    });

}


function updateVis(  ){

    let use_ds = ["opacity_1", "opacity_50", "opacity_5", "opacity_100", "opacity_10"];
    var chart_name = "#teaser_opacity";
    let xExt = [0,0.35];
    let yExt = [0.85,3.25];
    update_plot(chart_name, use_ds, xExt, yExt, 0.05, 3);

    use_ds = ["points_500", "points_12500", "points_2500"];
    chart_name = "#teaser_points";
    xExt = [0,0.8];
    yExt = [0.65,10.5];
    update_plot(chart_name, use_ds, xExt, yExt, 0.2, 7);
}

load_data( updateVis );
