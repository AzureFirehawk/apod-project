import { loadHeaderFooter, setFooterCopyright } from "./utils.mjs";
import { showApodInfo } from "./apodDisplay.mjs";
import { renderCalendar } from "./Calendar.mjs";

loadHeaderFooter();
showApodInfo().then(apodData => {
    if (apodData) {
        setFooterCopyright(apodData)
    }
}); 


const today = new Date();
renderCalendar(today.getMonth(), today.getFullYear());