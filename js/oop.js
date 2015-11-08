var FoursquareRequest = function() {
  this.searchCount = 0;
};

var TemplateEngine = function() {};
var DomAction = function() {};
var Heatmap = function() {};
var VenueLocation = function() {};

var search = new FoursquareRequest();
var template = new TemplateEngine();
var dom = new DomAction();
var venueHeatMap = new Heatmap();
var requestLocation = new VenueLocation();

$(".search").click(function() {
  var where = $('.location').val();
  var what = $('.query').val();
  search.ajaxRequest(where, what);
});
$('body').on('click', '.box-map', (function(e) {
  var self = this;
  var boxLat = $(self).data("lat");
  var boxLng = $(self).data("lng");
  var boxId = $(self).data("id");
  $('#' + boxId).css("height", "250px");
  requestLocation.showMap(boxLat, boxLng, boxId);
}));

FoursquareRequest.prototype.navbarFixed = function() {
  if (this.searchCount === 1) {
    dom.createNavbar();
    console.log("first!");
    console.log("inide navbar method: "+this.searchCount);
  }
  else{
    console.log("not first anymore");
  }
};

FoursquareRequest.prototype.ajaxRequest = function(where, what) {
  this.searchCount ++;
  console.log(this.searchCount);
  $.ajax({
    url: "https://api.foursquare.com/v2/venues/explore?client_id=SXKR5FJMZN45242ZHFIKTHT3CD3URPED4E2AGEX3W5SFBXNX&client_secret=IHSGUOTBKAK2ZQ3XKEWOY0JOJBZRMGRDT2IOTXZRBQJQO13N&near=" + where + "&query=" + what + "&venuePhotos=1&v=201501105&limit=50",
    success: function(data) {
      console.log(data);
      console.log("made successful request");
      template.showSearchParameters(data);
      template.showVenues(data);
      venueHeatMap.builHeatMap(data);
    },
    error: function() {
      $(".error").append("oops! We couldn't find what you were looking for.  Try searching again.");
    }
  });
};

TemplateEngine.prototype.showSearchParameters = function(data) {
  var source = $("#parameters").html();
  var template = Handlebars.compile(source);
  var templateCompiled = template(data.response);
  $('.search-parameters').html(templateCompiled);
};

TemplateEngine.prototype.showVenues = function(data) {
  var source = $("#results").html();
  var template = Handlebars.compile(source);
  // Pass our data to the template
  Handlebars.registerHelper('picture', function(data) {
    return data.groups[0].items[0].prefix + "original" + data.groups[0].items[0].suffix;
  });
  var theCompiledHtml = template(data.response.groups[0]);
  // Add the compiled html to the page
  $('.entry').html(theCompiledHtml);
};

DomAction.prototype.createNavbar = function() {
  $(".cta").fadeOut("slow");
  $('.landing').animate({
    "height": "50px"
  }, {
    duration: 4000
  });
  $('.landing').animate({
    backgroundColor: 'blue'
  }, 'fast');
};
//Starting map stuff
VenueLocation.prototype.showMap = function(boxLat, boxLng, boxId) {
  console.log("boxLat: "+ boxLat + " boxId: " + boxId);
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
  google.maps.event.addListenerOnce(map, 'idle', function(){
});

};

Heatmap.prototype.builHeatMap = function (data) {
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
  search.navbarFixed();
};

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
