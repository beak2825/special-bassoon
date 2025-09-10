(function() {
    const apiUrl = "https://script.google.com/macros/s/AKfycbzrdGnkXaoyv-vEg6ZSaorWXNuIAZgMTxh_ZiRGalhs_UXvMJYsNNoA83xSDDg42BNj/exec";

    // Create floating container
    const counterDiv = document.createElement("div");
    counterDiv.id = "userCounter";
    counterDiv.style.position = "fixed";
    counterDiv.style.bottom = "20px";
    counterDiv.style.right = "20px";
    counterDiv.style.background = "rgba(0,0,0,0.5)";
    counterDiv.style.color = "white";
    counterDiv.style.padding = "8px 12px";
    counterDiv.style.borderRadius = "12px";
    counterDiv.style.fontFamily = "Arial, sans-serif";
    counterDiv.style.fontSize = "14px";
    counterDiv.style.zIndex = "9999";
    counterDiv.style.boxShadow = "0 2px 8px rgba(0,0,0,0.4)";
    counterDiv.style.textAlign = "center";
    counterDiv.innerHTML = `Online: 0<br>Total Visitors: 0`;

    document.body.appendChild(counterDiv);

    // Function to fetch JSON and update UI
    async function updateCounter() {
        try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error("Failed to fetch counter data.");
            const data = await res.json();

            counterDiv.innerHTML = `Online: ${data.online}<br>Total Visitors: ${data.total_users}`;
        } catch (err) {
            console.error("Error fetching counter:", err);
        }
    }

    // Initial fetch
    updateCounter();

    // Refresh every 30 seconds
    setInterval(updateCounter, 30000);
})();
