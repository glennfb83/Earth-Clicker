let points = 0;
let clickPower = 1;
let autoPower = 0;

let clickCost = 10;
let autoCost = 25;

let gameWon = false;
let tutorialSeen = false;

// Phase thresholds
const PHASE_1_START = 0;
const PHASE_1_END = 100000;
const PHASE_2_START = 100000;
const PHASE_2_END = 500000;
const PHASE_3_START = 500000;
const WIN_THRESHOLD = 1000000;

// Phase data
const phases = {
	dystopian: {
		name: "Dystopian Earth",
		message: "Earth is dying...",
		className: "phase-dystopian"
	},
	recovery: {
		name: "Earth Recovering",
		message: "The planet is healing...",
		className: "phase-recovery"
	},
	thriving: {
		name: "Thriving Earth",
		message: "Earth is thriving!",
		className: "phase-thriving"
	}
};

// Get current phase
function getCurrentPhase() {
	if (points < PHASE_1_END) {
		return "dystopian";
	} else if (points < PHASE_2_END) {
		return "recovery";
	} else if (points < WIN_THRESHOLD) {
		return "thriving";
	}
	return "thriving";
}

// Update phase visuals
function updatePhase() {
	const phase = getCurrentPhase();
	const phaseData = phases[phase];
	
	// Remove all phase classes
	document.body.classList.remove("phase-dystopian", "phase-recovery", "phase-thriving");
	// Add current phase class
	document.body.classList.add(phaseData.className);
	
	// Update phase label and message
	document.getElementById("phaseLabel").textContent = `Phase: ${phaseData.name}`;
	document.getElementById("phaseMessage").textContent = phaseData.message;
	
	// Update progress bar
	let progress = 0;
	if (phase === "dystopian") {
		progress = (points / PHASE_1_END) * 100;
	} else if (phase === "recovery") {
		progress = ((points - PHASE_2_START) / (PHASE_2_END - PHASE_2_START)) * 100;
	} else if (phase === "thriving") {
		progress = ((points - PHASE_3_START) / (WIN_THRESHOLD - PHASE_3_START)) * 100;
	}
	document.getElementById("phaseProgress").style.width = Math.min(progress, 100) + "%";
}

// Check for victory
function checkVictory() {
	if (points >= WIN_THRESHOLD && !gameWon) {
		gameWon = true;
		showVictory();
	}
}

// Show victory modal
function showVictory() {
	const modal = document.getElementById("victoryModal");
	const hours = Math.floor(gameTime / 3600);
	const minutes = Math.floor((gameTime % 3600) / 60);
	const seconds = gameTime % 60;
	
	let timeStr = "";
	if (hours > 0) timeStr += `${hours}h `;
	timeStr += `${minutes}m ${seconds}s`;
	
	document.getElementById("victoryMessage").textContent = 
		"You've successfully restored Earth to its full natural glory! Through your dedication to planting trees and investing in renewable energy, you've turned back the effects of climate change and created a thriving world!";
	
	document.getElementById("victoryStats").innerHTML = `
		<p><strong>🌳 Trees Planted:</strong> ${Math.floor(points / 10)}</p>
		<p><strong>⚡ Solar Panels Built:</strong> ${autoPower}</p>
		<p><strong>🌍 Total Impact Points:</strong> ${points.toLocaleString()}</p>
		<p><strong>⏱️ Time to Save Earth:</strong> ${timeStr}</p>
	`;
	
	modal.classList.remove("hidden");
}

// Show tutorial modal
function showTutorial() {
	const modal = document.getElementById("tutorialModal");
	modal.classList.remove("hidden");
}

// Hide tutorial modal
function hideTutorial() {
	const modal = document.getElementById("tutorialModal");
	modal.classList.add("hidden");
	tutorialSeen = true;
	saveGame();
}

// Start button listener
document.getElementById("startBtn").addEventListener("click", () => {
	hideTutorial();
});

// Restart game
document.getElementById("restartBtn").addEventListener("click", () => {
	points = 0;
	clickPower = 1;
	autoPower = 0;
	clickCost = 10;
	autoCost = 25;
	gameWon = false;
	gameTime = 0;
	
	document.getElementById("victoryModal").classList.add("hidden");
	updatePhase();
	updateUI();
	saveGame();
});

// load game
function loadGame() {
	const saved = JSON.parse(localStorage.getItem("earthClickerSave"));
	if (saved) {
		points = saved.points || 0;
		clickPower = saved.clickPower || 1;
		autoPower = saved.autoPower || 0;
		clickCost = saved.clickCost || 10;
		autoCost = saved.autoCost || 25;
		gameWon = saved.gameWon || false;
		gameTime = saved.gameTime || 0;
		tutorialSeen = saved.tutorialSeen || false;
		
		// If game was already won, show the victory modal
		if (gameWon) {
			setTimeout(() => showVictory(), 100);
		}
	}
}

// save game
function saveGame() {
	localStorage.setItem("earthClickerSave", JSON.stringify({
		points,
		clickPower,
		autoPower,
		clickCost,
		autoCost,
		gameWon,
		gameTime,
		tutorialSeen
	}));
}

// UI update
function updateUI() {
	document.getElementById("pointsDisplay").textContent = `Impact Points: ${points.toLocaleString()}`;
	document.getElementById("clickCost").textContent = clickCost;
	document.getElementById("autoCost").textContent = autoCost;

	// per second display
	document.getElementById("perSecDisplay").textContent = `+${autoPower.toFixed(1)} / sec`;
	
	// Update button disabled state
	document.getElementById("clickUpgradeBtn").disabled = points < clickCost || gameWon;
	document.getElementById("autoUpgradeBtn").disabled = points < autoCost || gameWon;
	
	// Update phase
	updatePhase();
	
	// Check for victory
	checkVictory();
}

// click earth
document.getElementById("earth").addEventListener("click", () => {
	if (!gameWon) {
		points += clickPower;
		updateUI();
		saveGame();
	}
});

// click upgrade
document.getElementById("clickUpgradeBtn").addEventListener("click", () => {
	if (points >= clickCost && !gameWon) {
		points -= clickCost;
		clickPower += 1;
		clickCost = Math.floor(clickCost * 1.5);
		updateUI();
		saveGame();
	}
});

// auto upgrade
document.getElementById("autoUpgradeBtn").addEventListener("click", () => {
	if (points >= autoCost && !gameWon) {
		points -= autoCost;
		autoPower += 1;
		autoCost = Math.floor(autoCost * 1.7);
		updateUI();
		saveGame();
	}
});

// Track game time
let gameTime = 0;
setInterval(() => {
	if (!gameWon) {
		gameTime++;
		saveGame();
	}
}, 1000);

// auto income
setInterval(() => {
	if (autoPower > 0 && !gameWon) {
		points += autoPower;
		updateUI();
		saveGame();
	}
}, 1000);

// init
loadGame();
updateUI();

// Show tutorial if first time
if (!tutorialSeen) {
	showTutorial();
}
