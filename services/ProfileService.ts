import type { Profile } from "@/types/profile";
import { notImplemented } from "@/utils/errors";

export const ProfileService = {
  getProfile(_userId: string): Promise<Profile> {
    return notImplemented("ProfileService.getProfile");
  },
  updateDisplayName(_userId: string, _displayName: string): Promise<void> {
    return notImplemented("ProfileService.updateDisplayName");
  },
};
