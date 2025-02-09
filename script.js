document.addEventListener("DOMContentLoaded", async () => {
    const categoryList = document.getElementById("categoryList");
    const tableBody = document.querySelector("#slangTable tbody");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const searchResult = document.getElementById("searchResult");

    let slangData = {}; 
    let allWords = {}; 

    try {
        const response = await fetch("slang.json");
        slangData = await response.json();
        loadCategories();
        createAllSlangCategory();
    } catch (error) {
        console.error("Ошибка загрузки:", error);
        tableBody.innerHTML = "<tr><td colspan='3'>Ошибка загрузки данных</td></tr>";
    }

    // Load categories into sidebar
    function loadCategories() {
        categoryList.innerHTML = ""; 
        const allCategories = ["Все сленги", ...Object.keys(slangData)];

        allCategories.forEach(category => {
            const listItem = document.createElement("li");
            const button = document.createElement("button");
            button.textContent = category;
            button.setAttribute("data-category", category);
            button.classList.add("category-btn");

            button.addEventListener("click", () => {
                if (category === "Все сленги") {
                    displaySlang(allWords);
                } else {
                    displaySlang(slangData[category]);
                }
            });

            listItem.appendChild(button);
            categoryList.appendChild(listItem);
        });
    }

    // Create a combined category for all words
    function createAllSlangCategory() {
        allWords = {};
        Object.values(slangData).forEach(category => {
            Object.assign(allWords, category);
        });
    }

    // Display words in the table
    function displaySlang(words) {
        tableBody.innerHTML = Object.keys(words)
            .map(word => `
                <tr>
                    <td>${word}</td>
                    <td class="hidden">${words[word]}</td>
                    <td>
                        <button class="show-translation">👁</button>
                    </td>
                </tr>
            `).join("");

        document.querySelectorAll(".show-translation").forEach((button, index) => {
            button.addEventListener("click", () => {
                const translationCell = tableBody.rows[index].cells[1];
                translationCell.classList.toggle("hidden");
            });
        });
    }

    // Search functionality
    searchBtn.addEventListener("click", () => {
        const inputWord = searchInput.value.trim().toLowerCase();
        let foundWord = null;
        let foundCategory = null;

        Object.keys(slangData).forEach(category => {
            Object.keys(slangData[category]).forEach(word => {
                if (word.toLowerCase() === inputWord) {
                    foundWord = slangData[category][word];
                    foundCategory = category;
                }
            });
        });

        searchResult.textContent = foundWord
            ? `${inputWord} (${foundCategory}): ${foundWord}`
            : "Слово не найдено!";
    });
});
