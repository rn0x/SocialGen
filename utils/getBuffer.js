import fetch from 'node-fetch';

export default async function getBuffer(url) {
    try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`[${new Date().toLocaleString()}] ❌ Failed to fetch data from ${url}: ${response.status} ${response.statusText}`);
        }

        const data = await response?.arrayBuffer();
        return data;
    } catch (error) {
        throw new Error(`[${new Date().toLocaleString()}] ❌ An error occurred while fetching data from ${url}: ${error.message}`);
    }
}
