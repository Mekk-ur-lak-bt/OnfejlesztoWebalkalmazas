const URL = "http://localhost:3000";

describe("Statisztika", () =>{
    let felhasznaloId;

    before(() =>{
        cy.request("GET", `${URL}/api/felhasznalok`).then((valasz)=>{
            const felhasznalo = valasz.body.find((f) => f.nev === "TesztElek");
            felhasznaloId = felhasznalo.id;
        });
    });

    it("statisztika lekérése -> 200", () =>{
        cy.request({
            method: "GET",
            url: `${URL}/api/statisztika/${felhasznaloId}`,
        }).then((valasz) =>{
            cy.wrap(valasz).its("status").should("eq", 200);
            cy.wrap(valasz).its("body").should("be.an", "object");
        });
    });

    it("nem létező felhasználó statisztikája -> 404", () =>{
        cy.request({
            method: "GET",
            url: `${URL}/api/statisztika/99999`,
            failOnStatusCode: false,
        }).then((valasz) =>{
            cy.wrap(valasz).its("status").should("eq", 404);
            cy.wrap(valasz).its("body.uzenet").should("eq", "Felhasználó nem található!");
        })
    })
});