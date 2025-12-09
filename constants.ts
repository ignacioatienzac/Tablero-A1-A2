import { Question, Player } from './types';

export const BOARD_SIZE = 32;

export const INITIAL_PLAYERS: Player[] = [
  { id: 0, name: "Jugador 1", color: "bg-rose-500", position: 0 },
  { id: 1, name: "Jugador 2", color: "bg-sky-500", position: 0 }
];

export const QUESTIONS: Question[] = [
    { t: "Inicio", ok: true }, // 0
    { t: "Yo soy Español y mi padre es Alemán.", ok: false, ans: ["Yo soy español y mi padre es alemán"] },
    { t: "La gente son muy simpáticas.", ok: false, ans: ["La gente es muy simpática"] },
    { t: "Mi hermano es más alto que tú.", ok: true },
    { t: "A mí me gustan bailar y cantar.", ok: false, ans: ["A mí me gusta bailar y cantar", "Me gusta bailar y cantar"] },
    { t: "Hoy hace muy sol.", ok: false, ans: ["Hoy hace mucho sol"] },
    { t: "Yo tengo ventidós años.", ok: false, ans: ["Yo tengo veintidós años", "Tengo veintidós años"] },
    { t: "¿De dónde vives tú?", ok: false, ans: ["¿Dónde vives tú?", "¿Dónde vives?"] },
    { t: "Nosotros vivemos en Madrid.", ok: false, ans: ["Nosotros vivimos en Madrid", "Vivimos en Madrid"] },
    { t: "La casa de María es rojo.", ok: false, ans: ["La casa de María es roja"] },
    { t: "Mañana voy a ir a comer pizza.", ok: true },
    { t: "Son la una y media.", ok: false, ans: ["Es la una y media"] },
    { t: "La problema es difícil.", ok: false, ans: ["El problema es difícil"] },
    { t: "¿Qué le pasa a Juan? ¿Es cansado?", ok: false, ans: ["¿Qué le pasa a Juan? ¿Está cansado?", "¿Está cansado?"] },
    { t: "Ayer Rebeca fui a la playa.", ok: false, ans: ["Ayer Rebeca fue a la playa"] },
    { t: "No sabió cómo responder la pregunta de la entrevista.", ok: false, ans: ["No supo cómo responder la pregunta de la entrevista", "No supo cómo responder"] },
    { t: "Quiero un café con leche.", ok: true },
    { t: "Me duele el mano.", ok: false, ans: ["Me duele la mano"] },
    { t: "El niño está escribiendo.", ok: true },
    { t: "Mi padre es policio.", ok: false, ans: ["Mi padre es policía"] },
    { t: "Voy en la escuela.", ok: false, ans: ["Voy a la escuela"] },
    { t: "Ella se levanta en las ocho.", ok: false, ans: ["Ella se levanta a las ocho", "Se levanta a las ocho"] },
    { t: "Ayer visitaba un centro comercial muy grande.", ok: false, ans: ["Ayer visité un centro comercial muy grande", "Ayer visité un centro comercial"] },
    { t: "Yo haco los deberes.", ok: false, ans: ["Yo hago los deberes", "Hago los deberes"] },
    { t: "Tiene muchas personas en el parque.", ok: false, ans: ["Hay muchas personas en el parque"] },
    { t: "El fin de semana pasado comí paella.", ok: true },
    { t: "Estoy mucho cansado.", ok: false, ans: ["Estoy muy cansado"] },
    { t: "No tengo dineros.", ok: false, ans: ["No tengo dinero"] },
    { t: "Mi amigo es franceso y su novia es francesa.", ok: false, ans: ["Mi amigo es francés y su novia es francesa"] },
    { t: "Yo sabo hablar español.", ok: false, ans: ["Yo sé hablar español", "Sé hablar español"] },
    { t: "Tengo dolor de piernas.", ok: true },
    { t: "Meta", ok: true } // 31
];