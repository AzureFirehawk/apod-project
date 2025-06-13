import { setLocalStorage, getLocalStorage } from "./utils.mjs";

const STORAGE_KEY = "apod-favorites";

export function getFavorites(sortOrder = 'desc') {
    const favorites = getLocalStorage(STORAGE_KEY) || [];
    favorites.sort((a, b) => {
        return sortOrder === 'asc'
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
    });
    return favorites;
}

export function isFavorite(date) {
    const favorites = getFavorites();
    return favorites.some(favorite => favorite.date === date);
}

export function addFavorite(apodData) {
    const favorites = getLocalStorage(STORAGE_KEY) || [];

    if (favorites.find(fav => fav.date === apodData.date)) {
        return { success: false, message: "Already in favorites!" };
    }

    const data = {
        title: apodData.title,
        date: apodData.date,
        media_type: apodData.media_type,
        url: apodData.url || apodData.hdurl,
        explanation: apodData.explanation
    };

    favorites.push(data);
    setLocalStorage(STORAGE_KEY, favorites);
    return { success: true, message: "Added to favorites!" };
}

export function removeFavorite(date) {
    const favorites = getFavorites();
    const newFavorites = favorites.filter(fav => fav.date !== date);
    if (favorites.length === newFavorites.length) {
        return { success: false, message: "Not in favorites!" };
    }
    setLocalStorage(STORAGE_KEY, newFavorites);
    return { success: true, message: "Removed from favorites!" };
}