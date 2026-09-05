import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Configurazione CORS per GitHub Pages
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
    const { nome, email, messaggio } = req.body;

    // Validazione campi
    if (!nome || !email || !messaggio) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    // Salva il messaggio nel DB Postgres
    const nuovoMessaggio = await prisma.messaggio.create({
      data: {
        nome,
        email,
        messaggio,
      },
    });

    return res.status(201).json({ success: true, data: nuovoMessaggio });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}