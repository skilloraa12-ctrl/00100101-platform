// Будує відповідь помічника для розпізнаного НАМІРУ — адаптовано з
// DesignLab UA під схему уроків цього курсу: theory/presentation/examples/
// task/hints/solution/check(), замість keyPoints/mistakes/selfCheck.
// "Контентні" наміри (isMeta:false) делегують у mentorMatch.answerFromLesson.
// "Метанаміри" (isMeta:true) будуються з реальних полів уроку.
//
// Важливо: цей курс уже має власний, окремий механізм прогресивних
// підказок ("Підказка 1", "Підказка 2"... "Показати рішення" в розділі
// «Допомога») і автоматичну перевірку коду (кнопка «Перевірити» →
// lesson.check()). Бот не дублює цю логіку — де доречно, він прямо
// вказує на ці вже існуючі елементи інтерфейсу, а не вигадує щось нове.

import { answerFromLesson } from './mentorMatch.js'

function firstSentence(text) {
  if (!text) return ''
  const m = text.match(/^.+?[.!?](?=\s|$)/)
  return (m ? m[0] : text).trim()
}

function notFoundInLesson(lesson, question) {
  return {
    intro: `🤔 Не знайшла в матеріалах уроку «${lesson.title}» прямої відповіді на «${question}».`,
    footer: 'Спробуй сформулювати інакше ключовими словами з уроку, або подивись розділи ТЕОРІЯ й ПРИКЛАДИ вище — я шукаю відповіді лише там.',
  }
}

function contentSearch(lesson, question, feedback, introMatched) {
  const result = answerFromLesson(lesson, question, feedback)
  if (!result.matched) return notFoundInLesson(lesson, question)
  return { intro: introMatched || '📘 За матеріалом уроку:', passages: result.passages }
}

export function buildIntentAnswer(intentId, { lesson, question, prev, next, feedback = {}, checkResult }) {
  switch (intentId) {
    case 'what_is_this':
      return contentSearch(lesson, question, feedback, '📖 Визначення за матеріалом уроку:')

    case 'why_is_this_needed':
      return contentSearch(lesson, question, feedback, '💡 Навіщо це потрібно:')

    case 'how_to_code': {
      const r = contentSearch(lesson, question, feedback, '⌨️ За матеріалом уроку:')
      r.footer = (r.footer ? r.footer + ' ' : '') + 'Пиши код прямо в редакторі вище — там же можна натиснути «Запустити», щоб одразу побачити результат.'
      return r
    }

    case 'compare':
      return contentSearch(lesson, question, feedback, '⚖️ За матеріалом уроку:')

    case 'confirm_understanding': {
      const result = answerFromLesson(lesson, question, feedback)
      if (!result.matched) {
        return {
          intro: '🤔 Не можу впевнено підтвердити це по тексту уроку.',
          footer: 'Спробуй сформулювати це як пряме питання ключовими словами з уроку — так легше знайти відповідний принцип.',
        }
      }
      return { intro: '✅ Схоже, так — ось відповідний принцип уроку:', passages: result.passages.slice(0, 1) }
    }

    case 'example': {
      const ex = (lesson.examples || [])[0]
      if (ex) return { intro: `💬 Приклад із уроку («${ex.title}»):`, passages: [{ label: 'Код', text: ex.code }, { label: 'Пояснення', text: ex.explain }], norate: true }
      return contentSearch(lesson, question, feedback, '💬 За матеріалом уроку:')
    }

    case 'lesson_not_understood': {
      const passages = []
      if (lesson.theory) passages.push({ label: 'Простими словами', text: firstSentence(lesson.theory) })
      for (const slide of (lesson.presentation || []).slice(1, 3)) {
        if (slide.points && slide.points[0]) passages.push({ label: slide.title, text: slide.points[0] })
      }
      return {
        intro: `📘 Коротко про урок «${lesson.title}»:`,
        passages,
        footer: 'Якщо якась конкретна частина все ще незрозуміла — постав про неї окреме питання своїми словами.',
        norate: true,
      }
    }

    case 'task_not_understood': {
      if (!lesson.task) return { intro: 'У цього уроку немає окремого практичного завдання.' }
      const passages = [{ label: 'Суть завдання', text: lesson.task }]
      if (lesson.hints && lesson.hints[0]) passages.push({ label: 'Перша підказка', text: lesson.hints[0] })
      return { intro: '📋 Розберемо завдання:', passages, norate: true }
    }

    case 'question_not_understood':
      return {
        intro: '❔ Скопіюй сюди точний текст, який незрозумілий — так я зможу підказати, про що йдеться.',
      }

    case 'stuck': {
      const step = lesson.hints && lesson.hints[0]
      if (!step) return { intro: 'Спробуй просто написати код за прикладами вище й натиснути «Запустити», щоб побачити результат.' }
      return { intro: '🚧 Перший крок:', passages: [{ label: 'Почни з цього', text: step }], footer: 'Зроби лише цей крок — про наступний спитаєш, коли дійдеш.', norate: true }
    }

    case 'check_my_work': {
      if (checkResult) {
        return {
          intro: checkResult.pass ? '✅ За останньою перевіркою — все правильно:' : '📋 За останньою перевіркою:',
          passages: [{ label: checkResult.pass ? 'Правильно' : 'Поки що неправильно', text: checkResult.message }],
          norate: true,
        }
      }
      return {
        intro: 'Твій код перевіряється автоматично — натисни кнопку «Перевірити» над редактором, і одразу побачиш, що саме не так (якщо щось є).',
        footer: 'Я сама код не аналізую — цим займається вбудована перевірка уроку.',
      }
    }

    case 'technical_problem':
      return {
        intro: 'Опиши текстом: що мало статися, що сталося натомість, і на якому кроці саме.',
        footer: 'Я не бачу твій екран — але за описом кроків часто видно, де саме розбіжність з уроком.',
      }

    case 'learning_difficulty': {
      const step = lesson.hints && lesson.hints[0]
      return {
        intro: 'Це нормально — тут справді багато нового. Не думай про все завдання одразу.',
        passages: step ? [{ label: 'Зроби тільки це зараз', text: step }] : undefined,
        footer: 'Один маленький крок — і вже прогрес. Решта почекає.',
        norate: true,
      }
    }

    case 'what_next':
      if (next) return { intro: `▶️ Наступний урок: «${next.title}».`, footer: 'Натисни «Наступний» внизу сторінки.' }
      return { intro: '🎉 Це останній урок цього курсу.', footer: 'Переглянь список курсів, щоб обрати наступний.' }

    case 'repeat_remind':
    case 'cheat_sheet': {
      const passages = []
      for (const slide of lesson.presentation || []) {
        for (const p of slide.points || []) passages.push({ label: slide.title, text: p })
      }
      if (!passages.length) return { intro: 'Для цього уроку короткого списку принципів немає — подивись розділ ТЕОРІЯ вище.' }
      return { intro: '📝 Коротка шпаргалка уроку:', passages: passages.slice(0, 6), norate: true }
    }

    case 'need_hint': {
      const hint = lesson.hints && lesson.hints[0]
      if (!hint) return { intro: 'Для цього уроку окремих підказок немає — подивись розділ ПРИКЛАДИ вище.' }
      return {
        intro: '🎯 Підказка (без готової відповіді):',
        passages: [{ label: 'Зверни увагу на', text: hint }],
        footer: 'Розділ «Допомога» внизу має ще підказки, якщо цієї не вистачить.',
        norate: true,
      }
    }

    case 'want_answer': {
      const hint = lesson.hints && lesson.hints[0]
      return {
        intro: 'Я не дам готовий код замість тебе — це не допоможе навчитись. Але ось підказка, з чого почати:',
        passages: hint ? [{ label: 'Зверни увагу на', text: hint }] : undefined,
        footer: 'Спробуй сама. Якщо зовсім не вийде — у розділі «Допомога» внизу є кнопка «Показати рішення».',
        norate: true,
      }
    }

    case 'what_is_evaluated':
      if (!lesson.task) return { intro: 'Для цього уроку окремого завдання немає.' }
      return {
        intro: '📋 Автоматична перевірка звіряє твій код із очікуваним результатом завдання:',
        passages: [{ label: 'Завдання', text: lesson.task }],
        footer: 'Натисни «Перевірити» — вона одразу скаже, чого саме не вистачає, якщо щось є.',
        norate: true,
      }

    case 'test_me':
      return {
        intro: 'У цього уроку немає окремих тестових питань — але є автоматична перевірка коду.',
        footer: 'Напиши код за завданням і натисни «Перевірити» над редактором — це і є перевірка.',
      }

    case 'prerequisite':
      if (prev) return { intro: `Перед цим варто розуміти попередній урок: «${prev.title}».`, footer: 'Якщо там теж є прогалини — постав питання і про нього, коли відкриєш той урок.' }
      return { intro: 'Це перший урок курсу — окремих передумов тут немає.' }

    case 'what_to_ask':
      return {
        intro: 'Можеш запитати, наприклад:',
        passages: [
          { label: 'Приклад питання', text: '«Що таке ' + (lesson.title || 'цей тег') + '?»' },
          { label: 'Приклад питання', text: '«Я не зрозуміла завдання»' },
          { label: 'Приклад питання', text: '«Дай підказку»' },
          { label: 'Приклад питання', text: '«Що далі?»' },
        ],
        footer: 'Або натисни одну з кнопок-підказок над полем вводу.',
        norate: true,
      }

    case 'phrase_help':
      return {
        intro: 'Не обов\'язково формулювати правильно — напиши своїми словами, навіть уривками.',
        footer: 'Скриншот я не переглядаю, але можеш написати «я не розумію ось це» і описати, що саме бачиш.',
      }

    default:
      return notFoundInLesson(lesson, question)
  }
}

export function unsureRecognitionAnswer() {
  return {
    intro: 'Я хочу правильно тебе зрозуміти 🙂 Ти питаєш:',
    passages: [
      { label: '1', text: 'що це означає' },
      { label: '2', text: 'як це написати' },
      { label: '3', text: 'навіщо це потрібно' },
    ],
    footer: 'Напиши номер або уточни своїми словами.',
    norate: true,
  }
}

export function wordlessAnswer() {
  return {
    intro: 'Я тут 🙂',
    footer: 'Ти не розумієш урок, завдання, тег чи свій код? Опиши в кількох словах — скриншоти я не переглядаю, але текстом поясню залюбки.',
  }
}

export function fallbackAnswer() {
  return {
    intro: 'Я тут 🙂',
    footer: 'Напиши трохи більше словами, або навіть «я не розумію ось це» і вкажи, яку саме частину уроку маєш на увазі.',
  }
}
