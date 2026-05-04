import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  CheckCircle2,
  Circle,
  Brain,
  Volume2,
  Ear,
} from "lucide-react";

// 学習データ（ご提示いただいたリストから厳選）
const PHRASES = [
  {
    ja: "最近何も思い通りにいかない",
    en: "Things just haven’t been going my way lately.",
    point: "have been + ing (最近ずっと〜)",
  },
  {
    ja: "新しいことは最初からうまくいかない",
    en: "New things are never easy at first.",
    point: "ネイティブがよく使う励まし表現",
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
    point: "that / when I was younger",
  },
  {
    ja: "すべてのジョークがアメリカンジョークってわけじゃない",
    en: "Not all jokes are American jokes.",
    point: "Not all ~ (部分否定)",
  },
  {
    ja: "みんなが同じ考えを持ってるわけじゃない",
    en: "Not all people think the same way.",
    point: "日常でそのまま使える超頻出フレーズ",
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
    ja: "初めにまっすぐ進み、しばらくすると右側に4階建てのビルが見えてくるから、そこを左に曲がって",
    en: "First, go straight. After a while, you’ll see a four-story building on your right, so turn left there.",
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
    point: "文を区切る / on your left",
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
  {
    ja: "プロジェクト全体をどう思う？",
    en: "What do you think of the project overall?",
    point: "think of / overall",
  },
  {
    ja: "正直に言うと良かった",
    en: "It was good, to be honest.",
    point: "to be honest",
  },
  {
    ja: "これをやれば、うまくいくと思うけど、全体的にどう思う？",
    en: "Do this, then it’ll work. What do you think of it overall?",
    point: "then=で / work=機能する",
  },
  {
    ja: "雨が降ると一気に動きづらくなるよな",
    en: "When it rains, it’s hard to move.",
    point: "Whenで状況 / it's hard to",
  },
  {
    ja: "マジで迷惑かけられたわー",
    en: "You really caused me trouble. / You were a pain.",
    point: "能動に変換 / a pain",
  },
  {
    ja: "モチベーションてコロコロ毎日変わるよね？",
    en: "Motivation changes day by day, right?",
    point: "day by day / right?で会話化",
  },
  {
    ja: "ちょっとめんどい奴がいてさ、話すのがしんどいんだよね",
    en: "There’s this guy who’s a pain, and I don’t like talking to him.",
    point: "There's this guy who's",
  },
  {
    ja: "今後の方向迷うなぁ",
    en: "I’m not sure what to do next.",
    point: "not sure / what to",
  },
  {
    ja: "疲れてくると中々できないよね",
    en: "If I’m tired, it’s hard to focus.",
    point: "主語I / hard to focus",
  },
  { ja: "どうやって使うの？", en: "How do I use this?", point: "How do I" },
  {
    ja: "今日中にこのメールだけ仕上げないと",
    en: "I have to finish this email today.",
    point: "finish / today (atは不要)",
  },
  {
    ja: "今日までに仕上げないと",
    en: "I have to finish this by today.",
    point: "by＝期限",
  },
  {
    ja: "彼女はしばらくの間モチベーションを維持する必要がある",
    en: "She needs to stay motivated for a while.",
    point: "for a while",
  },
  {
    ja: "暇なとき何するか迷う？",
    en: "I’m not sure what to do. It changes day by day.",
    point: "what to",
  },
  {
    ja: "友達遅れてる",
    en: "I bet he’ll make an excuse and try to make it funny.",
    point: "make an excuse / try to",
  },
  {
    ja: "時間があったら行けたのに",
    en: "I would have gone if I had time.",
    point: "would have + 過去分詞",
  },
  {
    ja: "もっと早く出ていれば電車に間に合ったのに",
    en: "If I had left earlier, I would have caught the train.",
    point: "比較級 earlier / catch",
  },
  {
    ja: "早く気づいてたら逃げれたのに",
    en: "I would have run away if I had noticed it earlier.",
    point: "would have run away",
  },
  {
    ja: "こんなすごい場所来たことない",
    en: "Wow, I’ve never been to such an amazing place.",
    point: "never been to",
  },
  {
    ja: "やれなかった事なんて気にするな！次やればいい",
    en: "No worries! You didn’t get it this time. Just try again.",
    point: "didn't get it / Just try again",
  },
  {
    ja: "思った通り混んでた",
    en: "It was as crowded as I thought.",
    point: "as ~ as I thought",
  },
  {
    ja: "混むだろうと思ってた",
    en: "I figured it’d be crowded.",
    point: "figured it'd be",
  },
  {
    ja: "ここは本当に癒しを与えてくれる。普通の場所とは空気が違くない？",
    en: "This place really heals me. The atmosphere feels different from other places.",
    point: "heals / atmosphere",
  },
  {
    ja: "俺は自分で会社をやってるから時間を自分で決めれるから",
    en: "I run my own company, so I can manage my own time.",
    point: "manage my own time",
  },
  {
    ja: "ありがたい事にそれが言いたかった事だよ",
    en: "I’m grateful—that’s exactly what I wanted to say.",
    point: "what構文",
  },
  {
    ja: "すべての日がうまくいくわけじゃない",
    en: "Not all days go well.",
    point: "Not all ~ (日常会話でかなり自然)",
  },
  {
    ja: "すべてのミーティングが重要なわけじゃない",
    en: "Not all meetings are important.",
    point: "ビジネスでもそのまま使える",
  },
  {
    ja: "みんながコーヒー好きなわけじゃない",
    en: "Not all people like coffee.",
    point: "会話で感覚をつかむ練習",
  },
  {
    ja: "このアプリで新しいウェブサイトが作れるよ",
    en: "You can make a new website with this app.",
    point: "You can ~ (主語はYou)",
  },
  {
    ja: "オフィスに誰かいる？",
    en: "Is anyone in the office?",
    point: "anyone (制限なし)",
  },
  {
    ja: "数人オフィスにいるよ",
    en: "A few people are in the office.",
    point: "主語1つ＋a few = 少しいる",
  },
  {
    ja: "明日雨降ると思う？",
    en: "Do you think it’ll rain tomorrow?",
    point: "Do you think it'll ~",
  },
  {
    ja: "うん、明日雨降ると思うよ",
    en: "Yeah, I think it will rain tomorrow.",
    point: "will = 予想",
  },
  {
    ja: "このアプリ、けっこういいと思う",
    en: "I think this app is pretty good.",
    point: "pretty (ちょうどいい強さ)",
  },
  {
    ja: "全然心配してないよ。何も心配事はない",
    en: "I’m not worried at all. Nothing is worrying me.",
    point: "worried(状態) vs worrying(動き)",
  },
  {
    ja: "今日までに終わらせなきゃいけないことは何もないよ",
    en: "I don’t have anything I need to finish by today.",
    point: "anything I need to",
  },
  {
    ja: "この色で似たデザインの帽子が欲しい",
    en: "I want a cap in this color with a similar design.",
    point: "in(色) / with(特徴)",
  },
  {
    ja: "この方法で合ってるのか迷う",
    en: "I’m not sure if this method is right.",
    point: "not sure if (〜かどうか)",
  },
  {
    ja: "しばらくはルーティンとして続けるつもり",
    en: "I’ll keep doing it as a routine for a while.",
    point: "keep doing / as a routine",
  },
  {
    ja: "最後までやり切るよ",
    en: "I'll see it through.",
    point: "see it through (最後まで)",
  },
  {
    ja: "思ったほど混んでなかった",
    en: "It wasn’t as crowded as I thought.",
    point: "not as ~ as I thought",
  },
  {
    ja: "思ったより混んでた",
    en: "It was more crowded than I thought.",
    point: "more ~ than I thought",
  },
  {
    ja: "思った通り良かった",
    en: "It was as good as I thought.",
    point: "as good as",
  },
  {
    ja: "思ったほど良くなかった",
    en: "It wasn’t as good as I thought.",
    point: "not as good as",
  },
  {
    ja: "思ったより良かった",
    en: "It was better than I thought.",
    point: "better than I thought",
  },
  {
    ja: "思ったより早く暗くなった",
    en: "It got dark earlier than I thought.",
    point: "got dark / earlier than",
  },
  {
    ja: "難しいと思ってたけど、やっぱり難しかった",
    en: "I figured it’d be hard, and it was.",
    point: "and it was (やっぱりそうだった)",
  },
  {
    ja: "普段は大型連休中は出かけないんだ、混んでるから",
    en: "I usually don’t go out during long holidays because it’s crowded.",
    point: "usually / during",
  },
  {
    ja: "俺は決断する必要がある",
    en: "I need to make a decision.",
    point: "make a decision",
  },
  {
    ja: "思ってた通り混んでたし、実際今までで一番混んでた",
    en: "It was as crowded as I thought—actually, it was the most crowded place I’ve ever been to.",
    point: "the most ~ I've ever",
  },
  {
    ja: "思ってた通り美味しかったし、実際今までで一番の料理だった",
    en: "It was as good as I thought—actually, it was the best meal I’ve ever had.",
    point: "the best ~ I've ever had",
  },
  {
    ja: "思ってたより簡単だったけど、実際は一番簡単なことだった",
    en: "It was easier than I thought—actually, it was the easiest thing I’ve ever done.",
    point: "the easiest thing I've ever done",
  },
  {
    ja: "ちょっとめんどい奴を知ってる",
    en: "I know someone who’s a pain.",
    point: "someone who's",
  },
  {
    ja: "優しい人を知ってるよ",
    en: "I know someone who’s kind.",
    point: "そのまま使える神パターン",
  },
  {
    ja: "生きがんなよ！（調子に乗るな）",
    en: "Don't be full of yourself!",
    point: "full of yourself",
  },
  {
    ja: "それは笑い事じゃないよ",
    en: "That's not a laughing matter.",
    point: "laughing matter",
  },
  {
    ja: "外出するのは好きじゃない",
    en: "I don't like going out.",
    point: "like + ing",
  },
  {
    ja: "これどうやって作るの？",
    en: "How do you make this?",
    point: "How do you ~",
  },
  {
    ja: "あそこにはどうやって行くの？",
    en: "How do I get there?",
    point: "get = 到達",
  },
  {
    ja: "あそこへの行き方は分かるよ",
    en: "I know how to get there.",
    point: "how to get",
  },
  {
    ja: "地図を読むのが苦手なんだ",
    en: "I'm not good at reading maps.",
    point: "not good at + ing",
  },
  {
    ja: "なんかちょっと難しいね",
    en: "It’s kind of hard.",
    point: "kind of (ぼかし)",
  },
  { ja: "けっこうダメだね", en: "It’s pretty bad.", point: "pretty bad" },
  {
    ja: "ちょっと疲れてるけど、英語を話そうとしてるよ",
    en: "I'm kind of tired, but I'm trying to speak in English.",
    point: "trying to speak",
  },
  {
    ja: "今日までずっと続けるよ",
    en: "I’ll do it until today.",
    point: "until (継続)",
  },
  { ja: "まだ終わってないよ", en: "I'm not done yet.", point: "not done yet" },
  {
    ja: "もし知ってたら手伝ったのに",
    en: "I would have helped you if I had known.",
    point: "would have + 過去分詞",
  },
  {
    ja: "もっと安かったら買ったのに",
    en: "I would have bought it if it was cheaper.",
    point: "would have + 過去分詞",
  },
  {
    ja: "何て言ったらいいか分からない",
    en: "I'm not sure what to say.",
    point: "what to say",
  },
  {
    ja: "これの使い方が分からない",
    en: "I'm not sure how to use this.",
    point: "how to use",
  },
  {
    ja: "好きな場所があってさー",
    en: "There’s this place I like.",
    point: "There's this ~ I like",
  },
  {
    ja: "優しい人がいてさ、その人が…",
    en: "There’s this person who’s kind, and...",
    point: "会話スタートに最強",
  },
  {
    ja: "あと少しでできたのに！",
    en: "I almost got it!",
    point: "almost got it (惜しい)",
  },
  {
    ja: "そのうちできるようになるよ！",
    en: "You’ll get it!",
    point: "励まし最強",
  },
  {
    ja: "難しかったけど、なんとかうまくいった",
    en: "It was difficult, but it worked.",
    point: "work (機能する)",
  },
  {
    ja: "もし彼が来たら教えて",
    en: "If he comes, tell me.",
    point: "Ifの中は現在形 (comes)",
  },
  {
    ja: "もし雨が降ったら家にいるよ",
    en: "If it rains, I’ll stay home.",
    point: "rains / stay home",
  },
  {
    ja: "それについてどう思う？",
    en: "What do you think of this?",
    point: "think of (固定)",
  },
  {
    ja: "全体的には良かったよ",
    en: "Overall, it was good.",
    point: "overall (副詞)",
  },
  {
    ja: "あなたは思い通りにいくよ",
    en: "Things will go your way.",
    point: "your way = 思い通り",
  },
];

// 無効な音声（ネタ音声）のブラックリスト
const VOICE_BLACKLIST = [
  "bad news",
  "good news",
  "whisper",
  "zarvox",
  "hysterical",
  "jester",
  "cellos",
  "bubbles",
  "deranged",
  "bells",
  "boing",
  "kathy",
  "princess",
  "trinoids",
  "albert",
  "ralph",
  "bruce",
  "fred",
  "junior",
  "agness",
];

export default function App() {
  const [voices, setVoices] = useState({ ja: [], en: [] });
  const [selectedJaVoice, setSelectedJaVoice] = useState("");
  const [selectedEnVoice, setSelectedEnVoice] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // 'stopped' | 'japanese' | 'thinking' | 'english'
  const [currentStep, setCurrentStep] = useState("stopped");
  const [clearedIndices, setClearedIndices] = useState(new Set());

  // 最新のStateを非同期関数内で参照するためのRef
  const isPlayingRef = useRef(isPlaying);
  const currentIndexRef = useRef(currentIndex);
  const clearedRef = useRef(clearedIndices);
  const timeoutRef = useRef(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    clearedRef.current = clearedIndices;
  }, [clearedIndices]);

  // --- 音声の初期化とフィルタリング ---
  useEffect(() => {
    const loadVoices = () => {
      const synth = window.speechSynthesis;
      const allVoices = synth.getVoices();
      if (allVoices.length === 0) return;

      // ブラックリストの除外
      const validVoices = allVoices.filter((v) => {
        const name = v.name.toLowerCase();
        return !VOICE_BLACKLIST.some((b) => name.includes(b));
      });

      const jaVoices = validVoices.filter((v) => v.lang.startsWith("ja"));
      const enVoices = validVoices.filter((v) => v.lang.startsWith("en"));

      setVoices({ ja: jaVoices, en: enVoices });

      // 高品質な音声を優先的に選択するロジック（言語別に分ける）
      const getPreferredJa = (vList) => {
        const preferred = vList.find((v) => {
          const lowerName = v.name.toLowerCase();
          return (
            lowerName.includes("google") ||
            lowerName.includes("kyoko") ||
            lowerName.includes("haruka") ||
            lowerName.includes("ayumi") ||
            lowerName.includes("ichiro") ||
            lowerName.includes("premium") ||
            lowerName.includes("enhanced")
          );
        });
        return preferred ? preferred.voiceURI : vList[0]?.voiceURI || "";
      };

      const getPreferredEn = (vList) => {
        const preferred = vList.find((v) => {
          const lowerName = v.name.toLowerCase();
          return (
            lowerName.includes("google us english") ||
            lowerName.includes("google uk english") ||
            lowerName.includes("samantha") ||
            lowerName.includes("zira") ||
            lowerName.includes("david") ||
            lowerName.includes("premium") ||
            lowerName.includes("enhanced")
          );
        });
        return preferred ? preferred.voiceURI : vList[0]?.voiceURI || "";
      };

      if (!selectedJaVoice && jaVoices.length > 0)
        setSelectedJaVoice(getPreferredJa(jaVoices));
      if (!selectedEnVoice && enVoices.length > 0)
        setSelectedEnVoice(getPreferredEn(enVoices));
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // --- 音声再生用ユーティリティ ---
  const speakText = (text, voiceURI, lang) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !isPlayingRef.current) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const allVoices = window.speechSynthesis.getVoices();
      const voice = allVoices.find((v) => v.voiceURI === voiceURI);

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang; // 選んだ音声の言語設定に強制的に合わせる（コンフリクト防止）
      } else {
        utterance.lang = lang;
      }

      // 読み上げ速度を少し調整（ネイティブっぽさを残しつつ聞き取りやすく）
      utterance.rate = lang === "en-US" ? 0.95 : 1.0;

      utterance.onend = resolve;
      utterance.onerror = resolve; // エラー時も止めない

      window.speechSynthesis.speak(utterance);
    });
  };

  const wait = (ms) =>
    new Promise((resolve) => {
      timeoutRef.current = setTimeout(resolve, ms);
    });

  // --- メイン再生ループ ---
  const playLoop = async () => {
    while (isPlayingRef.current) {
      let idx = currentIndexRef.current;

      // 全てクリアされているかチェック
      if (clearedRef.current.size >= PHRASES.length) {
        setIsPlaying(false);
        setCurrentStep("stopped");
        break;
      }

      // スキップ処理
      if (clearedRef.current.has(idx)) {
        setCurrentIndex((idx + 1) % PHRASES.length);
        continue;
      }

      const phrase = PHRASES[idx];

      // 1. 日本語の読み上げ
      setCurrentStep("japanese");
      const safeJaText = phrase.ja.replace(/\//g, "、");
      await speakText(safeJaText, selectedJaVoice, "ja-JP");

      // 途中で停止や手動シークされたらループをリセット
      if (!isPlayingRef.current || currentIndexRef.current !== idx) continue;

      // 2. 思考時間（文字数 × 70ms + 600ms）
      setCurrentStep("thinking");
      const thinkTime = phrase.en.length * 70 + 600;
      await wait(thinkTime);

      if (!isPlayingRef.current || currentIndexRef.current !== idx) continue;

      // 3. 英語の読み上げ
      setCurrentStep("english");
      const safeEnText = phrase.en.replace(/\//g, ", ");
      await speakText(safeEnText, selectedEnVoice, "en-US");

      if (!isPlayingRef.current || currentIndexRef.current !== idx) continue;

      // 次のフレーズへ
      const nextIdx = (idx + 1) % PHRASES.length;
      setCurrentIndex(nextIdx);
      currentIndexRef.current = nextIdx; // State更新と同時にRefも即座に更新してタイムラグを防ぐ
    }
  };

  // 再生ステータスが変更されたときのトリガー
  useEffect(() => {
    if (isPlaying) {
      window.speechSynthesis.cancel(); // 前の音声をクリア
      clearTimeout(timeoutRef.current);
      playLoop();
    } else {
      window.speechSynthesis.cancel();
      clearTimeout(timeoutRef.current);
      setCurrentStep("stopped");
    }
    return () => {
      window.speechSynthesis.cancel();
      clearTimeout(timeoutRef.current);
    };
  }, [isPlaying]);

  // --- ハンドラー ---
  const handleItemClick = (index) => {
    window.speechSynthesis.cancel();
    clearTimeout(timeoutRef.current);
    setCurrentIndex(index);
    currentIndexRef.current = index; // 手動シーク時も即座に同期
    if (!isPlaying) setIsPlaying(true);
  };

  const toggleClear = (e, index) => {
    e.stopPropagation(); // 親要素（Item）のクリック発火を防ぐ
    setClearedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header (設定エリア) */}
      <header className="sticky top-0 bg-white shadow-sm z-20 px-4 py-3 border-b border-gray-200">
        <h1 className="text-lg font-bold text-center mb-3 text-blue-900">
          神フレーズ・シャドーイング
        </h1>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              🇯🇵 日本語の声
            </label>
            <select
              className="w-full bg-gray-100 border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 appearance-none"
              value={selectedJaVoice}
              onChange={(e) => setSelectedJaVoice(e.target.value)}
            >
              {voices.ja.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 relative">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              🇺🇸 英語の声
            </label>
            <select
              className="w-full bg-gray-100 border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 appearance-none"
              value={selectedEnVoice}
              onChange={(e) => setSelectedEnVoice(e.target.value)}
            >
              {voices.en.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main List Area */}
      <main className="flex-1 overflow-y-auto pb-28">
        {PHRASES.map((phrase, index) => {
          const isActive = index === currentIndex;
          const isCleared = clearedIndices.has(index);
          const isThinking = isActive && currentStep === "thinking";

          return (
            <div
              key={index}
              onClick={() => handleItemClick(index)}
              className={`
                relative p-4 border-b border-gray-100 cursor-pointer transition-all duration-300
                ${isCleared ? "opacity-50 bg-gray-50" : "bg-white"}
                ${
                  isActive && !isCleared
                    ? "bg-blue-50/50 border-l-4 border-l-blue-500 shadow-inner"
                    : "border-l-4 border-l-transparent"
                }
              `}
            >
              <div className="pr-10">
                {/* 日本語 */}
                <p
                  className={`font-bold mb-2 text-sm md:text-base ${
                    isCleared ? "text-gray-500 line-through" : "text-gray-800"
                  }`}
                >
                  {phrase.ja}
                </p>

                {/* 英語エリア（ぼかし演出の起点） */}
                <div className="relative min-h-[2rem]">
                  <p
                    className={`
                    text-base md:text-lg font-bold text-blue-700 transition-all duration-500
                    ${isThinking ? "blur-md text-gray-400 select-none" : ""}
                    ${isCleared ? "text-gray-400 line-through" : ""}
                  `}
                  >
                    {phrase.en}
                  </p>

                  {/* 脳アイコン（思考時間中のみ表示） */}
                  {isThinking && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                      <Brain className="w-8 h-8 text-blue-500 animate-pulse drop-shadow-lg" />
                    </div>
                  )}
                </div>

                {/* 神ポイント（解説） */}
                <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md font-medium">
                  💡 {phrase.point}
                </div>
              </div>

              {/* クリアボタントグル */}
              <button
                onClick={(e) => toggleClear(e, index)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-green-500 transition-colors"
                aria-label="Mark as learned"
              >
                {isCleared ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
            </div>
          );
        })}
      </main>

      {/* Bottom Control Bar */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30 pb-safe">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          {/* Status Display */}
          <div className="flex flex-col flex-1">
            <span className="text-xs text-gray-500 font-semibold mb-1">
              STATUS
            </span>
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
              {currentStep === "stopped" && (
                <>
                  <Square className="w-4 h-4 text-gray-400" /> 停止中
                </>
              )}
              {currentStep === "japanese" && (
                <>
                  <Ear className="w-4 h-4 text-orange-500 animate-pulse" />{" "}
                  日本語を読み上げ中...
                </>
              )}
              {currentStep === "thinking" && (
                <>
                  <Brain className="w-4 h-4 text-blue-500 animate-bounce" />{" "}
                  英語を頭で組み立てましょう！
                </>
              )}
              {currentStep === "english" && (
                <>
                  <Volume2 className="w-4 h-4 text-green-500 animate-pulse" />{" "}
                  英語を読み上げ中...
                </>
              )}
            </div>
          </div>

          {/* Play / Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`
              flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform active:scale-95
              ${isPlaying ? "bg-gray-800 text-white" : "bg-blue-600 text-white"}
            `}
          >
            {isPlaying ? (
              <Square className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
