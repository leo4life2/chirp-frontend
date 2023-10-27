// components/Header.tsx
import React from "react";
import Chirp from '../components/graphics/chirp';

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    return (
        <div className="flex flex-row items-center justify-between mb-6">
            <div className="flex flex-row items-center">
                <Chirp className="mr-2 w-14 h-14" />
                <h1 className="text-2xl font-semibold">Chirp</h1>
            </div>
            <button
                onClick={onLogout}
                className="text-sm transition duration-200 bg-duck-body hover:text-white hover:bg-duck-eye py-2 px-4 rounded-md"
            >
                Logout
            </button>
        </div>
    );
};

export default Header;
