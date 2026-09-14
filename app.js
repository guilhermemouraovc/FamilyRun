(() => {
  "use strict";

  const form = document.getElementById("form");
  const successCard = document.getElementById("success");
  const erroBox = document.getElementById("erro");
  const resumoEl = document.getElementById("resumo");
  const submitBtn = document.getElementById("submit-btn");
  const novaInscricaoBtn = document.getElementById("nova-inscricao");

  const nomeInput = document.getElementById("nome");
  const nascimentoInput = document.getElementById("nascimento");
  const profissaoInput = document.getElementById("profissao");
  const telefoneInput = document.getElementById("telefone");
  const emailInput = document.getElementById("email");

  const distanciaGroup = document.getElementById("distancia-group");
  const tamanhoGroup = document.getElementById("tamanho-group");

  let distancia = "";
  let tamanho = "";

  // --- máscara de telefone: (81) 90000-0000 ---
  function maskTelefone(value) {
    const d = value.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? "(" + d : "";
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }

  telefoneInput.addEventListener("input", (e) => {
    e.target.value = maskTelefone(e.target.value);
  });

  // --- chips de distância / tamanho ---
  function wireChipGroup(group, onPick) {
    group.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      onPick(btn.dataset.value);
      for (const chip of group.querySelectorAll(".chip")) {
        chip.classList.toggle("active", chip === btn);
      }
      clearError();
    });
  }

  wireChipGroup(distanciaGroup, (value) => { distancia = value; });
  wireChipGroup(tamanhoGroup, (value) => { tamanho = value; });

  function showError(msg) {
    erroBox.textContent = msg;
    erroBox.classList.remove("hidden");
  }

  function clearError() {
    erroBox.textContent = "";
    erroBox.classList.add("hidden");
  }

  function resetForm() {
    form.reset();
    distancia = "";
    tamanho = "";
    for (const chip of form.querySelectorAll(".chip")) chip.classList.remove("active");
    clearError();
  }

  // --- envio para a planilha (Google Apps Script Web App) ---
  async function enviarParaPlanilha(dados) {
    const url = window.FAMILY_RUN_CONFIG && window.FAMILY_RUN_CONFIG.appsScriptUrl;
    if (!url) {
      console.warn(
        "[Family Run] appsScriptUrl não configurada em config.js — a inscrição não foi gravada em nenhuma planilha."
      );
      return;
    }
    // Envio como texto simples evita o preflight de CORS; o Apps Script
    // recebe o corpo em e.postData.contents e faz JSON.parse().
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(dados)
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    const nascimento = nascimentoInput.value;
    const profissao = profissaoInput.value.trim();
    const email = emailInput.value.trim();
    const telefoneDigits = telefoneInput.value.replace(/\D/g, "");

    if (!nome) return showError("Informe seu nome completo.");
    if (!nascimento) return showError("Informe sua data de nascimento.");
    if (!distancia) return showError("Escolha a distância que pretende fazer.");
    if (telefoneDigits.length < 10) return showError("Informe um telefone válido com DDD.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return showError("Informe um e-mail válido.");
    if (!tamanho) return showError("Escolha o tamanho da camisa.");

    clearError();
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    try {
      await enviarParaPlanilha({
        nome,
        nascimento,
        profissao,
        distancia,
        telefone: telefoneInput.value,
        email,
        tamanho
      });

      const primeiro = nome.split(" ")[0];
      resumoEl.textContent =
        primeiro + ", sua vaga na " + distancia + " está garantida. Camisa tamanho " + tamanho + ".";

      form.classList.add("hidden");
      successCard.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      showError("Não foi possível enviar sua inscrição agora. Verifique sua internet e tente de novo.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Garantir minha vaga";
    }
  });

  novaInscricaoBtn.addEventListener("click", () => {
    resetForm();
    successCard.classList.add("hidden");
    form.classList.remove("hidden");
  });
})();
