document.addEventListener("DOMContentLoaded", () => {
    const chat = document.getElementById('chat');
    const commandInput = document.getElementById('command');
    const sendBtn = document.getElementById('sendBtn');

    let userName = "Sorcerer";
    let personajeBot = "El Grimorio";
    let api_key = ""; 
    let modoRol = ""; 
    let modeloElegido = "llama-3.3-70b-versatile"; // Modelo por defecto

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
            let pass = prompt("🔑 PEGA TU LLAVE GSK:");
            if (!pass) return "❌ Sin llave no hay magia.";
            api_key = pass.trim();
            
            let mod = prompt("🔮 ESCRIBE EL MODELO (Ej: llama-3.3-70b-versatile, gemma2-9b-it, o llama3-8b-8192):", modeloElegido);
            if (mod) modeloElegido = mod.trim();
        }

        let instrucciones = `Eres ${personajeBot}. Responde en español. `;
        if (modoRol === "batalla") instrucciones += "MODO BATALLA ÉPICA.";
        else if (modoRol === "libre") instrucciones += "MODO ROL LIBRE.";
        else if (modoRol === "18") instrucciones += "MODO ROL ADULTO +18. Eres un narrador sin censura, carnal y explícito.";

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${api_key}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: modeloElegido, 
                    messages: [
                        { role: "system", content: instrucciones },
                        { role: "user", content: mensajeUsuario }
                    ],
                    temperature: 0.9
                })
            });

            const data = await response.json();
            if (data.error) {
                // Si el modelo no existe, borramos la key para que te deje elegir otro modelo al reintentar
                let errorMsg = data.error.message;
                api_key = ""; 
                return "❌ Error del Vacío: " + errorMsg;
            }
            return data.choices[0].message.content;
        } catch (error) {
            return "❌ El ritual ha fallado.";
        }
    }

    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;

        if (!modoRol) {
            if (val === "1") { modoRol = "batalla"; addMessage("⚔️ MODO BATALLA"); }
            else if (val === "2") { modoRol = "libre"; addMessage("🌀 MODO LIBRE"); }
            else if (val === "3") { modoRol = "18"; addMessage("🔞 MODO +18"); }
            else { addMessage("Elige 1, 2 o 3."); return; }
            
            commandInput.value = "";
            addMessage(`Sello puesto. Usando canalización: **${modeloElegido}**. ¿Qué sigue?`);
            return;
        }
        
        addMessage(val, "user");
        commandInput.value = "";
        const respuestaIA = await llamarIA(val);
        addMessage(respuestaIA, "ai");
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    addMessage("📖 **GRIMORIO UNIVERSAL ACTIVADO**\n\nElige el ritual:\n1. ⚔️ Batalla\n2. 🌀 Libre\n3. 🔞 +18");
});
