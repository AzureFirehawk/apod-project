export function createApodCard(apod, options = {}) {
    const {
        showExplanation = false,
        isFlippable = false,
        onRemove = null,
        showRemoveButton = false
    } = options;

    const card = document.createElement("article");
    card.classList.add("apod-card");
    if (isFlippable) card.classList.add("flippable");

    card.innerHTML = `
        <div class="card-front">
            <h3>${apod.title}</h3>
            <img src="${apod.url}" alt="${apod.title}" loading="lazy">
            <p><strong>Date:</strong> ${apod.date}</p>
            ${showRemoveButton ? `<button class="remove-btn">Remove</button>` : ''}
        </div>
        ${showExplanation ? `
        <div class="card-back">
            <p>${apod.explanation}</p>
        </div>` : ''}
    `;

    if (showRemoveButton) {
        card.querySelector(".remove-btn").addEventListener("click", () => {
            if (onRemove) onRemove(apod.date);
        });
    }

    return card;
}
