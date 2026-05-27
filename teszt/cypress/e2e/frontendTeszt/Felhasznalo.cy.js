const OLDAL = "http://localhost:3000";

describe("Fehasznaló profil UI", () =>{
    before(() =>{
        cy.visit(OLDAL);
    });

    it("guest állapotban a profil neve Guest", () =>{
        cy.get("#profil-nev").should("contain", "Guest")
    });

    it("guest állapotban az avatar az alapértelmezett", () =>{
        cy.visit(OLDAL);
        cy.get("#profil-avatar").should("have.attr", "src", "img/avatar.jpg");
    })

    it("guest állapotban a szint LVL 1 EXPLORER", () =>{
        cy.visit(OLDAL);
        cy.get("#profil-szint").should("have.text", "LVL 1 EXPLORER")
    })

    it("guest állapotban a coin 0", () =>{
        cy.visit(OLDAL)
        cy.get("profil-coin").should("have.text", 0)
    })

    it("guest állapotban a progress bar értéke 0", () =>{
        cy.visit(OLDAL)
        cy.get("#profil-progress").should("have.attr", "value", "0")
    })

    it("bejelentkezés után a profil neve frissül", () =>{
        cy.get("#bejelentkezes-link").click()
        cy.get("#auth-nev").type("UITesztElek")
        cy.get("#auth-jelszo").type("titok123")
        cy.get("#auth-mentes").click()
        cy.get("#profil-nev").should("contain", "UITesztElek")
    })

    it("kijelentkezés után visszaáll a Guest-re", () =>{
        cy.get("#kijeletkezes-link").click()
        cy.get("#profil-nev").should("contain", "Guest")
    })
});