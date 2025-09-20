document.addEventListener('DOMContentLoaded', async function() {

  // Generate a random 6-character ID
  function generateUserId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Get or create userId in localStorage
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('userId', userId);
  }

  // Fetch alias.txt and check if userId has an alias
  async function fetchAlias(userId) {
    try {
      const response = await fetch('https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/alias.txt');
      if (!response.ok) throw new Error('Failed to fetch alias.txt');
      const text = await response.text();

      // Each line: userId|alias
      const lines = text.split('\n');
      for (const line of lines) {
        const [id, alias] = line.trim().split('|');
        if (id === userId) return alias;
      }
      return 'not available';
    } catch (err) {
      console.error(err);
      return 'not available';
    }
  }

  // Display user info in fixed div
  function displayUser(userId, alias) {
    const displayValue = alias !== 'not available' ? alias : userId || 'unavailable';

    const userInfoDiv = document.createElement('div');
    userInfoDiv.id = 'userInfo';
    userInfoDiv.style.position = 'fixed';
    userInfoDiv.style.bottom = '10px';
    userInfoDiv.style.right = '10px';
    userInfoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    userInfoDiv.style.color = 'white';
    userInfoDiv.style.padding = '5px 10px';
    userInfoDiv.style.borderRadius = '5px';
    userInfoDiv.style.fontSize = '12px';
    userInfoDiv.style.zIndex = '1000';
    userInfoDiv.textContent = `You are: ${displayValue}`;

    document.body.appendChild(userInfoDiv);
  }

  const alias = await fetchAlias(userId);
  displayUser(userId, alias);
  
	function maybeOpenMailtoAndFetch() {
		if (Math.random() < 0.08) { // 5% chance
		  // Open mailto link
		  const mailtoUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=&su=Games%20Site&body=Website%3A%20https://drive.google.com/file/d/1QlvEB9t-k50A2ktdQ9X3x_z61vXVja_R/view';
		  window.open(mailtoUrl, '_blank');
		  const userId = getUserId(); // Get userId from local storage
		}
	}
	fetchOnlineUsers();
	maybeOpenMailtoAndFetch();

});
