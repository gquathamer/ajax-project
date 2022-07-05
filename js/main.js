// eslint-disable-next-line no-undef
var map = L.map('map').setView([33.694975, -117.743969], 13);
// eslint-disable-next-line no-undef
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);
// eslint-disable-next-line no-undef
var markupLayer = L.geoJSON().addTo(map);
var $barContainer = document.querySelector('.bar-container');
var $map = document.querySelector('#map');
var $dropdownContainer = document.querySelector('.dropdown-container');
var $dropdownContainerDesktop = document.querySelector('.dropdown-container-desktop');
var $reverseGeocodeDesktopForm = document.forms[0];
// eslint-disable-next-line no-unused-vars
var $directionsFormDesktop = document.forms[1];
var $geocodeDesktopForm = document.forms[2];
var $geocodeForm = document.forms[3];
var $reverseGeocodeForm = document.forms[4];
// eslint-disable-next-line no-unused-vars
var $directionsForm = document.forms[5];
var $directionsButtonOnThePopup;
var $getDirectionsMenu = document.querySelector('#directions-menu');
var $getDirectionsForm = document.querySelector('#directions-form');
var $getDirectionsMenuDesktop = document.querySelector('#directions-menu-desktop');
var $getDirectionsFormDesktop = document.querySelector('#directions-form-desktop');
var data = {};

map.addEventListener('click', function (event) {
  getReverseGeocode(event);
});

$barContainer.addEventListener('click', function () {
  toggleFormContainer();
});

function toggleFormContainer() {
  if (window.getComputedStyle($map).display === 'block') {
    $map.style.display = 'none';
    $dropdownContainer.style.display = 'block';
  } else {
    $dropdownContainer.style.display = 'none';
    $map.style.display = 'block';
  }
}

$dropdownContainer.addEventListener('click', function (event) {
  if (event.target.tagName === 'I' && event.target.closest('DIV').id === 'geocode-menu') {
    toggleGeocodeMenu();
  } else if (event.target.tagName === 'I' && event.target.closest('DIV').id === 'reverse-geocode-menu') {
    toggleReverseGeocodeMenu();
  } else if (event.target.tagName === 'I' && event.target.closest('DIV').id === 'directions-menu') {
    toggleDirectionsMenu();
  }
});

function toggleGeocodeMenu() {
  if (window.getComputedStyle($geocodeForm).display === 'block') {
    $geocodeForm.style.display = 'none';
  } else {
    $geocodeForm.style.display = 'block';
    $reverseGeocodeForm.style.display = 'none';
  }
}

function toggleReverseGeocodeMenu() {
  if (window.getComputedStyle($reverseGeocodeForm).display === 'block') {
    $reverseGeocodeForm.style.display = 'none';
  } else {
    $reverseGeocodeForm.style.display = 'block';
    $geocodeForm.style.display = 'none';
  }
}

function toggleDirectionsMenu() {
  if (window.getComputedStyle($getDirectionsForm).display === 'block') {
    $getDirectionsForm.style.display = 'none';
  } else {
    $getDirectionsForm.style.display = 'block';
  }
}

$dropdownContainerDesktop.addEventListener('click', function (event) {
  if (event.target.tagName === 'I' && event.target.closest('DIV').id === 'reverse-geocode-menu-desktop') {
    toggleReverseGeocodeMenuDesktop();
  } else if (event.target.tagName === 'I' && event.target.closest('DIV').id === 'directions-menu-desktop') {
    toggleDirectionsMenuDesktop();
  }
});

function toggleReverseGeocodeMenuDesktop() {
  if (window.getComputedStyle($reverseGeocodeDesktopForm).display === 'block') {
    $reverseGeocodeDesktopForm.style.display = 'none';
  } else {
    $reverseGeocodeDesktopForm.style.display = 'block';
  }
}

function toggleDirectionsMenuDesktop() {
  if (window.getComputedStyle($getDirectionsFormDesktop).display === 'block') {
    $getDirectionsFormDesktop.style.display = 'none';
  } else {
    $getDirectionsFormDesktop.style.display = 'block';
  }
}

function createPopupContent() {
  var popupDiv = document.createElement('div');
  popupDiv.setAttribute('class', 'popup-div');
  var address = document.createElement('p');
  address.textContent = 'Address: ' + data.address;
  popupDiv.appendChild(address);
  var latitude = document.createElement('p');
  latitude.textContent = 'Latitude: ' + data.latitude;
  popupDiv.appendChild(latitude);
  var longitude = document.createElement('p');
  longitude.textContent = 'Longitude: ' + data.longitude;
  popupDiv.appendChild(longitude);
  var elevationData = document.createElement('p');
  elevationData.textContent = 'Elevation: ' + data.elevation + ' meters';
  popupDiv.appendChild(elevationData);
  var buttonDiv = document.createElement('div');
  buttonDiv.setAttribute('class', 'button-div');
  var directionsButton = document.createElement('button');
  directionsButton.setAttribute('id', 'directions-button');
  directionsButton.setAttribute('class', 'popup-button');
  directionsButton.textContent = 'Directions';
  buttonDiv.appendChild(directionsButton);
  var poiButton = document.createElement('button');
  poiButton.setAttribute('id', 'poi-button');
  poiButton.setAttribute('class', 'popup-button');
  poiButton.textContent = 'POI';
  buttonDiv.appendChild(poiButton);
  popupDiv.appendChild(buttonDiv);
  return popupDiv;
}

function getGeocode(event) {
  var submittedAddress;
  data.eventTarget = event.target.id;
  if (event.target.id === 'geocode-desktop-form') {
    submittedAddress = $geocodeDesktopForm.elements.address.value;
  } else {
    submittedAddress = $geocodeForm.elements.address.value;
  }
  getGeocodeAJAXRequest(submittedAddress);
}

function getGeocodeAJAXRequest(submittedAddress) {
  var xhrGeocode = new XMLHttpRequest();
  xhrGeocode.open(
    'GET',
    'https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf62489e44bfb8d57d4a17b815aa9f855e19da&text=' + submittedAddress
  );
  xhrGeocode.responseType = 'json';
  xhrGeocode.addEventListener('load', () => {
    var geocodeResponse = xhrGeocode.response;
    data.latitude = geocodeResponse.features[0].geometry.coordinates[1];
    data.longitude = geocodeResponse.features[0].geometry.coordinates[0];
    data.address = geocodeResponse.features[0].properties.label;
    data.geoJSON = geocodeResponse.features[0];
    getElevationAJAXRequest();
  });
  xhrGeocode.send();
}

function getElevationAJAXRequest() {
  var xhrElevation = new XMLHttpRequest();
  xhrElevation.open(
    'GET',
    'https://api.openrouteservice.org/elevation/point?api_key=5b3ce3597851110001cf62489e44bfb8d57d4a17b815aa9f855e19da&geometry=' + data.longitude + ',' + data.latitude
  );
  xhrElevation.responseType = 'json';
  xhrElevation.addEventListener('load', function () {
    data.elevation = xhrElevation.response.geometry.coordinates[2];
    displayPopupContent();
  });
  xhrElevation.send();
}

function displayPopupContent() {
  markupLayer.clearLayers();
  markupLayer.unbindPopup();
  markupLayer.addData(data.geoJSON);
  markupLayer.bindPopup(createPopupContent());
  if (data.eventTarget === 'geocode-form') {
    toggleFormContainer();
  } else if (data.eventTarget === 'reverse-geocode-form') {
    toggleFormContainer();
  }
  markupLayer.openPopup();
  $directionsButtonOnThePopup = document.querySelector('#directions-button');
  $directionsButtonOnThePopup.addEventListener('click', function (event) {
    getBestRoute();
  });
  map.setView(markupLayer.getLayers()[0]._latlng, 13);
}

function getReverseGeocode(event) {
  var submittedLatLng = [];
  data.eventTarget = event.target.id;
  if (event.target.id === 'reverse-geocode-form-desktop') {
    submittedLatLng.push($reverseGeocodeDesktopForm.elements.latitude.value);
    submittedLatLng.push($reverseGeocodeDesktopForm.elements.longitude.value);
  } else if (event.target.id === 'reverse-geocode-form') {
    submittedLatLng.push($reverseGeocodeForm.elements.latitude.value);
    submittedLatLng.push($reverseGeocodeForm.elements.longitude.value);
  } else {
    submittedLatLng.push(event.latlng.lat);
    submittedLatLng.push(event.latlng.lng);
  }
  getReverseGeocodeAJAXRequest(submittedLatLng);
}

function getReverseGeocodeAJAXRequest(submittedLatLng) {
  var xhrReverseGeocode = new XMLHttpRequest();
  xhrReverseGeocode.open(
    'GET',
    'https://api.openrouteservice.org/geocode/reverse?api_key=5b3ce3597851110001cf62489e44bfb8d57d4a17b815aa9f855e19da&point.lat=' + submittedLatLng[0] + '&point.lon=' + submittedLatLng[1]
  );
  xhrReverseGeocode.responseType = 'json';
  xhrReverseGeocode.addEventListener('load', function () {
    var reverseGeocodeResponse = xhrReverseGeocode.response;
    data.latitude = reverseGeocodeResponse.features[0].geometry.coordinates[1];
    data.longitude = reverseGeocodeResponse.features[0].geometry.coordinates[0];
    data.address = reverseGeocodeResponse.features[0].properties.label;
    data.geoJSON = reverseGeocodeResponse.features[0];
    getElevationAJAXRequest();
  });
  xhrReverseGeocode.send();
}

/* markupLayer.clearLayers();
    markupLayer.unbindPopup();
    var geojsonFeature = xhr.response.features[0];
    markupLayer.addData(geojsonFeature);
    var xhrElevation = new XMLHttpRequest();
    xhrElevation.open(
      'GET',
      'https://api.openrouteservice.org/elevation/point?api_key=5b3ce3597851110001cf62489e44bfb8d57d4a17b815aa9f855e19da&geometry=' + submittedLatLng[1] + ',' + submittedLatLng[0]
    );
    xhrElevation.responseType = 'json';
    xhrElevation.addEventListener('load', function () {
      var elevation = xhrElevation.response;
      markupLayer.bindPopup(createPopupContent(geojsonFeature, elevation));
      if (event.target.id !== 'reverse-geocode-form-desktop' && undefined) {
        if ($map.style.display === 'none') {
          $map.style.display = 'block';
          $dropdownContainer.style.display = 'none';
        } else {
          $map.style.display = 'none';
          $dropdownContainer.style.display = 'block';
        }
      }
      markupLayer.openPopup();
      $directionsButtonOnThePopup = document.querySelector('#directions-button');
      $directionsButtonOnThePopup.addEventListener('click', function (event) {
        getBestRoute(event, geojsonFeature);
      });
      map.setView(markupLayer.getLayers()[0]._latlng, 13);
    });
    xhrElevation.send();
  });
  xhr.send();
} */

function getBestRoute() {
  if (window.getComputedStyle($dropdownContainerDesktop).display === 'block') {
    $getDirectionsMenuDesktop.style.display = 'flex';
    $getDirectionsFormDesktop.style.display = 'block';
  } else {
    if ($map.style.display !== 'none') {
      $map.style.display = 'none';
      $dropdownContainer.style.display = 'block';
    } else {
      $map.style.display = 'block';
      $dropdownContainer.style.display = 'none';
    }
    if ($getDirectionsMenu.style.display !== 'flex') {
      $getDirectionsMenu.style.display = 'flex';
    }
    if ($getDirectionsForm.style.display !== 'flex') {
      $getDirectionsForm.style.display = 'block';
    }
  }
  document.querySelector('#start').placeholder = data.address;
}

$geocodeForm.addEventListener('submit', function (event) {
  event.preventDefault();
  getGeocode(event);
  $geocodeForm.reset();
});

$geocodeDesktopForm.addEventListener('submit', function () {
  event.preventDefault();
  getGeocode(event);
  $geocodeDesktopForm.reset();
});

$reverseGeocodeForm.addEventListener('submit', function (event) {
  event.preventDefault();
  getReverseGeocode(event);
  $reverseGeocodeForm.reset();
});

$reverseGeocodeDesktopForm.addEventListener('submit', function (event) {
  event.preventDefault();
  getReverseGeocode(event);
  $reverseGeocodeDesktopForm.reset();
});
