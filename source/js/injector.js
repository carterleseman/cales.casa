/**
 * Fetches an HTML file and injects its content into a specified container.
 * 
 * @param {string} url - The URL of the HTML file to fetch.
 * @param {string} [id='null'] - An id to create unique and accessible elements (optional).
 * @param {string} [containerSelector='main'] - CSS selector of the container to inject into.
 * @returns {HTMLElement | null} - The injected container element or null if injection failed.
 */
export async function injectHtmlFile(url, id = null, containerSelector = 'main') {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const htmlContent = await response.text();

        // Create a temporary container to parse the HTML string into DOM elements
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = htmlContent.trim();

        if (id) {
            createUniqueIds(tempContainer, id);
        }

        // Extract the element to inject (assumes one root element in the HTML file)
        const elementToInject = tempContainer.firstElementChild;

        // Append the element to the target container
        const container = document.querySelector(containerSelector);
        if (container && elementToInject) {
            container.appendChild(elementToInject);
            return elementToInject;
        } else {
            console.error(`Container "${containerSelector}" not found or HTML content is empty.`);
            return null;
        }
    } catch (error) {
        console.error("Error injecting HTML file:", error);
        return null;
    }
}

/**
 * Helper function for injectHTMLFile() if id parameter exists.
 * Main use case is for modals with tablists.
 * @param {HTMLElement} container
 * @param {string} id 
 */
function createUniqueIds(container, id) {
    container.querySelectorAll('[id]').forEach(el => {
        const originalId = el.id;
        const newId = `${originalId}-${id}`;
        el.id = newId;

        container.querySelectorAll(`[aria-controls="${originalId}"]`).forEach(ctrl => {
            ctrl.setAttribute('aria-controls', newId);
        });
    });
}