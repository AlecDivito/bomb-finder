import React from 'react';
import "./Loading.css"

const Loading: React.FC = () => {
    return <div className="loading">
        Loading
        <span className="loading--period">.</span>
        <span className="loading--period">.</span>
        <span className="loading--period">.</span>
    </div>
}

export default Loading