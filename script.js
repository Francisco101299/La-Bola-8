// BASE DE DATOS DE OPCIONES
const categories = {
    comida: {
        title: '¿Qué comemos?',
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
            'Arroz con pollo 🍗'
        ]
    },
    planes: {
        title: '¿Qué hacemos?',
        options: [
            'Ir a la playa 🏖️',
            'Ir al cine 🎬',
            'Netflix en casa 📺',
            'Ir a un bar 🍺',
            'Caminar al parque 🌳',
            'Dormir todo el día 😴',
            'Ir al gimnasio 💪',
            'Visitar a la familia 👨‍👩‍👧',
            'Ir de shopping 🛍️',
            'Jugar videojuegos 🎮'
        ]
    },
    paga: {
        title: '¿Quién paga?',
        options: [
            'Yo pago 💳',
            'Vos pagás 💰',
            'Dividimos en partes iguales 🤝',
            'El que perdió la apuesta 😭',
            'Invita el cumpleañero 🎂',
            'El más joven paga 👶',
            'El que tenga más plata 🤑',
            'La próxima vez paga el otro 🔄'
        ]
    },
    pelicula: {
        title: '¿Qué película vemos?',
        options: [
            'Acción 💥',
            'Comedia 😂',
            'Terror 👻',
            'Drama 😢',
            'Animación 🎨',
            'Documental 📚',
            'Romance 💕',
            'Ciencia ficción 🚀',
            'Suspenso 🔪',
            'Musical 🎵'
        ]
    },
    excusa: {
        title: '¿Qué excusa uso?',
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
            'Mi abuela me pidió un favor 👵'
        ]
    },
    amor: {
        title: '¿Me quiere?',
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
            'Mejor ni preguntes 🙈'
        ]
    }
};

let currentCategory = '';
let isShaking = false;

// MOSTRAR CATEGORÍA
function showCategory(category) {
    currentCategory = category;
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('ball-screen').style.display = 'block';
    document.getElementById('category-title').textContent = categories[category].title;
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('instruction').style.display = 'block';
    document.getElementById('ball-inner').textContent = '?';
    document.getElementById('ball-inner').classList.remove('reveal');
}

// AGITAR LA BOLA
function shakeBall() {
    if (isShaking) return;
    
    isShaking = true;
    const ball = document.getElementById('ball');
    const ballInner = document.getElementById('ball-inner');
    const instruction = document.getElementById('instruction');
    const resultContainer = document.getElementById('result-container');
    
    // Ocultar resultado anterior
    resultContainer.style.display = 'none';
    instruction.textContent = 'La bola está pensando...';
    
    // Animación de agitar
    ball.classList.add('shaking');
    ballInner.classList.remove('reveal');
    
    // Vibración del celular (si está soportada)
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 100]);
    }
    
    // Después de 2 segundos, muestra el resultado
    setTimeout(() => {
        ball.classList.remove('shaking');
        
        const options = categories[currentCategory].options;
        const randomIndex = Math.floor(Math.random() * options.length);
        const result = options[randomIndex];
        
        ballInner.textContent = '8';
        ballInner.classList.add('reveal');
        
        instruction.style.display = 'none';
        resultContainer.style.display = 'block';
        document.getElementById('result').textContent = result;
        
        // Vibración al mostrar resultado
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
        
        isShaking = false;
    }, 2000);
}

// COMPARTIR RESULTADO
function shareResult() {
    const result = document.getElementById('result').textContent;
    const title = categories[currentCategory].title;
    const text = `🎱 La Bola 8 decidió: ${title} → ${result}\n\n¡Probá la app vos también!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'La Bola 8',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Error al compartir:', err));
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(text).then(() => {
            alert('¡Texto copiado! Pegalo en WhatsApp o donde quieras 📋');
        });
    }
}

// VOLVER AL INICIO
function goBack() {
    document.getElementById('home-screen').style.display = 'block';
    document.getElementById('ball-screen').style.display = 'none';
}

// PERMITIR AGITAR TOCANDO LA BOLA
document.addEventListener('DOMContentLoaded', function() {
    const ball = document.getElementById('ball');
    if (ball) {
        ball.addEventListener('click', function() {
            if (document.getElementById('ball-screen').style.display !== 'none') {
                shakeBall();
            }
        });
    }
});
