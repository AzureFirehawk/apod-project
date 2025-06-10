import { loadHeaderFooter } from "./utils.mjs";
import { showApodInfo } from "./apodDisplay.mjs";
import { renderCalendar } from "./Calendar.mjs";

loadHeaderFooter();

document.querySelector("h2").innerHTML = "Astronomy Picture of the Day | "
    + new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
});

function getDateFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get('date') || undefined;
}

const date = getDateFromQuery();
showApodInfo(date);

const today = new Date();
renderCalendar(today.getMonth(), today.getFullYear());