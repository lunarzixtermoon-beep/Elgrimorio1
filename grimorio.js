async function llamarIA(mensajeUsuario) {
        if (!api_key) {
            api_key = prompt("🔑 PEGA TU LLAVE DE GOOGLE AI (GEMINI):").trim();
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modeloElegido}:generateContent?key=${api_key}`;

        const cuerpo = {
            contents: [{
                parts: [{
                    text: `Instrucciones de rol: Eres el Grimorio, un tomo oscuro. 
                    ${modoRol === '18' ? 'Modo Romance Oscuro Adulto: Describe la tensión física y encuentros apasionados con detalle literario y elegancia.' : ''}
                    Usuario: ${mensajeUsuario}`
                }]
            }]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cuerpo)
            });
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            return "❌ El ritual de Gemini ha fallado. Revisa tu llave.";
        }
    }
