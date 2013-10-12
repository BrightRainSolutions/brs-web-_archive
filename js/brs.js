dojo.require("dijit.dijit");
dojo.require("dojo.parser");
dojo.require("dijit/layout/BorderContainer");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojox.image.Lightbox");
dojo.require("dojox.layout.FloatingPane");
dojo.require("esri.map");
dojo.require("esri.layers.WebTiledLayer");

//show map on load 
dojo.addOnLoad(init);
var resizeTimer;
var map;
var graphicsLayerClients;
var symbolClient;
var graphicsLayerHighlightClients;
var symbolHighlightClient;
var mapboxSatLayer;

function init() {
    dojo.parser.parse();
    //var initExtent = new esri.geometry.Extent({"xmin":-31663334,"ymin":12826678,"xmax":-31641684,"ymax":12840018,"spatialReference":{"wkid":102100}});
	//var initExtent = new esri.geometry.Extent({"xmin":-13632559,"ymin":6046000,"xmax":-13625603,"ymax":6050000,"spatialReference":{"wkid":102100}});
	//var initExtent = new esri.geometry.Extent({"xmin":-8599350,"ymin":4690700,"xmax":-8565600,"ymax":4719900,"spatialReference":{"wkid":102100}});
	//var initExtent = new esri.geometry.Extent({"xmin":-8577230,"ymin":4705450,"xmax":-8575900,"ymax":4706200,"spatialReference":{"wkid":102100}});
    //map = new esri.Map("mapDiv",{extent:initExtent});

	map = new esri.Map("mapDiv", { logo:false,
    fadeOnZoom:true,
    navigationMode:'css-transforms' });

	map.spatialReference = new esri.SpatialReference({wkid:102100});
	dojo.connect(map, 'onLoad', initFunctionality);
	
    //var url = "http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer";
	var streetMapURL = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer";
    var topoURL = "http://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer";
    var worldTopoURl = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer";
	var canvasBasemapURL = "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer";
	var canvasReferenceURL = "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer";
	var dcRecMapURL ="http://maps.dcgis.dc.gov/DCGIS/rest/services/DCGIS_DATA/Recreation_WebMercator/MapServer";
	var dcAnnoMapURL = "http://maps.dcgis.dc.gov/DCGIS/rest/services/DCGIS_DATA/Annotation_WebMercator/MapServer";
	var dcBaseMapURL = "http://maps.dcgis.dc.gov/DCGIS/rest/services/DCGIS_DATA/DC_Basemap/MapServer";
	var imageryMapboxUrl = "http://{subdomain}.tiles.mapbox.com/v3/brightrain.map-bpwe9yas/{level}/{col}/{row}.png";
	
	try {
	var tiledLayer = new esri.layers.ArcGISTiledMapServiceLayer(canvasBasemapURL);
    map.addLayer(tiledLayer);
	
	//The layer is being added but no tiles...
	//http://{subdomain}.tiles.mapbox.com/v3/kennethfield.map-b34d0wdj/{level}/{col}/{row}.png
	//sub domains a, b, c, d
	//mapboxSatLayer = new esri.layers.WebTiledLayer(imageryMapboxUrl, { "subDomains": ["a","b","c","d"] });
	//mapboxSatLayer = new esri.layers.WebTiledLayer(imageryMapboxUrl);
	//map.addLayer(mapboxSatLayer);
	
	var canvasReferenceLyr = new esri.layers.ArcGISTiledMapServiceLayer(canvasReferenceURL);
	map.addLayer(canvasReferenceLyr);
	
	//var dcRecMapLyr = new esri.layers.ArcGISDynamicMapServiceLayer(dcRecMapURL,{"opacity":0.5});
	//map.addLayer(dcRecMapLyr);
	
	//var topoLayer = new esri.layers.ArcGISTiledMapServiceLayer(topoURL,{"opacity":0.3});
	//map.addLayer(topoLayer);
	
	dojo.connect(window, 'resize', 'resizeMap');
	
	//Hide the div that we display while loading the page.
    hideLoader();
	}
	catch(e) {
		var x = e;
	}
	
}

function initFunctionality(){
	resizeMap();
	map.hideZoomSlider();
	map.showPanArrows();
	thePoint = new esri.geometry.Point(-8587230, 4715450, map.spatialReference);
	map.centerAndZoom(thePoint, 4);

    symbolClient = new esri.symbol.PictureMarkerSymbol('images/brsSuns2.png', 20, 20);
    graphicsLayerClients = new esri.layers.GraphicsLayer();
    var rendererClients = new esri.renderer.SimpleRenderer(symbolClient);
    graphicsLayerClients.setRenderer(rendererClients);
    map.addLayer(graphicsLayerClients);
	
	AddClientGraphics();
	
	symbolHighlightClient = new esri.symbol.PictureMarkerSymbol('images/brsSuns1.png', 40, 40);
    graphicsLayerHighlightClients = new esri.layers.GraphicsLayer();
    var rendererHighlightClients = new esri.renderer.SimpleRenderer(symbolHighlightClient);
    graphicsLayerHighlightClients.setRenderer(rendererHighlightClients);
    map.addLayer(graphicsLayerHighlightClients);
	
	//Now listen for a mouse hover over one of the parking facility graphics
    dojo.connect(graphicsLayerClients, "onMouseOver", clientGraphicHover);
    dojo.connect(graphicsLayerClients, "onMouseOut", clientGraphicMouseOut);
	dojo.connect(graphicsLayerClients, "onClick", clientGraphicClick);
	
	//Change the extent of the map when a user changes tabs
	dojo.subscribe("centerContainer-selectChild", tabChild);

	//populate latest three feeds in the blogs tab
	
	/* This no workie, I think no matter what I try it's cross domain problems...
	***Try the google feeds api...
	google.load("feeds", "1");
	var feed = new google.feeds.Feed("http://blog.brightrain.com");
	feed.setResultFormat(google.feeds.Feed.XML_FORMAT);
	feed.load(function(result) {
	if (!result.error) {
		var feedContainer = dojo.byId("brsBlogEntries");
		for (var i = 0; i < result.feed.entries.length; i++) {
			var entry = result.feed.entries[i];
			var div = document.createElement("div");
			div.appendChild(document.createTextNode(entry.title));
			feedContainer.appendChild(div);
		}
	}
	});
	*/
}

function AddClientGraphics() {
	var ptDenver = new esri.geometry.Point(-11686902, 4827811, map.spatialReference)
	graphicsLayerClients.add(new esri.Graphic(ptDenver));
	
	var ptSeattle = new esri.geometry.Point(-13617706, 6041407, map.spatialReference)
	graphicsLayerClients.add(new esri.Graphic(ptSeattle));
	
	//landover, md
	var ptLandover = new esri.geometry.Point(-8557000, 4714355, map.spatialReference)
	graphicsLayerClients.add(new esri.Graphic(ptLandover));
	
	//albuquerque
	var ptAlbuquerque = new esri.geometry.Point(-11868451, 4182705, map.spatialReference)
	graphicsLayerClients.add(new esri.Graphic(ptAlbuquerque));
	
	//chicago
	var ptChicago = new esri.geometry.Point(-9806868, 5114585, map.spatialReference)
	graphicsLayerClients.add(new esri.Graphic(ptChicago));
	
	//kirkland, wa
	var ptKland = new esri.geometry.Point(-13600524, 6053733, map.spatialReference)
	graphicsLayerClients.add(new esri.Graphic(ptKland));
		
	//sedro-woolley, wa
	var ptSedro = new esri.geometry.Point(-13607520, 6191540, map.spatialReference)
	graphicsLayerClients.add(new esri.Graphic(ptSedro));
		
	//broomfield, co
	var ptBfield = new esri.geometry.Point(-11695506, 4859445, map.spatialReference)
	graphicsLayerClients.add(new esri.Graphic(ptBfield));
	
	//vienna, va
	var ptDC = new esri.geometry.Point(-8597952, 4710785, map.spatialReference)
	graphicsLayerClients.add(new esri.Graphic(ptDC));
		
	//nyc
	var ptNYC = new esri.geometry.Point(-8216918, 4968370, map.spatialReference)
	graphicsLayerClients.add(new esri.Graphic(ptNYC));
	
	//boggess wallingford
	var ptWally = new esri.geometry.Point(-13618133, 6050694, map.spatialReference)
	graphicsLayerClients.add(new esri.Graphic(ptWally));
	
	//graphical data gig harbor
	var ptGigHarbor = new esri.geometry.Point(-13645653, 5996026, map.spatialReference)
	graphicsLayerClients.add(new esri.Graphic(ptGigHarbor));
	
	//mt baker snoq national forest
	var ptMtBakerSnoqNF = new esri.geometry.Point(-13515483, 6009965, map.spatialReference)
	graphicsLayerClients.add(new esri.Graphic(ptMtBakerSnoqNF));
}

function clientGraphicHover(evt) {
    //We could add text or image here to indicate the name as well.
    graphicsLayerHighlightClients.add(evt.graphic);
    map.setMapCursor("pointer");
}

function clientGraphicMouseOut(evt) {
    map.setMapCursor("default");
	graphicsLayerHighlightClients.clear();
	graphicsLayerClients.add(new esri.Graphic(evt.graphic));
}

function clientGraphicClick(evt){
	var clientGraphic = evt.graphic;
}

function tabChild(childTab){
	var thePoint;
	if (childTab.title == "Bio"){
		thePoint = new esri.geometry.Point(-8578275, 4705330, map.spatialReference);
		map.centerAndZoom(thePoint, 14);
		//dojo.style("header", "height", "600px")
	}else if (childTab.title == "Clients") {
		thePoint = new esri.geometry.Point(-8587230, 4715450, map.spatialReference);
		map.centerAndZoom(thePoint, 4);
	}else if (childTab.title == "Projects") {
		thePoint = new esri.geometry.Point(-13618975, 6041570, map.spatialReference);
		map.centerAndZoom(thePoint,15);
	}else if (childTab.title == "Bright Rain Solutions") {
		thePoint = new esri.geometry.Point(-8577230, 4705450, map.spatialReference);
		map.centerAndZoom(thePoint,14);
	}
}

//Handle resize of browser
function resizeMap() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        map.resize();
        map.reposition();
    }, 800);
}

//This is called after the page is loaded\dojo parsed to turn off the display of our spinning wait dialog.
var hideLoader = function() {
    dojo.style("preloader", "display", "none");
}