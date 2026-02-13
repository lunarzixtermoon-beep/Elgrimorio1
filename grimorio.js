// =======================================
// 📖 GRIMORIO DE LAS MIL ALMAS - VERSIÓN ABIERTA
// =======================================

const chat = document.getElementById('chat');
const commandInput = document.getElementById('command');

let userName = "Aventurero";
let modoActual = null;
let personajesActivos = [];
let extras = [];

// Función para mostrar mensaje
function addMessage(text, type="ai", img=null) {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.innerHTML = `<strong>${type === "ai" ? "Grimorio" : userName}:</strong> ${text}`;
  if(img) {
    const image = document.createElement('img');
    image.src = img;
    div.appendChild(image);
  }
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// Mensaje de bienvenida
function mostrarBienvenida() {
  modoActual = null;
  personajesActivos = [];
  extras = [];
  addMessage(
`📖 EL GRIMORIO DE LAS MIL ALMAS 📖
El libro místico flota frente a ti…
Sus páginas brillan esperando tu decisión para desatar su poder.
✨ PASO 1: ELIGE TU DESTINO
A) Rol Libre 🗡️ → Narrativa libre, explora y habla sin límites.
B) Batallas ⚔️ → Enfrenta combates épicos.
C) Sexrol 🔥 → Historia adulta, pasión y deseo.
Escribe la letra de la opción que quieras activar.
✨ PASO 2: INVOCACIÓN
Transformate en [personaje] → Ejemplo: Transformate en Riolu
Crear trama con [personaje] y [extra] → Ejemplo: Crear trama con Riolu y Pikachu
📜 COMANDOS
mi nombre → Cambiar tu nombre
retroceder → Reinicia todo
nombre bot → Cambiar nombre del Grimorio
nombre extra → Cambiar nombres de personajes añadidos
forma extra → Cambiar avatar de personajes añadidos`
  );
}

// Ejecutar bienvenida al cargar
mostrarBienvenida();

// Función que interpreta los comandos
function sendCommand() {
  const text = commandInput.value.trim();
  if(!text) return;
  addMessage(text, "user");
  
  const b = text.toLowerCase();

  // ---------------------------------
  // Modo
  // ---------------------------------
  if(b === "a") {
    modoActual = "rol";
    addMessage("✅ Modo Rol Libre 🗡️ activado.");
  } else if(b === "b") {
    modoActual = "batalla";
    addMessage("✅ Modo Batallas ⚔️ activado.");
  } else if(b === "c") {
    modoActual = "sexrol";
    addMessage("🔥 Modo Sexrol activado.");
  }

  // ---------------------------------
  // Comandos de usuario
  // ---------------------------------
  else if(b.startsWith("mi nombre")) {
    const nuevo = text.substring(9).trim();
    if(nuevo) userName = nuevo;
    addMessage(`Tu nombre es ahora: ${userName}`);
  }
  else if(b === "retroceder") {
    mostrarBienvenida();
  }

  // ---------------------------------
  // Invocar personaje libre
  // ---------------------------------
  else if(b.startsWith("transformate en")) {
    const nombre = text.substring(15).trim();
    const nombreCap = nombre.charAt(0).toUpperCase() + nombre.slice(1);
    let avatar = null;

    // Preguntar si el usuario quiere poner URL manual
    if(nombre.includes("http")) {
      avatar = nombre;
    }

    personajesActivos.push({ nombre: nombreCap, avatar: avatar });
    
    addMessage(`✨ ${nombreCap} aparece frente a ti.`, "ai", avatar);
    
    // Respuesta de rol según modo
    let estilo = modoActual === "rol" ? "Explora y habla libremente." :
                 modoActual === "batalla" ? "Se prepara para combatir." :
                 modoActual === "sexrol" ? "Se mueve con pasión y deseo." :
                 "Está atento a tu comando.";

    addMessage(`${nombreCap} dice: "${estilo}"`);
  }

  // ---------------------------------
  // Crear trama entre personajes libres
  // ---------------------------------
  else if(b.startsWith("crear trama con")) {
    const partes = text.substring(17).split(/ y | con /i).map(s => s.trim());
    if(partes.length === 2) {
      const p1 = partes[0].charAt(0).toUpperCase() + partes[0].slice(1);
      const p2 = partes[1].charAt(0).toUpperCase() + partes[1].slice(1);
      const avatar1 = personajesActivos.find(p => p.nombre === p1)?.avatar || null;
      const avatar2 = personajesActivos.find(p => p.nombre === p2)?.avatar || null;

      addMessage(`🌌 Una historia se une entre ${p1} y ${p2}!`);
      addMessage(`${p1} dice: "Estamos juntos en esta aventura."`, "ai", avatar1);
      addMessage(`${p2} responde: "¡Listo para lo que venga!"`, "ai", avatar2);
    } else {
      addMessage("Formato incorrecto. Usa: Crear trama con [personaje] y [extra]");
    }
  }

  else {
    addMessage("Comando no reconocido.");
  }

  commandInput.value = "";
  commandInput.focus();
}
