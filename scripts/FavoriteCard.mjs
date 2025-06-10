import { showToast } from "./utils.mjs";

// Template for card layout
function favoriteCardTemplate(favorite) {
    const { date, title, url } = favorite;
    const formatDate = new Date(date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
    })
    return `
        <div class="favorite-card">
            <a href="result.html?date=${date}">
                <img src="${url}" alt="${title}" class="favorite-thumbnail">
            </a>
            <a href="result.html?date=${date}" class="favorite-link">
                <h3>${title}</h3>
                <p>${formatDate}</p>
            </a>
            <button class="remove-favorite" data-date="${date}">Remove</button>
        </div>
    `;
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

        const card = wrapper.firstElementChild;

        const removeButton = card.querySelector(".remove-favorite");
        removeButton.addEventListener("click", () => {
            this.element.classList.add("fade-out");

            setTimeout(() => {
                this.onRemove(this.favorite);
            }, 300)

            showToast("Removed from favorites");
        });

        return card;
    }
    getElement() {
        return this.element;
    }
}