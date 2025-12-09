const express = require('express');
const Gun = require('gun');
const cors = require('cors');
const path = require('path');
// const stripe = require('stripe')('VOTRE_CLE_SECRETE_STRIPE_ICI');

const app = express();
const PORT = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files (index.html)

// --- Gun.js Setup ---
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Gun peer available at http://localhost:${PORT}/gun`);
});
const gun = Gun({ web: server });

// --- API Routes ---

// Route pour créer un lien de paiement à la volée
app.post('/api/create-checkout-session', async (req, res) => {
    const { affiliatePub, productId } = req.body;

    try {
        // 1. Récupérer le taux de commission depuis Gun (Côté Serveur = Sécurisé)
        // On utilise une Promise pour attendre la réponse de Gun
        const commissionRate = await new Promise((resolve) => {
            gun.get('affiliate_rates').get(affiliatePub).once((rate) => {
                resolve(rate || 0); // 0% par défaut
            });
        });

        console.log(`Creating link for affiliate ${affiliatePub} with rate ${commissionRate}%`);

        // 2. Calculer les montants (Exemple pour un produit à 100€)
        const productPrice = 10000; // 100.00 en centimes
        const commissionAmount = Math.floor(productPrice * (commissionRate / 100));

        // 3. Créer la session Stripe
        // NOTE: Décommentez le code Stripe une fois votre clé API configurée

        /*
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: { name: 'Abonnement Premium' },
                    unit_amount: productPrice,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/success.html`,
            cancel_url: `${req.protocol}://${req.get('host')}/cancel.html`,
            
            // --- C'est ICI que la magie opère ---
            
            // OPTION A : Tracking simple (Vous payez manuellement le vendeur plus tard)
            metadata: {
                affiliate_id: affiliatePub,
                commission_rate: commissionRate,
                commission_amount: commissionAmount
            },
            client_reference_id: affiliatePub,

            // OPTION B : Paiement Automatique (Nécessite Stripe Connect)
            // payment_intent_data: {
            //     transfer_data: {
            //         destination: 'COMPTE_STRIPE_CONNECT_DU_VENDEUR', // Il faudrait stocker ça dans Gun aussi
            //         amount: commissionAmount,
            //     },
            // },
        });
        
        res.json({ url: session.url });
        */

        // MOCK RESPONSE (Pour la démo sans clé Stripe)
        res.json({
            url: `https://checkout.stripe.com/mock-link?affiliate=${affiliatePub}&rate=${commissionRate}`,
            mock: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création du lien' });
    }
});

// Fallback pour les fichiers statiques
app.get('*', (req, res) => {
    if (req.url.startsWith('/gun')) return; // Let Gun handle its requests
    res.sendFile(path.join(__dirname, 'index.html'));
});
