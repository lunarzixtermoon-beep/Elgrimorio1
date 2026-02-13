document.addEventListener("DOMContentLoaded", () => {
    const chat = document.getElementById('chat');
    const commandInput = document.getElementById('command');
    const sendBtn = document.getElementById('sendBtn');

    let userName = "Sorcerer";

    function addMessage(text, type = "ai") {
        const div = document.createElement('div');
        div.className = `message ${type}`;
        const sender = type === "ai" ? "📖 El Grimorio" : `👤 ${userName}`;
        div.innerHTML = `<strong>${sender}:</strong><br>${text.replace(/\n/g, '<br>')}`;
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
    }

    function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;
        const b = val.toLowerCase();
        
        addMessage(val, "user");

        if(b === "a") {
            addMessage("✨ **Modo Rol Libre activado.** Las páginas se extienden infinitamente.");
        } else if(b === "b") {
            addMessage("⚔️ **Modo Batallas activado.** Sangre y acero cubren las letras.");
        } else if(b === "c") {
            addMessage("🔥 **Modo Sexrol activado.** Un calor místico emana del libro.");
        } else if(b.startsWith("transformate en")) {
            const n = val.split("en")[1]?.trim() || "un ente";
            addMessage(`*El Grimorio brilla con fuerza...*`);
            addMessage(`✨ Se ha imbuido la esencia de **${n}**.`);
        } else if(b === "retroceder") {
            chat.innerHTML = "";
            bienvenida();
        } else {
            addMessage("Hechizo no reconocido. El libro permanece en silencio.");
        }

        commandInput.value = "";
        commandInput.focus();
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    function bienvenida() {
        addMessage("📖 **EL GRIMORIO DE LAS MIL ALMAS VINCULADO**\n\nElige tu destino:\nA) Rol | B) Batallas | C) Sexrol\n\nO invoca con: *Transformate en [personaje]*");
    }

    bienvenida();
});
