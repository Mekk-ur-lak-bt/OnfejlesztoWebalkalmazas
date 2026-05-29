const OLDAL = "http://localhost:3000";

const TESZT_FELHASZNALO = {
  id: 1,
  nev: "UITesztElek",
  xp: 0,
  coin: 0,
  szint: 1,
  avatar: "img/avatar.jpg",
};

const TESZT_KATEGORIAK = [
  { id: 1, felhasznaloId: 1, nev: "Logic", pontok: 0 },
  { id: 2, felhasznaloId: 1, nev: "Creativity", pontok: 0 },
  { id: 3, felhasznaloId: 1, nev: "Health", pontok: 0 },
  { id: 4, felhasznaloId: 1, nev: "Social", pontok: 0 },
  { id: 5, felhasznaloId: 1, nev: "Soul", pontok: 0 },
];

describe("Felhasználó profil UI", () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    cy.intercept("GET", "**/api/felhasznalok/1", {
      statusCode: 200,
      body: TESZT_FELHASZNALO,
    }).as("felhasznaloLekeres");

    cy.intercept("GET", "**/api/feladatok*", {
      statusCode: 200,
      body: [],
    }).as("feladatokLekeres");

    cy.intercept("GET", "**/api/kategoriak*", {
      statusCode: 200,
      body: TESZT_KATEGORIAK,
    }).as("kategoriakLekeres");
  });

  describe("Guest profil állapot", () => {
    beforeEach(() => {
      cy.visit(OLDAL);
    });

    it("guest állapotban a profil neve Guest", () => {
      cy.get("#profil-nev").should("contain", "Guest");
    });

    it("guest állapotban az avatar az alapértelmezett", () => {
      cy.get("#profil-avatar").should("have.attr", "src", "img/avatar.jpg");
    });

    it("guest állapotban a szint LVL 1 EXPLORER", () => {
      cy.get("#profil-szint").should("have.text", "LVL 1 EXPLORER");
    });

    it("guest állapotban a coin 0", () => {
      cy.get("#profil-coin").should("have.text", "0");
    });

    it("guest állapotban a progress bar értéke 0", () => {
      cy.get("#profil-progress").should("have.attr", "value", "0");
    });
  });

  describe("Bejelentkezett profil állapot", () => {
    beforeEach(() => {
      cy.visit(OLDAL, {
        onBeforeLoad(win) {
          win.localStorage.setItem("aktualisFelhasznaloId", "1");
        },
      });

      cy.wait("@felhasznaloLekeres");
      cy.wait("@feladatokLekeres");
      cy.wait("@kategoriakLekeres");
    });

    it("bejelentkezés után a profil neve frissül", () => {
      cy.get("#profil-nev").should("contain", "UITesztElek");
    });

    it("bejelentkezés után az avatar betöltődik", () => {
      cy.get("#profil-avatar").should("have.attr", "src", "img/avatar.jpg");
    });

    it("bejelentkezés után a szint megjelenik", () => {
      cy.get("#profil-szint").should("contain", "LVL 1");
    });

    it("bejelentkezés után a coin értéke megjelenik", () => {
      cy.get("#profil-coin").should("have.text", "0");
    });

    it("bejelentkezés után a progress bar értéke 0", () => {
      cy.get("#profil-progress").should("have.attr", "value", "0");
    });

    it("kijelentkezés után visszaáll a Guest profil", () => {
      cy.get("#kijelentkezes-link").click();

      cy.get("#profil-nev").should("contain", "Guest");
      cy.get("#profil-avatar").should("have.attr", "src", "img/avatar.jpg");
      cy.get("#profil-szint").should("have.text", "LVL 1 EXPLORER");
      cy.get("#profil-coin").should("have.text", "0");
      cy.get("#profil-progress").should("have.attr", "value", "0");
    });
  });
});