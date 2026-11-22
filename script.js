// ---- Kişiselleştirme ----
// Linke ?isim=Zeynep eklersen sayfa ona hitap eder. İsim yoksa genel kalır.
// Örnek: https://kullanici.github.io/kahve-mi-yemek-mi/?isim=Zeynep
const PHONE_NUMBER = "905372548545"; // WhatsApp mesajının gideceği numara
const SENDER_NAME = "Ateş";

const params = new URLSearchParams(window.location.search);
const rawName = (params.get("isim") || params.get("name") || "").trim().slice(0, 30);
const herName = rawName ? rawName.charAt(0).toLocaleUpperCase("tr-TR") + rawName.slice(1) : "";

if (herName) {
    document.title = `${herName}, sana küçük bir sorum var ☕🍝`;
    document.getElementById("greeting").innerText = `Selam ${herName} 👋`;
    document.getElementById("yay-text").innerText = `Harika, ${herName}! 🎉`;
    document.getElementById("done-eyebrow").innerText = `Tamamdır, ${herName} ✨`;
}

const noButton = document.getElementById("no-btn");
const yesButton = document.getElementById("yes-btn");
const proposalScreen = document.getElementById("proposal-screen");
const detailScreen = document.getElementById("detail-screen");
const foodScreen = document.getElementById("food-screen");
const calendarScreen = document.getElementById("calendar-screen");
const doneScreen = document.getElementById("done-screen");
const confirmBtn = document.getElementById("confirm-btn");

let selectedPlan = "";   // "kahve" ya da "yemek"
let selectedFood = "";
let selectedDate = "";
let selectedTime = "";

const TIMES = {
    kahve: ["14:00", "15:00", "16:00", "17:00"],
    yemek: ["18:00", "19:00", "20:00", "21:00"]
};

function showScreen(screen) {
    [proposalScreen, detailScreen, foodScreen, calendarScreen, doneScreen]
        .forEach(s => s.style.display = "none");
    screen.style.display = "block";
    window.scrollTo(0, 0);
}

// ---- "Hayır" butonu: masaüstünde fare yaklaşınca, telefonda dokunulunca kaçar ----
function overlaps(a, b, gap) {
    return !(a.right + gap < b.left || a.left - gap > b.right ||
             a.bottom + gap < b.top || a.top - gap > b.bottom);
}

const noHint = document.getElementById("no-hint");
const noMessages = [
    "Hmm, o buton biraz utangaç 🙈",
    herName ? `${herName}, emin misin? 🤔` : "Emin misin? 🤔",
    "Kahve de olur ama ☕",
    "Bir daha düşün bence 😄",
    "Tamam, sadece bir kahve. Söz 🤞",
    "Bu buton yakalanmıyor, pes et 😌"
];
let noTries = 0;

function moveNoButton() {
    const margin = 12;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;

    if (!noButton.classList.contains("runaway")) {
        const start = noButton.getBoundingClientRect();
        noButton.classList.add("runaway");
        noButton.style.left = start.left + "px";
        noButton.style.top = start.top + "px";
        void noButton.offsetWidth;
    }

    const w = noButton.offsetWidth;
    const h = noButton.offsetHeight;
    const maxX = Math.max(margin, vw - w - margin);
    const maxY = Math.max(margin, vh - h - margin);
    const yesRect = yesButton.getBoundingClientRect();

    let x, y;
    for (let i = 0; i < 20; i++) {
        x = margin + Math.random() * (maxX - margin);
        y = margin + Math.random() * (maxY - margin);
        const candidate = { left: x, top: y, right: x + w, bottom: y + h };
        if (!overlaps(candidate, yesRect, 16)) break;
    }

    noButton.style.left = x + "px";
    noButton.style.top = y + "px";

    noTries++;
    noHint.innerText = noMessages[Math.min(noTries - 1, noMessages.length - 1)];
}

noButton.addEventListener("mouseenter", moveNoButton);
noButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveNoButton();
}, { passive: false });
noButton.addEventListener("click", (e) => {
    e.preventDefault();
    moveNoButton();
});
window.addEventListener("resize", () => {
    if (noButton.classList.contains("runaway")) moveNoButton();
});

// ---- Akış ----
yesButton.addEventListener("click", () => {
    noButton.style.display = "none";
    showScreen(detailScreen);
});

document.querySelectorAll(".plan-card").forEach(card => {
    card.addEventListener("click", () => {
        selectedPlan = card.dataset.plan;
        selectedFood = "";
        if (selectedPlan === "yemek") {
            showScreen(foodScreen);
        } else {
            openCalendar();
        }
    });
});

document.querySelectorAll(".dish-card").forEach(card => {
    card.addEventListener("click", () => {
        selectedFood = card.querySelector("p").innerText;
        openCalendar();
    });
});

function openCalendar() {
    selectedDate = "";
    selectedTime = "";
    confirmBtn.style.display = "none";
    generateCalendar();
    generateTimes();
    showScreen(calendarScreen);
}

function checkAndShow() {
    if (selectedDate !== "" && selectedTime !== "") {
        confirmBtn.style.display = "block";
        confirmBtn.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

function clearButtonSelection(buttonList) {
    buttonList.forEach(b => b.classList.remove("selected-time"));
}

function generateCalendar() {
    const dateArea = document.getElementById("date-options");
    dateArea.innerHTML = "";

    const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

    for (let i = 0; i < 7; i++) {
        const day = new Date();
        day.setDate(day.getDate() + i);

        const label = day.getDate() + " " + months[day.getMonth()];
        const dayName = i === 0 ? "Bugün" : i === 1 ? "Yarın" : days[day.getDay()];

        const button = document.createElement("button");
        button.className = "time-card date-btn";
        button.innerHTML = `<span class="day-name">${dayName}</span>${label}`;

        button.addEventListener("click", () => {
            selectedDate = label + " " + days[day.getDay()];
            clearButtonSelection(document.querySelectorAll(".date-btn"));
            button.classList.add("selected-time");
            checkAndShow();
        });

        dateArea.appendChild(button);
    }
}

function generateTimes() {
    const timeArea = document.getElementById("time-options");
    timeArea.innerHTML = "";

    TIMES[selectedPlan].forEach(t => {
        const button = document.createElement("button");
        button.className = "time-card time-btn";
        button.innerText = t;
        button.addEventListener("click", () => {
            selectedTime = t;
            clearButtonSelection(document.querySelectorAll(".time-btn"));
            button.classList.add("selected-time");
            checkAndShow();
        });
        timeArea.appendChild(button);
    });
}

// Türkçe ünlü uyumu: 14:00'te, 15:00'te, 16:00'da, 17:00'de, 18:00'de, 19:00'da, 20:00'de, 21:00'de
const timeSuffix = {
    "14:00": "'te", "15:00": "'te", "16:00": "'da", "17:00": "'de",
    "18:00": "'de", "19:00": "'da", "20:00": "'de", "21:00": "'de"
};

confirmBtn.addEventListener("click", () => {
    const what = selectedPlan === "kahve"
        ? "kahve içiyoruz"
        : `${selectedFood.toLowerCase()} yiyoruz`;
    const signature = herName ? ` ${herName}` : "";
    const message = `Selam ${SENDER_NAME}! Davetini gördüm 😊 ${what}, ${selectedDate} saat ${selectedTime}${timeSuffix[selectedTime] || "'da"} görüşüyoruz.${signature}`;
    const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

    const summaryWhat = selectedPlan === "kahve"
        ? "Kahveler benden ☕"
        : `Menüde ${selectedFood.toLowerCase()} var 🍽️`;

    showScreen(doneScreen);
    document.getElementById("done-summary").innerText =
        `${selectedDate}, saat ${selectedTime}. ${summaryWhat} Mesajı gönderince ${SENDER_NAME}'e ulaşır.`;
    document.getElementById("wa-fallback").href = whatsappLink;

    setTimeout(() => { window.location.href = whatsappLink; }, 900);
});
