// --- Парсинг URL параметров ---
const fullUrl = window.location.href;
console.log(fullUrl);
const paramsObject = {};
const queryString = fullUrl.split("?")[1];

if (queryString) {
  const paramsArray = queryString.split("&");
  paramsArray.forEach((param) => {
    const [key, value] = param.split("=");
    paramsObject[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  console.log(paramsObject);
} else {
  console.log("No query parameters found.");
}

// --- Основные данные для отчёта ---
const reportData = {
  full_name: paramsObject["3"],
  attendance: paramsObject["5"],
  lessons: paramsObject["4"],
  homeworks_turned: paramsObject["7"],
  homeworks_overall: paramsObject["6"],
  strengths: paramsObject["9"],
  weaknesses: paramsObject["10"],
  recommendations: paramsObject["11"],
  month: paramsObject["m"],
};

// --- Генерация текста для посещаемости ---
function attendanceInfo(lessons, attendance) {
  const context = {
    good: "Хотим поделиться хорошей новостью: ваш ребенок имеет отличную посещаемость наших уроков программирования. Это замечательно, и ваша поддержка играет важную роль в успехе.",
    mid: "Хотим обратить ваше внимание на то, что посещаемость наших уроков программирования является хорошей, но не отличной. С нашей стороны мы предоставим вам бесплатные дополнительные занятия, вам необходимо будет указать время и дни для комфортного прохождения данных уроков.",
    low: "Хотели бы обратить ваше внимание на посещаемость уроков вашего ребенка. К сожалению, она несколько ниже желаемой. Важно помнить, что регулярное участие на уроках играет ключевую роль в успехе обучения. С нашей стороны мы предоставим вам бесплатные дополнительные занятия, вам необходимо будет указать время и дни для комфортного прохождения данных уроков.",
  };

  let percentage = 0;
  if (attendance !== 0 && lessons !== 0) {
    percentage = (attendance / lessons) * 100;
  }

  if (percentage > 79) return context.good;
  if (percentage >= 50) return context.mid;
  return context.low;
}

// --- Генерация текста для ДЗ ---
function homeworksInfo(homeworksOverall, homeworksTurned) {
  const context = {
    good: "Ребенок продемонстрировал отличную успеваемость. Это великолепное достижение! Пожалуйста, продолжайте вдохновлять и поддерживать его в его образовательном путешествии.",
    mid: "Успеваемость вашего ребенка находится на среднем уровне. Это означает, что есть потенциал для улучшения. Мы верим в потенциал каждого ученика и готовы предложить дополнительную поддержку, чтобы помочь вашему ребенку достичь лучших результатов.",
    low: "На данный момент успеваемость оставляет желать лучшего. Мы понимаем, что учебные трудности могут возникать у каждого ребенка, и мы готовы предложить поддержку. Давайте обсудим шаги, которые помогут улучшить ситуацию. Совместными усилиями мы сможем помочь добиться лучших результатов.",
  };

  if (!homeworksOverall) return context.low;

  let percentage = (homeworksTurned / homeworksOverall) * 100;
  if (percentage > 79) return context.good;
  if (percentage >= 50) return context.mid;
  return context.low;
}

// --- Добавляем тексты в reportData ---
reportData["attendance_info"] = attendanceInfo(
  Number(paramsObject["4"] || 0),
  Number(paramsObject["5"] || 0)
);

reportData["homeworks_info"] = homeworksInfo(
  Number(paramsObject["6"] || 0),
  Number(paramsObject["7"] || 0)
);

// --- Вспомогательные функции ---
function splitMulti(str) {
  if (!str) return [];
  return str.split(/[.,;]+/).map(s => s.trim()).filter(s => s.length > 0);
}

function fillList(selector, arr) {
  const cont = document.querySelector(selector);
  arr.forEach(el => {
    const div = document.createElement("div");
    div.classList.add("lesson");
    div.innerText = el;
    cont.appendChild(div);
  });
}

// --- Отображение изученных уроков ---
const lessons_list = splitMulti(paramsObject["8"]);
const lessons_cont = document.querySelector(".what_learned");

const mapLessonList = {
  фронт: front,
  скретч: scratch,
  питон: python,
  фронтпро: frontpro,
  роблокс: roblox,
};

let source = null;
if (lessons_list.length && mapLessonList[lessons_list[0].toLowerCase()]) {
  source = mapLessonList[lessons_list[0].toLowerCase()];
  lessons_list.shift(); // удаляем название курса
}

lessons_list.forEach((element) => {
  const prob = document.createElement("div");
  prob.classList.add("lesson");

  const num = parseInt(element);
  if (source && !isNaN(num) && source[num]) {
    prob.innerText = num + " урок. " + source[num];
  } else {
    prob.innerText = element; // просто текст
  }

  lessons_cont.appendChild(prob);
});

// --- Сильные / слабые стороны и рекомендации ---
fillList(".strengths", splitMulti(reportData.strengths));
fillList(".weaknesses", splitMulti(reportData.weaknesses));
fillList(".recs", splitMulti(reportData.recommendations));

// --- Подстановка {{ }} в HTML ---
document.body.innerHTML = document.body.innerHTML.replace(
  /\{\{\s*(\w+)\s*\}\}/g,
  (_, key) => reportData[key] || ""
);

// --- Кнопка "Скачать PDF" ---
document.getElementById("downloadBtn").addEventListener("click", () => {
  const element = document.querySelector(".report");
  html2pdf()
    .from(element)
    .set({
      pagebreak: { mode: ["css"] },
      margin: [4, 0, 4, 0],
    })
    .save(paramsObject["3"].trim() + ".pdf");
});
