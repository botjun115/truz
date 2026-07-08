import type { FeedItem, FeedTab } from "@/types/feed";
import { notImplemented } from "@/utils/errors";

export const FeedService = {
  fetchFeed(_tab: FeedTab): Promise<FeedItem[]> {
    return notImplemented("FeedService.fetchFeed");
  },
  fetchItem(_itemId: string): Promise<FeedItem> {
    return notImplemented("FeedService.fetchItem");
  },
};
