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
            let pass = prompt("🔑 PEGA TU LLAVE (gsk_...):");
            if (!pass) return "❌ El libro se cierra. Necesito la llave.";
            api_key = pass.trim(); // Esto borra espacios accidentales
        }

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${api_key}`, // IMPORTANTE: Espacio después de Bearer
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: `Eres ${personajeBot}. Responde en español de forma mística. El usuario es ${userName}.` },
                        { role: "user", content: mensajeUsuario }
                    ]
                })
            });

            const data = await response.json();
            
            if (data.error) {
                // Si la llave sigue fallando, borramos la guardada para pedirla de nuevo
                api_key = ""; 
                return "❌ Error de la llave: " + data.error.message;
            }

            return data.choices[0].message.content;
            
        } catch (error) {
            return "❌ Fallo en la conexión astral.";
        }
    }

    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;
        addMessage(val, "user");
        commandInput.value = "";

        const cargando = document.createElement('div');
        cargando.className = 'message ai';
        cargando.innerHTML = "<em>⚡ La Fuerza Mística está pensando...</em>";
        chat.appendChild(cargando);

        const respuestaIA = await llamarIA(val);
        chat.lastChild.remove(); 
        addMessage(respuestaIA, "ai", personajeBot);
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    addMessage("📖 **INTENTO FINAL DE CONEXIÓN**\nEscribe algo y pega tu llave `gsk_` con cuidado.");
});
