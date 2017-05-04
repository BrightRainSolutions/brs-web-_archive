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
        canvasReferenceURL: "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer",
        blogPostsUrl: "https://public-api.wordpress.com/rest/v1/sites/blog.brightrain.com/posts/?number=8",
        clientData:"https://raw.githubusercontent.com/brightrain/brs-clients/master/brs-clients.geojson"
    },
    map: {},
    clients: {},
    graphicsLayerClients: {},
    graphicsLayerHighlightClients: {},
    symbolClient: {},
    symbolHighlightClient: {},
    init: function() {
        try
        {
            //!!!ToDo: get this going, cors
            //this.populateBlogPosts();
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
                brs.initFunctionality();
            });
            $('.brs-tabs a').click(function (e) {
                e.preventDefault();
                $(this).tab('show');
            });
            $("#about-tab").click(function() {
                brs.ZoomToHQ();
            });
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
            var symbolHQ = new esri.symbol.PictureMarkerSymbol('images/brsSun.png', 23, 23);
            this.map.graphics.add(new esri.Graphic(new esri.geometry.Point(-105.075739, 40.587838, new esri.SpatialReference({ wkid: 4326 })), symbolHQ));

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
    ZoomToHQ: function() {
        try
        {
            this.map.setExtent(new esri.geometry.Extent({
                "xmin":-105.08,
                "ymin":40.5866,
                "xmax":-105.063,
                "ymax":40.5914,
                "spatialReference":new esri.SpatialReference({ wkid: 4326 })
            }),true);
            return true;
        }
        catch(e)
        {
            return false;
        }
    },
    addClientGraphics: function() {
        $.getJSON(brs.config.clientData, function(clientGEOJSON) {
        brs.clients = clientGEOJSON;
            $.each(brs.clients.features, function(index, brsclient) {
            var pt = new esri.geometry.Point(brsclient.geometry.coordinates[0], 
                                             brsclient.geometry.coordinates[1],brs.map.SpatialReference);
            brs.graphicsLayerClients.add(new esri.Graphic(pt, null, {"Name":brsclient.properties.Name}));
        });
        });
    },
    clientGraphicHover: function(evt) {
        brs.graphicsLayerHighlightClients.clear();
        brs.graphicsLayerHighlightClients.add(evt.graphic);
        brs.map.setMapCursor("pointer");
        dojo.byId("client-info").innerHTML = evt.graphic.attributes.Name;
    },
    clientGraphicMouseOut: function(evt) {
        brs.map.setMapCursor("default");
        brs.graphicsLayerHighlightClients.clear();
        dojo.byId("client-info").innerHTML = "";
    },
    clientGraphicClick: function(evt){
        var clientGraphic = evt.graphic;
    },
    populateBlogPosts: function() {
        $.getJSON(brs.config.blogPostsUrl, function(data) {
            $.each(data.posts, function(index, post) {
                var item = "<li>" +
                    "<div class='blog-date'>" + 
                    post.date + "</div>" +
                    "<a href='" + post.URL + "' title='" + post.title + "'>" +
                    "<div class='blog-entry-pane'>" + post.title + "</div>" +
                    "</a>" +
                    "</li>";
                $("#blogList").append(post);
            });
        });   
    }
    /*
    ,
    //ToDo: consider reviving this so the user knows the map is live
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
    */
};