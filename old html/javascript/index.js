


var datasets = {};
/*{"opacity_1" : "opacity/000_10_70000_0_7_1",
                "opacity_5" : "opacity/000_10_70000_0_7_5",
                "opacity_10" : "opacity/000_10_70000_0_7_10",
                "opacity_50" : "opacity/000_10_70000_0_7_50",
                "opacity_100" : "opacity/000_10_70000_0_7_100",
                "points_500" : "point_count/000_7_500_20_7_100",
                "points_2500" : "point_count/000_7_2500_20_7_100",
                "points_12500" : "point_count/000_7_12500_20_7_100" };*/

for( i = 1; i <= 100; i++){
	datasets['opacity_'+i] = "opacity/opacity_" + i;
}

//var ds_names = Object.keys(datasets);
//var loaded_data = {};

let chart_lines = {};
let selected_line = null;


function updateVis(){
    var x_range, y_range;
    xExt = [0,0];
    yExt = [0,1];
    ds_names.forEach( function(key) {
        ds = loaded_data[key];
		console.log(key);
		console.log(ds);
//        if( document.getElementById(key).checked ){
            xExt[1] = Math.max(xExt[1], d3.max( ds['threshold'], function(f){ if( f == 'inf') return 0; return f;  } ) );
            yExt[1] = Math.max(yExt[1], d3.max( ds['clusters'] ) );
//        }
    });
    xExt[1] *= 1.1;

    xExt[0] = xExt[1]*document.getElementById("override_x_min").value;
    xExt[1] = xExt[1]*document.getElementById("override_x_max").value;
    yExt[0] = yExt[1]*document.getElementById("override_y_min").value;
    yExt[1] = yExt[1]*document.getElementById("override_y_max").value;

    var chart_name = "#linechart";
	clear_chart(chart_name);
	add_scales(chart_name, xExt, yExt)
	chart = init_linechart( chart_name, xExt, yExt );
	var offset = -0.10;
    ds_names.forEach( function(key) {
        ds = loaded_data[key];
//        if( document.getElementById(key).checked ){
            var data = [];
            for( i = 0; i < ds['threshold'].length; i++ ){
                if( ds['threshold'][i] == 'inf' ){
                    data.push( [ xExt[1], ds['clusters'][i]+offset ] );
                }
                else{
                    data.push( [ ds['threshold'][i], ds['clusters'][i]+offset ] );
                }
            }
//            chart_lines[key] = add_linechart( chart_name, data, xExt, yExt, "gray_line" );
            chart_lines[key] = insert_linechart( chart, data, "unselected_line" );
            //offset += 0.01;

//        }
    });

//	chart_lines['opacity_85'].attr("class", "selected_line");
//	chart_lines['opacity_95'].parentElement.appendChild(chart_lines['opacity_95']);
//	chart.group.node().append(chart_lines['opacity_85'].node());

		select_line('opacity_85');
	

}


function select_line( name ){
	if( selected_line != null ){
		selected_line.attr("class", "unselected_line");
	}
	selected_line = chart_lines[name];
	selected_line.attr("class", "selected_line");
	selected_line.node().parentElement.append(selected_line.node());
}

load_data( updateVis );



/*

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

        }
    });



}


load_data( updateVis );

*/
