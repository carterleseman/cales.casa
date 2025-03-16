import { injectHtmlFile } from "../injector.js";
import { addTabListeners } from "../tabs.js";
import { Loader } from "../modules/loader.js";

export async function minecraftModal() {
    const { loader } = await import('../modules/loader.js');

    try {
        const data = await loader.fetchMinecraftData();

        const modal = await injectHtmlFile('source/html/minecraft-modal.html');

        const version = data.version ?? '1.21.4';
        const players = `${data.players}/${data.maxPlayers} players` ?? '0/10 players';
        const host = data.host ?? 'cales.casa';
        const status = data.online ? 'Online' : 'Offline';

        updateTextContent(['mc-version', 'mc-players', 'mc-host', 'mc-status'], [version, players, host, status], modal);
        updateServerStatusClass(modal, data.online);

        modal.addEventListener('remove', () => {
            stopAutoRefresh();
        });

        createPlayerList(data, modal, loader);

        startAutoRefresh();
    } catch (error) {
        console.error('Error fetching server status:', error);
    }
}

let refreshInterval;

function startAutoRefresh(interval = 60000) {
    if (refreshInterval) return;
    refreshInterval = setInterval(() => {
        updateServerDetails();
    }, interval);
}

function stopAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = null;
}

async function updateServerDetails() {
    const { loader } = await import('../modules/loader.js');

    try {
        const data = await loader.fetchMinecraftData();

        const container = document.querySelector('.mc-server');

        const version = data.version || '1.21.4';
        const players = `${data.players}/${data.maxPlayers} players` || '0/10 players';
        const host = data.host || 'cales.casa';
        const status = data.online ? 'Online' : 'Offline';

        updateTextContent(['mc-version', 'mc-players', 'mc-host', 'mc-status'], [version, players, host, status], container);
        updateServerStatusClass(container, data.online);

        updatePlayerList(data, container);
    } catch (error) {
        console.error('Error fetching server status:', error);
    }
}

/**
 * Updates the text content of the specified elements in the container (modal).
 * 
 * @param {string[]} selectors - An array of element IDs whose text content needs to be updated.
 * @param {string[]} content - An array of text content to be applied to the corresponding selectors.
 * @param {HTMLElement} container - The container element (e.g., modal) that contains the elements to be updated.
 */
function updateTextContent(selectors, content, container) {
    selectors.forEach((selector, index) => {
        container.querySelector(`#${selector}`).textContent = content[index];
    });
}

/**
 * 
 * @param {HTMLElement} modal - The modal element containing the server status display.
 * @param {boolean} status - The status of the server (`true` if online, `false` if offline).
 */
function updateServerStatusClass(modal, status) {
    const element = modal.querySelector('#mc-status');

    if (status && !element.classList.contains('online')) {
        element.classList.add('online');
    } else if (!status && !element.classList.contains('offline')) {
        element.classList.add('offline');
    }
}

function createPlayerList(data, container, loader) {
    const playerListContainer = container.querySelector('#player-list');
    playerListContainer.innerHTML = '';

    const legend = document.createElement('legend');
    legend.textContent = 'Players';
    playerListContainer.appendChild(legend);

    data.playerList.allPlayers.forEach(player => {
        const skinUrl = `https://crafatar.com/avatars/${player.uuid}?size=32&overlay`

        const playerItem = document.createElement('li');
        playerItem.classList.add('player-item', 'tooltip');

        const playerImg = document.createElement('img');
        playerImg.src = skinUrl;
        playerImg.alt = player.name;

        const isOnline = data.playerList.onlinePlayers.some(onlinePlayer => onlinePlayer.uuid === player.uuid);
        if (isOnline) playerImg.classList.add('online');

        playerItem.appendChild(playerImg);

        const tooltipText = document.createElement('p');
        tooltipText.classList.add('tooltip-text');
        tooltipText.textContent = player.name;
        playerItem.appendChild(tooltipText);

        playerItem.onclick = () => fetchPlayerData(player.name, player.uuid, loader);

        playerListContainer.appendChild(playerItem);
    });
}

/**
 * Updates the player list in the container to reflect the online status of each player.
 * 
 * @param {Object} data - The data containing player information.
 * @param {HTMLElement} container - The container element that holds the player list.
 */
function updatePlayerList(data, container) {
    const playerList = container.querySelector('#player-list');
    const playerItems = playerList.querySelectorAll('.player-item');

    Array.from(playerItems).forEach(playerItem => {
        const img = playerItem.querySelector('img');
        const name = img.alt;
        const online = data.playerList.onlinePlayers.some(player => player.name === name);

        if (online) {
            img.classList.add('online');
        } else {
            img.classList.remove('online');
        }
    });
}

/**
 * Fetches additional data for a player when clicked from the player list.
 * 
 * @param {string} name - The name of the player.
 * @param {string} uuid - The unique identifier of the player.
 * @param {Loader} loader - The Loader instance used to fetch the player data.
 */
export async function fetchPlayerData(name, uuid, loader) {
    try {
        const data = await loader.fetchPlayerData(uuid);

        const stats = data.stats["minecraft:custom"] || null;
        const advancements = data.advancements || null;

        if (!stats && !advancements) {
            console.log("No stats or advancements available.");
            return;
        }

        const modal = await injectHtmlFile('source/html/player-modal.html', uuid);
        addTabListeners(modal);
        modal.querySelector('.title-bar-text').textContent = `${name}'s Stats & Advancements`;

        const statsContent = createPlayerStats(stats, modal);
        modal.querySelector(`#stats-${uuid} pre`).innerHTML = statsContent;

        updatePlayerAdvancements(advancements, modal, uuid);
    } catch (error) {
        console.error('Error fetching player data:', error);
    }
}

function createPlayerStats(stats) {
    let content = '';
    Object.keys(stats).forEach(statKey => {
        const stat = statKey.replace('minecraft:', '').replaceAll('_', ' ');
        const statValue = stats[statKey];

        if (statKey.endsWith('one_cm')) {
            const blocks = statValue / 100;
            content += `<p><strong>${stat}</strong>: ${statValue} or ${blocks} blocks</p>`;
        } else if (statKey.includes('time')) {
            const minutes = statValue / (20 * 60);
            content += `<p><strong>${stat}</strong>: ${statValue} ticks or ${minutes} minutes</p>`;
        } else {
            content += `<p><strong>${stat}</strong>: ${statValue}</p>`;
        }
    });

    return content;
}

function updatePlayerAdvancements(advancements, modal, uuid) {
    Object.keys(advancements).forEach(advKey => {
        const done = advancements[advKey]?.done;
        const id = advKey.replace('minecraft:', '').replace('/', '-');

        try {
            const element = modal.querySelector(`#${id}-${uuid}`);
            if (element) {
                if (done) {
                    element.classList.add('done');
                }

                updateIncompleteAdvancements(id, advancements, advKey, element);
            } else {
                console.warn(`Advancement element with ID "${id}-${uuid}" not found.`);
            }
        } catch (error) {
            if (error instanceof DOMException) {}
        }
    });
}

function updateIncompleteAdvancements(id, advancements, advKey, element) {
    switch (id) {
        case 'adventure-kill_all_mobs': // Monsters Hunted
            const missingMobs = getMissingMobs(advancements, advKey);
            updateTooltip(element, missingMobs);
            break;
        case 'adventure-adventuring_time': // Adventuring Time
            const missingBiomes = getMissingBiomes(advancements, advKey);
            updateTooltip(element, missingBiomes);
            break;
        case 'adventure-trim_with_all_exclusive_armor_patterns': // Smithing With Style
            const missingTrims = getMissingTrims(advancements, advKey);
            updateTooltip(element, missingTrims);
            break;
        case 'husbandry-complete_catalogue': // A Complete Catalogue
            const missingCats = getMissingCats(advancements, advKey);
            updateTooltip(element, missingCats);
            break;
        case 'husbandry-whole_pack': // The Whole Pack
            const missingDogs = getMissingDogs(advancements, advKey);
            updateTooltip(element, missingDogs);
            break;
        case 'husbandry-balanced_diet': // A Balanced Diet
            const missingFoods = getMissingFoods(advancements, advKey);
            updateTooltip(element, missingFoods);
            break;
        case 'nether-explore_nether': // Hot Tourist Destinations
            const missingNetherBiomes = getMissingNetherBiomes(advancements, advKey);
            updateTooltip(element, missingNetherBiomes);
            break;
        case 'husbandry-bred_all_animals': // Two by Two
            const missingAnimals = getMissingAnimals(advancements, advKey);
            updateTooltip(element, missingAnimals);
            break;
        default:
            break;
    }
}

function updateTooltip(element, missingItems) {
    if (missingItems.length > 0) {
        const tooltipTextElement = element.querySelector('.tooltip-text');
        const missingText = missingItems.map(item => item.replaceAll('_', ' ')).join(', ');
        tooltipTextElement.innerHTML = `<strong>missing</strong>: ${missingText}`;
    }
}

function getMissingMobs(advancements, advKey) {
    const mobs = ['blaze', 'bogged', 'breeze', 'cave_spider', 'creeper', 'drowned', 'elder_guardian', 'ender_dragon', 'enderman', 'endermite', 'evoker', 'ghast', 'guardian', 'hoglin', 'husk', 'magma_cube', 'phantom', 'piglin', 'piglin_brute', 'pillager', 'ravager', 'shulker', 'silverfish', 'skeleton', 'slime', 'spider', 'stray', 'vex', 'vindicator', 'witch', 'wither', 'wither_skeleton', 'zoglin', 'zombie', 'zombie_villager', 'zombified_piglin', 'creaking'];

    if (!advancements[advKey]) {
        return mobs;
    }

    return mobs.filter(mob => !advancements[advKey]?.criteria?.[`minecraft:${mob}`]);
}

function getMissingBiomes(advancements, advKey) {
    const biomes = ['badlands', 'bamboo_jungle', 'beach', 'birch_forest', 'cherry_grove', 'cold_ocean', 'dark_forest', 'deep_cold_ocean', 'deep_dark', 'deep_frozen_ocean', 'deep_lukewarm_ocean', 'deep_ocean', 'desert', 'dripstone_caves', 'eroded_badlands', 'flower_forest', 'forest', 'frozen_ocean', 'frozen_peaks', 'frozen_river', 'grove', 'ice_spikes', 'ice_spikes', 'jagged_peaks', 'jungle', 'lukewarm_ocean', 'lush_caves', 'mangrove_swamp', 'meadow', 'mushroom_fields', 'ocean', 'old_growth_birch_forest', 'old_growth_pine_taiga', 'old_growth_spruce_taiga', 'pale_garden', 'plains', 'river', 'savanna', 'savanna_plateau', 'snowy_beach', 'snowy_plains', 'snowy_slopes', 'snowy_taiga', 'sparse_jungle', 'stony_peaks', 'stony_shore', 'sunflower_plains', 'swamp', 'taiga', 'warm_ocean', 'windswept_forest', 'windswept_gravelly_hills', 'windswept_hills', 'windswept_savanna', 'wooded_badlands'];

    if (!advancements[advKey]) {
        return biomes;
    }

    return biomes.filter(biome => !advancements[advKey]?.criteria?.[`minecraft:${biome}`]);
}

function getMissingTrims(advancements, advKey) {
    const trims = ['spire_armor_trim_smithing_template_smithing_trim', 'snout_armor_trim_smithing_template_smithing_trim', 'rib_armor_trim_smithing_template_smithing_trim', 'ward_armor_trim_smithing_template_smithing_trim', 'silence_armor_trim_smithing_template_smithing_trim', 'vex_armor_trim_smithing_template_smithing_trim', 'tide_armor_trim_smithing_template_smithing_trim', 'wayfinder_armor_trim_smithing_template_smithing_trim'];

    if (!advancements[advKey]) {
        return trims;
    }

    return trims.filter(trim => !advancements[advKey]?.criteria?.[`armor_trimmed_minecraft:${trim}`]);
}

function getMissingCats(advancements, advKey) {
    const cats = ['white', 'black', 'red', 'siamese', 'british_shorthair', 'calico', 'persian', 'ragdoll', 'tabby', 'all_black', 'jellie'];

    if (!advancements[advKey]) {
        return cats;
    }

    return cats.filter(cat => !advancements[advKey]?.criteria?.[`minecraft:${cat}`]);
}

function getMissingDogs(advancements, advKey) {
    const dogs = ['pale', 'ashen', 'black', 'chestnut', 'rusty', 'snowy', 'spotted', 'striped', 'woods'];

    if (!advancements[advKey]) {
        return dogs;
    }

    return dogs.filter(dog => !advancements[advKey]?.criteria?.[`minecraft:${dog}`]);
}

function getMissingFoods(advancements, advKey) {
    const foods = ['apple', 'baked_potato', 'beetroot', 'beetroot_soup', 'bread', 'carrot', 'chorus_fruit', 'cooked_chicken', 'cooked_cod', 'cooked_mutton', 'cooked_porkchop', 'cooked_rabbit', 'cooked_salmon', 'cookie', 'dried_kelp', 'enchanted_golden_apple', 'glow_berries', 'golden_apple', 'golden_carrot', 'honey_bottle', 'melon_slice', 'mushroom_stew', 'poisonous_potato', 'potato', 'pufferfish', 'pumpkin_pie', 'rabbit_stew', 'rabbit', 'beef', 'chicken', 'cod', 'porkchop', 'salmon', 'rotten_flesh', 'spider_eye', 'cooked_beef', 'mutton', 'suspicious_stew', 'sweet_berries', 'tropical_fish'];

    if (!advancements[advKey]) {
        return foods;
    }

    return foods.filter(food => !advancements[advKey]?.criteria?.[food]);
}

function getMissingNetherBiomes(advancements, advKey) {
    const biomes = ['basalt_deltas', 'crimson_forest', 'nether_wastes', 'soul_sand_valley', 'warped_forest'];

    if (!advancements[advKey]) {
        return biomes;
    }
    
    return biomes.filter(biome => !advancements[advKey]?.criteria?.[`minecraft:${biome}`]);
}

function getMissingAnimals(advancements, advKey) {
    const animals = ['armadillo', 'axolotl', 'bee', 'carmel', 'cat', 'chicken', 'cow', 'donkey', 'fox', 'frog', 'goat', 'hoglin', 'horse', 'llama', 'mooshroom', 'mule', 'ocelot', 'panda', 'pig', 'rabbit', 'sheep', 'sniffer', 'strider', 'turtle', 'wolf'];

    if (!advancements[advKey]) {
        return animals;
    }

    return animals.filter(animal => !advancements[advKey]?.criteria?.[`minecraft:${animal}`]);
}