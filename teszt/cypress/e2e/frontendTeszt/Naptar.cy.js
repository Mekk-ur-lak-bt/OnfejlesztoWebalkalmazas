const OLDAL = "http://localhost:3000";

describe("Naptár UI", () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    cy.clock(new Date(2026, 4, 1).getTime());

    cy.intercept("GET", "**/api/felhasznalok/1", {
      statusCode: 200,
      body: {
        id: 1,
        nev: "NaptarTesztElek",
        xp: 0,
        coin: 0,
        szint: 1,
        avatar: "",
      },
    }).as("felhasznaloLekeres");

    cy.intercept("GET", "**/api/feladatok?felhasznaloId=1", {
      statusCode: 200,
      body: [
        {
          id: 1,
          felhasznaloId: 1,
          kategoriaId: 1,
          cim: "Cypress naptár teszt",
          xpJutalom: 50,
          coinJutalom: 10,
          kategoriaPont: 5,
          teljesitve: false,
          hatarido: "2026-05-15",
        },
        {
          id: 2,
          felhasznaloId: 1,
          kategoriaId: 1,
          cim: "Kész naptár feladat",
          xpJutalom: 30,
          coinJutalom: 5,
          kategoriaPont: 3,
          teljesitve: true,
          hatarido: "2026-05-15",
        },
        {
          id: 3,
          felhasznaloId: 1,
          kategoriaId: 1,
          cim: "Határidő nélküli feladat",
          xpJutalom: 20,
          coinJutalom: 2,
          kategoriaPont: 1,
          teljesitve: false,
          hatarido: "",
        },
      ],
    }).as("feladatokLekeres");

    cy.intercept("PATCH", "**/api/feladatok/*/reset", {
      statusCode: 200,
      body: {
        id: 2,
        felhasznaloId: 1,
        kategoriaId: 1,
        cim: "Kész naptár feladat",
        xpJutalom: 30,
        coinJutalom: 5,
        kategoriaPont: 3,
        teljesitve: false,
        hatarido: "2026-05-15",
      },
    }).as("feladatReset");

    cy.visit(OLDAL, {
      onBeforeLoad(win) {
        win.localStorage.setItem("aktualisFelhasznaloId", "1");
      },
    });

    cy.wait("@felhasznaloLekeres");
    cy.wait("@feladatokLekeres");
  });

  it("megjelenik a naptár blokk", () => {
    cy.contains("Calendar").should("be.visible");
  });

  it("megjelenik az aktuális hónap", () => {
    cy.contains(/may/i).should("be.visible");
  });

  it("megjelennek a hét napjai", () => {
    cy.contains("Mon").should("exist");
    cy.contains("Tue").should("exist");
    cy.contains("Wed").should("exist");
    cy.contains("Thu").should("exist");
    cy.contains("Fri").should("exist");
    cy.contains("Sat").should("exist");
    cy.contains("Sun").should("exist");
  });

  it("megjelenik a határidős feladat a naptárban", () => {
    cy.contains("Cypress naptár teszt").should("be.visible");
  });

  it("megjelenik a teljesített feladat is a naptárban", () => {
    cy.contains("Kész naptár feladat").should("be.visible");
  });

  it("a határidő nélküli feladat nem jelenik meg a naptárban", () => {
    cy.contains("Határidő nélküli feladat").should("not.exist");
  });

  it("lehet következő hónapra váltani", () => {
    cy.contains(/may/i).should("be.visible");

    cy.contains("button", "›").click();

    cy.contains(/june|jun/i).should("be.visible");
  });

  it("lehet előző hónapra váltani", () => {
    cy.contains(/may/i).should("be.visible");

    cy.contains("button", "‹").click();

    cy.contains(/april|apr/i).should("be.visible");
  });
});