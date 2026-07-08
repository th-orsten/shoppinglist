exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hallo Thorsten 👋 Deine erste Netlify Function funktioniert!"
    })
  };
};