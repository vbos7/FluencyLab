"use client";

import { useState, useRef } from "react";


// ─── DATA ────────────────────────────────────────────────────────────────
const PHRASES = [
    { id: 1, pt: "Eu gostaria de um café, por favor.", en: "I would like a coffee, please.", difficulty: "easy", category: "Cotidiano" },
    { id: 2, pt: "Onde fica a estação de trem mais próxima?", en: "Where is the nearest train station?", difficulty: "easy", category: "Viagem" },
    { id: 3, pt: "Ela não conseguiu terminar o trabalho a tempo.", en: "She couldn't finish the work on time.", difficulty: "medium", category: "Trabalho" },
    { id: 4, pt: "Se eu tivesse mais tempo, viajaria pelo mundo.", en: "If I had more time, I would travel the world.", difficulty: "medium", category: "Cotidiano" },
    { id: 5, pt: "A reunião foi adiada para a próxima semana.", en: "The meeting was postponed to next week.", difficulty: "medium", category: "Trabalho" },
    { id: 6, pt: "Você poderia me ajudar com essa mala?", en: "Could you help me with this suitcase?", difficulty: "easy", category: "Viagem" },
    { id: 7, pt: "Apesar da chuva, decidimos ir à praia.", en: "Despite the rain, we decided to go to the beach.", difficulty: "medium", category: "Cotidiano" },
    { id: 8, pt: "Ele tem estudado inglês há três anos.", en: "He has been studying English for three years.", difficulty: "hard", category: "Educação" },
    { id: 9, pt: "Eu me arrependo de não ter aceitado aquela oferta.", en: "I regret not having accepted that offer.", difficulty: "hard", category: "Trabalho" },
    { id: 10, pt: "Quanto mais eu pratico, melhor eu fico.", en: "The more I practice, the better I get.", difficulty: "medium", category: "Educação" },
    { id: 11, pt: "Nós deveríamos ter saído mais cedo.", en: "We should have left earlier.", difficulty: "hard", category: "Cotidiano" },
    { id: 12, pt: "A comida desse restaurante é a melhor da cidade.", en: "The food at this restaurant is the best in the city.", difficulty: "easy", category: "Cotidiano" },
    { id: 13, pt: "Eu estava dormindo quando o telefone tocou.", en: "I was sleeping when the phone rang.", difficulty: "medium", category: "Cotidiano" },
    { id: 14, pt: "Ela me pediu para não contar a ninguém.", en: "She asked me not to tell anyone.", difficulty: "medium", category: "Cotidiano" },
    { id: 15, pt: "Se eu fosse você, aceitaria o emprego.", en: "If I were you, I would accept the job.", difficulty: "hard", category: "Trabalho" },
    { id: 16, pt: "O voo foi cancelado por causa da tempestade.", en: "The flight was canceled because of the storm.", difficulty: "medium", category: "Viagem" },
    { id: 17, pt: "Você sabe me dizer que horas são?", en: "Can you tell me what time it is?", difficulty: "easy", category: "Cotidiano" },
    { id: 18, pt: "Eu nunca tinha visto nada tão bonito.", en: "I had never seen anything so beautiful.", difficulty: "hard", category: "Cotidiano" },
    { id: 19, pt: "Eles estão pensando em se mudar para outro país.", en: "They are thinking about moving to another country.", difficulty: "medium", category: "Viagem" },
    { id: 20, pt: "Mal posso esperar pelas férias.", en: "I can hardly wait for the vacation.", difficulty: "medium", category: "Cotidiano" },
];

const USERS_LEADERBOARD = [
    { id: 1, name: "Você", xp: 0, level: 1, avatar: "😎", isCurrentUser: true },
    { id: 2, name: "Lucas M.", xp: 4820, level: 12, avatar: "🧑‍💻" },
    { id: 3, name: "Ana Clara", xp: 4350, level: 11, avatar: "👩‍🎓" },
    { id: 4, name: "Pedro H.", xp: 3980, level: 10, avatar: "🎯" },
    { id: 5, name: "Mariana S.", xp: 3540, level: 9, avatar: "📚" },
    { id: 6, name: "Rafael O.", xp: 3100, level: 8, avatar: "🚀" },
    { id: 7, name: "Juliana F.", xp: 2670, level: 7, avatar: "✨" },
    { id: 8, name: "Gustavo L.", xp: 2200, level: 6, avatar: "🔥" },
    { id: 9, name: "Camila R.", xp: 1850, level: 5, avatar: "💪" },
    { id: 10, name: "Thiago B.", xp: 1400, level: 4, avatar: "🌟" },
];

const FAKE_HISTORY = [
    { date: "2026-03-01", correct: 8, total: 10 },
    { date: "2026-02-28", correct: 6, total: 8 },
    { date: "2026-02-27", correct: 9, total: 12 },
    { date: "2026-02-26", correct: 5, total: 7 },
    { date: "2026-02-25", correct: 7, total: 10 },
    { date: "2026-02-24", correct: 4, total: 6 },
    { date: "2026-02-22", correct: 10, total: 12 },
];

// Generate consistency calendar data
function generateCalendarData() {
    const data: Record<string, number> = {};
    const today = new Date(2026, 2, 2); // March 2, 2026
    for (let i = 0; i < 150; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split("T")[0];
        const rand = Math.random();
        if (rand > 0.25) {
            data[key] = rand > 0.7 ? 3 : rand > 0.45 ? 2 : 1;
        }
    }
    return data;
}

const CALENDAR_DATA = generateCalendarData();

// ─── HELPERS ─────────────────────────────────────────────────────────────
function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    return dp[m][n];
}

function scoreAnswer(userAns: string, correctAns: string): number {
    const u = userAns.toLowerCase().trim().replace(/[.,!?]/g, "");
    const c = correctAns.toLowerCase().trim().replace(/[.,!?]/g, "");
    if (u === c) return 100;
    const dist = levenshtein(u, c);
    const maxLen = Math.max(u.length, c.length);
    return Math.max(0, Math.round((1 - dist / maxLen) * 100));
}

type Feedback = {
    status: string;
    title: string;
    message: string;
    corrections: { wrong: string; correct: string; explanation: string }[];
    alternatives: string[];
    xp: number;
};

function generateFeedback(userAns: string, phrase: typeof PHRASES[number], score: number): Feedback {
    if (score >= 95) {
        return {
            status: "perfect",
            title: "Perfeito! 🎉",
            message: "Sua tradução está excelente!",
            corrections: [],
            alternatives: ["Great job! Your translation is spot on."],
            xp: 25,
        };
    }
    if (score >= 70) {
        return {
            status: "good",
            title: "Quase lá! 👏",
            message: "Sua tradução está boa, mas pode melhorar em alguns pontos.",
            corrections: [
                { wrong: userAns, correct: phrase.en, explanation: "A tradução esperada usa uma estrutura ligeiramente diferente." },
            ],
            alternatives: [phrase.en],
            xp: 15,
        };
    }
    if (score >= 40) {
        return {
            status: "partial",
            title: "Bom esforço! 💪",
            message: "Você captou a ideia principal, mas há diferenças significativas.",
            corrections: [
                { wrong: userAns, correct: phrase.en, explanation: "Revise a estrutura gramatical e o vocabulário utilizado." },
            ],
            alternatives: [phrase.en],
            xp: 8,
        };
    }
    return {
        status: "needs_work",
        title: "Continue praticando! 📖",
        message: "A tradução precisa de mais atenção. Veja a resposta correta abaixo.",
        corrections: [
            { wrong: userAns, correct: phrase.en, explanation: "Tente prestar atenção na estrutura da frase e nas palavras-chave." },
        ],
        alternatives: [phrase.en],
        xp: 3,
    };
}

function xpForLevel(lvl: number): number { return lvl * 150; }
function getLevel(xp: number) {
    let lvl = 1;
    while (xp >= xpForLevel(lvl)) { xp -= xpForLevel(lvl); lvl++; }
    return { level: lvl, currentXp: xp, needed: xpForLevel(lvl) };
}

// ─── ICONS (inline SVGs) ─────────────────────────────────────────────────
const Icons = {
    Home: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ),
    Calendar: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    ),
    Translate: () => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
    ),
    Chart: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    ),
    User: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
    Star: ({ filled }: { filled: boolean }) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#3B82F6" : "none"} stroke={filled ? "#3B82F6" : "#94A3B8"} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    ),
    Check: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    ),
    X: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    ),
    ArrowRight: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    ),
    Trophy: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
    ),
    Flame: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
    ),
    Sparkles: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
    ),
};

// ─── STYLES ──────────────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
 @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Space+Mono:wght@400;700&display=swap');

 :root {
   --blue-50: #EFF6FF;
   --blue-100: #DBEAFE;
   --blue-200: #BFDBFE;
   --blue-300: #93C5FD;
   --blue-400: #60A5FA;
   --blue-500: #3B82F6;
   --blue-600: #2563EB;
   --blue-700: #1D4ED8;
   --slate-50: #F8FAFC;
   --slate-100: #F1F5F9;
   --slate-200: #E2E8F0;
   --slate-300: #CBD5E1;
   --slate-400: #94A3B8;
   --slate-500: #64748B;
   --slate-600: #475569;
   --slate-700: #334155;
   --slate-800: #1E293B;
   --slate-900: #0F172A;
   --green-500: #22C55E;
   --green-100: #DCFCE7;
   --amber-500: #F59E0B;
   --amber-100: #FEF3C7;
   --red-500: #EF4444;
   --red-100: #FEE2E2;
 }

 * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

 body {
   font-family: 'DM Sans', sans-serif;
   background: var(--slate-50);
   color: var(--slate-800);
   overscroll-behavior: none;
 }

 .app-container {
   max-width: 430px;
   margin: 0 auto;
   min-height: 100dvh;
   position: relative;
   background: white;
   overflow-x: hidden;
 }

 .page-content {
   padding: 20px 20px 100px 20px;
   animation: fadeUp 0.3s ease;
 }

 @keyframes fadeUp {
   from { opacity: 0; transform: translateY(8px); }
   to { opacity: 1; transform: translateY(0); }
 }

 @keyframes scaleIn {
   from { opacity: 0; transform: scale(0.9); }
   to { opacity: 1; transform: scale(1); }
 }

 @keyframes slideUp {
   from { opacity: 0; transform: translateY(20px); }
   to { opacity: 1; transform: translateY(0); }
 }

 @keyframes pulse {
   0%, 100% { transform: scale(1); }
   50% { transform: scale(1.05); }
 }

 @keyframes shimmer {
   0% { background-position: -200% 0; }
   100% { background-position: 200% 0; }
 }

 @keyframes popIn {
   0% { transform: scale(0); opacity: 0; }
   70% { transform: scale(1.1); }
   100% { transform: scale(1); opacity: 1; }
 }

 .xp-toast {
   position: fixed;
   top: 20px;
   left: 50%;
   transform: translateX(-50%);
   z-index: 100;
   animation: slideDown 0.3s ease, slideUp 0.3s ease 1.5s forwards;
 }

 @keyframes slideDown {
   from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
   to { opacity: 1; transform: translateX(-50%) translateY(0); }
 }

 /* Bottom Nav */
 .bottom-nav {
   position: fixed;
   bottom: 0;
   left: 50%;
   transform: translateX(-50%);
   width: 100%;
   max-width: 430px;
   background: white;
   border-top: 1px solid var(--slate-100);
   display: flex;
   align-items: flex-end;
   justify-content: space-around;
   padding: 8px 12px;
   padding-bottom: max(8px, env(safe-area-inset-bottom));
   z-index: 50;
 }

 .nav-item {
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 2px;
   cursor: pointer;
   padding: 6px 12px;
   border-radius: 12px;
   transition: all 0.2s;
   color: var(--slate-400);
   border: none;
   background: none;
   font-family: 'DM Sans', sans-serif;
   font-size: 10px;
   font-weight: 500;
 }

 .nav-item.active { color: var(--blue-600); }
 .nav-item span { margin-top: 1px; }

 .nav-center-btn {
   display: flex;
   align-items: center;
   justify-content: center;
   width: 56px;
   height: 56px;
   border-radius: 18px;
   background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
   color: white;
   border: none;
   cursor: pointer;
   margin-top: -16px;
   box-shadow: 0 4px 20px rgba(37, 99, 235, 0.35);
   transition: all 0.2s;
 }
 .nav-center-btn:active { transform: scale(0.95); }
 .nav-center-btn.active {
   box-shadow: 0 4px 24px rgba(37, 99, 235, 0.5);
 }

 /* Cards */
 .stat-card {
   background: var(--slate-50);
   border-radius: 16px;
   padding: 20px;
   text-align: center;
   border: 1px solid var(--slate-100);
 }

 .stat-value {
   font-family: 'Space Mono', monospace;
   font-size: 28px;
   font-weight: 700;
   color: var(--slate-800);
 }

 .stat-label {
   font-size: 12px;
   color: var(--slate-500);
   margin-top: 2px;
   font-weight: 500;
 }

 /* Calendar */
 .cal-grid {
   display: grid;
   grid-template-columns: repeat(7, 1fr);
   gap: 3px;
 }

 .cal-cell {
   aspect-ratio: 1;
   border-radius: 5px;
   transition: all 0.15s;
 }

 .cal-0 { background: var(--slate-100); }
 .cal-1 { background: var(--blue-200); }
 .cal-2 { background: var(--blue-400); }
 .cal-3 { background: var(--blue-600); }
 .cal-empty { background: transparent; }

 /* Practice */
 .phrase-card {
   background: linear-gradient(135deg, var(--blue-50), white);
   border: 1px solid var(--blue-100);
   border-radius: 20px;
   padding: 28px 24px;
   position: relative;
 }

 .phrase-text {
   font-size: 20px;
   font-weight: 600;
   color: var(--slate-800);
   line-height: 1.5;
   letter-spacing: -0.01em;
 }

 .answer-input {
   width: 100%;
   border: 2px solid var(--slate-200);
   border-radius: 16px;
   padding: 16px 20px;
   font-size: 16px;
   font-family: 'DM Sans', sans-serif;
   color: var(--slate-800);
   background: white;
   outline: none;
   transition: border-color 0.2s;
   resize: none;
   min-height: 80px;
 }
 .answer-input:focus { border-color: var(--blue-500); }
 .answer-input::placeholder { color: var(--slate-400); }

 .verify-btn {
   width: 100%;
   padding: 16px;
   border-radius: 16px;
   background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
   color: white;
   font-size: 16px;
   font-weight: 600;
   font-family: 'DM Sans', sans-serif;
   border: none;
   cursor: pointer;
   transition: all 0.2s;
   box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
 }
 .verify-btn:active { transform: scale(0.98); }
 .verify-btn:disabled {
   background: var(--slate-200);
   color: var(--slate-400);
   box-shadow: none;
   cursor: default;
 }

 .skip-btn {
   width: 100%;
   padding: 14px;
   border-radius: 16px;
   background: transparent;
   color: var(--slate-500);
   font-size: 14px;
   font-weight: 500;
   font-family: 'DM Sans', sans-serif;
   border: 1.5px solid var(--slate-200);
   cursor: pointer;
   transition: all 0.2s;
 }

 /* Feedback */
 .feedback-card {
   border-radius: 20px;
   padding: 24px;
   animation: scaleIn 0.3s ease;
 }
 .feedback-perfect { background: var(--green-100); border: 1px solid #86EFAC; }
 .feedback-good { background: var(--blue-100); border: 1px solid var(--blue-200); }
 .feedback-partial { background: var(--amber-100); border: 1px solid #FCD34D; }
 .feedback-needs_work { background: var(--red-100); border: 1px solid #FCA5A5; }

 /* Leaderboard */
 .lb-row {
   display: flex;
   align-items: center;
   gap: 14px;
   padding: 14px 16px;
   border-radius: 14px;
   transition: all 0.15s;
   border: 1px solid transparent;
 }
 .lb-row.current-user {
   background: var(--blue-50);
   border-color: var(--blue-200);
 }
 .lb-rank {
   font-family: 'Space Mono', monospace;
   font-weight: 700;
   font-size: 14px;
   color: var(--slate-400);
   width: 24px;
   text-align: center;
 }
 .lb-rank.top-3 { color: var(--blue-600); }
 .lb-avatar {
   width: 40px;
   height: 40px;
   border-radius: 12px;
   background: var(--slate-100);
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 20px;
 }

 /* Favorites */
 .fav-card {
   border: 1px solid var(--slate-200);
   border-radius: 16px;
   padding: 16px;
   position: relative;
 }

 /* Section titles */
 .section-title {
   font-size: 22px;
   font-weight: 700;
   color: var(--slate-900);
   letter-spacing: -0.02em;
 }

 .section-sub {
   font-size: 13px;
   color: var(--slate-500);
   font-weight: 400;
 }

 /* Profile */
 .profile-header {
   text-align: center;
   padding: 24px 0;
 }
 .profile-avatar {
   width: 80px;
   height: 80px;
   border-radius: 24px;
   background: linear-gradient(135deg, var(--blue-100), var(--blue-200));
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 40px;
   margin: 0 auto 12px;
 }
 .profile-name {
   font-size: 22px;
   font-weight: 700;
   color: var(--slate-900);
 }

 .level-badge {
   display: inline-flex;
   align-items: center;
   gap: 4px;
   padding: 4px 10px;
   border-radius: 20px;
   background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
   color: white;
   font-size: 12px;
   font-weight: 600;
 }

 .difficulty-badge {
   display: inline-block;
   padding: 3px 10px;
   border-radius: 20px;
   font-size: 11px;
   font-weight: 600;
   text-transform: uppercase;
   letter-spacing: 0.05em;
 }
 .diff-easy { background: var(--green-100); color: #16A34A; }
 .diff-medium { background: var(--amber-100); color: #D97706; }
 .diff-hard { background: var(--red-100); color: #DC2626; }

 .progress-bar-bg {
   height: 6px;
   background: var(--slate-200);
   border-radius: 3px;
   overflow: hidden;
 }
 .progress-bar-fill {
   height: 100%;
   border-radius: 3px;
   background: linear-gradient(90deg, var(--blue-500), var(--blue-600));
   transition: width 0.5s ease;
 }

 .streak-badge {
   display: inline-flex;
   align-items: center;
   gap: 6px;
   padding: 6px 14px;
   border-radius: 20px;
   background: #FFF7ED;
   border: 1px solid #FED7AA;
   font-size: 13px;
   font-weight: 600;
   color: #EA580C;
 }

 .month-label {
   font-size: 11px;
   color: var(--slate-400);
   font-weight: 500;
 }

 /* ─── TOP NAV (desktop only) ─────────────────────────── */
 .top-nav { display: none; }

 /* ─── RESPONSIVE ─────────────────────────────────────── */
 @media (min-width: 768px) {
   body { background: var(--slate-100); }

   .app-container {
     max-width: 100%;
     background: transparent;
     overflow-x: unset;
   }

   .page-content {
     padding: 36px 40px 48px;
     max-width: 900px;
     margin: 0 auto;
   }

   .bottom-nav { display: none; }

   .top-nav {
     display: flex;
     align-items: center;
     position: sticky;
     top: 0;
     z-index: 50;
     width: 100%;
     background: white;
     border-bottom: 1px solid var(--slate-100);
     padding: 0 32px;
     height: 64px;
     gap: 4px;
     box-shadow: 0 1px 4px rgba(0,0,0,0.04);
   }

   .top-nav-logo {
     display: flex;
     align-items: center;
     gap: 8px;
     font-size: 17px;
     font-weight: 700;
     color: var(--slate-900);
     letter-spacing: -0.02em;
     margin-right: auto;
   }

   .top-nav-logo svg { color: var(--blue-600); }

   .top-nav-item {
     display: flex;
     align-items: center;
     gap: 6px;
     padding: 8px 14px;
     border-radius: 10px;
     font-size: 14px;
     font-weight: 500;
     color: var(--slate-500);
     border: none;
     background: none;
     cursor: pointer;
     transition: all 0.2s;
     font-family: 'DM Sans', sans-serif;
   }
   .top-nav-item:hover { background: var(--slate-50); color: var(--slate-700); }
   .top-nav-item.active { color: var(--blue-600); background: var(--blue-50); }

   .top-nav-cta {
     display: flex;
     align-items: center;
     gap: 6px;
     padding: 8px 18px;
     border-radius: 10px;
     font-size: 14px;
     font-weight: 600;
     color: white;
     background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
     border: none;
     cursor: pointer;
     transition: all 0.2s;
     font-family: 'DM Sans', sans-serif;
     box-shadow: 0 2px 10px rgba(37,99,235,0.3);
     margin-left: 8px;
   }
   .top-nav-cta:hover { box-shadow: 0 4px 16px rgba(37,99,235,0.4); }
   .top-nav-cta.active { box-shadow: 0 4px 20px rgba(37,99,235,0.5); }

   .xp-toast { top: 80px; }
   .phrase-card { padding: 36px 32px; }
 }
`;
document.head.appendChild(style);

// ─── COMPONENTS ──────────────────────────────────────────────────────────

function BottomNav({ page, setPage }: { page: string; setPage: (p: string) => void }) {
    const items = [
        { id: "home", icon: Icons.Home, label: "Início" },
        { id: "consistency", icon: Icons.Calendar, label: "Progresso" },
        { id: "practice", icon: Icons.Translate, label: "Praticar", center: true },
        { id: "ranking", icon: Icons.Chart, label: "Ranking" },
        { id: "profile", icon: Icons.User, label: "Perfil" },
    ];

    return (
        <nav className="bottom-nav">
            {items.map((item) =>
                item.center ? (
                    <button
                        key={item.id}
                        className={`nav-center-btn ${page === item.id ? "active" : ""}`}
                        onClick={() => setPage(item.id)}
                        aria-label={item.label}
                    >
                        <item.icon />
                    </button>
                ) : (
                    <button
                        key={item.id}
                        className={`nav-item ${page === item.id ? "active" : ""}`}
                        onClick={() => setPage(item.id)}
                    >
                        <item.icon />
                        <span>{item.label}</span>
                    </button>
                )
            )}
        </nav>
    );
}

// ── Top Nav (desktop) ────────────────────────────────────────────────────
function TopNav({ page, setPage }: { page: string; setPage: (p: string) => void }) {
    const items = [
        { id: "home", icon: Icons.Home, label: "Início" },
        { id: "consistency", icon: Icons.Calendar, label: "Progresso" },
        { id: "ranking", icon: Icons.Chart, label: "Ranking" },
        { id: "profile", icon: Icons.User, label: "Perfil" },
    ];

    return (
        <nav className="top-nav">
            <div className="top-nav-logo">
                <Icons.Translate />
                LinguaFlow
            </div>
            {items.map((item) => (
                <button
                    key={item.id}
                    className={`top-nav-item ${page === item.id ? "active" : ""}`}
                    onClick={() => setPage(item.id)}
                >
                    <item.icon />
                    {item.label}
                </button>
            ))}
            <button
                className={`top-nav-cta ${page === "practice" ? "active" : ""}`}
                onClick={() => setPage("practice")}
            >
                <Icons.Translate />
                Praticar
            </button>
        </nav>
    );
}

// ── Home Page ────────────────────────────────────────────────────────────
function HomePage({ userXp, streak, setPage, totalPracticed, totalCorrect }: { userXp: number; streak: number; setPage: (p: string) => void; totalPracticed: number; totalCorrect: number }) {
    const { level, currentXp, needed } = getLevel(userXp);

    return (
        <div className="page-content">
            <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 14, color: "var(--slate-500)", fontWeight: 500 }}>Olá 👋</p>
                <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--slate-900)", letterSpacing: "-0.02em", marginTop: 4 }}>
                    Bom dia!
                </h1>
            </div>

            {/* Level Card */}
            <div style={{
                background: "linear-gradient(135deg, var(--blue-600), var(--blue-700))",
                borderRadius: 20,
                padding: "24px",
                color: "white",
                marginBottom: 20,
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute", top: -30, right: -30,
                    width: 100, height: 100, borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)"
                }} />
                <div style={{
                    position: "absolute", bottom: -20, left: -20,
                    width: 80, height: 80, borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)"
                }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                        <p style={{ fontSize: 13, opacity: 0.8, fontWeight: 500 }}>Nível atual</p>
                        <p style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>
                            {level}
                        </p>
                    </div>
                    <div className="streak-badge" style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white" }}>
                        <Icons.Flame />
                        {streak} dias
                    </div>
                </div>
                <div style={{ marginBottom: 6, display: "flex", justifyContent: "space-between", fontSize: 12, opacity: 0.8 }}>
                    <span>{currentXp} XP</span>
                    <span>{needed} XP</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                        height: "100%", borderRadius: 3,
                        background: "rgba(255,255,255,0.9)",
                        width: `${(currentXp / needed) * 100}%`,
                        transition: "width 0.5s ease"
                    }} />
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                <div className="stat-card">
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--blue-100)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", color: "var(--blue-600)" }}>
                        <Icons.Check />
                    </div>
                    <div className="stat-value">{totalPracticed}</div>
                    <div className="stat-label">Traduções</div>
                </div>
                <div className="stat-card">
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--green-100)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", color: "var(--green-500)" }}>
                        <Icons.Sparkles />
                    </div>
                    <div className="stat-value">{totalPracticed > 0 ? Math.round((totalCorrect / totalPracticed) * 100) : 0}%</div>
                    <div className="stat-label">Precisão</div>
                </div>
            </div>

            {/* Quick Start */}
            <button
                className="verify-btn"
                onClick={() => setPage("practice")}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
            >
                <Icons.Translate />
                Praticar Agora
            </button>

            {/* Recent Activity */}
            <div style={{ marginTop: 28 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--slate-700)", marginBottom: 14 }}>Atividade recente</h3>
                {FAKE_HISTORY.slice(0, 4).map((h, i) => (
                    <div key={i} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "12px 0",
                        borderBottom: i < 3 ? "1px solid var(--slate-100)" : "none"
                    }}>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--slate-700)" }}>
                                {new Date(h.date).toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}
                            </p>
                            <p style={{ fontSize: 12, color: "var(--slate-400)" }}>{h.total} traduções</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
             <span style={{
                 fontFamily: "'Space Mono', monospace",
                 fontWeight: 700,
                 fontSize: 14,
                 color: h.correct / h.total >= 0.7 ? "var(--green-500)" : "var(--amber-500)"
             }}>
               {Math.round((h.correct / h.total) * 100)}%
             </span>
                            <p style={{ fontSize: 12, color: "var(--slate-400)" }}>{h.correct}/{h.total} corretas</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Consistency Page ─────────────────────────────────────────────────────
function ConsistencyPage({ totalPracticed, totalCorrect, userXp }: { totalPracticed: number; totalCorrect: number; userXp: number }) {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai"];
    const today = new Date(2026, 2, 2);

    // Generate last 5 months of weeks
    const weeks: { date: string; level: number }[][] = [];
    const startDate = new Date(2026, 0, 1); // Jan 1
    let current = new Date(startDate);
    // Align to Monday
    while (current.getDay() !== 1) current.setDate(current.getDate() - 1);

    while (current <= today) {
        const week = [];
        for (let d = 0; d < 7; d++) {
            const date = new Date(current);
            date.setDate(date.getDate() + d);
            const key = date.toISOString().split("T")[0];
            if (date < startDate || date > today) {
                week.push({ date: key, level: -1 });
            } else {
                week.push({ date: key, level: CALENDAR_DATA[key] || 0 });
            }
        }
        weeks.push(week);
        current.setDate(current.getDate() + 7);
    }

    const totalTime = Math.round((totalPracticed * 3.2 + 45) * 10) / 10;

    return (
        <div className="page-content">
            <h1 className="section-title" style={{ marginBottom: 24 }}>Consistência</h1>

            {/* Calendar Heatmap */}
            <div style={{
                background: "var(--slate-50)",
                borderRadius: 20,
                padding: "20px 16px",
                border: "1px solid var(--slate-100)",
                marginBottom: 20,
                overflowX: "auto"
            }}>
                {/* Month labels */}
                <div style={{ display: "flex", gap: 0, marginBottom: 8, paddingLeft: 0 }}>
                    {months.map((m, i) => (
                        <span key={i} className="month-label" style={{ flex: 1, textAlign: "left" }}>{m}</span>
                    ))}
                </div>

                {/* Grid */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => (
                        <div key={dayOfWeek} style={{ display: "flex", gap: 3 }}>
                            {weeks.map((week, wi) => {
                                const cell = week[dayOfWeek];
                                return (
                                    <div
                                        key={wi}
                                        className={cell.level === -1 ? "cal-cell cal-empty" : `cal-cell cal-${cell.level}`}
                                        style={{ width: 14, height: 14 }}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div className="stat-card">
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--blue-100)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", color: "var(--blue-600)" }}>
                        <Icons.Check />
                    </div>
                    <div className="stat-value">{totalPracticed + 135}</div>
                    <div className="stat-label">Treinos Feitos</div>
                </div>
                <div className="stat-card">
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--blue-100)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", color: "var(--blue-600)" }}>
                        <Icons.Sparkles />
                    </div>
                    <div className="stat-value">{totalPracticed > 0 ? Math.round(((totalCorrect + 86) / (totalPracticed + 135)) * 100) : 64}%</div>
                    <div className="stat-label">Taxa de conclusão</div>
                </div>
            </div>

            <div className="stat-card" style={{ marginBottom: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--blue-100)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", color: "var(--blue-600)" }}>
                    ⏱
                </div>
                <div className="stat-value">{Math.floor(totalTime)}h{Math.round((totalTime % 1) * 60)}m</div>
                <div className="stat-label">Tempo Total</div>
            </div>
        </div>
    );
}

// ── Practice Page ────────────────────────────────────────────────────────
function PracticePage({ onComplete, favorites, toggleFavorite }: { onComplete: (xp: number, isCorrect: boolean) => void; favorites: number[]; toggleFavorite: (id: number) => void }) {
    const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * PHRASES.length));
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [showXpToast, setShowXpToast] = useState(false);
    const [earnedXp, setEarnedXp] = useState(0);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const phrase = PHRASES[currentIndex];
    const isFav = favorites.includes(phrase.id);

    const handleVerify = () => {
        if (!answer.trim()) return;
        const score = scoreAnswer(answer, phrase.en);
        const fb = generateFeedback(answer, phrase, score);
        setFeedback(fb);
        setEarnedXp(fb.xp);
        setShowXpToast(true);
        onComplete(fb.xp, score >= 70);
        setTimeout(() => setShowXpToast(false), 2000);
    };

    const handleNext = () => {
        let next;
        do { next = Math.floor(Math.random() * PHRASES.length); } while (next === currentIndex);
        setCurrentIndex(next);
        setAnswer("");
        setFeedback(null);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleSkip = () => {
        handleNext();
    };

    return (
        <div className="page-content">
            {/* XP Toast */}
            {showXpToast && (
                <div className="xp-toast">
                    <div style={{
                        background: "linear-gradient(135deg, var(--blue-600), var(--blue-700))",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: 14,
                        fontWeight: 600,
                        fontSize: 14,
                        boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
                        display: "flex",
                        alignItems: "center",
                        gap: 6
                    }}>
                        <Icons.Sparkles /> +{earnedXp} XP
                    </div>
                </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h1 className="section-title">Traduzir</h1>
                <button
                    onClick={() => toggleFavorite(phrase.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                >
                    <Icons.Star filled={isFav} />
                </button>
            </div>

            {/* Phrase Card */}
            <div className="phrase-card" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
         <span className={`difficulty-badge diff-${phrase.difficulty}`}>
           {phrase.difficulty === "easy" ? "Fácil" : phrase.difficulty === "medium" ? "Médio" : "Difícil"}
         </span>
                    <span style={{ fontSize: 12, color: "var(--slate-400)", fontWeight: 500 }}>{phrase.category}</span>
                </div>
                <p className="phrase-text">{phrase.pt}</p>
            </div>

            {/* Answer Input */}
            {!feedback && (
                <div style={{ animation: "fadeUp 0.3s ease" }}>
         <textarea
             ref={inputRef}
             className="answer-input"
             placeholder="Digite a tradução em inglês..."
             value={answer}
             onChange={(e) => setAnswer(e.target.value)}
             onKeyDown={(e) => {
                 if (e.key === "Enter" && !e.shiftKey) {
                     e.preventDefault();
                     handleVerify();
                 }
             }}
         />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                        <button className="verify-btn" onClick={handleVerify} disabled={!answer.trim()}>
                            Verificar Tradução
                        </button>
                        <button className="skip-btn" onClick={handleSkip}>
                            Pular frase
                        </button>
                    </div>
                </div>
            )}

            {/* Feedback */}
            {feedback && (
                <div style={{ animation: "slideUp 0.3s ease" }}>
                    <div className={`feedback-card feedback-${feedback.status}`} style={{ marginBottom: 16 }}>
                        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{feedback.title}</h3>
                        <p style={{ fontSize: 14, color: "var(--slate-600)", marginBottom: 16 }}>{feedback.message}</p>

                        {/* User's answer */}
                        <div style={{
                            background: "rgba(255,255,255,0.6)",
                            borderRadius: 12,
                            padding: 14,
                            marginBottom: 12
                        }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--slate-500)", marginBottom: 4 }}>Sua resposta:</p>
                            <p style={{ fontSize: 15, color: "var(--slate-700)" }}>{answer}</p>
                        </div>

                        {/* Corrections */}
                        {feedback.corrections.length > 0 && feedback.corrections.map((c, i) => (
                            <div key={i} style={{
                                background: "rgba(255,255,255,0.6)",
                                borderRadius: 12,
                                padding: 14,
                                marginBottom: 12
                            }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--slate-500)", marginBottom: 4 }}>Tradução esperada:</p>
                                <p style={{ fontSize: 15, color: "var(--green-500)", fontWeight: 600 }}>{c.correct}</p>
                                <p style={{ fontSize: 13, color: "var(--slate-500)", marginTop: 8 }}>{c.explanation}</p>
                            </div>
                        ))}

                        {/* Alternatives */}
                        {feedback.status === "perfect" && (
                            <div style={{
                                background: "rgba(255,255,255,0.6)",
                                borderRadius: 12,
                                padding: 14
                            }}>
                                <p style={{ fontSize: 13, color: "var(--slate-600)" }}>
                                    ✨ Sua tradução foi natural e precisa. Continue assim!
                                </p>
                            </div>
                        )}
                    </div>

                    <button className="verify-btn" onClick={handleNext} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        Próxima Frase <Icons.ArrowRight />
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Ranking Page ─────────────────────────────────────────────────────────
function RankingPage({ userXp }: { userXp: number }) {
    const leaderboard = USERS_LEADERBOARD.map(u =>
        u.isCurrentUser ? { ...u, xp: userXp, level: getLevel(userXp).level } : u
    ).sort((a, b) => b.xp - a.xp);

    return (
        <div className="page-content">
            <h1 className="section-title" style={{ marginBottom: 4 }}>Ranking</h1>
            <p className="section-sub" style={{ marginBottom: 24 }}>Veja como você se compara com outros</p>

            {/* Top 3 Podium */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: 12,
                marginBottom: 28,
                paddingTop: 8
            }}>
                {[1, 0, 2].map((idx) => {
                    const user = leaderboard[idx];
                    if (!user) return null;
                    const isFirst = idx === 0;
                    return (
                        <div key={user.id} style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            flex: 1,
                            animation: `popIn 0.4s ease ${idx * 0.1}s both`
                        }}>
                            <div style={{
                                width: isFirst ? 64 : 52,
                                height: isFirst ? 64 : 52,
                                borderRadius: isFirst ? 20 : 16,
                                background: isFirst
                                    ? "linear-gradient(135deg, var(--blue-500), var(--blue-700))"
                                    : "var(--slate-100)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: isFirst ? 28 : 22,
                                marginBottom: 8,
                                border: isFirst ? "3px solid var(--blue-300)" : "2px solid var(--slate-200)"
                            }}>
                                {user.avatar}
                            </div>
                            <p style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: user.isCurrentUser ? "var(--blue-600)" : "var(--slate-700)",
                                marginBottom: 2,
                                textAlign: "center"
                            }}>
                                {user.name}
                            </p>
                            <p style={{
                                fontFamily: "'Space Mono', monospace",
                                fontSize: 12,
                                fontWeight: 700,
                                color: "var(--slate-400)"
                            }}>
                                {user.xp.toLocaleString()} XP
                            </p>
                            <div style={{
                                width: "100%",
                                height: isFirst ? 80 : idx === 1 ? 56 : 40,
                                background: isFirst
                                    ? "linear-gradient(180deg, var(--blue-100), var(--blue-50))"
                                    : "var(--slate-50)",
                                borderRadius: "12px 12px 0 0",
                                marginTop: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "'Space Mono', monospace",
                                fontWeight: 700,
                                fontSize: isFirst ? 20 : 16,
                                color: isFirst ? "var(--blue-600)" : "var(--slate-400)",
                                border: `1px solid ${isFirst ? "var(--blue-200)" : "var(--slate-200)"}`,
                                borderBottom: "none"
                            }}>
                                {idx + 1}º
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Rest of leaderboard */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {leaderboard.slice(3).map((user, i) => (
                    <div key={user.id} className={`lb-row ${user.isCurrentUser ? "current-user" : ""}`}>
                        <span className="lb-rank">{i + 4}</span>
                        <div className="lb-avatar">{user.avatar}</div>
                        <div style={{ flex: 1 }}>
                            <p style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: user.isCurrentUser ? "var(--blue-600)" : "var(--slate-700)"
                            }}>
                                {user.name}
                            </p>
                            <p style={{ fontSize: 12, color: "var(--slate-400)" }}>Nível {user.level}</p>
                        </div>
                        <span style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--slate-500)"
                        }}>
             {user.xp.toLocaleString()}
           </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Profile Page ─────────────────────────────────────────────────────────
function ProfilePage({ userXp, favorites, toggleFavorite, streak, totalPracticed, totalCorrect }: { userXp: number; favorites: number[]; toggleFavorite: (id: number) => void; streak: number; totalPracticed: number; totalCorrect: number }) {
    const { level, currentXp, needed } = getLevel(userXp);
    const [showFavorites, setShowFavorites] = useState(false);

    const favPhrases = PHRASES.filter(p => favorites.includes(p.id));

    return (
        <div className="page-content">
            <div className="profile-header">
                <div className="profile-avatar">😎</div>
                <h2 className="profile-name">Meu Perfil</h2>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 10 }}>
         <span className="level-badge">
           <Icons.Sparkles /> Nível {level}
         </span>
                    <span className="streak-badge">
           <Icons.Flame /> {streak} dias
         </span>
                </div>
            </div>

            {/* XP Progress */}
            <div style={{
                background: "var(--slate-50)",
                borderRadius: 16,
                padding: 20,
                border: "1px solid var(--slate-100)",
                marginBottom: 20
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--slate-600)" }}>Experiência</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--blue-600)", fontFamily: "'Space Mono', monospace" }}>
           {userXp} XP
         </span>
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${(currentXp / needed) * 100}%` }} />
                </div>
                <p style={{ fontSize: 12, color: "var(--slate-400)", marginTop: 6 }}>
                    {needed - currentXp} XP para o nível {level + 1}
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
                <div className="stat-card" style={{ padding: 16 }}>
                    <div className="stat-value" style={{ fontSize: 22 }}>{totalPracticed}</div>
                    <div className="stat-label">Traduções</div>
                </div>
                <div className="stat-card" style={{ padding: 16 }}>
                    <div className="stat-value" style={{ fontSize: 22 }}>{totalCorrect}</div>
                    <div className="stat-label">Corretas</div>
                </div>
                <div className="stat-card" style={{ padding: 16 }}>
                    <div className="stat-value" style={{ fontSize: 22 }}>
                        {totalPracticed > 0 ? Math.round((totalCorrect / totalPracticed) * 100) : 0}%
                    </div>
                    <div className="stat-label">Precisão</div>
                </div>
            </div>

            {/* Favorites */}
            <div>
                <button
                    onClick={() => setShowFavorites(!showFavorites)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "12px 0",
                        fontFamily: "'DM Sans', sans-serif"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Icons.Star filled={true} />
                        <span style={{ fontSize: 16, fontWeight: 600, color: "var(--slate-700)" }}>
             Frases Favoritas
           </span>
                        <span style={{
                            background: "var(--blue-100)",
                            color: "var(--blue-600)",
                            padding: "2px 8px",
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 600
                        }}>
             {favPhrases.length}
           </span>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--slate-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         style={{ transform: showFavorites ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    >
                        <polyline points="6 9 12 15 18 9"/>
                    </svg>
                </button>

                {showFavorites && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "fadeUp 0.2s ease" }}>
                        {favPhrases.length === 0 ? (
                            <p style={{ fontSize: 14, color: "var(--slate-400)", textAlign: "center", padding: 20 }}>
                                Nenhuma frase favoritada ainda. Toque na ⭐ durante a prática!
                            </p>
                        ) : (
                            favPhrases.map((p) => (
                                <div key={p.id} className="fav-card">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                        <div style={{ flex: 1, marginRight: 8 }}>
                                            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--slate-700)", marginBottom: 4 }}>{p.pt}</p>
                                            <p style={{ fontSize: 13, color: "var(--blue-600)" }}>{p.en}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleFavorite(p.id)}
                                            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}
                                        >
                                            <Icons.Star filled={true} />
                                        </button>
                                    </div>
                                    <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                   <span className={`difficulty-badge diff-${p.difficulty}`}>
                     {p.difficulty === "easy" ? "Fácil" : p.difficulty === "medium" ? "Médio" : "Difícil"}
                   </span>
                                        <span style={{ fontSize: 11, color: "var(--slate-400)", padding: "3px 0" }}>{p.category}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────
export default function App() {
    const [page, setPage] = useState("home");
    const [userXp, setUserXp] = useState(320);
    const [favorites, setFavorites] = useState([3, 8, 15]);
    const [streak, setStreak] = useState(7);
    const [totalPracticed, setTotalPracticed] = useState(12);
    const [totalCorrect, setTotalCorrect] = useState(8);

    const toggleFavorite = (id: number) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const onPracticeComplete = (xp: number, isCorrect: boolean) => {
        setUserXp(prev => prev + xp);
        setTotalPracticed(prev => prev + 1);
        if (isCorrect) setTotalCorrect(prev => prev + 1);
    };

    return (
        <div className="app-container">
            <TopNav page={page} setPage={setPage} />
            {page === "home" && (
                <HomePage
                    userXp={userXp}
                    streak={streak}
                    setPage={setPage}
                    totalPracticed={totalPracticed}
                    totalCorrect={totalCorrect}
                />
            )}
            {page === "consistency" && (
                <ConsistencyPage
                    totalPracticed={totalPracticed}
                    totalCorrect={totalCorrect}
                    userXp={userXp}
                />
            )}
            {page === "practice" && (
                <PracticePage
                    onComplete={onPracticeComplete}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                />
            )}
            {page === "ranking" && (
                <RankingPage userXp={userXp} />
            )}
            {page === "profile" && (
                <ProfilePage
                    userXp={userXp}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    streak={streak}
                    totalPracticed={totalPracticed}
                    totalCorrect={totalCorrect}
                />
            )}
            <BottomNav page={page} setPage={setPage} />
        </div>
    );
}