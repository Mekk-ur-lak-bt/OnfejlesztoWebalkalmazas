const URL = "http://localhost:3000";

describe("Felhasználók", () =>{
    let felhasznaloId;

    before(() =>{
        cy.request("GET", `${URL}/api/felhasznalok`).then((valasz)=>{
            const felhasznalo = valasz.body.find((f) => f.nev === "TesztElek");
            felhasznaloId = felhasznalo.id;
        });
    });

    it("összes felhasználó lekérése -> 200", () =>{
        cy.request({
            method: "GET",
            url: `${URL}/api/felhasznalok`,
        }).then((valasz) =>{
            cy.wrap(valasz).its("body").should("be.an", "array");
            cy.wrap(valasz).its("body.length").should("be.greaterThan", 0); 
        });
    });

    it("egy felhasználó lekérése -> 200", () =>{
        cy.request({
            method: "GET",
            url: `${URL}/api/felhasznalok/${felhasznaloId}`,
        }).then((valasz) =>{
            cy.wrap(valasz).its("status").should("eq", 200);
            cy.wrap(valasz).its("body.nev").should("eq", "TesztElek");
        });
    });

    it("nem létező felhasználó -> 404", () =>{
        cy.request({
            method: "GET",
            url: `${URL}/api/felhasznalok/99999`,
            failOnStatusCode: false,
        }).then((valasz) =>{
            cy.wrap(valasz).its("status").should("eq", 404);
            cy.wrap(valasz).its("body.uzenet").should("eq", "Felhasználó nem található!");
        });
    });

    it("XP hozzáadása -> 200", () =>{
        cy.request({
            method: "GET",
            url: `${URL}/api/felhasznalok/99999`,
            body: {mennyiseg: 50}
        }).then((valasz) =>{
            cy.wrap(valasz).its("status").should("eq", 200);
            cy.wrap(valasz).its("body.uzenet").should("eq", "XP hozzáadva!");
            cy.wrap(valasz).its("body.felhasznalo.xp").should("eq", 50);
        });
    });

    it("XP rossz típussal → 400", () => {
        cy.request({
            method: "PATCH",
            url: `${URL}/api/felhasznalok/${felhasznaloId}/xp`,
            body: { mennyiseg: "sok" },
            failOnStatusCode: false,
        }).then((valasz) => {
        cy.wrap(valasz).its("status").should("eq", 400);
        cy.wrap(valasz).its("body.uzenet").should("eq", "A mennyiségnek számnak kell lennie!");
        });
    });

  it("coin hozzáadása → 200", () => {
        cy.request({
            method: "PATCH",
            url: `${URL}/api/felhasznalok/${felhasznaloId}/coin`,
            body: { mennyiseg: 100 },
        }).then((valasz) => {
            cy.wrap(valasz).its("status").should("eq", 200);
            cy.wrap(valasz).its("body.uzenet").should("eq", "Coin hozzáadva!");
            cy.wrap(valasz).its("body.felhasznalo.coin").should("eq", 100);
        });
     });
});