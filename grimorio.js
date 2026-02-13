document.addEventListener("DOMContentLoaded", () => {
    const chat = document.getElementById('chat');
    const commandInput = document.getElementById('command');
    const sendBtn = document.getElementById('sendBtn');

    let userName = "Sorcerer";
    let personajeBot = "El Grimorio";
    let api_key = ""; 
    let modoRol = ""; // Aquí guardaremos la elección

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
            if (!pass) return "❌ El libro se cierra sin su llave.";
            api_key = pass.trim();
        }

        // Definimos las instrucciones según el modo seleccionado
        let instrucciones = `Eres ${personajeBot}. Responde en español. `;
        if (modoRol === "batalla") {
            instrucciones += "Estamos en un ROL DE BATALLA ÉPICA. Describe ataques, magia, daño y estrategia de forma intensa.";
        } else if (modoRol === "libre") {
            instrucciones += "Estamos en un ROL LIBRE. Sigue la corriente de la historia que proponga el Sorcerer.";
        } else if (modoRol === "18") {
            instrucciones += "Estamos en un ROL ADULTO +18. Eres un narrador sin censura, descriptivo y carnal. Usa lenguaje literario erótico.";
        }

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${api_key}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "mixtral-8x7b-32768",
                    messages: [
                        { role: "system", content: instrucciones },
                        { role: "user", content: mensajeUsuario }
                    ],
                    temperature: 0.8
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            return "❌ El portal ha fallado. Revisa tu conexión.";
        }
    }

    async function procesar() {
        const val = commandInput.value.trim();
        if(!val) return;

        // Lógica para elegir el modo al principio
        if (!modoRol) {
            if (val === "1") { modoRol = "batalla"; addMessage("Has elegido: ⚔️ ROL DE BATALLA"); }
            else if (val === "2") { modoRol = "libre"; addMessage("Has elegido: 🌀 ROL LIBRE"); }
            else if (val === "3") { modoRol = "18"; addMessage("Has elegido: 🔞 ROL +18"); }
            else { addMessage("Por favor, elige 1, 2 o 3."); return; }
            
            commandInput.value = "";
            addMessage("El modo ha sido sellado. ¿Cómo comienza tu historia, Sorcerer?");
            return;
        }
        
        addMessage(val, "user");
        commandInput.value = "";
        const respuestaIA = await llamarIA(val);
        addMessage(respuestaIA, "ai");
    }

    sendBtn.onclick = procesar;
    commandInput.onkeypress = (e) => { if(e.key === "Enter") procesar(); };

    addMessage("📖 **BIENVENIDO AL GRIMORIO MULTIVERSAL**\n\nElige el tipo de ritual que deseas realizar:\n\n1. ⚔️ **Rol de Batalla**\n2. 🌀 **Rol Libre**\n3. 🔞 **Rol +18**\n\n(Escribe el número del 1 al 3)");
});
