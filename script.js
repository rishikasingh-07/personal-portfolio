


var root = document.documentElement;




function isDark() {
  return root.getAttribute('data-theme') === 'dark';
}


(function () {
  var saved = null;

  try {
    saved = localStorage.getItem('theme');
  } catch (err) {
   
  }

  if (!saved) {
    saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  root.setAttribute('data-theme', saved);
})();

function setupThemeButton() {
  var btn = document.getElementById('theme');

  function updateLabel() {
    btn.textContent = isDark() ? 'switch to light' : 'switch to dark';
  }

  updateLabel();

  btn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);

    try {
      localStorage.setItem('theme', next);
    } catch (err) {}

    updateLabel();
  });
}



function setupGuitarKitten() {
  var holder = document.getElementById('gk');
  var hero = document.getElementById('herocat');
  if (!holder || !hero) return;

  var copy = hero.cloneNode(true);
  copy.removeAttribute('id');
  copy.setAttribute('style', '--f: var(--fur3)');
  copy.setAttribute('aria-label', 'Kitten playing guitar');

  var guitar =
    '<path class="st" fill="none" style="stroke-width:6" d="M76 84 L112 48"/>' +
    '<ellipse class="st" style="fill:var(--accent)" cx="68" cy="92" rx="18" ry="14"/>' +
    '<circle class="ink" cx="68" cy="92" r="4.5"/>' +
    '<ellipse class="fur st paw" cx="58" cy="84" rx="6" ry="5"/>' +
    '<text class="note2" x="96" y="34">\u266A</text>' +
    '<text class="note2" x="108" y="22" style="animation-delay:1s">\u266B</text>';

  copy.insertAdjacentHTML('beforeend', guitar);
  holder.appendChild(copy);
}




function setupEyes() {
  var allEyes = document.querySelectorAll('.eyes');

  window.addEventListener('pointermove', function (e) {
    for (var i = 0; i < allEyes.length; i++) {
      var g = allEyes[i];
      var box = g.ownerSVGElement.getBoundingClientRect();

      var dx = e.clientX - (box.left + box.width / 2);
      var dy = e.clientY - (box.top + box.height / 2);
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;


      var move = Math.min(1, dist / 220) * 2.6;

      g.style.transform =
        'translate(' + (dx / dist * move).toFixed(2) + 'px,' + (dy / dist * move).toFixed(2) + 'px)';
    }
  });
}




function setupKittenClicks() {
  var kittens = document.querySelectorAll('.kitw');

  kittens.forEach(function (kit) {
    var lines = kit.getAttribute('data-say').split('|');
    var bubble = kit.querySelector('.bub');
    var count = 0;
    var timer;

    kit.addEventListener('click', function () {
      bubble.textContent = lines[count % lines.length];
      count++;


      kit.classList.remove('hop');
      void kit.offsetWidth;
      kit.classList.add('hop', 'say');

      if (kit.classList.contains('k-loaf')) {
        kit.classList.add('purr');
      }

      clearTimeout(timer);
      timer = setTimeout(function () {
        kit.classList.remove('say', 'purr');
      }, 1800);
    });
  });
}




function setupPawPrints() {
  document.addEventListener('click', function (e) {

    if (e.target.closest('a, button')) return;

    var paw = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    paw.setAttribute('class', 'pawc');
    paw.innerHTML = '<use href="#paw"/>';

    paw.style.left = (e.clientX - 11) + 'px';
    paw.style.top = (e.clientY - 11) + 'px';
    paw.style.rotate = (Math.random() * 50 - 25) + 'deg';

    document.body.appendChild(paw);
    setTimeout(function () {
      paw.remove();
    }, 1400);
  });
}




function setupReveal() {
  var sections = document.querySelectorAll('.rv');

  if (!('IntersectionObserver' in window)) {
    sections.forEach(function (s) { s.classList.add('in'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach(function (s) { observer.observe(s); });
}




var STRING_NOTES = [
  { name: 'E', hz: 82.41 },
  { name: 'A', hz: 110 },
  { name: 'D', hz: 146.83 },
  { name: 'G', hz: 196 },
  { name: 'B', hz: 246.94 },
  { name: 'e', hz: 329.63 }
];

var NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];


function detectPitch(buf, sampleRate) {
  var size = buf.length;
  var energy = 0;
  for (var i = 0; i < size; i++) energy += buf[i] * buf[i];
  if (Math.sqrt(energy / size) < 0.01) return -1;

  var minLag = Math.floor(sampleRate / 500);
  var maxLag = Math.floor(sampleRate / 60);
  var corr = [];
  var best = 0;

  for (var lag = minLag; lag <= maxLag; lag++) {
    var sum = 0;
    for (var k = 0; k < size - maxLag; k++) sum += buf[k] * buf[k + lag];
    corr[lag] = sum;
    if (sum > best) best = sum;
  }


  for (var l = minLag + 1; l < maxLag; l++) {
    var isPeak = corr[l] > corr[l - 1] && corr[l] >= corr[l + 1];
    if (isPeak && corr[l] >= best * 0.9) return sampleRate / l;
  }
  return -1;
}

function setupMusicDemo() {
  var canvas = document.getElementById('wave');
  var hearBox = document.getElementById('hear');
  var steps = document.querySelectorAll('.pipe span');
  var buttons = document.querySelectorAll('.strings button');
  if (!canvas || !hearBox) return;

  var g = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var audio = null;
  var analyser = null;
  var timeData = null;
  var freqData = null;
  var stepTimers = [];
  var lastCheck = 0;
  var width = 0;
  var height = 0;

  function resizeCanvas() {
    var dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

async function startAudio() {
  if (!audio) {
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;

    audio = new AudioCtx();
    analyser = audio.createAnalyser();
    analyser.fftSize = 2048;
    analyser.connect(audio.destination);

    timeData = new Float32Array(analyser.fftSize);
    freqData = new Uint8Array(analyser.frequencyBinCount);
  }

  try {
    if (audio.state !== 'running') {
      await audio.resume();
    }

    return audio.state === 'running';
  } catch (err) {
    console.error('Audio could not start:', err);
    return false;
  }
}


  function pluck(hz) {
    var sr = audio.sampleRate;
    var length = sr * 2;
    var buffer = audio.createBuffer(1, length, sr);
    var data = buffer.getChannelData(0);
    var period = Math.round(sr / hz);

    for (var i = 0; i < period; i++) data[i] = Math.random() * 2 - 1;
    for (var j = period; j < length; j++) {
      data[j] = 0.5 * (data[j - period] + data[j - period + 1]) * 0.998;
    }

    var source = audio.createBufferSource();
    var volume = audio.createGain();
    volume.gain.value = 0.5;
    source.buffer = buffer;
    source.connect(volume);
    volume.connect(analyser);
    source.start();
  }


  function lightPipeline() {
    stepTimers.forEach(clearTimeout);
    stepTimers = [];

    steps.forEach(function (s) { s.classList.remove('on'); });
    steps.forEach(function (s, i) {
      stepTimers.push(setTimeout(function () { s.classList.add('on'); }, i * 350));
    });
    stepTimers.push(setTimeout(function () {
      steps.forEach(function (s) { s.classList.remove('on'); });
    }, 3200));
  }

  function showPitch(freq) {
    var midi = Math.round(12 * Math.log(freq / 440) / Math.LN2) + 69;
    var note = NOTE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1);

    var closest = STRING_NOTES[0];
    STRING_NOTES.forEach(function (s) {
      if (Math.abs(s.hz - freq) < Math.abs(closest.hz - freq)) closest = s;
    });

    hearBox.innerHTML =
      'the model hears: <b>' + note + '</b> · ' + freq.toFixed(1) + ' Hz · closest string: ' + closest.name;
  }

  buttons.forEach(function (btn) {
  btn.addEventListener('click', async function () {
    var ready = await startAudio();

    if (!ready) {
      hearBox.textContent = 'Unable to start audio. Check your browser settings.';
      return;
    }

    pluck(parseFloat(btn.getAttribute('data-hz')));
    lightPipeline();

    btn.classList.add('ring');

    setTimeout(function () {
      btn.classList.remove('ring');
    }, 150);
  });
});

  function draw(t) {
    requestAnimationFrame(draw);

    var style = getComputedStyle(root);
    var accent = style.getPropertyValue('--accent');
    var pink = style.getPropertyValue('--pink');
    var muted = style.getPropertyValue('--muted');

    g.clearRect(0, 0, width, height);

    var loud = false;
    if (analyser) {
      analyser.getFloatTimeDomainData(timeData);
      analyser.getByteFrequencyData(freqData);

      var energy = 0;
      for (var i = 0; i < timeData.length; i++) energy += timeData[i] * timeData[i];
      loud = Math.sqrt(energy / timeData.length) > 0.004;
    }

    if (loud) {
      var bars = 70;
      var barWidth = width / bars;
      g.fillStyle = pink;
      g.globalAlpha = 0.55;
      for (var b = 1; b <= bars; b++) {
        var barHeight = (freqData[b] / 255) * height * 0.95;
        g.fillRect((b - 1) * barWidth + 1, height - barHeight, barWidth - 2, barHeight);
      }
      g.globalAlpha = 1;
    }


    g.beginPath();
    g.lineWidth = 2;
    g.lineJoin = 'round';
    g.strokeStyle = loud ? accent : muted;
    g.globalAlpha = loud ? 1 : 0.6;

    var points = 1024;
    for (var x = 0; x < width; x += 2) {
      var y;
      if (loud) {
        var sample = timeData[Math.floor(x / width * points)];
        y = height / 2 - sample * height * 0.45;
      } else {

        var drift = reduceMotion ? 0 : t * 0.002;
        y = height / 2 + Math.sin(x * 0.03 + drift) * 5;
      }
      if (x === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
    g.globalAlpha = 1;


    if (loud && t - lastCheck > 120) {
      lastCheck = t;
      var freq = detectPitch(timeData, audio.sampleRate);
      if (freq > 0) showPitch(freq);
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  requestAnimationFrame(draw);
}



document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('yr').textContent = new Date().getFullYear();

  setupThemeButton();
  setupGuitarKitten();   
  setupEyes();
  setupKittenClicks();
  setupPawPrints();
  setupReveal();
  setupMusicDemo();
});
