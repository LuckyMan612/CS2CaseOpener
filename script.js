document.addEventListener("DOMContentLoaded", () => {
    const casesButton = document.getElementById("cases-button");
    const inventoryButton = document.getElementById("inventory-button");
    const upgraderButton = document.getElementById("upgrader-button");
    const allSkinsButton = document.getElementById("all-skins-button");

    const casesSection = document.getElementById("cases-section");
    const inventorySection = document.getElementById("inventory-section");
    const upgraderSection = document.getElementById("upgrader-section");
    const allSkinsSection = document.getElementById("all-skins-section");

    const openCaseButton = document.getElementById("open-case-button");
    const caseAnimation = document.getElementById("case-animation");
    const caseResult = document.getElementById("case-result");

    const inventory = document.getElementById("inventory");
    const allSkins = document.getElementById("all-skins");
    const upgradeOptions = document.getElementById("upgrade-options");

    let skins = [];
    let cases = [];
    let userInventory = [];

    fetch('data/skins.json')
        .then(response => response.json())
        .then(data => {
            skins = data;
            generateAllSkinsPages();
        });

    fetch('data/cases.json')
        .then(response => response.json())
        .then(data => {
            cases = data;
            displayCases();
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

    allSkinsButton.addEventListener("click", () => {
        setActiveSection(allSkinsSection);
    });

    openCaseButton.addEventListener("click", () => {
        openCase();
    });

    function setActiveSection(section) {
        casesSection.classList.remove("active");
        inventorySection.classList.remove("active");
        upgraderSection.classList.remove("active");
        allSkinsSection.classList.remove("active");
        section.classList.add("active");
    }

    function openCase() {
        caseAnimation.innerHTML = "Otwieranie skrzyni...";
        caseResult.innerHTML = "";
        setTimeout(() => {
            const skin = getRandomSkinFromCase(cases[0]);
            const price = generatePrice(skin);
            caseResult.innerHTML = `Zdobyłeś: ${skin.name} (${price}$)`;
            if (skin.image) {
                const img = document.createElement("img");
                img.src = skin.image;
                img.alt = skin.name;
                caseResult.appendChild(img);
            }
            userInventory.push({ ...skin, price });
        }, 2000);
    }

    function getRandomSkinFromCase(caseData) {
        const totalValue = caseData.skins.reduce((sum, skinName) => {
            const skin = skins.find(s => s.name === skinName);
            return sum + (skin ? skin.value : 0);
        }, 0);
        const randomValue = Math.random() * totalValue;
        let cumulativeValue = 0;
        for (const skinName of caseData.skins) {
            const skin = skins.find(s => s.name === skinName);
            if (skin) {
                cumulativeValue += skin.value;
                if (randomValue <= cumulativeValue) {
                    return skin;
                }
            }
        }
    }

    function generatePrice(skin) {
        const basePrice = {
            "Industrial Grade": 1,
            "Consumer Grade": 0.5,
            "Mil-Spec Grade": 5,
            "Restricted": 10,
            "Classified": 50,
            "Covert": 100,
            "Contraband": 200,
            "Extraordinary": 1000,
        };
        const multiplier = Math.random() * (1.5 - 0.5) + 0.5;
        return (basePrice[skin.rarity] * multiplier).toFixed(2);
    }

    function displayInventory() {
        inventory.innerHTML = "";
        userInventory.forEach(skin => {
            const skinDiv = document.createElement("div");
            skinDiv.classList.add("skin");
            skinDiv.innerHTML = `
                <p>${skin.name} (${skin.price}$)</p>
                <img src="${skin.image}" alt="${skin.name}">
            `;
            inventory.appendChild(skinDiv);
        });
    }

    function displayCases() {
        const caseContainer = document.getElementById("case-container");
        caseContainer.innerHTML = "";
        cases.forEach(caseData => {
            const caseDiv = document.createElement("div");
            caseDiv.classList.add("case");
            caseDiv.innerHTML = `
                <h3>${caseData.name}</h3>
                <p>${caseData.description}</p>
                <img src="${caseData.image}" alt="${caseData.name}">
            `;
            caseContainer.appendChild(caseDiv);
        });
    }

    function generateAllSkinsPages() {
        allSkins.innerHTML = "";
        const skinsPerPage = 20;
        const totalPages = Math.ceil(skins.length / skinsPerPage);
        for (let page = 0; page < totalPages; page++) {
            const pageDiv = document.createElement("div");
            pageDiv.classList.add("skins-page");
            if (page > 0) {
                pageDiv.style.display = "none";
            }
            const start = page * skinsPerPage;
            const end = start + skinsPerPage;
            skins.slice(start, end).forEach(skin => {
                const skinDiv = document.createElement("div");
                skinDiv.classList.add("skin");
                skinDiv.innerHTML = `
                    <p>${skin.name}</p>
                    <img src="${skin.image}" alt="${skin.name}">
                `;
                pageDiv.appendChild(skinDiv);
            });
            allSkins.appendChild(pageDiv);
        }

        const pagination = document.createElement("div");
        pagination.classList.add("pagination");
        for (let page = 0; page < totalPages; page++) {
            const pageButton = document.createElement("button");
            pageButton.innerText = page + 1;
            pageButton.addEventListener("click", () => {
                document.querySelectorAll(".skins-page").forEach((el, index) => {
                    el.style.display = index === page ? "block" : "none";
                });
            });
            pagination.appendChild(pageButton);
        }
        allSkins.appendChild(pagination);
    }
});
