function splitMulti(str) {
  if (!str) return [];
  return str.split(/[.;]+/).map(s => s.trim()).filter(s => s.length > 0);
}


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

  if (percentage > 79) {
    return context.good;
  } else if (percentage >= 50) {
    return context.mid;
  } else {
    return context.low;
  }
}

function homeworksInfo(homeworksOverall, homeworksTurned) {
  const context = {
    good: "Ребенок продемонстрировал отличную успеваемость.Это великолепное достижение! Пожалуйста, продолжайте вдохновлять и поддерживать его в его образовательном путешествии.",
    mid: "Успеваемость вашего ребенка находится на среднем уровне. Это означает, что есть потенциал для улучшения. Мы верим в потенциал каждого ученика и готовы предложить дополнительную поддержку, чтобы помочь вашему ребенку достичь лучших результатов. Если у вас есть какие-либо вопросы или замечания, пожалуйста, свяжитесь с нами. Мы готовы обсудить индивидуальный план для вашего ребенка, который поможет ему улучшить свою успеваемость.",
    low: "На данный момент успеваемость оставляет желать лучшего. Мы понимаем, что учебные трудности могут возникать у каждого ребенка, и мы готовы предложить поддержку. Если у вашего ребенка возникли трудности в учебе, давайте обсудим, какие шаги мы можем предпринять, чтобы помочь ему улучшить успеваемость. Мы также призываем вас включиться в процесс обучения вашего ребенка и поддержать его в учебе. Совместными усилиями мы сможем помочь ему добиться лучших результатов.",
  };

  let percentage = 0;

  if (homeworksOverall !== 0) {
    try {
      percentage = (homeworksTurned / homeworksOverall) * 100;
    } catch {
      percentage = 0;
    }

    if (percentage > 79) {
      return context.good;
    } else if (percentage >= 50) {
      return context.mid;
    } else {
      return context.low;
    }
  }

  return context.low;
}

const fullUrl = window.location.href; // Full URL including query parameters
console.log(fullUrl);
const paramsObject = {};
// Extract the query string from the full URL
const queryString = fullUrl.split("?")[1]; // Everything after the '?'

// Check if query string exists
if (queryString) {
  // Split query string into key-value pairs
  const paramsArray = queryString.split("&");

  // Initialize an empty object to hold parsed parameters

  // Loop through each key-value pair and split them into the object
  paramsArray.forEach((param) => {
    const [key, value] = param.split("=");
    paramsObject[decodeURIComponent(key)] = decodeURIComponent(value);
  });

  console.log(paramsObject); // Logs the parsed parameters as an object
} else {
  console.log("No query parameters found.");
}

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


reportData["attendance_info"] = attendanceInfo(
  Number(paramsObject["4"] || 0),
  Number(paramsObject["5"] || 0)
);

reportData["homeworks_info"] = homeworksInfo(
  Number(paramsObject["6"] || 0),
  Number(paramsObject["7"] || 0)
);


const lessons_list = splitMulti(paramsObject["8"] || "");
const lessons_cont = document.querySelector(".what_learned");

lessons_list.forEach((element) => {
  const prob = document.createElement("div");
  prob.classList.add("lesson");
  prob.innerText = element; // просто вставляем текст из таблицы как есть
  lessons_cont.appendChild(prob);
});


const exceptions = [
  "Сдает аттестацию",
  "Выполняет практические задания",
  "Работает над дипломным проектом",
  "Работает над проектом  Django",
  "Выполняет доп задания",
];

const finalStage = lessons_list.slice(1).some((lesson) => {
  console.log(lesson);
  return exceptions.includes(lesson.trim());
});

console.log("in final stage : ", finalStage); // true


// универсальная функция для списков (сильные, слабые, рекомендации)
function fillList(selector, arr) {
  const cont = document.querySelector(selector);
  cont.innerHTML = ""; // очистим на всякий случай
  arr.forEach(el => {
    const div = document.createElement("div");
    div.classList.add("lesson");
    div.innerText = el;
    cont.appendChild(div);
  });
}

const strengths = splitMulti(reportData.strengths);
const weaknesses = splitMulti(reportData.weaknesses);
const recs = splitMulti(reportData.recommendations);

fillList(".strengths", strengths);
fillList(".weaknesses", weaknesses);
fillList(".recs", recs);




document.body.innerHTML = document.body.innerHTML.replace(
  /\{\{\s*(\w+)\s*\}\}/g,
  (_, key) => reportData[key] || ""
);


// Function to download the report as PDF
document.getElementById("downloadBtn").addEventListener("click", () => {
  const element = document.querySelector(".report");

  // Use html2pdf to convert the element to a PDF
  html2pdf()
    .from(element)
    .set({
      pagebreak: { mode: ["css"] }, // Avoid cutting elements
      margin: [4, 0, 4, 0],
    })
    .save(paramsObject["3"].trim() + ".pdf");
});

