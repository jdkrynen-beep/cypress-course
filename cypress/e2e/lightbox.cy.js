/// <reference types="cypress" />

context('Lightbox - Tests Fonctionnels', () => {
    const openLightbox = () => {
        cy.dataCY('image').click()
        cy.dataCY('lightbox').should('be.visible')
    }

    const closeLightboxByOverlayClick = () => {
        cy.dataCY('lightbox-bg').click({ force: true })
        cy.dataCY('lightbox').should('not.be.visible')
    }

    const showOverlay = () => {
        cy.dataCY('image').trigger('mouseover')
        cy.dataCY('overlay').should('be.visible')
    }

    const publishComment = (comment) => {
        cy.dataCY('comment-input').type(comment)
        cy.dataCY('publish-button').click()
    }

    beforeEach(() => {
        cy.on('uncaught:exception', () => {
            return false
        })
        cy.visit('../../src/lightbox.html')
    })

    it('should open lightbox when clicking on the image', () => {
        cy.dataCY('lightbox').should('not.be.visible')
        openLightbox()
    })

    it('should close lightbox when clicking outside', () => {
        openLightbox()
        closeLightboxByOverlayClick()
    })

    it('should add like and update counters on overlay and lightbox', () => {
        openLightbox()

        cy.dataCY('likes-count').should('contain', '0')

        cy.dataCY('like-button').click()

        cy.dataCY('likes-count').should('contain', '1')

        closeLightboxByOverlayClick()
        showOverlay()

        cy.dataCY('overlay').within(() => {
            cy.contains('1').should('be.visible')
        })
    })

    it('should remove like and update counters', () => {
        openLightbox()

        cy.dataCY('like-button').click()
        cy.dataCY('likes-count').should('contain', '1')

        cy.dataCY('dislike-button').click()

        cy.dataCY('likes-count').should('contain', '0')
    })

    it('should add a comment "Cypress is awesome!"', () => {
        openLightbox()
        publishComment('Cypress is awesome!')
        cy.contains('Cypress is awesome!').should('be.visible')
    })

    it('should keep Publish button disabled when comment is empty', () => {
        openLightbox()

        cy.dataCY('publish-button').should('be.disabled')

        cy.dataCY('comment-input').type('   ')
        cy.dataCY('publish-button').should('be.disabled')

        cy.dataCY('comments-list').should('not.be.visible')
    })

    it('should hide comments when clicking hide button', () => {
        openLightbox()
        publishComment('Test comment')

        cy.contains('Test comment').should('be.visible')

        cy.dataCY('comments-toggle').click()

        cy.contains('Test comment').should('not.be.visible')
    })

    it('should display correct comment counts on overlay and lightbox', () => {
        openLightbox()

        publishComment('Premier commentaire')
        cy.contains('1 comment').should('be.visible')

        publishComment('Deuxième commentaire')
        cy.contains('2 comments').should('be.visible')

        closeLightboxByOverlayClick()
        showOverlay()

        cy.dataCY('overlay').within(() => {
            cy.contains('2').should('be.visible')
        })
    })

    it('should display singular/plural based on comment count', () => {
        openLightbox()

        publishComment('Un seul commentaire')
        cy.contains('1 comment').should('be.visible')
        cy.contains('1 comments').should('not.exist')

        publishComment('Deux commentaires')
        cy.contains('2 comments').should('be.visible')
    })

    it('should delete the second comment when clicking its delete button', () => {
        openLightbox()

        publishComment('Premier commentaire')
        publishComment('Deuxième commentaire')
        publishComment('Troisième commentaire')

        cy.contains('Premier commentaire').should('be.visible')
        cy.contains('Deuxième commentaire').should('be.visible')
        cy.contains('Troisième commentaire').should('be.visible')

        cy.dataCY('delete-comment-button').eq(1).click()

        cy.contains('Deuxième commentaire').should('not.exist')

        cy.contains('Premier commentaire').should('be.visible')
        cy.contains('Troisième commentaire').should('be.visible')

        cy.contains('2 comments').should('be.visible')
    })
})
