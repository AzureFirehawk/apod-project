const calendar = document.getElementById("calendar");
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function renderCalendar(month, year, direction="right") {

    // Clear existing calendar header
    const existingHeader = document.querySelector(".calendar-header");
    if (existingHeader) {
        existingHeader.remove();
    }

    // Clear existing calendar dropdowns
    const existingDropdowns = document.querySelector(".calendar-dropdowns");
    if (existingDropdowns) {
        existingDropdowns.remove();
    }

    calendar.innerHTML = "";

    const header = document.createElement("div");
    header.classList.add("calendar-header");

    // Prev button
    const prevBtn = document.createElement("button");
    prevBtn.id = "prev";
    prevBtn.innerHTML = "&laquo;";

    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.id = "next";
    nextBtn.innerHTML = "&raquo;";

    // Month label with animation
    const monthLabel = document.createElement("span");
    monthLabel.classList.add("month-label");
    monthLabel.classList.add("month-picker-trigger");
    monthLabel.textContent = `${new Date(year, month).toLocaleString("default", { month: "long" })} ${year}`;

    if (direction !== "none") {
        monthLabel.classList.add(direction === "left" ? "slide-left" : "slide-right");
    }

    header.appendChild(prevBtn);
    header.appendChild(monthLabel);
    header.appendChild(nextBtn);

    calendar.before(header);

    // Create weekday labels
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

    // Create date elements
    const apodStart = new Date("1995-06-16"); // APOD start date
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dateEl = document.createElement("div");
        dateEl.className = "calendar-date";
        dateEl.textContent = day;

        // set animation delay for cascading effect
        dateEl.style.setProperty("--delay", `${(day - 1) * 0.02}s`);
        
        // Disable dates before APOD start date and after current date
        const currentDate = new Date(year, month, day);
        if (currentDate >= apodStart && currentDate <= today) {
            
            const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
            dateEl.addEventListener("click", () => {
                window.location.href = `result.html?date=${dateStr}`;
            });

            // Highlight current date
            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                dateEl.classList.add("today");
            }
        } else {
            dateEl.classList.add("disabled");
        }
        calendar.appendChild(dateEl);
    }

    // Add navigation buttons with animation logic
    document.getElementById("prev").onclick = () => {
        const newMonth = month - 1 < 0 ? 11 : month - 1;
        const newYear = month - 1 < 0 ? year - 1 : year;
        renderCalendar(newMonth, newYear, "left");
    };

    document.getElementById("next").onclick = () => {
        const newMonth = month + 1 > 11 ? 0 : month + 1;
        const newYear = month + 1 > 11 ? year + 1 : year;
        renderCalendar(newMonth, newYear, "right");
      };
}
