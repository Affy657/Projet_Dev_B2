import React from 'react';
import './Footer.css';

function Footer() {
    const youtubeLink = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__links">
                    <h3>À propos</h3>
                    <ul>
                        <li><a href={youtubeLink}>Qui sommes-nous ?</a></li>
                        <li><a href={youtubeLink}>Carrières</a></li>
                        <li><a href={youtubeLink}>Presse</a></li>
                    </ul>
                </div>
                <div className="footer__links">
                    <h3>Aide</h3>
                    <ul>
                        <li><a href={youtubeLink}>Centre d'aide</a></li>
                        <li><a href={youtubeLink}>Contactez-nous</a></li>
                        <li><a href={youtubeLink}>FAQ</a></li>
                    </ul>
                </div>
                <div className="footer__links">
                    <h3>Politiques</h3>
                    <ul>
                        <li><a href={youtubeLink}>Conditions d'utilisation</a></li>
                        <li><a href={youtubeLink}>Politique de confidentialité</a></li>
                        <li><a href={youtubeLink}>Politique en matière de cookies</a></li>
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
