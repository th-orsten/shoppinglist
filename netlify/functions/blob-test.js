const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
  try {
    const store = getStore({
      name: "shopping",
      siteID: process.env.SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });

    await store.set("test", "Hallo Thorsten!");

    const value = await store.get("test");

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        value,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};