const OLDAL = "http://localhost:3000";

describe("Témaválasztó UI", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit(OLDAL);
  });

  function temaModalMegnyit() {
    cy.get("#beallitasok").should("be.visible").click();
    cy.get("#tema-modal").should("be.visible");
  }

  it("a beállítások gomb megnyitja a téma modalt", () => {
    temaModalMegnyit();
  });

  it("mind a 4 téma kártya látható", () => {
    temaModalMegnyit();

    cy.get(".tema-kartya[data-tema='girlipop']").should("be.visible");
    cy.get(".tema-kartya[data-tema='elegans']").should("be.visible");
    cy.get(".tema-kartya[data-tema='termeszet']").should("be.visible");
    cy.get(".tema-kartya[data-tema='gamer']").should("be.visible");
  });

  it("téma kiválasztása bezárja a modalt", () => {
    temaModalMegnyit();

    cy.get(".tema-kartya[data-tema='elegans']").click();

    cy.get("#tema-modal").should("not.have.attr", "open");
  });

  it("téma kiválasztása után a CSS változó megváltozik", () => {
    temaModalMegnyit();

    cy.get(".tema-kartya[data-tema='gamer']").click();

    cy.document().then((doc) => {
      const ertek = doc.documentElement.style
        .getPropertyValue("--szin-tema-hatter")
        .trim();

      expect(ertek).to.eq("#000000");
    });
  });

  it("mégsem gomb bezárja a modalt témaváltás nélkül", () => {
    temaModalMegnyit();

    cy.get("#tema-megse").click();

    cy.get("#tema-modal").should("not.have.attr", "open");
  });

  it("téma localStorage-ba mentődik", () => {
    temaModalMegnyit();

    cy.get(".tema-kartya[data-tema='termeszet']").click();

    cy.window().then((win) => {
      expect(win.localStorage.getItem("tema")).to.eq("termeszet");
    });
  });

  it("oldal újratöltése után is megmarad a kiválasztott téma", () => {
    temaModalMegnyit();

    cy.get(".tema-kartya[data-tema='termeszet']").click();

    cy.reload();

    cy.window().then((win) => {
      expect(win.localStorage.getItem("tema")).to.eq("termeszet");
    });
  });
});