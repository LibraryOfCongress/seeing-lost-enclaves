/*
X buzz or flicker when in closeness*5 distance?
X rename carousel anchors by place #pachappa
X fix portal to top of viewport, not page
X carousel hash override - do it ourselves, so we can also detect and do it smoothly and centered?
X TEST test portal closing aggressively (fixed with persistance?)
X Finish modal
X make stereo icon larger
X make it possible to close the portal

X rework buzzing, stop when actually there
  - checked preservePortal < 1
TEST above

X TEST after 3m open portal if near - TEST ON SITE
  - closes?? (maybe after 3 persist?)
X TESTED - lengthen to appx 30 checks?
- TEST 30 checks or switch to time, not iterations

- fix portal height
- dim audio during narration

- """Warn GPS permission - """"permission priming""""
- SHOW WARNING IF DENIED Ask again if previously denied?"""

- test with system text magnification?
- debug audio not turning off

- per-site closeness value
- try preloading imgs with onLoad() ( preloading is already done somehow? Caching?)
- do it when in closeness*5 distance?
- audio preloading ?
- figure out compass orientation X switch to photo-sphere-viewer

- read volume level and warn? https://stackoverflow.com/questions/62725857/how-to-get-volume-level-using-javascript
*/

let el = document.createElement('div');
document.body.appendChild(el);
el.classList.add("portalDiv");
el.style="position:fixed;z-index:997;left:50%;bottom:50%;";
el.innerHTML = '<div id="portal"><iframe id="portalFrame" src=""></iframe></div>';
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

let locations = [
  { name: 'Providence Coal Fired Pizza', lat: 41.82129802473228, lng: -71.41502773093613, url: 'viewer.html?url=spheres/truckee.jpg', audio: 'audio/mapogu.m4a', narration: 'audio/providence.mp3'},
  //{ name: 'Providence Coal Fired Pizza', lat: 41.82149997128618, lng: -71.4147083014786, url: 'stereo.html/?embedded&url=spheres/mapogu.jpg', audio: 'https://jywarren.github.io/sfpcrr/audio/mapogu.m4a'},

  { name: 'LOC Madison Atrium/Providence', lat: 38.8867524, lng: -77.0047272, url: 'viewer.html?url=spheres/providence.jpg', audio: 'audio/portland.m4a', narration: 'audio/providence.mp3'},
  { name: 'LOC Jefferson Courtyard/Portland', lat: 38.88846874367604, lng: -77.00489686567619, url: 'viewer.html?url=spheres/portland.jpg', audio: 'audio/portland.m4a', narration: 'audio/portland.mp3'},
  { name: 'LOC Jefferson Lawn/Portland', lat: 38.88781245768495, lng: -77.00477273819244, url: 'viewer.html?url=spheres/portland.jpg', audio: 'audio/portland.m4a', narration: 'audio/portland.mp3'},
  { name: 'LOC G&M/Hanford', lat: 38.88695681049907, lng: -77.00469312973286, url: 'viewer.html?url=spheres/hanford.jpg', audio: 'audio/portland.m4a', narration: 'audio/hanford.mp3'},
  { name: 'LOC Madison Terrace/Pachappa', lat: 38.887369, lng: -77.005503, url: 'viewer.html?url=spheres/pachappa.jpg', audio: 'audio/portland.m4a', narration: 'audio/riverside.mp3'},
  { name: 'LOC Adams/Truckee', lat: 38.887752, lng: -77.002705, url: 'viewer.html?url=spheres/truckee.jpg', audio: 'audio/together-shovel.m4a', narration: 'audio/truckee.mp3'},

  { name: 'Providence Empire St. Chinatown', lat: 41.8213485, lng: -71.4156095, url: 'viewer.html?url=spheres/providence.jpg', narration: 'audio/providence.mp3'},
  { name: 'Portland Chinese Vegetable Gardens', lat: 45.520291, lng: -122.692254, url: 'viewer.html?embedded&url=spheres/portland.jpg', narration: 'audio/portland.mp3'},
  { name: 'Portland Chinese Vegetable Gardens', lat: 45.520269721339204, lng: -122.6921961678906, url: 'viewer.html?url=spheres/portland.jpg', audio: 'audio/portland.m4a', narration: 'audio/portland.mp3'},
  { name: 'Pachappa Camp', lat: 33.971627, lng: -117.371908, url: 'viewer.html?url=spheres/pachappa.jpg', audio: 'audio/portland.m4a', narration: 'audio/riverside.mp3'},
  { name: 'Pachappa Camp 2', lat: 33.971262, lng: -117.372294, url: 'viewer.html?url=spheres/pachappa.jpg', audio: 'audio/portland.m4a', narration: 'audio/riverside.mp3'},
  { name: 'Hanford China Alley', lat: 36.327791409233875, lng: -119.64041287997296, url: 'viewer.html?url=spheres/hanford.jpg', audio: 'audio/together-shovel.mp3', narration: 'audio/hanford.mp3'},
  { name: 'Truckee Chinatown', lat: 39.32746622566374, lng: -120.1870212082937, url: 'viewer.html?url=spheres/truckee.jpg', audio: 'audio/together-shovel.mp3', narration: 'audio/truckee.mp3'},

  { name: 'Providence Burrill St. Chinatown', lat: 41.820647, lng: -71.415001, url: 'viewer.html/?url=spheres/providence.jpg', narration: 'audio/providence.mp3'},
  { name: 'Portland Chinatown Museum', lat: 45.52433723518639, lng: -122.6735075902735, url: 'viewer.html?url=spheres/portland.jpg', audio: 'audio/portland.m4a', narration: 'audio/portland.mp3'},
  { name: 'Statue of Confucius', lat: 25.027136, lng: 121.528874, url: 'viewer.html?url=spheres/portland.jpg', audio: 'audio/portland.m4a', narration: 'audio/portland.mp3'},
  { name: 'Rome Square', lat: 25.027419553970663, lng: 121.52940233206643, url: 'viewer.html?url=spheres/truckee.jpg', audio: 'audio/portland.m4a', narration: 'audio/truckee.mp3'},
  { name: 'Hanford TEST', lat: 34.09576763300175, lng: -118.30430354416602, url: 'viewer.html?url=spheres/hanford.jpg', audio: 'audio/together-shovel.mp3'},
  { name: 'Pachappa test', lat: 33.744774, lng: -118.099632, url: 'viewer.html?url=spheres/pachappa.jpg', audio: 'audio/portland.m4a', narration: 'audio/riverside.mp3'},
  { name: 'Together Shovel', lat: 41.820824, lng: -71.415476, url: 'viewer.html?url=spheres/shovel.jpg', audio: 'audio/together-shovel.mp3'},
];

let links = {
  'providence': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=loc:41.821381+-71.415611',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=41.821381,-71.415611',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.41.821381,-71.415611',
  },
  'providence-loc': {
    'google': 'https://maps.app.goo.gl/Gq6Sm6pa1zSfjgSN8', // no way to open navigation yet
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=38.88666949255493,-77.00471438765344',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.38.88666949255493,-77.00471438765344',
  },
  'portland': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=loc:45.519276+-122.69190',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=45.519276,-122.69190',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.45.519276,-122.69190',
  },
  'portland-loc': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=loc:38.887837+-77.004790',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=38.887837,-77.004790',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.38.887837,-77.004790',
  },
  'hanford': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=loc:36.32777951506234+-119.64042904288736',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=36.32777951506234,-119.64042904288736',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.36.32777951506234,-119.64042904288736',
  },
  'hanford-loc': {
    'google': 'https://www.google.com/maps/dir/?api=1&destination=The%20Library%20of%20Congress%20-%20Geography%20&%20Map%20Division,%20Madison%20Bldg,%20101%20Independence%20Ave%20SE%20Geography%20and%20Map%20room,%20Washington,%20DC%2020540&travelmode=walking',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=38.886958,-77.004710',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.38.886958,-77.004710',
  },
  'riverside': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=loc:33.97161889590344+-117.37191527142812',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=33.97161889590344,-117.37191527142812',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.33.97161889590344,-117.37191527142812',
  },
  'riverside-loc': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=loc:38.887384+-77.005466',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=38.887384,-77.005466',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.38.887384,-77.005466',
  },
  'truckee': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=loc:39.327468+-120.18702',
    'apple': 'https://maps.apple.com/?dirflg=w&daddr=39.327468,-120.18702',
    'waze': 'https://www.waze.com/live-map/directions?to=ll.39.327468,-120.18702',
  },
  'truckee-loc': {
    'google': 'https://maps.google.com/maps?dirflg=w&daddr=loc:38.887752+-77.002705',
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

function showPortal(src) {
  if (portalFrame.src != src) portalFrame.src = src;
  portalOpen = true;
  el.style.left = '10%';
  el.style.bottom = '15%';
  portal.style.width = '80vw';
  portal.style.height = '80vw';
  portal.style['border-radius'] = '1000px';
  document.body.classList.add('dim');
  document.getElementById('portal-click').classList.remove('hidden');
  document.getElementById('openPortalButton').onclick = function() { portalGrow() };
  document.getElementById('openPortalButton').focus();
  document.getElementById('closePortalButton').classList.remove('hidden');
  document.getElementById('narrationButton').style.display = 'block';
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
  portal.style['pointer-events'] = 'all';
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
  portal.style['pointer-events'] = 'none';
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
  /*audioEl.addEventListener("canplaythrough", (event) => {
    audioEl.play(); // doesn't work because it requires user interaction before audio is allowed
  });*/
}

function readNarration(audioUrl) {
  // dim other audio
  console.log('play', audioUrl);
  document.getElementById('narrationButton').style.display = "none";
  let narrationAudioEl = new Audio(audioUrl);
  narrationAudioEl.onload = function() {
    narrationAudioEl.play();
  }
  narrationAudioEl.controls = true;
  narrationAudioEl.id = "narrationAudioEl";
  document.getElementById('portal-overlay').append(narrationAudioEl);
  narrationAudioEl.addEventListener('ended', function() {
    audioEl.volume = 1;
  }, false);
  narrationAudioEl.onload = function() {
    narrationAudioEl.play();
    audioEl.volume = 0.2;
  }
}

function testPortal() {
  showPortal('viewer.html?url=spheres/providence.jpg');
  window.navigator.vibrate([50,50,50]);
  preservePortal = 3; // leave portal open for 3 cycles
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
        if (Math.abs(loc.lat - position.coords.latitude) < closeness * 5) {
          if (Math.abs(loc.lng - position.coords.longitude) < closeness * 5) {
            isNearPortal = true;
            if (portalOpen == false && timeLooking > timeLimit) {
              console.log('just open');
              if (loc.blocked !== true) {
                showPortal(loc.url); // just open if it's been more that 60 checks
                setupPortalBlock(loc);
              }
              currentPortal = loc;
              preservePortal = 3; // leave portal open for 3 cycles
            }
            if (loc.audio) loadAudio(loc.audio); // preload audio
          }
        }
      })
      // compare and we should be within ~7m or 0.0001 degrees to match 
      locations.forEach(function(loc) {
        if (Math.abs(loc.lat - position.coords.latitude) < closeness) {
          if (Math.abs(loc.lng - position.coords.longitude) < closeness) {
            if (portalOpen == false) {
              if (loc.blocked !== true) {
                showPortal(loc.url);
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
