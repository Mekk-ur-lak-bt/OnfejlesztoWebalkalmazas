const OLDAL = "http://localhost:3000";

describe("Témaválasztó UI", () =>{
    before(() =>{
        cy.visit(OLDAL)
        cy.get("#beallitasok").click()
    })

    it("a beállítások gomb megnyitja a téma modalt", ()=>{
        cy.get("#beallitasok").click()
        cy.get("#tema-modal").should("be.visible")
    })

    it("mind a 4 téma kártya látható", () =>{
        cy.get(".tema-kartya[data-tema='girlipop']").should("be.visible")
        cy.get(".tema-kartya[data-tema='elegans']").should("be.visible")
        cy.get(".tema-kartya[data-tema='termeszet']").should("be.visible")
        cy.get(".tema-kartya[data-tema='gamer']").should("be.visible")
    })

    it("téma kiválasztása bezárja a modalt", () =>{
        cy.get(".tema-kartya[data-tema='elegans']").click()
        cy.get("#tema-modal").should("not.have.attr", "open")
    })

    it("téma kiválasztása után a CSS változó megváltozik", () =>{
        cy.get("#beallitasok").click()
        cy.get(".tema-kartya[data-tema='gamer']").click()
        cy.document().then((doc) => {
            const ertek = doc.documentElement.style.getPropertyValue("--szin-tema-hatter").trim();
            expect(ertek).to.eq("#000000");
        });
    })

    it("mégsem gomb bezárja a modalt a témaváltás nélkül", () =>{
        cy.get("#beallitasok").click()
        cy.get("#tema-megse").click()
        cy.get("#tema-modal").should("not.have.attr", "open")
    })

    it("téma localStorage-ba mentődik", () =>{
        cy.get("#beallitasok").click();
        cy.get(".tema-kartya[data-tema='termeszet']").click();
        cy.getAllLocalStorage().then((storage) => {
            expect(storage[OLDAL]["tema"]).to.eq("termeszet");
        });
    })


})