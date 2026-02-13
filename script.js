window.onload = function() {
  const arrecadado = 12344;
  const meta = 30000;
  const porcentagem = (arrecadado / meta) * 100;
  document.getElementById("progress").style.width = porcentagem + "%";
};

async function gerarPix() {
  const valor = parseFloat(document.getElementById("valor").value);

  if (valor < 5 || valor > 100) {
    alert("Valor deve ser entre R$5 e R$100");
    return;
  }

  const response = await fetch("/api/createPix", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: valor })
  });

  const data = await response.json();

  console.log("Resposta da API:", data);

  // CASO 1: QR Code em base64
  if (data.qrcodeUrl) {
    const base64 = data.qrcodeUrl.replace("base64:", "");
    document.getElementById("qrcode").innerHTML =
      `<img src="data:image/png;base64,${base64}" width="250">`;
  }

  // CASO 2: Código PIX copia e cola
  else if (data.copyPaste) {
    gerarQrCode(data.copyPaste);
  }

  else {
    alert("Erro ao gerar pagamento PIX");
  }

  if (data.transactionId) {
    verificarPagamento(data.transactionId);
  }
}

function gerarQrCode(texto) {
  document.getElementById("qrcode").innerHTML = "";
  QRCode.toCanvas(
    document.getElementById("qrcode"),
    texto,
    { width: 250 },
    function (error) {
      if (error) console.error(error);
    }
  );
}


  
