window.onload = function () {
  var div = document.createElement("div");
  div.setAttribute("vw", "");
  div.setAttribute("class", "enabled");
  div.innerHTML =
    '<div vw-access-button class="active"></div>' +
    '<div vw-plugin-wrapper>' +
      '<div class="vw-plugin-top-wrapper"></div>' +
    '</div>';
  document.body.appendChild(div);

  var script = document.createElement("script");
  script.src   = "https://vlibras.gov.br/app/vlibras-plugin.js";
  script.async = true;
  script.onload = function () {
    new window.VLibras.Widget("https://vlibras.gov.br/app");
  };
  document.head.appendChild(script);
};