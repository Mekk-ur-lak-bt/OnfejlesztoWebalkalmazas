const API = "/api/kategoriak";

export class KategoriaModal {
  #felhasznaloId;
  #modal;
  #urlap;
  #gomb;

  constructor(felhasznaloId = null) {
    this.#felhasznaloId = felhasznaloId ? Number(felhasznaloId) : null;
    this.#modal = this.#modalLetrehoz();
    this.#gomb = this.#gombLetrehoz();
    this.#esemenyek();
  }

  felhasznaloIdBeallitas(felhasznaloId) {
    this.#felhasznaloId = felhasznaloId ? Number(felhasznaloId) : null;
  }

  #modalLetrehoz() {
    const dialog = document.createElement("dialog");
    dialog.id = "kategoria-modal";
    dialog.innerHTML = `
      <form id="kategoria-urlap">
        <h3>Edit Categories</h3>
        <div id="kategoria-lista"></div>
        <div class="modal-gombok">
          <button type="button" id="kategoria-megse">Cancel</button>
          <button type="submit" id="kategoria-mentes">Save</button>
        </div>
      </form>
    `;
    document.body.appendChild(dialog);
    return dialog;
  }

  #gombLetrehoz() {
    const kontener = document.querySelector(".grafikon-kartya");
    const gomb = document.createElement("button");
    gomb.type = "button";
    gomb.innerHTML = `<span class="material-symbols-outlined">edit</span>`;
    gomb.classList.add("gomb-atnevez");
    kontener.style.position = "relative";
    kontener.appendChild(gomb);
    return gomb;
  }

  #esemenyek() {
    this.#gomb.addEventListener("click", () => this.#megnyit());

    document
      .getElementById("kategoria-megse")
      .addEventListener("click", () => this.#bezar());

    document
      .getElementById("kategoria-urlap")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!this.#felhasznaloId) return;
        const inputs = this.#modal.querySelectorAll("input[data-id]");
        try {
          await Promise.all(
            [...inputs].map((input) =>
              fetch(`${API}/${input.dataset.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nev: input.value.trim() }),
              }).then((v) => {
                if (!v.ok) throw new Error("Mentés sikertelen!");
              }),
            ),
          );
          this.#bezar();
          window.dispatchEvent(new CustomEvent("kategoriaValtozas"));
        } catch (e) {
          console.error(e);
        }
      });
  }

  async #megnyit() {
    if (!this.#felhasznaloId) return;
    const valasz = await fetch(`${API}?felhasznaloId=${this.#felhasznaloId}`);
    if (!valasz.ok) return;
    const kategoriak = await valasz.json();
    const lista = document.getElementById("kategoria-lista");
    lista.innerHTML = "";
    kategoriak.forEach((k) => {
      const label = document.createElement("label");
      label.innerHTML = `
        <span>${k.nev}</span>
        <input type="text" data-id="${k.id}" value="${k.nev}" required />
        <br>
      `;
      lista.appendChild(label);
    });
    this.#modal.showModal();
  }

  #bezar() {
    this.#modal.close();
  }
}
