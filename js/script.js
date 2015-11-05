// Client ID
// SXKR5FJMZN45242ZHFIKTHT3CD3URPED4E2AGEX3W5SFBXNX
//
// Client Secret
// IHSGUOTBKAK2ZQ3XKEWOY0JOJBZRMGRDT2IOTXZRBQJQO13N
//
// https://api.foursquare.com/v2/venues/search?client_id=SXKR5FJMZN45242ZHFIKTHT3CD3URPED4E2AGEX3W5SFBXNX&client_secret=IHSGUOTBKAK2ZQ3XKEWOY0JOJBZRMGRDT2IOTXZRBQJQO13N&ll=40.7,-74&v=20140920
//Animations
$(window).load(function() {
  initialize();
});
$(".button").one("click", function() {
  $(".cta").fadeOut("slow");
  $('.landing').animate({
    "height": "50px"
  }, {
    duration: 4000
  });
  $('.landing').animate({
    backgroundColor: 'blue'
  }, 'fast');

});

window.addEventListener('scroll', function(evt) {

  // This value is your scroll distance from the top
  var distance_from_top = document.body.scrollTop;

  // The user has scrolled to the tippy top of the page. Set appropriate style.
  if (distance_from_top === 0) {
    $('.landing').removeClass('fixed');
  }

  // The user has scrolled down the page.
  if (distance_from_top > 0) {
    $('.landing').addClass('fixed');
  }

});

function userParams() {
  var location = $('.location').val();
  var query = $('.query').val();
  return getVenues(location, query);
}

function getVenues(location, query) {
  $.ajax({
    url: "https://api.foursquare.com/v2/venues/explore?client_id=SXKR5FJMZN45242ZHFIKTHT3CD3URPED4E2AGEX3W5SFBXNX&client_secret=IHSGUOTBKAK2ZQ3XKEWOY0JOJBZRMGRDT2IOTXZRBQJQO13N&near=" + location + "&query=" + query + "&venuePhotos=1&v=20150927",
    success: function(data) {
      // displayInfo(result);
      displayResults(data);
      displayParameters(data);
      getArr(data);
      getLocationArr(data);
      map(data);
      clearError();
      console.log(data);
    },
    error: function() {
      $(".error").append("oops! We couldn't find what you were looking for.  Try searching again.");
    }
  });
}

function clearError() {
  $(".error").empty();
}

// function getLocationArr(data) {
//   var arr = [];
//   var lat;
//   var lng;
//   for (var x = 0; x < data.response.groups[0].items.length; x++) {
//     lat = data.response.groups[0].items[x].venue.location.lat;
//     lng = data.response.groups[0].items[x].venue.location.lat;
//     var latLng = lat + ", " + lng;
//     arr.push(latLng);
//
//   }
//   console.log(arr);
//
// }

// function getArr(data) {
//   var current;
//   var arr = [];
//   for (var x = 0; x < data.response.groups[0].items.length; x++) {
//     current = data.response.groups[0].items[x].venue.stats.checkinsCount;
//     arr.push(current);
//   }
//   console.log(arr);
//   getMaxOfArr(arr);
// }
//
// function getMaxOfArr(arr) {
//   var max = Math.max.apply(null, arr);
//   console.log("Max Number: " + max);
//   getPercentages(arr, max);
// }
//
// function getPercentages(arr, max) {
//   var current;
//   var finalArr = [];
//   for (var x = 0; x < arr.length; x++) {
//     current = arr[x] / max * 100;
//     finalArr.push(current);
//   }
//   console.log(finalArr);
// }


function displayParameters(data) {
  var source = $("#parameters").html();
  var template = Handlebars.compile(source);
  var templateGeo = template(data.response);
  $('.search-parameters').html(templateGeo);
}

function displayResults(data) {
  console.log(data);
  $(".display").append(data.response.groups[0].items[0].venue.name);
  var source = $("#results").html();
  var template = Handlebars.compile(source);
  // Pass our data to the template
  Handlebars.registerHelper('picture', function(data) {
    return data.groups[0].items[0].prefix + "original" + data.groups[0].items[0].suffix;
  });
  var theCompiledHtml = template(data.response.groups[0]);

  // Add the compiled html to the page
  $('.entry').html(theCompiledHtml);

}

function map(data) {
  initMap(data);

  function initMap(data) {
    var map, heatmap;
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      scrollwheel: false,
      center: {
        lat: data.response.geocode.center.lat,
        lng: data.response.geocode.center.lng
      },
      mapTypeId: google.maps.MapTypeId.MAP,
      styles: [{
        stylers: [{
          hue: "#3274FF",
          saturation: "-20"
        }]
      }, {
        featureType: "road",
        elementType: "geometry",
        stylers: [{
          lightness: 100
        }]
      }, {
        featureType: "road",
        elementType: "labels"
      }]
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
      data: getPoints(data),
      map: map
    });
    heatmap.set('radius', 50);
  }

  function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
  }

  function changeGradient() {
    var gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ];
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
  }

  function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 100);
  }

  function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.7);
  }

  function getPoints(data) {
    var arr = [];
    for (var x = 0; x < data.response.groups[0].items.length; x++) {
      arr.push(new google.maps.LatLng(data.response.groups[0].items[x].venue.location.lat, data.response.groups[0].items[x].venue.location.lng));
    }
    return arr;
  }
}
//individual map for each box on click
$('body').on('click', '.box-map', (function(e) {
  var self = this;
  var boxLat = $(self).data("lat");
  var boxLng = $(self).data("lng");
  var boxId = $(self).data("id");
  showMap(self, boxId, boxLat, boxLng);
}));

function showMap(self, boxId, boxLat, boxLng) {
  $('#' + boxId).css("height", "250px");
  boxMap(self, boxId, boxLat, boxLng);
}

function boxMap(self, boxId, boxLat, boxLng) {
  console.log("in boxmap:" + boxId, boxLat, boxLng);
  initMap(self, boxId, boxLat, boxLng);

  function initMap(self, boxId, boxLat, boxLng) {
    console.log("in map:" + boxId, boxLat, boxLng);
    var map;
    map = new google.maps.Map(document.getElementById(boxId), {
      zoom: 14,
      scrollwheel: false,
      center: {
        lat: boxLat,
        lng: boxLng
      },
      mapTypeId: google.maps.MapTypeId.MAP,
      styles: [{
        stylers: [{
          hue: "#3274FF",
          saturation: "-20"
        }]
      }, {
        featureType: "road",
        elementType: "geometry",
        stylers: [{
          lightness: 100
        }]
      }, {
        featureType: "road",
        elementType: "labels"
      }]
    });
    var marker = new google.maps.Marker({
      position: {
        lat: boxLat,
        lng: boxLng
      },
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      map: map,
      title: 'Hello World!'
    });
  }
}
