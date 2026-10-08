import React, { useState, useRef, useEffect } from 'react';
import { DisciplineCategory } from '../engine/types';

interface CartoonMascotProps {
  stream: DisciplineCategory | 'all';
  isSelected?: boolean;
  onJumpTriggered?: () => void;
}

export const CartoonMascot: React.FC<CartoonMascotProps> = ({ stream, isSelected = false }) => {
  const [isJumping, setIsJumping] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [showReaction, setShowReaction] = useState(false);

  // Cooldown timers ref
  const jumpTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, []);

  const triggerJump = () => {
    // Cannot jump if already jumping or within 2 seconds cooldown
    if (isJumping || cooldown) return;

    setIsJumping(true);
    setShowReaction(true);

    // Jump animation takes 700ms to complete
    jumpTimerRef.current = setTimeout(() => {
      setIsJumping(false);
      setShowReaction(false);
      setCooldown(true);

      // Enforce 2 seconds cooldown after landing before next jump is allowed
      cooldownTimerRef.current = setTimeout(() => {
        setCooldown(false);
      }, 2000);
    }, 700);
  };

  return (
    <div
      className="relative select-none pointer-events-auto cursor-pointer"
      onMouseEnter={triggerJump}
      onMouseOver={triggerJump}
      onClick={triggerJump}
      title="Hover or click to make me jump!"
    >
      {/* Floating Reaction Bubble when Jumping */}
      {showReaction && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-zinc-900/90 text-white dark:bg-white/95 dark:text-zinc-900 text-[10px] font-extrabold shadow-md pointer-events-none animate-bounce z-30">
          {stream === 'medical' && '💓 Lub-Dub!'}
          {stream === 'computing' && '💻 Code green!'}
          {stream === 'engineering' && '⚙️ High torque!'}
          {stream === 'business' && '📈 Bullish!'}
          {stream === 'all' && '🎓 Merit ready!'}
        </div>
      )}

      {/* Main Mascot Container with Physics Animations */}
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 transition-transform duration-200 ${
          isJumping
            ? 'animate-mascot-jump'
            : isSelected
            ? 'animate-mascot-idle'
            : 'hover:scale-105'
        }`}
      >
        {stream === 'medical' && <MedicalDoctorMascot isSelected={isSelected} isJumping={isJumping} />}
        {stream === 'computing' && <ComputingCoderMascot isSelected={isSelected} isJumping={isJumping} />}
        {stream === 'engineering' && <EngineeringMascot isSelected={isSelected} isJumping={isJumping} />}
        {stream === 'business' && <BusinessExecutiveMascot isSelected={isSelected} isJumping={isJumping} />}
        {stream === 'all' && <AllDisciplinesScholarMascot isSelected={isSelected} isJumping={isJumping} />}
      </div>

      {/* Dust/Sparkle landing effects */}
      {isJumping && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-80 pointer-events-none">
          <span className="w-1.5 h-1 rounded-full bg-rose-400 dark:bg-rose-300 animate-ping" />
          <span className="w-2 h-1 rounded-full bg-amber-400 dark:bg-amber-300 animate-pulse" />
          <span className="w-1.5 h-1 rounded-full bg-teal-400 dark:bg-teal-300 animate-ping" />
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------
 * 1. MEDICAL & DENTAL MASCOT: "Dr. ClaudeCat"
 * Claude & GitHub Octocat inspired wearing doctor coat + stethoscope in ears
 * ------------------------------------------------------------- */
const MedicalDoctorMascot: React.FC<{ isSelected: boolean; isJumping: boolean }> = () => {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
      <defs>
        <radialGradient id="medFaceGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffedd5" />
          <stop offset="70%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fba36e" />
        </radialGradient>
        <linearGradient id="coatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="scrubGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Ears */}
      <path d="M 24 34 L 14 16 C 12 12, 18 10, 24 16 L 36 30 Z" fill="#fba36e" stroke="#ea580c" strokeWidth="2.5" />
      <path d="M 22 28 L 17 19 C 16 17, 19 16, 22 19 L 29 27 Z" fill="#fca5a5" />

      <path d="M 76 34 L 86 16 C 88 12, 82 10, 76 16 L 64 30 Z" fill="#fba36e" stroke="#ea580c" strokeWidth="2.5" />
      <path d="M 78 28 L 83 19 C 84 17, 81 16, 78 19 L 71 27 Z" fill="#fca5a5" />

      {/* Head */}
      <rect x="20" y="24" width="60" height="48" rx="24" ry="24" fill="url(#medFaceGrad)" stroke="#c2410c" strokeWidth="2.5" />

      {/* Doctor Head Mirror / Medical Band */}
      <path d="M 24 33 Q 50 26 76 33" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="50" cy="28" r="6" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
      <circle cx="50" cy="28" r="2.5" fill="#38bdf8" />

      {/* Eyes (Anime / GitHub Mona style) */}
      <ellipse cx="36" cy="45" rx="5" ry="6" fill="#1e293b" />
      <ellipse cx="64" cy="45" rx="5" ry="6" fill="#1e293b" />
      <circle cx="34.5" cy="43" r="2.2" fill="#ffffff" />
      <circle cx="62.5" cy="43" r="2.2" fill="#ffffff" />
      <circle cx="38" cy="47" r="1.1" fill="#ffffff" />
      <circle cx="66" cy="47" r="1.1" fill="#ffffff" />

      {/* Cute Blush Cheeks */}
      <ellipse cx="28" cy="51" rx="4.5" ry="2.5" fill="#f43f5e" opacity="0.45" />
      <ellipse cx="72" cy="51" rx="4.5" ry="2.5" fill="#f43f5e" opacity="0.45" />

      {/* Cute Cat Nose & Smile */}
      <polygon points="50,49 47.5,52 52.5,52" fill="#e11d48" />
      <path d="M 46 54 Q 50 57 54 54" stroke="#7c2d12" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Doctor White Coat (Sitting Body) */}
      <path d="M 22 68 Q 50 63 78 68 L 84 94 Q 50 96 16 94 Z" fill="url(#coatGrad)" stroke="#94a3b8" strokeWidth="2" />

      {/* Teal/Sky Medical Scrubs Collar */}
      <polygon points="50,66 42,75 58,75" fill="url(#scrubGrad)" />
      {/* Coat Lapels */}
      <path d="M 36 67 L 44 80 L 32 80 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <path d="M 64 67 L 56 80 L 68 80 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* Red Cross Pocket Badge */}
      <rect x="25" y="77" width="10" height="9" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      <path d="M 30 79 L 30 84 M 27.5 81.5 L 32.5 81.5" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />

      {/* Stethoscope In Ears -> Tubes -> Chest Piece */}
      {/* Earpieces in ears */}
      <circle cx="21" cy="36" r="3" fill="#334155" />
      <circle cx="79" cy="36" r="3" fill="#334155" />
      {/* Binaural spring tubes */}
      <path d="M 21 36 Q 26 58 44 65" stroke="#334155" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 79 36 Q 74 58 56 65" stroke="#334155" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Tube going down to chest piece */}
      <path d="M 50 65 Q 52 75 59 78" stroke="#334155" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Stethoscope bell / chest piece measuring heartbeat */}
      <circle cx="60" cy="80" r="5" fill="#0284c7" stroke="#cbd5e1" strokeWidth="1.5" />
      <circle cx="60" cy="80" r="2" fill="#38bdf8" />

      {/* Mini Heartbeat Pulse above chest piece */}
      <path d="M 68 76 L 70 73 L 72 79 L 74 76 L 77 76" stroke="#ef4444" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Cute Paws Resting on the Edge */}
      <ellipse cx="28" cy="94" rx="7" ry="4" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.8" />
      <ellipse cx="72" cy="94" rx="7" ry="4" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.8" />
    </svg>
  );
};

/* -------------------------------------------------------------
 * 2. COMPUTING & SOFTWARE MASCOT: "Byte Coder Cat"
 * Sitting using a miniature glowing laptop with headphones
 * ------------------------------------------------------------- */
const ComputingCoderMascot: React.FC<{ isSelected: boolean; isJumping: boolean }> = () => {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
      <defs>
        <radialGradient id="compFaceGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="70%" stopColor="#c7d2fe" />
          <stop offset="100%" stopColor="#818cf8" />
        </radialGradient>
        <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="screenGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Ears */}
      <path d="M 24 34 L 14 16 C 12 12, 18 10, 24 16 L 36 30 Z" fill="#818cf8" stroke="#4338ca" strokeWidth="2.5" />
      <path d="M 22 28 L 17 19 C 16 17, 19 16, 22 19 L 29 27 Z" fill="#a5b4fc" />

      <path d="M 76 34 L 86 16 C 88 12, 82 10, 76 16 L 64 30 Z" fill="#818cf8" stroke="#4338ca" strokeWidth="2.5" />
      <path d="M 78 28 L 83 19 C 84 17, 81 16, 78 19 L 71 27 Z" fill="#a5b4fc" />

      {/* Head */}
      <rect x="20" y="24" width="60" height="48" rx="24" ry="24" fill="url(#compFaceGrad)" stroke="#4338ca" strokeWidth="2.5" />

      {/* Tech Headphones Band */}
      <path d="M 19 46 C 17 20, 83 20, 81 46" stroke="#0f172a" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      {/* Ear Cups */}
      <rect x="14" y="42" width="7" height="15" rx="3.5" fill="#06b6d4" stroke="#0f172a" strokeWidth="2" />
      <rect x="79" y="42" width="7" height="15" rx="3.5" fill="#06b6d4" stroke="#0f172a" strokeWidth="2" />

      {/* Eyes (Focused Coder Eyes with Code Sparkle) */}
      <ellipse cx="36" cy="46" rx="5" ry="6" fill="#0f172a" />
      <ellipse cx="64" cy="46" rx="5" ry="6" fill="#0f172a" />
      <circle cx="34.5" cy="44" r="2.2" fill="#ffffff" />
      <circle cx="62.5" cy="44" r="2.2" fill="#ffffff" />
      {/* Cyan screen reflection in eyes */}
      <circle cx="37.5" cy="48" r="1.3" fill="#22d3ee" />
      <circle cx="65.5" cy="48" r="1.3" fill="#22d3ee" />

      {/* Blush */}
      <ellipse cx="28" cy="53" rx="4" ry="2.2" fill="#818cf8" opacity="0.6" />
      <ellipse cx="72" cy="53" rx="4" ry="2.2" fill="#818cf8" opacity="0.6" />

      {/* Nose & Smile */}
      <polygon points="50,51 47.5,53.5 52.5,53.5" fill="#6366f1" />
      <path d="M 46 55 Q 50 58 54 55" stroke="#312e81" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Hoodie Body */}
      <path d="M 24 70 Q 50 64 76 70 L 82 94 Q 50 96 18 94 Z" fill="#312e81" stroke="#1e1b4b" strokeWidth="2" />
      {/* Hoodie Strings */}
      <line x1="45" y1="70" x2="45" y2="78" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="55" y1="70" x2="55" y2="78" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" />

      {/* Open Glowing Laptop */}
      {/* Laptop Screen (angled back) */}
      <polygon points="32,71 68,71 65,86 35,86" fill="url(#screenGlow)" stroke="#0f172a" strokeWidth="1.8" />
      {/* Code Text on Screen */}
      <text x="50" y="80" fontSize="7" fill="#ffffff" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
        &lt;/&gt;
      </text>
      {/* Laptop Base & Keyboard */}
      <polygon points="26,89 74,89 67,86 33,86" fill="url(#laptopGrad)" stroke="#0f172a" strokeWidth="1.5" />

      {/* Paws on Keyboard */}
      <ellipse cx="32" cy="88" rx="4.5" ry="3" fill="#c7d2fe" stroke="#4338ca" strokeWidth="1.4" />
      <ellipse cx="68" cy="88" rx="4.5" ry="3" fill="#c7d2fe" stroke="#4338ca" strokeWidth="1.4" />
    </svg>
  );
};

/* -------------------------------------------------------------
 * 3. ENGINEERING & TECH MASCOT: "Hardhat Maker Cat"
 * Wearing yellow safety hard hat with wrench & gear
 * ------------------------------------------------------------- */
const EngineeringMascot: React.FC<{ isSelected: boolean; isJumping: boolean }> = () => {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
      <defs>
        <radialGradient id="engFaceGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="70%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <linearGradient id="hardHatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>

      {/* Rotating Gear in Background */}
      <g transform="translate(76, 25)">
        <circle cx="0" cy="0" r="10" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
        <rect x="-2" y="-13" width="4" height="26" rx="1" fill="#94a3b8" />
        <rect x="-13" y="-2" width="26" height="4" rx="1" fill="#94a3b8" />
        <circle cx="0" cy="0" r="4" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
      </g>

      {/* Ears peeking under helmet */}
      <path d="M 22 36 L 14 22 C 12 18, 18 16, 22 22 L 30 32 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2.5" />
      <path d="M 78 36 L 86 22 C 88 18, 82 16, 78 22 L 70 32 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2.5" />

      {/* Head */}
      <rect x="20" y="28" width="60" height="46" rx="23" ry="23" fill="url(#engFaceGrad)" stroke="#b45309" strokeWidth="2.5" />

      {/* Yellow Safety Hard Hat */}
      {/* Helmet Dome */}
      <path d="M 24 30 C 24 14, 76 14, 76 30 Z" fill="url(#hardHatGrad)" stroke="#ca8a04" strokeWidth="2.5" />
      {/* Helmet Brim */}
      <path d="M 18 31 Q 50 28 82 31 Q 50 35 18 31" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
      {/* Helmet Ridge */}
      <path d="M 48 15 L 48 29" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />
      {/* Headlamp */}
      <circle cx="50" cy="27" r="4.5" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
      <circle cx="50" cy="27" r="2" fill="#38bdf8" />

      {/* Eyes */}
      <ellipse cx="36" cy="48" rx="5" ry="6" fill="#1e293b" />
      <ellipse cx="64" cy="48" rx="5" ry="6" fill="#1e293b" />
      <circle cx="34.5" cy="46" r="2.2" fill="#ffffff" />
      <circle cx="62.5" cy="46" r="2.2" fill="#ffffff" />

      {/* Cheeks */}
      <ellipse cx="28" cy="54" rx="4.5" ry="2.2" fill="#f59e0b" opacity="0.5" />
      <ellipse cx="72" cy="54" rx="4.5" ry="2.2" fill="#f59e0b" opacity="0.5" />

      {/* Nose & Smile */}
      <polygon points="50,53 47.5,55.5 52.5,55.5" fill="#b45309" />
      <path d="M 46 57 Q 50 60 54 57" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Engineer Vest Body */}
      <path d="M 22 71 Q 50 66 78 71 L 84 94 Q 50 96 16 94 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
      {/* High-visibility reflective silver stripes */}
      <line x1="33" y1="71" x2="28" y2="94" stroke="#f1f5f9" strokeWidth="3.5" />
      <line x1="67" y1="71" x2="72" y2="94" stroke="#f1f5f9" strokeWidth="3.5" />

      {/* Chrome Wrench held in hand */}
      <g transform="translate(18, 70) rotate(-25)">
        <path d="M 0 0 L 0 20 L 5 20 L 5 0 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        <path d="M -3 0 C -3 -6, 8 -6, 8 0 L 5 2 L 0 2 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
      </g>

      {/* Paws */}
      <ellipse cx="28" cy="94" rx="7" ry="4" fill="#fde68a" stroke="#b45309" strokeWidth="1.8" />
      <ellipse cx="72" cy="94" rx="7" ry="4" fill="#fde68a" stroke="#b45309" strokeWidth="1.8" />
    </svg>
  );
};

/* -------------------------------------------------------------
 * 4. BUSINESS & MANAGEMENT MASCOT: "Suit & Tie Executive Cat"
 * Sharp navy blazer, tie, briefcase and growing chart
 * ------------------------------------------------------------- */
const BusinessExecutiveMascot: React.FC<{ isSelected: boolean; isJumping: boolean }> = () => {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
      <defs>
        <radialGradient id="bizFaceGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="70%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Floating mini growth chart arrow */}
      <g transform="translate(73, 20)">
        <path d="M 0 14 L 6 8 L 12 11 L 18 2" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="18,0 13,3 19,6" fill="#10b981" />
      </g>

      {/* Ears */}
      <path d="M 24 34 L 14 16 C 12 12, 18 10, 24 16 L 36 30 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2.5" />
      <path d="M 22 28 L 17 19 C 16 17, 19 16, 22 19 L 29 27 Z" fill="#fca5a5" />

      <path d="M 76 34 L 86 16 C 88 12, 82 10, 76 16 L 64 30 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2.5" />
      <path d="M 78 28 L 83 19 C 84 17, 81 16, 78 19 L 71 27 Z" fill="#fca5a5" />

      {/* Head */}
      <rect x="20" y="24" width="60" height="48" rx="24" ry="24" fill="url(#bizFaceGrad)" stroke="#475569" strokeWidth="2.5" />

      {/* Eyes */}
      <ellipse cx="36" cy="45" rx="5" ry="6" fill="#0f172a" />
      <ellipse cx="64" cy="45" rx="5" ry="6" fill="#0f172a" />
      <circle cx="34.5" cy="43" r="2.2" fill="#ffffff" />
      <circle cx="62.5" cy="43" r="2.2" fill="#ffffff" />

      {/* Blush */}
      <ellipse cx="28" cy="51" rx="4" ry="2" fill="#fb7185" opacity="0.4" />
      <ellipse cx="72" cy="51" rx="4" ry="2" fill="#fb7185" opacity="0.4" />

      {/* Nose & Smile */}
      <polygon points="50,49 47.5,51.5 52.5,51.5" fill="#475569" />
      <path d="M 46 53 Q 50 56 54 53" stroke="#1e293b" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Navy Suit Body */}
      <path d="M 22 68 Q 50 63 78 68 L 84 94 Q 50 96 16 94 Z" fill="url(#suitGrad)" stroke="#0f172a" strokeWidth="2" />
      {/* White Shirt Collar */}
      <polygon points="50,65 43,76 57,76" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      {/* Red Power Tie */}
      <polygon points="50,69 47,87 50,90 53,87" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />

      {/* Miniature Briefcase */}
      <rect x="68" y="74" width="16" height="13" rx="2.5" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
      {/* Golden Latch */}
      <rect x="74.5" y="77" width="3" height="3" rx="0.5" fill="#facc15" />
      {/* Handle */}
      <path d="M 72 74 Q 76 71 80 74" stroke="#451a03" strokeWidth="1.5" fill="none" />

      {/* Paws */}
      <ellipse cx="28" cy="94" rx="7" ry="4" fill="#e2e8f0" stroke="#475569" strokeWidth="1.8" />
      <ellipse cx="66" cy="94" rx="7" ry="4" fill="#e2e8f0" stroke="#475569" strokeWidth="1.8" />
    </svg>
  );
};

/* -------------------------------------------------------------
 * 5. ALL UNIVERSITIES & FIELDS: "Scholar Graduate Cat"
 * Graduation mortarboard cap with golden tassel & diploma
 * ------------------------------------------------------------- */
const AllDisciplinesScholarMascot: React.FC<{ isSelected: boolean; isJumping: boolean }> = () => {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
      <defs>
        <radialGradient id="allFaceGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#eab308" />
        </radialGradient>
      </defs>

      {/* Ears */}
      <path d="M 24 34 L 14 16 C 12 12, 18 10, 24 16 L 36 30 Z" fill="#eab308" stroke="#a16207" strokeWidth="2.5" />
      <path d="M 22 28 L 17 19 C 16 17, 19 16, 22 19 L 29 27 Z" fill="#fca5a5" />

      <path d="M 76 34 L 86 16 C 88 12, 82 10, 76 16 L 64 30 Z" fill="#eab308" stroke="#a16207" strokeWidth="2.5" />
      <path d="M 78 28 L 83 19 C 84 17, 81 16, 78 19 L 71 27 Z" fill="#fca5a5" />

      {/* Head */}
      <rect x="20" y="24" width="60" height="48" rx="24" ry="24" fill="url(#allFaceGrad)" stroke="#a16207" strokeWidth="2.5" />

      {/* Graduation Mortarboard Hat */}
      {/* Cap Skull Under */}
      <path d="M 33 26 C 33 19, 67 19, 67 26 Z" fill="#0f172a" />
      {/* Diamond Cap Board */}
      <polygon points="50,8 86,20 50,28 14,20" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
      {/* Cap Button */}
      <circle cx="50" cy="18" r="2.5" fill="#facc15" />
      {/* Golden Swinging Tassel */}
      <path d="M 50 18 Q 72 20 74 34" stroke="#facc15" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="72" y="34" width="4" height="6" rx="1" fill="#facc15" />

      {/* Eyes */}
      <ellipse cx="36" cy="45" rx="5" ry="6" fill="#1e293b" />
      <ellipse cx="64" cy="45" rx="5" ry="6" fill="#1e293b" />
      <circle cx="34.5" cy="43" r="2.2" fill="#ffffff" />
      <circle cx="62.5" cy="43" r="2.2" fill="#ffffff" />

      {/* Cheeks */}
      <ellipse cx="28" cy="51" rx="4" ry="2" fill="#f59e0b" opacity="0.6" />
      <ellipse cx="72" cy="51" rx="4" ry="2" fill="#f59e0b" opacity="0.6" />

      {/* Nose & Smile */}
      <polygon points="50,49 47.5,51.5 52.5,51.5" fill="#a16207" />
      <path d="M 46 53 Q 50 56 54 53" stroke="#713f12" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Academic Gown Body */}
      <path d="M 22 68 Q 50 63 78 68 L 84 94 Q 50 96 16 94 Z" fill="#1e1b4b" stroke="#0f172a" strokeWidth="2" />
      {/* Royal Purple / Gold Academic Sash */}
      <path d="M 38 68 L 47 94 L 53 94 L 62 68 Z" fill="#7c3aed" />

      {/* Diploma Scroll in Paw */}
      <g transform="translate(20, 74) rotate(15)">
        <rect x="0" y="0" width="16" height="7" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />
        <rect x="6" y="-1" width="4" height="9" rx="0.5" fill="#ef4444" />
      </g>

      {/* Paws */}
      <ellipse cx="28" cy="94" rx="7" ry="4" fill="#fde047" stroke="#a16207" strokeWidth="1.8" />
      <ellipse cx="72" cy="94" rx="7" ry="4" fill="#fde047" stroke="#a16207" strokeWidth="1.8" />
    </svg>
  );
};
