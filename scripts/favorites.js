import { loadHeaderFooter } from "./utils.mjs";
import { getFavorites, removeFavorite } from "./FavoritesStorage.mjs";
import { createApodCard } from "./apodCard.mjs";

loadHeaderFooter();

const container = document.getElementById("cards-container");

function renderFavorites() {
    container.innerHTML = ""; // Clear old content

    const favorites = getFavorites();

    if (favorites.length === 0) {
        container.innerHTML = "<p>No favorites yet.</p>";
        return;
    }

    favorites.forEach(favorite => {
        const card = createApodCard(favorite, {
            showExplanation: true,
            isFlippable: true,    
            showRemoveButton: true,
            onRemove: () => {
                removeFavorite(favorite.date);
                renderFavorites();
            }
        });
        container.appendChild(card);
    });
}

renderFavorites();
