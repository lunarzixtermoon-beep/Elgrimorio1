document.addEventListener("DOMContentLoaded", () => {
    // Conectamos con tu HTML
    const chat = document.getElementById('chat');
    const commandInput = document.getElementById('command');
    const sendBtn = document.getElementById('sendBtn');

    let api_key = ""; 
    let modoRol = ""; 
    let modeloElegido = "gemini-1.5-flash"; 

    // Función para imprimir en el pergamino
    function addMessage(text, type = "ai") {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        let nombre = (type === "user") ? `👤 Sorcerer` : `📖 El Grimorio`;
        
        // Convertimos los saltos de línea para que se vean bien en el HTML
        div.innerHTML = `<strong>${nombre}:</strong><br>${text.replace(/\n/g, '<br>')}`;
        chat.appendChild(div);
        
        // Auto-scroll hacia abajo
        chat.scrollTop = chat.scrollHeight;
    }

    // El ritual de comunicación con Gemini
    async function llamarIA(mensajeUsuario) {
        if (!api_key) {
            let pass = prompt("🔑 PEGA TU LLAVE DE GOOGLE (AIza...):");
            if (!pass) return "❌ Se requiere la llave para despertar al Grimorio.";
            api_key = pass.trim();
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modeloElegido}:generateContent?key=${api_key}`;

        let instrucciones = "Eres el Grimorio, un tomo oscuro y sabio. Responde siempre en español. ";
        if (modoRol === "18") {
            instrucciones += "Actúa como autor de romance oscuro. Describe sensaciones físicas y encuentros apasionados con detalle y elegancia.";
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
            
            if (data.error) return `❌ Error del Vacío: ${data.error.message}`;
            
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            return "❌ El ritual ha fallado por un error de conexión.";
        }
    }

    // Lógica para procesar los hechizos
    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;

        // Comando de reinicio
        if (val.toLowerCase() === "reiniciar") {
            modoRol = ""; 
            chat.innerHTML = ""; 
            addMessage("📖 **MEMORIA PURIFICADA**\n\nElige un sendero:\n1. ⚔️ Batalla\n2. 🌀 Libre\n3. 🔞 +18");
            commandInput.value = "";
            return;
        }

        // Selección de modo inicial
        if (!modoRol) {
            if (val === "1") modoRol = "batalla";
            else if (val === "2") modoRol = "libre";
            else if (val === "3") modoRol = "18";
            else { addMessage("Por favor, elige 1, 2 o 3."); return; }
            
            addMessage(`🔮 **Ritual de Gemini iniciado.** ¿Qué deseas invocar ahora, Sorcerer?`);
            commandInput.value = "";
            return;
        }
        
        // Enviar mensaje del usuario
        addMessage(val, "user");
        commandInput.value = "";
        
        // Obtener y mostrar respuesta de la IA
        const respuestaIA = await llamarIA(val);
        addMessage(respuestaIA, "ai");
    }

    // --- ACTIVACIÓN DE BOTONES ---
    sendBtn.addEventListener("click", (e) => {
        e.preventDefault();
        procesar();
    });

    commandInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            procesar();
        }
    });

    // Mensaje de bienvenida inicial
    addMessage("📖 **GRIMORIO DE LAS MIL ALMAS ACTIVO**\n\nBienvenido, Zixtermoon. Elige tu sendero:\n1. ⚔️ Batalla\n2. 🌀 Libre\n3. 🔞 +18");
});
