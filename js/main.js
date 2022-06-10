// eslint-disable-next-line no-undef
const map = L.map('map').setView([33.694975, -117.743969], 13);
// eslint-disable-next-line no-undef
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);
// eslint-disable-next-line no-undef
const markupLayer = L.geoJSON().addTo(map);

var $barContainer = document.querySelector('.bar-container');

var $map = document.querySelector('#map');

$barContainer.addEventListener('click', function () {
  if ($map.style.display !== 'none') {
    $map.style.display = 'none';
    $dropdownContainer.style.display = 'block';
  } else {
    $map.style.display = 'block';
    $dropdownContainer.style.display = 'none';
  }
});

var $dropdownContainer = document.querySelector('.dropdown-container');

var geocodeForm = document.forms[0];

var reverseGeocodeForm = document.forms[1];

$dropdownContainer.addEventListener('click', function (event) {
  if (event.target.tagName === 'I' && event.target.closest('DIV').id === 'geocode-menu') {
    if (geocodeForm.style.display === 'block') {
      geocodeForm.style.display = 'none';
    } else {
      geocodeForm.style.display = 'block';
      reverseGeocodeForm.style.display = 'none';
    }
  } else if (event.target.tagName === 'I' && event.target.closest('DIV').id === 'reverse-geocode-menu') {
    if (reverseGeocodeForm.style.display === 'block') {
      reverseGeocodeForm.style.display = 'none';
    } else {
      reverseGeocodeForm.style.display = 'block';
      geocodeForm.style.display = 'none';
    }
  }
});

geocodeForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf62489e44bfb8d57d4a17b815aa9f855e19da&text=' + geocodeForm.elements.address.value
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', () => {
    var geojsonFeature = xhr.response.features[0].geometry;
    markupLayer.addData(geojsonFeature);
    // eslint-disable-next-line no-undef
    map.panTo(L.latLng(geojsonFeature.coordinates[1], geojsonFeature.coordinates[0]));
    if ($map.style.display === 'none') {
      $map.style.display = 'block';
      $dropdownContainer.style.display = 'none';
    } else {
      $map.style.display = 'none';
      $dropdownContainer.style.display = 'block';
    }
  });
  xhr.send();
});
