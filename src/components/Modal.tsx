import React from "react";
import "./Modal.css";

type Props = {
    show: boolean;
    header: string;
    close: () => void;
    submit: () => void;
}

export const Modal: React.FC<Props> = ({ show, header, close, submit, children}) => {
    return (
        <div className="modal"
            style={{
                transform: show ? 'translateY(0vh)' : 'translateY(-100vh)',
                opacity: show ? 1 : 0
            }}
        >
            <div className="modal__header">
                <h3>{header}</h3>
                <span className="modal__header--close" onClick={close}></span>
            </div>
            <div className="modal__body">
                <p>
                    {children}
                </p>
            </div>
            <div className="modal__footer">
                <button className="modal__footer--close" onClick={close}>Close</button>
                <button className="modal__footer--continue" onClick={submit}>Continue</button>
            </div>
        </div>
    )
}