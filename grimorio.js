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
            let pass = prompt("🔑 PEGA TU LLAVE GSK AQUÍ:");
            if (!pass) return "❌ No hay llave, no hay magia.";
            // Limpieza absoluta de espacios y caracteres invisibles
            api_key = pass.trim().replace(/[\u200B-\u200D\uFEFF]/g, ""); 
        }

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${api_key}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: `Eres ${personajeBot}. Responde en español como un grimorio mágico. El usuario es ${userName}.` },
                        { role: "user", content: mensajeUsuario }
                    ]
                })
            });

            const data = await response.json();
            
            if (data.error) {
                let errorMsg = data.error.message;
                api_key = ""; // Resetear para poder intentar de nuevo
                return `❌ Error de la llave: ${errorMsg}. (Asegúrate que empiece por gsk_)`;
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
        if (chat.lastChild && chat.lastChild.innerHTML.includes("pensando")) {
            chat.lastChild.remove(); 
        }
        addMessage(respuestaIA, "ai", personajeBot);
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    addMessage("📖 **SISTEMA REINICIADO**\nEscribe algo para probar tu nueva llave `gsk_`.");
});
