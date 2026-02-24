/// <reference types="cypress" />

context('Lightbox - Tests Fonctionnels', () => {
    const selectors = {
        image: 'img[src*="picsum"]',
        lightbox: '[x-show="isLightboxVisible"]',
        overlay: '[x-show="isOverlayVisible"]',
        commentInput: 'input[name="comment"]',
        likeButton: 'svg[title="Like"]',
        dislikeButton: 'svg[title="Dislike"]',
        deleteCommentButton: 'svg[title="Supprimer le commentaire"]',
    }

    const openLightbox = () => {
        cy.get(selectors.image).first().click()
        cy.get(selectors.lightbox).should('be.visible')
    }

    const closeLightboxByOverlayClick = () => {
        cy.get(selectors.lightbox).click('topLeft')
        cy.get(selectors.lightbox).should('not.be.visible')
    }

    const showOverlay = () => {
        cy.get(selectors.image).first().trigger('mouseover')
        cy.get(selectors.overlay).should('be.visible')
    }

    const publishComment = (comment) => {
        cy.get(selectors.commentInput).type(comment)
        cy.contains('button', 'Publish').click()
    }

    beforeEach(() => {
        cy.on('uncaught:exception', () => {
            return false
        })
        cy.visit('../../src/lightbox.html')
    })

    it('should open lightbox when clicking on the image', () => {
        cy.get(selectors.lightbox).should('not.be.visible')
        openLightbox()
    })

    it('should close lightbox when clicking outside', () => {
        openLightbox()
        closeLightboxByOverlayClick()
    })

    it('should add like and update counters on overlay and lightbox', () => {
        openLightbox()

        cy.get(selectors.lightbox).within(() => {
            cy.get('div').contains('0').should('exist')
        })

        cy.get(selectors.likeButton).click()

        cy.get(selectors.lightbox).within(() => {
            cy.get('div').contains('1').should('exist')
        })

        closeLightboxByOverlayClick()
        showOverlay()

        cy.get(selectors.overlay).within(() => {
            cy.get('div').contains('1').should('be.visible')
        })
    })

    it('should remove like and update counters', () => {
        openLightbox()

        cy.get(selectors.likeButton).click()
        cy.get(selectors.lightbox).within(() => {
            cy.get('div').contains('1').should('exist')
        })

        cy.get(selectors.dislikeButton).click()

        cy.get(selectors.lightbox).within(() => {
            cy.get('div').contains('0').should('exist')
        })
    })

    it('should add a comment "Cypress is awesome!"', () => {
        openLightbox()
        publishComment('Cypress is awesome!')
        cy.contains('Cypress is awesome!').should('be.visible')
    })

    it('should keep Publish button disabled when comment is empty', () => {
        openLightbox()

        cy.contains('button', 'Publish').should('be.disabled')

        cy.get(selectors.commentInput).type('   ')
        cy.contains('button', 'Publish').should('be.disabled')

        cy.get('[x-show="isCommentsVisible"]').should('not.be.visible')
    })

    it('should hide comments when clicking hide button', () => {
        openLightbox()
        publishComment('Test comment')

        cy.contains('Test comment').should('be.visible')

        cy.contains('Hide').click()

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

        cy.get(selectors.overlay).within(() => {
            cy.get('div').contains('2').should('be.visible')
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

        cy.get(selectors.deleteCommentButton).eq(1).click()

        cy.contains('Deuxième commentaire').should('not.exist')

        cy.contains('Premier commentaire').should('be.visible')
        cy.contains('Troisième commentaire').should('be.visible')

        cy.contains('2 comments').should('be.visible')
    })
})
