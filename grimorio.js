const chat = document.getElementById('chat');
const commandInput = document.getElementById('command');

let userName = "Aventurero";
let extras = [];
let modoActual = null;

// Personajes con imágenes predefinidas
const personajes = {
  "Riolu": "https://i.imgur.com/H8vR7zO.png",
  "Pikachu": "https://i.imgur.com/WVg5NxR.png",
  "Zeraora": "https://i.imgur.com/qpMB9zX.png",
  "Lucario": "https://i.imgur.com/r0eRNR1.png",
  "Eevee": "https://i.imgur.com/fXk2I3a.png"
};

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

// Mensaje de bienvenida automático
addMessage(`✨ Bienvenido ${userName} al Grimorio de las Mil Almas.
Comandos: mi nombre, retroceder, Transformate en [personaje], Crear trama con [personaje] y [extra].`);

// Función que interpreta los comandos
function sendCommand() {
  const text = commandInput.value.trim();
  if(!text) return;
  addMessage(text, "user");
  
  const b = text.toLowerCase();

  if(b.startsWith("mi nombre")) {
    const nuevo = text.split("mi nombre")[1]?.trim();
    if(nuevo) userName = nuevo;
    addMessage(`Tu nombre es ahora: ${userName}`);
  }
  else if(b === "retroceder") {
    userName = "Aventurero";
    extras = [];
    modoActual = null;
    addMessage("El Grimorio ha sido reiniciado. Bienvenido de nuevo.");
  }
  else if(b.startsWith("transformate en")) {
    const nombre = text.split("transformate en")[1]?.trim();
    if(personajes[nombre]) {
      addMessage(`✨ Te transformas en ${nombre}`, "ai", personajes[nombre]);
    } else {
      addMessage(`No se encontró el personaje ${nombre}.`);
    }
  }
  else if(b.startsWith("crear trama con")) {
    const partes = text.split(/ y | con /i);
    const principal = partes[1]?.trim();
    const extra = partes[2]?.trim();
    if(principal && extra) {
      addMessage(`🌌 La historia de ${principal} se une con ${extra}.`);
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
