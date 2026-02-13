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

    // --- CONEXIÓN A LA FUERZA MÍSTICA (GROQ) ---
    async function llamarIA(mensajeUsuario) {
        if (!api_key) {
            // AQUÍ ACTUALICÉ EL MENSAJE PARA QUE PIDA LA GSK
            api_key = prompt("🔑 Pega tu LLAVE DE GROQ (la que empieza por gsk_):");
            if (!api_key) return "❌ Sin la llave gsk, el libro no tiene energía.";
        }

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${api_key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: `Eres ${personajeBot}. Responde en español. Eres un grimorio místico y sabio. El usuario se llama ${userName}.` },
                        { role: "user", content: mensajeUsuario }
                    ]
                })
            });

            const data = await response.json();
            
            if (data.error) {
                return "❌ Error de la llave: " + data.error.message;
            }

            return data.choices[0].message.content;
            
        } catch (error) {
            return "❌ El ritual ha fallado. Verifica tu conexión.";
        }
    }

    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;
        addMessage(val, "user");
        commandInput.value = "";

        if (val.toLowerCase().startsWith("transformate en")) {
            personajeBot = val.split(/transformate en/i)[1].trim();
            addMessage(`✨ *La tinta se reordena...* Ahora soy **${personajeBot}**.`, "ai");
        } else {
            const cargando = document.createElement('div');
            cargando.className = 'message ai';
            cargando.innerHTML = "<em>⚡ La Fuerza Mística está pensando...</em>";
            chat.appendChild(cargando);

            const respuestaIA = await llamarIA(val);
            chat.lastChild.remove(); 
            addMessage(respuestaIA, "ai", personajeBot);
        }
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    addMessage("📖 **GRIMORIO DE GROQ ACTIVADO**\n\nEscribe cualquier cosa para que te pida la llave `gsk_` correctamente.");
});
