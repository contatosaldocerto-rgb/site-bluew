/* =========================
   CONFIG (EDITE AQUI)
========================= */

// Link do CTA final (ex: WhatsApp, Checkout, App Store, etc.)
const CTA_PHONE = "5511932788119";
const CTA_TEXT  = "Quero ter meu dinheiro em dia!";
const CTA_LINK  = `https://wa.me/${CTA_PHONE}?text=${encodeURIComponent(CTA_TEXT)}`;

// Faixas: use valores "representativos" (média) para cálculo
const RECEITA_OPCOES = [
  { label: "R$ 1.500 – 2.500", value: 2000 },
  { label: "R$ 2.500 – 3.500", value: 3000 },
  { label: "R$ 3.500 – 4.500", value: 4000 },
  { label: "R$ 4.500 ou mais", value: 5200 }
];

const GASTOS_OPCOES = [
  { label: "Até R$ 1.000", value: 900 },
  { label: "R$ 1.000 – 1.800", value: 1500 },
  { label: "R$ 1.800 – 2.500", value: 2200 },
  { label: "Mais de R$ 2.500", value: 2800 }
];

const OBJETIVO_OPCOES = [
  { label: "R$ 500", value: 500 },
  { label: "R$ 1.000", value: 1000 },
  { label: "R$ 2.000", value: 2000 },
  { label: "R$ 3.000 ou mais", value: 3000 }
];

// Regra do saldo seguro
const SAFE_FACTOR = 0.8;
const DIAS_NO_MES = 30;

/* =========================
   CHAT ENGINE
========================= */

const chat = document.getElementById("chat");
let receita = null;
let gastos = null;
let objetivo = null;

function scrollDown(){
  chat.scrollTop = chat.scrollHeight;
}

function addBubble(text, who="bot"){
  const div = document.createElement("div");
  div.className = `bubble ${who}`;
  div.innerHTML = text;
  chat.appendChild(div);
  scrollDown();
  return div;
}

function addTyping(){
  return addBubble(
    `<span class="typing">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </span>`,
    "bot"
  );
}

function delay(ms){
  return new Promise(res => setTimeout(res, ms));
}

function fmtBRL(n){
  return "R$ " + n.toFixed(2).replace(".", ",");
}

function addOptions(list, onPick){
  const wrap = document.createElement("div");
  wrap.className = "options";

  const hint = document.createElement("div");
  hint.className = "bubble bot muted";
  hint.innerHTML = "Não precisa ser exato. Escolha a opção mais próxima 👇";
  chat.appendChild(hint);

  list.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "opt";
    btn.innerText = item.label;
    btn.onclick = () => {
      wrap.remove();
      hint.remove();
      addBubble(item.label, "user");
      onPick(item.value);
    };
    wrap.appendChild(btn);
  });

  chat.appendChild(wrap);
  scrollDown();
}

/* =========================
   FLOW
========================= */

async function start(){
  addBubble("Oi 🙂");
  await delay(420);

  addBubble("Em poucos segundos você vai saber quanto pode gastar hoje.");
  await delay(620);

  addBubble("Pra começar, quanto gostaria que sobrasse no fim do mês?");
  await delay(420);

  addOptions(OBJETIVO_OPCOES, async (val) => {
    objetivo = val;

    let t = addTyping();
    await delay(520);
    t.remove();

    addBubble("Perfeito. Isso já ajuda bastante.");
    await delay(520);

    addBubble("Quanto costuma ganhar por mês?<br><span class='muted'>Pode ser uma média.</span>");
    await delay(520);

    addOptions(RECEITA_OPCOES, async (val) => {
      receita = val;

      t = addTyping();
      await delay(520);
      t.remove();

      addBubble("Perfeito. Aproximação já resolve.");
      await delay(520);

      addBubble("E seus gastos fixos mensais?<br><span class='muted'>Aluguel, contas, internet, compromissos...</span>");
      await delay(420);

      addOptions(GASTOS_OPCOES, async (val2) => {
        gastos = val2;

        t = addTyping();
        await delay(520);
        t.remove();

        addBubble("Deixa eu cuidar disso pra você…");

        t = addTyping();
        await delay(900);
        t.remove();

        showAha();
      });
    });
  });
}

function showAha(){
  const saldoMensal = Math.max(0, receita - gastos);
  const saldoDiaSeguro = (saldoMensal / DIAS_NO_MES) * SAFE_FACTOR;
  const saldoSemana = saldoDiaSeguro * 7;
  const margemSeguranca = (saldoDiaSeguro / SAFE_FACTOR) - saldoDiaSeguro;

  addBubble(
    `Perfeito. Com base no que você me contou:
     <div class="aha">
       <div class="label">Saldo seguro de hoje</div>
       <div class="value">${fmtBRL(saldoDiaSeguro)}</div>
       <div class="muted" style="margin-top:6px">
         Guardando esse valor por 7 dias, você terá <strong>${fmtBRL(saldoSemana)}</strong>.
       </div>
       <div class="muted" style="margin-top:6px">
         Ainda sobra <strong>${fmtBRL(margemSeguranca)}</strong> de margem.
       </div>
     </div>`,
    "bot"
  );

  postAha();
}

async function postAha(){
  let t = addTyping();
  await delay(650);
  t.remove();

  addBubble("Se você chegar perto desse valor, eu te aviso antes do susto.");
  await delay(700);

  addBubble("<span class='ok'>Mais controle.</span> Menos ansiedade.");
  await delay(750);

  addBubble("Quer ver isso todo dia no seu Whatsapp?");
  renderCTA();
}

function renderCTA(){
  const wrap = document.createElement("div");
  wrap.className = "ctaWrap";

  const btn = document.createElement("button");
  btn.className = "ctaBtn";
  btn.innerText = "Quero ver meu saldo todo dia";
  btn.onclick = () => window.location.href = CTA_LINK;

  const foot = document.createElement("div");
  foot.className = "footnote";
  foot.innerText = "Sem pressão. Você testa grátis e decide.";

  wrap.appendChild(btn);
  wrap.appendChild(foot);

  const bubble = document.createElement("div");
  bubble.className = "bubble bot";
  bubble.appendChild(wrap);

  chat.appendChild(bubble);
  scrollDown();
}

start();
