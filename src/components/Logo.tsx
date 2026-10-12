import React from 'react';

interface LogoProps {
  variant?: 'full' | 'mark-only' | 'wordmark-only' | 'compact';
  className?: string;
  light?: boolean;
}

/**
 * Uploaded "Medium Logo.svg":
 * Royal Blue background (#162884) with the official stylized serif "M"
 * featuring the faceted left cut, classical right column pillar, and 4-point sparkle star (✦)
 */
export const MediumMark: React.FC<{ size?: number; className?: string }> = ({
  size = 42,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex-shrink-0 flex items-center justify-center rounded-xl bg-[#162884] shadow-md shadow-blue-950/60 overflow-hidden group-hover:scale-105 transition-transform duration-300 ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[82%] h-[82%]"
        aria-label="MEDIUM Official Logo"
      >
        {/* Left faceted angled stroke */}
        <path
          d="M24 25H38L49.5 54.5L44 69L24 25Z"
          fill="white"
        />
        {/* Top serif on left stroke */}
        <path
          d="M23 25H39V27.5H23V25Z"
          fill="white"
        />

        {/* Right Roman column pillar with classical bilateral serifs */}
        <path
          d="M59.5 28.5H70.5V65.5H59.5V28.5Z"
          fill="white"
        />
        {/* Top bracket serif */}
        <path
          d="M56 25H74C74 25 72 26 71.5 28.5H58.5C58 26 56 25 56 25Z"
          fill="white"
        />
        {/* Bottom bracket serif */}
        <path
          d="M56 69H74C74 69 72 68 71.5 65.5H58.5C58 68 56 69 56 69Z"
          fill="white"
        />

        {/* 4-point sparkle star (✦) at lower left */}
        <path
          d="M28.5 76C28.5 72.5 23 70 23 70C23 70 28.5 67.5 28.5 64C28.5 67.5 34 70 34 70C34 70 28.5 72.5 28.5 76Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

/**
 * Uploaded "Meium Name.svg":
 * Official website brand name "MEDIUM EVENTS" with transparent background
 * High-contrast luxury serif letterforms with signature sparkles and tracked "E V E N T S"
 */
export const MediumWordmark: React.FC<{ light?: boolean; className?: string }> = ({
  light = true,
  className = '',
}) => {
  const fill = light ? '#FFFFFF' : '#0B132B';

  return (
    <div className={`flex flex-col justify-center leading-none select-none ${className}`}>
      {/* "MEDIUM" Display Serif */}
      <div className="flex items-baseline">
        <svg
          viewBox="0 0 250 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 sm:h-8 w-auto"
          aria-label="MEDIUM"
        >
          {/* First M: Faceted cut + right pillar + bottom-left sparkle */}
          <g>
            <path d="M12 12H23.5L33.5 37.5L29 48L12 12Z" fill={fill} />
            <path d="M11 12H24.5V14H11V12Z" fill={fill} />
            <path d="M41 15H49.5V45H41V15Z" fill={fill} />
            <path d="M38 12H52.5C52.5 12 51 13 50.5 15H40C39.5 13 38 12 38 12Z" fill={fill} />
            <path d="M38 48H52.5C52.5 48 51 47 50.5 45H40C39.5 47 38 48 38 48Z" fill={fill} />
            {/* Sparkle ✦ at lower left */}
            <path
              d="M16 53C16 50.5 11.5 49 11.5 49C11.5 49 16 47.5 16 45C16 47.5 20.5 49 20.5 49C20.5 49 16 50.5 16 53Z"
              fill={fill}
            />
          </g>

          {/* E */}
          <g>
            <path d="M59 48V12H83V17H66.5V26.5H79.5V31.5H66.5V43H84V48H59Z" fill={fill} />
            <path d="M56 12H64V14.5H56V12Z" fill={fill} />
            <path d="M56 45.5H64V48H56V45.5Z" fill={fill} />
          </g>

          {/* D */}
          <g>
            <path
              d="M91 48V12H104C114.5 12 121.5 19 121.5 30C121.5 41 114.5 48 104 48H91ZM98 42.5H103.5C110.5 42.5 114.5 37.5 114.5 30C114.5 22.5 110.5 17.5 103.5 17.5H98V42.5Z"
              fill={fill}
            />
            <path d="M88 12H96V14.5H88V12Z" fill={fill} />
            <path d="M88 45.5H96V48H88V45.5Z" fill={fill} />
          </g>

          {/* I */}
          <g>
            <path d="M130 15H137.5V45H130V15Z" fill={fill} />
            <path d="M126 12H141.5C141.5 12 140 13 139.5 15H128C127.5 13 126 12 126 12Z" fill={fill} />
            <path d="M126 48H141.5C141.5 48 140 47 139.5 45H128C127.5 47 126 48 126 48Z" fill={fill} />
          </g>

          {/* U */}
          <g>
            <path
              d="M149 12H156.5V33C156.5 38.5 160 42 165.5 42C171 42 174.5 38.5 174.5 33V15H182V45H174.5V42.5C173 45.5 168.5 48 163 48C154.5 48 149 42 149 33V12Z"
              fill={fill}
            />
            <path d="M146 12H158V14.5H146V12Z" fill={fill} />
            <path d="M172 12H184.5C184.5 12 183 13 182.5 15H174C173.5 13 172 12 172 12Z" fill={fill} />
            <path d="M172 48H184.5C184.5 48 183 47 182.5 45H174C173.5 47 172 48 172 48Z" fill={fill} />
          </g>

          {/* Second M with sparkle at bottom right */}
          <g>
            <path d="M192 15H200.5V45H192V15Z" fill={fill} />
            <path d="M189 12H203.5C203.5 12 202 13 201.5 15H191C190.5 13 189 12 189 12Z" fill={fill} />
            <path d="M189 48H203.5C203.5 48 202 47 201.5 45H191C190.5 47 189 48 189 48Z" fill={fill} />

            <path d="M211 12H222.5L232.5 37.5L228 48L211 12Z" fill={fill} />
            <path d="M210 12H223.5V14H210V12Z" fill={fill} />

            {/* Sparkle ✦ at lower right */}
            <path
              d="M236 53C236 50.5 231.5 49 231.5 49C231.5 49 236 47.5 236 45C236 47.5 240.5 49 240.5 49C240.5 49 236 50.5 236 53Z"
              fill={fill}
            />
          </g>
        </svg>
      </div>

      {/* "E V E N T S" Sub-Text precisely tracked underneath */}
      <div className="flex justify-between items-center px-1 mt-0.5 tracking-[0.45em] text-[8.5px] sm:text-[9.5px] font-medium text-slate-300 uppercase">
        <span>E</span>
        <span>V</span>
        <span>E</span>
        <span>N</span>
        <span>T</span>
        <span>S</span>
      </div>
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '', light = true }) => {
  if (variant === 'mark-only') {
    return <MediumMark className={className} />;
  }

  if (variant === 'wordmark-only') {
    return <MediumWordmark light={light} className={className} />;
  }

  return (
    <div className={`flex items-center gap-3.5 select-none group ${className}`}>
      {/* Uploaded "Medium Logo.svg" Mark */}
      <MediumMark size={40} />

      {/* Uploaded "Meium Name.svg" Wordmark with background removed */}
      {variant !== 'compact' && <MediumWordmark light={light} />}
    </div>
  );
};
