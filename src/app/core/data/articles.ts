export interface Article {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export const ARTICLES: Article[] = [
  {
    slug: 'mejores-peliculas-en-cartelera',
    title: 'Las mejores películas en cartelera ahora mismo',
    date: '2026-05-15',
    excerpt: 'Repasamos los estrenos más destacados que puedes ver hoy en tu cine más cercano: acción, drama, animación y mucho más.',
    content: `
      <p>Si estás buscando un plan para el fin de semana, el cine siempre es una apuesta segura. Estos son los títulos que más están dando que hablar en la cartelera actual.</p>

      <h2>Acción y aventura</h2>
      <p>El género de acción nunca falla. Esta temporada hay varios títulos que combinan efectos visuales espectaculares con historias que enganchan desde el primer minuto. Si buscas adrenalina y ritmo sin parar, el cine de acción actual no te decepcionará.</p>

      <h2>Drama con mayúsculas</h2>
      <p>Para quienes prefieren algo más pausado y con profundidad, el drama está viviendo un momento excelente. Las producciones europeas y latinoamericanas están ofreciendo algunas de las mejores historias de los últimos años, con actuaciones que merecen todos los premios.</p>

      <h2>Cine de animación para toda la familia</h2>
      <p>La animación sigue siendo uno de los géneros más creativos del cine actual. Las últimas producciones demuestran que las películas de animación no son solo para niños: las historias, la factura visual y los mensajes están pensados para emocionar a cualquier edad.</p>

      <h2>¿Cómo elegir qué ver?</h2>
      <p>En CinesYPelis puedes consultar la cartelera actualizada, ver las valoraciones de cada película y descubrir en qué plataformas están disponibles si prefieres verlas desde casa. Explora la sección <a href="/">En cartelera</a> para no perderte ningún estreno.</p>
    `
  },
  {
    slug: 'proximos-estrenos-que-no-te-puedes-perder',
    title: 'Próximos estrenos de cine que no te puedes perder en 2026',
    date: '2026-05-15',
    excerpt: 'Adelantamos los estrenos más esperados de los próximos meses: secuelas, grandes producciones y joyas independientes que llegarán a la cartelera muy pronto.',
    content: `
      <p>El calendario de estrenos de 2026 promete ser uno de los más intensos de los últimos años. Grandes estudios e independientes han preparado una agenda cargada de títulos para todos los gustos.</p>

      <h2>Las secuelas más esperadas</h2>
      <p>Las franquicias consolidadas siguen siendo el motor del cine comercial. Este año llegan nuevas entregas de sagas que llevan años generando expectación. Los fans llevan meses siguiendo cada detalle de los rodajes, y los primeros tráilers ya han disparado la anticipación.</p>

      <h2>Cine independiente en alza</h2>
      <p>Más allá de las superproducciones, el cine independiente ofrece algunas de las sorpresas más gratificantes del año. Directores emergentes y propuestas arriesgadas que no tienen miedo de contar historias diferentes y necesarias.</p>

      <h2>Animación y familia</h2>
      <p>Los estudios de animación tienen preparados varios títulos muy ambiciosos para los próximos meses. Nuevos mundos, personajes entrañables y historias que mezclan humor y emoción a partes iguales.</p>

      <h2>Mantente al día</h2>
      <p>En CinesYPelis actualizamos la sección de <a href="/">Próximos estrenos</a> cada semana para que no te pierdas ningún estreno importante. Añade tus películas favoritas a tu lista y tenlas siempre a mano.</p>
    `
  },
  {
    slug: 'como-encontrar-donde-ver-una-pelicula-online',
    title: 'Cómo encontrar dónde ver una película online en España',
    date: '2026-05-15',
    excerpt: 'Netflix, HBO Max, Prime Video, Disney+... saber en qué plataforma está cada película puede ser un quebradero de cabeza. Te explicamos cómo encontrarlo fácilmente.',
    content: `
      <p>Con tantas plataformas de streaming disponibles hoy en día, encontrar en cuál está una película concreta puede ser frustrante. Te contamos los trucos más prácticos para no perder tiempo buscando.</p>

      <h2>El problema del streaming fragmentado</h2>
      <p>Netflix, HBO Max, Prime Video, Disney+, Movistar+, Apple TV+... el catálogo de plataformas no para de crecer. Una película puede estar en una plataforma en España y en otra diferente en Francia. Además, los catálogos cambian constantemente: un título disponible hoy puede no estarlo mañana.</p>

      <h2>Usa CinesYPelis para saberlo al instante</h2>
      <p>En la ficha de cada película en CinesYPelis puedes ver directamente en qué plataformas está disponible en España. La información se actualiza automáticamente gracias a JustWatch, que rastrea los catálogos de todas las plataformas en tiempo real.</p>
      <p>Solo tienes que buscar el título que quieres ver, abrir su ficha y en la sección "Disponible en" verás los logos de las plataformas donde puedes verla ahora mismo.</p>

      <h2>¿Y si no está en ninguna plataforma?</h2>
      <p>Si una película no está disponible en streaming, siempre puedes alquilarla o comprarla en digital. Desde la ficha de cada película encontrarás también un enlace directo a Amazon para comprarla en versión digital o en Blu-ray.</p>

      <h2>Consejo final</h2>
      <p>Antes de suscribirte a una plataforma nueva solo para ver una película, comprueba si realmente la tiene en su catálogo para España. Los catálogos varían por país y lo que aparece en los anuncios no siempre está disponible en todas las regiones.</p>
    `
  }
];
