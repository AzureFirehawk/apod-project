import { isFavorite, addFavorite, removeFavorite } from "./FavoritesStorage.mjs";

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
    const button = document.getElementById("save-favorite");
    if (!button) return;

    if (isFavorite(apodData.date)) {
        button.textContent = "★ Remove Favorite";
        button.classList.add("saved");
        button.onclick = () => handleRemoveFavorite(apodData);
    } else {
        button.textContent = "☆ Add to Favorites";
        button.classList.remove("saved");
        button.onclick = () => handleAddFavorite(apodData);
    }
}
