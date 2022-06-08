// eslint-disable-next-line no-undef
const map = L.map('map').setView([33.694975, -117.743969], 13);
// eslint-disable-next-line no-undef
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

var $barContainer = document.querySelector('.bar-container');

var $map = document.querySelector('#map');

$barContainer.addEventListener('click', function () {
  if ($map.style.display !== 'none') {
    $map.style.display = 'none';
  } else {
    $map.style.display = 'block';
  }
});
