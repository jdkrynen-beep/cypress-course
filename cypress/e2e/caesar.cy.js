/// <reference types="cypress" />

context('Caesar cipher', () => {

    beforeEach(() => {
        cy.visit('../../src/caesar/index.html')
    })

    it('encrypts a message with key 3', () => {
        cy.dataCY('cypher-key').clear().type('3')
        cy.dataCY('message-input').type('Abc xyz!')
        cy.dataCY('cypher-button').click()

        cy.dataCY('result').should('have.text', 'Def abc!')
    })

    it('shows an error when key is out of range', () => {
        cy.dataCY('cypher-key').clear().type('26')
        cy.dataCY('message-input').type('Bonjour')
        cy.dataCY('cypher-button').click()

        cy.dataCY('result').should('have.text', 'Erreur: La clé doit être entre 1 et 25')
    })
})
