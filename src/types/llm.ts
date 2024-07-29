import { config } from "../config";


export enum Model {
    Llama3 = 'llama-3.1-8b-instant',
}

export type EmojisMap = {
    feat: string;
    fix: string;
    docs: string;
    style: string;
    refactor: string;
    test: string;
    chore: string;
    revert: string;
};


/* -------------------------------------------------------------------------- */


import Groq from 'groq-sdk';

// Configurazione dell'API Key
const groq = new Groq({ apiKey: config.inference.apiKeyGroq });

cazzo
// Funzione per ottenere i modelli
export const getModels = async () => {
    try {
        const response = await groq.models.list();
        return response.data.map(model => model.id);
    } catch (error) {
        console.error('Errore nel recupero dei modelli da Groq:', error);
        return [];
    }
};

