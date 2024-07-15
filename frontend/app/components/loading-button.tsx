import React from 'react';

interface LoadingButtonProps {
  handleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type: 'button' | 'submit' | 'reset';
  text: string;
  loadingText: string;
  disabled: boolean;
  className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  handleClick,
  type,
  text,
  loadingText,
  disabled,
  className = ''
}) => {
  const [loading, setLoading] = React.useState(false);

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setLoading(true);
    handleClick(e);
    setLoading(false);
  };

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
      className={`${className} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {loading ? loadingText : text}
    </button>
  );
};

export default LoadingButton;
