// src/ecs/core/EntityManager.ts

type ComponentData = Record<string, any>;

export class EntityManager {
    private nextEntityId = 1;
    private entities = new Set<number>();
    private components = new Map<string, Map<number, ComponentData>>();

    createEntity(): number {
        const id = this.nextEntityId++;
        this.entities.add(id);
        return id;
    }

    removeEntity(entityId: number) {
        this.entities.delete(entityId);
        for (const componentMap of this.components.values()) {
            componentMap.delete(entityId);
        }
    }

    addComponent(entityId: number, componentName: string, data: ComponentData) {
        if (!this.components.has(componentName)) {
            this.components.set(componentName, new Map());
        }
        this.components.get(componentName)!.set(entityId, data);
    }

    getComponent<T extends ComponentData>(entityId: number, componentName: string): T | undefined {
        return this.components.get(componentName)?.get(entityId) as T | undefined;
    }

    getEntitiesWith(...componentNames: string[]): number[] {
        let sets = componentNames.map(name =>
            new Set(this.components.get(name)?.keys() || []));
        return [...sets.reduce((a, b) => new Set([...a].filter(x => b.has(x))))];
    }

    clear() {
        this.entities.clear();
        this.components.clear();
        this.nextEntityId = 1;
    }
}
