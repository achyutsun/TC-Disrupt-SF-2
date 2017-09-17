function startRouting(lat, lon) {
    var homeLongitude = -122.386743;
    var homeLatitude = 37.775643;
    console.log("lat: " + lat);
    console.log("lon: " + lon);

    $("#content-of-routing").css("display", "block");

    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/tasks/RouteTask",
        "esri/tasks/support/RouteParameters",
        "esri/geometry/Point",
        "esri/tasks/support/FeatureSet",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/Color",
        "esri/core/urlUtils",
        "dojo/on",
        "dojo/domReady!"
    ], function(
        Map, MapView, Graphic, GraphicsLayer, RouteTask, RouteParameters, Point,
        FeatureSet, SimpleMarkerSymbol, SimpleLineSymbol, Color, urlUtils, on
    ) {

        // Proxy the route requests to avoid prompt for log in
        urlUtils.addProxyRule({
            urlPrefix: "route.arcgis.com",
            proxyUrl: "/sproxy/"
        });

        // Point the URL to a valid route service
        var routeTask = new RouteTask({
            url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
        });

        // The stops and route result will be stored in this layer
        var routeLyr = new GraphicsLayer();

        // Setup the route parameters
        var routeParams = new RouteParameters({
            stops: new FeatureSet(),
            outSpatialReference: { // autocasts as new SpatialReference()
                wkid: 3857
            }
        });

        // Define the symbology used to display the stops
        var stopSymbol = new SimpleMarkerSymbol({
            style: "cross",
            size: 15,
            outline: { // autocasts as new SimpleLineSymbol()
                width: 4
            }
        });

        // Define the symbology used to display the route
        var routeSymbol = new SimpleLineSymbol({
            color: [0, 0, 255, 0.5],
            width: 5
        });

        var map = new Map({
            basemap: "streets",
            layers: [routeLyr] // Add the route layer to the map
        });
        var view = new MapView({
            container: "content-of-routing", // Reference to the scene div created in step 5
            map: map, // Reference to the map object created before the scene
            center: [homeLongitude, homeLatitude],
            zoom: 12
        });

        // Adds a graphic when the user clicks the map. If 2 or more points exist, route is solved.
        //on(view, "click", addStop);

        function addStop(event) {
            // Add a point at the location of the map click
            var stop = new Graphic({
                geometry: event,//.mapPoint,
                symbol: stopSymbol
            });
            routeLyr.add(stop);

            // Execute the route task if 2 or more stops are input
            routeParams.stops.features.push(stop);
            if (routeParams.stops.features.length >= 2) {
                routeTask.solve(routeParams).then(showRoute);
            }
        }
        var homePoint1 = new Point(
            {
                longitude: homeLongitude,
                latitude: homeLatitude,
                type: "home",
                phone: "6174801331",
                _id: "59bdb75b932893022bd6163b",
                is_help_request: true
            }
        );
        var homePoint2 = new Point(
            {
                longitude: lon,
                latitude: lat,
                type: "home",
                phone: "6174801331",
                _id: "59bdb75b932893022bd6163b",
                is_help_request: true
            }
        );
        addStop(homePoint1);
        addStop(homePoint2);
        console.log(routeParams.stops.features.length);
        routeTask.solve(routeParams).then(showRoute);

        // Adds the solved route to the map as a graphic
        function showRoute(data) {
            var routeResult = data.routeResults[0].route;
            routeResult.symbol = routeSymbol;
            routeLyr.add(routeResult);
        }
    });

}

$(document).ready(function () {
    $("#viewDiv").height(500);

    require([
        "esri/Map",
        "esri/views/SceneView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/tasks/RouteTask",
        "esri/tasks/support/RouteParameters",
        "esri/geometry/Point",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/layers/SceneLayer",
        "esri/renderers/SimpleRenderer",
        "esri/symbols/MeshSymbol3D",
        "esri/symbols/FillSymbol3DLayer",
        "esri/widgets/Popup",
        "esri/PopupTemplate",
        "esri/Color",
        "esri/core/urlUtils",
        "dojo/on",
        "dojo/domReady!"
    ], function (Map, SceneView, Graphic, GraphicsLayer, RouteTask,
                 RouteParameters, Point, SimpleMarkerSymbol, SimpleLineSymbol,
                 SceneLayer, SimpleRenderer, MeshSymbol3D, FillSymbol3DLayer, PopupTemplate,
                 Color, urlUtils, on) {


        var map = new Map({
            basemap: "satellite",
            ground: "world-elevation"
        });
        var view = new SceneView({
            container: "viewDiv",
            map: map
        });
        view.then(function () {
            view.goTo({
                center: [-122.399945, 37.774574],
                tilt: 70,
                zoom: 15
            })
        });

        var timeR = 2000;
        var isFirstCall = true;
        // Add 3D Buildings model
        /*var sceneLayer = new SceneLayer({
            url: "https://sfgis-portal.sfgov.org/srv/rest/services/Hosted/Downtown_textured3D_P2010_bldg/SceneServer/layers/0",
            popupEnabled: false
        });
        map.add(sceneLayer);
        var symbol = new MeshSymbol3D({
            symbolLayers: [new FillSymbol3DLayer()]
        });
        sceneLayer.renderer = new SimpleRenderer({
            symbol: symbol
        });*/
        // Create points
        var homePoint = new Point(
            {
                longitude: -122.386743,
                latitude: 37.775643,
                type: "home",
                phone: "6174801331",
                _id: "59bdb75b932893022bd6163b",
                is_help_request: true
            }
        );
        var homeMarkerSymbol = new SimpleMarkerSymbol({
            color: [0, 0, 0, 1],
            style: "square",
            width: 3000,
            outline: {
                color: [51, 153, 255, 0.8],
                width: 3000
            }
        });
        var homePointGraphic = new Graphic({
            geometry: homePoint,
            symbol: homeMarkerSymbol
        });
        var earthquakeMarkerSymbol = new SimpleMarkerSymbol({
            color: [255, 128, 0, 0.5],
            width: 3000,
            outline: {
                color: [255, 128, 0, 0.5],
                width: 3000
            }
        });
        var landslideMarkerSymbol = new SimpleMarkerSymbol({
                color: [255, 102, 102, 0.5],
                width: 3000,
                outline: {
                    color: [255, 102, 102, 0.5],
                    width: 3000
                }
            })
        ;
        var floodMarkerSymbol = new SimpleMarkerSymbol({
            color: [0, 205, 0, 0.5],
            width: 3000,
            outline: {
                color: [0, 205, 0, 0.5],
                width: 3000
            }
        });
        var fireMarkerSymbol = new SimpleMarkerSymbol({
            color: [255, 0, 0, 0.5],
            width: 3000,
            outline: {
                color: [255, 0, 0, 0.5],
                width: 3000
            }
        });
        var hurricaneMarkerSymbol = new SimpleMarkerSymbol({
            color: [255, 255, 255, 0.5],
            width: 3000,
            outline: {
                color: [255, 255, 225, 0.5],
                width: 3000
            }
        });
        var tempData = [];
        var homePointGraphic = new Graphic({
            geometry: homePoint,
            symbol: homeMarkerSymbol
        });

        function updateData() {
            var haveChange = false;
            $.get("https://uyzhap3720.execute-api.us-west-1.amazonaws.com/qa/sc/v1/getAllRequests", function (data) {
                if (tempData.length != data.body.length) {
                    haveChange = true;
                }
                if (haveChange) {
                    timeR = 60000;
                    if (!isFirstCall) {

                        /*
                        var movements = [
                            [37.775728, -122.387356],
                            [37.776365, -122.389945],
                            [37.781322, -122.395814],
                            [37.783199, -122.393661],
                            [37.785803, -122.397047],
                            [37.787065, -122.398644],
                            [37.789424, -122.401143]
                        ];

                        for (i in movements) {
                            setTimeout(function () {
                                    //view.graphics.remove(homePointGraphic);
                                    var homePoint = new Point(
                                        {
                                            longitude: movements[i][1],
                                            latitude: movements[i][0],
                                            type: "home",
                                            phone: "6174801331",
                                            _id: "59bdb75b932893022bd6163b",
                                            is_help_request: true
                                        }
                                    );
                                    console.log('lat', movements[i][0]);
                                    console.log('lng', movements[i][1]);
                                    var homeMarkerSymbol = new SimpleMarkerSymbol({
                                        color: [51, 153, 255, 1],
                                        style: "square",
                                        width: 3000,
                                        outline: {
                                            color: [51, 153, 255, 0.8],
                                            width: 3000
                                        }
                                    });

                                    hpG = new Graphic({
                                        geometry: homePoint,
                                        symbol: homeMarkerSymbol
                                    });
                                    view.graphics.add(hpG);
                                    homePointGraphic = hpG;
                                }
                                , 30000);
                        }
                        */

                    }
                    isFirstCall = false;
                    view.graphics.removeAll();
                    view.graphics.add(homePointGraphic);
                    $.get("https://uyzhap3720.execute-api.us-west-1.amazonaws.com/qa/sc/v1/getAllRequests", function (data) {
                        tempData = data.body;
                        $.each(tempData, function (index, value) {
                            function setContentInfo(feature) {
                                // create a chart for example
                                var node = domConstruct.create("div", {innerHTML: "Text Element inside an HTML div element."});
                                return node;
                            }

                            var tempPoint = new Point(
                                {
                                    longitude: value.longitude,
                                    latitude: value.latitude,
                                    type: value.type,
                                    phone: value.phone,
                                    _id: value._id,
                                    is_help_request: value.is_help_request
                                }
                            );
                            var tempMarkerSymbol;
                            switch (value.type) {
                                case "fire": {
                                    tempMarkerSymbol = fireMarkerSymbol;
                                    break;
                                }
                                case "landslide": {
                                    tempMarkerSymbol = landslideMarkerSymbol;
                                    break;
                                }
                                case "hurricane": {
                                    tempMarkerSymbol = hurricaneMarkerSymbol;
                                    break;
                                }
                                case "earthquake": {
                                    tempMarkerSymbol = earthquakeMarkerSymbol;
                                    break;
                                }
                                case "flood": {
                                    tempMarkerSymbol = floodMarkerSymbol;
                                    break;
                                }
                            }
                            var routeToHereAction = {
                                title: "Get Routing",
                                id: "route-to-this"
                            };
                            var moveToHereAction = {
                                title: "Send Action",
                                id: "send-to-there"
                            };
                            var tempTemplate = {
                                //title: 'ID: ' + value._id,
                                content: "Contact number: +" + value.phone + "<br>" +
                                "<button class='btn btn-sm btn-success' onclick='startRouting("+value.latitude+", "+value.longitude+")'>Get Routings</button>",
                                actions: [routeToHereAction]
                            };

                            function routeThis() {
                                console.log("longitude: " + value.longitude);
                                console.log("latitude: " + value.latitude);
                            }

                            function moveThere() {
                                console.log("Action 2");
                            }

                            // Event handler that fires each time an action is clicked.
                            view.popup.on("trigger-action", function (event) {
                                // Execute the measureThis() function if the measure-this action is clicked
                                if (event.action.id === "route-to-this") {
                                    routeThis();
                                } else if (event.action.id === "send-to-there") {
                                    moveThere();
                                }
                            });
                            var tempPointGraphic = new Graphic({
                                geometry: tempPoint,
                                symbol: tempMarkerSymbol,
                                popupTemplate: tempTemplate
                            });
                            view.graphics.add(tempPointGraphic);
                            view.popup.features = tempPointGraphic;
                        });
                    });
                }
            });
        }

        updateData();
        setInterval(function () {
            updateData();
        }, timeR);
    });




});

