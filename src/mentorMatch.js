// Пошук відповіді по матеріалу конкретного уроку за ключовими словами —
// адаптовано з DesignLab UA під схему уроків цього курсу (theory/
// presentation/examples/task, без keyPoints/mistakes). Це НЕ штучний
// інтелект — зіставлення слів питання з уже написаним текстом уроку.

const STOPWORDS = new Set([
  'і', 'й', 'та', 'а', 'але', 'чи', 'або', 'це', 'цей', 'ця', 'ці', 'той', 'та',
  'як', 'що', 'щоб', 'для', 'в', 'у', 'на', 'з', 'із', 'зі', 'до', 'від', 'по',
  'при', 'про', 'є', 'був', 'була', 'було', 'були', 'не', 'ні', 'так', 'же',
  'ж', 'би', 'б', 'тільки', 'лише', 'вже', 'ще', 'теж', 'також', 'коли', 'де',
  'хто', 'ти', 'ви', 'я', 'ми', 'він', 'вона', 'воно', 'вони', 'мій', 'твій',
  'свій', 'його', 'її', 'їх', 'мене', 'тебе', 'нас', 'вас', 'чому', 'навіщо',
  'можна', 'можеш', 'можу', 'треба', 'потрібно', 'будь', 'ласка', 'запитання',
  'питання', 'скажи', 'поясни', 'розкажи', 'what', 'is', 'the', 'a', 'an',
])

function tokenize(text) {
  return (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [])
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
}

function overlapScore(queryTokens, text) {
  const tokens = tokenize(text)
  if (tokens.length === 0 || queryTokens.length === 0) return 0
  const tokenSet = new Set(tokens)
  let hits = 0
  for (const qt of queryTokens) if (tokenSet.has(qt)) hits++
  return hits
}

function splitSentences(text) {
  return (text || '').split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 15)
}

function buildCorpus(lesson) {
  const corpus = []
  for (const sentence of splitSentences(lesson.theory)) {
    corpus.push({ source: 'theory', label: 'Теорія', text: sentence })
  }
  for (const slide of lesson.presentation || []) {
    for (const p of slide.points || []) {
      corpus.push({ source: 'point', label: slide.title || 'Ключовий момент', text: p })
    }
  }
  for (const ex of lesson.examples || []) {
    if (ex.explain) corpus.push({ source: 'example', label: `Приклад: ${ex.title || ''}`.trim(), text: ex.explain })
  }
  if (lesson.task) corpus.push({ source: 'task', label: 'Завдання', text: lesson.task })
  return corpus
}

// feedback — мапа { [текст фрагмента]: сумарний бал 👍/👎 }, той самий
// механізм "навчання з часом", що й у DesignLab (localStorage тут,
// не спільний Supabase — цей бот поки пілотний лише на HTML-курсі).
// Повертає { matched: bool, passages: [{source,label,text,score}] }
export function answerFromLesson(lesson, question, feedback = {}) {
  const queryTokens = tokenize(question)
  if (queryTokens.length === 0) {
    return { matched: false, passages: [] }
  }

  const corpus = buildCorpus(lesson)
  const scored = corpus
    .map((entry) => ({ ...entry, score: overlapScore(queryTokens, entry.text) }))
    .filter((entry) => entry.score > 0)
    .map((entry) => ({ ...entry, score: entry.score + (feedback[entry.text] || 0) * 0.5 }))
    .sort((a, b) => b.score - a.score)

  if (scored.length === 0) {
    return { matched: false, passages: [] }
  }

  const topScore = scored[0].score
  const minScore = queryTokens.length <= 3 ? 1 : 2
  if (topScore < minScore) {
    return { matched: false, passages: [] }
  }

  const passages = []
  const seenText = new Set()
  for (const entry of scored) {
    if (passages.length >= 3) break
    if (seenText.has(entry.text)) continue
    passages.push(entry)
    seenText.add(entry.text)
  }

  return { matched: true, passages }
}
