
import { useState } from "react";
import "./SpaceAssistant.css";

type Message = {
  role: "user" | "assistant";
  text: string;
};

type KnowledgeItem = {
  keywords: string[];
  answerEn: string;
  answerAr: string;
};

const knowledge: KnowledgeItem[] = [
  {
    keywords: [
      "radiation",
      "space radiation",
      "radiation dose",
      "الإشعاع",
      "اشعاع",
      "جرعة",
      "الجرعة",
    ],
    answerEn:
      "Space radiation can damage cells and DNA. Its potential health effects depend on the accumulated dose, exposure duration, and individual factors. Our project explores possible relationships between radiation and astronaut health.",
    answerAr:
      "الإشعاع الفضائي ممكن يؤثر على الخلايا والحمض النووي. وتعتمد آثاره الصحية المحتملة على الجرعة المتراكمة ومدة التعرض وعوامل خاصة بكل شخص. مشروعنا بدرس العلاقة المحتملة بين الإشعاع وصحة رائد الفضاء.",
  },
  {
    keywords: [
      "immune",
      "immunity",
      "immune system",
      "المناعة",
      "مناعه",
      "الجهاز المناعي",
    ],
    answerEn:
      "Spaceflight may affect immune system function due to factors such as microgravity, stress, sleep disruption, and radiation. The effects can vary between astronauts.",
    answerAr:
      "رحلات الفضاء ممكن تأثر على وظائف الجهاز المناعي بسبب عوامل مثل انعدام الجاذبية والضغط النفسي واضطراب النوم والإشعاع. والتأثير ممكن يختلف من رائد فضاء لآخر.",
  },
  {
    keywords: [
      "latent virus",
      "latent viruses",
      "virus",
      "viruses",
      "viral reactivation",
      "الفيروس",
      "الفيروسات",
      "كامنة",
      "فيروس كامن",
    ],
    answerEn:
      "Latent viruses can remain inactive in the body and sometimes reactivate. Repeated testing can help researchers track changes over time. However, a relationship with radiation must be investigated rather than assumed.",
    answerAr:
      "الفيروسات الكامنة ممكن تظل غير نشطة داخل الجسم، وأحيانًا تعاود النشاط. تكرار الفحوص بساعد الباحثين يتابعوا التغيرات مع الوقت، لكن العلاقة مع الإشعاع لازم تنفحص علميًا وما بنفترضها مسبقًا.",
  },
  {
    keywords: [
      "vital signs",
      "blood pressure",
      "temperature",
      "blood test",
      "المؤشرات الحيوية",
      "ضغط الدم",
      "الحرارة",
      "فحوص الدم",
      "مؤشرات الدم",
    ],
    answerEn:
      "Important health measurements may include blood pressure, body temperature, and blood test results. Tracking them over time can help researchers identify trends and possible associations with radiation exposure.",
    answerAr:
      "من المؤشرات الصحية المهمة ضغط الدم ودرجة الحرارة ونتائج فحوص الدم. متابعتها مع الوقت بتساعد الباحثين يلاحظوا التغيرات والعلاقات المحتملة بينها وبين التعرض للإشعاع.",
  },
  {
    keywords: [
      "cumulative dose",
      "accumulated radiation",
      "accumulation",
      "جرعة متراكمة",
      "الإشعاع المتراكم",
      "تراكم الإشعاع",
    ],
    answerEn:
      "Cumulative radiation dose represents the radiation dose accumulated over a period of time. Monitoring it helps researchers study how exposure changes throughout a space mission.",
    answerAr:
      "الجرعة الإشعاعية المتراكمة هي الجرعة اللي بتتجمع خلال فترة زمنية. مراقبتها بتساعد الباحثين يدرسوا كيف بتتغير مستويات التعرض خلال رحلة الفضاء.",
  },
  {
    keywords: [
      "microgravity",
      "zero gravity",
      "انعدام الجاذبية",
      "الجاذبية",
    ],
    answerEn:
      "Microgravity changes how the human body functions and adapts. It can influence muscles, bones, fluid distribution, and other physiological processes during spaceflight.",
    answerAr:
      "انعدام الجاذبية تقريبًا بغيّر طريقة عمل الجسم وتكيفه، وممكن يؤثر على العضلات والعظام وتوزيع السوائل وعمليات حيوية ثانية خلال رحلة الفضاء.",
  },
  {
    keywords: [
      "ai",
      "artificial intelligence",
      "machine learning",
      "الذكاء الاصطناعي",
      "الذكاء",
      "ai analysis",
    ],
    answerEn:
      "AI can help analyze collected data, identify trends, compare linear and nonlinear models, and estimate possible relationships. Reliable conclusions require sufficient real data and scientific validation.",
    answerAr:
      "الذكاء الاصطناعي ممكن يساعد بتحليل البيانات واكتشاف الأنماط ومقارنة العلاقات الخطية وغير الخطية. لكن الوصول لنتائج موثوقة بحتاج بيانات كافية وحقيقية والتحقق منها علميًا.",
  },
  {
    keywords: [
      "project",
      "our project",
      "immunewatch",
      "المشروع",
      "مشروعنا",
      "هدف التطبيق",
    ],
    answerEn:
      "Astronaut ImmuneWatch is a prototype designed to explore possible relationships between accumulated space radiation, astronaut health indicators, and latent virus test results over time.",
    answerAr:
      "Astronaut ImmuneWatch هو نموذج أولي بدرس العلاقة المحتملة بين الإشعاع الفضائي المتراكم والمؤشرات الصحية لرائد الفضاء ونتائج فحوص الفيروسات الكامنة مع مرور الوقت.",
  },
  {
    keywords: [
      "astronaut health",
      "monitor health",
      "space mission",
      "رائد الفضاء",
      "صحة رائد",
      "صحة رواد الفضاء",
      "رحلة الفضاء",
    ],
    answerEn:
      "Astronaut health monitoring can combine radiation measurements, vital signs, and laboratory test results over time. These data can help researchers investigate changes during a mission.",
    answerAr:
      "مراقبة صحة رائد الفضاء ممكن تجمع قياسات الإشعاع والمؤشرات الحيوية ونتائج الفحوص المخبرية مع الوقت، عشان تساعد الباحثين يدرسوا التغيرات خلال المهمة.",
  },
];

const suggestions = [
  {
    ar: "كيف يؤثر الإشعاع الفضائي؟",
    en: "How does space radiation affect astronauts?",
  },
  {
    ar: "ما هي الفيروسات الكامنة؟",
    en: "What are latent viruses?",
  },
  {
    ar: "كيف تتأثر المناعة في الفضاء؟",
    en: "How is immunity affected in space?",
  },
  {
    ar: "شو هدف مشروعنا؟",
    en: "What is the goal of our project?",
  },
];

function isArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

function getAnswer(question: string): string {
  const normalizedQuestion = question
    .toLowerCase()
    .replace(/[؟?!.,،]/g, " ")
    .trim();

  const match = knowledge.find((item) =>
    item.keywords.some((keyword) =>
      normalizedQuestion.includes(keyword.toLowerCase())
    )
  );

  if (match) {
    return isArabic(question) ? match.answerAr : match.answerEn;
  }

  return isArabic(question)
    ? "لسه ما عندي إجابة جاهزة عن هالسؤال بالنموذج التجريبي. جرّب تسألني عن الإشعاع الفضائي، المناعة، الفيروسات الكامنة، المؤشرات الحيوية، أو هدف المشروع."
    : "I don't have a prepared answer for this question in the current demo. Try asking about space radiation, immunity, latent viruses, vital signs, or our project goals.";
}

export default function SpaceAssistant() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "أهلًا! Welcome to Space AI Assistant. اسألني عن الفضاء وصحة رواد الفضاء، أو Ask me about space and astronaut health.",
    },
  ]);

  function sendMessage(value = input) {
    const question = value.trim();

    if (!question) return;

    const answer = getAnswer(question);

    setMessages((previous) => [
      ...previous,
      { role: "user", text: question },
      { role: "assistant", text: answer },
    ]);

    setInput("");
  }

  return (
    <section className="space-assistant" dir="auto">
      <header className="assistant-header">
        <div className="assistant-icon">✦</div>

        <div className="assistant-heading">
          <h2>Space AI Assistant</h2>
          <p>مساعد الفضاء وصحة رواد الفضاء</p>
        </div>

        <span className="assistant-status">DEMO</span>
      </header>

      <div className="assistant-disclaimer">
        Demo assistant with prepared answers | مساعد تجريبي بإجابات جاهزة
      </div>

      <div className="assistant-messages" aria-live="polite">
        {messages.map((message, index) => (
          <div
            key={index}
            dir="auto"
            className={`assistant-message ${message.role}`}
          >
            <span className="message-label">
              {message.role === "user" ? "You / أنت" : "Space AI"}
            </span>

            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <div className="suggested-questions">
        <p>Try asking / جرّب تسأل:</p>

        {suggestions.map((suggestion) => (
          <button
            type="button"
            key={suggestion.en}
            onClick={() =>
              sendMessage(isArabic(input) ? suggestion.ar : suggestion.en)
            }
          >
            {suggestion.ar}
            <span> / {suggestion.en}</span>
          </button>
        ))}
      </div>

      <form
        className="assistant-input"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about space / اسأل عن الفضاء..."
          aria-label="Ask a question / اكتب سؤالك"
          dir="auto"
        />

        <button type="submit" disabled={!input.trim()}>
          Send / إرسال ↑
        </button>
      </form>
    </section>
  );
}
