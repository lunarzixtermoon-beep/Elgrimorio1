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
            api_key = prompt("🔑 Pega tu API KEY aquí (la que empieza por AIza...):");
            if (!api_key) return "❌ Sin la llave no hay vida.";
        }

        try {
            // Probamos con 'gemini-pro', que es el nombre más universal y aceptado
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${api_key}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ 
                        parts: [{ 
                            text: `Eres ${personajeBot}. Responde en español de forma épica. El usuario es ${userName}. Mensaje: ${mensajeUsuario}` 
                        }] 
                    }]
                })
            });
            
            const data = await response.json();

            if (data.error) {
                // Si 'gemini-pro' falla, el Grimorio nos dirá el motivo real
                return "❌ El Grimorio dice: " + data.error.message;
            }

            return data.candidates[0].content.parts[0].text;
            
        } catch (error) {
            return "❌ Error de conexión mística.";
        }
    }

    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;
        addMessage(val, "user");
        commandInput.value = "";

        if (val.toLowerCase().startsWith("transformate en")) {
            personajeBot = val.split(/transformate en/i)[1].trim();
            addMessage(`✨ *El libro cambia su forma...* Ahora soy **${personajeBot}**.`, "ai");
        } else {
            const cargando = document.createElement('div');
            cargando.className = 'message ai';
            cargando.innerHTML = "<em>📖 El libro está escribiendo...</em>";
            chat.appendChild(cargando);

            const respuestaIA = await llamarIA(val);
            chat.lastChild.remove(); 
            addMessage(respuestaIA, "ai", personajeBot);
        }
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    addMessage("📖 **GRIMORIO NIVEL PRO ACTIVADO**\nEscribe cualquier cosa para probar.");
});
