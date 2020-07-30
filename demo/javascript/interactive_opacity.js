

d3.json( "data/opacity/merged.json", function( dinput ){
	ds_names = Object.keys(dinput);
	loaded_data = dinput;
	updateVis();
});


let chart_lines = {};
let selected_line = null;


function updateVis(){
	
	$('#plot_div').html('<svg width="500" height="500" style="border: none;" id="linechart"></svg><img id="scatterplot" />');

	
    var x_range, y_range;
    xExt = [0,0];
    yExt = [0,1];
    ds_names.forEach( function(key) {
        ds = loaded_data[key];
            xExt[1] = Math.max(xExt[1], d3.max( ds['threshold'], function(f){ if( f == 'inf') return 0; return f;  } ) );
            yExt[1] = Math.max(yExt[1], d3.max( ds['clusters'] ) );
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
            var data = [];
            for( i = 0; i < ds['threshold'].length; i++ ){
                if( ds['threshold'][i] == 'inf' ){
                    data.push( [ xExt[1], ds['clusters'][i]+offset ] );
                }
                else{
                    data.push( [ ds['threshold'][i], ds['clusters'][i]+offset ] );
                }
            }
            chart_lines[key] = insert_linechart( chart, data, "unselected_line" );
    });


	updateImage();

}


function select_line( name ){
	if( selected_line != null ){
		selected_line.attr("class", "unselected_line");
	}
	selected_line = chart_lines[name];
	selected_line.attr("class", "selected_line");
	selected_line.node().parentElement.append(selected_line.node());
}


function updateImage(){
	$("#scatterplot").attr("src","data/opacity/opacity_" + $('#frame').val() + ".png");
	select_line('opacity_'+ $('#frame').val() + '.json');
	$('#current_opacity').html( $('#frame').val()/4 + "%" );
}
