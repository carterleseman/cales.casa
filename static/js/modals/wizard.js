import { injectHtmlFile } from "../injector.js";
import { addTabListeners } from "../tabs.js";

export async function wizardModal() {
    const { loader } = await import('../modules/loader.js');

    try {
        const wizards = await loader.loadJsonFile('source/data/wizards.json');

        const modal = await injectHtmlFile('source/html/wizard-modal.html');

        const tablist = modal.querySelector('[role=tablist]');
        let tabIndex = 1;

        for (const wizardObj in wizards) {
            const wizard = wizards[wizardObj];

            const body = modal.querySelector('.window-body');

            const tab = document.createElement('li');
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-controls', `wizard-${tabIndex}`);
            tab.textContent = wizardObj;
            tablist.appendChild(tab);

            const tabpanel = document.createElement('div');
            tabpanel.setAttribute('id', `wizard-${tabIndex}`);
            tabpanel.setAttribute('role', 'tabpanel');

            if (tabIndex == 1) {
                tab.setAttribute('aria-selected', 'true');
            } else {
                tabpanel.setAttribute('hidden', 'true');
            }

            const pre = document.createElement('pre');
            pre.classList.add('scrollable-y', 'wizard');

            const title = getWizardTitle(wizard.level);
            const school = translateSchool(wizard.school);

            const content = `
                <div class="wizard-left">
                    <p><span class="wizard-title">${title}</span> <span class="wizard-level">(Level ${wizard.level})</span></p>
                    <p class="wizard-school">${school}</p>
                    <div class="wizard-hp-mana">
                        <p class="wizard-health">${wizard.stats.health}</p>
                        <p class="wizard-mana">${wizard.stats.mana}</p>
                    </div>

                    ${wizard.pet ? `
                    <div class="wizard-pet">
                        <p class="wizard-pet-body">${wizard.pet.body}</p>
                        <ul class="wizard-pet-talents">
                            ${wizard.pet.talents.map(talent => `<li>${talent}</li>`).join('')}
                            ${wizard.pet.socket.map(socket => `<li class="wizard-pet-socket">${socket}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}

                    <p class="wizard-mount">${wizard.gear.mount}</p>
                </div>
                <div class="wizard-right">
                    <p class="wizard-damage">${wizard.stats.damage}</p>
                    <p class="wizard-resist">${wizard.stats.resist}</p>
                    <p class="wizard-accuracy">${wizard.stats.accuracy}</p>
                    <p class="wizard-critical">${wizard.stats.critical}</p>
                    <p class="wizard-block">${wizard.stats.block}</p>
                    <p class="wizard-pierce">${wizard.stats.pierce}</p>
                    <p class="wizard-pip">${wizard.stats.pip}</p>
                    <div class="wizard-gear">
                        <p class="wizard-hat">${wizard.gear.hat}</p>
                        <p class="wizard-robe">${wizard.gear.robe}</p>
                        <p class="wizard-boots">${wizard.gear.boots}</p>
                        <p class="wizard-wand">${wizard.gear.wand}</p>
                        <p class="wizard-athame">${wizard.gear.athame}</p>
                        <p class="wizard-amulet">${wizard.gear.amulet}</p>
                        <p class="wizard-ring">${wizard.gear.ring}</p>
                        <p class="wizard-deck">${wizard.gear.deck}</p>
                    </div>
                </div>
            `;

            pre.innerHTML = content;
            tabpanel.appendChild(pre);
            body.appendChild(tabpanel);

            tabIndex++;
        }

        addTabListeners(modal);
    } catch (error) {
        console.error('Error generating wizard tabs:', error);
    }
}

function getWizardTitle(level) {
    if (level >= 1 && level <= 4) {
        return "Novice";
    } else if (level >= 5 && level <= 9) {
        return "Apprentice";
    } else if (level >= 10 && level <= 14) {
        return "Initiate";
    } else if (level >= 15 && level <= 19) {
        return "Journeyman";
    } else if (level >= 20 && level <= 29) {
        return "Adept";
    } else if (level >= 30 && level <= 39) {
        return "Magus";
    } else if (level >= 40 && level <= 49) {
        return "Master";
    } else if (level >= 50 && level <= 59) {
        return "Grandmaster";
    } else if (level >= 60 && level <= 69) {
        return "Legendary";
    } else if (level >= 70 && level <= 79) {
        return "Transcendent";
    } else if (level >= 80 && level <= 89) {
        return "Archmage";
    } else if (level >= 90 && level <= 99) {
        return "Promethean";
    } else if (level >= 100 && level <= 109) {
        return "Exalted";
    } else if (level >= 110 && level <= 119) {
        return "Prodigious";
    } else if (level >= 120 && level <= 129) {
        return "Champion";
    } else if (level >= 130 && level <= 139) {
        return "Visionary";
    } else if (level >= 140 && level <= 149) {
        return "Cosmic";
    } else if (level >= 150 && level <= 159) {
        return "Paragon";
    } else if (level >= 160 && level <= 169) {
        return "Prime";
    } else if (level === 170) {
        return "Supreme";
    } else {
        return "Unknown";
    }
}

function translateSchool(school) {
    switch (school.toLowerCase()) {
        case "fire":
            return "Pyromancer";
        case "storm":
            return "Diviner";
        case "ice":
            return "Thaumaturge";
        case "balance":
            return "Sorcerer";
        case "life":
            return "Theurgist";
        case "myth":
            return "Conjurer";
        case "death":
            return "Necromancer";
        default:
            return "Unknown";
    }
}