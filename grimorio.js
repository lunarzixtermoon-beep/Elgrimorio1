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

    // --- EL CORAZÓN DE GROQ (FUERZA MÍSTICA) ---
    async function llamarIA(mensajeUsuario) {
        if (!api_key) {
            api_key = prompt("🔑 Pega tu nueva LLAVE MÍSTICA (gsk_...):");
            if (!api_key) return "❌ El libro permanece cerrado sin su llave.";
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
                        { 
                            role: "system", 
                            content: `Eres ${personajeBot}. Instrucciones: Responde siempre en español. Eres un grimorio místico, sabio y con un toque oscuro. El usuario es ${userName}.` 
                        },
                        { role: "user", content: mensajeUsuario }
                    ],
                    temperature: 0.8
                })
            });

            const data = await response.json();
            if (data.error) return "❌ Error de conexión: " + data.error.message;
            return data.choices[0].message.content;
            
        } catch (error) {
            return "❌ El ritual de invocación ha fallado. Revisa tu llave.";
        }
    }

    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;
        
        addMessage(val, "user");
        commandInput.value = "";
        const b = val.toLowerCase();

        // COMANDOS RÁPIDOS
        if (b.startsWith("transformate en")) {
            personajeBot = val.split(/transformate en/i)[1].trim();
            addMessage(`✨ *Las páginas crujen...* Ahora soy **${personajeBot}**.`, "ai");
        } else if (b.includes("mi nombre:")) {
            userName = val.split(":")[1].trim();
            addMessage(`Reconocido. Saludos, Hechicero **${userName}**.`, "ai");
        } 
        // RESPUESTA DE IA REAL
        else {
            const cargando = document.createElement('div');
            cargando.className = 'message ai';
            cargando.innerHTML = "<em>⚡ La Fuerza Mística está procesando...</em>";
            chat.appendChild(cargando);

            const respuestaIA = await llamarIA(val);
            chat.lastChild.remove(); 
            addMessage(respuestaIA, "ai", personajeBot);
        }
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    addMessage("📖 **EL GRIMORIO HA DESPERTADO CON PODER DE GROQ**\n\nUsa `mi nombre: [nombre]` para presentarte.\nEscribe cualquier cosa para activar la IA.");
});
