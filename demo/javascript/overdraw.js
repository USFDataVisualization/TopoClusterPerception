

var datasets = {"overdraw_1": "data/overdraw_fig/1_cropped",
                "overdraw_10": "data/overdraw_fig/10_cropped",
                "overdraw_100": "data/overdraw_fig/100_cropped"};



function add_teaser_scales( chart_name, xExt, yExt, lc_margin = {left: 25, right: 5, top: 5, bottom: 20}, ticksY = 3 ){
	var lc_svg = d3.select(chart_name);
	var lc_svg_width  = +lc_svg.attr("width");
	var lc_svg_height = +lc_svg.attr("height");

	let lc_width  = lc_svg_width  - lc_margin.left - lc_margin.right,
		lc_height = lc_svg_height - lc_margin.top  - lc_margin.bottom;

	var xAxis = d3.scaleLinear().domain( xExt ).range([ 0, lc_width ]);
	var yAxis = d3.scaleLinear().domain( yExt ).range([ lc_height, 0]);

    lc_svg.append("g")
        .attr("class", "overdraw_axis")
        .attr("transform", "translate(" + (lc_svg_width-lc_margin.right) + "," + (lc_margin.top) + ")")
        .call(d3.axisRight(yAxis).ticks(ticksY).tickFormat(d3.format("d")));

    lc_svg.append("g")
        .attr("class", "overdraw_axis")
        .attr("transform", "translate(" + (lc_margin.left) + "," + (lc_margin.top+lc_height) + ")")
        .call(d3.axisBottom(xAxis).ticks(5));

}


function update_plot( chart_name, use_ds, xExt, yExt, offset_amnt = 0.05, ticksY = 3){

	var lc_svg = d3.select(chart_name);
	var lc_svg_width  = +lc_svg.attr("width");
	var lc_svg_height = +lc_svg.attr("height");

    x_off = Math.floor( use_ds.length )*260
    let margin = {left: x_off+14, right: 25, top: 10, bottom: 25};
    console.log(margin);

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

        let curr_x = curr;
        let curr_y = 0;
        add_image(chart_name, datasets[key] + ".png", curr_x*260 + 5, curr_y*260 + 5, 250,250, key + "_line");
        add_image(chart_name, datasets[key] + ".png.hist.png", curr_x*260 + 200,curr_y*260 + 200, 50,50, key + "_line");

        
    	var lc_svg = d3.select(chart_name);
        let tmp_g = lc_svg.append("g");

        tmp_g.append("rect")
				.attr("x", curr_x*260 + 7)
				.attr("y", curr_y*210 + 7)
				.attr("width", 92 + curr_x*11 )
				.attr("height", 19)
				.attr("fill", "white")
				.attr("stroke", "black");
		

        tmp_g.append("text")
				.attr("x", curr_x*260 + 9)
				.attr("y", curr_y*210 + 22)
				.attr("font-size", "18px")
				.text(titles[key]);
        
        curr += 1;
    });

}


function updateVis(  ){

    let use_ds = ["overdraw_1", "overdraw_10", "overdraw_100"];
    var chart_name = "#overdraw";
    let xExt = [-0.0,0.5];
    let yExt = [0.85,8.25];
    update_plot(chart_name, use_ds, xExt, yExt, 0.05, 3);

}

load_data( updateVis );
