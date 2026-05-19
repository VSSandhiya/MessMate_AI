
const q = '[out:json][timeout:25];node(around:2000,13.0827,80.2707)["amenity"="restaurant"];out 10;';
fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'data=' + encodeURIComponent(q)
})
.then(r => r.text())
.then(console.log)
.catch(console.error);
