import { X } from 'lucide-react';
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { GuideImage } from '../content/images';
import { imageUrl } from '../lib/urls';

interface LightboxContextValue {
  open: (image: GuideImage) => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<GuideImage | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (image && !dialog.open) dialog.showModal();
    if (!image && dialog.open) dialog.close();
  }, [image]);

  const value = useMemo<LightboxContextValue>(() => ({ open: setImage }), []);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Screenshot preview"
        onClose={() => setImage(null)}
        onClick={() => dialogRef.current?.close()}
      >
        <button type="button" className="icon-btn lightbox-close" aria-label="Close preview">
          <X className="i" aria-hidden="true" />
        </button>
        {image && (
          <figure>
            <img src={imageUrl(image)} alt={image.alt} width={image.width} height={image.height} />
            <figcaption>{image.alt}</figcaption>
          </figure>
        )}
      </dialog>
    </LightboxContext.Provider>
  );
}

export function useLightbox(): LightboxContextValue {
  const context = useContext(LightboxContext);
  if (!context) throw new Error('useLightbox must be used inside <LightboxProvider>');
  return context;
}
