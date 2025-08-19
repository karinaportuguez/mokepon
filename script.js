// Definimos tipos y ventajas
const advantages = {
  fuego: { fuerte: 'aire', debil: 'agua' },
  agua: { fuerte: 'fuego', debil: 'tierra' },
  tierra: { fuerte: 'agua', debil: 'aire' },
  aire: { fuerte: 'tierra', debil: 'fuego' }
};

class Mokepon {
  constructor(name, type, imgSrc) {
    this.name = name;
    this.type = type;
    this.hp = 100;
    this.img = imgSrc;
  }
  attack(target, move) {
    // base damage
    let dmg = move === 'special' ? 20 : 10;
    // ventaja elemental
    if (advantages[this.type].fuerte === target.type) dmg *= 1.2;
    if (advantages[this.type].debil === target.type) dmg *= 0.8;
    dmg = Math.round(dmg);
    target.hp = Math.max(target.hp - dmg, 0);
    return dmg;
  }
}

// Referencias DOM
const selScreen = document.getElementById('selection-screen');
const batScreen = document.getElementById('battle-screen');
const confirmBtn = document.getElementById('confirm-selection');
const cards = document.querySelectorAll('.mokepon-card');

let player, enemy;


// Referencias a la nueva pantalla
const startScreen = document.getElementById('start-screen');
const selectionScreen = document.getElementById('selection-screen');
const battleScreen = document.getElementById('battle-screen');

// Botones de inicio
const btnPlay = document.getElementById('btn-play');
const btnTutorial = document.getElementById('btn-tutorial');
const btnSettings = document.getElementById('btn-settings');
const btnCredits = document.getElementById('btn-credits');

// Al cargar, sólo mostramos la pantalla de inicio
window.addEventListener('DOMContentLoaded', () => {
  startScreen.classList.remove('hidden');
  selectionScreen.classList.add('hidden');
  battleScreen.classList.add('hidden');
});

// JUGAR → va a selección
btnPlay.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  selectionScreen.classList.remove('hidden');
});

// TUTORIAL, AJUSTES, CRÉDITOS → por ahora muestras un alert o modal
btnTutorial.addEventListener('click', () => {
  alert('Aquí irá tu tutorial 😉');
});
btnSettings.addEventListener('click', () => {
  alert('Pantalla de ajustes próximamente 🔧');
});
btnCredits.addEventListener('click', () => {
  alert('Creado por tu empresa de videojuegos 🎮');
});

// Selección
cards.forEach(card => {
  card.addEventListener('click', () => {
    cards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    confirmBtn.disabled = false;
  });
});

confirmBtn.addEventListener('click', () => {
  const sel = document.querySelector('.mokepon-card.selected');
  const name = sel.dataset.name;
  const type = sel.dataset.type;
  player = new Mokepon(name, type, `assets/${name.toLowerCase()}.png`);

  // Generar enemigo aleatorio distinto
  const others = [...cards].filter(c => c !== sel);
  const rand = others[Math.floor(Math.random() * others.length)];
  const eName = rand.dataset.name;
  const eType = rand.dataset.type;
  enemy = new Mokepon(eName, eType, `assets/${eName.toLowerCase()}.png`);

  startBattle();
});

// Iniciar batalla
function startBattle() {
  selScreen.classList.add('hidden');
  batScreen.classList.remove('hidden');
  document.getElementById('player-name').textContent = player.name;
  document.getElementById('enemy-name').textContent = enemy.name;
  document.getElementById('player-img').src = player.img;
  document.getElementById('enemy-img').src = enemy.img;
  updateBars();
  logMessage(`¡Comienza el combate! Tu ${player.name} vs ${enemy.name}.`);

  document.querySelectorAll('.actions button').forEach(btn => {
    btn.disabled = false;
    btn.onclick = () => playerTurn(btn.dataset.move);
  });
}

// Actualizar barras de vida
function updateBars() {
  const pBar = document.getElementById('player-health');
  const eBar = document.getElementById('enemy-health');
  pBar.style.width = player.hp + '%';
  eBar.style.width = enemy.hp + '%';
  // color según % vida
  pBar.style.background = player.hp < 30 ? '#E2574C' : '#4CAF50';
  eBar.style.background = enemy.hp < 30 ? '#E2574C' : '#4CAF50';
}

// Turno del jugador
function playerTurn(move) {
  disableActions();
  const dmg = player.attack(enemy, move);
  logMessage(`Tu ${player.name} usó ${move} y causó ${dmg} de daño.`);
  updateBars();
  if (enemy.hp === 0) return endBattle('¡Ganaste!');
  // Turno enemigo tras pequeño retraso
  setTimeout(enemyTurn, 800);
}

// Turno del enemigo
function enemyTurn() {
  const move = Math.random() < 0.5 ? 'basic' : 'special';
  const dmg = enemy.attack(player, move);
  logMessage(`El ${enemy.name} usó ${move} y causó ${dmg} de daño.`);
  updateBars();
  if (player.hp === 0) return endBattle('¡Perdiste!');
  enableActions();
}

// Utilidades
function disableActions() {
  document.querySelectorAll('.actions button').forEach(b => b.disabled = true);
}
function enableActions() {
  document.querySelectorAll('.actions button').forEach(b => b.disabled = false);
}
function logMessage(msg) {
  const log = document.getElementById('log');
  log.innerHTML += `<p>${msg}</p>`;
  log.scrollTop = log.scrollHeight;
}
function endBattle(text) {
  logMessage(text);
  const restartBtn = document.getElementById('restart');
  if (!restartBtn) {
    console.error('No encontré el botón #restart en el DOM');
    return;
  }

  restartBtn.classList.remove('hidden');
  restartBtn.addEventListener('click', () => window.location.reload());

  disableActions();
}