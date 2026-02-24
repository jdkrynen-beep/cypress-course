/// <reference types="cypress" />

context('First scenario', () => {

    beforeEach(() => {
        cy.visit('../../src/caesar/index.html')
    })

    // https://on.cypress.io/interacting-with-elements

    it('has a paragraph with Hello World!', () => {
        cy.get('p').should('have.text', 'Hello World !')

    })
})