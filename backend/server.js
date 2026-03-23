const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Create an Ethereal test account automatically on startup
let transporter;
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return process.exit(1);
    }
    
    console.log('Credentials obtained, listening on the test account...');
    
    // Create a SMTP transporter object
    transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
});

app.post('/api/send-email', async (req, res) => {
    const { email, name, ci, date, time } = req.body;
    
    if (!transporter) {
        return res.status(500).json({ error: 'Mail server is not ready yet.' });
    }

    try {
        // Compose the email
        const message = {
            from: '"BloodLink Official" <noreply@bloodlink.uy>',
            to: email,
            subject: 'Confirmación de Turno - BloodLink',
            text: `Hola ${name},\n\nTu turno de donación ha sido confirmado con éxito.\nFecha: ${date}\nHora: ${time}\nDonante: CI ${ci}\n\nPor favor, preséntate 10 minutos antes.\n\nGracias por salvar vidas.\nEl Equipo de BloodLink.`,
            html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #E53935;">¡Turno Confirmado, ${name}!</h2>
                    <p>Tu reserva para donar sangre se ha guardado con éxito.</p>
                    <div style="background: #F9FAFB; padding: 15px; border-radius: 8px; border-left: 4px solid #E53935; margin: 20px 0;">
                        <p><strong>Cédula:</strong> ${ci}</p>
                        <p><strong>Fecha reservada:</strong> ${date}</p>
                        <p><strong>Hora:</strong> ${time}</p>
                    </div>
                    <p>Por favor recuerda presentarte en el centro de salud 10 minutos antes de tu hora asignada y llevar tu Cédula de Identidad física.</p>
                    <p>¡Gracias por sumarte a <strong>BloodLink</strong> y salvar vidas hoy!</p>
                   </div>`
        };

        const info = await transporter.sendMail(message);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', previewUrl);
        
        res.status(200).json({ 
            success: true, 
            message: 'Email sent automatically to Ethereal',
            previewUrl: previewUrl
        });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});
