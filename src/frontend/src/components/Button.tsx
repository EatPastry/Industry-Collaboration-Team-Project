import React from "react";

type ButtonProps = {
    text: string; // Button label
    onClick: () => void; // Click handler
    className?: string; // Optional custom styling
}

const Button: React.FC <ButtonProps> = ({ text, onClick, className }) => {
    return (
        <button className={`${className}`} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;