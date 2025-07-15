import { writable } from 'svelte/store';

// ==================
// LISTA DE 120 TEMAS
// ==================
const temasBase = [
  { tema: "Ciencia", subtema: "Descubrimiento del ADN" },
  { tema: "Historia", subtema: "El Renacimiento" },
  { tema: "Tecnología", subtema: "Internet y redes sociales" },
  { tema: "Sociedad", subtema: "Voluntariado y filantropía" },
  { tema: "Artes", subtema: "Cine y narración visual" },
  { tema: "Cultura", subtema: "Festividades internacionales" },
  { tema: "Economía", subtema: "Microcréditos" },
  { tema: "Política", subtema: "Democracia y voto" },
  { tema: "Medioambiente", subtema: "Desarrollo sostenible" },
  { tema: "Salud", subtema: "Alimentación saludable" },
  { tema: "Educación", subtema: "Educación STEM" },
  { tema: "Ciencia", subtema: "Teoría de la evolución" },
  { tema: "Historia", subtema: "La abolición de la esclavitud" },
  { tema: "Tecnología", subtema: "Transporte ferroviario" },
  { tema: "Sociedad", subtema: "Movimientos migratorios" },
  { tema: "Artes", subtema: "Pintura impresionista" },
  { tema: "Cultura", subtema: "Gastronomía global" },
  { tema: "Economía", subtema: "Inflación y precios" },
  { tema: "Política", subtema: "Participación ciudadana" },
  { tema: "Medioambiente", subtema: "Efecto invernadero" },
  { tema: "Salud", subtema: "Salud mental" },
  { tema: "Educación", subtema: "Aprendizaje a distancia" },
  { tema: "Ciencia", subtema: "Investigación espacial" },
  { tema: "Historia", subtema: "El Imperio Romano" },
  { tema: "Tecnología", subtema: "El desarrollo de la imprenta" },
  { tema: "Sociedad", subtema: "Derechos civiles" },
  { tema: "Artes", subtema: "Danza contemporánea" },
  { tema: "Cultura", subtema: "Diversidad lingüística" },
  { tema: "Economía", subtema: "Mercados globales" },
  { tema: "Política", subtema: "Sufragio femenino" },
  { tema: "Medioambiente", subtema: "Protección de especies en peligro" },
  { tema: "Salud", subtema: "Prevención de enfermedades" },
  { tema: "Educación", subtema: "Educación inclusiva" },
  { tema: "Ciencia", subtema: "Vacunas y salud pública" },
  { tema: "Historia", subtema: "La independencia de India" },
  { tema: "Tecnología", subtema: "Inteligencia artificial" },
  { tema: "Sociedad", subtema: "Desigualdad económica" },
  { tema: "Artes", subtema: "La música clásica" },
  { tema: "Cultura", subtema: "El papel de los museos" },
  { tema: "Economía", subtema: "Historia del comercio" },
  { tema: "Política", subtema: "Organismos internacionales" },
  { tema: "Medioambiente", subtema: "Deforestación" },
  { tema: "Salud", subtema: "Sistemas de salud públicos" },
  { tema: "Educación", subtema: "Alfabetización digital" },
  { tema: "Ciencia", subtema: "Cambio climático" },
  { tema: "Historia", subtema: "La revolución industrial" },
  { tema: "Tecnología", subtema: "Energía renovable" },
  { tema: "Sociedad", subtema: "El papel de la mujer en el siglo XXI" },
  { tema: "Artes", subtema: "Fotografía digital" },
  { tema: "Cultura", subtema: "Tradiciones orales" },
  { tema: "Economía", subtema: "Economía circular" },
  { tema: "Política", subtema: "Constituciones modernas" },
  { tema: "Medioambiente", subtema: "Reciclaje y gestión de residuos" },
  { tema: "Salud", subtema: "Ejercicio físico y bienestar" },
  { tema: "Educación", subtema: "Historia de la universidad" },
  { tema: "Ciencia", subtema: "Neurociencia" },
  { tema: "Historia", subtema: "Guerras mundiales" },
  { tema: "Tecnología", subtema: "Robótica" },
  { tema: "Sociedad", subtema: "Crecimiento urbano" },
  { tema: "Artes", subtema: "Escultura contemporánea" },
  { tema: "Cultura", subtema: "Patrimonios de la humanidad" },
  { tema: "Economía", subtema: "Desigualdad global" },
  { tema: "Política", subtema: "Sistemas parlamentarios" },
  { tema: "Medioambiente", subtema: "Calentamiento global" },
  { tema: "Salud", subtema: "Vacunación infantil" },
  { tema: "Educación", subtema: "Educación ambiental" },
  { tema: "Ciencia", subtema: "Genética moderna" },
  { tema: "Historia", subtema: "El descubrimiento de América" },
  { tema: "Tecnología", subtema: "Aplicaciones móviles" },
  { tema: "Sociedad", subtema: "Desplazamiento forzado" },
  { tema: "Artes", subtema: "Teatro clásico" },
  { tema: "Cultura", subtema: "Cocina tradicional" },
  { tema: "Economía", subtema: "Comercio electrónico" },
  { tema: "Política", subtema: "Paz y tratados internacionales" },
  { tema: "Medioambiente", subtema: "Agua potable y recursos hídricos" },
  { tema: "Salud", subtema: "Nutrición infantil" },
  { tema: "Educación", subtema: "Bilingüismo y aprendizaje de idiomas" },
  { tema: "Ciencia", subtema: "Biología marina" },
  { tema: "Historia", subtema: "Civilizaciones antiguas" },
  { tema: "Tecnología", subtema: "Tecnología agrícola" },
  { tema: "Sociedad", subtema: "Envejecimiento poblacional" },
  { tema: "Artes", subtema: "Arte urbano" },
  { tema: "Cultura", subtema: "Filosofía clásica" },
  { tema: "Economía", subtema: "Sostenibilidad financiera" },
  { tema: "Política", subtema: "Derechos humanos" },
  { tema: "Medioambiente", subtema: "Bosques y biodiversidad" },
  { tema: "Salud", subtema: "Salud pública global" },
  { tema: "Educación", subtema: "Formación docente" },
  { tema: "Ciencia", subtema: "Química verde" },
  { tema: "Historia", subtema: "Movimientos sociales del siglo XX" },
  { tema: "Tecnología", subtema: "Impresión 3D" },
  { tema: "Sociedad", subtema: "Tolerancia y diversidad" },
  { tema: "Artes", subtema: "Arquitectura sostenible" },
  { tema: "Cultura", subtema: "Mitos y leyendas" },
  { tema: "Economía", subtema: "Emprendimiento juvenil" },
  { tema: "Política", subtema: "Relaciones internacionales" },
  { tema: "Medioambiente", subtema: "Zonas protegidas" },
  { tema: "Salud", subtema: "Hábitos saludables" },
  { tema: "Educación", subtema: "Aprendizaje permanente" }
  // Si quieres puedes expandir a 150+ con la misma lógica
];

// ======
// SHUFFLE
// ======
function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ==========================
// STORE DE TEMAS PARA EL TEST
// ==========================
function createTemasStore() {
  // Shuffle al crear store para máxima variedad
  let shuffled = shuffle(temasBase);
    let usedIndices = new Set<number>();
  const { subscribe, set, update } = writable(shuffled);


  return {
    subscribe,
    reset: () => {
      shuffled = shuffle(temasBase);
      set(shuffled);
      usedIndices = new Set();
    },
    nextTema: () => {
      let index = 0;
      let tema = null;
      update(arr => {
        while (usedIndices.has(index) && index < arr.length) index++;
        if (index >= arr.length) return arr; // Todos usados
        tema = arr[index];
        usedIndices.add(index);
        return arr;
      });
      return tema;
    },
    isAllUsed: () => usedIndices.size >= temasBase.length,
    getUnusedList: () => {
      let arr;
      subscribe(value => arr = value)();
      return arr.filter((_, i) => !usedIndices.has(i));
    }
  };
}

export const temasStore = createTemasStore();
