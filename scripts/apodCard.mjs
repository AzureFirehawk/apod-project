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

    const front = document.createElement("div");
    front.classList.add("card-front");

    // Media Content
    let mediaHTML = "";
    if (apod.media_type === "image") {
        mediaHTML = `<img src="${apod.url}" alt="${apod.title}" loading="lazy">`;
    } else if (apod.media_type === "video") {
        mediaHTML = `
            <div class="video-wrapper">
                <iframe src="${apod.url}" frameborder="0" allowfullscreen loading="lazy"></iframe>
            </div>
        `;
    } else {
        mediaHTML = `<p>Unsupported media type: ${apod.media_type}</p>`;
    }
    
    front.innerHTML = `
        <a href="result.html?date=${apod.date}">
            ${mediaHTML}
        </a>
        <a href="result.html?date=${apod.date}">
            <h3>${apod.title}</h3>
            <p><strong>Date:</strong> ${apod.date}</p>
        </a>
    `;

    // "More" button to flip
    if (isFlippable && showExplanation) {
        const moreBtn = document.createElement("button");
        moreBtn.textContent = "More";
        moreBtn.classList.add("flip-btn");
        moreBtn.addEventListener("click", () => {
            card.classList.add("flipped");
        });
        front.appendChild(moreBtn);
    }
    
    // Remove button for favorites
    if (showRemoveButton) {
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-btn");
        removeBtn.addEventListener("click", () => {
            if (onRemove) onRemove(apod.date);
        });
        front.appendChild(removeBtn);
    }

    card.appendChild(front);

    // Back content
    if (showExplanation) {
        const back = document.createElement("div");
        back.classList.add("card-back");
        back.innerHTML = `
            <h3>${apod.title}</h3>
            <p>${apod.explanation}</p>
        `;

        if (isFlippable) {
            const backBtn = document.createElement("button");
            backBtn.textContent = "Back";
            backBtn.classList.add("flip-back-btn");
            backBtn.addEventListener("click", () => {
                card.classList.remove("flipped");
            });
            back.appendChild(backBtn);
        }

        card.appendChild(back);
    }

    return card;
}