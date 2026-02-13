exports.handler = async (event) => {
  const { amount } = JSON.parse(event.body);

  const response = await fetch("https://api.elitepaybr.com/api/v1/deposit", {
    method: "POST",
    headers: {
      "x-client-id": process.env.CLIENT_ID,
      "x-client-secret": process.env.CLIENT_SECRET,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount,
      paymentMethod: "PIX"
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
