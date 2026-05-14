(function () {
  var NUMERO   = "5511980735936"; 
  var MENSAGEM = encodeURIComponent("Olá! Gostaria de conhecer os serviços. 👍");
  var URL_WA   = "https://wa.me/" + NUMERO + "?text=" + MENSAGEM;

  var svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
    + '<path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.468 2.027 7.77L0 32l8.43-2.007A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.77-1.852l-.485-.29-5.005 1.192 1.21-4.868-.317-.5A13.27 13.27 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.874c-.398-.199-2.356-1.163-2.72-1.295-.365-.133-.63-.199-.896.199-.265.398-1.03 1.295-1.262 1.56-.232.266-.465.3-.863.1-.398-.2-1.68-.619-3.2-1.975-1.183-1.056-1.981-2.36-2.213-2.758-.232-.398-.025-.613.175-.812.179-.178.398-.465.597-.697.2-.233.266-.399.399-.665.133-.266.066-.498-.033-.697-.1-.2-.896-2.159-1.228-2.957-.323-.777-.65-.672-.896-.684l-.763-.013c-.266 0-.697.1-1.062.498-.365.398-1.394 1.362-1.394 3.32 0 1.96 1.428 3.853 1.627 4.12.2.265 2.81 4.291 6.808 6.019.951.41 1.693.655 2.271.839.954.304 1.823.261 2.51.158.766-.114 2.356-.963 2.688-1.894.332-.93.332-1.728.232-1.894-.1-.166-.365-.266-.763-.465z"/>'
    + '</svg>';

  var btn = document.createElement("a");
  btn.id        = "wpp-btn-float";
  btn.href      = URL_WA;
  btn.target    = "_blank";
  btn.rel       = "noopener noreferrer";
  btn.setAttribute("aria-label", "Falar no WhatsApp");
  btn.innerHTML = svgIcon;

  var tip = document.createElement("div");
  tip.id          = "wpp-tooltip";
  tip.textContent = "Fale conosco no WhatsApp";

  document.body.appendChild(btn);
  document.body.appendChild(tip);
})();