/// <reference types="cypress" />

context('Lightbox - Tests Fonctionnels', () => {

    beforeEach(() => {
        // Ignorer les erreurs Alpine.js cross-origin
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.visit('../../src/lightbox.html')
    })

    // Test 1: Tester l'ouverture de la lightbox au clique sur l'image
    it('should open lightbox when clicking on the image', () => {
        // Vérifier que la lightbox n'est pas visible au départ
        cy.get('[x-show="isLightboxVisible"]').should('not.be.visible')
        
        // Cliquer sur l'image thumbnail
        cy.get('img[src*="picsum"]').first().click()
        
        // Vérifier que la lightbox est maintenant visible
        cy.get('[x-show="isLightboxVisible"]').should('be.visible')
    })

    // Test 2: Tester la fermeture de la lightbox au clique en dehors de la lightbox
    it('should close lightbox when clicking outside', () => {
        // Ouvrir la lightbox
        cy.get('img[src*="picsum"]').first().click()
        cy.get('[x-show="isLightboxVisible"]').should('be.visible')
        
        // Cliquer en dehors de la lightbox (sur l'overlay)
        cy.get('[x-show="isLightboxVisible"]').click('topLeft')
        
        // Vérifier que la lightbox est fermée
        cy.get('[x-show="isLightboxVisible"]').should('not.be.visible')
    })

    // Test 3: Tester l'ajout de la mention "j'aime" et la mise à jour des compteurs sur l'overlay et la lightbox
    it('should add like and update counters on overlay and lightbox', () => {
        // Ouvrir la lightbox
        cy.get('img[src*="picsum"]').first().click()
        
        // Vérifier que le compteur est à 0
        cy.get('[x-show="isLightboxVisible"]').within(() => {
            cy.get('div').contains('0').should('exist')
        })
        
        // Cliquer sur le bouton like
        cy.get('svg[title="Like"]').click()
        
        // Vérifier que le compteur est à 1
        cy.get('[x-show="isLightboxVisible"]').within(() => {
            cy.get('div').contains('1').should('exist')
        })
        
        // Fermer la lightbox en cliquant sur le fond
        cy.get('[x-show="isLightboxVisible"]').click('topLeft')
        cy.wait(300)
        
        // Hover sur l'image pour voir l'overlay
        cy.get('img[src*="picsum"]').first().trigger('mouseover')
        
        // Vérifier que le compteur sur l'overlay est aussi à 1
        cy.get('[x-show="isOverlayVisible"]').within(() => {
            cy.get('div').contains('1').should('be.visible')
        })
    })

    // Test 4: Tester la suppression de la mention "j'aime" et la mise à jour des compteurs
    it('should remove like and update counters', () => {
        // Ouvrir la lightbox
        cy.get('img[src*="picsum"]').first().click()
        
        // Ajouter un like
        cy.get('svg[title="Like"]').click()
        cy.get('[x-show="isLightboxVisible"]').within(() => {
            cy.get('div').contains('1').should('exist')
        })
        
        // Retirer le like
        cy.get('svg[title="Dislike"]').click()
        
        // Vérifier que le compteur est revenu à 0
        cy.get('[x-show="isLightboxVisible"]').within(() => {
            cy.get('div').contains('0').should('exist')
        })
    })

    // Test 5: Tester l'ajout d'un commentaire - Exemple: "Cypress is awesome!"
    it('should add a comment "Cypress is awesome!"', () => {
        // Ouvrir la lightbox
        cy.get('img[src*="picsum"]').first().click()
        
        // Taper un commentaire
        cy.get('input[name="comment"]').type('Cypress is awesome!')
        
        // Cliquer sur Publish
        cy.get('button').contains('Publish').click()
        
        // Vérifier que le commentaire apparaît
        cy.contains('Cypress is awesome!').should('be.visible')
    })

    // Test 6: Tester que l'ajout d'un commentaire vide soit impossible car le bouton "Publish" reste désactivé
    it('should keep Publish button disabled when comment is empty', () => {
        // Ouvrir la lightbox
        cy.get('img[src*="picsum"]').first().click()
        
        // Vérifier que le bouton Publish est désactivé
        cy.get('button').contains('Publish').should('be.disabled')
        
        // Taper un espace
        cy.get('input[name="comment"]').type('   ')
        
        // Publier (le commentaire vide ne devrait pas être ajouté)
        cy.get('button').contains('Publish').click()
        
        // Vérifier qu'aucun commentaire n'est visible
        cy.get('[x-show="isCommentsVisible"]').should('not.be.visible')
    })

    // Test 7: Tester l'option qui cache les commentaires
    it('should hide comments when clicking hide button', () => {
        // Ouvrir la lightbox et ajouter un commentaire
        cy.get('img[src*="picsum"]').first().click()
        cy.get('input[name="comment"]').type('Test comment')
        cy.get('button').contains('Publish').click()
        
        // Vérifier que les commentaires sont visibles
        cy.contains('Test comment').should('be.visible')
        
        // Cacher les commentaires
        cy.contains('Hide').click()
        
        // Vérifier que les commentaires ne sont plus visibles
        cy.contains('Test comment').should('not.be.visible')
    })

    // Test 8: Tester les différents compteurs de commentaires sur l'overlay et la lightbox
    it('should display correct comment counts on overlay and lightbox', () => {
        // Ouvrir la lightbox
        cy.get('img[src*="picsum"]').first().click()
        
        // Ajouter un premier commentaire
        cy.get('input[name="comment"]').type('Premier commentaire')
        cy.get('button').contains('Publish').click()
        cy.wait(200)
        
        // Vérifier le compteur dans la lightbox
        cy.contains('1 comment').should('be.visible')
        
        // Ajouter un deuxième commentaire
        cy.get('input[name="comment"]').type('Deuxième commentaire')
        cy.get('button').contains('Publish').click()
        cy.wait(200)
        
        // Vérifier le compteur (pluriel)
        cy.contains('2 comments').should('be.visible')
        
        // Fermer en cliquant sur le fond
        cy.get('[x-show="isLightboxVisible"]').click('topLeft')
        cy.wait(300)
        
        // Hover pour vérifier l'overlay
        cy.get('img[src*="picsum"]').first().trigger('mouseover')
        
        // Vérifier le compteur sur l'overlay
        cy.get('[x-show="isOverlayVisible"]').within(() => {
            cy.get('div').contains('2').should('be.visible')
        })
    })

    // Test 9: Tester le singulier/pluriel en fonction du nombre de commentaires
    it('should display singular/plural based on comment count', () => {
        // Ouvrir la lightbox
        cy.get('img[src*="picsum"]').first().click()
        
        // Ajouter un commentaire
        cy.get('input[name="comment"]').type('Un seul commentaire')
        cy.get('button').contains('Publish').click()
        
        // Vérifier "1 comment" (singulier)
        cy.contains('1 comment').should('be.visible')
        cy.contains('1 comments').should('not.exist')
        
        // Ajouter un deuxième commentaire
        cy.get('input[name="comment"]').type('Deux commentaires')
        cy.get('button').contains('Publish').click()
        
        // Vérifier "2 comments" (pluriel)
        cy.contains('2 comments').should('be.visible')
    })

    // Test 10: Écrire trois commentaires et tester la suppression du second commentaire au clique sur la bonne croix
    it('should delete the second comment when clicking its delete button', () => {
        // Ouvrir la lightbox
        cy.get('img[src*="picsum"]').first().click()
        
        // Ajouter trois commentaires
        cy.get('input[name="comment"]').type('Premier commentaire')
        cy.get('button').contains('Publish').click()
        
        cy.get('input[name="comment"]').type('Deuxième commentaire')
        cy.get('button').contains('Publish').click()
        
        cy.get('input[name="comment"]').type('Troisième commentaire')
        cy.get('button').contains('Publish').click()
        
        // Vérifier que les 3 commentaires existent
        cy.contains('Premier commentaire').should('be.visible')
        cy.contains('Deuxième commentaire').should('be.visible')
        cy.contains('Troisième commentaire').should('be.visible')
        
        // Supprimer le deuxième commentaire (index 1)
        cy.get('svg[title="Supprimer le commentaire"]').eq(1).click()
        
        // Vérifier que le deuxième commentaire n'existe plus
        cy.contains('Deuxième commentaire').should('not.exist')
        
        // Vérifier que les autres commentaires existent toujours
        cy.contains('Premier commentaire').should('be.visible')
        cy.contains('Troisième commentaire').should('be.visible')
        
        // Vérifier le compteur
        cy.contains('2 comments').should('be.visible')
    })
})
