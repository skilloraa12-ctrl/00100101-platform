import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, ThumbsUp, ThumbsDown } from 'lucide-react'
import { answerFromLesson } from './mentorMatch.js'
import { loadFeedback, rate } from './mentorFeedback.js'
import { classifyIntent, isWordless, QUICK_REPLIES } from './mentorIntents.js'
import { buildIntentAnswer, unsureRecognitionAnswer, wordlessAnswer, fallbackAnswer } from './mentorTemplates.js'

let nextMsgId = 1

// Помічник за матеріалом уроку — пілот для HTML-курсу, портовано з
// DesignLab UA. Розпізнає ТИП питання (не зрозуміла завдання/дай
// підказку/що далі...), а не лише шукає збіг слів у тексті уроку. НЕ
// штучний інтелект і не жива розмова — жодного платного API, жодної
// мовної моделі. Голоси 👍/👎 зберігаються локально в цьому браузері
// (mentorFeedback.js), не спільно між учнями (на відміну від фінальної
// версії в DesignLab, яка використовує Supabase).
export default function LessonMentor({ lesson, prev, next, checkResult, onClose }) {
  const [messages, setMessages] = useState(() => [
    {
      id: nextMsgId++,
      role: 'bot',
      intro: `Привіт! Запитай мене про щось із уроку «${lesson.title}» своїми словами — можна з помилками, коротко, навіть без термінів.`,
      footer: 'Я не жива розмова й не штучний інтелект — розпізнаю тип питання (не зрозуміла урок/завдання, підказка, що далі...) і відповідаю матеріалом цього уроку. Оцінки 👍/👎 запам\'ятовуються в цьому браузері. Я не переглядаю зображення й скриншоти — якщо щось не виходить, просто опиши це словами.',
    },
  ])
  const [input, setInput] = useState('')
  const [myVotes, setMyVotes] = useState(() => loadFeedback(lesson.id).mine)
  const [lastIntentId, setLastIntentId] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  function send(overrideText) {
    const question = (overrideText ?? input).trim()
    if (!question) return

    let botMsg = { id: nextMsgId++, role: 'bot' }

    if (isWordless(question)) {
      botMsg = { ...botMsg, ...wordlessAnswer() }
      setLastIntentId(null)
    } else {
      const intent = classifyIntent(question, { lastIntentId })
      const { aggregate } = loadFeedback(lesson.id)

      if (intent) {
        botMsg = { ...botMsg, ...buildIntentAnswer(intent.intentId, { lesson, question, prev, next, feedback: aggregate, checkResult }) }
        setLastIntentId(intent.intentId)
      } else {
        const result = answerFromLesson(lesson, question, aggregate)
        if (!result.matched) {
          const wordCount = question.trim().split(/\s+/).length
          botMsg = { ...botMsg, ...(wordCount <= 2 ? fallbackAnswer() : unsureRecognitionAnswer()) }
        } else {
          botMsg.intro = '📘 За матеріалом уроку:'
          botMsg.passages = result.passages
        }
        setLastIntentId(null)
      }
    }

    setMessages((prev2) => [...prev2, { id: nextMsgId++, role: 'user', text: question }, botMsg])
    setInput('')
  }

  function handleRate(passageText, value) {
    const current = myVotes[passageText] || 0
    const saved = rate(lesson.id, passageText, value, current)
    setMyVotes((prev2) => ({ ...prev2, [passageText]: saved }))
  }

  return (
    <div className="border border-stone-700 rounded-lg bg-stone-900 p-4 mt-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-stone-500 flex items-center gap-1.5"><MessageCircle size={13} /> Помічник за матеріалом уроку</p>
        <button onClick={onClose} className="text-stone-500 hover:text-stone-300">
          <X size={16} />
        </button>
      </div>

      <div ref={scrollRef} className="max-h-80 overflow-y-auto flex flex-col gap-2.5 pr-1">
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'self-end max-w-[85%] bg-amber-900 bg-opacity-40 border border-amber-800 rounded-lg px-3 py-2 text-sm text-stone-100' : 'max-w-[90%] bg-stone-950 border border-stone-800 rounded-lg px-3 py-2.5 text-sm'}>
            {m.role === 'user' ? (
              <p>{m.text}</p>
            ) : (
              <>
                {m.intro && <p className="font-medium text-stone-100 mb-1">{m.intro}</p>}
                {m.passages && m.passages.length > 0 && (
                  <ul className="space-y-2 mb-1">
                    {m.passages.map((p, i) => {
                      const voted = myVotes[p.text] || 0
                      return (
                        <li key={i} className="border-l-2 border-amber-700 pl-2.5">
                          <span className="block text-[10px] uppercase tracking-wide text-amber-500 mb-0.5">{p.label}</span>
                          <span className="text-stone-300">{p.text}</span>
                          {!m.norate && (
                            <span className="inline-flex items-center gap-2 ml-2 align-middle">
                              <button onClick={() => handleRate(p.text, 1)} className={voted === 1 ? 'text-emerald-400' : 'text-stone-600 hover:text-stone-400'} aria-label="Корисно" title="Корисно">
                                <ThumbsUp size={13} />
                              </button>
                              <button onClick={() => handleRate(p.text, -1)} className={voted === -1 ? 'text-rose-400' : 'text-stone-600 hover:text-stone-400'} aria-label="Не допомогло" title="Не допомогло">
                                <ThumbsDown size={13} />
                              </button>
                            </span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
                {m.footer && <p className="text-xs text-stone-500 italic">{m.footer}</p>}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {QUICK_REPLIES.map((q) => (
          <button key={q.id} onClick={() => send(q.label)} className="text-xs px-2.5 py-1 border border-stone-700 rounded-full text-stone-400 hover:bg-stone-800 hover:text-stone-200">
            {q.emoji} {q.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          placeholder="Запитай про цей урок своїми словами…"
          className="flex-1 bg-stone-950 border border-stone-800 rounded-md px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-700"
        />
        <button onClick={() => send()} className="px-4 py-2 bg-amber-400 hover:opacity-90 text-stone-950 font-medium rounded-md text-sm">
          Надіслати
        </button>
      </div>
    </div>
  )
}
