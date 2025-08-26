// --- учебные справочники (оставил без изменений, если вы используете "что изучил") ---
/* your front/scratch/python/... dictionaries here — оставьте как у вас было */
const front = { /* ...как у вас было... */ };
const scratch = { /* ... */ };
const python = { /* ... */ };
const frontpro = { /* ... */ };
const roblox = { /* ... */ };

// --- служебные функции ---
function attendanceInfo(lessons, attendance) {
  const context = {
    good: "Хотим поделиться хорошей новостью: ваш ребёнок имеет отличную посещаемость наших уроков программирования. Это замечательно, и ваша поддержка играет важную роль в успехе.",
    mid: "Посещаемость хорошая, но есть потенциал для улучшения. Мы готовы предложить бесплатные дополнительные занятия — подберём удобное время.",
    low: "Хотим обратить внимание на посещаемость: она ниже желаемой. Регулярные занятия сильно ускоряют прогресс. Мы предложим бесплатные дополнительные уроки и поможем выбрать время."
  };
  let percentage = 0;
  if (attendance && lessons) percentage = (attendance / lessons) * 100;
  if (percentage > 79) return context.good;
  if (percentage >= 50) return context.mid;
  return context.low;
}

function homeworksInfo(homeworksOverall, homeworksTurned) {
  const context = {
    good: "Ребёнок продемонстрировал отличную успеваемость. Это великолепное достижение! Пожалуйста, продолжайте вдохновлять и поддерживать его.",
    mid: "Успеваемость на среднем уровне — есть потенциал роста. Мы предложим дополнительные шаги и договоримся о небольших домашних тренингах.",
    low: "Пока успеваемость ниже желаемой. Мы поможем: разберёмся с трудностями и составим понятный план улучшений."
  };
  if (!homeworksOverall) return context.low;
  const pct = (homeworksTurned / homeworksOverall) * 100;
  if (pct > 79) return context.good;
  if (pct >= 50) return context.mid;
  return context.low;
}

function escapeHtml(s) {
  return (s || "").toString()
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function splitMulti(raw) {
  // универсальный разбор чекбоксов/списков из формы/URL
  if (!raw) return [];
  return raw
    .split(/\n|;|,|•|\u2022/g)
    .map(x => x.trim())
    .filter(Boolean);
}

function fillList(selector, items) {
  const box = document.querySelector(selector);
  if (!box) return;
  const parentBox = box.closest('.box');
  if (!items || !items.length) {
    if (parentBox) parentBox.style.display = 'none';
    return;
  }
  items.forEach(text => {
    const el = document.createElement('div');
    el.classList.add('lesson'); // переиспользую стиль
    el.innerText = text;
    box.appendChild(el);
  });
}

function problemsTextMap(key) {
  const dict = {
    "Плохой интернет": "Интернет нестабилен: просим проверить подключение/роутер и по возможности использовать проводное соединение.",
    "Частые опоздания": "Замечены опоздания. Рекомендуем за 10 минут до урока включать напоминание и готовить вкладки/проект заранее.",
    "Слабое владение компьютером": "Полезно пройти базовый курс «Компьютерная грамотность» — это ускорит работу на уроках.",
    "Отвлечение на посторонние дела": "Попросим на время урока убрать отвлекающие устройства и включать режим «Не беспокоить».",
    "Отсутствие микрофона": "Желательно подключить гарнитуру — это ускорит обратную связь.",
    "Проблем нет": ""
  };
  return dict[key] || key;
}

// --- чтение параметров из URL ---
const fullUrl = window.location.href;
const paramsObject = {};
const q = fullUrl.split("?")[1];
if (q) {
  q.split("&").forEach(param => {
    const [k, v] = param.split("=");
    paramsObject[decodeURIComponent(k)] = decodeURIComponent(v || "");
  });
}

// --- маппинг колонок под ваш последний пример таблицы ---
// 1 Отметка времени | 2 Ваше ФИО | 3 ФИО ученика | 4 Должно быть | 5 Посетил
// 6 ДЗ должно | 7 ДЗ сдано | 8 Чему научился | 9 Сильные | 10 Слабые
// 11 Рекомендации | 12 Причина по ДЗ
const reportData = {
  full_name: paramsObject["3"],
  lessons: Number(paramsObject["4"] || 0),
  attendance: Number(paramsObject["5"] || 0),
  homeworks_overall: Number(paramsObject["6"] || 0),
  homeworks_turned: Number(paramsObject["7"] || 0),
  month: paramsObject["m"] // передаёте ?m=Август 2025
};

// тексты для посещаемости/успеваемости
reportData.attendance_info = attendanceInfo(reportData.lessons, reportData.attendance);
reportData.homeworks_info = homeworksInfo(reportData.homeworks_overall, reportData.homeworks_turned);

// вставка простых плейсхолдеров {{ ... }}
document.body.innerHTML = document.body.innerHTML.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => reportData[key] || "");

// --- "Стоит обратить внимание на" — скрываем если нет данных ---
(function renderProblems() {
  // ожидаем отдельный параметр ?pr=... (если его нет — пробуем 9 как раньше)
  const raw = paramsObject["pr"] || "";
  const problem_container = document.querySelector(".problem_container");
  const problemsBox = document.getElementById("problemsBox");
  if (!problem_container || !problemsBox) return;

  const items = splitMulti(raw).map(problemsTextMap).filter(Boolean);
  if (!items.length) {
    problemsBox.style.display = "none";
    return;
  }
  items.forEach(text => {
    const div = document.createElement("div");
    div.classList.add("problem");
    div.innerText = text;
    problem_container.appendChild(div);
  });
})();

// --- Что изучил (оставил как у вас) ---
(function renderLearned() {
  const learnedRaw = paramsObject["8"]; // "трека.,номер,номер,..."
  const learnedBox = document.getElementById("learnedBox");
  if (!learnedRaw || !learnedBox) { if (learnedBox) learnedBox.style.display="none"; return; }

  const lessons_list = learnedRaw.split(".,");
  const lessons_cont = document.querySelector(".what_learned");
  const mapLessonList = { "фронт": front, "скретч": scratch, "питон": python, "фронтпро": frontpro, "роблокс": roblox };

  const dict = mapLessonList[lessons_list[0]] || front;
  lessons_list.slice(1).forEach(item => {
    const text = (dict[parseInt(item)]) ? `${item} урок. ${dict[parseInt(item)]}` : item;
    if (text && text.trim()) {
      const el = document.createElement("div");
      el.classList.add("lesson");
      el.innerText = text;
      lessons_cont.appendChild(el);
    }
  });
})();

// --- Сильные / Слабые / Рекомендации (новое) ---
const strengths = splitMulti(paramsObject["9"]);
const weaknesses = splitMulti(paramsObject["10"]);
const recs = splitMulti(paramsObject["11"]);

fillList(".strengths", strengths);
fillList(".weaknesses", weaknesses);
fillList(".recs", recs);

// --- Причина несданных ДЗ ---
(function renderHwReason(){
  const reason = (paramsObject["12"] || "").trim();
  const el = document.querySelector(".hw_reason");
  if (!el) return;
  if (reason && reason !== "-" && reason !== "—") {
    el.textContent = "Причина несданных ДЗ: " + reason;
  } else {
    el.style.display = "none";
  }
})();

// --- скачать PDF ---
document.getElementById("downloadBtn").addEventListener("click", () => {
  const element = document.querySelector(".report");
  html2pdf().from(element).set({
    pagebreak: { mode: ["css"] },
    margin: [4, 0, 4, 0],
  }).save((reportData.full_name || "Отчёт") + ".pdf");
});
