export function modalHatterInicializal() {
  const hatter = document.getElementById("modal-hatter");
  const body = document.body;

  document.querySelectorAll("dialog").forEach((dialog) => {
    const observer = new MutationObserver(() => {
      const vanNyitott = [...document.querySelectorAll("dialog")].some(
        (d) => d.open,
      );
      hatter.style.display = vanNyitott ? "block" : "none";
      body.style.overflow = vanNyitott ? "hidden" : "";
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
  });
}

export function navigacioInicializal() {
  const linkek = document.querySelectorAll(".oldalso-menu a");

  const cikkek = [
    document.querySelector(".todo"),
    document.querySelector(".naptar-article"),
    document.querySelector(".achievements"),
  ];

  linkek.forEach((link, i) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      cikkek.forEach((cikk) => {
        if (cikk) {
          cikk.classList.add("hidden");
        }
      });

      if (cikkek[i]) {
        cikkek[i].classList.remove("hidden");
      }
    });
  });
}
