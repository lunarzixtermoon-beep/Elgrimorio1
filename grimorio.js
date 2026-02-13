document.addEventListener("DOMContentLoaded", () => {
    const chat = document.getElementById('chat');
    const commandInput = document.getElementById('command');
    const sendBtn = document.getElementById('sendBtn');

    let userName = "Sorcerer";
    let personajeBot = "El Grimorio";
    let api_key = ""; 
    let modoRol = ""; 
    let modeloElegido = "llama-3.3-70b-versatile"; 

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
            
            let mod = prompt("🔮 MODELO ACTUAL:", modeloElegido);
            if (mod) modeloElegido = mod.trim();
        }

        let instrucciones = `Eres ${personajeBot}, un tomo mágico sensible y oscuro. Responde siempre en español. `;
        if (modoRol === "batalla") {
            instrucciones += "MODO BATALLA ÉPICA. Describe la violencia, la sangre y el poder con brutalidad estética.";
        } else if (modoRol === "18") {
            instrucciones += "MODO CRÓNICA OSCURA ADULTA. Eres un narrador de fantasía erótica visceral. Describe sensaciones físicas, calor, piel, deseos primitivos e instintos animales sin censura y con gran detalle literario.";
        }

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
                    temperature: 1.1 
                })
            });

            const data = await response.json();
            if (data.error) {
                if(data.error.message.includes("decommissioned")) {
                    return "❌ El modelo ha muerto. Escribe 'reiniciar' y elige uno nuevo como 'llama-3.3-70b-versatile'.";
                }
                return "❌ Error del Vacío: " + data.error.message;
            }
            return data.choices[0].message.content;
        } catch (error) {
            return "❌ El ritual ha fallado por un error de conexión.";
        }
    }

    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;

        // --- HECHIZO DE REINICIO ---
        if (val.toLowerCase() === "reiniciar") {
            modoRol = ""; 
            commandInput.value = "";
            chat.innerHTML = ""; 
            addMessage("📖 **MEMORIA PURIFICADA**\n\nElige un nuevo ritual:\n1. ⚔️ Batalla\n2. 🌀 Libre\n3. 🔞 +18\n\n(Escribe 1, 2 o 3)");
            return;
        }

        if (!modoRol) {
            if (val === "1") { modoRol = "batalla"; addMessage("⚔️ MODO BATALLA"); }
            else if (val === "2") { modoRol = "libre"; addMessage("🌀 MODO LIBRE"); }
            else if (val === "3") { modoRol = "18"; addMessage("🔞 MODO +18"); }
            else { addMessage("Por favor, elige un ritual: 1, 2 o 3."); return; }
            
            commandInput.value = "";
            addMessage(`Canalizando el poder de: **${modeloElegido}**. ¿Qué deseas invocar ahora, mi Hechicero?`);
            return;
        }
        
        addMessage(val, "user");
        commandInput.value = "";
        
        const cargando = document.createElement('div');
        cargando.className = 'message ai';
        cargando.innerHTML = "<em>⚡ El Grimorio está escribiendo...</em>";
        chat.appendChild(cargando);
        chat.scrollTop = chat.scrollHeight;

        const respuestaIA = await llamarIA(val);
        chat.lastChild.remove(); 
        addMessage(respuestaIA, "ai");
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    addMessage("📖 **GRIMORIO UNIVERSAL ACTIVO**\n\nBienvenido, Zixtermoon. Elige tu sendero:\n1. ⚔️ Batalla\n2. 🌀 Libre\n3. 🔞 +18\n\n*(Escribe 'reiniciar' en cualquier momento para volver aquí)*");
});
