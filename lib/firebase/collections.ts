export const COLLECTIONS = {
  users: "users",
  quests: "quests",
  feed: "feed",
  notifications: "notifications",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

export const userDocPath = (userId: string): string => `${COLLECTIONS.users}/${userId}`;

export const questDocPath = (questId: string): string => `${COLLECTIONS.quests}/${questId}`;

export const userNotificationsPath = (userId: string): string =>
  `${COLLECTIONS.users}/${userId}/${COLLECTIONS.notifications}`;
