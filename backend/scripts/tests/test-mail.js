'use strict';

/**
 * @file scripts/test-mail.js
 * @description Test manuel de la connexion SMTP et de l'envoi d'un e-mail.
 */

require('dotenv').config();

const {
    verifyMailTransport,
    sendRegistrationConfirmationEmail,
} = require('../../services/mailService');

async function main() {
    const targetEmail = process.env.MAIL_TEST_TO;

    if (!targetEmail) {
        throw new Error('MAIL_TEST_TO est manquante dans le fichier .env.');
    }

    await verifyMailTransport();
    console.log('SMTP OK : connexion et authentification valides.');

    const result = await sendRegistrationConfirmationEmail({
        to: targetEmail,
        userName: 'Salem',
    });

    console.log('E-mail envoye avec succes :');
    console.log(result);
}

main().catch((error) => {
    console.error('Erreur test e-mail :');
    console.error(error);
    process.exit(1);
});
