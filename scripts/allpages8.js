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








(function() {
  const sidentifier = localStorage.getItem('analytics_sidentifier');
  if (!sidentifier) return; // no identifier, do nothing

  // Fetch the bans.txt from GitHub
  fetch('https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/bans.txt')
    .then(res => res.text())
    .then(text => {
      // Parse bans.txt into a blocked object
      const blockedList = {};
      text.split(/\r?\n/).forEach(line => {
        const [id, reason] = line.split('|').map(s => s.trim());
        if (id) blockedList[id] = reason || "Blocked.";
      });

      if (blockedList[sidentifier]) {
        const reason = blockedList[sidentifier];

        // Create full-screen iframe
        const iframe = document.createElement('iframe');
        Object.assign(iframe.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          border: 'none',
          margin: '0',
          padding: '0',
          zIndex: '9999999',
          background: '#fff'
        });
        document.body.appendChild(iframe);

        // Fetch blocked.html content and inject
        fetch('https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/blocked.html')
          .then(res => res.text())
          .then(html => {
            const htmlWithReason = html.replace('<?=REASON?>', reason);
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(htmlWithReason);
            doc.close();
          })
          .catch(err => {
            console.error("Failed to load blocked content:", err);
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(`<div style="display:flex;justify-content:center;align-items:center;height:100%;font-family:sans-serif;font-size:24px;">
                         ${reason}
                       </div>`);
            doc.close();
          });
      }
    })
    .catch(err => console.error("Failed to fetch bans.txt:", err));
})();