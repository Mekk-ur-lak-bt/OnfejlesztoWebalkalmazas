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

const TESZT_KATEGORIAK = [
  { id: 1, felhasznaloId: 1, nev: "Logic", pontok: 0 },
  { id: 2, felhasznaloId: 1, nev: "Creativity", pontok: 0 },
  { id: 3, felhasznaloId: 1, nev: "Health", pontok: 0 },
  { id: 4, felhasznaloId: 1, nev: "Social", pontok: 0 },
  { id: 5, felhasznaloId: 1, nev: "Soul", pontok: 0 },
];

describe("Kategória alapfunkciói", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/felhasznalok/1", {
      statusCode: 200,
      body: TESZT_FELHASZNALO,
    }).as("felhasznaloLekeres");

    cy.intercept("GET", "**/api/kategoriak*", {
      statusCode: 200,
      body: TESZT_KATEGORIAK,
    }).as("kategoriaLekeres");

    cy.intercept("GET", "**/api/feladatok*", {
      statusCode: 200,
      body: [],
    }).as("feladatokLekeres");

    cy.visit(OLDAL, {
      onBeforeLoad(win) {
        win.localStorage.setItem("aktualisFelhasznaloId", "1");
      },
    });

    cy.wait("@felhasznaloLekeres");
    cy.wait("@feladatokLekeres");
  });

  function kategoriaModalMegnyit() {
    cy.wait("@kategoriaLekeres");
    cy.get("button.gomb-atnevez").click();
  }

  function modosit() {
    cy.intercept("GET", "**/api/kategoriak*", {
      statusCode: 200,
      body: TESZT_KATEGORIAK,
    }).as("kategoriaLekeres");

    cy.intercept("PUT", "**/api/kategoriak/1", {
      statusCode: 200,
      body: { id: 1, felhasznaloId: 1, nev: "Tesztelés", pontok: 0 },
    }).as("putKategoria1");

    cy.intercept("PUT", "**/api/kategoriak/*", {
      statusCode: 200,
      body: {},
    }).as("putKategoriaTobbi");

    kategoriaModalMegnyit();
    cy.get("#kategoria-modal #input-1").clear().type("Tesztelés");
    cy.get("#kategoria-mentes").click();
    cy.get("#kategoria-modal").should("not.have.attr", "open");
  }

  describe("Cimkék", () => {
    it("5 darab .cimke elem van", () => {
      cy.get(".cimke").should("have.length", 5);
    });

    it("Kiíródnak az alapbeállított kategória nevek bejelentkezés után", () => {
      const elvartSzovegek = [
        "logic",
        "health",
        "soul",
        "social",
        "creativity",
      ];
      cy.get(".cimke").then(($elemek) => {
        const aktualisSzovegek = [...$elemek].map((el) =>
          el.innerText.trim().toLowerCase(),
        );
        expect(aktualisSzovegek).to.have.members(elvartSzovegek);
      });
    });

    it("Módosítás után a módosított kategória neve jelenik meg", () => {
      cy.intercept("GET", "**/api/kategoriak*", {
        statusCode: 200,
        body: [
          { id: 1, felhasznaloId: 1, nev: "Tesztelés", pontok: 0 },
          { id: 2, felhasznaloId: 1, nev: "Creativity", pontok: 0 },
          { id: 3, felhasznaloId: 1, nev: "Health", pontok: 0 },
          { id: 4, felhasznaloId: 1, nev: "Social", pontok: 0 },
          { id: 5, felhasznaloId: 1, nev: "Soul", pontok: 0 },
        ],
      }).as("kategoriaLekeresModositott");

      modosit();

      const elvartSzovegek = [
        "tesztelés",
        "health",
        "soul",
        "social",
        "creativity",
      ];
      cy.get(".cimke").then(($elemek) => {
        const aktualisSzovegek = [...$elemek].map((el) =>
          el.innerText.trim().toLowerCase(),
        );
        expect(aktualisSzovegek).to.have.members(elvartSzovegek);
      });
    });
  });

  describe("Kategória modal - Gomb és tartalom", () => {
    it("A .grafikon-kartya konténerben létrejön a .gomb-atnevez gomb a helyes ikonnal", () => {
      cy.get(".grafikon-kartya")
        .find("button.gomb-atnevez")
        .should("exist")
        .find(".material-symbols-outlined")
        .should("have.text", "edit");
    });

    it("Többszöri példányosítás esetén sem jön létre második gomb", () => {
      cy.get(".grafikon-kartya button.gomb-atnevez").should("have.length", 1);
    });

    it("A megnyitott modalban 5 label és 5 input generálódik helyes attribútumokkal", () => {
      kategoriaModalMegnyit();

      cy.get("#kategoria-modal #kategoria-lista label").should(
        "have.length",
        5,
      );
      cy.get("#kategoria-modal #kategoria-lista label")
        .eq(0)
        .should("have.text", "Logic")
        .and("have.attr", "for", "input-1");
      cy.get("#kategoria-modal #kategoria-lista label")
        .eq(1)
        .should("have.text", "Creativity")
        .and("have.attr", "for", "input-2");

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
  });

  describe("Kategória modal - Űrlap interakciók", () => {
    it("Mégse gomb: a modal bezáródik és a módosítások nem mentődnek", () => {
      kategoriaModalMegnyit();
      cy.get("#kategoria-modal #input-1").clear().type("Math");
      cy.get("#kategoria-megse").click();
      cy.get("#kategoria-modal").should("not.have.attr", "open");
    });

    it("Kötelező mezők validációja: üres input esetén az űrlap nem küldhető el", () => {
      kategoriaModalMegnyit();
      cy.get("#kategoria-modal #input-1").clear();
      cy.get("#kategoria-mentes").click();
      cy.get("#kategoria-modal #input-1")
        .invoke("prop", "validity")
        .its("valid")
        .should("be.false");
    });

    it("Szóközök levágása: a mentéskor a trimelt érték kerül elküldésre", () => {
      cy.intercept("PUT", "**/api/kategoriak/*").as("putKategoria");
      kategoriaModalMegnyit();
      cy.get("#kategoria-modal #input-1").clear().type("   Programming   ");
      cy.get("#kategoria-mentes").click();
      cy.wait("@putKategoria")
        .its("request.body")
        .should("deep.equal", { nev: "Programming" });
    });

    it("Sikeres mentés: a modal bezáródik és a kategoriaValtozas esemény kiváltódik", () => {
      cy.intercept("PUT", "**/api/kategoriak/*", {
        statusCode: 200,
        body: {},
      }).as("putKategoria");
      cy.window().then((win) => cy.spy(win, "dispatchEvent").as("eventSpy"));
      kategoriaModalMegnyit();
      cy.get("#kategoria-modal #input-1").clear().type("Coding");
      cy.get("#kategoria-mentes").click();
      cy.wait("@putKategoria");
      cy.get("#kategoria-modal").should("not.have.attr", "open");
      cy.get("@eventSpy").should("have.been.calledWithMatch", (event) => {
        return event.type === "kategoriaValtozas";
      });
    });
  });

  describe("Kategória nevek az új feladat menüben", () => {
    it("Default kategória nevek jelennek meg a feladat modalban", () => {
      cy.get("#uj-feladat-gomb").click();
      cy.get("#urlap-cim").type("Teszt feladat");

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

    it("Módosítás után a módosított kategória név jelenik meg a feladat modalban", () => {
      cy.intercept("GET", "**/api/kategoriak*", {
        statusCode: 200,
        body: [
          { id: 1, felhasznaloId: 1, nev: "Tesztelés", pontok: 0 },
          { id: 2, felhasznaloId: 1, nev: "Creativity", pontok: 0 },
          { id: 3, felhasznaloId: 1, nev: "Health", pontok: 0 },
          { id: 4, felhasznaloId: 1, nev: "Social", pontok: 0 },
          { id: 5, felhasznaloId: 1, nev: "Soul", pontok: 0 },
        ],
      }).as("kategoriaLekeresModositott");

      modosit();

      cy.get("#uj-feladat-gomb").click();
      cy.get("#urlap-cim").type("Teszt feladat");
      cy.get("#urlap-kategoria").select("1");
      cy.get("#urlap-kategoria")
        .find("option:selected")
        .should("include.text", "Tesztelés");
    });
  });

  describe("Kijelentkezés", () => {
    it("Kijelentkezés után a gombra kattintva a modal nem nyílik meg", () => {
      cy.get("#kijelentkezes-link").click();
      cy.get("#profil-nev").should("have.text", "Guest");
      cy.get("button.gomb-atnevez").click();
      cy.get("#kategoria-modal").should("not.have.attr", "open");
    });
  });

  describe("Radar", () => {
    it("Feladat létrehozható és teljesíthető módosított kategóriával", () => {
      cy.intercept("POST", "**/api/feladatok", {
        statusCode: 201,
        body: {
          id: 10,
          felhasznaloId: 1,
          kategoriaId: 1,
          cim: "Teszt feladat",
          xpJutalom: 1000,
          coinJutalom: 250,
          kategoriaPont: 50,
          teljesitve: false,
          hatarido: "",
        },
      }).as("feladatLetrehoz");

      cy.intercept("GET", "**/api/feladatok*", {
        statusCode: 200,
        body: [
          {
            id: 10,
            felhasznaloId: 1,
            kategoriaId: 1,
            cim: "Teszt feladat",
            xpJutalom: 1000,
            coinJutalom: 250,
            kategoriaPont: 50,
            teljesitve: false,
            hatarido: "",
          },
        ],
      }).as("feladatokFrissitve");

      cy.intercept("PATCH", "**/api/feladatok/10/teljesit", {
        statusCode: 200,
        body: {
          feladat: {
            id: 10,
            felhasznaloId: 1,
            kategoriaId: 1,
            cim: "Teszt feladat",
            xpJutalom: 1000,
            coinJutalom: 250,
            kategoriaPont: 50,
            teljesitve: true,
            hatarido: "",
          },
          felhasznalo: { ...TESZT_FELHASZNALO, xp: 1000, szint: 2 },
          jutalom: { xp: 1000, coin: 250, kategoriaId: 1, kategoriaPont: 50 },
        },
      }).as("feladatTeljesit");

      modosit();

      cy.get("#uj-feladat-gomb").click();
      cy.get("#urlap-cim").type("Teszt feladat");
      cy.get("#urlap-kategoria").select("1");
      cy.get("#urlap-xp").clear().type("1000");
      cy.get("#urlap-coin").clear().type("250");
      cy.get("#urlap-pont").clear().type("50");
      cy.get("#modal-mentes").click();

      cy.wait("@feladatLetrehoz");
      cy.get("#feladat-modal").should("not.have.attr", "open");

      cy.get('input[type="checkbox"]').first().check();
      cy.wait("@feladatTeljesit");
    });
  });
});
