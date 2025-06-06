const calendar = document.getElementById("calendar");
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function renderCalendar(month, year) {
    calendar.innerHTML = "";

    const header = document.createElement("div");
    header.classList.add("calendar-header");
    header.innerHTML = `
      <button id="prev">&laquo;</button>
      <span>${new Date(year, month).toLocaleString("default", { month: "long" })} ${year}</span>
      <button id="next">&raquo;</button>
    `;
    calendar.before(header);

    daysOfWeek.forEach(day => {
        const dayEl = document.createElement("div");
        dayEl.className = "calendar-day";
        dayEl.textContent = day;
        calendar.appendChild(dayEl);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        calendar.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateEl = document.createElement("div");
        dateEl.className = "calendar-date";
        dateEl.textContent = day;

        const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        dateEl.addEventListener("click", () => {
            window.location.href = `result.html?date=${dateStr}`;
        });

        calendar.appendChild(dateEl);
    }

    document.getElementById("prev").onclick = () => renderCalendar(month - 1 < 0 ? 11 : month - 1, month - 1 < 0 ? year - 1 : year);
    document.getElementById("next").onclick = () => renderCalendar(month + 1 > 11 ? 0 : month + 1, month + 1 > 11 ? year + 1 : year);
}
