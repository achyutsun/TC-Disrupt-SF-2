$(document).ready(function () {
    $("#viewDiv").height(500);

    require([
        "esri/Map",
        "esri/views/SceneView",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/layers/SceneLayer",
        "esri/renderers/SimpleRenderer",
        "esri/symbols/MeshSymbol3D",
        "esri/symbols/FillSymbol3DLayer",
        "esri/widgets/Popup",
        "esri/PopupTemplate",
        "dojo/domReady!"
    ], function (Map, SceneView, Graphic, Point, SimpleMarkerSymbol, SceneLayer, SimpleRenderer, MeshSymbol3D, FillSymbol3DLayer, PopupTemplate) {
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
            color: [51, 153, 255, 1],
            style: "square",
            width: 1000,
            outline: {
                color: [51, 153, 255, 0.8],
                width: 1000
            }
        });
        var homePointGraphic = new Graphic({
            geometry: homePoint,
            symbol: homeMarkerSymbol
        });
        var earthquakeMarkerSymbol = new SimpleMarkerSymbol({
            color: [0, 153, 76, 0.5],
            width: 1000,
            outline: {
                color: [0, 153, 76, 0.5],
                width: 1000
            }
        });
        var landslideMarkerSymbol = new SimpleMarkerSymbol({
                color: [255, 102, 102, 0.5],
                width: 1000,
                outline: {
                    color: [255, 102, 102, 0.5],
                    width: 1000
                }
            })
        ;
        var hurricaneMarkerSymbol = new SimpleMarkerSymbol({
            color: [153, 0, 0, 0.5],
            width: 1000,
            outline: {
                color: [153, 0, 0, 0.5],
                width: 1000
            }
        });
        var fireMarkerSymbol = new SimpleMarkerSymbol({
            color: [255, 0, 0, 0.5],
            width: 1000,
            outline: {
                color: [255, 0, 0, 0.5],
                width: 1000
            }
        });
        var floodMarkerSymbol = new SimpleMarkerSymbol({
            color: [0, 0, 205, 0.5],
            width: 1000,
            outline: {
                color: [0, 0, 205, 0.5],
                width: 1000
            }
        });
        var tempData = [];
        var homePointGraphic = new Graphic({
            geometry: homePoint,
            symbol: homeMarkerSymbol
        });

        function updateMovement(movements, i) {
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
                width: 1000,
                outline: {
                    color: [51, 153, 255, 0.8],
                    width: 1000
                }
            });

            hpG = new Graphic({
                geometry: homePoint,
                symbol: homeMarkerSymbol
            });
            view.graphics.add(hpG);
            homePointGraphic = hpG;
        }

        function updateData() {
            var haveChange = false;
            $.get("https://uyzhap3720.execute-api.us-west-1.amazonaws.com/qa/sc/v1/getAllRequests", function (data) {
                if (tempData.length != data.body.length) {
                    haveChange = true;
                }
                if (haveChange) {
                    if (!isFirstCall) {
                        var movements = [
                            [37.775728, -122.387356],
                            [37.776365, -122.389945],
                            [37.781322, -122.395814],
                            [37.783199, -122.393661],
                            [37.785803, -122.397047],
                            [37.787065, -122.398644],
                            [37.789424, -122.401143],
                        ];

                        for (i in movements) {
                            setTimeout(updateMovement(movements, i), 10000);
                        }

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
                                title: 'Case: ' + value.type,
                                content: "Contact number: +" + value.phone,
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
        }, 10000);
    });

});

