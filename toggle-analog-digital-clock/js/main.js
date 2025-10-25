/* -------------------------
   Saat logic: digital + analog
   M tuşu: mode (digital <-> analog)
   T tuşu: tema (dark <-> light)
   ------------------------- */

(function(){
  const digitalEl = document.getElementById('digital');
  const analogEl  = document.getElementById('analog');
  const modeLabel = document.getElementById('modeLabel');
  const themeLabel = document.getElementById('themeLabel');
  const toggleModeBtn = document.getElementById('toggleModeBtn');
  const toggleThemeBtn = document.getElementById('toggleThemeBtn');
  const digitalTime = document.getElementById('digitalTime');
  const dateStr = document.getElementById('dateStr');
  const ampmEl = document.getElementById('ampm');

  // analog hands
  const hourHand = document.getElementById('hourHand');
  const minuteHand = document.getElementById('minuteHand');
  const secondHand = document.getElementById('secondHand');
  const marksContainer = document.getElementById('marks');

  // state
  let mode = 'digital'; // 'digital' or 'analog'
  let theme = 'dark'; // 'dark' or 'light'

  // create marks (12 major + 48 small)
  (function createMarks(){
    // 12 hour marks
    for(let i=0;i<60;i++){
      const span = document.createElement('span');
      if(i % 5 !== 0) span.classList.add('small'); // minute marks
      const angle = i * 6; // 360/60
      span.style.transform = `translate(-50%,0) rotate(${angle}deg) translateY(-${(marksContainer.clientHeight/2) - 16}px)`;
      span.style.top = '50%';
      span.style.left = '50%';
      span.style.transformOrigin = '50% 120px';
      span.style.transform = `rotate(${angle}deg) translateY(-120px)`;
      marksContainer.appendChild(span);
    }
  })();

  // format helpers
  function pad(n){ return n < 10 ? '0' + n : n; }
  function turkishDateName(d){
    const days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
    const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  // update clocks
  function updateClock(){
    const now = new Date();

    // DIGITAL
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const isAM = hours < 12;
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    digitalTime.innerHTML = `${pad(displayHours)}:${pad(minutes)}:${pad(seconds)} <span class="ampm">${isAM ? 'ÖÖ' : 'ÖS'}</span>`;
    dateStr.textContent = turkishDateName(now);

    // ANALOG calculations
    // seconds * 6deg
    const secondsDeg = seconds * 6;
    // minutes + seconds contribution
    const minutesDeg = minutes * 6 + seconds * 0.1;
    // hours plus minutes contribution (30deg per hour)
    const hoursDeg = (hours % 12) * 30 + minutes * 0.5;

    // set transforms
    secondHand.style.transform = `translate(-50%,-100%) rotate(${secondsDeg}deg)`;
    minuteHand.style.transform = `translate(-50%,-100%) rotate(${minutesDeg}deg)`;
    hourHand.style.transform   = `translate(-50%,-100%) rotate(${hoursDeg}deg)`;
  }

  // start clock updates
  updateClock();
  const tickInterval = setInterval(updateClock, 250);

  // toggle functions
  function showDigital(){
    digitalEl.classList.add('show');
    analogEl.classList.remove('show');
    analogEl.setAttribute('aria-hidden', 'true');
    digitalEl.setAttribute('aria-hidden', 'false');
    mode = 'digital';
    modeLabel.textContent = 'Digital';
  }
  function showAnalog(){
    digitalEl.classList.remove('show');
    analogEl.classList.add('show');
    analogEl.setAttribute('aria-hidden', 'false');
    digitalEl.setAttribute('aria-hidden', 'true');
    mode = 'analog';
    modeLabel.textContent = 'Analog';
  }
  function toggleMode(){
    if(mode === 'digital') showAnalog(); else showDigital();
  }

  function toggleTheme(){
    const body = document.body;
    if(theme === 'dark'){
      body.classList.add('light');
      theme = 'light';
      themeLabel.textContent = 'Light';
    } else {
      body.classList.remove('light');
      theme = 'dark';
      themeLabel.textContent = 'Dark';
    }
  }

  // button events
  toggleModeBtn.addEventListener('click', toggleMode);
  toggleThemeBtn.addEventListener('click', toggleTheme);

  // keyboard events: M and T
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');
    if(active) return;
    const key = e.key.toLowerCase();
    if(key === 'm'){ toggleMode(); }
    if(key === 't'){ toggleTheme(); }
  });

  // initialize accessibility labels and default mode/theme
  showDigital();
  // leave dark by default;
  themeLabel.textContent = 'Dark';

})();