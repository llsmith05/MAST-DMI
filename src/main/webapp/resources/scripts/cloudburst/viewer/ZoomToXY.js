var map;
var size;
var offset;
var icon;
var objMarker=null;
var markers;
Cloudburst.ZoomToXY =  function(_map, _searchdiv) {
    map = _map;
    searchdiv = _searchdiv;
    $("#tabs-Tool").empty();
	jQuery.get('resources/templates/viewer/zoomtoxy.html', function(template) {
		addTab($._("zoom"),template);
    	$("#zoomtoxy-help").tipTip({defaultPosition:"right"});
		$("#options-s-d").hide();
		$("#options-s-t").click(function() {
			$("#options-s-d").slideToggle('fast');
		});
		//translateZoomToXYStrings();
    });
};

function translateZoomToXYStrings(){
	$('#longitude').html($._('longitude'));
	$('#latitude').html($._('latitude'));
	$('#btnZoom_To').attr("value", $._('zoom_to'));
	$('#btnPan_To').attr("value", $._('pan_to'));
	$('#btnCalLatLong').attr("value", $._('calculate'));
	$('#osref').html($._('os grid reference'));
}

var Pan = function(x,y) 
{   
   if (x != "" && y != "") {
	   
	   if(!$.isNumeric(x) || !$.isNumeric(y))
	   {
		   jAlert('X and Y should be Numeric', 'Zoom To XY');
            return;
	   }
				  var vectorSource = new ol.source.Vector({
					  name:"iconpan"
					  
				  });
				   var coordinate= [x, y];
				   var coordMin = ol.proj.fromLonLat([x, y], 'EPSG:4326');
				  var iconFeature = new ol.Feature({
						  geometry: new  ol.geom.Point(coordMin)
						});
                   vectorSource.addFeature(iconFeature);
				   
				    var iconStyle = new ol.style.Style({
						  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
							anchor: [0.5, 46],
							anchorXUnits: 'fraction',
							anchorYUnits: 'pixels',
							opacity: 0.75,
							src: 'http://openlayers.org/en/v3.9.0/examples/data/icon.png'
						  }))
						});

                          //add the feature vector to the layer vector, and apply a style to whole layer
						var vectorLayer = new ol.layer.Vector({
						  source: vectorSource,
						  style: iconStyle
						});
						vectorLayer.set('aname', "pan_icon");	
						map.addLayer(vectorLayer);
						//map.getView().setCenter(ol.proj.transform(coordMin));
						//map.getView().setZoom(10);
						  map.getView().animate({center: coordMin, zoom: 10});
						
	
        $("#loading").hide();
       
    }
    else {
        jAlert('Please enter X and Y values both', 'Zoom To XY');
        return;
    }
};


var Zoom = function(x, y) {
    if (x != "" && y != "") {
		
	 if(!$.isNumeric(x) ||  !$.isNumeric(y))
	   {
		   jAlert('X and Y should be Numeric', 'Zoom To XY');
            return;
	   }
	   
                    var coordinate= [x, y];
                    map.getView().setCenter(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
                    map.getView().setZoom(5);
	                $("#loading").hide();
    }
    else {
    
        jAlert('Please enter X and Y values both', 'Zoom To XY');
        return;
    }
};
