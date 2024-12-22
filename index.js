import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
const EMAIL_USER = "agustin.morro@gmail.com";
const EMAIL_PASS = "dphn zybh nfvy zbuv";

app.use(
    cors({
      origin: [
        "http://localhost:5173", 
        "https://galeriainvisible.vercel.app" // URL temporal de Vercel
      ],
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );
  
  // Manejador manual para solicitudes preflight OPTIONS
  app.options("/send-email", (req, res) => {
    res.header(
      "Access-Control-Allow-Origin",
      "https://galeriainvisible.vercel.app"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.status(204).send("");
  });

app.use(express.json());

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER, 
        pass: EMAIL_PASS  
    }
});

// Endpoint para enviar correos
app.post("/send-email", async (req, res) => {
  const { email, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"Galeria Invisible" <${EMAIL_USER}>`,
      to: "agustin.morro@gmail.com",
      subject: `Consulta de ${email} / GALERIA INVISIBLE /`,
      html: `
                <h1>Detalles del contacto</h1>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mensaje:</strong> ${message}</p>
            `,
    });

    res.status(200).json({ message: "Correo enviado exitosamente" });
  } catch (err) {
    console.error("Error en el controlador:", err);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
});

// Inicia el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});