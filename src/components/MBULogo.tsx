import React, { useState, useEffect } from 'react';

interface MBULogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showUploadOption?: boolean;
}

export const MBULogo: React.FC<MBULogoProps> = ({
  className = '',
  size = 'md',
  showUploadOption = false,
}) => {
  // Potential sources for the uploaded MBU logo
  const [logoSrc, setLogoSrc] = useState<string>('/mbu-logo.svg');
  const [hasCustomLogo, setHasCustomLogo] = useState<boolean>(false);

  useEffect(() => {
    // Check if custom logo was saved in localStorage or exists at typical paths
    const saved = localStorage.getItem('mbu_uploaded_logo');
    if (saved) {
      setLogoSrc(saved);
      setHasCustomLogo(true);
      return;
    }

    // Probe if user uploaded /mbu-logo.png or /mbu-logo.jpg into public root
    const probeImg = new Image();
    probeImg.onload = () => {
      setLogoSrc('/mbu-logo.png');
      setHasCustomLogo(true);
    };
    probeImg.onerror = () => {
      const probeJpg = new Image();
      probeJpg.onload = () => {
        setLogoSrc('/mbu-logo.jpg');
        setHasCustomLogo(true);
      };
      probeJpg.onerror = () => {
        setLogoSrc('/mbu-logo.svg');
      };
      probeJpg.src = '/mbu-logo.jpg';
    };
    probeImg.src = '/mbu-logo.png';
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          localStorage.setItem('mbu_uploaded_logo', result);
          setLogoSrc(result);
          setHasCustomLogo(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10 sm:h-11 sm:w-11',
    lg: 'h-16 w-16',
  };

  return (
    <div className={`relative flex items-center shrink-0 group ${className}`}>
      <img
        src={logoSrc}
        alt="Mohan Babu University (MBU) Official Logo"
        className={`${sizeClasses[size]} object-contain rounded-md transition-transform duration-200 group-hover:scale-105`}
        onError={(e) => {
          // Fallback to SVG if external file fails
          if (logoSrc !== '/mbu-logo.svg') {
            (e.target as HTMLImageElement).src = '/mbu-logo.svg';
          }
        }}
      />
      {showUploadOption && (
        <label
          title="Upload or update MBU Logo image"
          className="ml-1 cursor-pointer text-[10px] text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100 flex items-center"
        >
          <span className="hidden sm:inline">Change</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="sr-only"
          />
        </label>
      )}
    </div>
  );
};
