import React from 'react';

export default function Logo({ className = "navbar-logo", size = 40 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Ring & Vine Gradient */}
        <linearGradient id="ringGradient" x1="50" y1="50" x2="450" y2="450" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="40%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        {/* Outer Ring Inner Accent */}
        <linearGradient id="innerRingGradient" x1="100" y1="100" x2="400" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>

        {/* Back Leaf (Darker Emerald) */}
        <linearGradient id="backLeafGrad" x1="180" y1="150" x2="280" y2="330" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#044E35" />
        </linearGradient>

        {/* Front Leaf (Bright Lime-Green) */}
        <linearGradient id="frontLeafGrad" x1="210" y1="200" x2="350" y2="410" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="30%" stopColor="#4ADE80" />
          <stop offset="70%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        {/* Small Vine Leaves Gradient */}
        <linearGradient id="vineLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="50%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>

        <filter id="logoGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#15803D" floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter="url(#logoGlow)">
        {/* Main Swirling Circle Ring */}
        <path
          d="M 250,55 A 195,195 0 1,1 105,395"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="24"
          strokeLinecap="round"
        />

        {/* Inner Arc Accent Line */}
        <path
          d="M 230,95 A 155,155 0 0,0 110,305"
          fill="none"
          stroke="url(#innerRingGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Upper-Left Vine Branch */}
        <path
          d="M 120,210 C 100,160 130,110 185,75 C 210,60 230,52 230,52"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Upper Left Leaves */}
        {/* Leaf 1 (Topmost) */}
        <path
          d="M 185,75 C 180,30 225,25 240,45 C 230,70 200,80 185,75 Z"
          fill="url(#vineLeafGrad)"
          stroke="#064E3B"
          strokeWidth="2.5"
        />
        {/* Leaf 2 */}
        <path
          d="M 145,115 C 120,80 155,60 175,85 C 170,110 150,120 145,115 Z"
          fill="url(#vineLeafGrad)"
          stroke="#064E3B"
          strokeWidth="2.5"
        />
        {/* Leaf 3 */}
        <path
          d="M 115,160 C 80,135 110,110 135,135 C 135,155 120,165 115,160 Z"
          fill="url(#vineLeafGrad)"
          stroke="#064E3B"
          strokeWidth="2.5"
        />
        {/* Leaf 4 (Lowest on upper branch) */}
        <path
          d="M 95,215 C 55,200 80,170 108,190 C 110,210 98,220 95,215 Z"
          fill="url(#vineLeafGrad)"
          stroke="#064E3B"
          strokeWidth="2.5"
        />

        {/* Lower-Right Vine Branch */}
        <path
          d="M 310,430 C 370,445 425,400 440,340"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Lower Right Leaves */}
        {/* Leaf 1 (Bottom rightmost) */}
        <path
          d="M 440,340 C 485,325 480,270 445,280 C 430,300 430,325 440,340 Z"
          fill="url(#vineLeafGrad)"
          stroke="#064E3B"
          strokeWidth="2.5"
        />
        {/* Leaf 2 */}
        <path
          d="M 400,390 C 440,380 435,340 405,350 C 395,370 395,385 400,390 Z"
          fill="url(#vineLeafGrad)"
          stroke="#064E3B"
          strokeWidth="2.5"
        />
        {/* Leaf 3 */}
        <path
          d="M 350,425 C 380,440 375,475 350,455 C 340,440 345,430 350,425 Z"
          fill="url(#vineLeafGrad)"
          stroke="#064E3B"
          strokeWidth="2.5"
        />
        {/* Leaf 4 */}
        <path
          d="M 290,440 C 310,470 300,490 280,475 C 275,455 285,445 290,440 Z"
          fill="url(#vineLeafGrad)"
          stroke="#064E3B"
          strokeWidth="2.5"
        />

        {/* Center Back Leaf (Dark Emerald) */}
        <g>
          <path
            d="M 230,150 C 160,180 150,270 210,325 C 240,310 280,265 280,250 C 270,180 245,155 230,150 Z"
            fill="url(#backLeafGrad)"
            stroke="#044E35"
            strokeWidth="3.5"
          />
          {/* Back Leaf Midrib */}
          <path
            d="M 230,152 C 215,200 205,260 210,323"
            fill="none"
            stroke="#86EFAC"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* Center Front Leaf (Bright Lime-Green) */}
        <g>
          <path
            d="M 315,205 C 220,240 200,340 220,405 C 255,385 345,340 355,285 C 360,250 340,215 315,205 Z"
            fill="url(#frontLeafGrad)"
            stroke="#065F46"
            strokeWidth="4"
          />
          {/* Front Leaf Midrib */}
          <path
            d="M 315,207 C 275,260 240,335 220,402"
            fill="none"
            stroke="#DCFCE7"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Front Leaf Secondary Vein Detail */}
          <path
            d="M 285,250 C 295,275 320,290 335,295"
            fill="none"
            stroke="#86EFAC"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
      </g>
    </svg>
  );
}
