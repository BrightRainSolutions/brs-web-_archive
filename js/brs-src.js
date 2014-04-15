dojo.require("esri.map");
dojo.require("esri.layers.WebTiledLayer");
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
					center: [-90, 35],
					zoom: 4,
					slider: false,
					//sliderStyle: "small",
					//sliderOrientation: "horizontal",
					//sliderPosition: "bottom-left",
					logo: false
				});
			dojo.connect(brs.map, "onLoad", function () {
				brs.map.spatialReference = new esri.SpatialReference({ wkid: 102100 });
				//Some of the api stuff might be outdated in the new 3.7
				//this.initFunctionality();
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
		/*
		this.symbolClient = new esri.symbol.PictureMarkerSymbol('images/brsSuns2.png', 20, 20);
		this.graphicsLayerClients = new esri.layers.GraphicsLayer();
		var rendererClients = new esri.renderer.SimpleRenderer(symbolClient);
		this.graphicsLayerClients.setRenderer(rendererClients);
		this.map.addLayer(graphicsLayerClients);
		
		this.addClientGraphics();
		
		symbolHighlightClient = new esri.symbol.PictureMarkerSymbol('images/brsSuns1.png', 40, 40);
		graphicsLayerHighlightClients = new esri.layers.GraphicsLayer();
		var rendererHighlightClients = new esri.renderer.SimpleRenderer(symbolHighlightClient);
		graphicsLayerHighlightClients.setRenderer(rendererHighlightClients);
		this.map.addLayer(this.graphicsLayerHighlightClients);
		
		dojo.connect(this.graphicsLayerClients, "onMouseOver", this.clientGraphicHover);
		dojo.connect(this.graphicsLayerClients, "onMouseOut", this.clientGraphicMouseOut);
		dojo.connect(this.graphicsLayerClients, "onClick", this.clientGraphicClick);
		*/
		return true;
		}
		catch(e)
		{
			return false;
		}
	},
	addClientGraphics: function() {
		var ptDenver = new esri.geometry.Point(-80, 40, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptDenver));
		/*
		var ptDenver = new esri.geometry.Point(-11686902, 4827811, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptDenver));
		
		var ptSeattle = new esri.geometry.Point(-13617706, 6041407, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptSeattle));
		
		//landover, md
		var ptLandover = new esri.geometry.Point(-8557000, 4714355, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptLandover));
		
		//albuquerque
		var ptAlbuquerque = new esri.geometry.Point(-11868451, 4182705, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptAlbuquerque));
		
		//chicago
		var ptChicago = new esri.geometry.Point(-9806868, 5114585, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptChicago));
		
		//kirkland, wa
		var ptKland = new esri.geometry.Point(-13600524, 6053733, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptKland));
			
		//sedro-woolley, wa
		var ptSedro = new esri.geometry.Point(-13607520, 6191540, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptSedro));
			
		//broomfield, co
		var ptBfield = new esri.geometry.Point(-11695506, 4859445, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptBfield));
		
		//vienna, va
		var ptDC = new esri.geometry.Point(-8597952, 4710785, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptDC));
			
		//nyc
		var ptNYC = new esri.geometry.Point(-8216918, 4968370, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptNYC));
		
		//boggess wallingford
		var ptWally = new esri.geometry.Point(-13618133, 6050694, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptWally));
		
		//graphical data gig harbor
		var ptGigHarbor = new esri.geometry.Point(-13645653, 5996026, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptGigHarbor));
		
		//mt baker snoq national forest
		var ptMtBakerSnoqNF = new esri.geometry.Point(-13515483, 6009965, map.spatialReference)
		this.graphicsLayerClients.add(new esri.Graphic(ptMtBakerSnoqNF));
		*/
	},
	clientGraphicHover: function(evt) {
		//We could add text or image here to indicate the name as well.
		graphicsLayerHighlightClients.add(evt.graphic);
		map.setMapCursor("pointer");
	},
	clientGraphicMouseOut: function(evt) {
		map.setMapCursor("default");
		graphicsLayerHighlightClients.clear();
		graphicsLayerClients.add(new esri.Graphic(evt.graphic));
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