// Inicializa la variable 'sunCount' con el valor 150, representando la cantidad inicial de soles que tiene el jugador
let sunCount = 150;

// Inicializa la variable 'score' con el valor 0, representando la puntuación inicial del jugador
let score = 0;

// Inicializa la variable 'zombiesPassed' con el valor 0, para contar cuántos zombis han logrado pasar el jardín
let zombiesPassed = 0;

// Define una constante 'maxZombiesPassed' con el valor 2, que es el número máximo de zombis permitidos antes de que termine el juego
const maxZombiesPassed = 2; // Número de zombis permitidos antes del Game Over

// Define una constante 'cellWidth' con el valor 80, que representa el ancho en píxeles de cada celda del tablero
const cellWidth = 80;

// --- Referencias al DOM (Document Object Model) ---

// Selecciona el elemento HTML con el ID 'sun-count', que muestra la cantidad de soles disponibles
const sunCountElement = document.getElementById("sun-count");

// Selecciona el elemento HTML con el ID 'score-count', que muestra la puntuación actual del jugador
const scoreCountElement = document.getElementById("score-count");

// Selecciona el botón con el ID 'pea-plant', que el jugador puede hacer clic para seleccionar la planta guisante
const plantButton = document.getElementById("pea-plant");

// Selecciona el elemento HTML con el ID 'game-board', que es el contenedor principal del tablero del juego
const gameBoard = document.getElementById("game-board");

// --- Variables para los intervalos (timers) ---

// Declara la variable 'zombieSpawnInterval' que almacenará el intervalo para generar zombis
let zombieSpawnInterval;

// Declara la variable 'sunSpawnInterval' que almacenará el intervalo para generar soles
let sunSpawnInterval;

// --- Generar el tablero dinámicamente ---

// Función que genera el tablero de juego con un número determinado de filas y columnas
function generateBoard(rows = 5, columns = 9) {
    // Itera sobre cada fila
    for (let row = 0; row < rows; row++) {
        // Itera sobre cada columna dentro de la fila actual
        for (let col = 0; col < columns; col++) {
            // Crea un nuevo elemento 'div' que representará una celda en el tablero
            const cell = document.createElement("div");

            // Añade la clase 'cell' al elemento para aplicarle estilos CSS
            cell.classList.add("cell");

            // Asigna el número de fila al atributo 'data-row' del elemento para referencia futura
            cell.dataset.row = row;

            // Asigna el número de columna al atributo 'data-col' del elemento para referencia futura
            cell.dataset.col = col;

            // Añade un evento de clic a la celda que permitirá colocar una planta cuando se haga clic en ella
            cell.addEventListener("click", () => placePlant(cell));

            // Añade la celda al tablero de juego en el DOM
            gameBoard.appendChild(cell);
        }
    }
}

// --- Colocar una planta si se selecciona y hay suficiente sol ---

// Función que coloca una planta en una celda específica si se cumplen ciertas condiciones
function placePlant(cell) {
    // Verifica que haya una planta seleccionada, que el jugador tenga al menos 50 soles y que la celda no tenga ya una planta
    if (selectedPlant && sunCount >= 50 && !cell.querySelector('.plant')) {
        // Crea un nuevo elemento 'div' que representará la planta
        const plant = document.createElement("div");

        // Añade la clase 'plant' al elemento para aplicarle estilos CSS
        plant.classList.add("plant");

        // Establece el contenido de texto del elemento como un emoji de planta para representarla visualmente
        plant.textContent = "🌱";

        // Añade la planta a la celda en el tablero
        cell.appendChild(plant);

        // Reduce la cantidad de soles del jugador en 50, que es el costo de la planta
        sunCount -= 50;

        // Actualiza la visualización de la cantidad de soles en la interfaz
        updateSunCount();

        // Deselecciona la planta para evitar colocar múltiples plantas sin seleccionarlas nuevamente
        selectedPlant = null;

        // Inicia un intervalo que hará que la planta dispare un proyectil cada 2 segundos
        const intervalId = setInterval(() => {
            // Verifica si la planta aún está en la celda; si no, detiene el intervalo
            if (!cell.querySelector('.plant')) {
                clearInterval(intervalId);
                return;
            }
            // Llama a la función que dispara un proyectil desde la planta
            shootPea(cell);
        }, 2000);

        // Almacena el ID del intervalo en el atributo 'data-shooterId' de la planta para poder referenciarlo más tarde
        plant.dataset.shooterId = intervalId;
    }
}

// --- Disparar un proyectil desde la planta ---

// Función que crea y anima un proyectil que sale de una planta en una celda específica
function shootPea(cell) {
    // Obtiene el número de fila de la celda desde su atributo 'data-row' y lo convierte a entero
    const row = parseInt(cell.dataset.row);

    // Obtiene el número de columna de la celda desde su atributo 'data-col' y lo convierte a entero
    const col = parseInt(cell.dataset.col);

    // Crea un nuevo elemento 'div' que representará el proyectil (guisante)
    const pea = document.createElement("div");

    // Añade la clase 'pea' al elemento para aplicarle estilos CSS
    pea.classList.add("pea");

    // Establece el contenido de texto del elemento como un emoji de guisante para representarlo visualmente
    pea.textContent = "🌰";

    // Calcula la posición vertical (top) del proyectil en función de la fila y el tamaño de la celda
    pea.style.top = `${row * (cellWidth + 5) + 20}px`;

    // Calcula la posición horizontal (left) del proyectil en función de la columna y el tamaño de la celda
    pea.style.left = `${col * (cellWidth + 5) + 10}px`;

    // Establece una transición CSS para animar el movimiento del proyectil de forma suave
    pea.style.transition = 'transform 4s linear';

    // Añade el proyectil al tablero de juego en el DOM
    gameBoard.appendChild(pea);

    // --- Calcular la distancia hasta el borde derecho del tablero ---

    // Calcula la posición inicial en X del proyectil
    const startX = col * (cellWidth + 5) + 10;

    // Calcula el ancho total del tablero en función del número de columnas y el tamaño de las celdas
    const boardWidth = 9 * (cellWidth + 5);

    // Calcula la distancia que el proyectil debe recorrer hasta el borde derecho del tablero
    const distance = boardWidth - startX - 20;

    // --- Mover el proyectil usando transform ---

    // Utiliza 'requestAnimationFrame' para iniciar la animación del proyectil
    requestAnimationFrame(() => {
        // Aplica una transformación CSS para mover el proyectil horizontalmente la distancia calculada
        pea.style.transform = `translateX(${distance}px)`;
    });

    // --- Detectar colisiones ---

    // Inicia un intervalo que verifica si el proyectil ha colisionado con un zombi cada 50 milisegundos
    const collisionInterval = setInterval(() => {
        detectCollision(pea, collisionInterval);
    }, 50);

    // --- Eliminar el proyectil después de que salga del tablero ---

    // Después de 4 segundos (duración de la animación), elimina el proyectil y limpia el intervalo de colisión
    setTimeout(() => {
        pea.remove();
        clearInterval(collisionInterval);
    }, 4000);
}

// --- Detectar colisión entre proyectil y zombi ---

// Función que verifica si un proyectil ha colisionado con algún zombi
function detectCollision(pea, interval) {
    // Obtiene las dimensiones y posición del proyectil en la ventana
    const peaRect = pea.getBoundingClientRect();

    // Selecciona todos los elementos con la clase 'zombie' en el DOM
    const zombies = document.querySelectorAll('.zombie');

    // Itera sobre cada zombi para verificar si hay colisión
    zombies.forEach(zombie => {
        // Obtiene las dimensiones y posición del zombi en la ventana
        const zombieRect = zombie.getBoundingClientRect();

        // Comprueba si los rectángulos del proyectil y el zombi se superponen (colisión)
        if (
            peaRect.left < zombieRect.right &&
            peaRect.right > zombieRect.left &&
            peaRect.top < zombieRect.bottom &&
            peaRect.bottom > zombieRect.top
        ) {
            // Incrementa el contador de impactos recibidos del zombi
            zombie.dataset.hits = (parseInt(zombie.dataset.hits) || 0) + 1;

            // Elimina el proyectil del DOM
            pea.remove();

            // Limpia el intervalo de colisión para este proyectil
            clearInterval(interval);

            // Si el zombi ha recibido 2 o más impactos, se elimina del juego
            if (zombie.dataset.hits >= 2) {
                zombie.remove();

                // Actualiza la puntuación del jugador agregando 10 puntos por zombi eliminado
                updateScore(10); // Aumentar el puntaje en 10 puntos por zombi eliminado
            }
        }
    });
}

// --- Actualizar el contador de puntaje ---

// Función que actualiza la puntuación del jugador
function updateScore(points) {
    // Suma los puntos obtenidos a la puntuación actual
    score += points;

    // Actualiza el elemento 'scoreCountElement' en el DOM para mostrar la nueva puntuación
    scoreCountElement.textContent = score;

    // --- Verificar si el jugador ha alcanzado los 200 puntos ---

    // Si la puntuación es mayor o igual a 200, el jugador gana el juego
    if (score >= 200) {
        endGame(true); // true indica que el jugador ganó
    }
}

// --- Mover zombis de derecha a izquierda ---

// Función que genera un zombi y lo mueve a través del tablero
function spawnZombie() {
    // --- Seleccionar una fila al azar ---

    // Convierte los hijos del tablero en un array y filtra las celdas que están en la columna 0
    const rows = Array.from(gameBoard.children).filter(
        cell => cell.dataset.col == 0 // Podemos usar cualquier columna aquí
    );

    // Selecciona una celda aleatoria de las filas disponibles
    const randomCell = rows[Math.floor(Math.random() * rows.length)];

    // Obtiene el número de fila de la celda seleccionada
    const row = parseInt(randomCell.dataset.row);

    // --- Crear el zombi ---

    // Crea un nuevo elemento 'div' que representará al zombi
    const zombie = document.createElement("div");

    // Añade la clase 'zombie' al elemento para aplicarle estilos CSS
    zombie.classList.add("zombie");

    // Establece el contenido de texto del elemento como un emoji de zombi para representarlo visualmente
    zombie.textContent = "🧟";

    // Inicializa el contador de impactos recibidos del zombi en 0
    zombie.dataset.hits = 0;

    // --- Posicionar verticalmente el zombi ---

    // Calcula la posición vertical (top) del zombi en función de la fila y el tamaño de la celda
    zombie.style.top = `${row * (cellWidth + 5) + 20}px`;

    // --- Añadir el zombi al DOM antes de calcular su ancho ---

    // Añade el zombi al tablero de juego en el DOM
    gameBoard.appendChild(zombie);

    // --- Obtener el ancho del tablero y del zombi ---

    // Obtiene el ancho total del tablero
    const boardWidth = gameBoard.offsetWidth;

    // Obtiene el ancho del zombi; si no está disponible, utiliza 40 píxeles como valor predeterminado
    const zombieWidth = zombie.offsetWidth || 40;

    // --- Posicionar el zombi en el borde derecho del tablero ---

    // Calcula la posición horizontal (left) inicial del zombi para colocarlo en el borde derecho
    zombie.style.left = `${boardWidth - zombieWidth}px`;

    // --- Configurar la transición ---

    // Establece una transición CSS para animar el movimiento del zombi de forma suave
    zombie.style.transition = 'transform 16s linear';

    // --- Calcular la distancia de movimiento ---

    // Calcula la distancia que el zombi debe recorrer hacia la izquierda (negativa)
    const distance = -(boardWidth + zombieWidth);

    // --- Iniciar el movimiento del zombi ---

    // Utiliza 'requestAnimationFrame' para iniciar la animación del zombi
    requestAnimationFrame(() => {
        // Aplica una transformación CSS para mover el zombi horizontalmente la distancia calculada
        zombie.style.transform = `translateX(${distance}px)`;
    });

    // --- Detección de colisiones con plantas ---

    // Inicia un intervalo que verifica si el zombi ha colisionado con una planta cada 50 milisegundos
    const collisionInterval = setInterval(() => {
        detectZombieCollision(zombie, collisionInterval);
    }, 50);

    // --- Detectar si el zombi ha salido del tablero ---

    // Después de 16 segundos (duración de la animación), verifica si el zombi sigue en el DOM
    setTimeout(() => {
        if (document.body.contains(zombie)) {
            // Si el zombi aún existe, lo elimina del DOM
            zombie.remove();

            // Limpia el intervalo de colisión para este zombi
            clearInterval(collisionInterval);

            // Incrementa el contador de zombis que han pasado el jardín
            zombiesPassed += 1;

            // Si el número de zombis que han pasado supera el máximo permitido, el jugador pierde
            if (zombiesPassed >= maxZombiesPassed) {
                endGame(false); // El jugador ha perdido
            }
        }
    }, 16000); // Duración de la transición
}

// --- Detectar colisión entre zombis y plantas ---

// Función que verifica si un zombi ha colisionado con alguna planta
function detectZombieCollision(zombie) {
    // Obtiene las dimensiones y posición del zombi en la ventana
    const zombieRect = zombie.getBoundingClientRect();

    // Selecciona todos los elementos con la clase 'plant' en el DOM
    const plants = document.querySelectorAll('.plant');

    // Itera sobre cada planta para verificar si hay colisión
    plants.forEach(plant => {
        // Obtiene las dimensiones y posición de la planta en la ventana
        const plantRect = plant.getBoundingClientRect();

        // Comprueba si los rectángulos del zombi y la planta se superponen (colisión)
        if (
            zombieRect.left < plantRect.right &&
            zombieRect.right > plantRect.left &&
            zombieRect.top < plantRect.bottom &&
            zombieRect.bottom > plantRect.top
        ) {
            // --- Eliminar la planta y detener su disparo ---

            // Obtiene el ID del intervalo de disparo almacenado en el atributo 'data-shooterId' de la planta
            const shooterId = plant.dataset.shooterId;

            // Si existe un intervalo de disparo, lo detiene
            if (shooterId) {
                clearInterval(shooterId);
            }

            // Elimina la planta del DOM
            plant.remove();

            // El zombi continúa moviéndose después de destruir la planta
        }
    });
}

// --- Generar soles en ubicaciones aleatorias ---

// Función que genera un sol en una celda aleatoria del tablero
function generateSun() {
    // Selecciona una celda aleatoria del tablero
    const randomCell = gameBoard.children[
        Math.floor(Math.random() * gameBoard.children.length)
    ];

    // Crea un nuevo elemento 'div' que representará el sol
    const sun = document.createElement("div");

    // Añade la clase 'sun' al elemento para aplicarle estilos CSS
    sun.classList.add("sun");

    // Establece el contenido de texto del elemento como un emoji de sol para representarlo visualmente
    sun.textContent = "☀️";

    // Añade un evento de clic al sol que permitirá recolectarlo cuando el jugador haga clic en él
    sun.addEventListener("click", collectSun);

    // Añade el sol a la celda seleccionada en el tablero
    randomCell.appendChild(sun);
}

// --- Recolectar el sol al hacer clic ---

// Función que incrementa la cantidad de soles cuando el jugador hace clic en un sol
function collectSun(event) {
    // Incrementa la cantidad de soles del jugador en 10
    sunCount += 10;

    // Actualiza la visualización de la cantidad de soles en la interfaz
    updateSunCount();

    // Elimina el sol del DOM
    event.target.remove();
}

// --- Actualizar el contador de soles ---

// Función que actualiza la visualización de la cantidad de soles en la interfaz
function updateSunCount() {
    // Actualiza el elemento 'sunCountElement' en el DOM con el valor actual de 'sunCount'
    sunCountElement.textContent = sunCount;
}

// --- Seleccionar la planta para colocar ---

// Añade un evento de clic al botón de la planta que permite al jugador seleccionar la planta para colocar
plantButton.addEventListener("click", () => {
    // Establece la variable 'selectedPlant' como 'pea-plant', indicando que esta planta ha sido seleccionada
    selectedPlant = "pea-plant";
});

// --- Función para terminar el juego ---

// Función que finaliza el juego, ya sea porque el jugador ganó o perdió
function endGame(playerWon) {
    // --- Detener la generación de zombis y soles ---

    // Detiene el intervalo que genera zombis
    clearInterval(zombieSpawnInterval);

    // Detiene el intervalo que genera soles
    clearInterval(sunSpawnInterval);

    // --- Mostrar mensaje de fin del juego ---

    // Determina el mensaje a mostrar según si el jugador ganó o perdió
    const message = playerWon ? "¡Felicidades! Has ganado el juego." : "Game Over. Los zombis han invadido tu jardín.";

    // Muestra una alerta con el mensaje correspondiente
    alert(message);

    // --- Deshabilitar interacciones adicionales ---

    // Deselecciona cualquier planta que pudiera estar seleccionada
    selectedPlant = null;

    // Deshabilita el botón de selección de plantas para que no pueda ser usado
    plantButton.disabled = true;

    // --- Deshabilitar clicks en el tablero ---

    // Selecciona todas las celdas del tablero
    const cells = document.querySelectorAll('.cell');

    // Remueve el evento de clic de cada celda para que no se puedan colocar más plantas
    cells.forEach(cell => {
        cell.onclick = null;
    });

    // --- Deshabilitar recolección de soles ---

    // Selecciona todos los soles que aún estén en el tablero
    const suns = document.querySelectorAll('.sun');

    // Remueve el evento de clic de cada sol para que no puedan ser recolectados
    suns.forEach(sun => {
        sun.onclick = null;
    });
}

// --- Inicialización del juego ---

// Llama a la función para generar el tablero de juego
generateBoard();

// Inicia un intervalo que genera un zombi cada 5 segundos
zombieSpawnInterval = setInterval(spawnZombie, 5000);

// Inicia un intervalo que genera un sol cada 5 segundos
sunSpawnInterval = setInterval(generateSun, 5000);