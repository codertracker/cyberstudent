import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Configurazione CORS per GitHub Pages / Frontend esterno
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gestione Preflight OPTIONS del browser
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Accetta solo richieste POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    const { nome, email, messaggio, subject } = req.body;

    // Validazione campi obbligatori
    if (!nome || !email || !messaggio) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    // 1. Salva il messaggio nel DB Vercel Postgres tramite Prisma
    const nuovoMessaggio = await prisma.messaggio.create({
      data: {
        nome,
        email,
        messaggio,
      },
    });

    // 2. Invio Email a Gmail tramite Resend (se RESEND_API_KEY è configurato su Vercel)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const destinationEmail = process.env.NOTIFICATION_EMAIL || 'tuamail@gmail.com';

        await resend.emails.send({
          from: 'CyberStudent Contact <onboarding@resend.dev>',
          to: destinationEmail,
          replyTo: email,
          subject: `[CyberStudent] ${subject || 'Nuovo contatto da ' + nome}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
              <h2 style="color: #2563eb; margin-top: 0; font-size: 20px;">🛡️ Nuovo messaggio dal tuo portfolio</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 100px; color: #475569;">Mittente:</td>
                  <td style="padding: 8px 0; color: #0f172a;">${nome}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
                </tr>
                ${subject ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Oggetto:</td>
                  <td style="padding: 8px 0; color: #0f172a;">${subject}</td>
                </tr>` : ''}
              </table>
              <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px;">
                <p style="margin: 0 0 5px 0; font-weight: bold; color: #475569; font-size: 13px;">MESSAGGIO:</p>
                <p style="margin: 0; color: #1e293b; white-space: pre-wrap; line-height: 1.6;">${messaggio}</p>
              </div>
              <p style="margin-top: 20px; font-size: 12px; color: #94a3b8; text-align: center;">Questo messaggio è stato salvato nel database Vercel Postgres ed inviato tramite Resend.</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('[contact-api] Errore invio email Resend:', emailErr);
      }
    }

    // 3. Optional: Notifica Telegram sul telefono (se TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID sono definiti)
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      try {
        const text = `🛡️ *Nuovo messaggio da ${nome}*\n\n📧 Email: \`${email}\`\n📌 Oggetto: ${subject || 'N/A'}\n\n💬 *Messaggio:*\n${messaggio}`;
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: 'Markdown',
          }),
        });
      } catch (tgErr) {
        console.error('[contact-api] Errore notifica Telegram:', tgErr);
      }
    }

    return res.status(201).json({ success: true, data: nuovoMessaggio, message: 'Messaggio inviato e salvato con successo!' });
  } catch (error) {
    console.error('[contact-api] Errore interno:', error);
    return res.status(500).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}