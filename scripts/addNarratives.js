// scripts/addNarratives.js
const firebase = require('firebase/app');
require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA5N2icFbrrGgRkQD80Dj8jwg7I7u8ner0",
  authDomain: "quechuaapp-87797.firebaseapp.com",
  projectId: "quechuaapp-87797",
  storageBucket: "quechuaapp-87797.appspot.com",
  messagingSenderId: "1024003542254",
  appId: "1:1024003542254:web:a845bcfe4241fd6285f7ff"
};

// Inicializar Firebase si aún no está inicializado
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Si ya está inicializado, usa la instancia existente
}

const db = firebase.firestore();

async function addNarratives() {
  try {
    // Narrativa 1: La Travesía de Mamacona
    const narrativa1 = {
      title: "La Travesía de Mamacona",
      description: "Acompaña a Mamacona en su viaje por las montañas sagradas de los Andes para encontrar plantas medicinales que salvarán a su pueblo.",
      category: "adventure",
      duration: "15-20",
      coverImage: "",
      choices: 15,
      scenes: [
        {
          quechuaText: "Mamacona yanapaqta maskachkan llaqtanta hampinampaq. Llamkuqtinmi hatun urquta rinallantaq. Yuyayninpiqa ñawin yaraq qurawan purinna.",
          spanishText: "Mamacona busca ayuda para curar a su pueblo. Debe viajar hasta la gran montaña. En su mente, debe encontrar la planta de hojas amarillas.",
          image: "",
          choices: [
            { quechuaText: "Chawpi ñanninta puriy", spanishText: "Tomar el camino del medio", nextScene: 1 },
            { quechuaText: "Wayq'uta riy", spanishText: "Seguir por el valle", nextScene: 2 }
          ]
        },
        {
          quechuaText: "Chawpi ñanpi purichkaptinmi atipasqa apuwan tupanki. Paymi tapusunki: '¿Imatan kaypi mashkanki?'",
          spanishText: "En el camino del medio, te encuentras con un espíritu de la montaña. Te pregunta: '¿Qué buscas aquí?'",
          image: "",
          choices: [
            { quechuaText: "Quri yuraq qura maskani", spanishText: "Busco la planta de hojas amarillas", nextScene: 3 },
            { quechuaText: "Puriyta munani", spanishText: "Solo estoy explorando", nextScene: 4 }
          ]
        },
        {
          quechuaText: "Wayq'u ukhupi purichkaptin para chayamun. Mach'ayta tarinayki tiyan.",
          spanishText: "Mientras caminas por el valle, comienza a llover. Debes encontrar una cueva.",
          image: "",
          choices: [
            { quechuaText: "Mach'ayta maskay", spanishText: "Buscar una cueva", nextScene: 5 },
            { quechuaText: "Parantin puriy", spanishText: "Seguir caminando bajo la lluvia", nextScene: 4 }
          ]
        },
        {
          quechuaText: "Apu kusisqa kaspa willasuyki: 'Qhawarimuway urqupa patanta, chaypin quri yuraq qura wiñan'.",
          spanishText: "El espíritu, complacido, te dice: 'Mira en la cima de la montaña, allí crece la planta de hojas amarillas'.",
          image: "",
          choices: [
            { quechuaText: "Urquman wichay", spanishText: "Subir a la montaña", nextScene: 6 },
            { quechuaText: "Aput kacharikuy", spanishText: "Agradecer al espíritu y seguir otro camino", nextScene: 2 }
          ]
        },
        {
          quechuaText: "Tutayaqtinmi ñannikipi pantarunki. Wayramanta pacha chirin. Samanayki tiyan.",
          spanishText: "Al anochecer, te pierdes en el camino. El viento es frío. Debes descansar.",
          image: "",
          choices: [
            { quechuaText: "Ninata ruway", spanishText: "Hacer una fogata", nextScene: 5 },
            { quechuaText: "Kutirikapu llaqtaykiman", spanishText: "Regresar a la aldea", nextScene: 7 }
          ]
        },
        {
          quechuaText: "Mach'aypi tiyaspa, runakuna rimasqanta uyarinki. Punchawpaqmi paykuna urqupa patanman rinqaku.",
          spanishText: "En la cueva, escuchas a otras personas hablar. Ellos irán a la cima de la montaña al amanecer.",
          image: "",
          choices: [
            { quechuaText: "Paykunawan riyta mañakuy", spanishText: "Pedirles ir con ellos", nextScene: 6 },
            { quechuaText: "Sapallayki urquman riy", spanishText: "Ir solo a la montaña", nextScene: 6 }
          ]
        },
        {
          quechuaText: "Urqupa patapi kaspa, quri yuraq qurata tarirunki. Chunka qurata pallanki, llaqtaykiman kutirinaykipaq.",
          spanishText: "En la cima de la montaña, encuentras la planta de hojas amarillas. Recoges diez plantas para llevar a tu aldea.",
          image: "",
          choices: [
            { quechuaText: "Llaqtaykiman kutiy", spanishText: "Regresar a la aldea", nextScene: 8 }
          ]
        },
        {
          quechuaText: "Llaqtaykiman kutiptiki, llaqtayoqkuna anchata llakisqas, yanapay mana chayamusqanrayku.",
          spanishText: "Al regresar a la aldea sin la medicina, la gente está muy triste porque no llegó la ayuda.",
          image: "",
          choices: [
            { quechuaText: "Huq p'unchaw kaqmanta maskaq riy", spanishText: "Prometer buscar otro día", nextScene: 0 },
            { quechuaText: "Huqta maskaq riy", spanishText: "Buscar otra solución", nextScene: 8 }
          ]
        },
        {
          quechuaText: "Quri yuraq qurawan hampiyta qallarinki. Llaqt'ayoqkuna allinyachkanku. Qanmi Mamacona ñak'arisqaykimanta hatuncharisqa kanki.",
          spanishText: "Con la planta de hojas amarillas, comienzas a curar. La gente del pueblo se está recuperando. Eres honrada como Mamacona por tu valentía.",
          image: "",
          choices: [
            { quechuaText: "Tukuriy", spanishText: "Finalizar", nextScene: 9 }
          ]
        }
      ],
      updatedAt: new Date().toISOString()
    };

    // Narrativa 2: Tradiciones del Inti Raymi
    const narrativa2 = {
      title: "Tradiciones del Inti Raymi",
      description: "Experimenta la preparación y celebración del Inti Raymi, la fiesta del sol, mientras aprendes sobre las antiguas tradiciones andinas.",
      category: "culture",
      duration: "10-15",
      coverImage: "",
      choices: 13,
      scenes: [
        {
          quechuaText: "Inti Raymipaq wakichikuy qallarinña. Qanmi kamachiq kanki. ¿Imatataq ñawpaqta ruwayman?",
          spanishText: "Los preparativos para el Inti Raymi ya están comenzando. Tú eres el organizador. ¿Qué deberías hacer primero?",
          image: "",
          choices: [
            { quechuaText: "Pachamaman t'ikanchata quy", spanishText: "Ofrecer flores a la Pachamama", nextScene: 1 },
            { quechuaText: "Llaqta runata waqyay", spanishText: "Convocar a la gente del pueblo", nextScene: 2 }
          ]
        },
        {
          quechuaText: "Pachamaman t'ikanchata qoptiki, allinta chaskisunki. Kunanqa mikhunata wakichinayki tiyan.",
          spanishText: "Al ofrecer flores a la Pachamama, ella te recibe bien. Ahora debes preparar la comida.",
          image: "",
          choices: [
            { quechuaText: "Sara akata ruway", spanishText: "Preparar chicha de maíz", nextScene: 3 },
            { quechuaText: "Papata wayk'uy", spanishText: "Cocinar patatas", nextScene: 4 }
          ]
        },
        {
          quechuaText: "Llaqta runata waqyaptiki, llapanku hampunku. Raymi ruraq runa pisilla kasqa.",
          spanishText: "Al convocar a la gente del pueblo, todos vienen. Pero hay pocos organizadores.",
          image: "",
          choices: [
            { quechuaText: "Tawantin runata akllay", spanishText: "Elegir a cuatro personas", nextScene: 3 },
            { quechuaText: "Sapallayki llamk'ay", spanishText: "Trabajar solo", nextScene: 4 }
          ]
        },
        {
          quechuaText: "Sara akata ruraptiki, machukunaqa kusisqa kanku. Paykunaqa ninku: 'Ñawpa tiempomanta hina ruwakunki'.",
          spanishText: "Al preparar la chicha de maíz, los ancianos están contentos. Te dicen: 'Lo haces como en los tiempos antiguos'.",
          image: "",
          choices: [
            { quechuaText: "Inti Raymi pukllayta ruway", spanishText: "Organizar los juegos del Inti Raymi", nextScene: 5 },
            { quechuaText: "Inti takikunata yachay", spanishText: "Aprender los cantos al sol", nextScene: 6 }
          ]
        },
        {
          quechuaText: "Llamk'achkaptiki, machu taytakuna hamunku. Paykunaqa 'ama hinachu' nisunki, 'yanapasqayki'.",
          spanishText: "Mientras trabajas, los ancianos vienen. Te dicen 'no así', 'te ayudaremos'.",
          image: "",
          choices: [
            { quechuaText: "Yanapawayku niyta", spanishText: "Aceptar su ayuda", nextScene: 5 },
            { quechuaText: "Manan, ñuqallan ruway niyta", spanishText: "Rechazar y seguir solo", nextScene: 7 }
          ]
        },
        {
          quechuaText: "Inti Raymi p'unchaw chayamun. Tukuy runa hamunku. Intita napaykuspaña qallarina.",
          spanishText: "Llega el día del Inti Raymi. Toda la gente viene. Hay que comenzar saludando al sol.",
          image: "",
          choices: [
            { quechuaText: "Inti taytata yupaychay", spanishText: "Honrar al padre sol", nextScene: 8 },
            { quechuaText: "Tusuy qallariy", spanishText: "Comenzar el baile", nextScene: 6 }
          ]
        },
        {
          quechuaText: "Intita yupaychaspa tusunki. Tukuy runa qatisunki. Inti Raymipi kusisqa kashanku.",
          spanishText: "Bailas honrando al sol. Toda la gente te sigue. Están felices en el Inti Raymi.",
          image: "",
          choices: [
            { quechuaText: "Raymipi mikhuy upyay", spanishText: "Comer y beber en la fiesta", nextScene: 8 }
          ]
        },
        {
          quechuaText: "Sapallayki ruwayta munaptiki, ñak'arinki. Raymi mana allinchu lloqsin.",
          spanishText: "Al querer hacerlo solo, sufres mucho. La fiesta no sale bien.",
          image: "",
          choices: [
            { quechuaText: "Pampachanawaykichikta mañakuy", spanishText: "Pedir perdón a todos", nextScene: 8 },
            { quechuaText: "Llaqtamanta ripuy", spanishText: "Irte del pueblo", nextScene: 9 }
          ]
        },
        {
          quechuaText: "Inti Raymi raymita hunt'anki. Llaqta runakunaqa ancha kusisqa. Qanmanta rimachkanku: 'Allin kamachiq kasqa'.",
          spanishText: "Completaste la fiesta del Inti Raymi. La gente del pueblo está muy feliz. Hablan de ti: 'Fue un buen organizador'.",
          image: "",
          choices: [
            { quechuaText: "Tukuriy", spanishText: "Finalizar", nextScene: 10 }
          ]
        },
        {
          quechuaText: "Huq wata qhepaman, huq raymipi kachkanki. Kaypiqa yachanki: 'Llamk'ayqa sapalla manan allinchu, aynipi aswan allin'.",
          spanishText: "Un año después, estás en otra fiesta. Aquí aprendes: 'El trabajo solo no es bueno, es mejor en comunidad'.",
          image: "",
          choices: [
            { quechuaText: "Tukuriy", spanishText: "Finalizar", nextScene: 10 }
          ]
        }
      ],
      updatedAt: new Date().toISOString()
    };

    // Narrativa 3: Un Día en el Mercado
    const narrativa3 = {
      title: "Un Día en el Mercado",
      description: "Aprende a comunicarte en quechua mientras visitas un mercado tradicional andino, regateas y descubres productos locales.",
      category: "daily",
      duration: "10-12",
      coverImage: "",
      choices: 13,
      scenes: [
        {
          quechuaText: "Qatuman chayarunki. Achka runaña kashasqaku. ¿Maymantataq qallarinki?",
          spanishText: "Llegas al mercado. Ya hay mucha gente. ¿Por dónde empezarás?",
          image: "",
          choices: [
            { quechuaText: "Mikhunakunaman riy", spanishText: "Ir a los puestos de comida", nextScene: 1 },
            { quechuaText: "Awayta qhawaq riy", spanishText: "Ir a ver tejidos", nextScene: 2 }
          ]
        },
        {
          quechuaText: "Mikhunakunapi kashanki. Warmikuna waqyanku: '¡Papata rantikuychik! ¡Chuñuta rantikuychik!'",
          spanishText: "Estás en los puestos de comida. Las mujeres gritan: '¡Compren papas! ¡Compren chuño!'",
          image: "",
          choices: [
            { quechuaText: "Papata rantiy", spanishText: "Comprar papas", nextScene: 3 },
            { quechuaText: "Chuñuta rantiy", spanishText: "Comprar chuño", nextScene: 4 }
          ]
        },
        {
          quechuaText: "Awaykuna sumaq kachkasqa. Huk warmi nisunki: 'Rantiway, sumaq llikllayta qusqayki'.",
          spanishText: "Los tejidos son hermosos. Una mujer te dice: 'Cómprame, te daré mi hermosa manta'.",
          image: "",
          choices: [
            { quechuaText: "Llikllata rantiy", spanishText: "Comprar la manta", nextScene: 5 },
            { quechuaText: "Manan kunanchu rantisaq", spanishText: "No comprar ahora", nextScene: 6 }
          ]
        },
        {
          quechuaText: "Warmi nisunki: 'Papay kinsa sulismi'. Qamtaq kutichishanki: '¿Manataq iskay sulipi qunkimanchu?'",
          spanishText: "La mujer te dice: 'Mis papas cuestan tres soles'. Tú le contestas: '¿No me las darías por dos soles?'",
          image: "",
          choices: [
            { quechuaText: "Kinsa sulita pagay", spanishText: "Pagar tres soles", nextScene: 7 },
            { quechuaText: "Ishkay sulpi munani niyta", spanishText: "Insistir en dos soles", nextScene: 6 }
          ]
        },
        {
          quechuaText: "Chuñu qhatuq nisunki: 'Chuñuy sumaqmi, qusayki iskay kiluta'.",
          spanishText: "El vendedor de chuño te dice: 'Mi chuño es bueno, te daré dos kilos'.",
          image: "",
          choices: [
            { quechuaText: "Chuñuta rantiy", spanishText: "Comprar el chuño", nextScene: 7 },
            { quechuaText: "Huk kilullata mañakuy", spanishText: "Pedir solo un kilo", nextScene: 7 }
          ]
        },
        {
          quechuaText: "Llikllaman qhawaspa, tapunki: '¿Hayk'atan munanki?' Warmi nisunki: 'Chunka pichqayuq sulismi'.",
          spanishText: "Mirando la manta, preguntas: '¿Cuánto quieres?' La mujer te dice: 'Son quince soles'.",
          image: "",
          choices: [
            { quechuaText: "Chunka pichqayuq sulista pagay", spanishText: "Pagar quince soles", nextScene: 8 },
            { quechuaText: "Chunka sulisman pisiyachiyta mañakuy", spanishText: "Pedir rebaja a diez soles", nextScene: 6 }
          ]
        },
        {
          quechuaText: "Masinakuspataq, qhepaman nisunki: 'Ya, qusqayki chayman'.",
          spanishText: "Después de regatear, finalmente te dice: 'Está bien, te lo daré por ese precio'.",
          image: "",
          choices: [
            { quechuaText: "Rantiy", spanishText: "Comprar", nextScene: 8 },
            { quechuaText: "Agradecespa ripuy", spanishText: "Agradecer e irse", nextScene: 9 }
          ]
        },
        {
          quechuaText: "Mikhunakunata rantispa, yarqayta sentin. Wayk'usqa mikhunakunata qhawarinki.",
          spanishText: "Después de comprar alimentos, sientes hambre. Miras los platos de comida preparada.",
          image: "",
          choices: [
            { quechuaText: "Chupi platuta mañakuy", spanishText: "Pedir un plato de sopa", nextScene: 8 },
            { quechuaText: "Awata qolqeykiwan rantiq riy", spanishText: "Ir a comprar tejidos con el dinero que te queda", nextScene: 2 }
          ]
        },
        {
          quechuaText: "Rantisqaykiwan kusisqa kanki. Qatumanta wasiman ripunki, ñanpiqa tinkurqanki reqsisqaykiwan.",
          spanishText: "Estás feliz con tus compras. Te vas del mercado a casa, en el camino te encuentras con un conocido.",
          image: "",
          choices: [
            { quechuaText: "Rimay paywat, rantisqaykimanta willay", spanishText: "Hablar con él, contarle de tus compras", nextScene: 9 }
          ]
        },
        {
          quechuaText: "Qatuman ripusqaykimanta tukuyta yachanki: imayna rantikuna, imayna rimakunapas. Sumaq p'unchay kasqa.",
          spanishText: "De tu visita al mercado aprendiste todo: cómo comprar, cómo hablar. Ha sido un buen día.",
          image: "",
          choices: [
            { quechuaText: "Tukuriy", spanishText: "Finalizar", nextScene: 10 }
          ]
        }
      ],
      updatedAt: new Date().toISOString()
    };

    // Narrativa 4: El Misterio del Lago Titicaca
    const narrativa4 = {
      title: "El Misterio del Lago Titicaca",
      description: "Explora los secretos del legendario Lago Titicaca, enfrenta desafíos y descubre la antigua conexión entre sus aguas y las estrellas.",
      category: "adventure",
      duration: "15-25",
      coverImage: "",
      choices: 18,
      scenes: [
        {
          quechuaText: "Quchampa patampi tiyashanki. Titicaca qucha ancha hatunmi, ch'akisqa kasqa kay watapiqa. Qan maskachkanki ima kasqantapas.",
          spanishText: "Estás a orillas del lago. El Titicaca es muy grande, pero ha bajado su nivel este año. Buscas entender qué está pasando.",
          image: "",
          choices: [
            { quechuaText: "Chalwaqkunata tapuy", spanishText: "Preguntar a los pescadores", nextScene: 1 },
            { quechuaText: "Quchata qhawariy", spanishText: "Observar el lago", nextScene: 2 }
          ]
        },
        {
          quechuaText: "Chalwaqkunata tapuptiki, nisunki: 'Yaku runakuna phiñasqa kanku, chayrayku yaku pisiyachkan'.",
          spanishText: "Al preguntar a los pescadores, te dicen: 'Los espíritus del agua están enojados, por eso está bajando el agua'.",
          image: "",
          choices: [
            { quechuaText: "Yaku runakunata mañakuway", spanishText: "Preguntar cómo aplacar a los espíritus", nextScene: 3 },
            { quechuaText: "Quchaman riy", spanishText: "Ir al lago", nextScene: 4 }
          ]
        },
        {
          quechuaText: "Quchata qhawarispa, huk k'anchata riqsinki unu ukhupi. Munashanki yachayta ima kasqanta.",
          spanishText: "Observando el lago, ves un brillo bajo el agua. Quieres saber qué es.",
          image: "",
          choices: [
            { quechuaText: "Boteta maskamuy", spanishText: "Buscar un bote", nextScene: 4 },
            { quechuaText: "Wamputa maskamuy", spanishText: "Buscar una balsa de totora", nextScene: 5 }
          ]
        },
        {
          quechuaText: "Machu tayta nisunki: 'Qucha chawpipi k'anchaq rumita kutichina tiyan'.",
          spanishText: "Un anciano te dice: 'Hay que devolver la piedra brillante al centro del lago'.",
          image: "",
          choices: [
            { quechuaText: "Rumita maskay", spanishText: "Buscar la piedra", nextScene: 6 },
            { quechuaText: "Manaraq iñiyta atinichu", spanishText: "No puedo creerlo todavía", nextScene: 2 }
          ]
        },
        {
          quechuaText: "Boteman wichapunki. Quchapi purispa, tutayan. Huk k'anchata qatipanki.",
          spanishText: "Subes a un bote. Navegando en el lago, anochece. Sigues un brillo.",
          image: "",
          choices: [
            { quechuaText: "K'anchayta qatiy", spanishText: "Seguir el brillo", nextScene: 7 },
            { quechuaText: "Kutiriy pataman", spanishText: "Volver a la orilla", nextScene: 1 }
          ]
        },
        {
          quechuaText: "Wampu kasqa laduykipi. Huk machu taytapas hampuchkasqa, paymi willasunki: 'Ñuqawanpas risun'.",
          spanishText: "Había una balsa de totora cerca. Un anciano venía también y te dice: 'Vamos juntos'.",
          image: "",
          choices: [
            { quechuaText: "Paywan riy", spanishText: "Ir con él", nextScene: 7 },
            { quechuaText: "Sapallayki riy", spanishText: "Ir solo", nextScene: 4 }
          ]
        },
        {
          quechuaText: "Llaqtapi tapushanki, maypicha k'anchaq rumi kasqanta. Huk sipas willasunki: 'Q'omer wasiyoq qhatuqmi apasqa'.",
          spanishText: "En el pueblo preguntas dónde está la piedra brillante. Una joven te dice: 'Se la llevó un comerciante de casa verde'.",
          image: "",
          choices: [
            { quechuaText: "Q'omer wasita maskay", spanishText: "Buscar la casa verde", nextScene: 8 },
            { quechuaText: "Sipasta mañakuy yanapanawanpaq", spanishText: "Pedirle a la joven que te ayude", nextScene: 9 }
          ]
        },
        {
          quechuaText: "K'anchay quchamanta lloqsispa, ch'aska hina riqchakapun. Chaypi willasunki: 'Quri rumita kutichinki chawpi quchaman'.",
          spanishText: "El brillo sale del lago y parece una estrella. Allí te dice: 'Debes devolver la piedra dorada al centro del lago'.",
          image: "",
          choices: [
            { quechuaText: "Rumita maskaq kutiy", spanishText: "Volver a buscar la piedra", nextScene: 6 },
            { quechuaText: "Mañakuy astawan willawananpaq", spanishText: "Pedir que te cuente más", nextScene: 10 }
          ]
        },
        {
          quechuaText: "Q'omer wasita tarispa, qhatuqta riqsinki. Paypa ukhupipas k'anchaq rumi kachkasqa, punkutapas wichq'arusqa.",
          spanishText: "Encontrando la casa verde, conoces al comerciante. Él tiene la piedra brillante adentro y ha cerrado la puerta.",
          image: "",
          choices: [
            { quechuaText: "Qolqeta quy rumimanta", spanishText: "Ofrecer dinero por la piedra", nextScene: 11 },
            { quechuaText: "Tuta suwakamuy", spanishText: "Intentar robarla por la noche", nextScene: 12 }
          ]
        },
        {
          quechuaText: "Sipas yanapasunki q'omer wasata maskaspa. Paymi ñanta riqsisqa kasqa.",
          spanishText: "La joven te ayuda a buscar la casa verde. Ella conocía el camino.",
          image: "",
          choices: [
            { quechuaText: "Q'omer wasiman chayay", spanishText: "Llegar a la casa verde", nextScene: 8 }
          ]
        },
        {
          quechuaText: "Ch'aska willasunki: 'Qucha rumiqa ch'askakunawan rimanakun. Ch'akisqa kaptinmi, pacha muyuy t'ikrun'.",
          spanishText: "La estrella te dice: 'La piedra del lago se comunica con las estrellas. Si se seca, el balance del mundo se rompe'.",
          image: "",
          choices: [
            { quechuaText: "Rumita kutichiy munani", spanishText: "Quiero devolver la piedra", nextScene: 6 }
          ]
        },
        {
          quechuaText: "Qhatuq chaski qolqeykita, k'anchaq rumita qosunki. 'Manan yachanichu imapaqcha munanki' nispa qhawasunki.",
          spanishText: "El comerciante toma tu dinero y te da la piedra brillante. Te mira diciendo: 'No sé para qué la quieres'.",
          image: "",
          choices: [
            { quechuaText: "Quchaman apay", spanishText: "Llevarla al lago", nextScene: 13 }
          ]
        },
        {
          quechuaText: "Tuta wasiman yaykuptiki, qhatuq riqch'arun. '¡Suwa, suwa!' nispa qaparin. Llaqta runakuna hap'isunki.",
          spanishText: "Cuando entras a la casa de noche, el comerciante se despierta. Grita '¡Ladrón, ladrón!' La gente del pueblo te atrapa.",
          image: "",
          choices: [
            { quechuaText: "Willakuy imaraykun kaypi kasqaykita", spanishText: "Explicar por qué estás ahí", nextScene: 14 }
          ]
        },
        {
          quechuaText: "K'anchaq rumintinmi boteman yaykushkanki. Qucha chawpiman rishpayki, tutayaykun. Ch'askakunallaña k'anchamun.",
          spanishText: "Con la piedra brillante, subes al bote. Al llegar al centro del lago, oscurece. Solo las estrellas iluminan.",
          image: "",
          choices: [
            { quechuaText: "Rumita quchaman wikch'uy", spanishText: "Tirar la piedra al lago", nextScene: 15 },
            { quechuaText: "Chayllapi suyay", spanishText: "Esperar ahí", nextScene: 16 }
          ]
        },
        {
          quechuaText: "Willakuptiykiqa, huk machu runa ninku: 'Cheqaqtacha rimachkan'. Manaraqpas qhatuqmi willakun rumita rantikusqanta.",
          spanishText: "Al explicar, un anciano dice: 'Tal vez dice la verdad'. Además, el comerciante admite que compró la piedra.",
          image: "",
          choices: [
            { quechuaText: "Qhatuqman qolqeta quy", spanishText: "Pagar al comerciante", nextScene: 11 },
            { quechuaText: "Mañakuy rumita kutichiy", spanishText: "Pedir que devuelva la piedra", nextScene: 13 }
          ]
        },
        {
          quechuaText: "Rumita quchaman wikch'uptiyki, unu ukhupi chinkapun. Qhepanpiqa, k'ancharikamuspa, unu ukhuman chinkarikapun.",
          spanishText: "Al lanzar la piedra al lago, desaparece en el agua. Luego, brilla intensamente y se sumerge.",
          image: "",
          choices: [
            { quechuaText: "Quchapa patanman kutiy", spanishText: "Volver a la orilla", nextScene: 17 }
          ]
        },
        {
          quechuaText: "Suyaptiyki, quchamanta ch'uya k'ancha lloqsimun. Paymi nisunki: 'Kutichinki Titicaca quchaman kawsayninta'.",
          spanishText: "Al esperar, sale una luz clara del lago. Te dice: 'Has devuelto la vida al lago Titicaca'.",
          image: "",
          choices: [
            { quechuaText: "Quchapa patanman kutiy", spanishText: "Volver a la orilla", nextScene: 17 }
          ]
        },
        {
          quechuaText: "P'unchaykuptinqa, quchaman qhawarispayki, yakuqa wiñarichkanña. Chalwaqkunaqa kusisqa kallanku. Qampas kusisqallataq kachkanki, riqsisqayki Titicaca quchapa mist'iriyunta.",
          spanishText: "Al amanecer, mirando al lago, ves que el agua está subiendo. Los pescadores están felices. Tú también estás feliz por haber conocido el misterio del lago Titicaca.",
          image: "",
          choices: [
            { quechuaText: "Tukuriy", spanishText: "Finalizar", nextScene: 18 }
          ]
        }
      ],
      updatedAt: new Date().toISOString()
    };

    // Agregar las narrativas a Firestore
    const narrativesCollection = db.collection('narratives');
    
    const docRef1 = await narrativesCollection.add(narrativa1);
    console.log("Narrativa 1 añadida con ID: ", docRef1.id);
    
    const docRef2 = await narrativesCollection.add(narrativa2);
    console.log("Narrativa 2 añadida con ID: ", docRef2.id);
    
    const docRef3 = await narrativesCollection.add(narrativa3);
    console.log("Narrativa 3 añadida con ID: ", docRef3.id);
    
    const docRef4 = await narrativesCollection.add(narrativa4);
    console.log("Narrativa 4 añadida con ID: ", docRef4.id);
    
    console.log("Todas las narrativas se han añadido correctamente");
    
  } catch (error) {
    console.error("Error al añadir narrativas:", error);
  }
}

// Ejecutar la función
addNarratives().then(() => {
  console.log("Proceso completado");
}).catch((error) => {
  console.error("Error en el proceso:", error);
});