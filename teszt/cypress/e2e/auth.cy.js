const URL = "http://localhost:3000";
const OLDAL = "https://mekk-ur-lak-bt.github.io/OnfejlesztoWebalkalmazas/";

describe("template spec", () => {
  it("passes", () => {
    cy.visit(OLDAL);
  });
});

describe("Auth - regisztráció", () => {
  /*it("sikeres regisztráció", () => {
        cy.request({
            method: "POST",
            url: `${URL}/api/auth/regisztracio`,
            body: { 
                nev: "valami", 
                jelszo: "titok123" 
            },
        }).then((valasz) => {
            cy.wrap(valasz).its('status').should('eq', 201);
            cy.wrap(valasz).its('body.felhasznalo.nev').should('eq', 'valami');
        });
    });*/

  it("hiányzó jelszó -> 400", () => {
    cy.request({
      method: "POST",
      url: `${URL}/api/auth/regisztracio`,
      body: { nev: "valami" },
      failOnStatusCode: false,
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 400);
      cy.wrap(valasz)
        .its("body.uzenet")
        .should("eq", "A név és a jelszó megadása kötelező!");
    });
  });

  it("foglalt felhasználónév -> 409", () => {
    cy.request({
      method: "POST",
      url: `${URL}/api/auth/regisztracio`,
      body: {
        nev: "TesztElek",
        jelszo: "titok123"
      },
      failOnStatusCode: false,
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 409);
      cy.wrap(valasz)
        .its("body.uzenet")
        .should("eq", "Ez a felhasználónév már foglalt!");
    });
  });
});

describe("Auth - bejelentkezés", () => {
  it("sikeres bejelentkezés", () =>{
    cy.request({
      method: "POST",
      url: `${URL}/api/auth/bejelentkezes`,
      body: {
        nev: "TesztElek",
        jelszo: "titok123"
      },
    }).then((valasz) =>{
      cy.wrap(valasz).its("status").should("eq", 200);
      cy.wrap(valasz).its("body.uzenet").should("eq", "Sikeres bejelentkezés!");
      cy.wrap(valasz).its("body.felhasznalo.nev").should("eq", "TesztElek");
    });
  });

  it("hiányzó név -> 400", () =>{
    cy.request({
      method: "POST",
      url: `${URL}/api/auth/bejelentkezes`,
      body: {
        nev: "TesztElek"},
        failOnStatusCode: false,
    }).then((valasz) =>{
      cy.wrap(valasz).its("status").should("eq", 400);
      cy.wrap(valasz).its("body.uzenet").should("eq", "A név és a jelszó megadása kötelező!");
    });
  });

  it("rossz jelszó -> 401", () =>{
    cy.request({
      method: "POST",
      url: `${URL}/api/auth/bejelentkezes`,
      body: {
        nev: "TesztElek",
        jelszo: "titok124"
      },
      failOnStatusCode: false,
    }).then((valasz)=>{
      cy.wrap(valasz).its("status").should("eq", 401);
      cy.wrap(valasz).its("body.uzenet").should("eq", "Hibás felhasználónév vagy jelszó!")
    });
  });
});
