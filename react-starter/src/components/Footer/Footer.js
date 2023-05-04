import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__links">
                    <h3>À propos</h3>
                    <ul>
                        <li><a href="/about">Qui sommes-nous ?</a></li>
                        <li><a href="/careers">Carrières</a></li>
                        <li><a href="/press">Presse</a></li>
                    </ul>
                </div>
                <div className="footer__links">
                    <h3>Aide</h3>
                    <ul>
                        <li><a href="/help-center">Centre d'aide</a></li>
                        <li><a href="/contact">Contactez-nous</a></li>
                        <li><a href="/faq">FAQ</a></li>
                    </ul>
                </div>
                <div className="footer__links">
                    <h3>Politiques</h3>
                    <ul>
                        <li><a href="/terms">Conditions d'utilisation</a></li>
                        <li><a href="/privacy">Politique de confidentialité</a></li>
                        <li><a href="/cookies">Politique en matière de cookies</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer__copyright">
                &copy; {new Date().getFullYear()} React Airbnb. Tous droits réservés.
            </div>
        </footer>
    );
}

export default Footer;
