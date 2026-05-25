const URL = "http://localhost:3000";
const OLDAL = "https://mekk-ur-lak-bt.github.io/OnfejlesztoWebalkalmazas/";

describe("template spec", () => {
  it("passes", () => {
    cy.visit(OLDAL);
  });
});

describe("Feladatok", () => {
  let felhasznaloId;
  let kategoriaId;
  let feladatId;


  before(() => {
    cy.request("GET", `${URL}/api/felhasznalok`).then((valasz) => {
      const felhasznalo = valasz.body.find((f) => f.nev === "TesztElek");
      felhasznaloId = felhasznalo.id;

      cy.request(`GET`, `${URL}/api/kategoriak?felhasznaloId=${felhasznaloId}`)
        .then((kat) => {
          kategoriaId = kat.body[0].id;

          cy.request({
            method: "POST",
            url: `${URL}/api/feladatok`,
            body: { felhasznaloId, kategoriaId, cim: "Teszt feladat" },
          }).then((valasz) => {
            feladatId = valasz.body.id;
          });
        });
    });
  });


  it("feladat létrehozása -> 201", () => {
    cy.request({
      method: "POST",
      url: `${URL}/api/feladatok`,
      body: { felhasznaloId, kategoriaId, cim: "Teszt feladat" },
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 201);
      cy.wrap(valasz).its("body.cim").should("eq", "Teszt feladat");
    });
  });

  it("feladatok lekérése -> 200", () => {
    cy.request({
      method: "GET",
      url: `${URL}/api/feladatok?felhasznaloId=${felhasznaloId}`,
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 200);
      cy.wrap(valasz).its("body").should("be.an", "array");
      cy.wrap(valasz).its("body.length").should("be.greaterThan", 0);
    });
  });

  it("egy feladat lekérése -> 200", () => {
    cy.request({
      method: "GET", 
      url: `${URL}/api/feladatok/${feladatId}`,
    }).then((valasz) => {
        cy.wrap(valasz).its("status").should("eq", 200);
        cy.wrap(valasz).its("body.id").should("eq", feladatId);
      });
  });

  it("feladat szerkesztése -> 200", () => {
     cy.request({
      method: "PUT", 
      url: `${URL}/api/feladatok/${feladatId}`,
      body: {cim: "Módosított feladat"},
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 200 );
      cy.wrap(valasz).its("body.cim").should("eq", "Módosított feladat");
  });
});

  it("feladat teljesítése -> 200", () =>{
    cy.request({
      method: "PATCH",
      url: `${URL}/api/feladatok/${feladatId}/teljesit`,
    }).then((valasz) =>{
      cy.wrap(valasz).its("status").should("eq", 200);
      cy.wrap(valasz).its("body.uzenet").should("eq", "Feladat teljesítve!")
    });
  });

  it("feladat reset -> 200", () =>{
    cy.request({
      method: "PATCH",
      url: `${URL}/api/feladatok/${feladatId}/reset`,
    }).then((valasz) => {
      cy.wrap(valasz).its("status").should("eq", 200);
      cy.wrap(valasz).its("body.teljesitve").should("teljesitve", 0)
    });
  });

  it("nem létező feladat -> 404", () =>{
    cy.request({
      method: "GET",
      url: `${URL}/api/feladatok/99999`,
      failOnStatusCode: false,
    }).then((valasz) =>{
      cy.wrap(valasz).its("status").should("eq", 404 );
      cy.wrap(valasz).its("body.uzenet").should("eq", "Feladat nem található!");      
    });
  });

  it("feladat törlése -> 200", () =>{
    cy.request({
      method: "DELETE",
      url: `${URL}/api/feladatok/${feladatId}`,
    }).then((valasz) =>{
      cy.wrap(valasz).its("status").should("eq", 200);
      cy.wrap(valasz).its("body.uzenet").should("eq", "Feladat törölve!")
    })
  })

});

