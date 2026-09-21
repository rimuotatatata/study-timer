const elapsedTime = document.getElementById("elapsed-time");
const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const resetButton = document.getElementById("reset-button");
const todayDate = document.getElementById("today-date");
const subjectTabsContainer = document.getElementById("subject-tabs");
const editSubjectsButton = document.getElementById("edit-subjects-button");
const starSky = document.getElementById("star-sky");
const totalTime = document.getElementById("total-time");
const historyMessage = document.getElementById("history-message");
const weeklyTotal = document.getElementById("weekly-total");
const subjectSummary = document.getElementById("subject-summary");
const goalMessage = document.getElementById("goal-message");
const goalProgress = document.getElementById("goal-progress");
const editGoalButton = document.getElementById("edit-goal-button");
const goalStatus = document.getElementById("goal-status");

let dailyGoalMinutes =
  Number(localStorage.getItem("dailyGoalMinutes")) || 120;

const today = new Date();
const month = today.getMonth() + 1;
const date = today.getDate();
const todayKey = today.getFullYear() + "-" + month + "-" + date;

const defaultSubjects = ["国語", "数学", "理科", "英語"];

let subjects = JSON.parse(
  localStorage.getItem("subjects")
) || defaultSubjects;

let currentSubject =
  localStorage.getItem("currentSubject") || subjects[0];

const savedDate = localStorage.getItem("savedDate");

if (savedDate !== todayKey) {
  subjects.forEach(function (subject) {
    localStorage.removeItem("elapsedSeconds-" + subject);
  });

  localStorage.setItem("savedDate", todayKey);
}

let elapsedSeconds = Number(
  localStorage.getItem("elapsedSeconds-" + currentSubject)
) || 0;

let timerId = null;

function updateTime() {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  elapsedTime.textContent =
    formattedMinutes + ":" + formattedSeconds;
}

function saveTime() {
  localStorage.setItem(
    "elapsedSeconds-" + currentSubject,
    elapsedSeconds
  );
}

function updateButtons() {
  startButton.disabled = timerId !== null;
}

function getTotalSeconds() {
  let totalSeconds = 0;

  subjects.forEach(function (subject) {
    const subjectSeconds = Number(
      localStorage.getItem("elapsedSeconds-" + subject)
    ) || 0;

    totalSeconds = totalSeconds + subjectSeconds;
  });

  return totalSeconds;
}

function formatHistoryTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return formattedMinutes + ":" + formattedSeconds;
}

function getHistoryDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

function updateStudyHistory() {
  const history = JSON.parse(
    localStorage.getItem("studyHistory") || "{}"
  );

  const historyTodayKey = getHistoryDateKey();
  history[historyTodayKey] = getTotalSeconds();

  localStorage.setItem("studyHistory", JSON.stringify(history));

  const dateKeys = Object.keys(history).sort().reverse().slice(0, 7);

  const weeklySeconds = dateKeys.reduce(function (total, dateKey) {
    return total + history[dateKey];
  }, 0);

  weeklyTotal.textContent =
    "直近7日間の合計：" + formatHistoryTime(weeklySeconds);

  const historyLines = dateKeys.map(function (dateKey) {
    return dateKey + "　" + formatHistoryTime(history[dateKey]);
  });

  historyMessage.innerHTML = historyLines.join("<br>");
}

function updateSubjectSummary() {
  subjectSummary.innerHTML = "";

  subjects.forEach(function (subject) {
    const subjectSeconds = Number(
      localStorage.getItem("elapsedSeconds-" + subject)
    ) || 0;

    const item = document.createElement("p");

    item.classList.add("subject-summary-item");
    item.textContent =
      subject + "：" + formatHistoryTime(subjectSeconds);

    subjectSummary.appendChild(item);
  });
}

function updateDailyGoal() {
  const totalSeconds = getTotalSeconds();
  const studiedMinutes = Math.floor(totalSeconds / 60);

  const progressPercent = Math.min(
    (totalSeconds / (dailyGoalMinutes * 60)) * 100,
    100
  );

  goalMessage.textContent =
    "今日の目標：" + studiedMinutes + " / " + dailyGoalMinutes + "分";

  goalProgress.style.width = progressPercent + "%";

  if (totalSeconds >= dailyGoalMinutes * 60) {
  goalStatus.textContent = "目標達成！ おつかれさま！";
  } else {
  goalStatus.textContent = "";
  }
}

function updateTotalTime() {
  const totalSeconds = getTotalSeconds();
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  totalTime.textContent =
    "今日の合計：" + formattedMinutes + ":" + formattedSeconds;

  updateStudyHistory();
  updateSubjectSummary();
  updateDailyGoal();
}

const constellations = [
  {
    name: "北斗七星",
    points: [
      { x: 11, y: 21 },
      { x: 18, y: 21 },
      { x: 20, y: 28 },
      { x: 13, y: 28 },
      { x: 26, y: 33 },
      { x: 32, y: 36 },
      { x: 37, y: 36 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [2, 4], [4, 5], [5, 6]
    ]
  },
  {
    name: "夏の大三角",
    points: [
      { x: 72, y: 18 },
      { x: 88, y: 29 },
      { x: 73, y: 40 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 0]
    ]
  },
  {
    name: "カシオペヤ座",
    points: [
      { x: 14, y: 72 },
      { x: 24, y: 64 },
      { x: 34, y: 72 },
      { x: 44, y: 64 },
      { x: 54, y: 72 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4]
    ]
  },
  {
    name: "ひし形の星座",
    points: [
      { x: 76, y: 63 },
      { x: 88, y: 73 },
      { x: 76, y: 84 },
      { x: 64, y: 73 }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0]
    ]
  }
];

function renderStars() {
  const totalStars = Math.floor(getTotalSeconds() / 600);

  starSky.innerHTML = "";

  let remainingStars = totalStars;

  constellations.forEach(function (constellation) {
    const shownStars = Math.min(
      remainingStars,
      constellation.points.length
    );

    if (shownStars <= 0) {
      return;
    }

    constellation.lines.forEach(function (line) {
      const startIndex = line[0];
      const endIndex = line[1];

      if (startIndex < shownStars && endIndex < shownStars) {
        const startPoint = constellation.points[startIndex];
        const endPoint = constellation.points[endIndex];

        const starLine = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );

        starLine.setAttribute("x1", startPoint.x);
        starLine.setAttribute("y1", startPoint.y);
        starLine.setAttribute("x2", endPoint.x);
        starLine.setAttribute("y2", endPoint.y);
        starLine.classList.add("constellation-line");

        starSky.appendChild(starLine);
      }
    });

    for (let i = 0; i < shownStars; i++) {
      const point = constellation.points[i];

      const star = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

      star.setAttribute("cx", point.x);
      star.setAttribute("cy", point.y);
      star.setAttribute("r", "1.2");
      star.classList.add("constellation-star");

      starSky.appendChild(star);
    }

    remainingStars =
      remainingStars - constellation.points.length;
  });
}

function renderSubjectTabs() {
  subjectTabsContainer.innerHTML = "";

  subjects.forEach(function (subject) {
    const button = document.createElement("button");

    button.textContent = subject;
    button.classList.add("subject-tab");

    if (subject === currentSubject) {
      button.classList.add("active");
    }

    button.addEventListener("click", function () {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }

      saveTime();

      currentSubject = subject;
      localStorage.setItem("currentSubject", currentSubject);

      elapsedSeconds = Number(
        localStorage.getItem("elapsedSeconds-" + currentSubject)
      ) || 0;

      updateTime();
      updateTotalTime();
      updateButtons();
      renderSubjectTabs();
      renderStars();
    });

    subjectTabsContainer.appendChild(button);
  });
}

startButton.addEventListener("click", function () {
  if (timerId !== null) {
    return;
  }

  timerId = setInterval(function () {
    elapsedSeconds = elapsedSeconds + 1;

    updateTime();
    saveTime();
    updateTotalTime();
    renderStars();
  }, 1000);

  updateButtons();
});

stopButton.addEventListener("click", function () {
  clearInterval(timerId);
  timerId = null;

  saveTime();
  updateTotalTime();
  updateButtons();
});

resetButton.addEventListener("click", function () {
  clearInterval(timerId);
  timerId = null;
  elapsedSeconds = 0;

  saveTime();
  updateTime();
  updateTotalTime();
  updateButtons();
  renderStars();
});

editGoalButton.addEventListener("click", function () {
  const input = prompt(
    "今日の目標時間を分で入力してください。",
    dailyGoalMinutes
  );

  if (input === null) {
    return;
  }

  const newGoalMinutes = Number(input);

  if (!Number.isFinite(newGoalMinutes) || newGoalMinutes <= 0) {
    alert("1以上の数字を入力してください。");
    return;
  }

  dailyGoalMinutes = Math.floor(newGoalMinutes);

  localStorage.setItem("dailyGoalMinutes", dailyGoalMinutes);

  updateDailyGoal();
});

editSubjectsButton.addEventListener("click", function () {
  const input = prompt(
    "教科をカンマ（,）で区切って入力してください。",
    subjects.join(", ")
  );

  if (input === null) {
    return;
  }

  const newSubjects = input
    .split(/[、,，]/)
    .map(function (subject) {
      return subject.trim();
    })
    .filter(function (subject) {
      return subject !== "";
    });

  if (newSubjects.length === 0) {
    alert("教科名を1つ以上入力してください。");
    return;
  }

  subjects = newSubjects;
  localStorage.setItem("subjects", JSON.stringify(subjects));

  if (!subjects.includes(currentSubject)) {
    currentSubject = subjects[0];
    localStorage.setItem("currentSubject", currentSubject);

    elapsedSeconds = Number(
      localStorage.getItem("elapsedSeconds-" + currentSubject)
    ) || 0;
  }

  updateTime();
  updateTotalTime();
  renderSubjectTabs();
  renderStars();
});

todayDate.textContent = month + "月" + date + "日";

updateTime();
updateTotalTime();
updateButtons();
renderSubjectTabs();
renderStars();