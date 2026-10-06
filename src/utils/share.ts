// Sharing utilities for Messenger, WhatsApp, Native Web Share, and Clipboard

export async function copyToClipboard(text: string): Promise<boolean> {
  // Mobile haptic vibration if supported
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([15]);
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-https development
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch {
    return false;
  }
}

export function shareViaMessenger(text: string): { type: 'opened' | 'copied' } {
  // Mobile haptic vibration
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([20]);
  }

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    // Try opening Messenger app directly via deep link or Facebook share
    // Fallback to Messenger mobile web or copy
    const messengerUrl = `fb-messenger://share?link=${encodeURIComponent(window.location.href)}&app_id=123456`;
    
    // We can also trigger native share if available as Messenger will appear as primary option on mobile
    if (navigator.share) {
      navigator.share({
        title: 'বাহানা (Bahana)',
        text: text,
        url: window.location.href,
      }).catch(() => {
        // Fallback: copy and open messenger.com
        copyToClipboard(text);
        window.open('https://m.me', '_blank');
      });
      return { type: 'opened' };
    }

    // Direct Messenger app URL attempt
    window.open(messengerUrl, '_blank');
    return { type: 'opened' };
  } else {
    // On desktop: copy text to clipboard and open messenger.com
    copyToClipboard(text);
    window.open('https://www.messenger.com', '_blank');
    return { type: 'copied' };
  }
}

export function shareViaWhatsApp(text: string) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([15]);
  }
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n\n— বাহানা (the excuse generator)')}`;
  window.open(url, '_blank');
}

export async function shareNative(text: string, title = 'বাহানা (Bahana)'): Promise<boolean> {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([15]);
  }

  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: text,
      });
      return true;
    } catch {
      return false;
    }
  } else {
    return await copyToClipboard(text);
  }
}
