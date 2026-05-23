export class Modal {
  #dialog;
  #urlap;

  constructor(id, html) {
    this.#dialog = document.createElement("dialog");
    this.#dialog.id = id;
    this.#dialog.innerHTML = html;
    document.body.appendChild(this.#dialog);
    this.#urlap = this.#dialog.querySelector("form");
  }

  get urlap() {
    return this.#urlap;
  }
  get dialog() {
    return this.#dialog;
  }

  keres(szelektor) {
    return this.#dialog.querySelector(szelektor);
  }
  keresOsszes(szelektor) {
    return this.#dialog.querySelectorAll(szelektor);
  }

  megnyit() {
    this.#dialog.showModal();
  }
  bezar() {
    this.#dialog.close();
  }
}
