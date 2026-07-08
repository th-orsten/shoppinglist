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
          message: "Kein Passwort angegeben",
        }),
      };
    }

    // Blob Store der aktuellen Netlify-Seite verwenden
    const store = getStore("shopping");

    const passwordHash = await store.get("passwordHash");

    if (!passwordHash) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: "Kein Passwort eingerichtet",
        }),
      };
    }

    const ok = await bcrypt.compare(password, passwordHash);

    if (!ok) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: "Falsches Passwort",
        }),
      };
    }

    const sessionId = crypto.randomBytes(32).toString("hex");

    await store.set(
      `session-${sessionId}`,
      JSON.stringify({
        created: Date.now(),
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Set-Cookie":
          `session=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Secure`,
      },
      body: JSON.stringify({
        success: true,
      }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message,
      }),
    };
  }
};