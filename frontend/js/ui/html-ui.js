export function modalHatterInicializal() {
  const hatter = document.getElementById("modal-hatter");

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("open", () => (hatter.style.display = "block"));

    const observer = new MutationObserver(() => {
      const vanNyitott = [...document.querySelectorAll("dialog")].some(
        (d) => d.open,
      );
      hatter.style.display = vanNyitott ? "block" : "none";
    });

    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
  });
}

export function navigacioInicializal() {
  const linkek = document.querySelectorAll(".oldalso-menu a");
  const cikkek = {
    todo: document.querySelector(".todo"),
    naptar: document.querySelector("article.naptar"),
    achievements: document.querySelector(".achievements"),
  };

  const cikkTerkep = [cikkek.todo, cikkek.naptar, cikkek.achievements];

  linkek.forEach((link, i) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      cikkTerkep.forEach((c) => (c.hidden = true));
      cikkTerkep[i].hidden = false;
    });
  });
}
