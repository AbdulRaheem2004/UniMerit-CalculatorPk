import React, { useRef, useEffect, useState } from 'react';
import { X, Share2, Download, Check, Sparkles } from 'lucide-react';
import { AcademicInput, UniversityCalculationResult } from '../engine/types';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  input: AcademicInput;
  results: UniversityCalculationResult[];
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  isOpen,
  onClose,
  input,
  results,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Render canvas snapshot card
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions (1200 x 675 - standard 16:9 social card)
    canvas.width = 1200;
    canvas.height = 675;

    // Background Gradient (Deep Academic Emerald)
    const gradient = ctx.createLinearGradient(0, 0, 1200, 675);
    gradient.addColorStop(0, '#0a2e23');
    gradient.addColorStop(1, '#051812');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 675);

    // Decorative geometric accents
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(30, 30, 1140, 615);

    // Header Tag
    ctx.fillStyle = '#2dd4bf';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText('PAKMERIT 2026 • ADMISSION MERIT REPORT', 60, 80);

    // Main Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 42px Inter, sans-serif';
    ctx.fillText('Pakistani Universities Merit Summary', 60, 135);

    // Student Credentials Bar
    ctx.beginPath();
    ctx.roundRect(60, 165, 1080, 78, 12);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fill();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 16px Inter, sans-serif';
    ctx.fillText('MATRIC / O-LEVEL', 90, 198);
    ctx.fillText('INTERMEDIATE / FSC', 450, 198);
    ctx.fillText(input.useSat ? 'DIGITAL SAT (1600)' : 'TEST SCORES', 800, 198);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`${input.matricObtained} / ${input.matricTotal} (${((input.matricObtained / input.matricTotal) * 100).toFixed(1)}%)`, 90, 228);
    ctx.fillText(`${input.fscObtained} / ${input.fscTotal} (${((input.fscObtained / input.fscTotal) * 100).toFixed(1)}%)`, 450, 228);
    ctx.fillText(input.useSat ? `${input.satScore} / 1600` : 'Applied per Uni', 800, 228);

    // University Results Grid (2 rows x 3 columns)
    const gridStartX = 60;
    const gridStartY = 270;
    const cardW = 340;
    const cardH = 145;
    const gapX = 30;
    const gapY = 25;

    results.slice(0, 6).forEach((res, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const x = gridStartX + col * (cardW + gapX);
      const y = gridStartY + row * (cardH + gapY);

      // Card Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y, cardW, cardH, 14);
      ctx.fill();
      ctx.stroke();

      // University Name
      ctx.fillStyle = '#5eead4';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText(res.university.shortName, x + 20, y + 36);

      // Aggregate Value
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 36px monospace';
      ctx.fillText(`${res.aggregate.toFixed(2)}%`, x + 20, y + 80);

      // Breakdown text
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px Inter, sans-serif';
      ctx.fillText(res.university.formulaDisplay, x + 20, y + 115);
    });

    // Watermark & Footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 16px Inter, sans-serif';
    ctx.fillText('Generated via PakMerit (pakistan-merit-calculator.app) • 100% Free & Open-Source', 60, 625);
  }, [isOpen, input, results]);

  if (!isOpen) return null;

  // Build WhatsApp share text message
  const generateShareText = () => {
    let msg = `🎓 *My University Merit Aggregates (2026)*\n\n`;
    msg += `📚 *Academic Record:*\n`;
    msg += `• Matric: ${input.matricObtained}/${input.matricTotal} (${((input.matricObtained / input.matricTotal) * 100).toFixed(1)}%)\n`;
    msg += `• FSc/Inter: ${input.fscObtained}/${input.fscTotal} (${((input.fscObtained / input.fscTotal) * 100).toFixed(1)}%)\n`;
    if (input.useSat && input.satScore > 0) {
      msg += `• Digital SAT: ${input.satScore}/1600\n`;
    }
    msg += `\n🏛️ *Calculated Aggregates:*\n`;
    results.forEach((r) => {
      msg += `• *${r.university.shortName}:* ${r.aggregate.toFixed(2)}%\n`;
    });
    msg += `\nCalculate your aggregate & check 10-year cutoffs here: https://pakmerit.app`;
    return msg;
  };

  const handleDownloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `PakMerit-Report-${new Date().getFullYear()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(generateShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateShareText());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-white">
                WhatsApp & Social Share Card
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Share your aggregate breakdown with your peers, teachers, and parents.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Preview */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 flex justify-center items-center p-2">
          <canvas
            ref={canvasRef}
            className="w-full h-auto max-h-[46vh] object-contain rounded-lg shadow-inner"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyText}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Sparkles className="w-4 h-4 text-teal-600" />}
            <span>{copiedText ? 'Copied Summary!' : 'Copy Summary Text'}</span>
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={handleDownloadImage}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Image</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
