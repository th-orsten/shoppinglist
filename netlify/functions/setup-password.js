const bcrypt = require("bcryptjs");
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const password = body.password;

    if (!password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Kein Passwort angegeben"
        })
      };
    }

    const hash = await bcrypt.hash(password, 10);

    const store = getStore({
      name: "shopping",
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN
    });

    await store.set("passwordHash", hash);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Passwort wurde gespeichert"
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};