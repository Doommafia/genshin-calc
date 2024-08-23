document.addEventListener("DOMContentLoaded", () => {
    if (typeof levelsData === 'undefined') {
        console.error('levelsData is not defined.');
        return;
    }

    const charImg = document.querySelector(".char");
    const wepBtn = document.querySelector(".wep");
    const popup = document.getElementById("popup");
    const inputField = document.getElementById("inputField");
    const calculateBtn = document.getElementById("calculateBtn");
    const moraDisplay = document.getElementById("moraNeeded");
    const xpDisplay = document.getElementById("xpNeeded");

    const herosWitDisplay = document.getElementById("herosWitNeeded");
    const adventurersExperienceDisplay = document.getElementById("adventurersExperienceNeeded");
    const wanderersAdviceDisplay = document.getElementById("wanderersAdviceNeeded");

    const currentLevelSelect = document.getElementById("currentLevel");
    const targetLevelSelect = document.getElementById("targetLevel");

    function calculateMoraXP() {
        const startLevel = parseInt(currentLevelSelect.value);
        const endLevel = parseInt(targetLevelSelect.value);

        if (startLevel === endLevel) {
            moraDisplay.textContent = '0';
            xpDisplay.textContent = '0';
            herosWitDisplay.textContent = '0';
            adventurersExperienceDisplay.textContent = '0';
            wanderersAdviceDisplay.textContent = '0';
            return;
        }

        let totalMora = 0;
        let totalXP = 0;

        let startPhase = Math.floor((startLevel - 1) / 20);
        let endPhase = Math.floor((endLevel - 1) / 20);

        while (startPhase <= endPhase) {
            const data = levelsData.ascensions[startPhase];
            if (!data) continue;

            const phaseStartLevel = startPhase * 20 + 1;
            const phaseEndLevel = (startPhase + 1) * 20;

            const start = Math.max(startLevel, phaseStartLevel);
            const end = Math.min(endLevel, phaseEndLevel);

            const levelDifference = end - start + 1;

            const totalXPForPhase = data.xpNeeded - (startPhase > 0 ? levelsData.ascensions[startPhase - 1].xpNeeded : 0);
            const phaseXPPerLevel = totalXPForPhase / (phaseEndLevel - phaseStartLevel + 1);
            const phaseMoraPerLevel = data.mora / (phaseEndLevel - phaseStartLevel + 1);

            totalXP += phaseXPPerLevel * levelDifference;
            totalMora += phaseMoraPerLevel * levelDifference;

            if (end >= endLevel) break;

            startPhase++;
        }

        moraDisplay.textContent = Math.round(totalMora);
        xpDisplay.textContent = Math.round(totalXP);

        // Calculate the number of books needed
        let remainingXP = totalXP;
        const herosWitCount = Math.floor(remainingXP / 20000);
        remainingXP %= 20000;

        const adventurersExperienceCount = Math.floor(remainingXP / 5000);
        remainingXP %= 5000;

        const wanderersAdviceCount = Math.ceil(remainingXP / 1000);

        herosWitDisplay.textContent = herosWitCount;
        adventurersExperienceDisplay.textContent = adventurersExperienceCount;
        wanderersAdviceDisplay.textContent = wanderersAdviceCount;
    }

    calculateBtn.addEventListener("click", calculateMoraXP);

    charImg.addEventListener("mouseenter", showPopup);
    wepBtn.addEventListener("mouseenter", showPopup);

    charImg.addEventListener("mouseleave", hidePopup);
    wepBtn.addEventListener("mouseleave", hidePopup);

    inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const inputValue = inputField.value;
            console.log(inputValue);
            hidePopup();
        }
    });

    function showPopup() {
        popup.style.display = "block";
        inputField.focus();
    }

    function hidePopup() {
        popup.style.display = "none";
        inputField.value = "";
    }
});
