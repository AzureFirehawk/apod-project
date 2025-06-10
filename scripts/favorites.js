import { loadHeaderFooter } from "./utils.mjs";
import { getFavorites, removeFavorite } from "./FavoritesStorage.mjs";
import FavoriteCard from "./FavoriteCard.mjs";

loadHeaderFooter();

const container = document.getElementById("cards-container");

function renderFavorites() {
    container.innerHTML = ""; // Clear old content

    const favorites = getFavorites();

    if (favorites.length === 0) {
        container.innerHTML = "<p>No favorites yet.</p>";
        return;
    }
    favorites.forEach((favorite) => {
        const card = new FavoriteCard(favorite, (favToRemove) => {
            removeFavorite(favToRemove.date);
            renderFavorites();
        });
        container.appendChild(card.getElement());
    });
}

renderFavorites();