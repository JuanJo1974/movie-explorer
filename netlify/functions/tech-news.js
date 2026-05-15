const API_KEY = 'b9cff31dabba28d716b92e84fa3eef3c';

exports.handler = async (event) => {
  const lang = event.queryStringParameters?.lang || 'es';
  const url = `https://gnews.io/api/v4/top-headlines?topic=technology&lang=${lang}&max=20&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ articles: [] })
    };
  }
};
