"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { CreateStep } from "@/types/create";
import type { VideoAsset } from "@/types/video";

interface CreateQuestContextValue {
  step: CreateStep;
  questName: string;
  startVideo: VideoAsset | null;
  openSheet: () => void;
  close: () => void;
  setQuestName: (name: string) => void;
  goToCamera: () => void;
  completeRecording: (video: VideoAsset) => void;
  backToCamera: () => void;
  reset: () => void;
}

const CreateQuestContext = createContext<CreateQuestContextValue | null>(null);

/** START Questフロー(Bottom Sheet→Camera→Review)の画面遷移と一時状態を管理する */
export function CreateQuestProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<CreateStep>("closed");
  const [questName, setQuestNameState] = useState("");
  const [startVideo, setStartVideo] = useState<VideoAsset | null>(null);

  const reset = useCallback(() => {
    setStep("closed");
    setQuestNameState("");
    setStartVideo(null);
  }, []);

  const openSheet = useCallback(() => setStep("sheet"), []);
  const close = useCallback(() => reset(), [reset]);
  const setQuestName = useCallback((name: string) => setQuestNameState(name), []);
  const goToCamera = useCallback(() => setStep("camera"), []);
  const completeRecording = useCallback((video: VideoAsset) => {
    setStartVideo(video);
    setStep("review");
  }, []);
  const backToCamera = useCallback(() => {
    setStartVideo(null);
    setStep("camera");
  }, []);

  const value = useMemo<CreateQuestContextValue>(
    () => ({
      step,
      questName,
      startVideo,
      openSheet,
      close,
      setQuestName,
      goToCamera,
      completeRecording,
      backToCamera,
      reset,
    }),
    [step, questName, startVideo, openSheet, close, setQuestName, goToCamera, completeRecording, backToCamera, reset],
  );

  return <CreateQuestContext.Provider value={value}>{children}</CreateQuestContext.Provider>;
}

export function useCreateQuest(): CreateQuestContextValue {
  const context = useContext(CreateQuestContext);
  if (!context) {
    throw new Error("useCreateQuest must be used within a CreateQuestProvider.");
  }
  return context;
}