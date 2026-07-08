export class NotImplementedError extends Error {
  constructor(feature: string) {
    super(`${feature} is not implemented in Phase 1.`);
    this.name = "NotImplementedError";
  }
}

export function notImplemented(feature: string): never {
  throw new NotImplementedError(feature);
}
