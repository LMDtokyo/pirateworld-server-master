// src/ecs/components/BotType.ts

export const BotType = 'BotType';

export type BotTypeEnum = 'trader' | 'caravan' | 'hunter' | 'simple';

export interface BotTypeComponent {
    type: BotTypeEnum;
}
