One Piece Wordle
Descripción
One Piece Wordle es una aplicación de una sola página (SPA) desarrollada con React que combina la mecánica del popular juego Wordle con el universo de One Piece. El objetivo del juego es adivinar el personaje secreto del día en un máximo de seis intentos, utilizando pistas basadas en atributos como afiliación, recompensa, fruta del diablo y tipo de haki.

Este proyecto fue desarrollado como parte de una evaluación de desarrollo front-end, demostrando el uso de componentes React, consumo de APIs, hooks avanzados y persistencia de datos.

Características Principales
Adivinanza de personajes de One Piece con retroalimentación visual por atributos

Sistema de pistas progresivas que se desbloquean según los intentos realizados

Persistencia de partidas mediante localStorage

Estadísticas de juego (victorias, rachas, partidas jugadas)

Alternancia entre tema claro y oscuro

Soporte para teclado físico y teclado virtual en pantalla

Interfaz responsiva para dispositivos móviles y de escritorio


Guía de Instalación y Ejecución
Prerrequisitos
Node.js (versión 18 o superior)

npm (incluido con Node.js)

Pasos de Instalación
Clonar el repositorio

bash
git clone https://github.com/tu-usuario/one-piece-wordle.git
cd one-piece-wordle
Instalar las dependencias

bash
npm install
Iniciar el servidor de desarrollo

bash
npm run dev
Abrir la aplicación en el navegador

La aplicación estará disponible en http://localhost:5173

Mecánica del Juego
Objetivo
Adivinar el personaje secreto de One Piece en un máximo de seis intentos.

Reglas
El jugador debe ingresar el nombre de un personaje de One Piece en cada intento

El sistema compara cinco atributos del personaje ingresado con el personaje secreto:

Nombre completo

Afiliación (tripulación u organización)

Recompensa en berries

Fruta del Diablo (si aplica)

Tipo de Haki (si aplica)

Cada atributo recibe una retroalimentación visual:

Color verde: Coincidencia exacta

Color amarillo: Coincidencia parcial

Color gris: Sin coincidencia

El juego finaliza cuando el jugador acierta todos los atributos o agota los seis intentos

Sistema de Pistas
El sistema de pistas se desbloquea progresivamente según los intentos realizados:

Intentos	Pista Disponible
0	Afiliación del personaje
2 o más	Fruta del Diablo
3 o más	Recompensa en berries
4 o más	Tipo de Haki
5 o más	Descripción del personaje
Persistencia de Datos
La aplicación utiliza dos mecanismos de persistencia:

LocalStorage
Partida actual: Se guarda automáticamente después de cada intento

Estadísticas del jugador: Victorias, derrotas, racha actual y racha máxima

Preferencia de tema: Claro u oscuro

Cookies
Preferencia de tema: Almacenada con expiración de 30 días

