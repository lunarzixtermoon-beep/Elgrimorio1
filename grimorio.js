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

    // --- CONEXIÓN AL PODER DE OPENAI (CHATGPT) ---
    async function llamarIA(mensajeUsuario) {
        if (!api_key) {
            let pass = prompt("🔑 PEGA TU LLAVE DE CHATGPT (sk-...):");
            if (!pass) return "❌ El libro se cierra. Se requiere la llave sk.";
            api_key = pass.trim();
        }

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${api_key}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { 
                            role: "system", 
                            content: `Eres ${personajeBot}. Responde siempre en español. Eres un grimorio antiguo y místico. El usuario es el hechicero ${userName}.` 
                        },
                        { role: "user", content: mensajeUsuario }
                    ],
                    temperature: 0.8
                })
            });

            const data = await response.json();
            
            if (data.error) {
                // Si hay error (como falta de saldo), reseteamos la llave para dejarte intentar de nuevo
                let msg = data.error.message;
                api_key = ""; 
                return "❌ Error de OpenAI: " + msg;
            }

            return data.choices[0].message.content;
            
        } catch (error) {
            return "❌ El ritual ha fallado. Revisa tu conexión al vacío.";
        }
    }

    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;
        
        addMessage(val, "user");
        commandInput.value = "";

        const cargando = document.createElement('div');
        cargando.className = 'message ai';
        cargando.innerHTML = "<em>📖 Consultando los planos astrales de OpenAI...</em>";
        chat.appendChild(cargando);

        const respuestaIA = await llamarIA(val);
        chat.lastChild.remove(); 
        addMessage(respuestaIA, "ai", personajeBot);
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    addMessage("📖 **GRIMORIO VINCULADO A CHATGPT**\nEscribe un mensaje para activar el sello.");
});
