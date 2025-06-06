import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", () => {
    const calendar = new VanillaCalendar('#calendar', {
        type: 'default',
        settings: {
            range: {
                min: '1995-06-16', // APOD earliest date
                max: new Date().toISOString().split('T')[0],
            },
            visibility: {
                weekend: true,
                daysOutside: true,
                today: true,
            },
        },
        actions: {
            clickDay(event, self) {
                const selectedDate = self.selectedDates[0];
                if (selectedDate) {
                    window.location.href = `result.html?date=${selectedDate}`;
                }
            }
        }
    });

    calendar.init();
});
