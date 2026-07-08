const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    const { password } = JSON.parse(event.body || "{}");

    if (!password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "Kein Passwort angegeben"
        })
      };
    }

    const store = getStore({
      name: "shopping",
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN
    });

    const passwordHash = await store.get("passwordHash");

    if (!passwordHash) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: "Kein Passwort eingerichtet"
        })
      };
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      passwordHash
    );

    if (!passwordCorrect) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: "Falsches Passwort"
        })
      };
    }

    const sessionId = crypto.randomBytes(32).toString("hex");

    await store.set(
      `session-${sessionId}`,
      JSON.stringify({
        created: Date.now()
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `session=${sessionId}; Path=/; HttpOnly; SameSite=Strict`
      },
      body: JSON.stringify({
        success: true,
        message: "Login erfolgreich"
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