// src/ecs/core/SystemManager.ts

type SystemFunction = (deltaTime: number) => void;

export class SystemManager {
    private systems: SystemFunction[] = [];

    register(system: SystemFunction) {
        this.systems.push(system);
    }

    update(deltaTime: number) {
        for (const system of this.systems) {
            system(deltaTime);
        }
    }

    clear() {
        this.systems = [];
    }
}
