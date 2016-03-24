// define globals
var weekly_quakes_endpoint = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
var $quakesList;
var map;
var quakeMagnitude;
var magnitudeNumber;

function timeSince(seconds) {
  var yearsAgo = Math.floor(((new Date() - seconds)/1000) / 31536000);
  var daysAgo = Math.floor((((new Date() - seconds)/1000) % 31536000) / 86400);
  var hoursAgo = Math.floor(((((new Date() - seconds)) % 31536000) % 86400) / 3600);
  var minutesAgo = Math.floor((((((new Date() - seconds)/1000) % 31536000) % 86400) % 3600) / 60);
  var secondsAgo = (((((new Date() - seconds)/1000) % 31536000) % 86400) % 3600) % 60;
  return yearsAgo + " years " +  daysAgo + " days " + hoursAgo + " hours " + minutesAgo + " minutes " + secondsAgo.toFixed(3) + " seconds";
  }

$(document).on("ready", function() {

  var source = $('#earthquakes-template').html();
  var template = Handlebars.compile(source);
  var geoMarkers = [];

  Handlebars.registerHelper('yearsAgo', function(time) {
    var yearsAgo = Math.floor(((new Date() - time)/1000) / 31536000);
    return yearsAgo + ' years';
  });
  Handlebars.registerHelper('daysAgo', function(time) {
    var daysAgo = Math.floor((((new Date() - time)/1000) % 31536000) / 86400);
    return daysAgo + ' days';
  });
  Handlebars.registerHelper('hoursAgo', function(time) {
    var hoursAgo = Math.floor(((((new Date() - time)) % 31536000) % 86400) / 3600);
    return hoursAgo + ' hours';
  });
  Handlebars.registerHelper('minutesAgo', function(time) {
    var minutesAgo = Math.floor((((((new Date() - time)/1000) % 31536000) % 86400) % 3600) / 60);
    return minutesAgo + ' minutes';
  });
  Handlebars.registerHelper('secondsAgo', function(time) {
    var secondsAgo = Math.floor((((((new Date() - time)/1000) % 31536000) % 86400) % 3600) / 60);
    return secondsAgo + ' seconds';
  });

  Handlebars.registerHelper('nameSlicer', function(quakeName) {
    var substringName = quakeName.substring(quakeName.indexOf("of") + 3, quakeName.length);
    // var locationName = offName.substring(4, quakeName.length);
    return substringName;
  });

  function makeRed() {
    $(".magnitude").css("background-color","red");
    console.log($(".magnitude").text());
  }
  function makeOrange() {
    $(".magnitude").text('<h3 class="orangeColor">{{properties.mag}}</h3>');
    console.log($(".magnitude").text());
  }
  function makeYellow() {
    $(".magnitude").text('<h3 class="yellowColor">{{properties.mag}}</h3>');
    console.log($(".magnitude").text());
  }

  function colorPicker(magNumber) {

    if(magNumber >= 6) {
      // console.log("red");
      makeRed();

    } else if(magNumber >= 5) {
      // console.log("orange");
      makeOrange();

    } else if(magNumber <= 5) {
      // console.log("yellow");
      makeYellow();
    }
  }

  function getQuakeData() {
    var response = $.ajax({
      method: "GET",
      url: weekly_quakes_endpoint,
      success: onSuccess,
      error: onError
    });
  }

  function onSuccess(data) {

    $("#info").text("");
    var geoQuakes = data.features;

    geoQuakes.forEach(function(quake){

      magnitudeNumber = parseFloat(quake.properties.mag);
      colorPicker(magnitudeNumber);

      if(quake.geometry.coordinates) {
        var lng = quake.geometry.coordinates[1];
        var lat = quake.geometry.coordinates[0];
        geoMarkers.push([lng,lat]);
      }
    });

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
          title: "Test Map",
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
