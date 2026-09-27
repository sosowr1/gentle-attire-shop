# Elysian Modesty

Génère un site e-commerce complet, moderne et ultra-premium spécialisé dans le prêt-à-porter pour femmes (mode modeste / modest fashion / hijabs, abayas, robes longues).

Le design doit être minimaliste, élégant et rassurant, inspiré des grandes marques de cosmétiques ou de mode éthique.

1. Charte Graphique & UI (Design System) :

   - Palette de couleurs : Tons doux, naturels et chics (Beige sable, Nude, Taupe clair, Blanc cassé) avec des textes en gris anthracite très foncé pour un contraste doux.

   - Typographie : Une police Serif très élégante pour les titres (ex: Playfair Display ou Lora) et une police Sans-Serif épurée pour le corps du texte (ex: Montserrat ou Inter).

   - Style visuel : Bords légèrement arrondis, ombres très douces, beaucoup d'espace blanc (breathing room) pour mettre en valeur les photos des vêtements.

2. Structure des Pages Requises :

   - Page d'accueil (Home) : 

     - Un grand Hero Banner avec une accroche élégante et un bouton "Découvrir la collection".

     - Une section "Catégories principales" (ex: Abayas, Hijabs, Ensembles, Accessoires) sous forme de grandes cartes visuelles.

     - Une section "Nouveautés" avec un carrousel de 4 à 6 produits.

   - Page Catalogue (Boutique) : 

     - Une grille de produits (3 par ligne sur PC, 2 sur mobile).

     - Une barre latérale de filtres (Catégorie, Taille, Couleur, Prix).

   - Page Produit Détaillée : 

     - Grande galerie photo à gauche.

     - À droite : Titre, Prix, Sélecteur de taille (S, M, L, XL), Sélecteur de couleur, description du tissu/matière, et un gros bouton "Ajouter au panier".

3. Fonctionnalités Techniques (Front-end) :

   - Crée un système de Panier (Cart) fonctionnel en local : quand on clique sur "Ajouter au panier", une barre latérale (Slide-over) ou une notification s'ouvre pour confirmer l'ajout.

   - Le compteur du panier dans la barre de navigation doit se mettre à jour dynamiquement en haut à droite.

4. Mock-Data (Données fictives) :

   - Remplis le site avec un faux catalogue d'environ 8 vêtements cohérents avec le thème (noms élégants comme "Abaya Soie de Médine", "Ensemble Côtelé Nude", "Hijab Mousseline Premium") et des prix réalistes (ex: 35€ - 89€) pour que je puisse visualiser le rendu complet immédiatement.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a48e25b7-4cb7-40e0-a0e0-c620fe551206).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
