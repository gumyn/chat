# GunChat - Chat Décentralisé

Une application de chat décentralisée, sécurisée et en temps réel construite avec [Gun.js](https://gun.eco/).

## Fonctionnalités

- **Décentralisé** : Pas de base de données centrale, tout est stocké via le réseau P2P de Gun.js.
- **Temps Réel** : Les messages apparaissent instantanément.
- **Chiffrement** : Les messages privés sont chiffrés de bout en bout (E2EE) avec SEA (Security, Encryption, Authorization).
- **Interface Moderne** : Design "Glassmorphism" soigné et responsive.

## Comment l'utiliser

1. Ouvrez `index.html` dans votre navigateur.
2. Créez un compte (les données sont stockées localement et synchronisées avec les pairs).
3. Connectez-vous et commencez à chatter !

## Déploiement

Ce site est statique et peut être hébergé n'importe où (GitHub Pages, Vercel, Netlify).

### Localement

```bash
node server.js
# ou
npx http-server .
```
