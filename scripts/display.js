import { loadHeaderFooter } from "./utils.mjs";
import { showApodInfo } from "./apodDisplay.mjs";

loadHeaderFooter();

function getDateFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get('date') || undefined;
}

const date = getDateFromQuery();
showApodInfo(date);