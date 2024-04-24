/*
X buzz or flicker when in closeness*5 distance?
X rename carousel anchors by place #pachappa
X fix portal to top of viewport, not page
X carousel hash override - do it ourselves, so we can also detect and do it smoothly and centered?

X rework buzzing, stop when actually there
  - checked preservePortal < 1
TEST above

X TEST after 3m open portal if near - TEST ON SITE
  - closes?? (maybe after 3 persist?)
X TESTED - lengthen to appx 30 checks?
- TEST 30 checks or switch to time, not iterations

- test with system text mag
- max-width images??

- debug audio not turning off

- TEST test portal closing aggressively (fixed with persistance?)
- per-site closeness value

- try preloading imgs with onLoad() ( preloading is already done somehow? Caching?)
- do it when in closeness*5 distance?
- audio preloading ?
- figure out compass orientation - switch to photo-sphere-viewer
*/

let el = document.createElement('div');
document.body.appendChild(el);
el.classList.add("portalDiv");
el.style="position:fixed;z-index:999;left:50%;bottom:50%;";
el.innerHTML = '<div id="portal"><iframe id="portalFrame" src=""></iframe></div>';
el.onclick = function() { portalGrow() };
let portalFrame = document.getElementById('portalFrame');
let portal = document.getElementById('portal');
let audioEl = {};
hidePortal();

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

function toggleLoc() {
  document.querySelectorAll('.loc-site-pic').forEach(function(el) { el.style.display = el.style.display == "block" ? "none" : "block"; });
  document.querySelectorAll('.today-site-pic').forEach(function(el) { el.style.display = el.style.display == "none" ? "block" : "none"; });
}

if (window.location.hash != "") {
  scrollAcross(window.location.hash.split('#')[1]);
} 

let locations = [
  { name: 'Providence Coal Fired Pizza', lat: 41.82129802473228, lng: -71.41502773093613, url: 'viewer.html?url=spheres/truckee.jpg', audio: 'audio/mapogu.m4a'},
  //{ name: 'Providence Coal Fired Pizza', lat: 41.82149997128618, lng: -71.4147083014786, url: 'stereo.html/?embedded&url=spheres/mapogu.jpg', audio: 'https://jywarren.github.io/sfpcrr/audio/mapogu.m4a'},

  { name: 'LOC Adams/Truckee', lat: 38.887752, lng: -77.002705, url: 'viewer.html?url=spheres/truckee.jpg', audio: 'audio/together-shovel.m4a'},
  { name: 'LOC Madison Terrace/Pachappa', lat: 38.887369, lng: -77.005503, url: 'viewer.html?url=spheres/portland.jpg', audio: 'audio/portland.m4a'},
  { name: 'LOC Madison Atrium/Providence', lat: 38.8867524, lng: -77.0047272, url: 'viewer.html?url=spheres/providence.jpg', audio: 'audio/portland.m4a'},
  { name: 'LOC Jefferson Courtyard/Portland', lat: 38.88846874367604, lng: -77.00489686567619, url: 'viewer.html/?url=spheres/portland.jpg', audio: 'audio/portland.m4a'},
  { name: 'LOC Jefferson Lawn/Portland', lat: 38.88781245768495, lng: -77.00477273819244, url: 'viewer.html/?url=spheres/portland.jpg', audio: 'audio/portland.m4a'},
  { name: 'LOC G&M', lat: 38.88695681049907, lng: -77.00469312973286, url: 'viewer.html/?url=spheres/hanford.jpg', audio: 'audio/portland.m4a'},

  { name: 'Providence Empire St. Chinatown', lat: 41.8213485, lng: -71.4156095, url: 'viewer.html?url=spheres/providence.jpg'},
  { name: 'Portland Chinese Vegetable Gardens', lat: 45.520291, lng: -122.692254, url: 'viewer.html?embedded&url=spheres/portland.jpg'},
  { name: 'Pachappa Camp', lat: 33.971627, lng: -117.371908, url: 'viewer.html?url=spheres/pachappa.jpg', audio: 'audio/portland.m4a'},
  { name: 'Pachappa Camp 2', lat: 33.971262, lng: -117.372294, url: 'viewer.html?url=spheres/pachappa.jpg', audio: 'audio/portland.m4a'},
  { name: 'Hanford China Alley', lat: 36.327791409233875, lng: -119.64041287997296, url: 'viewer.html?url=spheres/hanford.jpg', audio: 'audio/together-shovel.mp3'},
  { name: 'Truckee Chinatown', lat: 39.32746622566374, lng: -120.1870212082937, url: 'viewer.html?url=spheres/truckee.jpg', audio: 'audio/together-shovel.mp3'},
  { name: 'Portland Chinese Vegetable Gardens', lat: 45.520269721339204, lng: -122.6921961678906, url: 'viewer.html?url=spheres/portland.jpg', audio: 'audio/portland.m4a'},

  { name: 'Hanford TEST', lat: 34.09576763300175, lng: -118.30430354416602, url: 'viewer.html?url=spheres/hanford.jpg', audio: 'audio/together-shovel.mp3'},
  { name: 'Providence Burrill St. Chinatown', lat: 41.820647, lng: -71.415001, url: 'viewer.html/?url=spheres/providence.jpg'},
  { name: 'Together Shovel', lat: 41.820824, lng: -71.415476, url: 'viewer.html?url=spheres/shovel.jpg', audio: 'audio/together-shovel.mp3'},
  { name: 'Statue of Confucius', lat: 25.027136, lng: 121.528874, url: 'viewer.html?url=spheres/portland.jpg', audio: 'audio/portland.m4a'},
];

function showPortal(src) {
  if (portalFrame.src != src) portalFrame.src = src;
  portalOpen = true;
  el.style.left = '10%';
  el.style.bottom = '10%';
  portal.style.width = '80vw';
  portal.style.height = '80vw';
  portal.style['border-radius'] = '1000px';
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
  if (audioEl.src) {
    audioEl.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    audioEl.play();
  }
}
function hidePortal() {
  el.style.left = '50%';
  el.style.bottom = '50%';
  portal.style['border-radius'] = '1000px';
  portal.style.width = 0;
  portal.style.height = 0;
  portal.style['pointer-events'] = 'none';
  portalFrame.style['width'] = '130vw';
  portalFrame.style['height'] = '130vw';
  if (audioEl.hasOwnProperty(stop)) {
    audioEl.stop();
  } else { console.log('couldnt stop audio'); }
}
function loadAudio(src) {
  audioEl = new Audio(src);
  /*audioEl.addEventListener("canplaythrough", (event) => {
    audioEl.play(); // doesn't work because it requires user interaction before audio is allowed
  });*/
}

function testPortal() {
  showPortal('viewer.html?url=spheres/providence.jpg');
  window.navigator.vibrate([50,50,50]);
  preservePortal = 3; // leave portal open for 3 cycles
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
              showPortal(loc.url); // just open if it's been more that 60 checks
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
              showPortal(loc.url);
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
        hidePortal();
        portalOpen = false;
      }
    },
    () => {
      console.log("There was an error geocoding.");
    },
    {
      enableHighAccuracy: true
    }
  );
} else {
  // Browser doesn't support Geolocation
  console.log("Error: Your browser doesn't support geolocation.");
}

