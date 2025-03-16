import { programs } from './modules/program.js';

export function initPrograms() {
    const programList = document.querySelector('.desktop .programs');
    const height = parseInt(getComputedStyle(programList).getPropertyValue('--program-height'));
    const rows = parseInt(getComputedStyle(programList).getPropertyValue('--program-rows'));

    const constantPrograms = programs.slice(0, 8);
    const randomPrograms = shuffleArray(programs.slice(8));

    const orderedPrograms = [...constantPrograms, ...randomPrograms];

    orderedPrograms.forEach((program, index) => {
        const programElement = document.createElement('div');
        programElement.classList.add('program');

        const iconContainer = document.createElement('div');
        iconContainer.classList.add('program-icon-container');

        const iconElement = document.createElement('img');
        iconElement.classList.add('program-icon');
        iconElement.src = program.icon;
        iconElement.alt = program.name;

        const activeEffectIcon = document.createElement('img');
        activeEffectIcon.classList.add('program-icon-active-effect');
        activeEffectIcon.src = program.icon;
        activeEffectIcon.alt = program.name;
        activeEffectIcon.setAttribute('aria-hidden', 'true');

        iconContainer.appendChild(iconElement);
        iconContainer.appendChild(activeEffectIcon);

        const textElement = document.createElement('p');
        textElement.classList.add('program-text');
        textElement.textContent = program.name;

        if (program.isShortcut) {
            programElement.classList.add('shortcut');
        }

        programElement.appendChild(iconContainer);
        programElement.appendChild(textElement);

        program.attatchClickListener(programElement);

        const col = Math.floor(index / rows);
        const row = index % rows;

        programElement.style.top = `${row * height}px`;
        programElement.style.left = `${col * height}px`;

        if (col > 0) {
            programElement.style.marginLeft = '10px';
        }

        programList.appendChild(programElement);
    });

    singleClickBehavior(programList);
}

/**
 * 
 * @param {HTMLElement} programList 
 */
function singleClickBehavior(programList) {
    const programs = programList.querySelectorAll('.program');

    programs.forEach(program => {
        program.addEventListener('click', function(event) {
            event.stopPropagation();

            // Deactivate all programs
            programs.forEach(p => p.classList.remove('active'));

            // Activate the clicked program
            program.classList.add('active');
        });
    });

    // Deactivate all programs on desktop click
    document.addEventListener('click', function() {
        programs.forEach(program => {
            program.classList.remove('active');
        });
    });
}

/**
 * Shuffles an array in place and returns it.
 * @param {Array} array
 * @returns {Array}
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}