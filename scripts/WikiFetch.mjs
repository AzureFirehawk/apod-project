export async function fetchWikipediaInfo(term) {
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
    try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Wikipedia fetch failed for: ${term}`);
        const data = await res.json();

        //Disambiguation detected
        if (data.type === 'disambiguation') {
            console.warn(`"${term}" is a disambiguation page. Attempting to resolve...`);
            return await tryResolveDisambiguation(term);
        }

        //Return standard page
        if (data.extract) {
            return {
                title: data.title,
                summary: data.extract,
                url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(term)}`
            };
        }
    } catch (err) {
        console.warn(`No summary found for "${term}":`, err.message);
    }
    return null;
}

async function tryResolveDisambiguation(term) {
    const searchEndpoint = `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(term)}&limit=5`;

    try {
        const res = await fetch(searchEndpoint);
        if (!res.ok) throw new Error(`Search failed for: ${term}`);

        const searchData = await res.json();
        const pages = searchData.pages || [];

        for (const page of pages) {
            const title = page.title;

            //Prioritize articles with keywords like "rover", "mission", "telescope", etc.
            const lower = title.toLowerCase();
            if (
                lower.includes("rover") ||
                lower.includes("telescope") ||
                lower.includes("spacecraft") ||
                lower.includes("mission") ||
                lower.includes("probe") ||
                lower.includes("observatory")
            ) {
                // Fetch that specific page’s summary
                return await fetchWikipediaInfo(title);
            }
        }

        //No ideal match found, return the first non-disambiguation page
        for (const page of pages) {
            if (!page.title.toLowerCase().includes("(disambiguation)")) {
                return await fetchWikipediaInfo(page.title);
            }
        }
    } catch (err) {
        console.warn(`Disambiguation fallback failed for "${term}":`, err.message);
    }

    return null;
}
