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

  console.log("Resposta ElitePay:", data);

  const qrcodeDiv = document.getElementById("qrcode");
  qrcodeDiv.innerHTML = "";

  // ✅ CASO 1 — QR CODE EM BASE64
  if (data.qrcodeUrl && data.qrcodeUrl.startsWith("base64:")) {
    const base64 = data.qrcodeUrl.replace("base64:", "");

    qrcodeDiv.innerHTML = `
      <img src="data:image/png;base64,${base64}" width="250" />
      <p><strong>Escaneie o QR Code para pagar</strong></p>
    `;
  }

  // ✅ CASO 2 — CÓDIGO PIX COPIA E COLA
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
  } else {
    alert("Erro: transação não criada");
  }
}
function copiarPix() {
  const textarea = document.getElementById("pixCode");
  textarea.select();
  document.execCommand("copy");
  alert("Código PIX copiado!");
}
