window.onload = function () {
  const arrecadado = 12344;
  const meta = 30000;
  const porcentagem = (arrecadado / meta) * 100;
  document.getElementById("progress").style.width = porcentagem + "%";
};

function selecionarValor(valor) {
  document.getElementById("valor").value = valor;
}

async function gerarPix() {
  const valor = parseFloat(document.getElementById("valor").value);

  if (!valor || valor < 1) {
    alert("Digite um valor válido");
    return;
  }

  const response = await fetch("/api/createPix", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: valor })
  });

  const data = await response.json();
  const qrcodeDiv = document.getElementById("qrcode");
  qrcodeDiv.innerHTML = "";

  if (data.qrcodeUrl && data.qrcodeUrl.startsWith("base64:")) {
    const base64 = data.qrcodeUrl.replace("base64:", "");
    qrcodeDiv.innerHTML = `
      <img src="data:image/png;base64,${base64}" width="250">
      <p><strong>Escaneie o QR Code</strong></p>
    `;
  }

  if (data.copyPaste) {
    qrcodeDiv.innerHTML += `
      <textarea id="pixCode" readonly style="width:90%;height:80px;margin-top:10px;">
${data.copyPaste}
      </textarea>
      <br>
      <button onclick="copiarPix()">Copiar código PIX</button>
    `;
  }

  if (data.transactionId) {
    verificarPagamento(data.transactionId);
  }
}

function copiarPix() {
  const textarea = document.getElementById("pixCode");
  textarea.select();
  document.execCommand("copy");
  alert("Código PIX copiado!");
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
      alert("Pagamento confirmado! Obrigado por ajudar ❤️");
    }
  }, 5000);
}
