window['d6ece658d7fb23fdee2f8d277596a675.wasm'] = function(t) {
    try {
        var e = atob(t.split(",")[1]);
        var a = t.split(",")[0].split(":")[0];
        var r = new ArrayBuffer(e.length);
        var o = new Uint8Array(r);
        for (var i = 0; i < e.length; i++)
            o[i] = e.charCodeAt(i);
        a = new Blob([r], {
            type: a
        });
        return URL.createObjectURL(a);
    } catch (t) {
        alert("Failed to convert data URL to Blob URL");
        console.error("Failed to convert data URL to Blob URL:", t);
    }
}("https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/getaway-shootout/Build/d6ece658d7fb23fdee2f8d277596a675.wasm");