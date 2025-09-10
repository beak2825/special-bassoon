(function() {
  const apiUrl = "https://script.google.com/macros/s/AKfycbzrdGnkXaoyv-vEg6ZSaorWXNuIAZgMTxh_ZiRGalhs_UXvMJYsNNoA83xSDDg42BNj/exec";

  const onlineEl = document.getElementById("onlineUsers");
  const totalEl = document.getElementById("totalUsers");

  async function updateCounter() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch counter JSON");
      const data = await response.json();

      onlineEl.textContent = data.online ?? 0;
      totalEl.textContent = data.total_users ?? 0;
    } catch (err) {
      console.error("Error fetching counter:", err);
    }
  }

  // Initial fetch
  updateCounter();

  // Refresh every 30 seconds
  setInterval(updateCounter, 30000);
})();
