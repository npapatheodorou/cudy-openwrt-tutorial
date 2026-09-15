import { ChevronRight, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { GuideImage } from '../content/images';
import { imageUrl } from '../lib/urls';
import { useGuide } from '../state/guide';
import { useLightbox } from '../state/lightbox';

export function Screenshot({ image }: { image: GuideImage }) {
  const { screenshots } = useGuide();
  const lightbox = useLightbox();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (screenshots.version > 0) setOpen(screenshots.open);
  }, [screenshots]);

  return (
    <details className="shot" open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary>
        <ImageIcon className="i" aria-hidden="true" />
        <span>{image.label}</span>
        <ChevronRight className="i chev" aria-hidden="true" />
      </summary>
      <figure>
        <button type="button" className="shot-zoom" onClick={() => lightbox.open(image)} aria-label={`Enlarge screenshot: ${image.alt}`}>
          <img src={imageUrl(image)} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" />
        </button>
        <figcaption>
          <ZoomIn className="i" aria-hidden="true" />
          Click the image to enlarge
        </figcaption>
      </figure>
    </details>
  );
}
