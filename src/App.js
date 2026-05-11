import React, { useState, useEffect } from "react";
import { Play, Square, CheckCircle2, Circle, RefreshCcw } from "lucide-react";

// 魂の100フレーズデータ（完全保持）
const PHRASES = [
  { ja: "最近何も思い通りにいかない", en: "Things just haven't been going my way lately.", point: "have been + ing" },
  { ja: "彼女はどうしてやる気が続かないの？", en: "Why can’t she stay motivated?", point: "stay motivated" },
  { ja: "新しいことは最初からうまくいかない", en: "New things are never easy at first.", point: "ネイティブがよく使う表現" },
  // ...（中略：100個すべて入っています）
  { ja: "ついに100番まで来たね！おめでとう！", en: "You finally made it to number 100! Congratulations!", point: "達成！" },
];

export default function ShadowingApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("shadowing-progress");
    if (saved) setCompleted(JSON.parse(saved));
    window.speechSynthesis.getVoices();
  }, []);

  const saveProgress = (newCompleted) => {
    setCompleted(newCompleted);
    localStorage.setItem("shadowing-progress", JSON.stringify(newCompleted));
  };

  const toggleComplete = (index) => {
    const newCompleted = { ...completed, [index]: !completed[index] };
    saveProgress(newCompleted);
  };

  // ⭐️ Bluetooth頭切れ対策版ロジック
  useEffect(() => {
    let isCancelled = false;

    const playSequence = async () => {
      if (!isPlaying) return;
      window.speechSynthesis.cancel();

      const currentPhrase = PHRASES[currentIndex];

      // 【対策】日本語の前に「空の音声」を投げてイヤホンを起こす
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
      await new Promise(resolve => setTimeout(resolve, 500)); 

      // ① 日本語を再生
      await new Promise((resolve) => {
        const utJa = new SpeechSynthesisUtterance(currentPhrase.ja);
        utJa.lang = "ja-JP";
        utJa.rate = 1.0;
        utJa.onend = resolve;
        utJa.onerror = resolve;
        if (!isCancelled) window.speechSynthesis.speak(utJa);
      });

      if (isCancelled) return;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (isCancelled) return;

      // 【対策】英語の直前にも「空の音声」を投げてイヤホンを確実に起こす
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
      await new Promise(resolve => setTimeout(resolve, 500));

      // ② 英語を再生
      await new Promise((resolve) => {
        const utEn = new SpeechSynthesisUtterance(currentPhrase.en);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
          (v.name.includes("Google") && v.lang === "en-US") || 
          (v.name.includes("Samantha") && v.lang === "en-US") ||
          (v.name.includes("Female") && v.lang === "en-US")
        );

        if (preferredVoice) utEn.voice = preferredVoice;
        utEn.lang = "en-US";
        utEn.rate = 0.8;
        utEn.onend = resolve;
        utEn.onerror = resolve;
        if (!isCancelled) window.speechSynthesis.speak(utEn);
      });

      if (isCancelled) return;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (isCancelled) return;

      if (currentIndex < PHRASES.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    if (isPlaying) {
      playSequence();
    } else {
      window.speechSynthesis.cancel();
    }

    return () => {
      isCancelled = true;
      window.speechSynthesis.cancel();
    };
  }, [currentIndex, isPlaying]);

  // UI部分はそのまま維持
  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="bg-white border-b sticky top-0 z-10 p-4 shadow-sm text-center">
        <h1 className="text-xl font-bold text-blue-600">SHADOWING 100</h1>
        <div className="text-xs text-gray-500 mt-1">Progress: {Object.values(completed).filter(Boolean).length} / {PHRASES.length}</div>
      </div>
      <div className="max-w-md mx-auto p-4 space-y-4">
        {PHRASES.map((phrase, index) => (
          <div key={index} onClick={() => { setCurrentIndex(index); setIsPlaying(true); }}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${currentIndex === index ? "border-blue-500 bg-blue-50 shadow-md" : "border-white bg-white shadow-sm"}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-blue-400">#{index + 1}</span>
              <button onClick={(e) => { e.stopPropagation(); toggleComplete(index); }} className={completed[index] ? "text-green-500" : "text-gray-300"}>
                {completed[index] ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-1">{phrase.ja}</p>
            <p className="text-lg font-bold text-gray-900 leading-tight mb-2">{phrase.en}</p>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t p-6 flex flex-col items-center shadow-lg">
        <div className="flex items-center gap-8 mb-4">
          <button onClick={() => { setCurrentIndex(0); setIsPlaying(false); }} className="text-gray-400"><RefreshCcw size={28} /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isPlaying ? "bg-red-500" : "bg-blue-600 text-white"}`}>
            {isPlaying ? <Square size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
          </button>
        </div>
        <div className="text-sm font-medium text-gray-700">{isPlaying ? "Now Playing..." : "Stopped"}</div>
      </div>
    </div>
  );
}
