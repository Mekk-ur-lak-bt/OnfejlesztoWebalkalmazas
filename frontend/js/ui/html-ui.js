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
  const linkek = document.querySelectorAll(".oldalso-menu button");

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

export function demoFigyelmeztetes() {
  const hostname = window.location.hostname;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

  console.log("Hostname:", hostname, "Is this a local usage?:", isLocal);

  if (isLocal) {
    document.querySelector(".seo-rolunk")?.remove();
    document.querySelector(".seo-hogyan-hasznald")?.remove();
    return;
  }

  const kod = `
    <aside class="demo-figyelmeztetes" role="note" aria-label="Demo notice">
      <p>
        <strong>This is a preview demo.</strong> To use the application with
        full functionality, please download the repository and run the backend
        locally (Read more about usage in the repo's readMe file):
        <a
          href="https://github.com/Mekk-ur-lak-bt/OnfejlesztoWebalkalmazas"
          id="repo-letoltesi-link"
          rel="noopener noreferrer">
          Download GitHub Repository
          </a>
      </p>
    </aside>
  `;

  document.body.insertAdjacentHTML("afterbegin", kod);
}
