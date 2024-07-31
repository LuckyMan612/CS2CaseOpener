document.addEventListener("DOMContentLoaded", () => {
    const casesButton = document.getElementById("cases-button");
    const inventoryButton = document.getElementById("inventory-button");
    const upgraderButton = document.getElementById("upgrader-button");

    const casesSection = document.getElementById("cases-section");
    const inventorySection = document.getElementById("inventory-section");
    const upgraderSection = document.getElementById("upgrader-section");

    const openCaseButton = document.getElementById("open-case-button");
    const caseAnimation = document.getElementById("case-animation");
    const caseResult = document.getElementById("case-result");

    const inventory = document.getElementById("inventory");

    let skins = [];
    let userInventory = [];

    fetch('data/skins.json')
        .then(response => response.json())
        .then(data => {
            skins = data;
        });

    casesButton.addEventListener("click", () => {
        setActiveSection(casesSection);
    });

    inventoryButton.addEventListener("click", () => {
        setActiveSection(inventorySection);
        displayInventory();
    });

    upgraderButton.addEventListener("click", () => {
        setActiveSection(upgraderSection);
    });

    openCaseButton.addEventListener("click", () => {
        openCase();
    });

    function setActiveSection(section) {
        casesSection.classList.remove("active");
        inventorySection.classList.remove("active");
        upgraderSection.classList.remove("active");
        section.classList.add("active");
    }

    function openCase() {
        caseAnimation.innerHTML = "Otwieranie skrzyni...";
        caseResult.innerHTML = "";
        setTimeout(() => {
            const skin = getRandomSkin();
            caseResult.innerHTML = `Zdobyłeś: ${skin.name}`;
            if (skin.image) {
                const img = document.createElement("img");
                img.src = skin.image;
                img.alt = skin.name;
                caseResult.appendChild(img);
            }
            userInventory.push(skin);
        }, 2000);
    }

    function getRandomSkin() {
        const totalValue = skins.reduce((sum, skin) => sum + skin.value, 0);
        const randomValue = Math.random() * totalValue;
        let cumulativeValue = 0;
        for (const skin of skins) {
            cumulativeValue += skin.value;
            if (randomValue <= cumulativeValue) {
                return skin;
            }
        }
    }

    function displayInventory() {
        inventory.innerHTML = "";
        userInventory.forEach(skin => {
            const skinDiv = document.createElement("div");
            skinDiv.classList.add("skin");
            skinDiv.innerHTML = skin.name;
            inventory.appendChild(skinDiv);
        });
    }
});
