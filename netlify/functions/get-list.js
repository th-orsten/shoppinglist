const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {

    const cookie = event.headers.cookie || "";
    const match = cookie.match(/session=([^;]+)/);

    if (!match) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Nicht angemeldet"
        })
      };
    }

    const sessionId = match[1];

    const store = getStore({
      name: "shopping",
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN
    });

    const session = await store.get(
      `session-${sessionId}`
    );

    if (!session) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Ungültige Sitzung"
        })
      };
    }

    const list = await store.get("shopping-list");

    return {
      statusCode: 200,
      body: JSON.stringify(
        list ? JSON.parse(list) : []
      )
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };

  }
};