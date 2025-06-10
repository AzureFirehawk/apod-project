import { loadHeaderFooter } from "./utils.mjs";
import { getFavorites } from "./FavoritesList.mjs";

loadHeaderFooter();

function favoriteCardTemplate(favorite) {
    const { date, title, url } = favorite;
    return `
        <div class="favorite-card">
        <img src="${url}" alt="${title}">
        <h3>${title}</h3>
        <p>${date}</p>
        </div>
    `;
}