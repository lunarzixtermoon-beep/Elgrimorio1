const chat = document.getElementById('chat');
const commandInput = document.getElementById('command');

let userName = "Sorcerer";
let modoActual = null;
let personajesActivos = [];

// Escuchar la tecla Enter
commandInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendCommand();
});

function addMessage(text, type="ai", img=null) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    
    let header = type === "ai" ? "📖 El Grimorio" : `👤 ${userName}`;
    div.innerHTML = `<strong>${header}:</strong><br>${text}`;
    
    if(img) {
        const image = document.createElement('img');
        image.src = img;
        div.appendChild(image);
    }
    
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function mostrarBienvenida() {
    modoActual = null;
    personajesActivos = [];
    chat.innerHTML = ""; // Limpia la pantalla
    addMessage(
`✨ BIENVENIDO, SORCERER ✨
El libro místico flota frente a ti...

PASO 1: ELIGE TU DESTINO
[A] Rol Libre 🗡️ | [B] Batallas ⚔️ | [C] Sexrol 🔥

PASO 2: INVOCACIÓN
- Transformate en [nombre]
- Crear trama con [P1] y [P2]

COMANDOS:
- mi nombre [nuevo]
- retroceder`
    );
}

function sendCommand() {
    const text = commandInput.value.trim();
    if(!text) return;
    
    const b = text.toLowerCase();
    addMessage(text, "user");

    if(b === "a") { modoActual = "rol"; addMessage("✅ Modo Rol Libre 🗡️ activado."); }
    else if(b === "b") { modoActual = "batalla"; addMessage("✅ Modo Batallas ⚔️ activado."); }
    else if(b === "c") { modoActual = "sexrol"; addMessage("🔥 Modo Sexrol activado."); }
    else if(b.startsWith("mi nombre")) {
        userName = text.substring(9).trim() || "Sorcerer";
        addMessage(`Tu nombre es ahora: ${userName}`);
    }
    else if(b === "retroceder") { mostrarBienvenida(); }
    else if(b.startsWith("transformate en")) {
        const nombre = text.substring(15).trim();
        const nombreCap = nombre.charAt(0).toUpperCase() + nombre.slice(1);
        
        // Simulación de imagen (puedes poner una API real aquí luego)
        addMessage(`✨ Transmutando... imbuyendo la esencia de ${nombreCap}.`);
        addMessage(`*${nombreCap} emerge de las páginas.*`, "ai");
    } 
    else {
        addMessage("El Grimorio no reconoce ese hechizo...", "ai");
    }

    commandInput.value = "";
}

mostrarBienvenida();
