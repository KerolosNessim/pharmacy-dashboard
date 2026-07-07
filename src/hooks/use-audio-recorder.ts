"use client";

import { useState, useRef, useCallback, useEffect } from "react";

function getRecordingErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    switch (error.name) {
      case "NotFoundError":
        return "No microphone detected on this device.";
      case "NotAllowedError":
      case "PermissionDeniedError":
        return "Microphone permission denied. Allow it in browser site settings.";
      case "NotReadableError":
        return "Microphone is busy. Close other apps using it.";
      case "SecurityError":
        return "Microphone requires HTTPS or localhost.";
      case "NotSupportedError":
        return "Recording is not supported in this browser.";
      default:
        return `Could not access microphone (${error.name}).`;
    }
  }
  if (error instanceof Error) return error.message;
  return "Could not access microphone.";
}

function pickRecorderMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

type GumFn = (
  constraints: MediaStreamConstraints,
) => Promise<MediaStream>;

function getGetUserMedia(): GumFn | null {
  if (typeof navigator === "undefined") return null;

  if (navigator.mediaDevices?.getUserMedia) {
    return navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  }

  const legacy = navigator as Navigator & {
    getUserMedia?: (
      c: MediaStreamConstraints,
      ok: (s: MediaStream) => void,
      err: (e: unknown) => void,
    ) => void;
    webkitGetUserMedia?: (
      c: MediaStreamConstraints,
      ok: (s: MediaStream) => void,
      err: (e: unknown) => void,
    ) => void;
  };

  const gum = legacy.getUserMedia ?? legacy.webkitGetUserMedia;
  if (!gum) return null;

  return (constraints) =>
    new Promise((resolve, reject) => {
      gum.call(legacy, constraints, resolve, reject);
    });
}

async function getAudioStream(): Promise<MediaStream> {
  const getUserMedia = getGetUserMedia();
  if (!getUserMedia) {
    throw new DOMException("Not supported", "NotSupportedError");
  }

  const attempts: MediaStreamConstraints[] = [
    { audio: true },
    { audio: { channelCount: 1 } },
    {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    },
  ];

  let lastError: unknown;
  for (const constraints of attempts) {
    try {
      return await getUserMedia(constraints);
    } catch (error) {
      lastError = error;
    }
  }

  if (navigator.mediaDevices?.enumerateDevices) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      for (const device of devices) {
        if (device.kind !== "audioinput" || !device.deviceId) continue;
        try {
          return await getUserMedia({
            audio: { deviceId: { ideal: device.deviceId } },
          });
        } catch (error) {
          lastError = error;
        }
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new DOMException("No microphone", "NotFoundError");
}

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isRequestingMic, setIsRequestingMic] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async (): Promise<string | null> => {
    setIsRequestingMic(true);
    setAudioBlob(null);

    try {
      const stream = await getAudioStream();
      streamRef.current = stream;

      const mimeType = pickRecorderMimeType();
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      const outputType = mimeType || mediaRecorder.mimeType || "audio/webm";

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: outputType });
        chunksRef.current = [];
        stopStream();
        if (blob.size > 0) setAudioBlob(blob);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      return null;
    } catch (error) {
      stopStream();
      clearTimer();
      setIsRecording(false);
      return getRecordingErrorMessage(error);
    } finally {
      setIsRequestingMic(false);
    }
  }, [clearTimer, stopStream]);

  const stopRecording = useCallback(
    (shouldSave: boolean = true) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === "inactive") return;

      if (!shouldSave) {
        recorder.onstop = () => {
          chunksRef.current = [];
          stopStream();
          setAudioBlob(null);
        };
      }

      if (recorder.state === "recording" && "requestData" in recorder) {
        recorder.requestData();
      }

      recorder.stop();
      setIsRecording(false);
      clearTimer();
      mediaRecorderRef.current = null;
    },
    [clearTimer, stopStream],
  );

  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setRecordingTime(0);
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      stopStream();
    };
  }, [clearTimer, stopStream]);

  return {
    isRecording,
    isRequestingMic,
    audioBlob,
    recordingTime,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
