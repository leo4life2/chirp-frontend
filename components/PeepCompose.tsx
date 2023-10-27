// components/PeepCompose.tsx
import React, { useState } from "react";

interface PeepComposeProps {
    onPost: (content: string, setContent: (value: string) => void) => void;
}

const PeepCompose: React.FC<PeepComposeProps> = ({ onPost }) => {
    const [peepContent, setPeepContent] = useState("");

    return (
        <div className="rounded-md p-6 bg-box-color mb-6">
            <h2 className="text-xl font-semibold mb-4">Compose your Peep</h2>
            <textarea
                placeholder="What's happening?"
                className="w-full border bg-box-color rounded-md p-4 mb-4 resize-y"
                value={peepContent}
                onChange={(e) => setPeepContent(e.target.value)}
                rows={4}
            ></textarea>
            <button
                className="bg-duck-body hover:bg-duck-eye text-duck-eye hover:text-white font-semibold py-2 px-6 rounded-md transition duration-200"
                onClick={() => onPost(peepContent, setPeepContent)}
            >
                Peep
            </button>
        </div>
    );
};

export default PeepCompose;
