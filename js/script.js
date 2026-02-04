document.getElementById("year").textContent =
  new Date().getFullYear();

function handleCTA() {
  const el = document.getElementById("como-funciona");
  if (el) el.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

document.getElementById("ctaHero")
  .addEventListener("click", handleCTA);

document.getElementById("ctaFooter")
  .addEventListener("click", handleCTA);
