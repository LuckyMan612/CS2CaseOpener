document.addEventListener("DOMContentLoaded", () => {
    const casesButton = document.getElementById("cases-button");
    const inventoryButton = document.getElementById("inventory-button");
    const upgraderButton = document.getElementById("upgrader-button");
    const shopButton = document.getElementById("shop-button");
    const allSkinsButton = document.getElementById("all-skins-button");

    const casesSection = document.getElementById("cases-section");
    const caseDetailsSection = document.getElementById("case-details-section");
    const inventorySection = document.getElementById("inventory-section");
    const upgraderSection = document.getElementById("upgrader-section");
    const shopSection = document.getElementById("shop-section");
    const allSkinsSection = document.getElementById("all-skins-section");

    const caseAnimation = document.getElementById("case-animation");
    const caseResult = document.getElementById("case-result");

    const inventory = document.getElementById("inventory");
    const allSkins = document.getElementById("all-skins");
    const upgradeOptions = document.getElementById("upgrade-options");
    const selectedSkins = document.getElementById("selected-skins");
    const shop = document.getElementById("shop");

    let skins = [];
    let cases = [];
    let userInventory = [];
    let userBalance = 0;
    let selectedUpgradeSkins = [];
    let currentCase = null;

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
        displayUpgradeOptions();
    });

    shopButton.addEventListener("click", () => {
        setActiveSection(shopSection);
        displayShop();
    });

    allSkinsButton.addEventListener("click", () => {
        setActiveSection(allSkinsSection);
    });

    function setActiveSection(section) {
        casesSection.classList.remove("active");
        caseDetailsSection.classList.remove("active");
        inventorySection.classList.remove("active");
        upgraderSection.classList.remove("active");
        shopSection.classList.remove("active");
        allSkinsSection.classList.remove("active");
        section.classList.add("active");
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
            caseDiv.addEventListener("click", () => {
                showCaseDetails(caseData);
            });
            caseContainer.appendChild(caseDiv);
        });
    }

    function showCaseDetails(caseData) {
        currentCase = caseData;
        document.getElementById("case-name").innerText = caseData.name;
        document.getElementById("case-image").src = caseData.image;
        caseResult.innerHTML = "";
        caseAnimation.innerHTML = "";
        displayCaseSkins(caseData.skins);
        setActiveSection(caseDetailsSection);
    }

    function displayCaseSkins(skins) {
        const caseSkins = document.getElementById("case-skins");
        caseSkins.innerHTML = "";
        skins.forEach(skinName => {
            const skin = skins.find(s => s.name === skinName);
            if (skin) {
                const skinDiv = document.createElement("div");
                skinDiv.classList.add("skin");
                skinDiv.innerHTML = `
                    <p>${skin.name}</p>
                    <img src="${skin.image}" alt="${skin.name}">
                `;
                caseSkins.appendChild(skinDiv);
            }
        });
    }

    document.getElementById("open-case-button").addEventListener("click", () => {
        if (currentCase) {
            openCase(currentCase);
        }
    });

    function openCase(caseData) {
        const randomSkin = getRandomSkinFromCase(caseData.skins);
        const price = generatePrice(randomSkin);
        userInventory.push({ ...randomSkin, price });
        animateCaseOpening(randomSkin, price);
    }

    function getRandomSkinFromCase(caseSkins) {
        const totalValue = caseSkins.reduce((acc, skinName) => {
            const skin = skins.find(s => s.name === skinName);
            return acc + (skin ? skin.value : 0);
        }, 0);

        let randomValue = Math.random() * totalValue;
        let cumulativeValue = 0;

        for (const skinName of caseSkins) {
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

    function animateCaseOpening(skin, price) {
        caseAnimation.innerHTML = `
            <div class="animation-box">Otwarcie skrzyni...</div>
        `;
        setTimeout(() => {
            caseAnimation.innerHTML = "";
            showCaseResult(skin, price);
        }, 2000); // Adjust the duration as needed
    }

    function showCaseResult(skin, price) {
        caseResult.innerHTML = `
            <h3>Zdobyłeś: ${skin.name}</h3>
            <p>Cena: ${price}$</p>
            <img src="${skin.image}" alt="${skin.name}">
            <button id="sell-skin-button">Sprzedaj</button>
            <button id="upgrade-skin-button">Ulepsz</button>
        `;

        document.getElementById("sell-skin-button").addEventListener("click", () => {
            sellSkin(skin, price);
        });

        document.getElementById("upgrade-skin-button").addEventListener("click", () => {
            upgradeSkin(skin);
        });
    }

    function sellSkin(skin, price) {
        userInventory = userInventory.filter(s => s.name !== skin.name);
        userBalance += parseFloat(price);
        displayInventory();
        displayShop();
        alert(`Sprzedałeś ${skin.name} za ${price}$`);
    }

    function upgradeSkin(skin) {
        selectedUpgradeSkins.push(skin);
        if (selectedUpgradeSkins.length <= 3) {
            displaySelectedUpgradeSkins();
        }
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
            skinDiv.addEventListener("click", () => {
                showInventorySkinOptions(skin);
            });
            inventory.appendChild(skinDiv);
        });
    }

    function showInventorySkinOptions(skin) {
        caseResult.innerHTML = `
            <h3>${skin.name}</h3>
            <p>Cena: ${skin.price}$</p>
            <img src="${skin.image}" alt="${skin.name}">
            <button id="sell-skin-button">Sprzedaj</button>
            <button id="upgrade-skin-button">Ulepsz</button>
        `;

        document.getElementById("sell-skin-button").addEventListener("click", () => {
            sellSkin(skin, skin.price);
        });

        document.getElementById("upgrade-skin-button").addEventListener("click", () => {
            upgradeSkin(skin);
        });
    }

    function displayUpgradeOptions() {
        upgradeOptions.innerHTML = "";
        userInventory.forEach(skin => {
            const skinDiv = document.createElement("div");
            skinDiv.classList.add("skin");
            skinDiv.innerHTML = `
                <p>${skin.name} (${skin.price}$)</p>
                <img src="${skin.image}" alt="${skin.name}">
            `;
            skinDiv.addEventListener("click", () => {
                upgradeSkin(skin);
            });
            upgradeOptions.appendChild(skinDiv);
        });
    }

    function displaySelectedUpgradeSkins() {
        selectedSkins.innerHTML = "";
        selectedUpgradeSkins.forEach(skin => {
            const skinDiv = document.createElement("div");
            skinDiv.classList.add("skin");
            skinDiv.innerHTML = `
                <p>${skin.name} (${skin.price}$)</p>
                <img src="${skin.image}" alt="${skin.name}">
            `;
            selectedSkins.appendChild(skinDiv);
        });
    }

    document.querySelectorAll(".upgrade-multiplier").forEach(button => {
        button.addEventListener("click", () => {
            const multiplier = parseFloat(button.dataset.multiplier);
            upgradeSelectedSkins(multiplier);
        });
    });

    function upgradeSelectedSkins(multiplier) {
        const totalValue = selectedUpgradeSkins.reduce((acc, skin) => acc + parseFloat(skin.price), 0);
        const targetValue = totalValue * multiplier;
        const targetSkin = skins.find(skin => parseFloat(skin.price) >= targetValue);
        if (targetSkin) {
            userInventory = userInventory.filter(skin => !selectedUpgradeSkins.includes(skin));
            userInventory.push({ ...targetSkin, price: targetValue.toFixed(2) });
            selectedUpgradeSkins = [];
            displayInventory();
            displayUpgradeOptions();
            alert(`Ulepszyłeś skiny do ${targetSkin.name} o wartości ${targetValue.toFixed(2)}$`);
        } else {
            alert("Nie znaleziono skina o odpowiedniej wartości do ulepszenia.");
        }
    }

    function displayShop() {
        shop.innerHTML = "";
        skins.forEach(skin => {
            const skinDiv = document.createElement("div");
            skinDiv.classList.add("skin");
            skinDiv.innerHTML = `
                <p>${skin.name} (${skin.price}$)</p>
                <img src="${skin.image}" alt="${skin.name}">
                <button class="buy-skin-button">Kup</button>
            `;
            skinDiv.querySelector(".buy-skin-button").addEventListener("click", () => {
                buySkin(skin);
            });
            shop.appendChild(skinDiv);
        });
    }

    function buySkin(skin) {
        const price = parseFloat(skin.price);
        if (userBalance >= price) {
            userBalance -= price;
            userInventory.push(skin);
            displayInventory();
            displayShop();
            alert(`Kupiłeś ${skin.name} za ${price}$`);
        } else {
            alert("Nie masz wystarczającej ilości pieniędzy.");
        }
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
                document.querySelectorAll(".skins-page").forEach((pageDiv, index) => {
                    pageDiv.style.display = index === page ? "block" : "none";
                });
            });
            pagination.appendChild(pageButton);
        }
        allSkins.appendChild(pagination);
    }
});
