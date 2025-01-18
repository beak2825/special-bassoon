// Formatting: {GAMEPATH}:{GAMENAME}:{THUMBNAMIL}
// The Links are autoadded by the generate boxes script. Including initial game link and initial images link.
const games = [
  "retrobowl:Retro Bowl:retrobowl.png",
  "csgoclicker:CSGO Clicker:csgoclicker.png",
  "flash-games/learntofly1:Learn To Fly 1:learntofly1.png",
  "flash-games/learntofly2:Learn To Fly 2:learntofly2.png",
  "flash-games/kawairun2:Kawai Run 2 (2P):kawairun2.png",
  "flash-games/1on1soccer:1 on 1 Soccer (2P):1on1soccer.png",
  "unity-games/fortnite:Chinese Fortnite:fortnite.png",
  "unity-games/holodisc:Holodisc AirHockey (2P):holodisc.png",
  "unity-games/triangall:Triangall (2P):triangall.png",
  "unity-games/tofight:To Fight Or Not To Fight (2P):tofight.png",
  "unity-games/bungee-go-boom:Bungee Go Boom (2P):bungee-go-boom.png",
  "unity-games/demoliton-derby:Demolition Derby:demoderby.png",
  "unity-games/ultrapong:Ultra Pong (2P):ultrapong.png",
  "unity-games/drift-hunters:Drift Hunters:drifthunters.png",
  "unity-games/clusterrush:Cluster Rush Trucks:clusterrush.png",
  "unity-games/baldis-basics:Baldi's Basics:baldi.png",
  "unity-games/bitlife:BitLife:bitlife.png",
  "unity-games/hole-io:Hole.io:holeio.png",
  "unity-games/block-blast:Block Blast:blockblast.png",
  "unity-games/rocket-league:Rocket Soccer League:rocket.png",
  "unity-games/cell-machine:Cell Machine:cellmachine.png",
  "unity-games/houseofhazards:House Of Hazards (2P):HouseOfHazards.png",
  "unity-games/block-eat-block:Block Eat Block (2P):block-eat-block.png",
  "unity-games/soccerphysics:Soccer Physics (2P):soccer_physics.png",
  "unity-games/rooftop-snipers:Rooftop Snipers (2P):rooftopsnipers.png",
  "unity-games/rooftop-snipers-2:Rooftop Snipers 2 (2P):rooftopsnipers2.png",
  "unity-games/getaway-shootout:Getaway Shootout (2P NEW MAPS 2024):getaway-shootout.png",
  "minecraft-eaglercraft:Minecraft (Eaglercraft):mc.png",
  "fluidsim:Fluid Simulator:fluidsim.png",
  "emulator/sm64:Super Mario 64(FIXED):sm64.png",
  "emulator/doom:Doom Emulator:doom.png",
  "emulator/pokemon-yellow:Pokemon Yellow:ypokemon.png",
];

// Function to generate game boxes
function generateGameBoxes() {
  const gamesContainer = document.getElementById('gamesContainer');  // Container to hold game boxes

  // Loop through each game in the games array
  games.forEach(game => {
    const [gamePath, gameName, gameThumbnail] = game.split(":");

    const gameLink = `https://script.google.com/macros/s/AKfycbyAWMq0wM0E1MaxRZd1yZ3sdesJ7HORSqUL1xSngz-PiDGk3JNdQqMdUrFXpt14suw64g/exec?page=${gamePath}`;
    const thumbnailUrl = `https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/images/${gameThumbnail}`;

    // Create the game box with all elements and structure
    const gameBox = document.createElement('div');
    gameBox.classList.add('game-box');  // Add class for styling

    const gameLinkElement = document.createElement('a');
    gameLinkElement.href = gameLink;


    const boxDiv = document.createElement('div');
    boxDiv.classList.add('box');
    boxDiv.style.backgroundImage = `url(${thumbnailUrl})`;

    const gameTitle = document.createElement('p');
    gameTitle.classList.add('game-title');
    gameTitle.textContent = gameName;

    // Structure and append elements
    boxDiv.appendChild(gameTitle);
    gameLinkElement.appendChild(boxDiv);
    gameBox.appendChild(gameLinkElement);
    gamesContainer.appendChild(gameBox); // Add game box to the container
  });
}

// Call the function to generate the game boxes when the page loads
generateGameBoxes();

// Function to filter games based on the search input
function filterGames() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();  // Get search input
  const gameBoxes = document.querySelectorAll('.game-box');  // Get all the game boxes

  gameBoxes.forEach(box => {
    const gameTitle = box.querySelector('.game-title').textContent.toLowerCase();
    box.style.display = gameTitle.includes(searchInput) ? 'inline-block' : 'none';
  });
}

// Attach the filterGames function to the search input event listener
document.getElementById('searchInput').addEventListener('input', filterGames);