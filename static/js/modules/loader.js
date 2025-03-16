export class Loader {
    constructor(url = 'https://cales.casa/api/') {
        this.url = url;
    }

    /**
     * Fetch data from the given endpoint and return it as JSON.
     * @param {string} endpoint - The API endpoint to fetch data from.
     * @returns {Promise<object>} - Resolves to the fetched data as a JavaScript object.
     */
    async fetchData(endpoint, parser = null) {
        const url = this.url + endpoint;
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
            }

            const data = await response.json();
            
            return parser ? parser(data) : data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    async fetchMinecraftData() {
        return this.fetchData('status', (data) => data.minecraft || {});
    }

    async fetchPlayerData(uuid) {
        return this.fetchData(`player-data/${uuid}`, (data) => ({
            stats: data.stats.stats || {},
            advancements: data.advancements || {}
        }));
    }

    async loadJsonFile(filePath) {
        try {
            const response = await fetch(filePath);

            if (!response.ok) {
                throw new Error(`Failed to load JSON file ${filePath}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading JSON file:', error);
            return null;
        }
    }
}

export const loader = new Loader();