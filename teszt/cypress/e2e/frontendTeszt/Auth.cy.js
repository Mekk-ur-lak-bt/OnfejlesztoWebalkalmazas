
const OLDAL = "http://localhost:3000";

describe("Auth - regisztráció UI", () => {
  before(() => {
    cy.visit(OLDAL);
  });

  it("megjelenik a regisztrációs gomb", () => {
    cy.get("#regisztracio-link").should("be.visible");
  });

  it("regisztrációs modal megnyílik", () => {
    cy.get("#regisztracio-link").click();
    cy.get("#auth-modal").should("be.visible");
    cy.get("#auth-modal-cim").should("have.text", "Registration");
  });

  it("sikeres regisztráció után bejelentkezve marad", () => {
    cy.get("#auth-nev").type("UITesztElek");
    cy.get("#auth-jelszo").type("titok123");
    cy.get("#auth-mentes").click();
    cy.on("window:alert", (szoveg) => {
      expect(szoveg).to.eq("Sikeres regisztráció!");
    });
    cy.get("#kijelentkezes-li").should("not.have.class", "hidden");
  });

  it("regisztráció után a profil neve frissül", () => {
    cy.get("#profil-nev").should("contain", "UITesztElek");
  });

  it("már foglalt névvel regisztráció → alert hibaüzenet", () => {
    cy.get("#regisztracio-link").click();
    cy.get("#auth-nev").type("UITesztElek");
    cy.get("#auth-jelszo").type("titok123");
    cy.on("window:alert", (szoveg) => {
      expect(szoveg).to.eq("Ez a felhasználónév már foglalt!");
    });
    cy.get("#auth-mentes").click();
  });
});

describe("Auth - bejelentkezés UI", () => {
  before(() => {
    cy.visit(OLDAL);
  });

  it("megjelenik a bejelentkezés gomb", () => {
    cy.get("#bejelentkezes-link").should("be.visible");
  });

  it("bejelentkezési modal megnyílik", () => {
    cy.get("#bejelentkezes-link").click();
    cy.get("#auth-modal").should("be.visible");
    cy.get("#auth-modal-cim").should("have.text", "Login");
  });

  it("bejelentkezésnél az avatar mező rejtett", () => {
    cy.get("#auth-avatar").should("have.attr", "hidden");
    cy.get("#auth-avatar-label").should("have.attr", "hidden");
  });

  it("sikeres bejelentkezés után a kijelentkezés gomb látható", () => {
    cy.get("#auth-nev").type("UITesztElek");
    cy.get("#auth-jelszo").type("titok123");
    cy.on("window:alert", (szoveg) => {
      expect(szoveg).to.eq("Sikeres bejelentkezés!");
    });
    cy.get("#auth-mentes").click();
    cy.get("#kijelentkezes-li").should("not.have.class", "hidden");
    cy.get("#bejelentkezes-li").should("have.class", "hidden");
  });

  it("hibás jelszóval → alert hibaüzenet", () => {
    cy.get("#bejelentkezes-link").click();
    cy.get("#auth-nev").type("UITesztElek");
    cy.get("#auth-jelszo").type("rosszjelszo");
    cy.on("window:alert", (szoveg) => {
      expect(szoveg).to.eq("Hibás felhasználónév vagy jelszó!");
    });
    cy.get("#auth-mentes").click();
    cy.get("#auth-modal").should("be.visible");
  });

  it("kijelentkezés után a login gomb újra látható", () => {
    cy.get("#bejelentkezes-link").click();
    cy.get("#auth-nev").type("UITesztElek");
    cy.get("#auth-jelszo").type("titok123");
    cy.get("#auth-mentes").click();
    cy.get("#kijelentkezes-link").click();
    cy.get("#bejelentkezes-li").should("not.have.class", "hidden");
    cy.get("#kijelentkezes-li").should("have.class", "hidden");
  });
});
