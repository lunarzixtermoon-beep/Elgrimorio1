document.addEventListener("DOMContentLoaded", () => {
    const chat = document.getElementById('chat');
    const commandInput = document.getElementById('command');
    const sendBtn = document.getElementById('sendBtn');

    let userName = "Sorcerer";
    let personajeBot = "El Grimorio";
    let api_key = ""; 

    function addMessage(text, type = "ai", customName = null) {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        let nombre = (type === "user") ? `👤 ${userName}` : `📖 ${customName || personajeBot}`;
        div.innerHTML = `<strong>${nombre}:</strong><br>${text.replace(/\n/g, '<br>')}`;
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
    }

    async function llamarIA(mensajeUsuario) {
        if (!api_key) {
            api_key = prompt("🔑 Introduce tu API KEY (la que empieza por AIza...):");
            if (!api_key) return "❌ Sin llave no hay magia.";
        }

        try {
            // RUTA FORZADA A V1 ESTABLE - SIN BETA
            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${api_key}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ 
                        parts: [{ 
                            text: `Actúa como ${personajeBot}. Instrucciones: Responde siempre en español. El usuario se llama ${userName}. Mensaje: ${mensajeUsuario}` 
                        }] 
                    }]
                })
            });
            
            const data = await response.json();

            if (data.error) {
                // Si el error persiste, es probable que la API Key sea de una región restringida o el modelo tenga otro nombre en tu cuenta
                return "❌ Error del Grimorio: " + data.error.message;
            }

            if (data.candidates && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                return "❌ El libro brilla pero no salen palabras... (Error de respuesta)";
            }
            
        } catch (error) {
            return "❌ El ritual falló por un problema de conexión.";
        }
    }

    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;
        
        addMessage(val, "user");
        commandInput.value = "";
        const b = val.toLowerCase();

        if (b.startsWith("transformate en")) {
            personajeBot = val.split(/transformate en/i)[1].trim();
            addMessage(`✨ *Las páginas brillan...* Ahora soy **${personajeBot}**.`, "ai");
        } else if (b.includes("mi nombre:")) {
            userName = val.split(":")[1].trim();
            addMessage(`Reconocido. Saludos, Hechicero **${userName}**.`, "ai");
        } else if (b === "retroceder") {
            chat.innerHTML = "";
            bienvenida();
        } 
        else {
            const cargando = document.createElement('div');
            cargando.className = 'message ai';
            cargando.innerHTML = "<em>📖 El libro está escribiendo...</em>";
            chat.appendChild(cargando);

            const respuestaIA = await llamarIA(val);
            if (chat.lastChild && chat.lastChild.innerHTML.includes("escribiendo")) {
                chat.lastChild.remove(); 
            }
            addMessage(respuestaIA, "ai", personajeBot);
        }
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    function bienvenida() {
        addMessage("📖 **EL GRIMORIO HA DESPERTADO**\n\nUsa `mi nombre: [tu nombre]` y `Transformate en [personaje]`.\n\nEscribe cualquier cosa para hablar con la inteligencia.");
    }

    bienvenida();
});
