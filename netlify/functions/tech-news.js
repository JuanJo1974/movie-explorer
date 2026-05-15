const API_KEY = process.env.GNEWS_API_KEY;
const ALLOWED_ORIGIN = 'https://cineypelis.netlify.app';

exports.handler = async (event) => {
  const origin = event.headers?.origin || '';

  // Bloquear peticiones de dominios externos no permitidos
  if (origin && origin !== ALLOWED_ORIGIN) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ articles: [] }) };
  }

  const lang = event.queryStringParameters?.lang || 'es';
  const url = `https://gnews.io/api/v4/top-headlines?topic=technology&lang=${lang}&max=20&apikey=${API_KEY}`;

  const corsHeaders = origin
    ? { 'Access-Control-Allow-Origin': origin }
    : {};

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ articles: [] })
    };
  }
};
