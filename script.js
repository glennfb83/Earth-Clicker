let points = 0;
let clickPower = 1;
let autoPower = 0;

let clickCost = 10;
let autoCost = 25;

// load saved data
function loadGame() {
	const saved = JSON.parse(localStorage.getItem("earthClickerSave"));
	if (saved) {
		points = saved.points || 0;
		clickPower = saved.clickPower || 1;
		autoPower = saved.autoPower || 0;
		clickCost = saved.clickCost || 10;
		autoCost = saved.autoCost || 25;
	}
}

// save game
function saveGame() {
	localStorage.setItem("earthClickerSave", JSON.stringify({
		points,
		clickPower,
		autoPower,
		clickCost,
		autoCost
	}));
}

// UI update
function updateUI() {
	document.getElementById("pointsDisplay").textContent = `Earth Points: ${points}`;
	document.getElementById("clickCost").textContent = clickCost;
	document.getElementById("autoCost").textContent = autoCost;
}

// clicking earth
document.getElementById("earth").addEventListener("click", () => {
	points += clickPower;
	updateUI();
	saveGame();
});

// upgrade click power
document.getElementById("clickUpgradeBtn").addEventListener("click", () => {
	if (points >= clickCost) {
		points -= clickCost;
		clickPower += 1;
		clickCost = Math.floor(clickCost * 1.5);
		updateUI();
		saveGame();
	}
});

// upgrade auto click
document.getElementById("autoUpgradeBtn").addEventListener("click", () => {
	if (points >= autoCost) {
		points -= autoCost;
		autoPower += 1;
		autoCost = Math.floor(autoCost * 1.7);
		updateUI();
		saveGame();
	}
});

// auto generator
setInterval(() => {
	if (autoPower > 0) {
		points += autoPower;
		updateUI();
		saveGame();
	}
}, 1000);

// init
loadGame();
updateUI();
