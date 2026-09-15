import type { GuideImage } from '../content/images';

/** URL of repository content copied next to the built site (see vite.config.ts). */
export const contentUrl = (path: string): string => `${import.meta.env.BASE_URL}${path}`;

export const imageUrl = (image: GuideImage): string => contentUrl(`assets/images/${image.file}`);

export const firmwareUrl = (file: string): string => contentUrl(`firmware/${file}`);

export const REPO_URL = 'https://github.com/npapatheodorou/cudy-openwrt-tutorial';
