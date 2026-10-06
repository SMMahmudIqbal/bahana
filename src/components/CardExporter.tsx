import React, { useEffect, useRef, useState } from 'react';
import type { Excuse, LanguageMode } from '../types';
import { X, Download, Check } from 'lucide-react';
import { getExcuseText, getExcuseProTip } from '../utils/transliterate';

interface CardExporterProps {
  isOpen: boolean;
  onClose: () => void;
  excuse: Excuse;
  language: LanguageMode;
}

export const CardExporter: React.FC<CardExporterProps> = ({
  isOpen,
  onClose,
  excuse,
  language,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions suitable for social media / mobile story / Instagram / Facebook
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // Background - Minimalist deep obsidian black
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // Subtle inner border
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Corner decorative markers
    const markSize = 20;
    ctx.strokeStyle = '#52525b';
    ctx.lineWidth = 2;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(60, 60 + markSize);
    ctx.lineTo(60, 60);
    ctx.lineTo(60 + markSize, 60);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(width - 60 - markSize, 60);
    ctx.lineTo(width - 60, 60);
    ctx.lineTo(width - 60, 60 + markSize);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(60, height - 60 - markSize);
    ctx.lineTo(60, height - 60);
    ctx.lineTo(60 + markSize, height - 60);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(width - 60 - markSize, height - 60);
    ctx.lineTo(width - 60, height - 60);
    ctx.lineTo(width - 60, height - 60 - markSize);
    ctx.stroke();

    // Brand Seal 'বা' / 'Bahana'
    ctx.fillStyle = '#fafafa';
    ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
    ctx.fillText(language === 'banglish' ? 'Bahana' : 'বাহানা', 100, 130);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '500 20px Inter, sans-serif';
    ctx.fillText('the excuse generator', 100, 165);

    // Believability Badge
    ctx.fillStyle = '#18181b';
    ctx.fillRect(width - 320, 100, 220, 50);
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(width - 320, 100, 220, 50);

    ctx.fillStyle = '#e4e4e7';
    ctx.font = '600 20px "Hind Siliguri", Inter, sans-serif';
    ctx.fillText(
      language === 'banglish'
        ? `Believability: ${excuse.believability}%`
        : `বিশ্বাসযোগ্যতা: ${excuse.believability}%`,
      width - 300,
      133
    );

    // Decorative Quotation Symbol
    ctx.fillStyle = '#27272a';
    ctx.font = 'italic 160px Georgia, serif';
    ctx.fillText('“', 100, 360);

    // Text Wrapping for the Excuse
    const excuseText = getExcuseText(excuse, language);
    ctx.fillStyle = '#f4f4f5';
    ctx.font =
      language === 'banglish'
        ? '500 42px Inter, sans-serif'
        : '500 44px "Hind Siliguri", sans-serif';

    const words = excuseText.split(' ');
    let line = '';
    let y = 410;
    const lineHeight = language === 'banglish' ? 68 : 72;
    const maxWidth = width - 200;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, 100, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 100, y);

    // Pro Tip box if available
    const proTipText = getExcuseProTip(excuse, language);
    if (proTipText) {
      const tipY = Math.max(y + 80, 780);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(100, tipY, width - 200, 110);
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      ctx.strokeRect(100, tipY, width - 200, 110);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '400 24px "Hind Siliguri", Inter, sans-serif';

      const prefix = language === 'banglish' ? 'Pro Tip: ' : 'টিপস: ';
      const fullTip = `${prefix}${proTipText}`;
      ctx.fillText(fullTip.length > 55 ? fullTip.substring(0, 52) + '...' : fullTip, 130, tipY + 62);
    }

    // Bottom Watermark & Developer Credit
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '600 22px Inter, sans-serif';
    ctx.fillText('Developed by S. M. Mahmud Iqbal', 100, height - 100);

    ctx.fillStyle = '#71717a';
    ctx.font = '400 18px Inter, sans-serif';
    ctx.fillText('bahana-app.vercel.app', width - 340, height - 100);

    setDownloadUrl(canvas.toDataURL('image/png'));
  }, [isOpen, excuse, language]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `bahana-${excuse.id}-${language}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 m-0">
            {language === 'banglish' ? 'Story Card Preview' : 'স্টোরি কার্ড প্রিভিউ'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas & Preview */}
        <div className="p-4 flex flex-col items-center justify-center bg-zinc-950">
          <canvas ref={canvasRef} className="hidden" />
          {downloadUrl && (
            <img
              src={downloadUrl}
              alt="Bahana Card Preview"
              className="max-h-72 w-auto object-contain rounded-lg shadow-lg border border-zinc-800"
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            1080 × 1080 High-Res
          </span>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{language === 'banglish' ? 'Downloaded' : 'ডাউনলোড হয়েছে'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{language === 'banglish' ? 'Download Image' : 'ছবি ডাউনলোড করুন'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
