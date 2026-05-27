const URL = "http://localhost:3000";

describe("Kategóriák", () => {
  let felhasznaloId;
  let kategoriaId;

  before(() => {
    cy.request("GET", `${URL}/api/felhasznalok`).then((valasz) => {
      const felhasznalo = valasz.body.find((f) => f.nev === "TesztElek");
      felhasznaloId = felhasznalo.id;
    });
  });

  it("kategóriák lekérése -> 200", () => {
    cy.request({
      method: "GET",
      url: `${URL}/api/kategoriak?felhasznaloId=${felhasznaloId}`,
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 200);
      cy.wrap(valasz).its("body").should("be.an", "array");
      cy.wrap(valasz).its("body.length").should("be.greaterThan", 0);
    });
  });

  it("kategória létrehozása -> 201", () => {
    cy.request({
      method: "POST",
      url: `${URL}/api/kategoriak`,
      body: { felhasznaloId, nev: "Teszt kategória" },
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 201);
      cy.wrap(valasz).its("body.nev").should("eq", "Teszt kategória");
      kategoriaId = valasz.body.id;
    });
  });

  it("egy kategória lekérése -> 200", () => {
    cy.request({
      method: "GET",
      url: `${URL}/api/kategoriak/${kategoriaId}`,
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 200);
      cy.wrap(valasz).its("body.id").should("eq", kategoriaId);
    });
  });

  it("kategória átnevezése → 200", () => {
    cy.request({
      method: "PUT",
      url: `${URL}/api/kategoriak/${kategoriaId}`,
      body: { nev: "Átnevezett kategória" },
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 200);
      cy.wrap(valasz).its("body.nev").should("eq", "Átnevezett kategória");
    });
  });

  it("kategória pont frissítése → 200", () => {
    cy.request({
      method: "PATCH",
      url: `${URL}/api/kategoriak/${kategoriaId}/pont`,
      body: { mennyiseg: 10 },
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 200);
      cy.wrap(valasz)
        .its("body.uzenet")
        .should("eq", "Kategória pont frissítve!");
      cy.wrap(valasz).its("body.kategoria.pontok").should("eq", 10);
    });
  });

  it("pont frissítés rossz típussal -> 400", () => {
    cy.request({
      method: "PATCH",
      url: `${URL}/api/kategoriak/${kategoriaId}/pont`,
      body: { mennyiseg: "nem szam" },
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 400);
      cy.wrap(valasz)
        .its("body.uzenet")
        .should("eq", "A mennyiségnek szának kell lennie!");
    });
  });

  it("nem létező kategória → 404", () => {
    cy.request({
      method: "GET",
      url: `${URL}/api/kategoriak/99999`,
      failOnStatusCode: false,
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 404);
      cy.wrap(valasz)
        .its("body.uzenet")
        .should("eq", "Kategória nem található!");
    });
  });

  it("kategória törlése → 200", () => {
    cy.request({
      method: "DELETE",
      url: `${URL}/api/kategoriak/${kategoriaId}`,
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 200);
      cy.wrap(valasz).its("body.uzenet").should("eq", "Kategória törölve!");
    });
  });
});
