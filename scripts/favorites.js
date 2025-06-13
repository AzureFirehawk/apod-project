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
                // Animate before removing
                card.classList.add("removing");

                // Wait for animation to finish before removing
                setTimeout(() => {
                    removeFavorite(favorite.date);
                    renderFavorites();
                }, 400); // Match animation duration
            }
        });
        container.appendChild(card);
    });
}

renderFavorites();
