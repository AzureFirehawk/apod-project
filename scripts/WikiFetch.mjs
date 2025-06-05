export async function fetchWikipediaInfo(term) {
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`;
    try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Wikipedia fetch failed for: ${term}`);
        const data = await res.json();

        if (data.type === 'disambiguation') {
            console.warn(`Skipping disambiguation for "${term}"`);
            return null;
        }
            
        if (data.extract) {
            return {
                title: data.title,
                summary: data.extract,
                url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(term)}`
            };
        }
    } catch (err) {
        console.warn(`No summary found for "${term}"`);
    }
    return null;
}