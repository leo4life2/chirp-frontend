// components/Header.tsx
import React from "react";

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    return (
        <div className="flex flex-row justify-between mb-6">
            <h1 className="text-2xl font-semibold">Chirp</h1>
            <button
                onClick={onLogout}
                className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
            >
                Logout
            </button>
        </div>
    );
};

export default Header;