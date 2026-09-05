import { PrismaClient } from '@prisma/client';

// Inizializza Prisma. Leggerà automaticamente process.env.DATABASE_URL fornita da Vercel
const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Abilita CORS per permettere le chiamate dal tuo sito GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gestione della richiesta PREFLIGHT per il browser
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Esempio: Sostituisci 'utente' con il nome della tua tabella definita nello schema Prisma
    // (es. prisma.post.findMany(), prisma.prodotto.findMany(), ecc.)
    const dati = await prisma.Utente.findMany(); 

    return res.status(200).json(dati);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    // Chiude la connessione al termine della funzione
    await prisma.$disconnect();
  }
}