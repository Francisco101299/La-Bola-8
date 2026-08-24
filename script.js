// ============================================
// LA BOLA 8 PRO - VERSIÓN PROFESIONAL
// ============================================

// BASE DE DATOS DE CATEGORÍAS
const categories = {
    comida: {
        title: '¿Qué comemos?',
        icon: '🍕',
        options: [
            'Pizza 🍕',
            'Casado 🍛',
            'Sushi 🍣',
            'Gallo Pinto 🥚',
            'Hamburguesa 🍔',
            'Ensalada 🥗',
            'Comida China 🥡',
            'Tacos 🌮',
            'Olla de carne 🍲',
            'Arroz con pollo 🍗',
            'Pasta 🍝',
            'Pollo frito 🍗'
        ]
    },
    planes: {
        title: '¿Qué hacemos?',
        icon: '🎬',
        options: [
            'Ir a la playa 🏖️',
            'Ir al cine 🎬',
            'Netflix en casa 📺',
            'Ir a un bar 🍺',
            'Caminar al parque 🌳',
            'Dormir todo el día 😴',
            'Ir al gimnasio 💪',
            'Visitar a la familia 👨‍👩‍',
            'Ir de shopping 🛍️',
            'Jugar videojuegos ',
            'Ir a un restaurante 🍽️',
            'Fiesta en casa 🎉'
        ]
    },
    paga: {
        title: '¿Quién paga?',
        icon: '💰',
        options: [
            'Yo pago 💳',
            'Vos pagás 💰',
            'Dividimos en partes iguales 🤝',
            'El que perdió la apuesta 😭',
            'Invita el cumpleañero 🎂',
            'El más joven paga 👶',
            'El que tenga más plata 🤑',
            'La próxima vez paga el otro 🔄',
            'Split 50/50 💵',
            'Quien invitó paga 🎁'
        ]
    },
    pelicula: {
        title: '¿Qué película vemos?',
        icon: '🎥',
        options: [
            'Acción 💥',
            'Comedia 😂',
            'Terror 👻',
            'Drama 😢',
            'Animación 🎨',
            'Documental ',
            'Romance 💕',
            'Ciencia ficción 🚀',
            'Suspenso 🔪',
            'Musical ',
            'Aventura ️',
            'Thriller '
        ]
    },
    excusa: {
        title: '¿Qué excusa uso?',
        icon: '',
        options: [
            'Me duele la cabeza 🤕',
            'Mi mascota está enferma 🐕',
            'Tengo que trabajar hasta tarde 💼',
            'Se me dañó el carro 🚗',
            'Mi mamá me necesita 👩',
            'Estoy con gripe 🤧',
            'Tengo cita médica 🏥',
            'Se me olvidó 🧠',
            'Estoy en cuarentena 😷',
            'Mi abuela me pidió un favor 👵',
            'Tengo que estudiar 📚',
            'No me siento bien 😔'
        ]
    },
    amor: {
        title: '¿Me quiere?',
        icon: '💕',
        options: [
            'Sí, muchísimo 💖',
            'Un poquito 💗',
            'No, para nada 💔',
            'Está pensando en vos 💭',
            'Te extraña 🥺',
            'Está enojado/a 😠',
            'Te ama con locura 😍',
            'Necesita espacio 🌱',
            'Es amor verdadero 💞',
            'Mejor ni preguntes 🙈',
            'Le gustás 😊',
            'Solo como amigo/a 🤝'
        ]
    }
};

// ESTADO DE LA APP
let state = {
    currentCategory: '',
    isShaking: false,
    history: [],
    stats: {
        total: 0,
        today: 0,
        lastDate: new Date().toDateString()
    },
    theme: 'light',
    favorites: []
};

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    checkDate();
    updateStats();
    setupEventListeners();
    initTheme();
    registerServiceWorker();
});

// CARGAR ESTADO DESDE LOCALSTORAGE
function loadState() {
    const saved = localStorage.getItem('labola8_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
    }
}

// GUARDAR ESTADO
function saveState() {
    localStorage.setItem('labola8_state', JSON.stringify(state));
}

// VERIFICAR SI ES NUEVO DÍA
function checkDate() {
    const today = new Date().toDateString();
    if (state.stats.lastDate !== today) {
        state.stats.today = 0;
        state.stats.lastDate = today;
        saveState();
    }
}

// ACTUALIZAR ESTADÍSTICAS
function updateStats() {
    document.getElementById('total-decisions').textContent = state.stats.total;
    document.getElementById('today-decisions').textContent = state.stats.today;
}

// CONFIGURAR EVENT LISTENERS
function setupEventListeners() {
    // Permitir agitar tocando la bola
    const ball = document.getElementById('ball');
    if (ball) {
        ball.addEventListener('click', () => {
            if (document.getElementById('ball-screen').classList.contains('active')) {
                shakeBall();
            }
        });
    }

    // Navegación bottom nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const nav = this.dataset.nav;
            if (nav === 'home') showHome();
            else if (nav === 'history') showHistory();
            else if (nav === 'settings') showSettings();
            
            // Actualizar active state
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// INICIALIZAR TEMA
function initTheme() {
    const savedTheme = localStorage.getItem('labola8_theme') || 'light';
    state.theme = savedTheme;
    applyTheme(savedTheme);
}

// CAMBIAR TEMA
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('labola8_theme', state.theme);
    applyTheme(state.theme);
}

// APLICAR TEMA
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// MOSTRAR CATEGORÍA
function showCategory(category) {
    state.currentCategory = category;
    
    // Actualizar UI
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('ball-screen').classList.add('active');
    document.getElementById('category-title').textContent = categories[category].title;
    
    // Resetear bola
    resetBall();
    
    // Actualizar nav
    updateNavActive('home');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// RESETEAR BOLA
function resetBall() {
    const ballInner = document.getElementById('ball-inner');
    const instruction = document.getElementById('instruction');
    const resultContainer = document.getElementById('result-container');
    
    ballInner.innerHTML = '<span class="question-mark">?</span>';
    ballInner.classList.remove('shaking', 'reveal');
    instruction.style.display = 'block';
    instruction.textContent = 'Toca la bola para consultar al destino';
    resultContainer.classList.add('hidden');
}

// AGITAR LA BOLA
function shakeBall() {
    if (state.isShaking) return;
    
    state.isShaking = true;
    
    const ball = document.getElementById('ball');
    const ballInner = document.getElementById('ball-inner');
    const instruction = document.getElementById('instruction');
    const resultContainer = document.getElementById('result-container');
    
    // UI updates
    resultContainer.classList.add('hidden');
    instruction.textContent = 'Consultando al destino...';
    
    // Animación
    ballInner.classList.add('shaking');
    ballInner.classList.remove('reveal');
    
    // Sonido
    playSound('shake');
    
    // Vibración
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 100, 50, 100]);
    }
    
    // Resultado después de 2.5 segundos
    setTimeout(() => {
        showResult();
        state.isShaking = false;
    }, 2500);
}

// MOSTRAR RESULTADO
function showResult() {
    const category = categories[state.currentCategory];
    const options = category.options;
    const randomIndex = Math.floor(Math.random() * options.length);
    const result = options[randomIndex];
    
    const ballInner = document.getElementById('ball-inner');
    const instruction = document.getElementById('instruction');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const resultEmoji = document.getElementById('result-emoji');
    
    // Actualizar bola
    ballInner.innerHTML = '<span>8</span>';
    ballInner.classList.remove('shaking');
    ballInner.classList.add('reveal');
    
    // Mostrar resultado
    instruction.style.display = 'none';
    resultText.textContent = result;
    resultEmoji.textContent = getCategoryEmoji(state.currentCategory);
    resultContainer.classList.remove('hidden');
    
    // Efecto de confeti
    if (Math.random() > 0.7) { // 30% de probabilidad
        createConfetti();
    }
    
    // Vibración final
    if (navigator.vibrate) {
        navigator.vibrate(200);
    }
    
    // Guardar en historial
    addToHistory(category.title, result);
    
    // Actualizar estadísticas
    state.stats.total++;
    state.stats.today++;
    updateStats();
    saveState();
}

// OBTENER EMOJI DE CATEGORÍA
function getCategoryEmoji(category) {
    const emojis = {
        comida: '',
        planes: '🎬',
        paga: '💰',
        pelicula: '🎥',
        excusa: '🏃',
        amor: '💕'
    };
    return emojis[category] || '✨';
}

// AGREGAR AL HISTORIAL
function addToHistory(category, result) {
    const item = {
        category,
        result,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    state.history.unshift(item);
    if (state.history.length > 50) {
        state.history = state.history.slice(0, 50);
    }
    
    saveState();
}

// COMPARTIR RESULTADO
function shareResult() {
    const result = document.getElementById('result-text').textContent;
    const category = categories[state.currentCategory].title;
    const text = `🎱 La Bola 8 decidió:\n\n${category} → ${result}\n\n¡Probá la app vos también!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'La Bola 8 Pro',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Error al compartir:', err));
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(text).then(() => {
            showNotification('¡Texto copiado! Pegalo en WhatsApp 📋');
        }).catch(() => {
            alert(text);
        });
    }
}

// GUARDAR EN FAVORITOS
function saveToFavorites() {
    const result = document.getElementById('result-text').textContent;
    const category = state.currentCategory;
    
    const exists = state.favorites.find(f => f.category === category && f.result === result);
    
    if (!exists) {
        state.favorites.push({ category, result, timestamp: new Date().toISOString() });
        saveState();
        showNotification('¡Guardado en favoritos! ⭐');
    } else {
        showNotification('Ya está en favoritos');
    }
}

// MOSTRAR HISTORIAL
function showHistory() {
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('ball-screen').classList.remove('active');
    document.getElementById('history-screen').classList.add('active');
    
    renderHistory();
    updateNavActive('history');
}

// RENDERIZAR HISTORIAL
function renderHistory() {
    const list = document.getElementById('history-list');
    
    if (state.history.length === 0) {
        list.innerHTML = '<div class="empty-state">No hay decisiones aún</div>';
        return;
    }
    
    list.innerHTML = state.history.map(item => {
        const date = new Date(item.timestamp);
        const time = date.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="history-item">
                <div class="history-info">
                    <div class="history-category">${item.category}</div>
                    <div class="history-result">${item.result}</div>
                </div>
                <div class="history-time">${time}</div>
            </div>
        `;
    }).join('');
}

// BORRAR HISTORIAL
function clearHistory() {
    if (confirm('¿Estás seguro de borrar todo el historial?')) {
        state.history = [];
        saveState();
        renderHistory();
        showNotification('Historial borrado');
    }
}

// MOSTRAR INICIO
function showHome() {
    document.getElementById('home-screen').classList.add('active');
    document.getElementById('ball-screen').classList.remove('active');
    document.getElementById('history-screen').classList.remove('active');
    updateNavActive('home');
}

// MOSTRAR AJUSTES
function showSettings() {
    showNotification('Ajustes - Próximamente');
}

// ACTUALIZAR NAV ACTIVO
function updateNavActive(nav) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.nav === nav);
    });
}

// CREAR CONFETI
function createConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#11998e', '#38ef7d'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 50);
    }
}

// REPRODUCIR SONIDO
function playSound(type) {
    // En una app real, aquí irían los archivos de sonido
    // Por ahora usamos Web Audio API para un beep simple
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'shake') {
            oscillator.frequency.value = 400;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }
    } catch (e) {
        // Silenciar errores de audio
    }
}

// MOSTRAR NOTIFICACIÓN
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// REGISTRAR SERVICE WORKER (PWA)
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // En una implementación real, crearías un archivo sw.js
        // navigator.serviceWorker.register('/sw.js');
    }
}

// IR ATRÁS
function goBack() {
    showHome();
}

// AGREGAR ESTILOS DE ANIMACIÓN DINÁMICOS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -100px); opacity: 0; }
        to { transform: translate(-50%, 20px); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translate(-50%, 20px); opacity: 1; }
        to { transform: translate(-50%, -100px); opacity: 0; }
    }
    .empty-state {
        text-align: center;
        padding: 40px;
        opacity: 0.5;
        font-size: 16px;
    }
`;
document.head.appendChild(style);
