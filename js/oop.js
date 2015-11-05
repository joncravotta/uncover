var FoursquareRequest = function() {
  this.searchCount = 0;
};

var Handlebars = function() {

};
var DomAction = function(){

};
var VenueLocation = function() {
  var self = this;
  var boxLat = $(self).data("lat");
  var boxLng = $(self).data("lng");
  var boxId = $(self).data("id");
};

var search = new FoursquareRequest();
var template = new Handlebars();
var Dom = new DomAction();
var requestLocation = new VenueLocation();

$(".search").click(function() {
  var where = $('.location').val();
  var what = $('.query').val();
  search.ajaxRequest(where, what);
});
FoursquareRequest.prototype.navbarFixed = function(){
   if (this.searchCount === 1){
     dom.createNavbar();
   }
};
FoursquareRequest.prototype.ajaxRequest = function(where, what) {
  $.ajax({
    url: "https://api.foursquare.com/v2/venues/explore?client_id=SXKR5FJMZN45242ZHFIKTHT3CD3URPED4E2AGEX3W5SFBXNX&client_secret=IHSGUOTBKAK2ZQ3XKEWOY0JOJBZRMGRDT2IOTXZRBQJQO13N&near=" + where + "&query=" + what + "&venuePhotos=1&v=20150927",
    success: function(data) {

    },
    error: function() {
      $(".error").append("oops! We couldn't find what you were looking for.  Try searching again.");
    }
  });
};

Handlebars.prototype.showSearchParameters = function(data) {
  var source = $("#parameters").html();
  var template = Handlebars.compile(source);
  var templateCompiled = template(data.response);
  $('.search-parameters').html(templateCompiled);
};

Handlebars.prototype.showVenues = function(data) {
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

venueLocation.prototype.showMap = function() {
  var map;
  map = new google.maps.Map(document.getElementById(this.boxId), {
    zoom: 14,
    scrollwheel: false,
    center: {
      lat: this.boxLat,
      lng: this.boxLng
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
      lat: this.boxLat,
      lng: this.boxLng
    },
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    map: map,
    title: 'Hello World!'
  });
};

venueLocation.prototype.addBoxCss = function() {
  $('#' + this.boxId).css("height", "250px");
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
