window.onload = function() {
  const arrecadado = 12344;
  const meta = 30000;
  const porcentagem = (arrecadado / meta) * 100;
  document.getElementById("progress").style.width = porcentagem + "%";
};

async function gerarPix() {
  const valor = parseFloat(document.getElementById("valor").value);

  const response = await fetch("/api/createPix", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: valor })
  });

  const data = await response.json();

  console.log("RESPOSTA API:", data);

  alert(JSON.stringify(data));
}


  if (data.qrCode) {
    document.getElementById("qrcode").innerHTML =
      `<img src="data:image/png;base64,${data.qrCode}" width="250" />`;

    verificarPagamento(data.transactionId);
  }
}

async function verificarPagamento(transactionId) {
  const interval = setInterval(async () => {

    const response = await fetch("/api/checkPayment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId })
    });

    const data = await response.json();

    if (data.transaction?.transactionState === "COMPLETO") {
      clearInterval(interval);
      alert("Pagamento confirmado! Obrigado ❤️");
    }

  }, 5000);
}
