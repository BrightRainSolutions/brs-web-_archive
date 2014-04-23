dojo.require("esri.map");
dojo.require("esri.layers.WebTiledLayer");
dojo.require("esri.symbols.PictureMarkerSymbol");
dojo.require("esri.renderers.SimpleRenderer");
dojo.require("esri.graphic");
dojo.addOnLoad(fireup);
function fireup() {
    //setup our app ui when the doc is ready
    $(document).ready(brs.init());
}
var brs = {
	config: { 
		canvasBasemapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer",
		canvasReferenceURL: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer"
	},
	map: {},
	graphicsLayerClients: {},
	graphicsLayerHighlightClients: {},
	symbolClient: {},
	symbolHighlightClient: {},
	init: function() {
		//ToDo: auto load blog posts
		try
		{
			this.map = new esri.Map("map", {
					basemap: "gray",
					center: [-70, 42],
					zoom: 4,
					slider: false,
					//sliderStyle: "small",
					//sliderOrientation: "horizontal",
					//sliderPosition: "bottom-left",
					logo: false
				});
			dojo.connect(brs.map, "onLoad", function () {
				brs.map.spatialReference = new esri.SpatialReference({ wkid: 102100 });
				//Some of the api stuff might be outdated in the new 3.9
				brs.initFunctionality();
			});
            $('.brs-tabs a').click(function (e) {
              e.preventDefault();
              $(this).tab('show');
            })
			//Hide the div that we display while loading the page.
			$("#preloader").hide();
			return true;
		}
		catch(e)
		{
			return false;
		}
	},
	initFunctionality: function() {
		try
		{
		/**/
		brs.symbolClient = new esri.symbol.PictureMarkerSymbol('images/brsSuns2.png', 20, 20);
		brs.graphicsLayerClients = new esri.layers.GraphicsLayer();
		var rendererClients = new esri.renderer.SimpleRenderer(brs.symbolClient);
		brs.graphicsLayerClients.setRenderer(rendererClients);
		brs.map.addLayer(brs.graphicsLayerClients);
		
		brs.addClientGraphics();
		
		brs.symbolHighlightClient = new esri.symbol.PictureMarkerSymbol('images/brsSuns1.png', 40, 40);
		brs.graphicsLayerHighlightClients = new esri.layers.GraphicsLayer();
		var rendererHighlightClients = new esri.renderer.SimpleRenderer(brs.symbolHighlightClient);
		brs.graphicsLayerHighlightClients.setRenderer(rendererHighlightClients);
		brs.map.addLayer(brs.graphicsLayerHighlightClients);
		
		dojo.connect(brs.graphicsLayerClients, "onMouseOver", brs.clientGraphicHover);
		dojo.connect(brs.graphicsLayerClients, "onMouseOut", brs.clientGraphicMouseOut);
		dojo.connect(brs.graphicsLayerClients, "onClick", brs.clientGraphicClick);
		
		return true;
		}
		catch(e)
		{
			return false;
		}
	},
	addClientGraphics: function() {
		var ptEPA = new esri.geometry.Point(-8575141.8743, 4706234.52, brs.map.spatialReference)
        brs.graphicsLayerClients.add(new esri.Graphic(ptEPA, null, {"Name":"Environmental Protection Agency (EPA)"}));

        var ptERD = new esri.geometry.Point(-8234492.59, 4975607.6621, brs.map.spatialReference)
        brs.graphicsLayerClients.add(new esri.Graphic(ptERD, null, {"Name":"Episcopal Relief & Development"}));

        var ptDenver = new esri.geometry.Point(-11686902, 4827811, brs.map.spatialReference)
        brs.graphicsLayerClients.add(new esri.Graphic(ptDenver, null, {"Name":"Your Castle Real Estate"}));

        var ptSeattle = new esri.geometry.Point(-13617706, 6041407, brs.map.spatialReference)
        brs.graphicsLayerClients.add(new esri.Graphic(ptSeattle, null, {"Name":"City of Seattle"}));

        //landover, md
        var ptLandover = new esri.geometry.Point(-8557000, 4714355, brs.map.spatialReference)
        brs.graphicsLayerClients.add(new esri.Graphic(ptLandover, null, {"Name":"Antares Group"}));

        //albuquerque
        var ptAlbuquerque = new esri.geometry.Point(-11868451, 4182705, brs.map.spatialReference)
        brs.graphicsLayerClients.add(new esri.Graphic(ptAlbuquerque, null, {"Name":"Infrastructure Technologies"}));

        //chicago
        var ptChicago = new esri.geometry.Point(-9806868, 5114585, brs.map.spatialReference)
        brs.graphicsLayerClients.add(new esri.Graphic(ptChicago, null, {"Name":"GAD Group"}));

        //kirkland, wa
        var ptKland = new esri.geometry.Point(-13600524, 6053733, brs.map.spatialReference)
        brs.graphicsLayerClients.add(new esri.Graphic(ptKland, null, {"Name":"PACE Engineers"}));

        //sedro-woolley, wa
        var ptSedro = new esri.geometry.Point(-13607520, 6191540, brs.map.spatialReference)
        brs.graphicsLayerClients.add(new esri.Graphic(ptSedro, null, {"Name":"City of Sedro-Woolley, WA"}));

        //broomfield, co
        var ptBfield = new esri.geometry.Point(-11695506, 4859445, brs.map.spatialReference)
        brs.graphicsLayerClients.add(new esri.Graphic(ptBfield, null, {"Name":"Your Castle Real Estate"}));

        //nyc
        var ptNYC = new esri.geometry.Point(-8216918, 4968370, brs.map.spatialReference)
        brs.graphicsLayerClients.add(new esri.Graphic(ptNYC, null, {"Name":"New York City Dept of Corrections"}));

        //graphical data gig harbor
        var ptGigHarbor = new esri.geometry.Point(-13645653, 5996026, brs.map.spatialReference)
        brs.graphicsLayerClients.add(new esri.Graphic(ptGigHarbor, null, {"Name":"Graphical Data"}));

        //mt baker snoq national forest
        var ptMtBakerSnoqNF = new esri.geometry.Point(-13515483, 6009965, brs.map.spatialReference)
        brs.graphicsLayerClients.add(new esri.Graphic(ptMtBakerSnoqNF, null, {"Name":"Mt Baker \ Snoqualmie National Forest"}));
	},
	clientGraphicHover: function(evt) {
		//We could add text or image here to indicate the name as well.
		brs.graphicsLayerHighlightClients.add(evt.graphic);
		brs.map.setMapCursor("pointer");
        dojo.byId("client-info").innerHTML = evt.graphic.attributes.Name;
	},
	clientGraphicMouseOut: function(evt) {
		brs.map.setMapCursor("default");
		brs.graphicsLayerHighlightClients.clear();
		brs.graphicsLayerClients.add(evt.graphic);
        dojo.byId("client-info").innerHTML = "";
	},
	clientGraphicClick: function(evt){
		var clientGraphic = evt.graphic;
	},
	tabChild: function(childTab){
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
}