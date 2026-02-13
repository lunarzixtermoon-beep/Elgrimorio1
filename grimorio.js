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
            let pass = prompt("🔑 PEGA TU API KEY DE GEMINI (AIza...):");
            if (!pass) return "❌ Sin la llave de Google, el libro no abre.";
            api_key = pass.trim();
        }

        try {
            // RUTA ESTABLE V1 PARA EVITAR EL ERROR DE "NOT FOUND"
            const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${api_key}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ 
                        parts: [{ 
                            text: `Eres ${personajeBot}. Instrucciones: Responde en español, de forma mística. El usuario es ${userName}. Mensaje: ${mensajeUsuario}` 
                        }] 
                    }]
                })
            });
            
            const data = await response.json();

            if (data.error) {
                api_key = ""; // Reset para reintentar
                return "❌ Error de Gemini: " + data.error.message;
            }

            return data.candidates[0].content.parts[0].text;
            
        } catch (error) {
            return "❌ Fallo en la conexión con los servidores de Google.";
        }
    }

    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;
        addMessage(val, "user");
        commandInput.value = "";

        const cargando = document.createElement('div');
        cargando.className = 'message ai';
        cargando.innerHTML = "<em>📖 Gemini está leyendo las estrellas...</em>";
        chat.appendChild(cargando);

        const respuestaIA = await llamarIA(val);
        chat.lastChild.remove(); 
        addMessage(respuestaIA, "ai", personajeBot);
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    addMessage("📖 **RETORNANDO AL PODER DE GEMINI**\nEscribe algo y usa tu llave `AIza...`.");
});
