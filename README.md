# cypress-course

Projet pédagogique pour pratiquer les tests end-to-end avec Cypress sur deux mini-applications front:
- un chiffrement de César (`src/caesar/index.html`)
- une lightbox interactive (`src/lightbox.html`)

## Objectifs pédagogiques

- Découvrir la structure d'un projet Cypress.
- Ecrire et lire des tests e2e sur une interface web simple.
- Utiliser des sélecteurs robustes via `data-cy`.
- Valider des comportements utilisateur (clic, saisie, affichage, compteurs, erreurs).

## Stack et prérequis

- Node.js (version LTS recommandée)
- npm
- Cypress `^15.10.0` (installé via les dépendances du projet)

## Installation

Depuis la racine du projet:

```bash
npm install
```

## Lancement des tests Cypress (mode interactif + headless)

Mode interactif (Cypress UI):

```bash
npx cypress open
```

Mode headless (terminal):

```bash
npx cypress run
```

Exécution ciblée (utile pour valider rapidement un fichier):

```bash
npx cypress run --spec cypress/e2e/caesar.cy.js
npx cypress run --spec cypress/e2e/lightbox.cy.js
```

Note importante: les specs d'exemple `cypress/e2e/examples/*.cy.js` sont exclues par la configuration Cypress via:
- `excludeSpecPattern: '**/examples/*.cy.js'` dans `cypress.config.js`

## Arborescence utile du projet

```text
cypress-course/
├─ cypress.config.js
├─ cypress/
│  ├─ e2e/
│  │  ├─ index.cy.js
│  │  ├─ caesar.cy.js
│  │  ├─ lightbox.cy.js
│  │  └─ examples/ (exclu par config)
│  └─ support/
│     ├─ e2e.js
│     └─ commands.js
├─ src/
│  ├─ caesar/
│  │  ├─ index.html
│  │  ├─ main.js
│  │  └─ main.css
│  └─ lightbox.html
└─ docs/
   ├─ Cypress v2.pdf
   └─ TP - Cypress - Lightbox-v2.pdf
```

## Scenarios couverts

### `cypress/e2e/index.cy.js`
- Vérifie un premier scenario simple sur la page Caesar (`Hello World !`).

### `cypress/e2e/caesar.cy.js`
- Chiffrement correct d'un message avec une clé valide.
- Gestion d'erreur si la clé est hors bornes (`1` a `25`).
- Utilisation de la commande custom `cy.dataCY()` (définie dans `cypress/support/commands.js`) pour cibler les éléments via `data-cy`.

### `cypress/e2e/lightbox.cy.js`
- Ouverture/fermeture de la lightbox.
- Like/dislike et mise a jour des compteurs.
- Ajout de commentaires, gestion du bouton `Publish`.
- Affichage singulier/pluriel des commentaires.
- Suppression d'un commentaire ciblé.

## Limites / points d'attention

### Points connus

- Certains accents apparaissent mal encodés dans des fichiers existants (ex: `clÃ©`, `VÃ©rifier`).
- Le script `npm test` n'est pas exploitable actuellement (`"test": "echo \"Error: no test specified\" && exit 1"` dans `package.json`).

## Ressources (docs)

- `docs/Cypress v2.pdf`
- `docs/TP - Cypress - Lightbox-v2.pdf`
