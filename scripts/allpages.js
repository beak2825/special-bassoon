// allpages.js

// Inject the Google Analytics tag script into the document head
(function loadGtagScript() {
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-M99E1TLH6D';
  document.head.appendChild(script);
})();

// Initialize dataLayer and gtag configuration
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', 'G-M99E1TLH6D');
