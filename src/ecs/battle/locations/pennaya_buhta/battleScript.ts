// src/ecs/battle/locations/pennaya_buhta/battleScript.ts

import { BattleManager } from '../BattleManager.js';


let lastTraderSpawn = Date.now();
let lastCaravanSpawn = Date.now();
const playerActivityMap = new Map<number, number>();

const TRADER_SPAWN_INTERVAL = 60 * 60 * 1000; // 1 час
const CARAVAN_SPAWN_INTERVAL = 2 * 60 * 60 * 1000; // 2 часа
const HUNTER_SPAWN_THRESHOLD = 5; // после 5 атак шанс охотника

export async function pennayaBuhtaBattleScript(battle: BattleManager) {
    console.log('[Пенная бухта] Скрипт запускается');

    setInterval(async () => {
        const now = Date.now();

        if (now - lastTraderSpawn >= TRADER_SPAWN_INTERVAL) {
            console.log('[Пенная бухта] Спавн торговца');
            await battle.addBot('trader');
            lastTraderSpawn = now;
        }

        if (now - lastCaravanSpawn >= CARAVAN_SPAWN_INTERVAL) {
            console.log('[Пенная бухта] Спавн торгового каравана');
            await battle.addBot('caravan');
            lastCaravanSpawn = now;
        }

    }, 60 * 1000); // проверка каждую минуту
}

// Учёт активности игроков
export function registerPlayerAction(userId: number) {
    const current = playerActivityMap.get(userId) || 0;
    playerActivityMap.set(userId, current + 1);

    if (current + 1 >= HUNTER_SPAWN_THRESHOLD) {
        playerActivityMap.set(userId, 0); // сброс активности
        console.log(`[Пенная бухта] Игрок ${userId} стал слишком активным — шанс появления охотника!`);
        // (спавним охотника через battle в будущем)
    }
}
