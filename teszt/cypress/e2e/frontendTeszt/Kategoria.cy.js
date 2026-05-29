const OLDAL = "http://localhost:3000";

const TESZT_FELHASZNALO = {
  id: 1,
  nev: "TesztElek",
  xp: 0,
  coin: 0,
  szint: 1,
  szintProgressz: 0,
  avatar: "img/avatar.jpg",
};

const ALAP_KATEGORIAK = [
  { id: 1, felhasznaloId: 1, nev: "Logic", pontok: 0 },
  { id: 2, felhasznaloId: 1, nev: "Creativity", pontok: 0 },
  { id: 3, felhasznaloId: 1, nev: "Health", pontok: 0 },
  { id: 4, felhasznaloId: 1, nev: "Social", pontok: 0 },
  { id: 5, felhasznaloId: 1, nev: "Soul", pontok: 0 },
];

describe("Kategória UI", () => {
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
      body: ALAP_KATEGORIAK,
    }).as("kategoriakLekeres");

    cy.visit(OLDAL, {
      onBeforeLoad(win) {
        win.localStorage.setItem("aktualisFelhasznaloId", "1");
      },
    });

    cy.wait("@felhasznaloLekeres");
    cy.wait("@feladatokLekeres");

    // Ez a radar chart / oldal betöltés miatti első kategória lekérés.
    cy.wait("@kategoriakLekeres");
  });

  function kategoriaModalMegnyit() {
    cy.get("button.gomb-atnevez")
      .should("exist")
      .and("be.visible")
      .click();

    // Ez már a modal megnyitásakor indított második kategória lekérés.
    cy.wait("@kategoriakLekeres");

    cy.get("#kategoria-modal")
      .should("have.attr", "open")
      .and("be.visible");
  }

  it("5 darab kategória címke jelenik meg", () => {
    cy.get(".cimke").should("have.length", 5);
  });

  it("kiíródnak az alapértelmezett kategória nevek", () => {
    const elvartSzovegek = [
      "logic",
      "creativity",
      "health",
      "social",
      "soul",
    ];

    cy.get(".cimke").then(($elemek) => {
      const aktualisSzovegek = [...$elemek].map((el) =>
        el.innerText.trim().toLowerCase(),
      );

      expect(aktualisSzovegek).to.have.members(elvartSzovegek);
    });
  });

  it("a kategória módosító gomb megjelenik", () => {
    cy.get(".grafikon-kartya")
      .find("button.gomb-atnevez")
      .should("exist")
      .and("be.visible");
  });

  it("a kategória módosító gombon edit ikon van", () => {
    cy.get(".grafikon-kartya")
      .find("button.gomb-atnevez")
      .find(".material-symbols-outlined")
      .should("have.text", "edit");
  });

  it("a kategória modal megnyílik", () => {
    kategoriaModalMegnyit();
  });

  it("a modalban 5 label és 5 input generálódik", () => {
    kategoriaModalMegnyit();

    cy.get("#kategoria-modal #kategoria-lista label")
      .should("have.length", 5);

    cy.get("#kategoria-modal #kategoria-lista input")
      .should("have.length", 5);
  });

  it("a modalban az első kategória label és input helyes", () => {
    kategoriaModalMegnyit();

    cy.get("#kategoria-modal #kategoria-lista label")
      .eq(0)
      .should("have.text", "Logic")
      .and("have.attr", "for", "input-1");

    cy.get("#kategoria-modal #kategoria-lista input")
      .eq(0)
      .should("have.value", "Logic")
      .and("have.attr", "id", "input-1")
      .and("have.attr", "required");

    cy.get("#kategoria-modal #kategoria-lista input")
      .eq(0)
      .invoke("attr", "data-id")
      .should("eq", "1");
  });

  it("mégse gomb bezárja a modalt", () => {
    kategoriaModalMegnyit();

    cy.get("#kategoria-modal #input-1").clear().type("Math");
    cy.get("#kategoria-megse").click();

    cy.get("#kategoria-modal").should("not.have.attr", "open");
  });

  it("üres input esetén az űrlap nem küldhető el", () => {
    kategoriaModalMegnyit();

    cy.get("#kategoria-modal #input-1").clear();
    cy.get("#kategoria-mentes").click();

    cy.get("#kategoria-modal #input-1")
      .invoke("prop", "validity")
      .its("valid")
      .should("be.false");
  });

  it("mentéskor a trimelt kategórianév kerül elküldésre", () => {
    cy.intercept("PUT", "**/api/kategoriak/*", {
      statusCode: 200,
      body: {},
    }).as("kategoriaMentes");

    kategoriaModalMegnyit();

    cy.get("#kategoria-modal #input-1")
      .clear()
      .type("   Programming   ");

    cy.get("#kategoria-mentes").click();

    cy.wait("@kategoriaMentes")
      .its("request.body")
      .should("deep.equal", { nev: "Programming" });
  });

  it("sikeres mentés után a modal bezáródik", () => {
    cy.intercept("PUT", "**/api/kategoriak/*", {
      statusCode: 200,
      body: {},
    }).as("kategoriaMentes");

    kategoriaModalMegnyit();

    cy.get("#kategoria-modal #input-1")
      .clear()
      .type("Coding");

    cy.get("#kategoria-mentes").click();

    // Mivel a kód Promise.all-lal mind az 5 kategóriát menti,
    // legalább az első PUT kérést megvárjuk.
    cy.wait("@kategoriaMentes");

    cy.get("#kategoria-modal").should("not.have.attr", "open");
  });

  it("sikeres mentés után kategoriaValtozas esemény váltódik ki", () => {
    cy.intercept("PUT", "**/api/kategoriak/*", {
      statusCode: 200,
      body: {},
    }).as("kategoriaMentes");

    cy.window().then((win) => {
      cy.spy(win, "dispatchEvent").as("eventSpy");
    });

    kategoriaModalMegnyit();

    cy.get("#kategoria-modal #input-1")
      .clear()
      .type("Coding");

    cy.get("#kategoria-mentes").click();

    cy.wait("@kategoriaMentes");

    cy.get("@eventSpy").should(
      "have.been.calledWithMatch",
      Cypress.sinon.match((event) => {
        return event.type === "kategoriaValtozas";
      }),
    );
  });

  it("az új feladat modalban megjelennek az alap kategóriák", () => {
    cy.get("#uj-feladat-gomb").click();

    cy.get("#urlap-kategoria option").should("have.length", 5);

    [
      { ertek: "1", szoveg: "Logic" },
      { ertek: "2", szoveg: "Creativity" },
      { ertek: "3", szoveg: "Health" },
      { ertek: "4", szoveg: "Social" },
      { ertek: "5", szoveg: "Soul" },
    ].forEach(({ ertek, szoveg }) => {
      cy.get("#urlap-kategoria").select(ertek);

      cy.get("#urlap-kategoria")
        .find("option:selected")
        .should("include.text", szoveg);
    });
  });

  it("kijelentkezés után a kategória modal nem nyílik meg", () => {
    cy.get("#kijelentkezes-link").click();

    cy.get("#profil-nev").should("contain", "Guest");

    cy.get("button.gomb-atnevez").click();

    cy.get("#kategoria-modal").should("not.have.attr", "open");
  });
});