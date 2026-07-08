import type { CreateQuestInput, Quest } from "@/types/quest";
import { notImplemented } from "@/utils/errors";

export const QuestService = {
  createQuest(_input: CreateQuestInput): Promise<Quest> {
    return notImplemented("QuestService.createQuest");
  },
  completeQuest(_questId: string): Promise<Quest> {
    return notImplemented("QuestService.completeQuest");
  },
  listQuests(_userId: string): Promise<Quest[]> {
    return notImplemented("QuestService.listQuests");
  },
};
