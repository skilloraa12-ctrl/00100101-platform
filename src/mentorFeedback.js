// "Пам'ять" помічника уроку — 👍/👎 зберігаються в localStorage цього
// браузера й впливають на ранжування відповідей у майбутньому. На відміну
// від фінальної версії в DesignLab UA (спільний Supabase-бекенд), це
// пілотна версія лише для HTML-курсу — локальна, без нового бекенду.
// Якщо пілот приживеться, можна перевести на спільний Supabase так само,
// як зроблено в DesignLab.

const KEY_PREFIX = '00100101:mentor-feedback:'

function load(lessonId) {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + lessonId)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function save(lessonId, data) {
  try {
    localStorage.setItem(KEY_PREFIX + lessonId, JSON.stringify(data))
  } catch {
    // localStorage недоступний (приватний режим тощо) — оцінки просто не
    // збережуться цього разу, решта помічника працює далі без них.
  }
}

// Повертає { aggregate, mine } — в цій локальній версії вони однакові
// (лише твої власні голоси в цьому браузері), але форма збігається з
// DesignLab, щоб LessonMentor.jsx міг бути майже ідентичним.
export function loadFeedback(lessonId) {
  const data = load(lessonId)
  return { aggregate: data, mine: data }
}

// newValue: -1 | 1. currentValue: попередній голос (0, якщо ще не було).
// Повторний клік по тій самій кнопці прибирає голос (toggle off).
export function rate(lessonId, passageText, newValue, currentValue) {
  const data = load(lessonId)
  if (newValue === currentValue) {
    delete data[passageText]
  } else {
    data[passageText] = newValue
  }
  save(lessonId, data)
  return newValue === currentValue ? 0 : newValue
}
