import { isFavorite } from "./FavoritesStorage.mjs";


const calendar = document.getElementById("calendar");
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


export function renderCalendar(month, year) {
    const apodStart = new Date("1995-06-16");
    const today = new Date();
    const apodStartYear = apodStart.getFullYear();
    const currentYear = today.getFullYear();

    // Clear previous calendar content
    document.querySelector(".calendar-header")?.remove();
    document.querySelector(".calendar-dropdowns")?.remove();
    calendar.innerHTML = "";

    const header = document.createElement("div");
    header.classList.add("calendar-header");

    const prevBtn = createNavButton("prev", "&laquo;");
    const nextBtn = createNavButton("next", "&raquo;");

    let selectedYear = year;

    // Reuse or create monthLabel
    let monthLabel = document.querySelector(".month-label");
    if (!monthLabel) {
        monthLabel = document.createElement("span");
        monthLabel.className = "month-label month-picker-trigger";
    }

    // Update text
    monthLabel.textContent = `${new Date(year, month).toLocaleString("default", { month: "long" })} ${year}`;

    const picker = createMonthYearPicker();

    const labelWrapper = document.createElement("div");
    labelWrapper.classList.add("label-wrapper");
    labelWrapper.append(monthLabel, picker);

    header.append(prevBtn, labelWrapper, nextBtn);
    calendar.before(header);

    // Weekday labels
    daysOfWeek.forEach(day => {
        const dayEl = document.createElement("div");
        dayEl.className = "calendar-day";
        dayEl.textContent = day;
        calendar.appendChild(dayEl);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) calendar.append(document.createElement("div"));

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dateEl = document.createElement("div");
        dateEl.className = "calendar-date";
        dateEl.textContent = day;
        dateEl.style.setProperty("--delay", `${(day - 1) * 0.02}s`);

        if (currentDate >= apodStart && currentDate <= today) {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            dateEl.onclick = () => (window.location.href = `result.html?date=${dateStr}`);

            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                dateEl.classList.add("today");
            }

            if (isFavorite(dateStr)) {
                dateEl.classList.add("favorite")
            };
        } else {
            dateEl.classList.add("disabled");
        }


        calendar.appendChild(dateEl);
    }

    prevBtn.onclick = () => {
        const newMonth = month - 1 < 0 ? 11 : month - 1;
        const newYear = month - 1 < 0 ? year - 1 : year;
        renderCalendar(newMonth, newYear, "left");
    };

    nextBtn.onclick = () => {
        const newMonth = month + 1 > 11 ? 0 : month + 1;
        const newYear = month + 1 > 11 ? year + 1 : year;
        renderCalendar(newMonth, newYear, "right");
    };

    function createNavButton(id, html) {
        const btn = document.createElement("button");
        btn.id = id;
        btn.innerHTML = html;
        return btn;
    }

    function createMonthYearPicker() {
        const picker = document.createElement("div");
        picker.classList.add("month-year-picker");

        const monthNames = [...Array(12)].map((_, i) =>
            new Date(0, i).toLocaleString("default", { month: "short" })
        );

        const yearNav = document.createElement("div");
        yearNav.classList.add("year-nav");
        yearNav.innerHTML = `
            <button id="yearPrev">&laquo;</button>
            <span id="pickerYear">${selectedYear}</span>
            <button id="yearNext">&raquo;</button>
        `;
        picker.append(yearNav);

        yearNav.querySelector("#yearPrev").onclick = () => updatePickerYear(-1);
        yearNav.querySelector("#yearNext").onclick = () => updatePickerYear(1);

        function updatePickerYear(change) {
            selectedYear += change;
            selectedYear = Math.max(apodStartYear, Math.min(currentYear, selectedYear));
            yearNav.querySelector("#pickerYear").textContent = selectedYear;
            updateMonthButtons();
        }

        function updateMonthButtons() {
            picker.querySelectorAll(".month-year-picker button:not(.year-nav button)").forEach(btn => btn.remove());

            monthNames.forEach((m, i) => {
                const btn = document.createElement("button");
                btn.textContent = m;

                if (selectedYear === apodStartYear && i < 5) {
                    btn.disabled = true;
                    btn.classList.add("disabled-month");
                } else {
                    btn.onclick = () => {
                        renderCalendar(i, selectedYear, "none");
                        picker.classList.remove("active");
                    };
                }

                picker.appendChild(btn);
            });
        }

        updateMonthButtons();

        monthLabel.addEventListener("click", () => {
            picker.classList.toggle("active");
            picker.querySelector("#pickerYear").textContent = selectedYear;
        });

        return picker;
    }
}
