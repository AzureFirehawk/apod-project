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

    // Error checking, if APOD is already in favorites
    const exists = favorites.find(favorite => favorite.date === apodData.date);
    if (exists) {
        return { success: false, message: "Already in favorites!" };
    }

    favorites.push(apodData);
    setLocalStorage(STORAGE_KEY, favorites);
    return { success: true, message: "Added to favorites!" };
}

export function removeFavorite(date) {
    const favorites = getFavorites();
    const newFavorites = favorites.filter(favorite => favorite.date !== date);
    
    // Error checking, if APOD is not in favorites
    if (favorites.length === newFavorites.length) { 
        return { success: false, message: "Not in favorites!" };
    }
    
    setLocalStorage(STORAGE_KEY, newFavorites);
    return { success: true, message: "Removed from favorites!" };
}