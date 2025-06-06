import { loadHeaderFooter } from "./utils.mjs";
import { showApodInfo } from "./apodDisplay.mjs";
import { renderCalendar } from "./Calendar.mjs";

loadHeaderFooter();
showApodInfo(); 

const today = new Date();
renderCalendar(today.getMonth(), today.getFullYear());