import type { UploadResult, UploadVideoInput } from "@/lib/firebase/upload";
import { notImplemented } from "@/utils/errors";

export const UploadService = {
  uploadVideo(_input: UploadVideoInput): Promise<UploadResult> {
    return notImplemented("UploadService.uploadVideo");
  },
  cancel(_path: string): Promise<void> {
    return notImplemented("UploadService.cancel");
  },
};
