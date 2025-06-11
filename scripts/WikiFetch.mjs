export async function fetchWikipediaInfo(term, depth = 0) {
    if (depth > 5) { //Disambiguation limit
        console.warn(`Disambiguation depth limit reached for: ${term}`);
        return null;
    }

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

        // Priority match
        const priorityTerms = ["rover", "mission", "telescope", "spacecraft", "probe", "observatory"];
        const prioritized = pages.find(page =>
            priorityTerms.some(pt => page.title.toLowerCase().includes(pt))
        );
        if (prioritized) return await fetchWikipediaInfo(prioritized.title, depth);

        // Fallback to first non-disambiguation
        const fallback = pages.find(page => !page.title.toLowerCase().includes("disambiguation"));
        if (fallback) return await fetchWikipediaInfo(fallback.title, depth);
    } catch (err) {
        console.warn(`Disambiguation fallback failed for "${term}":`, err.message);
    }

    return null;
}
