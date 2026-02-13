document.addEventListener("DOMContentLoaded", () => {
    // Buscamos los elementos por su ID
    const chat = document.getElementById('chat');
    const commandInput = document.getElementById('command');
    const sendBtn = document.getElementById('sendBtn');

    let api_key = ""; 
    let modoRol = ""; 
    let modeloElegido = "gemini-1.5-flash"; 

    // Función para mostrar mensajes en pantalla
    function addMessage(text, type = "ai") {
        if (!chat) return;
        const div = document.createElement('div');
        div.className = `message ${type}`;
        let nombre = (type === "user") ? `👤 Sorcerer` : `📖 El Grimorio`;
        div.innerHTML = `<strong>${nombre}:</strong><br>${text.replace(/\n/g, '<br>')}`;
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
    }

    // El ritual para hablar con Gemini
    async function llamarIA(mensajeUsuario) {
        if (!api_key) {
            let pass = prompt("🔑 PEGA TU LLAVE DE GOOGLE (AIza...):");
            if (!pass) return "❌ Sin llave no hay magia.";
            api_key = pass.trim();
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modeloElegido}:generateContent?key=${api_key}`;

        let instrucciones = "Eres el Grimorio, un tomo oscuro y sabio. Responde en español. ";
        if (modoRol === "18") {
            instrucciones += "Actúa como autor de romance oscuro y visceral. Describe sensaciones físicas y encuentros apasionados con detalle y elegancia.";
        }

        const cuerpo = {
            contents: [{
                parts: [{ text: instrucciones + "\n\nUsuario dice: " + mensajeUsuario }]
            }]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cuerpo)
            });
            const data = await response.json();
            if (data.error) return `❌ Error: ${data.error.message}`;
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            return "❌ Error de conexión con el vacío.";
        }
    }

    // La lógica principal para enviar mensajes
    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;

        // Comando para reiniciar
        if (val.toLowerCase() === "reiniciar") {
            modoRol = ""; 
            chat.innerHTML = ""; 
            addMessage("📖 **MEMORIA PURIFICADA**\n\nElige un ritual:\n1. ⚔️ Batalla\n2. 🌀 Libre\n3. 🔞 +18");
            commandInput.value = "";
            return;
        }

        // Selección de modo
        if (!modoRol) {
            if (val === "1") modoRol = "batalla";
            else if (val === "2") modoRol = "libre";
            else if (val === "3") modoRol = "18";
            else { addMessage("Elige 1, 2 o 3."); return; }
            
            addMessage(`Canalizando el poder de **Gemini**. ¿Qué deseas invocar?`);
            commandInput.value = "";
            return;
        }
        
        // Enviar mensaje real
        addMessage(val, "user");
        commandInput.value = "";
        
        // Mensaje de espera
        const respuestaIA = await llamarIA(val);
        addMessage(respuestaIA, "ai");
    }

    // ASIGNACIÓN DE EVENTOS (Aquí es donde fallaba)
    if (sendBtn) {
        sendBtn.onclick = (e) => {
            e.preventDefault(); // Evita que la página se recargue
            procesar();
        };
    }

    if (commandInput) {
        commandInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                procesar();
            }
        });
    }

    addMessage("📖 **GRIMORIO DESPIERTO**\n\nBienvenido, Zixtermoon. Elige tu sendero:\n1. ⚔️ Batalla\n2. 🌀 Libre\n3. 🔞 +18");
});
