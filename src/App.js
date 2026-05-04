import React, { useState, useEffect, useRef } from "react";
import { Play, Square, CheckCircle2, Circle, RefreshCcw } from "lucide-react";

// 学習データ（フレーズをここに追加できます）
const PHRASES = [
  {
    ja: "最近何も思い通りにいかない",
    en: "Things just haven’t been going my way lately.",
    point: "have been + ing (最近ずっと〜)",
  },
  {
    ja: "新しいことは最初からうまくいかない",
    en: "New things are never easy at first.",
    point: "ネイティブの励まし表現",
  },
  {
    ja: "俺、狭い部屋苦手なんだよね",
    en: "I’m not really comfortable in small spaces.",
    point: "not comfortable (居心地が悪い)",
  },
  {
    ja: "いつミーティングできるかな？なるべく早くやりたいんだけど",
    en: "When can we have a meeting? I’d like to do it as soon as possible.",
    point: "we / have a meeting",
  },
  {
    ja: "今それが流行ってるんだ？俺の若い頃にはなかったな",
    en: "Is that popular now? We didn’t have that when I was younger.",
    point: "when I was younger",
  },
  {
    ja: "すべてのジョークがアメリカンジョークってわけじゃない",
    en: "Not all jokes are American jokes.",
    point: "Not all ~ (部分否定)",
  },
  {
    ja: "みんなが同じ考えを持ってるわけじゃない",
    en: "Not all people think the same way.",
    point: "超頻出フレーズ",
  },
  {
    ja: "その話は3日後に話し合う予定です",
    en: "We’re going to talk about it in three days.",
    point: "in three days (3日後に)",
  },
  {
    ja: "深く考えないと後々大変な事になるよ",
    en: "If you don’t think it through, it’ll cause problems later.",
    point: "think it through / cause problems",
  },
  {
    ja: "それ使って何ができるの？",
    en: "What can you do with that?",
    point: "do with",
  },
  {
    ja: "それ相手に伝わっている？",
    en: "Is that getting across to the other person?",
    point: "get across / to the other person",
  },
  {
    ja: "昨日の試合はマジで面白かった！俺は超興奮したよ！",
    en: "Last night’s game was amazing! I was so excited!",
    point: "amazing(結果) / excited(自分)",
  },
  {
    ja: "全ての人が彼を好きなわけじゃないよね？",
    en: "Not everyone likes him, right?",
    point: "Not everyone + 単数扱い",
  },
  {
    ja: "初めにまっすぐ進み、しばらくすると右側にビルが見えてくるから、そこを左に曲がって",
    en: "First, go straight. After a while, you’ll see a building on your right, so turn left there.",
    point: "After a while / on your right",
  },
  {
    ja: "ちょっと待って、考えるわ",
    en: "OK, hold on. Let me think.",
    point: "hold on / Let me",
  },
  {
    ja: "それでは、ちょっとやってみるね",
    en: "So, let me try.",
    point: "So + Let me (最強コンボ)",
  },
  {
    ja: "疲れたから、今日は早く寝るね",
    en: "I’m tired, so I’ll go to bed early.",
    point: "will=今から",
  },
  {
    ja: "まっすぐ進んで、しばらくすると左にコンビニが見えてくるよ",
    en: "Go straight. After a while, you’ll see a convenience store on your left.",
    point: "on your left",
  },
  {
    ja: "ちゃんと伝わってる？",
    en: "Is that getting across? / Does that make sense?",
    point: "make sense 最強",
  },
  {
    ja: "良い思い出になれば嬉しい",
    en: "I’ll be happy if it becomes a good memory for you.",
    point: "if / becomes",
  },
];

export default function App() {
  const [voices, setVoices] = useState({ ja: [], en: [] });
  const [selectedJaVoice, setSelectedJaVoice] = useState("");
  const [selectedEnVoice, setSelectedEnVoice] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState("stopped");
  const [clearedIndices, setClearedIndices] = useState(new Set());

  const isPlayingRef = useRef(isPlaying);
  const currentIndexRef = useRef(currentIndex);
  const timeoutRef = useRef(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    const loadVoices = () => {
      const synth = window.speechSynthesis;
      const allVoices = synth.getVoices();
      const ja = allVoices.filter((v) => v.lang.startsWith("ja"));
      const en = allVoices.filter((v) => v.lang.startsWith("en"));
      setVoices({ ja, en });
      if (ja.length > 0 && !selectedJaVoice) setSelectedJaVoice(ja[0].voiceURI);
      if (en.length > 0 && !selectedEnVoice) setSelectedEnVoice(en[0].voiceURI);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text, voiceURI, lang) => {
    return new Promise((resolve) => {
      if (!isPlayingRef.current) return resolve();
      const uttr = new SpeechSynthesisUtterance(text);
      uttr.voice = window.speechSynthesis
        .getVoices()
        .find((v) => v.voiceURI === voiceURI);
      uttr.lang = lang;
      uttr.rate = lang.startsWith("en") ? 0.85 : 1.0;
      uttr.onend = resolve;
      uttr.onerror = resolve;
      window.speechSynthesis.speak(uttr);
    });
  };

  const wait = (ms) =>
    new Promise((r) => {
      timeoutRef.current = setTimeout(r, ms);
    });

  const playLoop = async () => {
    while (isPlayingRef.current) {
      let idx = currentIndexRef.current;
      const p = PHRASES[idx];

      setCurrentStep("japanese");
      await speak(p.ja, selectedJaVoice, "ja-JP");
      if (!isPlayingRef.current) break;

      setCurrentStep("thinking");
      await wait(p.en.length * 70 + 1200);
      if (!isPlayingRef.current) break;

      setCurrentStep("english");
      await speak(p.en, selectedEnVoice, "en-US");
      if (!isPlayingRef.current) break;

      await wait(1000);
      const next = (idx + 1) % PHRASES.length;
      setCurrentIndex(next);
      currentIndexRef.current = next;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      playLoop();
    } else {
      window.speechSynthesis.cancel();
      clearTimeout(timeoutRef.current);
      setCurrentStep("stopped");
    }
  }, [isPlaying]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white px-4 py-4 shadow-sm border-b border-slate-200 z-50 text-center">
        <h1 className="text-xl font-black text-indigo-600 tracking-tighter">
          SHADOWING PRO
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-44">
        <div className="max-w-2xl mx-auto p-4 space-y-3">
          {PHRASES.map((p, i) => (
            <div
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                currentIndexRef.current = i;
                if (!isPlaying) setIsPlaying(true);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                i === currentIndex
                  ? "bg-indigo-50 border-indigo-300 ring-2 ring-indigo-100 shadow-sm"
                  : "bg-white border-slate-100 shadow-sm"
              }`}
            >
              <div className="flex justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-500">
                    {i + 1}. {p.ja}
                  </p>
                  <p
                    className={`text-lg font-black text-slate-800 ${
                      i === currentIndex && currentStep === "thinking"
                        ? "blur-md opacity-20 transition-all duration-700"
                        : ""
                    }`}
                  >
                    {p.en}
                  </p>
                  <p className="text-[10px] font-bold text-indigo-400 mt-2 italic">
                    {p.point}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const s = new Set(clearedIndices);
                    s.has(i) ? s.delete(i) : s.add(i);
                    setClearedIndices(s);
                  }}
                  className="shrink-0 pt-1"
                >
                  {clearedIndices.has(i) ? (
                    <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                  ) : (
                    <Circle className="text-slate-200 w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-6 shadow-lg z-50 pb-safe">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                }`}
              ></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {currentStep}
              </span>
            </div>
            <p className="text-lg font-black text-slate-700">
              {currentStep === "japanese" && "聞く 👂"}
              {currentStep === "thinking" && "考える 🧠"}
              {currentStep === "english" && "話す 🗣️"}
              {currentStep === "stopped" && "待機中"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
                setCurrentIndex(0);
                currentIndexRef.current = 0;
              }}
              className="p-3 text-slate-300 hover:text-indigo-400 transition-colors"
            >
              <RefreshCcw />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                isPlaying
                  ? "bg-slate-800 text-white"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {isPlaying ? (
                <Square fill="currentColor" size={24} />
              ) : (
                <Play fill="currentColor" size={28} className="ml-1" />
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
