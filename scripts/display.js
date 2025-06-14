import { loadHeaderFooter, setFooterCopyright } from "./utils.mjs";
import { showApodInfo } from "./apodDisplay.mjs";
import { renderCalendar } from "./Calendar.mjs";

loadHeaderFooter();


function getDateFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get('date') || undefined;
}

const dateStr = getDateFromQuery();
const date = dateStr ? parseDateAsLocal(dateStr) : new Date();

showApodInfo(dateStr).then(apodData => {
  if (apodData) {
    setFooterCopyright(apodData)
  }
});; // keep passing original string if your API expects it

document.querySelector("title").innerHTML = "StellarScope | APOD " 
  + date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

document.querySelector("h2").innerHTML = "Astronomy Picture of the Day | " 
  + date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

const today = new Date();
renderCalendar(today.getMonth(), today.getFullYear());

function parseDateAsLocal(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}
