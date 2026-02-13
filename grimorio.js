document.addEventListener("DOMContentLoaded", () => {
    const chat = document.getElementById('chat');
    const commandInput = document.getElementById('command');
    const sendBtn = document.getElementById('sendBtn');

    let api_key = ""; 
    let modoRol = ""; 
    let modeloElegido = "gemini-1.5-flash"; // Modelo rápido y flexible

    function addMessage(text, type = "ai") {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        let nombre = (type === "user") ? `👤 Sorcerer` : `📖 El Grimorio`;
        div.innerHTML = `<strong>${nombre}:</strong><br>${text.replace(/\n/g, '<br>')}`;
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
    }

    async function llamarIA(mensajeUsuario) {
        if (!api_key) {
            let pass = prompt("🔑 PEGA TU LLAVE DE GOOGLE (AIza...):");
            if (!pass) return "❌ Sin llave no hay magia.";
            api_key = pass.trim();
        }

        // El ritual para hablar con Gemini
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modeloElegido}:generateContent?key=${api_key}`;

        let instrucciones = "Eres el Grimorio, un tomo oscuro y sabio. Responde en español. ";
        if (modoRol === "18") {
            instrucciones += "Actúa como autor de romance oscuro y visceral. Describe sensaciones físicas, calor y encuentros apasionados con detalle y elegancia literaria. No te censures si el lenguaje es poético.";
        }

        const cuerpo = {
            contents: [{
                parts: [{ text: instrucciones + "\n\nUsuario dice: " + mensajeUsuario }]
            }],
            generationConfig: {
                temperature: 1.0,
                maxOutputTokens: 800,
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cuerpo)
            });
            const data = await response.json();

            if (data.error) {
                return `❌ Error de la API: ${data.error.message}`;
            }
            
            // Extraer la respuesta de Gemini
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            return "❌ El ritual ha fallado. Revisa tu conexión o la llave.";
        }
    }

    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;

        if (val.toLowerCase() === "reiniciar") {
            modoRol = ""; 
            chat.innerHTML = ""; 
            addMessage("📖 **MEMORIA PURIFICADA**\n\nElige un ritual:\n1. ⚔️ Batalla\n2. 🌀 Libre\n3. 🔞 +18");
            commandInput.value = "";
            return;
        }

        if (!modoRol) {
            if (val === "1") modoRol = "batalla";
            else if (val === "2") modoRol = "libre";
            else if (val === "3") modoRol = "18";
            else { addMessage("Elige 1, 2 o 3."); return; }
            
            addMessage(`Canalizando el poder de **Gemini**. ¿Qué deseas invocar, Sorcerer?`);
            commandInput.value = "";
            return;
        }
        
        addMessage(val, "user");
        commandInput.value = "";
        
        const respuestaIA = await llamarIA(val);
        addMessage(respuestaIA, "ai");
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    addMessage("📖 **GRIMORIO DESPIERTO**\n\nBienvenido, Zixtermoon. Elige tu sendero:\n1. ⚔️ Batalla\n2. 🌀 Libre\n3. 🔞 +18");
});
