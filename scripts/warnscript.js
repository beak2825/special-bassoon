document.addEventListener("DOMContentLoaded", async function () {
    const warnsUrl = "https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/warns.txt";
    const warnHtmlUrl = "https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/1warn.html";
    const userCookie = localStorage.getItem("analytics_sidentifier");
    if (!userCookie) return;

    // Load acknowledged IDs
    const acknowledged = localStorage.getItem("acknowledge");
    const acknowledgedList = acknowledged ? acknowledged.split(",") : [];

    try {
        // Fetch warns.txt
        const response = await fetch(warnsUrl, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch warns list");

        const text = await response.text();
        const lines = text.split("\n").map(line => line.trim()).filter(Boolean);

        // Collect all warn IDs for this cookie
        const userWarns = [];
        for (const line of lines) {
            const [cookie, reason, warnId] = line.split("|");
            if (cookie && warnId && cookie.trim() === userCookie) {
                userWarns.push(warnId.trim());
            }
        }

        // Find if there’s any unacknowledged warn
        const unacknowledged = userWarns.filter(id => !acknowledgedList.includes(id));

        if (unacknowledged.length > 0) {
            // Fetch warn.html raw content
            const htmlResponse = await fetch(warnHtmlUrl, { cache: "no-store" });
            if (!htmlResponse.ok) throw new Error("Failed to fetch warn.html");

            const warnHtml = await htmlResponse.text();

            // Create top iframe
            const iframe = document.createElement("iframe");
            iframe.style.position = "fixed";
            iframe.style.top = "0";
            iframe.style.left = "0";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.zIndex = "999999";
            iframe.style.border = "none";

            // Write warn.html content into iframe
            document.body.appendChild(iframe);
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(warnHtml);
            iframeDoc.close();
        }
    } catch (err) {
        console.error("Error handling warns:", err);
    }
});
