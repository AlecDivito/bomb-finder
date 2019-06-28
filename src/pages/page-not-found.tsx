import React from 'react';
import "../components/Button.css"
import "./page-not-found.css"
import { Link } from 'react-router-dom';

const PageNotFound: React.FC = () => {
    return <div className="page-not-found">
        <h1>404</h1>
        <div className="page-not-found__message">
            Looks like you've lost your way
        </div>
        <Link to="/" className="link-button page-not-found__btn">
            Go Home
        </Link>
    </div>
}

export default PageNotFound;