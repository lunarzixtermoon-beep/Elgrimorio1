document.addEventListener("DOMContentLoaded", () => {
    const chat = document.getElementById('chat');
    const commandInput = document.getElementById('command');
    const sendBtn = document.getElementById('sendBtn');

    let userName = "Sorcerer";
    let personajeBot = "El Grimorio";
    let api_key = ""; // Esta se pedirá al usuario

    // Función para mostrar mensajes en pantalla
    function addMessage(text, type = "ai", customName = null) {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        let nombre = (type === "user") ? `👤 ${userName}` : `📖 ${customName || personajeBot}`;
        div.innerHTML = `<strong>${nombre}:</strong><br>${text.replace(/\n/g, '<br>')}`;
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
    }

    // --- FUNCIÓN QUE CONECTA CON LA IA ---
    async function llamarIA(mensajeUsuario) {
        // Si no hay llave, pedirla
        if (!api_key) {
            api_key = prompt("🔑 Introduce tu API KEY (la que empieza por AIza...):");
            if (!api_key) return "❌ No puedo despertar sin la llave de poder.";
        }

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${api_key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ 
                        parts: [{ 
                            text: `Actúa como ${personajeBot}. Instrucciones: Eres un ente mágico que vive en un libro. Responde siempre en español, de forma inmersiva y con personalidad. El usuario se llama ${userName}. Mensaje del usuario: ${mensajeUsuario}` 
                        }] 
                    }]
                })
            });
            
            const data = await response.json();
            if (data.error) return "❌ Error de llave: " + data.error.message;
            return data.candidates[0].content.parts[0].text;
            
        } catch (error) {
            console.error(error);
            return "❌ El ritual falló. Revisa tu conexión o la llave.";
        }
    }

    // --- PROCESAR LO QUE ESCRIBES ---
    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;
        
        addMessage(val, "user");
        commandInput.value = "";
        const b = val.toLowerCase();

        // COMANDOS RÁPIDOS (No usan IA)
        if (b.startsWith("transformate en")) {
            personajeBot = val.split(/transformate en/i)[1].trim();
            addMessage(`✨ *El papel cruje y la tinta se reordena...*\nAhora soy **${personajeBot}**.`, "ai");
        } else if (b.includes("mi nombre:")) {
            userName = val.split(":")[1].trim();
            addMessage(`Reconocido. Saludos, **${userName}**.`, "ai");
        } else if (b === "retroceder") {
            chat.innerHTML = "";
            bienvenida();
        } 
        // RESPUESTA CON IA
        else {
            addMessage("... *El Grimorio está pensando* ...", "ai", "Sistema");
            const respuestaIA = await llamarIA(val);
            // Borrar el mensaje de "pensando" y poner el real
            chat.lastChild.remove(); 
            addMessage(respuestaIA, "ai", personajeBot);
        }
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    function bienvenida() {
        addMessage("📖 **EL GRIMORIO HA DESPERTADO**\n\nUsa `mi nombre: [tu nombre]` para presentarte.\nUsa `Transformate en [personaje]` para que cambie mi esencia.\n\nEscribe cualquier cosa para que la inteligencia del libro te responda.");
    }

    bienvenida();
});
