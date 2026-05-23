let points = 0;
let clickPower = 1;
let autoPower = 0;
let windPower = 0;
let hydroPower = 0;
let geothermalPower = 0;
let nuclearPower = 0;
let forestPower = 0;
let parkPower = 0;

let clickCost = 10;
let autoCost = 25;
let windCost = 40;
let hydroCost = 60;
let geothermalCost = 150;
let nuclearCost = 500;
let reforestCost = 75;
let protectCost = 500;

let clickMultiplier = 1;
let energyMultiplier = 1;
let superMultiplier = 1;

let clickMultCost = 1000;
let energyMultCost = 2000;
let superMultCost = 10000;

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
	
	document.body.classList.remove("phase-dystopian", "phase-recovery", "phase-thriving");
	document.body.classList.add(phaseData.className);
	
	document.getElementById("phaseLabel").textContent = `Phase: ${phaseData.name}`;
	document.getElementById("phaseMessage").textContent = phaseData.message;
	
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

// Create floating points animation
function createFloatingPoints(amount) {
	const container = document.getElementById("floatingPoints");
	const point = document.createElement("div");
	point.className = "floating-point";
	point.textContent = "+" + amount;
	container.appendChild(point);
	
	setTimeout(() => {
		point.remove();
	}, 1000);
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
		"You've successfully restored Earth to its full natural glory! Through your dedication and strategic upgrades, you've turned back climate change and created a thriving paradise!";
	
	const totalEnergy = (autoPower + windPower * 0.75 + hydroPower * 0.5 + geothermalPower * 1.5 + nuclearPower * 3) * energyMultiplier * superMultiplier;
	
	document.getElementById("victoryStats").innerHTML = `
		<p><strong>🌳 Click Power:</strong> ${(clickPower + forestPower + parkPower) * clickMultiplier * superMultiplier}</p>
		<p><strong>⚡ Energy/sec:</strong> ${totalEnergy.toFixed(2)}</p>
		<p><strong>🚀 Multipliers Active:</strong> Click x${clickMultiplier}, Energy x${energyMultiplier}, Super x${superMultiplier}</p>
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
	windPower = 0;
	hydroPower = 0;
	geothermalPower = 0;
	nuclearPower = 0;
	forestPower = 0;
	parkPower = 0;
	
	clickCost = 10;
	autoCost = 25;
	windCost = 40;
	hydroCost = 60;
	geothermalCost = 150;
	nuclearCost = 500;
	reforestCost = 75;
	protectCost = 500;
	
	clickMultiplier = 1;
	energyMultiplier = 1;
	superMultiplier = 1;
	
	clickMultCost = 1000;
	energyMultCost = 2000;
	superMultCost = 10000;
	
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
		windPower = saved.windPower || 0;
		hydroPower = saved.hydroPower || 0;
		geothermalPower = saved.geothermalPower || 0;
		nuclearPower = saved.nuclearPower || 0;
		forestPower = saved.forestPower || 0;
		parkPower = saved.parkPower || 0;
		
		clickCost = saved.clickCost || 10;
		autoCost = saved.autoCost || 25;
		windCost = saved.windCost || 40;
		hydroCost = saved.hydroCost || 60;
		geothermalCost = saved.geothermalCost || 150;
		nuclearCost = saved.nuclearCost || 500;
		reforestCost = saved.reforestCost || 75;
		protectCost = saved.protectCost || 500;
		
		clickMultiplier = saved.clickMultiplier || 1;
		energyMultiplier = saved.energyMultiplier || 1;
		superMultiplier = saved.superMultiplier || 1;
		
		clickMultCost = saved.clickMultCost || 1000;
		energyMultCost = saved.energyMultCost || 2000;
		superMultCost = saved.superMultCost || 10000;
		
		gameWon = saved.gameWon || false;
		gameTime = saved.gameTime || 0;
		tutorialSeen = saved.tutorialSeen || false;
		
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
		windPower,
		hydroPower,
		geothermalPower,
		nuclearPower,
		forestPower,
		parkPower,
		clickCost,
		autoCost,
		windCost,
		hydroCost,
		geothermalCost,
		nuclearCost,
		reforestCost,
		protectCost,
		clickMultiplier,
		energyMultiplier,
		superMultiplier,
		clickMultCost,
		energyMultCost,
		superMultCost,
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
	document.getElementById("windCost").textContent = windCost;
	document.getElementById("hydroCost").textContent = hydroCost;
	document.getElementById("geothermalCost").textContent = geothermalCost;
	document.getElementById("nuclearCost").textContent = nuclearCost;
	document.getElementById("reforestCost").textContent = reforestCost;
	document.getElementById("protectCost").textContent = protectCost;
	
	document.getElementById("clickMultCost").textContent = clickMultCost;
	document.getElementById("energyMultCost").textContent = energyMultCost;
	document.getElementById("superMultCost").textContent = superMultCost;

	// Calculate totals
	const totalClickPower = (clickPower + forestPower + parkPower) * clickMultiplier * superMultiplier;
	const totalEnergy = (autoPower + windPower * 0.75 + hydroPower * 0.5 + geothermalPower * 1.5 + nuclearPower * 3) * energyMultiplier * superMultiplier;
	
	// Update stats display
	document.getElementById("clickPowerDisplay").textContent = totalClickPower.toFixed(0);
	document.getElementById("energyDisplay").textContent = totalEnergy.toFixed(2);
	document.getElementById("multDisplay").textContent = `${(clickMultiplier * energyMultiplier * superMultiplier).toFixed(1)}x`;

	// per second display
	document.getElementById("perSecDisplay").textContent = `+${totalEnergy.toFixed(2)} / sec`;
	
	// Update button disabled state
	document.getElementById("clickUpgradeBtn").disabled = points < clickCost || gameWon;
	document.getElementById("autoUpgradeBtn").disabled = points < autoCost || gameWon;
	document.getElementById("windUpgradeBtn").disabled = points < windCost || gameWon;
	document.getElementById("hydroUpgradeBtn").disabled = points < hydroCost || gameWon;
	document.getElementById("geothermalUpgradeBtn").disabled = points < geothermalCost || gameWon;
	document.getElementById("nuclearUpgradeBtn").disabled = points < nuclearCost || gameWon;
	document.getElementById("reforestBtn").disabled = points < reforestCost || gameWon;
	document.getElementById("protectBtn").disabled = points < protectCost || gameWon;
	document.getElementById("clickMultBtn").disabled = points < clickMultCost || gameWon;
	document.getElementById("energyMultBtn").disabled = points < energyMultCost || gameWon;
	document.getElementById("superMultBtn").disabled = points < superMultCost || gameWon;
	
	updatePhase();
	checkVictory();
}

// click earth
document.getElementById("earth").addEventListener("click", () => {
	if (!gameWon) {
		const earnedPoints = (clickPower + forestPower + parkPower) * clickMultiplier * superMultiplier;
		points += earnedPoints;
		createFloatingPoints(Math.floor(earnedPoints));
		updateUI();
		saveGame();
	}
});

// Click upgrade
document.getElementById("clickUpgradeBtn").addEventListener("click", () => {
	if (points >= clickCost && !gameWon) {
		points -= clickCost;
		clickPower += 1;
		clickCost = Math.floor(clickCost * 1.5);
		updateUI();
		saveGame();
	}
});

// Auto upgrade
document.getElementById("autoUpgradeBtn").addEventListener("click", () => {
	if (points >= autoCost && !gameWon) {
		points -= autoCost;
		autoPower += 1;
		autoCost = Math.floor(autoCost * 1.7);
		updateUI();
		saveGame();
	}
});

// Wind upgrade
document.getElementById("windUpgradeBtn").addEventListener("click", () => {
	if (points >= windCost && !gameWon) {
		points -= windCost;
		windPower += 1;
		windCost = Math.floor(windCost * 1.6);
		updateUI();
		saveGame();
	}
});

// Hydro upgrade
document.getElementById("hydroUpgradeBtn").addEventListener("click", () => {
	if (points >= hydroCost && !gameWon) {
		points -= hydroCost;
		hydroPower += 1;
		hydroCost = Math.floor(hydroCost * 1.65);
		updateUI();
		saveGame();
	}
});

// Geothermal upgrade
document.getElementById("geothermalUpgradeBtn").addEventListener("click", () => {
	if (points >= geothermalCost && !gameWon) {
		points -= geothermalCost;
		geothermalPower += 1;
		geothermalCost = Math.floor(geothermalCost * 1.8);
		updateUI();
		saveGame();
	}
});

// Nuclear upgrade
document.getElementById("nuclearUpgradeBtn").addEventListener("click", () => {
	if (points >= nuclearCost && !gameWon) {
		points -= nuclearCost;
		nuclearPower += 1;
		nuclearCost = Math.floor(nuclearCost * 2);
		updateUI();
		saveGame();
	}
});

// Reforestation upgrade
document.getElementById("reforestBtn").addEventListener("click", () => {
	if (points >= reforestCost && !gameWon) {
		points -= reforestCost;
		forestPower += 1;
		reforestCost = Math.floor(reforestCost * 1.75);
		updateUI();
		saveGame();
	}
});

// Protect parks upgrade
document.getElementById("protectBtn").addEventListener("click", () => {
	if (points >= protectCost && !gameWon) {
		points -= protectCost;
		parkPower += 1;
		protectCost = Math.floor(protectCost * 2);
		updateUI();
		saveGame();
	}
});

// Click multiplier
document.getElementById("clickMultBtn").addEventListener("click", () => {
	if (points >= clickMultCost && !gameWon) {
		points -= clickMultCost;
		clickMultiplier *= 1.5;
		clickMultCost = Math.floor(clickMultCost * 3);
		updateUI();
		saveGame();
	}
});

// Energy multiplier
document.getElementById("energyMultBtn").addEventListener("click", () => {
	if (points >= energyMultCost && !gameWon) {
		points -= energyMultCost;
		energyMultiplier *= 1.25;
		energyMultCost = Math.floor(energyMultCost * 3.5);
		updateUI();
		saveGame();
	}
});

// Super multiplier
document.getElementById("superMultBtn").addEventListener("click", () => {
	if (points >= superMultCost && !gameWon) {
		points -= superMultCost;
		superMultiplier *= 2;
		superMultCost = Math.floor(superMultCost * 5);
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
	if ((autoPower > 0 || windPower > 0 || hydroPower > 0 || geothermalPower > 0 || nuclearPower > 0) && !gameWon) {
		const energyGain = (windPower * 0.75 + hydroPower * 0.5 + geothermalPower * 1.5 + nuclearPower * 3) * energyMultiplier * superMultiplier;
		points += autoPower * clickMultiplier * energyMultiplier * superMultiplier + energyGain;
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
