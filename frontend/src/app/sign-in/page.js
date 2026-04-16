/**
 * @file src/app/sign-in/page.js
 * @description
 * Page d'inscription Kasa.
 */

import SignInClientView from './SignInClientView';

export const metadata = {
    title: 'Inscription',
    description: 'Créez votre compte Kasa.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function SignInPage() {
    return <SignInClientView />;
}
