import React, { useEffect, useState } from 'react';
import { Share2, Check } from 'lucide-react';

const InsightShareButton = ({
  slug,
  title,
  excerpt,
  className = '',
  label = 'Share'
}) => {
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (status !== 'copied') return undefined;

    const timer = setTimeout(() => {
      setStatus('idle');
    }, 1600);

    return () => clearTimeout(timer);
  }, [status]);

  const handleShare = async (event) => {
    event.stopPropagation();

    const url = `${window.location.origin}/insights/${slug}`;
    const shareData = {
      title,
      text: excerpt,
      url
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setStatus('copied');
        return;
      }

      window.prompt('Copy this link', url);
      setStatus('copied');
    } catch (error) {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(url);
          setStatus('copied');
        } catch {
          console.error('Failed to copy insight link:', error);
        }
      } else {
        console.error('Failed to share insight:', error);
      }
    }
  };

  const isCopied = status === 'copied';

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-mono tracking-[0.16em] uppercase transition-colors ${className}`}
      aria-label={`Share ${title}`}
      title={`Share ${title}`}
    >
      {isCopied ? <Check size={12} /> : <Share2 size={12} />}
      <span className="hidden sm:inline">{isCopied ? 'Copied' : label}</span>
      <span className="sm:hidden">{isCopied ? 'Copied' : ''}</span>
    </button>
  );
};

export default InsightShareButton;
