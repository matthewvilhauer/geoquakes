// define globals
var weekly_quakes_endpoint = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
var $quakesList;
var map;

$(document).on("ready", function() {

  var source = $('#earthquakes-template').html();
  var template = Handlebars.compile(source);

  function getQuakeData() {
    var response = $.ajax({
      method: "GET",
      url: weekly_quakes_endpoint,
      success: onSuccess,
      error: onError
    });
  }
  var geoMarkers = [];

  function onSuccess(data) {

    $("#info").text("");
    var geoQuakes = data.features;

    geoQuakes.forEach(function(quake){

      if(quake.geometry.coordinates) {
        var lng = quake.geometry.coordinates[1];
        var lat = quake.geometry.coordinates[0];
        geoMarkers.push([lng,lat]);
      }
    });

    console.log(geoMarkers);

    // var specificGeoQuake = data.features[0].properties.title;
    // var magnitude = data.features[0].properties.mag;
    // var latitude = data.features[0].geometry.coordinates[0];
    // var longitude = data.features[0].geometry.coordinates[1];
    // var zoom = data.features[0].geometry.coordinates[2];

    var earthquakeHtml = template({
      earthquakes: geoQuakes,
    });

    $("#info").append(earthquakeHtml);

    function initMap(geoQuakes) {

      var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.78, lng: -122.44},
        zoom: 1
      });

      for(i = 0; i < geoMarkers.length; i++) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(geoMarkers[i][0],geoMarkers[i][1]),
          map: map,
          title: "Test Map"
        });
      }
    }

    initMap();
  }

  function onError(xhr, status, errorThrown) {
    alert("Sorry, there was a problem!");
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
  }

  getQuakeData();

});
