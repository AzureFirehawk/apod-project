import { loadHeaderFooter } from "./utils.mjs";
import { getFavorites } from "./FavoritesStorage.mjs";

loadHeaderFooter();

function favoriteCardTemplate(favorite) {
    const { date, title, url } = favorite;
    const formatDate = new Date(date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
    })
    return `
        <div class="favorite-card">
            <a href="result.html?date=${date}">
                <img src="${url}" alt="${title}">
                <h3>${title}</h3>
                <p>${formatDate}</p>
            </a>
            <button class="remove-favorite" data-date="${date}">Remove</button>
        </div>
    `;
}