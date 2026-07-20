# Espace client + MCP sécurisé

## Ce qui va changer

**Côté visiteur** — l'app reste publique (accueil, boutique, fiches produit, panier local). Nouveauté : un bouton **Se connecter** dans le header.

**Côté client connecté** :
- Inscription/connexion par **e-mail + mot de passe** et **Google**
- Page **Mon compte** avec : mes informations, mes **commandes**, mes **favoris** (❤️ sur chaque produit)
- **Panier synchronisé** : ajouté depuis un ordi → retrouvé sur mobile
- Une commande factice est créée quand on clique « Passer commande » (pas de paiement réel — hors périmètre)

**Côté MCP** — l'endpoint `/mcp` passe de public à **protégé par OAuth** :
- Un assistant IA (Claude, ChatGPT…) qui se connecte demande à l'utilisateur de se connecter à la boutique
- L'assistant agit ensuite « en tant que » cet utilisateur
- Outils **publics** (accessibles à tout compte connecté) : `list_categories`, `list_products`, `get_product`
- Outils **privés** (données du client connecté uniquement) : `list_my_orders`, `get_my_order`, `list_my_favorites`, `add_favorite`, `remove_favorite`, `get_my_cart`

## Étapes techniques

1. **Activer Lovable Cloud** (base de données + auth managée).
2. **Schéma DB** — tables `profiles`, `favorites`, `orders`, `order_items`, `cart_items` avec RLS `auth.uid()`, trigger auto-création profil, grants publishable pour le catalogue produits.
3. **Auth UI** — route publique `/auth` (email/mot de passe + Google via broker Lovable), route `/reset-password`, header avec menu compte dynamique.
4. **Espace client** — `_authenticated/compte`, `_authenticated/commandes`, `_authenticated/favoris` avec les server functions correspondantes.
5. **Panier hybride** — panier local pour visiteurs, synchro DB à la connexion, merge sans perte.
6. **OAuth Server** — activer `configure_oauth_server`, ajouter la route de consentement `/.lovable/oauth/consent` qui préserve `authorization_id` à travers login **et** signup **et** Google.
7. **MCP protégé** — passer `defineMcp` en `auth.oauth.issuer` (issuer direct Supabase), refactoriser les outils pour utiliser `ctx.getUserId()` + un client Supabase forwardant le bearer (RLS sous l'identité utilisateur).
8. **Vérification** — build + un login e2e + test des tools privés.

## Ce qui n'est pas inclus

- Paiement réel (Stripe/PayPal) — dites-moi si vous en voulez un après.
- Espace admin (gestion stock/produits) — non demandé.
- Vérification d'e-mail obligatoire — désactivée par défaut pour un onboarding fluide en dev.

Je démarre dès que vous validez.