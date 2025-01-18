document.addEventListener('DOMContentLoaded', function () {
  // Retrieve the key from localStorage and log it
  let key = localStorage.getItem('userKey');
  console.log('userKey from localStorage:', key);

  if (!key) {
    // If no key is found, generate a new one and display the popup
    key = generateKey();
    localStorage.setItem('userKey', key);
    displayPopup(key);
  } else {
    // If key exists, proceed without showing the popup
    console.log('Key exists. Proceeding without showing the popup.');
  }

  // Function to generate a random 10-character alphanumeric key
  function generateKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'key-';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Function to display the popup
  function displayPopup(key) {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;

    overlay.innerHTML = `
      <div id="popup" style="
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        width: 300px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
      ">
        <h1 style="font-weight: bold; margin-bottom: 15px;">Prove You're Human</h1>
        <p>Your Key: <span id="key" style="color: blue; font-weight: bold; cursor: pointer;">${key}</span></p>
        <button id="copyButton" class="button" style="
          background-color: blue;
          color: white;
          padding: 10px 20px;
          margin: 10px 0;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        ">Copy Key</button>
        <br>
        <a id="link" href="https://docs.google.com/forms/d/e/1FAIpQLSeAYDB8WmzCu2ECAxd_rkyaJ4u0GPn9yjBBxTsVDP_LEq1fDg/viewform?usp=sharing" target="_blank" style="
          color: blue;
          font-weight: bold;
          text-decoration: none;
        " onclick="copyKeyAndOpenLink()">Paste Your Key Here</a>
        <br>
        <button id="completedButton" style="
          background-color: green;
          color: white;
          padding: 10px 20px;
          margin-top: 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          display: none;
        ">Completed</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Copy key to clipboard when clicking the key or the "Copy Key" button
    document.getElementById('key').addEventListener('click', function () {
      copyToClipboard(key);
    });
    document.getElementById('copyButton').addEventListener('click', function () {
      copyToClipboard(key);
    });

    // Show the "Completed" button after 11 seconds
    setTimeout(() => {
      const completedButton = document.getElementById('completedButton');
      completedButton.style.display = 'block';
      completedButton.addEventListener('click', function () {
        window.location.href = 'https://script.google.com/macros/s/AKfycbyAWMq0wM0E1MaxRZd1yZ3sdesJ7HORSqUL1xSngz-PiDGk3JNdQqMdUrFXpt14suw64g/exec';
      });
    }, 11000);
  }

  // Function to copy the key to the clipboard without showing an alert
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy key: ', err);
    });
  }

  // Function to copy the key and then open the link in a new tab
  function copyKeyAndOpenLink() {
    copyToClipboard(key);
    window.open(document.getElementById('link').href, '_blank');
  }
});