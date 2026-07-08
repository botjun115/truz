import type { SharePayload, ShareTarget } from "@/types/share";
import { notImplemented } from "@/utils/errors";

export const ShareService = {
  share(_target: ShareTarget, _payload: SharePayload): Promise<void> {
    return notImplemented("ShareService.share");
  },
};
