import { showToast } from "./utils.mjs";

// Template for card layout
function favoriteCardTemplate(favorite) {
    const { date, title, url, relatedTopic } = favorite;
    const formatDate = new Date(date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
    })

    return `
        <div class="favorite-card-container">
            <div class="favorite-card">
                <div class="card-front">
                    <a href="result.html?date=${date}">
                        <img src="${url}" alt="${title}" class="favorite-thumbnail">
                    </a>
                    <a href="result.html?date=${date}" class="favorite-link">
                        <h3>${title}</h3>
                        <p>${formatDate}</p>
                    </a>
                    <div class="button-row">
                        <button class="remove-favorite" data-date="${date}">Remove</button>
                        ${relatedTopic ? `<button class="more-info">More</button>` : ""}
                    </div>
                </div>
                ${relatedTopic ? `
                    <div class="card-back">
                        <h4>${relatedTopic.wikiTitle}</h4>
                        <p>${relatedTopic.wikiSummary}</p>
                        <a href="${relatedTopic.wikiUrl}" target="_blank">Read more on Wikipedia</a>
                        <button class="back-button">Back</button>
                    </div>
                ` : ""}                
            </div>
        </div>`;
}

export default class FavoriteCard {
    constructor(favorite, onRemoveCallback = null) {
        this.favorite = favorite;
        this.onRemove = onRemoveCallback;
        this.element = this.createCard()
    }

    createCard() {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = favoriteCardTemplate(this.favorite).trim();

        const container = wrapper.firstElementChild;
        const card = container.querySelector(".favorite-card")

        const removeButton = container.querySelector(".remove-favorite");
        removeButton.addEventListener("click", () => {
            container.classList.add("fade-out");
            setTimeout(() => this.onRemove(this.favorite), 300);
            showToast("Removed from favorites");
        });

        const moreButton = container.querySelector(".more-info");
        const backButton = container.querySelector(".back-button");

        if (moreButton && backButton) {
            moreButton.addEventListener("click", () => container.classList.add("flipped"));
            backButton.addEventListener("click", () => container.classList.remove("flipped"));
        }

        return container;
    }

    getElement() {
        return this.element;
    }
}