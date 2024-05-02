/*

X debug audio not turning off

- don't dim orientation alert? above 

- fix portal height
- figure out compass orientation X switch to photo-sphere-viewer
- test with system text magnification?

- try preloading imgs with onLoad() ( preloading is already done somehow? Caching?)
- do it when in closeness*5 distance?
- audio preloading ?
- read volume level and warn? https://stackoverflow.com/questions/62725857/how-to-get-volume-level-using-javascript
*/

let el = document.createElement('div');
document.body.appendChild(el);
el.classList.add("portalDiv");
el.style="position:fixed;z-index:997;left:50%;bottom:50%;";
el.innerHTML = '<div id="portal"><iframe role="alert" autofocus="true" id="portalFrame" src=""></iframe></div>';
el.onclick = function() { portalGrow() };
let portalFrame = document.getElementById('portalFrame');
let portal = document.getElementById('portal');
let audioEl = {};
hidePortal();

let currentPortal = false;
let closeness = 0.0002; // approx 14m in US
let timeLooking = 0, timeLimit = 30;
let count = 0, // delete this, it's debug
    preservePortal = 0, // leave portal open on a timer
    portalOpen = false;

function scrollAcross(id, block) {
  let el = document.getElementById(id);
  block = block || "nearest";
  if (el) el.scrollIntoView({behavior: 'smooth', block: block, inline: 'center'});
}

if (window.location.hash != "") {
  scrollAcross(window.location.hash.split('#')[1]);
} 

let permissionGranted = false;

const requestPermission = () => {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
  }
}
// Call requestPermission first for devicemotion listener working (This will call silently because not being called inside an eventHandler)
requestPermission()

// Listen to motion events and update the position
window.addEventListener('devicemotion', function (e) {
  if (permissionGranted !== true) document.getElementById('portalFrame').src = document.getElementById('portalFrame').src;
  permissionGranted = true;
  document.getElementById('orientation-permission').classList.add('d-none');
}, false);

// After 1s if still no data received from devicemotion event, just show Grant Button to click => Nomaly requestPermission
setTimeout(() => {
  if (!permissionGranted && typeof DeviceMotionEvent.requestPermission === 'function') {
    document.getElementById('orientation-permission').classList.remove('d-none');
    document.getElementById('orientation-permission').addEventListener('click', requestPermission);
  }
}, 1000)

let locations = [
//  { name: 'Providence Coal Fired Pizza', lat: 41.82129802473228, lng: -71.41502773093613, url: 'viewer.html?url=spheres/truckee.jpg', audio: 'audio/truckee-ambient.mp3', narration: 'audio/truckee.mp3', description: "A pinkish light washes over a dusty country town road dotted with pebbles. A wooden porch-fronted brick storefront offers a shady spot to look out over a series of wide, lush green garden plots across the narrow street, a pine-covered hill rising in the distance. Soft clouds and mist mix with the trees and beside and behind the shop, a range of other small wooden buildings are packed together in a tight and lively looking neighborhood, wooden walkways linking storefronts and keeping your feet up out of the dirt."},
  //{ name: 'Providence Coal Fired Pizza', lat: 41.82149997128618, lng: -71.4147083014786, url: 'stereo.html/?embedded&url=spheres/mapogu.jpg', audio: 'https://jywarren.github.io/sfpcrr/audio/mapogu.m4a'},

  { name: 'loc-providence', lat: 38.8867524, lng: -77.0047272, url: 'viewer.html?url=spheres/providence.jpg', audio: 'audio/providence-ambient.mp3', narration: 'audio/providence.mp3', radius: 0.00005, description: "The cobblestones glisten with recent rain as you smell their drying, and warm lights shine from many windows on this narrow city street, filled with two and three story row homes and small houses. At the end of the street, you can see a theater marquee glowing in the distance, and the shadows of taller buildings looming up to block starlight. Light spills out of the doorway of a restaurant – Yick’s – and you get a whiff of a dozen foods you recognize. Down a narrow alley beside the shop, a warm light glows as you see a familiar figure crouch to smoke on the stoop during their break."},
  { name: 'loc-portland', lat: 38.88781245768495, lng: -77.00477273819244, url: 'viewer.html?url=spheres/portland.jpg', audio: 'audio/portland-ambient.mp3', narration: 'audio/portland.mp3', description: "Summer sunlight warms the cool earth in a narrow valley between a tall wooded hillside and a high wood fence with cypress peeking over the top. A creek meanders calmly by, dragonflies darting by, as a gentle breeze brushes the tops of the dense crops planted across the flat bottom of the gulch – melons, beans, radishes and more offering familiar scents. The soil is soft and full of organic matter as you step away from the creek and look towards the small tin-roofed wooden cabins at the base of the slope, dark shadows cast from their porch overhangs, and firewood piled alongside. A larger group of houses stand halfway up the hill, roofs shining with reflected sunlight, and across the narrow valley, a timber bridge reflects in the water of the creek."},
  { name: 'loc-portland-2', lat: 38.88846874367604, lng: -77.00489686567619, url: 'viewer.html?url=spheres/portland.jpg', audio: 'audio/portland-ambient.mp3', narration: 'audio/portland.mp3', description: "Summer sunlight warms the cool earth in a narrow valley between a tall wooded hillside and a high wood fence with cypress peeking over the top. A creek meanders calmly by, dragonflies darting by, as a gentle breeze brushes the tops of the dense crops planted across the flat bottom of the gulch – melons, beans, radishes and more offering familiar scents. The soil is soft and full of organic matter as you step away from the creek and look towards the small tin-roofed wooden cabins at the base of the slope, dark shadows cast from their porch overhangs, and firewood piled alongside. A larger group of houses stand halfway up the hill, roofs shining with reflected sunlight, and across the narrow valley, a timber bridge reflects in the water of the creek."},
  { name: 'loc-hanford', lat: 38.88695681049907, lng: -77.00469312973286, url: 'viewer.html?url=spheres/hanford.jpg', audio: 'audio/hanford-ambient.mp3', narration: 'audio/hanford.mp3', description: "A tight row of brick buildings with tall, second-floor wood balconies lines a narrow dirt street as sunset approaches, interior lights beginning to shine from entryways. People are resting on benches outside a shop as the day ends, the street’s gravel warm from a hot summer’s day, and one man lovingly tinkers with the whitewalled tires of his bicycle. Others sit in the low sunlight on a bench behind a spreading young tree. Above, pigeons coo in the rafters, and beyond, a hint of mist begins to form among the dusty farmland."},
  { name: 'loc-riverside', lat: 38.887369, lng: -77.005503, url: 'viewer.html?url=spheres/pachappa.jpg', audio: 'audio/riverside-ambient.mp3', narration: 'audio/riverside.mp3', description: "The sun hangs low in the sky, lighting up the porches of a row of homes between tall drooping trees, facing the railroad tracks. Large, fragrant pink flowers grow in carefully protected enclosures between the homes, and a few children shout as they play hide and seek between them. A young woman sits on the porch in the dappled light and shades her eyes with her hand as she looks towards the sun dropping towards the hills across the valley, and a small group bicycling home after a day in the citrus fields. In the distance, someone practices trumpet."},
  { name: 'loc-truckee', lat: 38.887752, lng: -77.002705, url: 'viewer.html?url=spheres/truckee.jpg', audio: 'audio/truckee-ambient.mp3', narration: 'audio/truckee.mp3', description: "A pinkish light washes over a dusty country town road dotted with pebbles. A wooden porch-fronted brick storefront offers a shady spot to look out over a series of wide, lush green garden plots across the narrow street, a pine-covered hill rising in the distance. Soft clouds and mist mix with the trees and beside and behind the shop, a range of other small wooden buildings are packed together in a tight and lively looking neighborhood, wooden walkways linking storefronts and keeping your feet up out of the dirt."},

  { name: 'providence', lat: 41.8213485, lng: -71.4156095, url: 'viewer.html?url=spheres/providence.jpg', audio: 'audio/providence-ambient.mp3', narration: 'audio/providence.mp3', description: "The cobblestones glisten with recent rain as you smell their drying, and warm lights shine from many windows on this narrow city street, filled with two and three story row homes and small houses. At the end of the street, you can see a theater marquee glowing in the distance, and the shadows of taller buildings looming up to block starlight. Light spills out of the doorway of a restaurant – Yick’s – and you get a whiff of a dozen foods you recognize. Down a narrow alley beside the shop, a warm light glows as you see a familiar figure crouch to smoke on the stoop during their break."},
  { name: 'portland', lat: 45.520291, lng: -122.692254, url: 'viewer.html?embedded&url=spheres/portland.jpg', audio: 'audio/portland-ambient.mp3', narration: 'audio/portland.mp3', description: "Summer sunlight warms the cool earth in a narrow valley between a tall wooded hillside and a high wood fence with cypress peeking over the top. A creek meanders calmly by, dragonflies darting by, as a gentle breeze brushes the tops of the dense crops planted across the flat bottom of the gulch – melons, beans, radishes and more offering familiar scents. The soil is soft and full of organic matter as you step away from the creek and look towards the small tin-roofed wooden cabins at the base of the slope, dark shadows cast from their porch overhangs, and firewood piled alongside. A larger group of houses stand halfway up the hill, roofs shining with reflected sunlight, and across the narrow valley, a timber bridge reflects in the water of the creek."},
  { name: 'portland-2', lat: 45.520269721339204, lng: -122.6921961678906, url: 'viewer.html?url=spheres/portland.jpg', audio: 'audio/portland-ambient.mp3', narration: 'audio/portland.mp3', description: "Summer sunlight warms the cool earth in a narrow valley between a tall wooded hillside and a high wood fence with cypress peeking over the top. A creek meanders calmly by, dragonflies darting by, as a gentle breeze brushes the tops of the dense crops planted across the flat bottom of the gulch – melons, beans, radishes and more offering familiar scents. The soil is soft and full of organic matter as you step away from the creek and look towards the small tin-roofed wooden cabins at the base of the slope, dark shadows cast from their porch overhangs, and firewood piled alongside. A larger group of houses stand halfway up the hill, roofs shining with reflected sunlight, and across the narrow valley, a timber bridge reflects in the water of the creek."},
  { name: 'riverside', lat: 33.971627, lng: -117.371908, url: 'viewer.html?url=spheres/pachappa.jpg', audio: 'audio/riverside-ambient.mp3', narration: 'audio/riverside.mp3', description: "The sun hangs low in the sky, lighting up the porches of a row of homes between tall drooping trees, facing the railroad tracks. Large, fragrant pink flowers grow in carefully protected enclosures between the homes, and a few children shout as they play hide and seek between them. A young woman sits on the porch in the dappled light and shades her eyes with her hand as she looks towards the sun dropping towards the hills across the valley, and a small group bicycling home after a day in the citrus fields. In the distance, someone practices trumpet."},
  { name: 'riverside-2', lat: 33.971262, lng: -117.372294, url: 'viewer.html?url=spheres/pachappa.jpg', audio: 'audio/riverside-ambient.mp3', narration: 'audio/riverside.mp3', description: "The sun hangs low in the sky, lighting up the porches of a row of homes between tall drooping trees, facing the railroad tracks. Large, fragrant pink flowers grow in carefully protected enclosures between the homes, and a few children shout as they play hide and seek between them. A young woman sits on the porch in the dappled light and shades her eyes with her hand as she looks towards the sun dropping towards the hills across the valley, and a small group bicycling home after a day in the citrus fields. In the distance, someone practices trumpet."},
  { name: 'hanford', lat: 36.327791409233875, lng: -119.64041287997296, url: 'viewer.html?url=spheres/hanford.jpg', audio: 'audio/hanford-ambient.mp3', narration: 'audio/hanford.mp3', description: "A tight row of brick buildings with tall, second-floor wood balconies lines a narrow dirt street as sunset approaches, interior lights beginning to shine from entryways. People are resting on benches outside a shop as the day ends, the street’s gravel warm from a hot summer’s day, and one man lovingly tinkers with the whitewalled tires of his bicycle. Others sit in the low sunlight on a bench behind a spreading young tree. Above, pigeons coo in the rafters, and beyond, a hint of mist begins to form among the dusty farmland."},
  { name: 'truckee', lat: 39.32746622566374, lng: -120.1870212082937, url: 'viewer.html?url=spheres/truckee.jpg', audio: 'audio/truckee-ambient.mp3', narration: 'audio/truckee.mp3', description: "A pinkish light washes over a dusty country town road dotted with pebbles. A wooden porch-fronted brick storefront offers a shady spot to look out over a series of wide, lush green garden plots across the narrow street, a pine-covered hill rising in the distance. Soft clouds and mist mix with the trees and beside and behind the shop, a range of other small wooden buildings are packed together in a tight and lively looking neighborhood, wooden walkways linking storefronts and keeping your feet up out of the dirt."},

  { name: 'burrill', lat: 41.820647, lng: -71.415001, url: 'viewer.html?url=spheres/providence.jpg', audio: 'audio/providence-ambient.mp3'},
  { name: 'pcm', lat: 45.52433723518639, lng: -122.6735075902735, url: 'viewer.html?url=spheres/portland.jpg', audio: 'audio/portland-ambient.mp3', narration: 'audio/portland.mp3', description: "Summer sunlight warms the cool earth in a narrow valley between a tall wooded hillside and a high wood fence with cypress peeking over the top. A creek meanders calmly by, dragonflies darting by, as a gentle breeze brushes the tops of the dense crops planted across the flat bottom of the gulch – melons, beans, radishes and more offering familiar scents. The soil is soft and full of organic matter as you step away from the creek and look towards the small tin-roofed wooden cabins at the base of the slope, dark shadows cast from their porch overhangs, and firewood piled alongside. A larger group of houses stand halfway up the hill, roofs shining with reflected sunlight, and across the narrow valley, a timber bridge reflects in the water of the creek."},
  { name: 'statue', lat: 25.027136, lng: 121.528874, url: 'viewer.html?url=spheres/portland.jpg', audio: 'audio/portland-ambient.mp3', narration: 'audio/portland.mp3'},
  { name: 'rome-square', lat: 25.027419553970663, lng: 121.52940233206643, url: 'viewer.html?url=spheres/truckee.jpg', audio: 'audio/truckee-ambient.mp3', narration: 'audio/truckee.mp3'},
  { name: 'hanford-test', lat: 34.09576763300175, lng: -118.30430354416602, url: 'viewer.html?url=spheres/hanford.jpg', audio: 'audio/hanford-ambient.mp3', narration: 'audio/hanford.mp3', description: "A tight row of brick buildings with tall, second-floor wood balconies lines a narrow dirt street as sunset approaches, interior lights beginning to shine from entryways. People are resting on benches outside a shop as the day ends, the street’s gravel warm from a hot summer’s day, and one man lovingly tinkers with the whitewalled tires of his bicycle. Others sit in the low sunlight on a bench behind a spreading young tree. Above, pigeons coo in the rafters, and beyond, a hint of mist begins to form among the dusty farmland."},
  { name: 'pachappa-test', lat: 33.744774, lng: -118.099632, url: 'viewer.html?url=spheres/pachappa.jpg', audio: 'audio/riverside-ambient.mp3', narration: 'audio/riverside.mp3'},
  { name: 'together-shovel', lat: 41.820824, lng: -71.415476, url: 'viewer.html?url=spheres/shovel.jpg', audio: 'audio/together-shovel.mp3'},
];

let links = {
  'providence': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=41.821381+-71.415611',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=41.821381,-71.415611',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.41.821381,-71.415611',
  },
  'providence-loc': {
    'google': 'https://maps.app.goo.gl/Y9cD3ZjypapB5UE88', 
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=38.88666949255493,-77.00471438765344',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.38.88666949255493,-77.00471438765344',
  },
  'portland': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=45.519276+-122.69190',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=45.519276,-122.69190',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.45.519276,-122.69190',
  },
  'portland-loc': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=38.887837+-77.004790',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=38.887837,-77.004790',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.38.887837,-77.004790',
  },
  'hanford': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=36.32777951506234+-119.64042904288736',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=36.32777951506234,-119.64042904288736',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.36.32777951506234,-119.64042904288736',
  },
  'hanford-loc': {
    'google': 'https://www.google.com/maps/dir/?api=1&destination=The%20Library%20of%20Congress%20-%20Geography%20&%20Map%20Division,%20Madison%20Bldg,%20101%20Independence%20Ave%20SE%20Geography%20and%20Map%20room,%20Washington,%20DC%2020540&travelmode=walking',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=38.886958,-77.004710',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.38.886958,-77.004710',
  },
  'riverside': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=33.97161889590344+-117.37191527142812',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=33.97161889590344,-117.37191527142812',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.33.97161889590344,-117.37191527142812',
  },
  'riverside-loc': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=38.887384+-77.005466',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=38.887384,-77.005466',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.38.887384,-77.005466',
  },
  'truckee': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=39.327468+-120.18702',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=39.327468,-120.18702',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.39.327468,-120.18702',
  },
  'truckee-loc': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=38.887752+-77.002705',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=38.887752,-77.002705',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.38.887752,-77.002705',
  },
}

const siteButtons = document.querySelectorAll(".sites .item .btn-yellow");
siteButtons.forEach(function(siteButton) {
  siteButton.onclick = function(e) {
    e.preventDefault();
    showModal(siteButton.attributes['data-site'].value);
  }
});

function showModal(site) {
  document.getElementById('googleMapLink').href = links[site]['google'];
  document.getElementById('appleMapLink').href = links[site]['apple'];
  document.getElementById('wazeMapLink').href = links[site]['waze'];
  let mapsModal = new bootstrap.Modal(document.getElementById('mapsModal'), {
    keyboard: false
  });
  mapsModal.show();
}

let params = new URLSearchParams(document.location.search);
let testPortalKey = params.get("t");
if (testPortalKey) {
  setTimeout(function() {
    console.log('test portal', testPortalKey);
    let loc = locations.find(function(l) { return l.name === testPortalKey });
    if (loc) {
      showPortal(loc);
      setupPortalBlock(loc);
      preservePortal = 60;
      currentPortal = loc;
      if (loc && loc.audio != audioEl.src) loadAudio(loc.audio); // if there's new audio
    }
  }, 2000);
}

// Providence qr code
if (params.get("vwkqenigs")) {
  setTimeout(function() {
    let loc = locations.find(function(l) { return l.name === 'providence' });
    if (loc) showPortal(loc);
    preservePortal = 100;
    currentPortal = loc;
    if (loc && loc.audio != audioEl.src) loadAudio(loc.audio); // if there's new audio
  }, 2000);
}

function showPortal(site) {
  let src = site.url;
  if (portalFrame.src != src) portalFrame.src = src + "&description=A circular portal opens suddenly on the page. " + site.description;
  portalOpen = true;
  el.style.left = '10%';
  el.style.bottom = '15%';
  portal.style.width = '80vw';
  portal.style.height = '80vw';
  portal.style['border-radius'] = '1000px';
  if (site.hasOwnProperty('description')) document.getElementById('portalFrame').title = site.description;
  if (site.hasOwnProperty('description')) document.getElementById('portalFrame').innerHTML = site.description;
  document.body.classList.add('dim');
  document.getElementById('portal-click').classList.remove('hidden');
  document.getElementById('openPortalButton').onclick = function() { portalGrow() };
  //document.getElementById('openPortalButton').focus();
  document.getElementById('closePortalButton').classList.remove('hidden');
  document.getElementById('narrationButton').style.display = 'block';
  document.getElementById('portalFrame').focus();
  if (audioEl.src) {
    audioEl.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    audioEl.play();
  }
}

function portalGrow(src) {
  el.style.left = 0;
  el.style.bottom = '-5px';
  // refactor as standalone style, add styles for hiding "click to enter"
  portal.style.width = '100vw';
  portal.style.height = '101vh';
  portal.style['border-radius'] = 0;
  document.getElementById('portalFrame').style['pointer-events'] = 'all';
  portalFrame.style['width'] = '100%';
  portalFrame.style['height'] = '100%';
  document.getElementById('portal-click').classList.add('hidden');
  if (currentPortal.hasOwnProperty('narration')) {
    document.getElementById('portal-overlay').classList.remove('hidden');
    document.getElementById('narrationButton').onclick = function(e) {
      readNarration(currentPortal.narration);
    }
    document.getElementById('narrationButton').focus();
  }
  if (audioEl.src) {
    audioEl.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    audioEl.play();
  }
}

function hidePortal() {
  console.log('closing portal');
  el.style.left = '50%';
  el.style.bottom = '50%';
  portal.style['border-radius'] = '1000px';
  portal.style.width = 0;
  portal.style.height = 0;
  document.getElementById('portalFrame').style['pointer-events'] = 'none';
  portalFrame.style['width'] = '130vw';
  portalFrame.style['height'] = '130vw';
  document.body.classList.remove('dim');
  document.getElementById('narrationButton').style.display = 'none';
  document.getElementById('portal-click').classList.add('hidden');
  document.getElementById('closePortalButton').classList.add('hidden');
  if (audioEl.hasOwnProperty('stop')) {
    audioEl.stop();
  } else { console.log('couldnt stop audio'); }
  if (document.getElementById("narrationAudioEl")) document.getElementById("narrationAudioEl").remove();
}

function loadAudio(src) {
  audioEl = new Audio(src);
  audioEl.id = "ambientAudio";
  audioEl.style = "display:none;";
  document.body.append(audioEl);
  /*audioEl.addEventListener("canplaythrough", (event) => {
    audioEl.play(); // doesn't work because it requires user interaction before audio is allowed
  });*/
}

function readNarration(audioUrl) {
  // dim other audio
  console.log('load', audioUrl);
  document.getElementById('narrationButton').style.display = "none";
  let narrationAudioEl = new Audio();
  narrationAudioEl.controls = true;
  narrationAudioEl.autoplay = true;
  narrationAudioEl.id = "narrationAudioEl";
  narrationAudioEl.src = audioUrl;
  document.getElementById('portal-overlay').append(narrationAudioEl);
  narrationAudioEl.addEventListener('ended', function() {
    audioEl.volume = 1;
  }, false);
  console.log('reduce ambient volume', audioEl.volume);
  audioEl.volume = 0.3;
}

let dcToggled = false; // only toggle once
function wereInDc(position) {
  //Box -77.157505,38.824151,-76.929196,38.965237
  let lat = position.coords.latitude, lon = position.coords.longitude;
  console.log('checking if we are in DC', lat, lon);
  if (lat > 38.824151 && lat < 38.965237 && lon > -77.157505 && lon < -76.929196) {
    console.log('we are in DC');
    dcToggled = true;
    toggleLoc();
  }
}

function toggleLoc() {
  console.log('toggle LOC location pics')
  document.querySelectorAll('.loc-site-pic').forEach(function(el) { el.style.display = el.style.display == "block" ? "none" : "block"; });
  document.querySelectorAll('.today-site-pic').forEach(function(el) { el.style.display = el.style.display == "none" ? "block" : "none"; });
}

function setupPortalBlock(loc) {
  // mark site as blocked if close button is clicked
  document.getElementById('closePortalButton').onclick = function() {
    loc.blocked = true; // mark blocked until page refresh
    hidePortal();
    console.log('portal blocked:', loc.name);
  };
}

if (navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
      let foundPortal = false, isNearPortal = false;
      //document.getElementById('lat').innerHTML = position.coords.latitude + ',' + position.coords.longitude + '<br />'+ count;
      count = count + 1;
      // detect if we're closeness*5 near a portal
      locations.forEach(function(loc) {
        if (Math.abs(loc.lat - position.coords.latitude) < closeness * 3) {
          if (Math.abs(loc.lng - position.coords.longitude) < closeness * 3) {
            isNearPortal = true;
            if (portalOpen == false && timeLooking > timeLimit) {
              console.log('just open');
              if (loc.blocked !== true) {
                showPortal(loc); // just open if it's been more that 60 checks
                setupPortalBlock(loc);
              }
              currentPortal = loc;
              preservePortal = 3; // leave portal open for 3 cycles
            }
            //if (loc.audio) loadAudio(loc.audio); // preload audio
          }
        }
      })
      // compare and we should be within ~7m or 0.0001 degrees to match 
      locations.forEach(function(loc) {
        let localCloseness = loc.radius * 2 || closeness;
        if (Math.abs(loc.lat - position.coords.latitude) < localCloseness) {
          if (Math.abs(loc.lng - position.coords.longitude) < localCloseness) {
            if (portalOpen == false) {
              if (loc.blocked !== true) {
                showPortal(loc);
                setupPortalBlock(loc);
              }
              currentPortal = loc;
              if (loc.audio != audioEl.src) loadAudio(loc.audio); // if there's new audio
              preservePortal = 3; // leave portal open for 3 cycles
            }
            foundPortal = true;
          }
        }
      })
      if (isNearPortal && !foundPortal) {
        document.body.classList.add('crt');
        document.getElementById('tiger').classList.add('jitterbug');
        timeLooking += 1;
        console.log('looking...', timeLooking); 
        if (!preservePortal < 1) window.navigator.vibrate([50,50,50]);
      } else {
        document.body.classList.remove('crt');
        document.getElementById('tiger').classList.remove('jitterbug');
        timeLooking = 0; // restart count
      }
      preservePortal = preservePortal - 1;
      if (!foundPortal && preservePortal < 1 && timeLooking < timeLimit) {
        console.log('no longer in portal zone: !foundPortal && preservePortal < 1 && timeLooking < timeLimit');
        hidePortal();
        portalOpen = false;
      }
      if (dcToggled !== true) wereInDc(position); // toggle images to DC images
    }, function(error) {
      if (error.code == error.PERMISSION_DENIED) {
        console.log("Geolocation denied");
        document.getElementById('gps-off').classList.remove('d-none');
      } else {
       console.log("Error: Your browser doesn't support geolocation.");
      }
    },
    { enableHighAccuracy: true }
  );
}
