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
