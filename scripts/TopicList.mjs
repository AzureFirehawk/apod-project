export async function loadTopics(containerId = "topic-list") {
    try {
        const res = await fetch("./data/searchTopics.json");
        const topics = await res.json();

        const container = document.getElementById(containerId)
        if (!container) return;

        topics.forEach(topic => {
            const card = document.createElement("div");
            card.className = "search-topic-card";

            const link = document.createElement("a");
            link.className = "topic-link"
            link.href = `topic.html?topic=${encodeURIComponent(topic.label)}`;

            const name = document.createElement("h3");
            name.textContent = topic.label;

            const desc = document.createElement("p");
            desc.textContent = topic.description;
            
            card.appendChild(name);
            card.appendChild(desc);
            link.appendChild(card);
            container.appendChild(link);
        });
    } catch (err) {
        console.error("Failed to load topics:", error)
    }
}