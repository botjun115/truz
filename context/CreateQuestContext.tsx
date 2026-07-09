"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { CreateMode, CreateStep } from "@/types/create";
import type { VideoAsset } from "@/types/video";

interface CreateQuestContextValue {
  step: CreateStep;
  mode: CreateMode;
  questName: string;
  endingQuestId: string | null;
  recordedVideo: VideoAsset | null;
  openSheet: () => void;
  close: () => void;
  setQuestName: (name: string) => void;
  goToCamera: () => void;
  startEndFlow: (questId: string, questName: string) => void;
  completeRecording: (video: VideoAsset) => void;
  backToCamera: () => void;
  reset: () => void;
}

const CreateQuestContext = createContext<CreateQuestContextValue | null>(null);

/** START/ENDフロー(Bottom Sheet→Camera→Review)の画面遷移と一時状態を管理する */
export function CreateQuestProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<CreateStep>("closed");
  const [mode, setMode] = useState<CreateMode>("start");
  const [questName, setQuestNameState] = useState("");
  const [endingQuestId, setEndingQuestId] = useState<string | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<VideoAsset | null>(null);

  const reset = useCallback(() => {
    setStep("closed");
    setMode("start");
    setQuestNameState("");
    setEndingQuestId(null);
    setRecordedVideo(null);
  }, []);

  const openSheet = useCallback(() => {
    setMode("start");
    setEndingQuestId(null);
    setQuestNameState("");
    setRecordedVideo(null);
    setStep("sheet");
  }, []);

  const close = useCallback(() => reset(), [reset]);
  const setQuestName = useCallback((name: string) => setQuestNameState(name), []);
  const goToCamera = useCallback(() => setStep("camera"), []);

  /** ACTIVEカードの終了ボタンから直接Camera(ENDモード)へ */
  const startEndFlow = useCallback((questId: string, name: string) => {
    setMode("end");
    setEndingQuestId(questId);
    setQuestNameState(name);
    setRecordedVideo(null);
    setStep("camera");
  }, []);

  const completeRecording = useCallback((video: VideoAsset) => {
    setRecordedVideo(video);
    setStep("review");
  }, []);

  const backToCamera = useCallback(() => {
    setRecordedVideo(null);
    setStep("camera");
  }, []);

  const value = useMemo<CreateQuestContextValue>(
    () => ({
      step,
      mode,
      questName,
      endingQuestId,
      recordedVideo,
      openSheet,
      close,
      setQuestName,
      goToCamera,
      startEndFlow,
      completeRecording,
      backToCamera,
      reset,
    }),
    [step, mode, questName, endingQuestId, recordedVideo, openSheet, close, setQuestName, goToCamera, startEndFlow, completeRecording, backToCamera, reset],
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