exports.handler = async () => {
  return {
    statusCode: 200,
    headers: {
      "Set-Cookie": "session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
    },
    body: JSON.stringify({
      success: true,
      message: "Erfolgreich abgemeldet"
    })
  };
};