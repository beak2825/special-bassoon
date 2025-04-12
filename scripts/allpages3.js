(function () {
  const SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyAWMq0wM0E1MaxRZd1yZ3sdesJ7HORSqUL1xSngz-PiDGk3JNdQqMdUrFXpt14suw64g/exec';

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  let ip = localStorage.getItem('analytics_ip');
  let sidentifier = localStorage.getItem('analytics_sidentifier');
  let userAgent = localStorage.getItem('analytics_useragent');
  let timestamp = new Date().toISOString();
  let screenSize = `${screen.width}x${screen.height}`;

  if (!sidentifier) {
    sidentifier = uuidv4();
    localStorage.setItem('analytics_sidentifier', sidentifier);
  }

  if (!userAgent) {
    userAgent = navigator.userAgent;
    localStorage.setItem('analytics_useragent', userAgent);
  }

  if (!ip) {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        ip = data.ip || '';
        localStorage.setItem('analytics_ip', ip);
      })
      .catch(() => ip = '');  // Handle errors gracefully, use empty string as fallback
  }

  // Modify game link generation to include parameters
  function generateGameLink(page) {
    const params = new URLSearchParams({
      page: page,
      ip: ip,
      sidentifier: sidentifier,
      ua: userAgent,
      timestamp: timestamp,
      screen: screenSize
    });

    return `${SCRIPT_ENDPOINT}?${params.toString()}`;
  }

  // When user clicks on a game, use this method to build the correct URL
  document.querySelectorAll('.game-link').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const gamePage = event.target.dataset.page; // Assumes each game link has a data-page attribute
      const gameUrl = generateGameLink(gamePage);
      window.location.href = gameUrl;
    });
  });
})();
