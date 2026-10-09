import React, { useState, useRef, useEffect } from 'react';
import { DisciplineCategory } from '../engine/types';

interface CartoonMascotProps {
  stream: DisciplineCategory | 'all';
  isSelected?: boolean;
  onEarthquakeTriggered?: (isQuaking: boolean) => void;
}

export const CartoonMascot: React.FC<CartoonMascotProps> = ({
  stream,
  isSelected = false,
  onEarthquakeTriggered,
}) => {
  // Jump & Animation States
  const [isJumping, setIsJumping] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [reactionText, setReactionText] = useState<string | null>(null);

  // Easter Egg Physics: 5 jumps to fall in, 3 progressive jumps to escape!
  const [jumpCount, setJumpCount] = useState(0);
  const [isInsideBox, setIsInsideBox] = useState(false);
  const [inBoxJumpCount, setInBoxJumpCount] = useState(0);
  const [escapeJumpStage, setEscapeJumpStage] = useState<1 | 2 | 3 | null>(null);

  // Timers ref
  const jumpTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, []);

  const triggerEarthquake = (duration = 600) => {
    if (onEarthquakeTriggered) {
      onEarthquakeTriggered(true);
      setTimeout(() => {
        onEarthquakeTriggered(false);
      }, duration);
    }
  };

  const handleInteraction = () => {
    // Cannot interact if currently mid-animation or in cooldown
    if (isJumping || cooldown) return;

    // SCENARIO A: Currently trapped inside the box -> 3 progressive escape jumps
    if (isInsideBox) {
      const nextEscapeStage = ((inBoxJumpCount % 3) + 1) as 1 | 2 | 3;
      setIsJumping(true);
      setEscapeJumpStage(nextEscapeStage);
      triggerEarthquake(nextEscapeStage === 3 ? 850 : 650);

      if (nextEscapeStage === 1) {
        setReactionText('🧗 Jump 1/3: Getting higher!');
        jumpTimerRef.current = setTimeout(() => {
          setIsJumping(false);
          setInBoxJumpCount(1);
          setCooldown(true);
          cooldownTimerRef.current = setTimeout(() => setCooldown(false), 800);
        }, 650);
      } else if (nextEscapeStage === 2) {
        setReactionText('🚀 Jump 2/3: Almost at the rim!');
        jumpTimerRef.current = setTimeout(() => {
          setIsJumping(false);
          setInBoxJumpCount(2);
          setCooldown(true);
          cooldownTimerRef.current = setTimeout(() => setCooldown(false), 800);
        }, 650);
      } else if (nextEscapeStage === 3) {
        setReactionText('🎉 Super Leap! Back on top!');
        jumpTimerRef.current = setTimeout(() => {
          setIsJumping(false);
          setIsInsideBox(false);
          setJumpCount(0);
          setInBoxJumpCount(0);
          setEscapeJumpStage(null);
          setCooldown(true);
          cooldownTimerRef.current = setTimeout(() => {
            setCooldown(false);
            setReactionText(null);
          }, 1500);
        }, 850);
      }
      return;
    }

    // SCENARIO B: On top of the ledge (Normal jumps toward 5-jump threshold)
    const nextCount = jumpCount + 1;
    setJumpCount(nextCount);
    setIsJumping(true);
    triggerEarthquake(600);

    // Reactions based on jump count
    if (nextCount === 1) {
      setReactionText(
        stream === 'medical'
          ? '💓 Lub-Dub! Heartbeat 72 bpm'
          : stream === 'computing'
          ? '💻 Syntax verified: Code Green!'
          : stream === 'engineering'
          ? '⚙️ Torque 450 Nm: Structural OK!'
          : stream === 'business'
          ? '📈 Bull market: ROI +28%!'
          : '🎓 Honors roll: Merit verified!'
      );
    } else if (nextCount === 2) {
      setReactionText('⚡ Jump #2! Double bounce!');
    } else if (nextCount === 3) {
      setReactionText('🔥 Jump #3! Big spring!');
    } else if (nextCount === 4) {
      setReactionText('⚠️ Jump #4: Floor is cracking!');
    } else if (nextCount >= 5) {
      // 5th jump: Breaks through into the box!
      setReactionText('📦 Aaaah! I fell inside the box!');
      jumpTimerRef.current = setTimeout(() => {
        setIsJumping(false);
        setIsInsideBox(true);
        setInBoxJumpCount(0);
        setEscapeJumpStage(null);
        setCooldown(true);
        cooldownTimerRef.current = setTimeout(() => {
          setCooldown(false);
          setReactionText('📦 Help! Click me 3 times to jump out!');
        }, 1000);
      }, 750);
      return;
    }

    // Normal jump completion
    jumpTimerRef.current = setTimeout(() => {
      setIsJumping(false);
      setCooldown(true);
      cooldownTimerRef.current = setTimeout(() => {
        setCooldown(false);
        setReactionText(null);
      }, 2000); // 2-second cooldown after landing
    }, 700);
  };

  // Determine current CSS animation class
  let animationClass = '';
  if (isInsideBox) {
    if (escapeJumpStage === 1) {
      animationClass = isJumping ? 'animate-in-box-jump-1' : 'translate-y-[36px]';
    } else if (escapeJumpStage === 2) {
      animationClass = isJumping ? 'animate-in-box-jump-2' : 'translate-y-[14px]';
    } else if (escapeJumpStage === 3) {
      animationClass = isJumping ? 'animate-in-box-jump-3' : '';
    } else {
      animationClass = 'translate-y-[58px]';
    }
  } else if (isJumping) {
    animationClass = jumpCount >= 5 ? 'animate-fall-inside' : 'animate-mascot-jump';
  } else if (isSelected) {
    animationClass = 'animate-mascot-idle';
  } else {
    animationClass = 'hover:scale-105';
  }

  return (
    <div
      className={`relative select-none pointer-events-auto cursor-pointer transition-all ${
        isInsideBox ? 'z-30' : 'z-20'
      }`}
      onMouseEnter={handleInteraction}
      onMouseOver={handleInteraction}
      onClick={handleInteraction}
      title={
        isInsideBox
          ? `I'm inside the box! Click me to jump out! (${inBoxJumpCount}/3 jumps)`
          : `Hover or click to make me jump! (${jumpCount}/5 jumps)`
      }
    >
      {/* Dynamic Speech Reaction Bubble */}
      {reactionText && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-zinc-950/95 text-white dark:bg-white/95 dark:text-zinc-950 text-[10px] font-black tracking-tight shadow-lg pointer-events-none animate-bounce z-40 border border-white/20 dark:border-zinc-800">
          {reactionText}
        </div>
      )}

      {/* Main Mascot Container (Enlarged and Expressive) */}
      <div
        className={`w-20 h-20 sm:w-24 sm:h-24 transition-transform duration-200 ${animationClass}`}
      >
        {stream === 'medical' && (
          <ExpressiveDoctorMascot isSelected={isSelected} isJumping={isJumping} isInside={isInsideBox} />
        )}
        {stream === 'computing' && (
          <ExpressiveComputingMascot isSelected={isSelected} isJumping={isJumping} isInside={isInsideBox} />
        )}
        {stream === 'engineering' && (
          <ExpressiveEngineeringMascot isSelected={isSelected} isJumping={isJumping} isInside={isInsideBox} />
        )}
        {stream === 'business' && (
          <ExpressiveBusinessMascot isSelected={isSelected} isJumping={isJumping} isInside={isInsideBox} />
        )}
        {stream === 'all' && (
          <ExpressiveScholarMascot isSelected={isSelected} isJumping={isJumping} isInside={isInsideBox} />
        )}
      </div>

      {/* Ground Smoke & Sparkles on Impact */}
      {isJumping && !isInsideBox && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-90 pointer-events-none">
          <span className="w-2 h-1 rounded-full bg-rose-400 dark:bg-rose-300 animate-ping" />
          <span className="w-2.5 h-1.5 rounded-full bg-amber-400 dark:bg-amber-300 animate-pulse" />
          <span className="w-2 h-1 rounded-full bg-teal-400 dark:bg-teal-300 animate-ping" />
        </div>
      )}

      {/* Inside Box Peeking Indicator */}
      {isInsideBox && (
        <div className="absolute -bottom-2 right-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-500 text-white shadow-xs pointer-events-none">
          {inBoxJumpCount}/3
        </div>
      )}
    </div>
  );
};

/* =========================================================================
 * 1. MEDICAL & DENTAL MASCOT: "Dr. ClaudeCat MD"
 * Expressive Doctor in coat, stethoscope in ears measuring glowing pulse!
 * ========================================================================= */
const ExpressiveDoctorMascot: React.FC<{ isSelected?: boolean; isJumping?: boolean; isInside?: boolean }> = () => {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl overflow-visible">
      <defs>
        <radialGradient id="expDocSkin" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffedd5" />
          <stop offset="75%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fb923c" />
        </radialGradient>
        <linearGradient id="expCoatWhite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="expScrubTeal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>

      {/* Ears */}
      <path d="M 30 38 L 18 16 C 15 12, 22 9, 30 16 L 44 34 Z" fill="#fb923c" stroke="#c2410c" strokeWidth="3" />
      <path d="M 27 30 L 21 20 C 20 18, 23 17, 27 20 L 35 29 Z" fill="#fda4af" />

      <path d="M 90 38 L 102 16 C 105 12, 98 9, 90 16 L 76 34 Z" fill="#fb923c" stroke="#c2410c" strokeWidth="3" />
      <path d="M 93 30 L 99 20 C 100 18, 97 17, 93 20 L 85 29 Z" fill="#fda4af" />

      {/* Head */}
      <rect x="22" y="26" width="76" height="60" rx="30" ry="30" fill="url(#expDocSkin)" stroke="#c2410c" strokeWidth="3" />

      {/* Doctor Forehead Mirror with Shiny Reflector */}
      <path d="M 28 36 Q 60 28 92 36" stroke="#64748b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="60" cy="30" r="7.5" fill="#f1f5f9" stroke="#475569" strokeWidth="2.5" />
      <circle cx="60" cy="30" r="3.5" fill="#38bdf8" />
      <circle cx="61.5" cy="28.5" r="1.5" fill="#ffffff" />

      {/* Stethoscope Earpieces Plugged In Ears */}
      <circle cx="26" cy="40" r="4" fill="#1e293b" />
      <circle cx="94" cy="40" r="4" fill="#1e293b" />
      {/* Binaural Flexible Tubes */}
      <path d="M 26 40 Q 32 68 53 74" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 94 40 Q 88 68 67 74" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Expressive Anime Eyes with Big Highlights */}
      <ellipse cx="43" cy="52" rx="6.5" ry="7.5" fill="#0f172a" />
      <ellipse cx="77" cy="52" rx="6.5" ry="7.5" fill="#0f172a" />
      <circle cx="41" cy="49" r="2.8" fill="#ffffff" />
      <circle cx="75" cy="49" r="2.8" fill="#ffffff" />
      <circle cx="45.5" cy="54.5" r="1.5" fill="#38bdf8" />
      <circle cx="79.5" cy="54.5" r="1.5" fill="#38bdf8" />

      {/* Rosy Doctor Cheeks */}
      <ellipse cx="32" cy="60" rx="5.5" ry="3" fill="#f43f5e" opacity="0.5" />
      <ellipse cx="88" cy="60" rx="5.5" ry="3" fill="#f43f5e" opacity="0.5" />

      {/* Cute Nose & Happy Doctor Smile */}
      <polygon points="60,56 57,60 63,60" fill="#e11d48" />
      <path d="M 54 62 Q 60 67 66 62" stroke="#831843" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* Doctor White Coat (Sitting Body) */}
      <path d="M 26 78 Q 60 72 94 78 L 102 110 Q 60 114 18 110 Z" fill="url(#expCoatWhite)" stroke="#94a3b8" strokeWidth="2.5" />

      {/* Medical Scrubs V-Neck */}
      <polygon points="60,76 48,88 72,88" fill="url(#expScrubTeal)" />

      {/* Coat Lapels */}
      <path d="M 44 78 L 52 94 L 38 94 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
      <path d="M 76 78 L 68 94 L 82 94 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />

      {/* Pocket with Red Medical Cross & Doctor Pen */}
      <rect x="28" y="90" width="13" height="12" rx="2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="34.5" y1="92" x2="34.5" y2="100" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="30.5" y1="96" x2="38.5" y2="96" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="36" y="86" width="2" height="6" rx="0.5" fill="#0284c7" />

      {/* Stethoscope Chest Piece Measuring Beating Heart */}
      <path d="M 60 74 Q 63 86 72 91" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="73" cy="93" r="6.5" fill="#0284c7" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="73" cy="93" r="3" fill="#38bdf8" />

      {/* Glowing ECG Heart Monitor Wave floating above */}
      <g transform="translate(80, 80)">
        <circle cx="12" cy="0" r="10" fill="#f43f5e" opacity="0.9" />
        <path d="M 6 0 L 9 0 L 11 -4 L 13 4 L 15 -1 L 18 0" stroke="#ffffff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>

      {/* Paws Resting on Edge */}
      <ellipse cx="32" cy="110" rx="8" ry="4.5" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
      <ellipse cx="88" cy="110" rx="8" ry="4.5" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
    </svg>
  );
};

/* =========================================================================
 * 2. COMPUTING & SOFTWARE MASCOT: "Byte Master Coder"
 * Glowing Cyber Laptop, Headset, Active Code Syntax on Screen!
 * ========================================================================= */
const ExpressiveComputingMascot: React.FC<{ isSelected: boolean; isJumping: boolean; isInside: boolean }> = () => {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl overflow-visible">
      <defs>
        <radialGradient id="expCompSkin" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e0e7ff" />
          <stop offset="70%" stopColor="#c7d2fe" />
          <stop offset="100%" stopColor="#818cf8" />
        </radialGradient>
        <linearGradient id="expLaptopGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Ears with Neon Cyber Tips */}
      <path d="M 30 38 L 18 16 C 15 12, 22 9, 30 16 L 44 34 Z" fill="#818cf8" stroke="#4338ca" strokeWidth="3" />
      <path d="M 27 30 L 21 20 C 20 18, 23 17, 27 20 L 35 29 Z" fill="#22d3ee" />

      <path d="M 90 38 L 102 16 C 105 12, 98 9, 90 16 L 76 34 Z" fill="#818cf8" stroke="#4338ca" strokeWidth="3" />
      <path d="M 93 30 L 99 20 C 100 18, 97 17, 93 20 L 85 29 Z" fill="#22d3ee" />

      {/* Head */}
      <rect x="22" y="26" width="76" height="60" rx="30" ry="30" fill="url(#expCompSkin)" stroke="#4338ca" strokeWidth="3" />

      {/* Pro Cyber Headset Arc */}
      <path d="M 21 54 C 18 20, 102 20, 99 54" stroke="#0f172a" strokeWidth="5.5" fill="none" strokeLinecap="round" />
      {/* Earphone Cups with Glowing Cyan LED Ring */}
      <rect x="14" y="48" width="9" height="18" rx="4.5" fill="#06b6d4" stroke="#0f172a" strokeWidth="2.5" />
      <circle cx="18.5" cy="57" r="2.5" fill="#ffffff" />
      <rect x="97" y="48" width="9" height="18" rx="4.5" fill="#06b6d4" stroke="#0f172a" strokeWidth="2.5" />
      <circle cx="101.5" cy="57" r="2.5" fill="#ffffff" />

      {/* Focused Programmer Eyes with Blue Screen Reflection */}
      <ellipse cx="43" cy="52" rx="6.5" ry="7.5" fill="#0f172a" />
      <ellipse cx="77" cy="52" rx="6.5" ry="7.5" fill="#0f172a" />
      <circle cx="41" cy="49" r="2.8" fill="#ffffff" />
      <circle cx="75" cy="49" r="2.8" fill="#ffffff" />
      <rect x="42" y="53" width="5" height="3" rx="0.5" fill="#22d3ee" />
      <rect x="76" y="53" width="5" height="3" rx="0.5" fill="#22d3ee" />

      {/* Cheeks */}
      <ellipse cx="32" cy="62" rx="5.5" ry="2.8" fill="#818cf8" opacity="0.6" />
      <ellipse cx="88" cy="62" rx="5.5" ry="2.8" fill="#818cf8" opacity="0.6" />

      {/* Nose & Smile */}
      <polygon points="60,58 57,61 63,61" fill="#4f46e5" />
      <path d="M 55 64 Q 60 68 65 64" stroke="#312e81" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* Indigo Hoodie Body */}
      <path d="M 28 80 Q 60 74 92 80 L 100 110 Q 60 114 20 110 Z" fill="#312e81" stroke="#1e1b4b" strokeWidth="2.5" />

      {/* Open Glowing Laptop */}
      {/* Laptop Screen (angled forward) */}
      <polygon points="34,74 86,74 82,96 38,96" fill="url(#expLaptopGlow)" stroke="#0f172a" strokeWidth="2" />
      {/* Syntax Code Highlight Lines */}
      <line x1="42" y1="80" x2="62" y2="80" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
      <line x1="66" y1="80" x2="78" y2="80" stroke="#a7f3d0" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="85" x2="72" y2="85" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="90" x2="56" y2="90" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
      <line x1="60" y1="90" x2="76" y2="90" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />

      {/* Laptop Keyboard Base */}
      <polygon points="26,102 94,102 84,96 36,96" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
      <rect x="52" y="98" width="16" height="2" rx="1" fill="#38bdf8" />

      {/* Paws on Keyboard */}
      <ellipse cx="36" cy="100" rx="5.5" ry="3.5" fill="#c7d2fe" stroke="#4338ca" strokeWidth="1.8" />
      <ellipse cx="84" cy="100" rx="5.5" ry="3.5" fill="#c7d2fe" stroke="#4338ca" strokeWidth="1.8" />

      {/* Floating Code Symbols */}
      <text x="15" y="32" fontSize="12" fill="#06b6d4" fontFamily="monospace" fontWeight="bold">
        &lt;/&gt;
      </text>
      <text x="100" y="34" fontSize="12" fill="#818cf8" fontFamily="monospace" fontWeight="bold">
        &#123;&#125;
      </text>
    </svg>
  );
};

/* =========================================================================
 * 3. ENGINEERING & TECH MASCOT: "Hardhat Chief Engineer"
 * Yellow Safety Helmet with Crest, Gleaming Chrome Wrench, Blueprint & Gear!
 * ========================================================================= */
const ExpressiveEngineeringMascot: React.FC<{ isSelected: boolean; isJumping: boolean; isInside: boolean }> = () => {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl overflow-visible">
      <defs>
        <radialGradient id="expEngSkin" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="70%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        <linearGradient id="expHardHat" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>

      {/* Spinning Brass Mechanical Cog Gear in Background */}
      <g transform="translate(94, 30)">
        <circle cx="0" cy="0" r="14" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" />
        <rect x="-3" y="-18" width="6" height="36" rx="1.5" fill="#94a3b8" />
        <rect x="-18" y="-3" width="36" height="6" rx="1.5" fill="#94a3b8" />
        <rect x="-12" y="-12" width="24" height="24" rx="2" fill="#94a3b8" transform="rotate(45)" />
        <circle cx="0" cy="0" r="6" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
      </g>

      {/* Ears peeking under helmet */}
      <path d="M 28 42 L 18 24 C 15 20, 22 17, 28 24 L 38 38 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />
      <path d="M 92 42 L 102 24 C 105 20, 98 17, 92 24 L 82 38 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="3" />

      {/* Head */}
      <rect x="22" y="32" width="76" height="54" rx="27" ry="27" fill="url(#expEngSkin)" stroke="#b45309" strokeWidth="3" />

      {/* Industrial Yellow Safety Hard Hat */}
      {/* Helmet Dome */}
      <path d="M 28 35 C 28 12, 92 12, 92 35 Z" fill="url(#expHardHat)" stroke="#a16207" strokeWidth="3" />
      {/* Helmet Wide Brim */}
      <path d="M 18 36 Q 60 32 102 36 Q 60 42 18 36" fill="#facc15" stroke="#a16207" strokeWidth="2.5" />
      {/* Protective Ridge */}
      <path d="M 58 14 L 58 34" stroke="#a16207" strokeWidth="3.5" strokeLinecap="round" />
      {/* Center Engineer Emblem / Badge */}
      <circle cx="60" cy="28" r="5.5" fill="#ffffff" stroke="#a16207" strokeWidth="1.5" />
      <circle cx="60" cy="28" r="2.5" fill="#ea580c" />

      {/* Eyes */}
      <ellipse cx="43" cy="54" rx="6.5" ry="7.5" fill="#1e293b" />
      <ellipse cx="77" cy="54" rx="6.5" ry="7.5" fill="#1e293b" />
      <circle cx="41" cy="51" r="2.8" fill="#ffffff" />
      <circle cx="75" cy="51" r="2.8" fill="#ffffff" />

      {/* Cheeks */}
      <ellipse cx="32" cy="62" rx="5.5" ry="2.8" fill="#f59e0b" opacity="0.5" />
      <ellipse cx="88" cy="62" rx="5.5" ry="2.8" fill="#f59e0b" opacity="0.5" />

      {/* Nose & Smile */}
      <polygon points="60,59 57,62 63,62" fill="#b45309" />
      <path d="M 55 65 Q 60 69 65 65" stroke="#78350f" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* High-Vis Engineer Vest Body */}
      <path d="M 26 80 Q 60 74 94 80 L 102 110 Q 60 114 18 110 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="2.5" />
      {/* Reflective Silver Safety Stripes */}
      <line x1="38" y1="80" x2="32" y2="110" stroke="#f8fafc" strokeWidth="4.5" />
      <line x1="82" y1="80" x2="88" y2="110" stroke="#f8fafc" strokeWidth="4.5" />

      {/* Gleaming Chrome Wrench in Hand */}
      <g transform="translate(18, 76) rotate(-22)">
        <path d="M 0 0 L 0 26 L 6 26 L 6 0 Z" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
        <path d="M -4 0 C -4 -8, 10 -8, 10 0 L 7 3 L 0 3 Z" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
      </g>

      {/* Rolled Blueprint Paper */}
      <g transform="translate(86, 84) rotate(15)">
        <rect x="0" y="0" width="20" height="9" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
        <line x1="4" y1="2" x2="4" y2="7" stroke="#ffffff" strokeWidth="1" />
        <line x1="8" y1="2" x2="8" y2="7" stroke="#ffffff" strokeWidth="1" />
        <line x1="12" y1="2" x2="12" y2="7" stroke="#ffffff" strokeWidth="1" />
      </g>

      {/* Paws */}
      <ellipse cx="32" cy="110" rx="8" ry="4.5" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
      <ellipse cx="88" cy="110" rx="8" ry="4.5" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
    </svg>
  );
};

/* =========================================================================
 * 4. BUSINESS & MANAGEMENT MASCOT: "Wall Street / IBA Executive"
 * Navy Suit, Red Power Tie, Golden Briefcase & Bullish Upward Chart!
 * ========================================================================= */
const ExpressiveBusinessMascot: React.FC<{ isSelected: boolean; isJumping: boolean; isInside: boolean }> = () => {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl overflow-visible">
      <defs>
        <radialGradient id="expBizSkin" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </radialGradient>
        <linearGradient id="expSuitNavy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Floating Bullish Candlestick & Arrow Chart */}
      <g transform="translate(86, 18)">
        <rect x="0" y="8" width="5" height="12" rx="1" fill="#10b981" />
        <rect x="7" y="4" width="5" height="16" rx="1" fill="#10b981" />
        <rect x="14" y="0" width="5" height="20" rx="1" fill="#10b981" />
        <path d="M 0 16 L 8 10 L 14 6 L 22 -2" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        <polygon points="22,-4 16,-1 23,2" fill="#22c55e" />
      </g>

      {/* Ears */}
      <path d="M 30 38 L 18 16 C 15 12, 22 9, 30 16 L 44 34 Z" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
      <path d="M 27 30 L 21 20 C 20 18, 23 17, 27 20 L 35 29 Z" fill="#fda4af" />

      <path d="M 90 38 L 102 16 C 105 12, 98 9, 90 16 L 76 34 Z" fill="#94a3b8" stroke="#475569" strokeWidth="3" />
      <path d="M 93 30 L 99 20 C 100 18, 97 17, 93 20 L 85 29 Z" fill="#fda4af" />

      {/* Head */}
      <rect x="22" y="26" width="76" height="60" rx="30" ry="30" fill="url(#expBizSkin)" stroke="#475569" strokeWidth="3" />

      {/* Confident Charismatic Eyes */}
      <ellipse cx="43" cy="52" rx="6.5" ry="7.5" fill="#0f172a" />
      <ellipse cx="77" cy="52" rx="6.5" ry="7.5" fill="#0f172a" />
      <circle cx="41" cy="49" r="2.8" fill="#ffffff" />
      <circle cx="75" cy="49" r="2.8" fill="#ffffff" />

      {/* Cheeks */}
      <ellipse cx="32" cy="62" rx="5.5" ry="2.8" fill="#fb7185" opacity="0.45" />
      <ellipse cx="88" cy="62" rx="5.5" ry="2.8" fill="#fb7185" opacity="0.45" />

      {/* Nose & Smile */}
      <polygon points="60,58 57,61 63,61" fill="#475569" />
      <path d="M 55 64 Q 60 68 65 64" stroke="#1e293b" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* Navy Tailored Suit Body */}
      <path d="M 26 78 Q 60 72 94 78 L 102 110 Q 60 114 18 110 Z" fill="url(#expSuitNavy)" stroke="#0f172a" strokeWidth="2.5" />

      {/* Crisp White Shirt V-Neck */}
      <polygon points="60,76 50,90 70,90" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* Red Power Silk Tie with Golden Clip */}
      <polygon points="60,82 56,104 60,108 64,104" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
      <line x1="56" y1="94" x2="64" y2="94" stroke="#facc15" strokeWidth="2" />

      {/* Executive Leather Briefcase with Golden Handle */}
      <g transform="translate(80, 84)">
        <rect x="0" y="0" width="22" height="18" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="2" />
        <rect x="9.5" y="4" width="4" height="4" rx="1" fill="#facc15" />
        <path d="M 6 0 Q 11 -4 16 0" stroke="#451a03" strokeWidth="2" fill="none" />
      </g>

      {/* Paws */}
      <ellipse cx="32" cy="110" rx="8" ry="4.5" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
      <ellipse cx="78" cy="110" rx="8" ry="4.5" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
    </svg>
  );
};

/* =========================================================================
 * 5. ALL UNIVERSITIES & FIELDS: "Universal Scholar Laureate"
 * Graduation Mortarboard with Golden Tassel, Honor Sash, Scroll & Stars!
 * ========================================================================= */
const ExpressiveScholarMascot: React.FC<{ isSelected: boolean; isJumping: boolean; isInside: boolean }> = () => {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl overflow-visible">
      <defs>
        <radialGradient id="expScholSkin" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#eab308" />
        </radialGradient>
      </defs>

      {/* Ears */}
      <path d="M 30 38 L 18 16 C 15 12, 22 9, 30 16 L 44 34 Z" fill="#eab308" stroke="#a16207" strokeWidth="3" />
      <path d="M 27 30 L 21 20 C 20 18, 23 17, 27 20 L 35 29 Z" fill="#fef08a" />

      <path d="M 90 38 L 102 16 C 105 12, 98 9, 90 16 L 76 34 Z" fill="#eab308" stroke="#a16207" strokeWidth="3" />
      <path d="M 93 30 L 99 20 C 100 18, 97 17, 93 20 L 85 29 Z" fill="#fef08a" />

      {/* Head */}
      <rect x="22" y="26" width="76" height="60" rx="30" ry="30" fill="url(#expScholSkin)" stroke="#a16207" strokeWidth="3" />

      {/* Grand Academic Mortarboard Graduation Cap */}
      {/* Cap Skull Fitting */}
      <path d="M 38 28 C 38 18, 82 18, 82 28 Z" fill="#0f172a" />
      {/* 3D Diamond Board Top */}
      <polygon points="60,6 106,20 60,30 14,20" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
      {/* Golden Button */}
      <circle cx="60" cy="18" r="3.5" fill="#facc15" />
      {/* Braided Golden Tassel Swinging to Side */}
      <path d="M 60 18 Q 88 22 92 40" stroke="#facc15" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <rect x="89" y="40" width="6" height="8" rx="1.5" fill="#facc15" />

      {/* Expressive Proud Scholar Eyes */}
      <ellipse cx="43" cy="52" rx="6.5" ry="7.5" fill="#0f172a" />
      <ellipse cx="77" cy="52" rx="6.5" ry="7.5" fill="#0f172a" />
      <circle cx="41" cy="49" r="2.8" fill="#ffffff" />
      <circle cx="75" cy="49" r="2.8" fill="#ffffff" />

      {/* Cheeks */}
      <ellipse cx="32" cy="62" rx="5.5" ry="2.8" fill="#f59e0b" opacity="0.6" />
      <ellipse cx="88" cy="62" rx="5.5" ry="2.8" fill="#f59e0b" opacity="0.6" />

      {/* Nose & Smile */}
      <polygon points="60,58 57,61 63,61" fill="#a16207" />
      <path d="M 55 64 Q 60 68 65 64" stroke="#713f12" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* Black Academic Graduation Robe */}
      <path d="M 26 78 Q 60 72 94 78 L 102 110 Q 60 114 18 110 Z" fill="#0f172a" stroke="#020617" strokeWidth="2.5" />

      {/* Royal Purple & Golden Academic Honor Sash */}
      <path d="M 44 78 L 54 110 L 66 110 L 76 78 Z" fill="#7c3aed" />
      <line x1="54" y1="110" x2="66" y2="110" stroke="#facc15" strokeWidth="3" />

      {/* Parchment Diploma Scroll with Crimson Ribbon */}
      <g transform="translate(20, 84) rotate(16)">
        <rect x="0" y="0" width="22" height="10" rx="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.8" />
        <rect x="9" y="-1.5" width="4.5" height="13" rx="1" fill="#ef4444" />
      </g>

      {/* Golden Sparkling Stars */}
      <path d="M 12 40 L 14 36 L 16 40 L 20 42 L 16 44 L 14 48 L 12 44 L 8 42 Z" fill="#facc15" />
      <path d="M 104 56 L 105.5 53 L 107 56 L 110 57.5 L 107 59 L 105.5 62 L 104 59 L 101 57.5 Z" fill="#facc15" />

      {/* Paws */}
      <ellipse cx="32" cy="110" rx="8" ry="4.5" fill="#fde047" stroke="#a16207" strokeWidth="2" />
      <ellipse cx="88" cy="110" rx="8" ry="4.5" fill="#fde047" stroke="#a16207" strokeWidth="2" />
    </svg>
  );
};
