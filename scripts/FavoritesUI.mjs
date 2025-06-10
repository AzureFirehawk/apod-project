import { isFavorite, addFavorite, removeFavorite } from "./Favorites.mjs";

function handleAddFavorite(apodData) {
    const result = addFavorite(apodData);
    if (result.success) {
        updateFavoriteButton(apodData);
        // Optional: show success message
    } else {
        alert(result.message);
    }
}

function handleRemoveFavorite(apodData) {
    const result = removeFavorite(apodData.date);
    if (result.success) {
        updateFavoriteButton(apodData);
        // Optional: show success message
    } else {
        alert(result.message);
    }
}

export function updateFavoriteButton(apodData) {
    const button = document.getElementById("favorite-button");
    if (!button) return;

    if (isFavorite(apodData.date)) {
        button.textContent = "Remove from favorites";
        button.onclick = () => handleRemoveFavorite(apodData);
    } else {
        button.textContent = "Add to favorites";
        button.onclick = () => handleAddFavorite(apodData);
    }
}
