/* ==============================================================
   FIREBASE CONFIG — Tina Nails Studio
   ==============================================================
   1. Andá a https://console.firebase.google.com
   2. Creá un proyecto (gratis).
   3. Andá a "Configuración del proyecto" > "Tus apps" > ícono </> (Web).
   4. Copiá el objeto "firebaseConfig" que te da Firebase y pegalo
      reemplazando el de abajo.
   5. Usá EXACTAMENTE el mismo objeto en la app de Windows
      (archivo firebase-config.js dentro de la carpeta de la app).

   Mientras no completes tus datos reales, el sitio web sigue
   funcionando normal (el turno se manda igual por WhatsApp),
   solo que no queda guardado en la nube para la app.
   ============================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyDY98RHDtP98LxgcFH9sCn5mXM-jBrEZFE",
  authDomain: "tina-nails-e07af.firebaseapp.com",
  projectId: "tina-nails-e07af",
  storageBucket: "tina-nails-e07af.firebasestorage.app",
  messagingSenderId: "53442011721",
  appId: "1:53442011721:web:9c1c3a07abd63f36935598"
};

// Evita romper el sitio si todavía no configuraste tus claves reales
window.db = null;
try {
  if (firebaseConfig.apiKey !== "TU_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
  } else {
    console.info("Tina Nails: Firebase todavía no está configurado (firebase-config.js).");
  }
} catch (err) {
  console.warn("Tina Nails: no se pudo inicializar Firebase.", err);
}
