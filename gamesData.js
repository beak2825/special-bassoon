// Array containing all games with their link, name, thumbnail, gif (optional), and fixing status (optional)
const games = [{
    link: "https://sites.google.com/carthagecsd.org/sus/mc",
    name: "Minecraft (Eaglercraft)",
    thumbnail: "https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/mc.png",
    // Base64 for thumbnail
    gif: "data:image/gif;base64,...",
    // Base64 for GIF (optional)
    fixing: null // This can be "fixing" or null (optional)
}, {
    link: "https://sites.google.com/carthagecsd.org/sus/fluidsim",
    name: "Fluid Simulator",
    thumbnail: "https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/fluidsim.png",
    gif: null,
    // No gif
    fixing: null // Game needs fixing
}, {
    link: "https://sites.google.com/carthagecsd.org/sus/doom",
    name: "Doom Emulator",
    thumbnail: "https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/doom.png",
    gif: null,
    // No gif
    fixing: null // No fixing
}];
