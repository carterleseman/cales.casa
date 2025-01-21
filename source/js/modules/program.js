class Program {
    constructor(name, icon, callback, isShortcut = false) {
        this.name = name;
        this.icon = icon; // url
        this.callback = callback;
        this.isShortcut = isShortcut;
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    attatchClickListener(element) {
        if (this.callback && element) {
            element.addEventListener('dblclick', this.callback);
        }
    }
}

class ProgramBuilder {
    constructor() {
        this.name = '';
        this.icon = '';
        this.callback = () => {};
        this.isShortcut = false;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setIcon(icon) {
        this.icon = icon;
        return this;
    }

    setCallback(callback) {
        this.callback = callback;
        return this;
    }

    shortcut() {
        this.isShortcut = true;
        return this;
    }

    build() {
        return new Program(this.name, this.icon, this.callback, this.isShortcut);
    }
}

export let programs = [
    new ProgramBuilder()
        .setName('My Computer')
        .setIcon('source/ico/my_computer.webp')
        .build(),

    new ProgramBuilder()
        .setName('Network Neighborhood')
        .setIcon('source/ico/network_neighborhood.webp')
        .build(),

    new ProgramBuilder()
        .setName('Inbox')
        .setIcon('source/ico/mail.webp')
        .setCallback(() => console.log('Jarvis, open gmail'))
        .build(),

    new ProgramBuilder()
        .setName('Recycle Bin')
        .setIcon('source/ico/empty_recycle_bin.webp')
        .build(),

    new ProgramBuilder()
        .setName('The Internet')
        .setIcon('source/ico/search_on_earth.webp')
        .build(),

    new ProgramBuilder()
        .setName('The Microsoft Network')
        .setIcon('source/ico/msn.webp')
        .build(),

    new ProgramBuilder()
        .setName('My Briefcase')
        .setIcon('source/ico/briefcase.webp')
        .build(),

    new ProgramBuilder()
        .setName('Online Services')
        .setIcon('source/ico/folder.webp')
        .build(),

    new ProgramBuilder()
        .setName('Backyard Soccer')
        .setIcon('source/img/programs/backyard-soccer.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Bugs Bunny Lost in Time')
        .setIcon('source/img/programs/bugs-bunny.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Cat in the Hat')
        .setIcon('source/img/programs/cat-in-the-hat.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Clifford the Big Red Dog Reading')
        .setIcon('source/img/programs/clifford-reading.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Freddi Fish 2 The Case of the Haunted Schoolhouse')
        .setIcon('source/img/programs/freddi-fish-2.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Freddi Fish 3 The Case of the Stolen Conch Shell')
        .setIcon('source/img/programs/freddi-fish-3.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('JumpStart 1st Grade')
        .setIcon('source/img/programs/jumpstart-1st-grade.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('JumpStart Animal Adventures')
        .setIcon('source/img/programs/jumpstart-animal-adventures.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Lego Island 2')
        .setIcon('source/img/programs/lego-island-2.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Mummy Mystery')
        .setIcon('source/img/programs/mummy-mystery.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName("Pajama Sam in No Need To Hide When It's Dark Outside")
        .setIcon('source/img/programs/pajama-sam-1.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName("Pajama Sam 2 Thunder and Lightning Aren't So Frightening")
        .setIcon('source/img/programs/pajama-sam-2.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Pajama Sam 3 You Are What You Eat From Your Head To Your Feet')
        .setIcon('source/img/programs/pajama-sam-3.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Pajama Sam Life Is Rough When You Lose Your Stuff!')
        .setIcon('source/img/programs/pajama-sam-4.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName("Pajama Sam's Sock Works")
        .setIcon('source/img/programs/pajama-sam-sock-works.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName("Piglet's Big Game")
        .setIcon('source/img/programs/piglets-big-game.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Fisher-Price Power Wheels Off-Road Adventure')
        .setIcon('source/img/programs/power-wheels.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Putt-Putt Saves the Zoo')
        .setIcon('source/img/programs/putt-putt-3.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Putt-Putt Enters the Race')
        .setIcon('source/img/programs/putt-putt-5.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('SPY Fox')
        .setIcon('source/img/programs/spy-fox-1.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('SPY Fox in Cheese Chase')
        .setIcon('source/img/programs/spy-fox-cheese-chase.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Tonka Construction 2')
        .setIcon('source/img/programs/tonka-construction-2.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Tonka Firefighter')
        .setIcon('source/img/programs/tonka-firefighter.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Star Wars Galactic Battlegrounds')
        .setIcon('source/img/programs/swgb.webp')
        .shortcut()
        .build(),

    new ProgramBuilder()
        .setName('Wizard101')
        .setIcon('source/img/programs/wiz.webp')
        .setCallback(async () => {
            const { wizardModal } = await import('../modals/wizard.js');
            wizardModal();
        })
        .shortcut()
        .build()
];