import React from 'react';
import { ParametersModal } from '../modals';

export const Header: React.FunctionComponent = () => {
    const paramModal = React.useRef<HTMLDialogElement>(null);

    return (
        <>
            <nav className="navbar bg-base-100">
                <div className="navbar-start">
                    <title className="btn btn-ghost text-2xl">Golay&apos;s C23 playground</title>
                </div>
                <div className="navbar-end">
                    <ul className="menu menu-horizontal p-0">
                        <li>
                            <button className="btn btn-ghost text-base" onClick={() => paramModal.current!.showModal()}>
                                Parameters
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
            <ParametersModal dialogRef={paramModal} />
        </>
    );
};
