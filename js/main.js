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
    $map.style.display = 'block';
    $dropdownContainer.style.display = 'none';
  }
}

$dropdownContainer.addEventListener('click', function (event) {
  if (event.target.tagName === 'I' && event.target.closest('DIV').id === 'geocode-menu') {
    if ($geocodeForm.style.display === 'block') {
      $geocodeForm.style.display = 'none';
    } else {
      $geocodeForm.style.display = 'block';
      $reverseGeocodeForm.style.display = 'none';
    }
  } else if (event.target.tagName === 'I' && event.target.closest('DIV').id === 'reverse-geocode-menu') {
    if ($reverseGeocodeForm.style.display === 'block') {
      $reverseGeocodeForm.style.display = 'none';
    } else {
      $reverseGeocodeForm.style.display = 'block';
      $geocodeForm.style.display = 'none';
    }
  } else if (event.target.tagName === 'I' && event.target.closest('DIV').id === 'directions-menu') {
    if (window.getComputedStyle($getDirectionsForm).display === 'block') {
      $getDirectionsForm.style.display = 'none';
    } else {
      $getDirectionsForm.style.display = 'block';
    }
  }
});

$dropdownContainerDesktop.addEventListener('click', function (event) {
  if (event.target.tagName === 'I' && event.target.closest('DIV').id === 'reverse-geocode-menu-desktop') {
    if ($reverseGeocodeDesktopForm.style.display === 'block') {
      $reverseGeocodeDesktopForm.style.display = 'none';
    } else {
      $reverseGeocodeDesktopForm.style.display = 'block';
    }
  } else if (event.target.tagName === 'I' && event.target.closest('DIV').id === 'directions-menu-desktop') {
    if (window.getComputedStyle($getDirectionsFormDesktop).display === 'block') {
      $getDirectionsFormDesktop.style.display = 'none';
    } else {
      $getDirectionsFormDesktop.style.display = 'block';
    }
  }
});

function createPopupContent(geojsonFeature, elevation) {
  var popupDiv = document.createElement('div');
  popupDiv.setAttribute('class', 'popup-div');
  var address = document.createElement('p');
  address.textContent = 'Address: ' + geojsonFeature.properties.label;
  popupDiv.appendChild(address);
  var latitude = document.createElement('p');
  latitude.textContent = 'Latitude: ' + geojsonFeature.geometry.coordinates[1];
  popupDiv.appendChild(latitude);
  var longitude = document.createElement('p');
  longitude.textContent = 'Longitude: ' + geojsonFeature.geometry.coordinates[0];
  popupDiv.appendChild(longitude);
  var elevationData = document.createElement('p');
  elevationData.textContent = 'Elevation: ' + elevation.geometry.coordinates[2] + ' meters';
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
  if (event.target.id === 'geocode-map-form') {
    submittedAddress = $geocodeDesktopForm.elements.address.value;
  } else {
    submittedAddress = $geocodeForm.elements.address.value;
  }
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf62489e44bfb8d57d4a17b815aa9f855e19da&text=' + submittedAddress
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', () => {
    markupLayer.clearLayers();
    markupLayer.unbindPopup();
    var geojsonFeature = xhr.response.features[0];
    markupLayer.addData(geojsonFeature);
    var xhrElevation = new XMLHttpRequest();
    xhrElevation.open(
      'GET',
      'https://api.openrouteservice.org/elevation/point?api_key=5b3ce3597851110001cf62489e44bfb8d57d4a17b815aa9f855e19da&geometry=' + geojsonFeature.geometry.coordinates[0] + ',' + geojsonFeature.geometry.coordinates[1]
    );
    xhrElevation.responseType = 'json';
    xhrElevation.addEventListener('load', function () {
      var elevation = xhrElevation.response;
      markupLayer.bindPopup(createPopupContent(geojsonFeature, elevation));
      if (event.target.id !== 'geocode-map-form') {
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
}

function getReverseGeocode(event) {
  var submittedLatLng = [];
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
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'https://api.openrouteservice.org/geocode/reverse?api_key=5b3ce3597851110001cf62489e44bfb8d57d4a17b815aa9f855e19da&point.lat=' + submittedLatLng[0] + '&point.lon=' + submittedLatLng[1]
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    markupLayer.clearLayers();
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
}

function getBestRoute(event, geojsonFeature) {
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
  document.querySelector('#start').textContent = geojsonFeature.label;
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
