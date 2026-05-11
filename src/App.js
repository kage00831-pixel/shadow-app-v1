import React, { useState, useEffect } from "react";
import { Play, Square, CheckCircle2, Circle, RefreshCcw } from "lucide-react";

const PHRASES = [
  { ja: "最近何も思い通りにいかない", en: "Things just haven't been going my way lately.", point: "have been + ing (最近ずっと〜)" },
  { ja: "彼女はどうしてやる気が続かないの？", en: "Why can’t she stay motivated?", point: "stay motivated = やる気を維持する" },
  { ja: "新しいことは最初からうまくいかない", en: "New things are never easy at first.", point: "ネイティブがよく使う励まし表現" },
  { ja: "あなたは思い通りにいくよ", en: "Things will go your way.", point: "your way = あなたの思い通り" },
  { ja: "俺、狭い部屋苦手なんだよね", en: "I’m not really comfortable in small spaces.", point: "not comfortable（居心地が悪い）" },
  { ja: "いつミーティングできるかな？なるべく早くやりたいんだけど", en: "When can we have a meeting? I’d like to do it as soon as possible.", point: "as soon as possible（なるべく早く）" },
  { ja: "今それが流行ってるんだ？俺の若い頃にはなかったな", en: "Is that popular now? We didn’t have that when I was younger.", point: "when I was younger（若い頃）" },
  { ja: "すべてのジョークがアメリカンジョークってわけじゃない", en: "Not all jokes are American jokes.", point: "Not all ~（すべてが〜というわけではない）" },
  { ja: "いいえ大丈夫です。私はただタクシーを捕まえたいだけです。ところでこの近くで捕まえられますか？", en: "No, thank you. I just want to catch a taxi. By the way, can I catch one nearby?", point: "By the way（ところで）" },
  { ja: "その話は3日後に話し合う予定です", en: "We’re going to talk about it in three days.", point: "in three days（3日後）" },
  { ja: "みんなが同じ考えを持ってるわけじゃない", en: "Not all people think the same way.", point: "think the same way（同じように考える）" },
  { ja: "すべての日がうまくいくわけじゃない", en: "Not all days go well.", point: "go well（うまくいく）" },
  { ja: "すべての投資が成功するわけじゃない", en: "Not all investments succeed.", point: "Not all ~ の応用" },
  { ja: "すべてのミーティングが重要なわけじゃない", en: "Not all meetings are important.", point: "ビジネスでも使える表現" },
  { ja: "みんながコーヒー好きなわけじゃない", en: "Not all people like coffee.", point: "感覚をつかむ練習" },
  { ja: "深く考えないと後々大変な事になるよ", en: "If you don’t think it through, it’ll cause problems later.", point: "think it through（考え抜く）" },
  { ja: "それ使って何ができるの？", en: "What can you do with that?", point: "with that（それを使って）" },
  { ja: "それ相手に伝わっている？", en: "Is that getting across to the other person?", point: "get across（伝わる）" },
  { ja: "昨日の試合はマジで面白かった！俺は超興奮したよ！", en: "Last night’s game was amazing! I was so excited!", point: "excited（興奮した）" },
  { ja: "彼が来るとは思えない", en: "I don’t think he’ll come.", point: "I don't think ~（〜とは思わない）" },
  { ja: "全ての人が彼を好きなわけじゃないよね？", en: "Not everyone likes him, right?", point: "Not everyone（全員が〜ではない）" },
  { ja: "地図読むの苦手なんだよね", en: "I’m not good at reading maps.", point: "be not good at ~ing" },
  { ja: "今日疲れてるけど、英語を話そうと頑張ってるよ", en: "I’m kind of tired, but I’m trying to speak in English.", point: "try to ~（〜しようとする）" },
  { ja: "全然心配してないよ。何も気にしてない。", en: "I’m not worried at all. Nothing is worrying me.", point: "not ~ at all（全然〜ない）" },
  { ja: "今日までに終わらせなきゃいけないことはないよ", en: "I don’t have anything I need to finish by today.", point: "by today（今日までに）" },
  { ja: "彼は言い訳して面白くしようとするだろうね", en: "I bet he’ll make an excuse and try to make it funny.", point: "make it funny（面白くする）" },
  { ja: "時間があれば行くよ", en: "I would go if I had time.", point: "仮定法過去（今の話）" },
  { ja: "時間があったら行けたのに", en: "I would have gone if I had time.", point: "仮定法過去完了（過去の未練）" },
  { ja: "この色で似たデザインの帽子が欲しい", en: "I want a cap in this color with a similar design.", point: "in color / with design" },
  { ja: "もっと早く出ていれば電車に間に合ったのに", en: "I would have caught the train if I had left earlier.", point: "後悔の表現" },
  { ja: "この方法が正しいのかどうか分からない", en: "I’m not sure if this method is right.", point: "I'm not sure if ~（〜か分からない）" },
  { ja: "もっと早く気づいていたら逃げられたのに", en: "I would have run away if I had noticed it earlier.", point: "earlier（もっと早く）" },
  { ja: "とにかくしばらくルーティンとして続けるよ", en: "I’ll keep doing it as a routine for a while.", point: "keep doing（し続ける）" },
  { ja: "こんなすごい場所来たことない！", en: "Wow, I’ve never been to such an amazing place.", point: "have never been to（未経験）" },
  { ja: "このプロジェクト、うまくいくか心配なんだ", en: "I’m worried it might not go well.", point: "might not（〜じゃないかも）" },
  { ja: "気にするな！今回はできなかっただけさ。また次やればいい。", en: "No worries! You didn’t get it this time. Just try again.", point: "Just try again（またやればいい）" },
  { ja: "思った通り混んでた", en: "It was as crowded as I thought.", point: "as ~ as I thought（思った通り）" },
  { ja: "思ったほど混んでなかった", en: "It wasn’t as crowded as I thought.", point: "not as ~ as（思ったほど〜ない）" },
  { ja: "思ったより混んでた", en: "It was more crowded than I thought.", point: "more ~ than I thought（思ったより）" },
  { ja: "思った通り良かった", en: "It was as good as I thought.", point: "期待通り" },
  { ja: "思ったより良かった", en: "It was better than I thought.", point: "期待以上" },
  { ja: "混むだろうなと思ってた", en: "I figured it’d be crowded.", point: "I figured ~（〜だと思ってた）" },
  { ja: "思ってたより早く暗くなった", en: "It got dark earlier than I thought.", point: "比較級 + than I thought" },
  { ja: "忙しいと思ってたけど、そうでもなかった", en: "I figured it’d be busy, but it wasn’t.", point: "予想が外れたとき" },
  { ja: "難しいと思ってたけど、やっぱり難しかった", en: "I figured it’d be hard, and it was.", point: "予想通りだったとき" },
  { ja: "本当に迷惑をかけてごめん", en: "I’m really sorry I caused you trouble.", point: "cause someone trouble" },
  { ja: "ここは本当に癒される。空気が他の場所と違うよね？", en: "This place really heals me. The atmosphere feels different from other places.", point: "different from ~（〜と違う）" },
  { ja: "普段は連休中には出かけないよ。混んでるからね。", en: "I usually don’t go out during long holidays because it’s crowded.", point: "during（〜の間）" },
  { ja: "自分の会社をやってるから、自分で時間を管理できるんだ", en: "I run my own company, so I can manage my own time.", point: "manage my time（時間を管理する）" },
  { ja: "ありがたいことに、それがまさに言いたかったことだよ", en: "I’m grateful—that’s exactly what I wanted to say.", point: "I'm grateful（感謝している）" },
  { ja: "思ってた通り混んでたし、実際これまでで一番混んでたよ", en: "It was as crowded as I thought—actually, it was the most crowded place I’ve ever been to.", point: "I've ever been to（これまでで一番）" },
  { ja: "思ってた通り美味しかったし、実際これまでで最高の食事だった", en: "It was as good as I thought—actually, it was the best meal I’ve ever had.", point: "the best ~ I've ever had" },
  { ja: "思ってたより遠かったし、実際これまでで一番遠い場所だった", en: "It was farther than I thought—actually, it was the farthest place I’ve ever been to.", point: "farther / farthest" },
  { ja: "明日雨降ると思う？", en: "Do you think it’ll rain tomorrow?", point: "Do you think ~（〜と思う？）" },
  { ja: "まっすぐ行って。しばらくすると左側にコンビニが見えるよ。", en: "Go straight. After a while, you’ll see a convenience store on your left.", point: "on your left（左側に）" },
  { ja: "そこで右に曲がって", en: "Turn right there.", point: "there（そこで）" },
  { ja: "これをやればうまくいく。全体的にどう思う？", en: "Do this, then it’ll work. What do you think of it overall?", point: "overall（全体的に）" },
  { ja: "もし問題が起きたら教えて。彼らにやらせるから。", en: "If it causes a problem, tell me. I’ll let them do it.", point: "let someone do（〜させる）" },
  { ja: "正直忙しかったけど楽しかった。良い思い出になれば嬉しいな。", en: "To be honest, I was busy, but it was fun. I’ll be happy if it becomes a good memory for you.", point: "I'll be happy if ~" },
  { ja: "難しかったけど、たぶんうまくいくと思う。全体的にいいアイデアだね。", en: "It was difficult, but it might work. I think it’s a good idea overall.", point: "it might work（うまくいくかも）" },
  { ja: "雨が降ると、動きづらくなるよね", en: "When it rains, it’s hard to move.", point: "it's hard to ~（〜しづらい）" },
  { ja: "モチベーションって日々変わるよね？", en: "Motivation changes day by day, right?", point: "day by day（日々）" },
  { ja: "ちょっと面倒な奴がいてさ、話すのがしんどいんだよね", en: "There’s this guy who’s a pain, and I don’t like talking to him.", point: "someone who's a pain（面倒な人）" },
  { ja: "生きがんなよ！（調子に乗るなよ）", en: "Don't be full of yourself!", point: "口語表現" },
  { ja: "今後の方向性に迷ってるんだ", en: "I’m not sure what to do next.", point: "what to do next（次に何をすべきか）" },
  { ja: "疲れてくると、集中するのが難しくなるよね", en: "If I’m tired, it’s hard to focus.", point: "hard to focus（集中しづらい）" },
  { ja: "今日中にこのメールを仕上げなきゃいけないんだ", en: "I have to finish this email today.", point: "have to（〜しなきゃいけない）" },
  { ja: "まだ終わってないよ", en: "I’m not done yet.", point: "I'm not done（終わってない）" },
  { ja: "多分、彼はそれを笑いに変えようとするよ", en: "I bet he’ll try to make it funny.", point: "I bet（きっと〜だ）" },
  { ja: "とにかく、最後までやり遂げるよ", en: "Anyway, I’ll see it through.", point: "see it through（やり遂げる）" },
  { ja: "期待に応えられるように頑張るよ", en: "I’ll do my best to live up to your expectations.", point: "live up to（期待に応える）" },
  { ja: "焦らなくていいよ。自分のペースでいこう。", en: "No need to rush. Just go at your own pace.", point: "at your own pace（自分のペースで）" },
  { ja: "それでは、ちょっとやってみるね", en: "So, let me try.", point: "let me try（〜させて）" },
  { ja: "彼は何時ごろここに来るかな？", en: "What time will he come here?", point: "What time ~（何時ごろ〜）" },
  { ja: "ちょっと待って、考えさせて", en: "OK, hold on. Let me think.", point: "hold on（待って）" },
  { ja: "疲れたから、今日は早く寝るよ", en: "I’m tired, so I’ll go to bed early.", point: "go to bed early（早く寝る）" },
  { ja: "正直忙しかったけど、楽しかったよ", en: "To be honest, I was busy, but it was fun.", point: "To be honest（正直に言うと）" },
  { ja: "外出するのは好きじゃないんだ", en: "I don't like going out.", point: "don't like ~ing" },
  { ja: "けっこういい感じだね", en: "It’s pretty good.", point: "pretty（けっこう）" },
  { ja: "何を食べるか決まってないんだ", en: "I’m not sure what to eat.", point: "what to eat（何を食べるか）" },
  { ja: "これ、どうやって使うの？", en: "How do I use this?", point: "How do I ~（どうやって〜）" },
  { ja: "今日中にこれだけは終わらせないと", en: "I have to finish this by today.", point: "by today（今日までに）" },
  { ja: "行き方は分かってるよ", en: "I know how to get there.", point: "how to get there（行き方）" },
  { ja: "多分、彼は笑いに変えようとするよ", en: "I bet he’ll try to make it funny.", point: "make it funny（面白くする）" },
  { ja: "時間があれば行けたのに（過去の後悔）", en: "I would have gone if I had time.", point: "would have gone" },
  { ja: "この色で似た形の帽子が欲しいな", en: "I want a cap in this color with a similar design.", point: "in color / with design" },
  { ja: "もっと早く出ていればよかったな", en: "I should have left earlier.", point: "should have（〜すべきだった）" },
  { ja: "しばらくルーティンとして続けるつもりだよ", en: "I’ll keep doing it as a routine for a while.", point: "keep doing（し続ける）" },
  { ja: "最後までやり遂げるよ", en: "I’ll see it through.", point: "see it through（やり遂げる）" },
  { ja: "思ったほど混んでなかったよ", en: "It wasn’t as crowded as I thought.", point: "not as ~ as（思ったほど〜ない）" },
  { ja: "思ったより良かったよ", en: "It was better than I thought.", point: "better than（〜より良い）" },
  { ja: "忙しいと思ってたけど、そうでもなかった", en: "I figured it’d be busy, but it wasn’t.", point: "予想と結果" },
  { ja: "空気感が他とは違うよね", en: "The atmosphere feels different from other places.", point: "atmosphere（空気感）" },
  { ja: "自分で時間を管理できるんだ", en: "I can manage my own time.", point: "manage time（時間を管理する）" },
  { ja: "それがまさに言いたかったことだよ", en: "That’s exactly what I wanted to say.", point: "what I wanted to say" },
  { ja: "これまでで一番遠い場所だったよ", en: "It was the farthest place I’ve ever been to.", point: "the farthest（一番遠い）" },
  { ja: "これまでで最高の食事だったよ", en: "It was the best meal I’ve ever had.", point: "the best I've ever had" },
  { ja: "焦る必要はないよ。自分のペースでいこう。", en: "No need to rush. Just go at your own pace.", point: "at your own pace" },
  { ja: "また明日会いましょう", en: "See you tomorrow.", point: "挨拶の基本" },
  { ja: "ついに100番まで来たね！おめでとう！", en: "You finally made it to number 100! Congratulations!", point: "達成の表現" },
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

  useEffect(() => {
    let isCancelled = false;

    const playSequence = async () => {
      if (!isPlaying) return;
      window.speechSynthesis.cancel();
      const currentPhrase = PHRASES[currentIndex];

      // 【Bluetooth対策】
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
      await new Promise(resolve => setTimeout(resolve, 500));

      await new Promise((resolve) => {
        const utJa = new SpeechSynthesisUtterance(currentPhrase.ja);
        utJa.lang = "ja-JP";
        utJa.onend = resolve;
        utJa.onerror = resolve;
        if (!isCancelled) window.speechSynthesis.speak(utJa);
      });

      if (isCancelled) return;
      // ⭐️ 待機時間を2秒に変更
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (isCancelled) return;

      window.speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
      await new Promise(resolve => setTimeout(resolve, 500));

      await new Promise((resolve) => {
        const utEn = new SpeechSynthesisUtterance(currentPhrase.en);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Samantha"));
        if (preferredVoice) utEn.voice = preferredVoice;
        utEn.lang = "en-US";
        utEn.rate = 0.8;
        utEn.onend = resolve;
        utEn.onerror = resolve;
        if (!isCancelled) window.speechSynthesis.speak(utEn);
      });

      if (isCancelled) return;
      // ⭐️ 待機時間を2秒に変更
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (isCancelled) return;

      if (currentIndex < PHRASES.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    if (isPlaying) playSequence();
    else window.speechSynthesis.cancel();

    return () => { isCancelled = true; window.speechSynthesis.cancel(); };
  }, [currentIndex, isPlaying]);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="bg-white border-b sticky top-0 z-10 p-4 shadow-sm text-center">
        <h1 className="text-xl font-bold text-blue-600">SHADOWING 100 (2s Ver.)</h1>
        <div className="text-xs text-gray-500 mt-1">Progress: {Object.values(completed).filter(Boolean).length} / {PHRASES.length}</div>
      </div>
      <div className="max-w-md mx-auto p-4 space-y-4">
        {PHRASES.map((phrase, index) => (
          <div key={index} onClick={() => { setCurrentIndex(index); setIsPlaying(true); }}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${currentIndex === index ? "border-blue-500 bg-blue-50" : "border-white bg-white shadow-sm"}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-blue-400">#{index + 1}</span>
              <button onClick={(e) => { e.stopPropagation(); toggleComplete(index); }} className={completed[index] ? "text-green-500" : "text-gray-300"}>
                <CheckCircle2 size={24} />
              </button>
            </div>
            <p className="text-gray-600 text-sm">{phrase.ja}</p>
            <p className="text-lg font-bold text-gray-900">{phrase.en}</p>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t p-6 flex flex-col items-center">
        <div className="flex items-center gap-8 mb-4">
          <button onClick={() => { setCurrentIndex(0); setIsPlaying(false); }} className="text-gray-400"><RefreshCcw size={28} /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isPlaying ? "bg-red-500" : "bg-blue-600 text-white"}`}>
            {isPlaying ? <Square size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
