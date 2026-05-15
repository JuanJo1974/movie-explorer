const API_KEY = process.env.GNEWS_API_KEY;
const ALLOWED_ORIGIN = 'https://cineypelis.netlify.app';

exports.handler = async (event) => {
  const origin = event.headers?.origin || '';
  const corsOrigin = origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : '';

  if (!corsOrigin) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ articles: [] }) };
  }

  const lang = event.queryStringParameters?.lang || 'es';
  const url = `https://gnews.io/api/v4/top-headlines?topic=technology&lang=${lang}&max=20&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': corsOrigin
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': corsOrigin },
      body: JSON.stringify({ articles: [] })
    };
  }
};
