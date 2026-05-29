const OLDAL = "http://localhost:3000";

const TESZT_FELHASZNALO = {
  id: 1,
  nev: "UITesztElek",
  xp: 0,
  coin: 0,
  szint: 1,
  avatar: "img/avatar.jpg",
};

describe("Auth - regisztráció UI", () => {
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
      body: [
        { id: 1, felhasznaloId: 1, nev: "Logic", pontok: 0 },
        { id: 2, felhasznaloId: 1, nev: "Creativity", pontok: 0 },
        { id: 3, felhasznaloId: 1, nev: "Health", pontok: 0 },
        { id: 4, felhasznaloId: 1, nev: "Social", pontok: 0 },
        { id: 5, felhasznaloId: 1, nev: "Soul", pontok: 0 },
      ],
    }).as("kategoriakLekeres");

    cy.visit(OLDAL);
  });

  it("megjelenik a regisztrációs gomb", () => {
    cy.get("#regisztracio-link").should("be.visible");
  });

  it("regisztrációs modal megnyílik", () => {
    cy.get("#regisztracio-link").click();

    cy.get("#auth-modal").should("be.visible");
    cy.get("#auth-modal-cim").should("have.text", "Registration");
    cy.get("#auth-nev").should("be.visible");
    cy.get("#auth-jelszo").should("be.visible");
    cy.get("#auth-mentes").should("be.visible");
  });

  it("regisztrációnál az avatar mező látható", () => {
    cy.get("#regisztracio-link").click();

    cy.get("#auth-avatar").should("not.have.attr", "hidden");
    cy.get("#auth-avatar-label").should("not.have.attr", "hidden");
  });

  it("sikeres regisztráció után bejelentkezve marad", () => {
    cy.intercept("POST", "**/api/auth/regisztracio", {
      statusCode: 201,
      body: {
        uzenet: "Sikeres regisztráció!",
        felhasznalo: TESZT_FELHASZNALO,
      },
    }).as("regisztracio");

    cy.get("#regisztracio-link").click();

    cy.get("#auth-nev").type("UITesztElek");
    cy.get("#auth-jelszo").type("titok123");

    cy.on("window:alert", (szoveg) => {
      expect(szoveg).to.eq("Sikeres regisztráció!");
    });

    cy.get("#auth-mentes").click();

    cy.wait("@regisztracio");

    cy.get("#kijelentkezes-li").should("not.have.class", "hidden");
    cy.get("#bejelentkezes-li").should("have.class", "hidden");
  });

  it("regisztráció után a profil neve frissül", () => {
    cy.intercept("POST", "**/api/auth/regisztracio", {
      statusCode: 201,
      body: {
        uzenet: "Sikeres regisztráció!",
        felhasznalo: TESZT_FELHASZNALO,
      },
    }).as("regisztracio");

    cy.get("#regisztracio-link").click();

    cy.get("#auth-nev").type("UITesztElek");
    cy.get("#auth-jelszo").type("titok123");

    cy.get("#auth-mentes").click();

    cy.wait("@regisztracio");

    cy.get("#profil-nev").should("contain", "UITesztElek");
  });

  it("már foglalt névvel regisztráció esetén alert hibaüzenet jelenik meg", () => {
    cy.intercept("POST", "**/api/auth/regisztracio", {
      statusCode: 400,
      body: {
        uzenet: "Ez a felhasználónév már foglalt!",
      },
    }).as("sikertelenRegisztracio");

    cy.get("#regisztracio-link").click();

    cy.get("#auth-nev").type("UITesztElek");
    cy.get("#auth-jelszo").type("titok123");

    cy.on("window:alert", (szoveg) => {
      expect(szoveg).to.eq("Ez a felhasználónév már foglalt!");
    });

    cy.get("#auth-mentes").click();

    cy.wait("@sikertelenRegisztracio");

    cy.get("#auth-modal").should("be.visible");
  });
});

describe("Auth - bejelentkezés UI", () => {
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
      body: [
        { id: 1, felhasznaloId: 1, nev: "Logic", pontok: 0 },
        { id: 2, felhasznaloId: 1, nev: "Creativity", pontok: 0 },
        { id: 3, felhasznaloId: 1, nev: "Health", pontok: 0 },
        { id: 4, felhasznaloId: 1, nev: "Social", pontok: 0 },
        { id: 5, felhasznaloId: 1, nev: "Soul", pontok: 0 },
      ],
    }).as("kategoriakLekeres");

    cy.visit(OLDAL);
  });

  it("megjelenik a bejelentkezés gomb", () => {
    cy.get("#bejelentkezes-link").should("be.visible");
  });

  it("bejelentkezési modal megnyílik", () => {
    cy.get("#bejelentkezes-link").click();

    cy.get("#auth-modal").should("be.visible");
    cy.get("#auth-modal-cim").should("have.text", "Login");
    cy.get("#auth-nev").should("be.visible");
    cy.get("#auth-jelszo").should("be.visible");
    cy.get("#auth-mentes").should("be.visible");
  });

  it("bejelentkezésnél az avatar mező rejtett", () => {
    cy.get("#bejelentkezes-link").click();

    cy.get("#auth-avatar").should("have.attr", "hidden");
    cy.get("#auth-avatar-label").should("have.attr", "hidden");
  });

  it("sikeres bejelentkezés után a kijelentkezés gomb látható", () => {
    cy.intercept("POST", "**/api/auth/bejelentkezes", {
      statusCode: 200,
      body: {
        uzenet: "Sikeres bejelentkezés!",
        felhasznalo: TESZT_FELHASZNALO,
      },
    }).as("bejelentkezes");

    cy.get("#bejelentkezes-link").click();

    cy.get("#auth-nev").type("UITesztElek");
    cy.get("#auth-jelszo").type("titok123");

    cy.on("window:alert", (szoveg) => {
      expect(szoveg).to.eq("Sikeres bejelentkezés!");
    });

    cy.get("#auth-mentes").click();

    cy.wait("@bejelentkezes");

    cy.get("#kijelentkezes-li").should("not.have.class", "hidden");
    cy.get("#bejelentkezes-li").should("have.class", "hidden");
  });

  it("bejelentkezés után a profil neve frissül", () => {
    cy.intercept("POST", "**/api/auth/bejelentkezes", {
      statusCode: 200,
      body: {
        uzenet: "Sikeres bejelentkezés!",
        felhasznalo: TESZT_FELHASZNALO,
      },
    }).as("bejelentkezes");

    cy.get("#bejelentkezes-link").click();

    cy.get("#auth-nev").type("UITesztElek");
    cy.get("#auth-jelszo").type("titok123");

    cy.get("#auth-mentes").click();

    cy.wait("@bejelentkezes");

    cy.get("#profil-nev").should("contain", "UITesztElek");
  });

  it("hibás jelszóval alert hibaüzenet jelenik meg", () => {
    cy.intercept("POST", "**/api/auth/bejelentkezes", {
      statusCode: 401,
      body: {
        uzenet: "Hibás felhasználónév vagy jelszó!",
      },
    }).as("sikertelenBejelentkezes");

    cy.get("#bejelentkezes-link").click();

    cy.get("#auth-nev").type("UITesztElek");
    cy.get("#auth-jelszo").type("rosszjelszo");

    cy.on("window:alert", (szoveg) => {
      expect(szoveg).to.eq("Hibás felhasználónév vagy jelszó!");
    });

    cy.get("#auth-mentes").click();

    cy.wait("@sikertelenBejelentkezes");

    cy.get("#auth-modal").should("be.visible");
    cy.get("#kijelentkezes-li").should("have.class", "hidden");
  });

  it("kijelentkezés után a login gomb újra látható", () => {
    cy.visit(OLDAL, {
      onBeforeLoad(win) {
        win.localStorage.setItem("aktualisFelhasznaloId", "1");
      },
    });

    cy.wait("@felhasznaloLekeres");
    cy.wait("@feladatokLekeres");

    cy.get("#kijelentkezes-link").click();

    cy.get("#bejelentkezes-li").should("not.have.class", "hidden");
    cy.get("#kijelentkezes-li").should("have.class", "hidden");
    cy.get("#profil-nev").should("contain", "Guest");
  });
});