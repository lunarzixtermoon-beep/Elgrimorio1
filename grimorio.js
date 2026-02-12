// =======================================

// 📖 GRIMORIO DE LAS MIL ALMAS V5.4

// Móvil – Modos, Transformación, Avatar, Extras editables, Reinicio

// =======================================

if (!oc.character.customData) oc.character.customData = {};

if (!window.GRIMORIO_BUSY) window.GRIMORIO_BUSY = false;

const CONFIG = {

  nombreBase: "El Grimorio",

  bienvenida: `

╔══════════════════════════════════╗

📖 EL GRIMORIO DE LAS MIL ALMAS 📖

╚══════════════════════════════════╝

✨ PASO 1: ELIGE TU DESTINO

A) Rol Libre 🗡️ → Narrativa libre

B) Batallas ⚔️ → Combate épico

C) Sexrol 🔥 → Historia adulta

✨ PASO 2: INVOCACIÓN

Transformate en [personaje]

Ejemplo: Transformate en Riolu

🌌 CREACIÓN AVANZADA

Crear trama con [personaje] y [extra]

Ejemplo: Crear trama con Riolu y Pikachu

──────────────────────────────────

📜 COMANDOS PERMITIDOS

👤 SOBRE TI:

mi nombre → mostrar/cambiar tu nombre

mi avatar → mostrar/cambiar tu avatar (ej. si dices "Zeraora" se genera su avatar)

🤖 SOBRE EL BOT:

nombre bot → mostrar/cambiar nombre del Grimorio

👥 PERSONAJES AÑADIDOS:

nombre extra → mostrar/cambiar nombres de personajes añadidos

forma extra → mostrar/cambiar avatar de personajes añadidos

♻️ retroceder → reinicia todo el Grimorio

El libro místico flota frente a ti…

Sus páginas brillan esperando tu decisión para desatar su poder.

`

};

let modoActual = null;

let extras = [];

// =======================================

// 📜 MENSAJE INICIAL

// =======================================

function mostrarBienvenida() {

  modoActual = null;

  extras = [];

  oc.character.name = CONFIG.nombreBase;

  oc.character.roleInstruction = "";

  oc.character.initialMessages = [];

  oc.character.avatar = { url: "" };

  oc.thread.messages = [{

    author: "ai",

    name: "Sistema",

    content: CONFIG.bienvenida

  }];

}

if (!oc.thread.messages.length) mostrarBienvenida();

// =======================================

// 🎭 EVENTO PRINCIPAL

// =======================================

oc.thread.on("MessageAdded", async ({ message }) => {

  if (!message || message.author === "ai") return;

  if (window.GRIMORIO_BUSY) return;

  let texto = message.content.trim();

  let b = texto.toLowerCase();

  // ----------------------

  // ♻️ REINICIAR

  // ----------------------

  if (b === "retroceder") {

    mostrarBienvenida();

    return;

  }

  // ----------------------

  // 🎮 MODOS

  // ----------------------

  if (b === "a") {

    modoActual = "rol";

    oc.thread.messages.push({ author: "ai", name: "Sistema", content: "✅ Modo Rol Libre 🗡️ activado." });

    return;

  }

  if (b === "b") {

    modoActual = "batalla";

    oc.thread.messages.push({ author: "ai", name: "Sistema", content: "✅ Modo Batallas ⚔️ activado." });

    return;

  }

  if (b === "c") {

    modoActual = "sexrol";

    oc.thread.messages.push({ author: "ai", name: "Sistema", content: "🔥 Modo Sexrol activado." });

    return;

  }

  // ----------------------

  // 👤 COMANDOS DE USUARIO

  // ----------------------

  if (b.startsWith("mi nombre")) {

    let nuevo = texto.split("mi nombre")[1]?.trim();

    if (nuevo) oc.character.userCharacter.name = nuevo;

    oc.thread.messages.push({

      author: "ai",

      name: "Sistema",

      content: `👤 Tu nombre: ${oc.character.userCharacter.name || "[desconocido]"}`

    });

    return;

  }

  if (b.startsWith("mi avatar")) {

    let nuevo = texto.split("mi avatar")[1]?.trim();

    if (nuevo) {

      try {

        // Genera avatar automáticamente si es nombre de personaje

        let { dataUrl } = await oc.textToImage({

          prompt: `${nuevo}, fantasy character portrait, digital art, detailed, centered`,

          negativePrompt: "blurry, low quality"

        });

        if (dataUrl) oc.character.userCharacter.avatar.url = dataUrl;

      } catch (e) { console.log("Error generando avatar:", e); }

    }

    oc.thread.messages.push({

      author: "ai",

      name: "Sistema",

      content: `👤 Tu avatar: ${oc.character.userCharacter.avatar.url || "[ninguno]"}`

    });

    return;

  }

  // ----------------------

  // 🤖 COMANDOS DEL BOT

  // ----------------------

  if (b.startsWith("nombre bot")) {

    let nuevo = texto.split("nombre bot")[1]?.trim();

    if (nuevo) oc.character.name = nuevo;

    oc.thread.messages.push({

      author: "ai",

      name: "Sistema",

      content: `🤖 Nombre del Grimorio: ${oc.character.name}`

    });

    return;

  }

  // ----------------------

  // 👥 EXTRAS BONUS

  // ----------------------

  if (b.startsWith("nombre extra")) {

    let parts = texto.split("nombre extra")[1]?.trim().split(">"); // viejo > nuevo

    if (parts?.length === 2) {

      let viejo = parts[0].trim();

      let nuevo = parts[1].trim();

      let ex = extras.find(e => e.viejo.toLowerCase() === viejo.toLowerCase());

      if (ex) ex.nuevo = nuevo;

    }

    let mostrables = extras.filter(e => e.nuevo !== e.viejo || e.avatar);

    oc.thread.messages.push({

      author: "ai",

      name: "Sistema",

      content: `👥 Extras de nombre:\n${mostrables.map(e => `${e.viejo} > ${e.nuevo}`).join("\n") || "[ninguno]"}`

    });

    return;

  }

  if (b.startsWith("forma extra")) {

    let parts = texto.split("forma extra")[1]?.trim().split(">"); // nombre > url

    if (parts?.length === 2) {

      let nombre = parts[0].trim();

      let url = parts[1].trim();

      let ex = extras.find(e => e.nuevo.toLowerCase() === nombre.toLowerCase());

      if (ex) ex.avatar = url;

    }

    let mostrables = extras.filter(e => e.nuevo !== e.viejo || e.avatar);

    oc.thread.messages.push({

      author: "ai",

      name: "Sistema",

      content: `👥 Extras de forma/avatar:\n${mostrables.map(e => `${e.nuevo} → ${e.avatar || "[ninguno]"}`).join("\n") || "[ninguno]"}`

    });

    return;

  }

  // ----------------------

  // ✨ TRANSFORMACIÓN / TRAMA

  // ----------------------

  if (b.startsWith("transformate en") || b.startsWith("crear trama con")) {

    window.GRIMORIO_BUSY = true;

    let esTrama = b.startsWith("crear trama con");

    let comando = esTrama ? "crear trama con" : "transformate en";

    let input = texto.substring(texto.toLowerCase().indexOf(comando) + comando.length).trim();

    if (!input) { window.GRIMORIO_BUSY = false; return; }

    // Nombre principal

    let nombreLimpio = input.split(/ y | con /i)[0].trim().replace(/^(un|una|el|la)\s+/i, "");

    if (!nombreLimpio) { window.GRIMORIO_BUSY = false; return; }

    let nombreCap = nombreLimpio.charAt(0).toUpperCase() + nombreLimpio.slice(1);

    oc.character.name = nombreCap;

    // Estilo según modo

    let estilo = modoActual === "rol" ? "Narrativa libre."

                : modoActual === "batalla" ? "Combate intenso."

                : modoActual === "sexrol" ? "Narrativa adulta."

                : "Narrativa neutral.";

    oc.character.roleInstruction = `Eres ${nombreCap}. Habla en primera persona. Actúa exactamente como ${nombreCap}. ${estilo}`;

    // Mensaje de transformación

    oc.thread.messages.push({

      author: "ai",

      name: nombreCap,

      content: `✨ Transformándose en ${nombreCap}...`

    });

    // ----------------------

    // Generar avatar

    // ----------------------

    try {

      let { dataUrl } = await oc.textToImage({

        prompt: `${nombreCap}, fantasy character portrait, digital art, detailed, centered`,

        negativePrompt: "blurry, low quality"

      });

      if (dataUrl) oc.character.avatar.url = dataUrl;

    } catch (e) { console.log("Error generando imagen:", e); }

    // ----------------------

    // Trama extra

    // ----------------------

    if (esTrama) {

      let extra = input.split(/ y | con /i)[1];

      if (extra) {

        let extraCap = extra.charAt(0).toUpperCase() + extra.slice(1);

        extras.push({ viejo: extraCap, nuevo: nombreCap, avatar: null });

        oc.thread.messages.push({

          author: "ai",

          name: nombreCap,

          content: `*La historia se une con ${extraCap}...*\nSoy **${nombreCap}**.\nComienza nuestra aventura.`

        });

      }

    } else {

      extras.push({ viejo: nombreCap, nuevo: nombreCap, avatar: oc.character.avatar.url });

      oc.thread.messages.push({

        author: "ai",

        name: nombreCap,

        content: `*${nombreCap} aparece frente a ti.*`

      });

    }

    window.GRIMORIO_BUSY = false;

    return;

  }

});
