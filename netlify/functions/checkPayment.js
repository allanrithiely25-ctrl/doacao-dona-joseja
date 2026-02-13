exports.handler = async (event) => {
  const { transactionId } = JSON.parse(event.body);

  const response = await fetch("https://api.elitepaybr.com/api/transactions/check", {
    method: "POST",
    headers: {
      "ci": process.env.CLIENT_ID,
      "cs": process.env.CLIENT_SECRET,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ transactionId })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
