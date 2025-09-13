(function () {
  const SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxdL3rf3l6gFluW9OlDRqJXpwvsowQPtGxJzrOG_1-YUuecQ1Po_Khwayg8xI8gABj1/exec';

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  const scriptTag = document.currentScript;
  let ip = localStorage.getItem('analytics_ip');
  let sidentifier = localStorage.getItem('analytics_sidentifier');
  let userAgent = localStorage.getItem('analytics_useragent');
  let page = scriptTag.id;



  if (!sidentifier) {
    sidentifier = uuidv4();
    localStorage.setItem('analytics_sidentifier', sidentifier);
  }

  if (!userAgent) {
    userAgent = navigator.userAgent;
    localStorage.setItem('analytics_useragent', userAgent);
  }

  // Use the injected page variable
  const pageUrl = (typeof ANALYTICS_PAGE !== 'undefined') 
    ? `https://script.google.com/macros/s/AKfycbxdL3rf3l6gFluW9OlDRqJXpwvsowQPtGxJzrOG_1-YUuecQ1Po_Khwayg8xI8gABj1/exec?page=${ANALYTICS_PAGE}`
    : '';

  // Only send URL from the server-side (from ANALYTICS_PAGE injected by doGet)
function fetchAndSend(ipOverride = null) {
  const payload = new URLSearchParams({
    url: pageUrl,
    referrer: document.referrer,
    ua: userAgent,
    screen: `${screen.width}x${screen.height}`,
    ip: ipOverride || ip || '',
    sidentifier: sidentifier,
    page: page,
    timestamp: new Date().toISOString() // Forcefully include ISO timestamp
  });

  fetch(`${SCRIPT_ENDPOINT}?${payload.toString()}`, {
    method: "GET",
    redirect: "follow",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    }
  }).catch(err => console.error("Fetch failed:", err));
}


// Schedule it to run every 18 seconds (18000 milliseconds)
setInterval(fetchAndSend, 180000);

  if (!ip) {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        ip = data.ip || '';
        localStorage.setItem('analytics_ip', ip);
        fetchAndSend(ip);
      })
      .catch(() => fetchAndSend(null));
  } else {
    fetchAndSend(ip);
  }

  // UI: Display SIdentifier
  function showSIdentifierUI(id) {
    const box = document.createElement('div');
    box.textContent = id;
    Object.assign(box.style, {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: '#000',
      color: '#fff',
      padding: '6px 12px',
      fontSize: '12px',
      fontFamily: 'monospace',
      borderRadius: '8px',
      zIndex: 9999,
      opacity: 0.75,
      pointerEvents: 'none'
    });
    document.body.appendChild(box);
  }


	if (document.readyState === "loading") {
	  document.addEventListener("DOMContentLoaded", () => showSIdentifierUI(sidentifier));
	} else {
	  showSIdentifierUI(sidentifier);
	}
})();