"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FeedList } from "@/components/Feed/FeedList";
import { HomeHeader } from "@/components/Header/HomeHeader";
import { EASE } from "@/constants/animation";
import { useCreateQuest } from "@/context/CreateQuestContext";
import { useQuestContext } from "@/context/QuestContext";
import { MOCK_FEED_FOLLOWING, MOCK_FEED_FOR_YOU } from "@/lib/mockFeed";
import { questToFeedItem } from "@/lib/questToFeedItem";
import type { FeedTab } from "@/types/feed";

/** Home Feed画面全体(タブ状態 + モックデータ + 自分の公開クエストの出し分け) */
export function HomeFeed() {
  const [tab, setTab] = useState<FeedTab>("following");
  const { quests } = useQuestContext();
  const { startEndFlow } = useCreateQuest();

  const followingItems = useMemo(
    () => [...quests.map(questToFeedItem), ...MOCK_FEED_FOLLOWING],
    [quests],
  );
  const items = tab === "following" ? followingItems : MOCK_FEED_FOR_YOU;

  return (
    <>
      <HomeHeader tab={tab} onTabChange={setTab} />
      <main className="page-content pt-2">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: EASE.out }}
        >
          <FeedList items={items} onEndQuest={startEndFlow} />
        </motion.div>
      </main>
    </>
  );
}