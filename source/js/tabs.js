function tabHandler(event, buttons) {
    event.preventDefault();
    const tabContainer = event.target.parentElement.parentElement;
    const targetId = event.target.getAttribute("aria-controls");
    buttons.forEach((button) =>
        button.setAttribute("aria-selected", false)
    );
    event.target.setAttribute("aria-selected", true);
    event.target.focus();
    tabContainer
        .querySelectorAll("[role=tabpanel]")
        .forEach((tabpnael) => tabpnael.setAttribute("hidden", true));
    tabContainer
        .querySelector(`[role=tabpanel]#${targetId}`)
        .removeAttribute("hidden");
}

export function addTabListeners(tabContainer) {
    const tablist = tabContainer.querySelector("[role=tablist]");
    const buttons = tablist.querySelectorAll("[role=tab]");
    buttons.forEach((button) =>
        button.addEventListener("mousedown", (event) => {
            tabHandler(event, buttons)
    }));
    buttons.forEach((button) =>
        button.addEventListener("focus", (event) => {
            tabHandler(event, buttons)
    }));
}