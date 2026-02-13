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
            let pass = prompt("🔑 PEGA TU LLAVE GRATUITA DE GROQ (gsk_...):");
            if (!pass) return "❌ Sin la llave gsk, la magia no fluye.";
            api_key = pass.trim();
        }

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${api_key}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile", // El modelo más potente y gratuito de Groq
                    messages: [
                        { role: "system", content: `Eres ${personajeBot}. Responde en español de forma mística y épica. El usuario es el hechicero ${userName}.` },
                        { role: "user", content: mensajeUsuario }
                    ]
                })
            });

            const data = await response.json();
            if (data.error) {
                api_key = ""; // Reset si la llave falla
                return "❌ Error de Groq: " + data.error.message;
            }
            return data.choices[0].message.content;
            
        } catch (error) {
            return "❌ Fallo en la invocación. Revisa la llave gsk.";
        }
    }

    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;
        addMessage(val, "user");
        commandInput.value = "";

        const cargando = document.createElement('div');
        cargando.className = 'message ai';
        cargando.innerHTML = "<em>⚡ Invocando fuerza mística gratuita...</em>";
        chat.appendChild(cargando);

        const respuestaIA = await llamarIA(val);
        chat.lastChild.remove(); 
        addMessage(respuestaIA, "ai", personajeBot);
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    addMessage("📖 **GRIMORIO ESTABLE ACTIVADO**\nUsa tu llave `gsk_` para empezar sin pagar un solo centavo.");
});
