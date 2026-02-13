document.addEventListener("DOMContentLoaded", () => {
    // Intentamos capturar los elementos. Si fallan, el Grimorio avisará.
    const chat = document.getElementById('chat');
    const commandInput = document.getElementById('command');
    const sendBtn = document.querySelector('button'); // Busca cualquier botón si el ID falla

    let api_key = ""; 
    let modoRol = ""; 
    let modeloElegido = "gemini-1.5-flash"; 

    function addMessage(text, type = "ai") {
        if (!chat) return;
        const div = document.createElement('div');
        div.className = `message ${type}`;
        let nombre = (type === "user") ? `👤 Sorcerer` : `📖 El Grimorio`;
        div.innerHTML = `<strong>${nombre}:</strong><br>${text.replace(/\n/g, '<br>')}`;
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
    }

    async function llamarIA(mensajeUsuario) {
        if (!api_key) {
            let pass = prompt("🔑 PEGA TU LLAVE AIza...:");
            if (!pass) return "❌ Error: Se requiere llave.";
            api_key = pass.trim();
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modeloElegido}:generateContent?key=${api_key}`;
        const cuerpo = {
            contents: [{ parts: [{ text: (modoRol === "18" ? "MODO ADULTO: " : "") + mensajeUsuario }] }]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cuerpo)
            });
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (e) { return "❌ El vacío no responde. Revisa tu llave."; }
    }

    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;

        if (val.toLowerCase() === "reiniciar") {
            modoRol = ""; chat.innerHTML = "";
            addMessage("📖 Memoria limpia. Elige: 1. Batalla, 2. Libre, 3. +18");
            commandInput.value = ""; return;
        }

        if (!modoRol) {
            if (val === "1") modoRol = "batalla";
            else if (val === "2") modoRol = "libre";
            else if (val === "3") modoRol = "18";
            else { addMessage("Elige 1, 2 o 3."); return; }
            addMessage("🔮 Ritual listo. ¿Qué invocarás?");
            commandInput.value = ""; return;
        }
        
        addMessage(val, "user");
        commandInput.value = "";
        const res = await llamarIA(val);
        addMessage(res, "ai");
    }

    // Vinculamos el botón "Invocar"
    if (sendBtn) {
        sendBtn.onclick = (e) => { e.preventDefault(); procesar(); };
    }

    // Vinculamos la tecla Enter
    if (commandInput) {
        commandInput.onkeypress = (e) => { if (e.key === "Enter") { e.preventDefault(); procesar(); } };
    }

    addMessage("📖 **GRIMORIO CONECTADO**\n\nElige un ritual:\n1. ⚔️ Batalla\n2. 🌀 Libre\n3. 🔞 +18");
});
