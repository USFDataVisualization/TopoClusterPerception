

var datasets = {};


var titles   = {"opacity_1" : "Opacity: 1%",
                "opacity_5" : "Opacity: 5%",
                "opacity_10" : "Opacity: 10%",
                "opacity_50" : "Opacity: 50%",
                "opacity_100" : "Opacity: 100%",
                "points_500" : "Points: 500",
                "points_2500" : "Points: 2,500",
                "points_12500" : "Points: 12,500",
                "overdraw_1": "Opacity 1%",
                "overdraw_10": "Opacity 10%",
                "overdraw_100": "Opacity 100%"};

var ds_names = Object.keys(datasets);
var loaded_data = {};

function clear_chart( chart_name ){
	$(chart_name).empty();
}

var pages = ["interactive_opacity.html", "interactive_points.html", "teaser.html", "overdraw.html"];
var page_titles = {"interactive_opacity.html": "Interactive Opacity",
                   "interactive_points.html": "Interactive Point Count",
                   "overdraw.html": "Overdraw Figure",
                   "teaser.html": "Teaser Figure"};


function insert_page_header(){
    html = `<div class="page" style="padding: 15px;">
                <h2 style="margin: 0; font-weight: bold;">Modeling the Influence of Visual Density on Cluster Perception in<br>Scatterplots Using Topology</h2>
                <h3 style="padding-left: 5px; padding-top: 10px;">Ghulam Jilani Quadri and Paul Rosen</h3>`;
	
	if( new Date() > new Date(2020, 07, 14) )
		html += '<h3 style="padding-left: 5px; padding-top: 10px;">Transactions on Visualization and Computer Graphics, Proceedings of InfoVis, 2020</h3>';
	
	html += '</div>';
	
    document.write(html);
}



function insert_navbar( curpage ){
    html = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
              <a class="navbar-brand" href="index.html">LineSmooth</a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">`;

    pages.forEach(function(key){
        if( curpage == key ){
            html += '<li class="nav-item active">';
        }
        else{
            html += '<li class="nav-item">';
        }
        html += '<a class="nav-link" href="' + key + '">' + page_titles[key] + '</a>';
        html += '</li>';
    });

    html += `    </ul>
               </div>
             </nav>`;
    document.write(html);
}



function add_scales( chart_name, xExt, yExt, lc_margin = {left: 25, right: 5, top: 5, bottom: 20} ){
	var lc_svg = d3.select(chart_name);
	var lc_svg_width  = +lc_svg.attr("width");
	var lc_svg_height = +lc_svg.attr("height");

	let lc_width  = lc_svg_width  - lc_margin.left - lc_margin.right,
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

function init_linechart( chart_name, xExt, yExt, lc_margin = {left: 25, right: 5, top: 5, bottom: 20} ){

	var lc_svg = d3.select(chart_name);
	var lc_svg_width  = +lc_svg.attr("width");
	var lc_svg_height = +lc_svg.attr("height");

	let lc_width  = lc_svg_width  - lc_margin.left - lc_margin.right,
		lc_height = lc_svg_height - lc_margin.top  - lc_margin.bottom;

	var xAxis = d3.scaleLinear().domain( xExt ).range([ 0, lc_width ]);
	var yAxis = d3.scaleLinear().domain( yExt ).range([ lc_height, 0]);

    let cp = lc_svg.append("clipPath")       // define a clip path
                        .attr("id", "boxclip") // give the clipPath an ID
                        .append("rect")          // shape it as an ellipse
                            .attr("x", 0)         // position the x-centre
                            .attr("y", 0)         // position the y-centre
                            .attr("width", lc_width)         // set the x radius
                            .attr("height", lc_height);

    let svg_grp = lc_svg.append("g")
                    .attr("transform", "translate(" + lc_margin.left + "," + lc_margin.top + ")");	
	
	return {'xAxis':xAxis, 'yAxis':yAxis, 'clipPath': cp, 'group': svg_grp };
}


function insert_linechart( chart, data, class_name, stroke_size = 3 ){
	
	return chart.group.append("path")
							.datum( data )
								.attr("clip-path", "url(#boxclip)")
								.attr("class", class_name)
								.attr("stroke-width", stroke_size + "px")
								.attr("d", d3.line()
										.x(function(d) { return chart.xAxis(d[0]+0.002); })
										.y(function(d) { return chart.yAxis(d[1]); })
									  );
}

function add_linechart( chart_name, data, xExt, yExt, class_name, lc_margin = {left: 25, right: 5, top: 5, bottom: 20}, stroke_size = 3 ){

	var lc_svg = d3.select(chart_name);
	var lc_svg_width  = +lc_svg.attr("width");
	var lc_svg_height = +lc_svg.attr("height");

	let lc_width  = lc_svg_width  - lc_margin.left - lc_margin.right,
		lc_height = lc_svg_height - lc_margin.top  - lc_margin.bottom;

	var xAxis = d3.scaleLinear().domain( xExt ).range([ 0, lc_width ]);
	var yAxis = d3.scaleLinear().domain( yExt ).range([ lc_height, 0]);

    cp = lc_svg.append("clipPath")       // define a clip path
                        .attr("id", "boxclip") // give the clipPath an ID
                        .append("rect")          // shape it as an ellipse
                            .attr("x", 0)         // position the x-centre
                            .attr("y", 0)         // position the y-centre
                            .attr("width", lc_width)         // set the x radius
                            .attr("height", lc_height);

    svg_grp = lc_svg.append("g")
                    .attr("transform", "translate(" + lc_margin.left + "," + lc_margin.top + ")");

    /*
    let stroke = 3;
    if( (yExt[1]-yExt[0]) < 15 ) stroke = 4;
    if( (yExt[1]-yExt[0]) < 10 ) stroke = 5;
    if( (yExt[1]-yExt[0]) < 5 ) stroke = 6;
    if( (yExt[1]-yExt[0]) < 3 ) stroke = 7;
    */

	path = svg_grp.append("path")
					.datum( data )
						.attr("clip-path", "url(#boxclip)")
						.attr("class", class_name)
						.attr("stroke-width", stroke_size + "px")
						.attr("d", d3.line()
								.x(function(d) { return xAxis(d[0]+0.002); })
								.y(function(d) { return yAxis(d[1]); })
						);
	return {'clip-path': cp, 'group': svg_grp, 'path': path};
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
        .attr("href", url);
        //.attr("xlink:href", url);

    svg_grp.append("rect")
        .attr('x', x)
        .attr('y', y)
        .attr('width', w)
        .attr('height', h)
        .attr("class", border_class)
        .attr("stroke-width","2px")
        .attr("fill", "none");

}


// load datasets
function __load_ds( idx, updateFunc ){
    if( idx >= ds_names.length ){
        updateFunc();
    }
    else{
        key = ds_names[idx];
        d3.json( datasets[key] + ".json", function( dinput ){
            loaded_data[key] = dinput;
            __load_ds(idx+1, updateFunc);
        });
    }
}


function load_data( updateFunc ){
	ds_names = Object.keys(datasets);
    __load_ds(0, updateFunc);
}
