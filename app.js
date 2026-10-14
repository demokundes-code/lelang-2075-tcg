const cards = [
  {
    name: "Z-PHANTOM CYAN",
    speed: 92,
    power: 8942,
    vip: 18,
    rarity: "LEGENDARY",
    color: "gold",
    ability: "Phantom Wing Dive +2000 Power",
  },
  {
    name: "VIP 18 WINGS 50cm",
    speed: 75,
    power: 6500,
    vip: 18,
    rarity: "LEGENDARY",
    color: "gold",
    ability: "White/Blue Lightning",
  },
  {
    name: "GOLD INC 57.5 G/s",
    speed: 60,
    power: 9100,
    vip: 10,
    rarity: "LEGENDARY",
    color: "gold",
    ability: "Passive Gold Income",
  },
  {
    name: "NEO-TOKYO SKYLOOP",
    speed: 88,
    power: 7200,
    vip: 12,
    rarity: "EPIC",
    color: "#f0f",
    ability: "Night Circuit Rain",
  },
  {
    name: "MONEY PASS LV100",
    speed: 70,
    power: 7500,
    vip: 14,
    rarity: "EPIC",
    color: "#f0f",
    ability: "LV100 MAX 13jt Z",
  },
  {
    name: "Z-BOOST 105JT Z",
    speed: 99,
    power: 8000,
    vip: 15,
    rarity: "RARE",
    color: "#0ff",
    ability: "Pajak 5% - Total 105jt Z",
  },
  {
    name: "TREASURY ID 824193",
    speed: 65,
    power: 8200,
    vip: 13,
    rarity: "RARE",
    color: "#0ff",
    ability: "Blockchain Confirmed",
  },
  {
    name: "CYAN WING STRIKE",
    speed: 95,
    power: 6800,
    vip: 17,
    rarity: "RARE",
    color: "#0ff",
    ability: "Cyan Plasma",
  },
  {
    name: "CHRONO HACKER X",
    speed: 98,
    power: 7800,
    vip: 16,
    rarity: "LEGENDARY",
    color: "gold",
    ability: "Time Warp Overclock",
  },
  {
    name: "NEON VALKYRIE",
    speed: 85,
    power: 8800,
    vip: 15,
    rarity: "EPIC",
    color: "#f0f",
    ability: "Plasma Spear Thrust",
  },
  {
    name: "QUANTUM DRIFTER",
    speed: 96,
    power: 7100,
    vip: 14,
    rarity: "RARE",
    color: "#0ff",
    ability: "Sub-space Acceleration",
  },
];

let myHand = [];
let selectedIdx = null;
let gold = 0;
let win = 0;
let lose = 0;
let audioCtx = null;
let musicPlaying = false;
let beatInterval = null;

const goldEl = document.getElementById("gold");
const winEl = document.getElementById("win");
const loseEl = document.getElementById("lose");
const logEl = document.getElementById("log");
const handEl = document.getElementById("hand");
const myCardEl = document.getElementById("myCard");
const botCardEl = document.getElementById("botCard");
const musicToggleBtn = document.getElementById("musicToggle");
const musicStatusEl = document.getElementById("musicStatus");
const duelButtons = [...document.querySelectorAll("[data-duel]")];
const newHandBtn = document.getElementById("newHandBtn");

function initAudio() {
  if (!audioCtx) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) {
      return null;
    }
    audioCtx = new AudioCtor();
  }
  return audioCtx;
}

async function ensureAudioReady() {
  const ctx = initAudio();
  if (!ctx) {
    return;
  }

  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch (error) {
      console.warn("Audio resume failed:", error);
    }
  }
}

function renderCardHTML(card) {
  return `
    <div class="card-rarity" style="color:${card.color}">${card.rarity}</div>
    <div class="card-title">${card.name}</div>
    <div class="stat">SPEED <strong>${card.speed}</strong></div>
    <div class="stat">POWER <strong>${card.power}</strong></div>
    <div class="stat">VIP <strong>${card.vip}</strong></div>
    <div class="card-ability">${card.ability}</div>
  `;
}

function setLog(message) {
  logEl.textContent = message;
}

function updateScore() {
  goldEl.textContent = String(gold);
  winEl.textContent = String(win);
  loseEl.textContent = String(lose);
}

function updateDuelButtons() {
  const hasSelection = selectedIdx !== null && selectedIdx < myHand.length;
  duelButtons.forEach((button) => {
    button.disabled = !hasSelection;
  });
}

function renderHand() {
  if (!myHand.length) {
    handEl.innerHTML = "";
    updateDuelButtons();
    return;
  }

  handEl.innerHTML = myHand
    .map(
      (card, index) => `
        <div
          class="card ${selectedIdx === index ? "selected" : ""}"
          tabindex="0"
          role="button"
          aria-label="Pilih kartu ${card.name}"
          data-index="${index}"
          aria-pressed="${selectedIdx === index ? "true" : "false"}"
        >
          ${renderCardHTML(card)}
        </div>
      `
    )
    .join("");

  handEl.querySelectorAll(".card").forEach((cardEl) => {
    const index = Number(cardEl.dataset.index);

    cardEl.addEventListener("click", () => selectCard(index));
    cardEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCard(index);
      }
    });
  });

  updateDuelButtons();
}

function selectCard(index) {
  if (index < 0 || index >= myHand.length) {
    return;
  }

  ensureAudioReady();
  sfx("select");
  selectedIdx = index;
  renderHand();

  const chosenCard = myHand[index];
  myCardEl.innerHTML = renderCardHTML(chosenCard);
  myCardEl.classList.remove("empty");
  myCardEl.style.borderColor = "#0f8";
  myCardEl.style.boxShadow = "0 0 25px rgba(0,255,153,0.7)";
  myCardEl.setAttribute(
    "aria-label",
    `Kartu pemain dipilih: ${chosenCard.name}. Tekan tombol duel untuk melanjutkan.`
  );
  setLog(`Kartu ${chosenCard.name} dipilih! Silakan pilih jenis adu.`);
}

function clearSelectionDisplay() {
  myCardEl.innerHTML = "Belum pilih";
  myCardEl.classList.add("empty");
  myCardEl.style.borderColor = "rgba(0,234,255,0.5)";
  myCardEl.style.boxShadow = "none";
  myCardEl.setAttribute("aria-label", "Kartu milik pemain belum dipilih");

  botCardEl.innerHTML = "???";
  botCardEl.classList.add("empty");
  botCardEl.style.borderColor = "rgba(255,79,231,0.6)";
  botCardEl.style.boxShadow = "none";
  botCardEl.setAttribute("aria-label", "Kartu lawan belum muncul");
}

function newHand() {
  ensureAudioReady();
  sfx("select");

  myHand = [...cards].sort(() => Math.random() - 0.5).slice(0, 4);
  selectedIdx = null;
  clearSelectionDisplay();
  renderHand();
  setLog("Hand baru dibagikan! Pilih salah satu kartu.");
}

function createTone({ frequency = 440, duration = 0.2, gain = 0.18, type = "sine", sweepTo = null }) {
  const ctx = initAudio();
  if (!ctx) {
    return;
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  if (sweepTo !== null) {
    oscillator.frequency.exponentialRampToValueAtTime(sweepTo, ctx.currentTime + duration);
  }

  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

function sfx(type) {
  ensureAudioReady();

  if (type === "select") {
    createTone({ frequency: 660, duration: 0.12, gain: 0.18, type: "triangle", sweepTo: 820 });
    return;
  }

  if (type === "win") {
    [523, 659, 784, 1046].forEach((frequency, index) => {
      setTimeout(() => {
        createTone({ frequency, duration: 0.18, gain: 0.17, type: "triangle", sweepTo: frequency * 1.12 });
      }, index * 80);
    });
    return;
  }

  if (type === "lose") {
    [400, 300, 220].forEach((frequency, index) => {
      setTimeout(() => {
        createTone({ frequency, duration: 0.2, gain: 0.16, type: "sawtooth", sweepTo: frequency * 0.88 });
      }, index * 110);
    });
  }
}

function playBGM() {
  const ctx = initAudio();
  if (!ctx || musicPlaying) {
    return;
  }

  ensureAudioReady();
  musicPlaying = true;
  musicToggleBtn.setAttribute("aria-pressed", "true");
  musicStatusEl.textContent = "CYBER BEAT ON";

  const bassPattern = [55, 55, 62, 55, 65, 55, 62, 70];
  let index = 0;

  beatInterval = setInterval(() => {
    if (!musicPlaying) {
      return;
    }

    const frequency = bassPattern[index % bassPattern.length];
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.4);

    if (index % 2 === 0) {
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.type = "triangle";
      shimmer.frequency.setValueAtTime(8000, ctx.currentTime);
      shimmerGain.gain.setValueAtTime(0.04, ctx.currentTime);
      shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);
      shimmer.start();
      shimmer.stop(ctx.currentTime + 0.08);
    }

    index += 1;
  }, 220);
}

function stopBGM() {
  musicPlaying = false;
  musicToggleBtn.setAttribute("aria-pressed", "false");
  musicStatusEl.textContent = "BGM OFF";

  if (beatInterval) {
    clearInterval(beatInterval);
    beatInterval = null;
  }
}

async function toggleMusic() {
  await ensureAudioReady();

  if (musicPlaying) {
    stopBGM();
    return;
  }

  playBGM();
}

function duel(attr) {
  if (selectedIdx === null || selectedIdx >= myHand.length) {
    setLog("⚠️ Pilih kartu kamu terlebih dahulu di hand!");
    return;
  }

  ensureAudioReady();

  const myCard = myHand[selectedIdx];
  const botCard = cards[Math.floor(Math.random() * cards.length)];

  botCardEl.innerHTML = renderCardHTML(botCard);
  botCardEl.classList.remove("empty");
  botCardEl.style.borderColor = "#f0f";
  botCardEl.style.boxShadow = "0 0 18px rgba(255,79,231,0.7)";
  botCardEl.setAttribute("aria-label", `Kartu lawan: ${botCard.name}`);

  const myValue = myCard[attr];
  const botValue = botCard[attr];

  let resultText = "";
  if (myValue > botValue) {
    win += 1;
    gold += 500;
    sfx("win");
    resultText = `🎉 MENANG! ${myCard.name} (${myValue}) mengalahkan ${botCard.name} (${botValue}) pada ${attr.toUpperCase()}! (+500 Gold)`;
  } else if (myValue < botValue) {
    lose += 1;
    sfx("lose");
    resultText = `💥 KALAH! ${botCard.name} (${botValue}) mengungguli ${myCard.name} (${myValue}) pada ${attr.toUpperCase()}!`;
  } else {
    sfx("select");
    resultText = `🤝 SERI! Nilai ${attr.toUpperCase()} sama (${myValue}).`;
  }

  updateScore();
  setLog(resultText);

  myHand.splice(selectedIdx, 1);
  selectedIdx = null;
  renderHand();

  setTimeout(() => {
    clearSelectionDisplay();
    if (myHand.length === 0) {
      setLog("Hand habis! Klik Ganti Hand untuk melanjutkan.");
    } else {
      setLog("Hand baru siap! Pilih kartu berikutnya.");
    }
  }, 1500);
}

musicToggleBtn.addEventListener("click", () => {
  toggleMusic();
});

duelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    duel(button.dataset.duel);
  });
});

newHandBtn.addEventListener("click", () => {
  newHand();
});

newHand();
updateScore();
