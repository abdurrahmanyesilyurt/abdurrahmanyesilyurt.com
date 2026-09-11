import { getCollection, type CollectionEntry } from 'astro:content';
import { ui, type Lang } from '../i18n/ui';

export type Post = CollectionEntry<'posts'>;

/** 'tr/yazinin-adi' → { lang: 'tr', slug: 'yazinin-adi' } */
export function postMeta(post: Post): { lang: Lang; slug: string } {
  const [lang, ...rest] = post.id.split('/');
  return { lang: lang as Lang, slug: rest.join('/') };
}

export function postUrl(post: Post): string {
  const { lang, slug } = postMeta(post);
  return `${ui[lang].blogPath}${slug}/`;
}

/** Taslaklar sadece geliştirme sunucusunda görünür; en yeni yazı başta */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const posts = await getCollection(
    'posts',
    (post) => postMeta(post).lang === lang && (import.meta.env.DEV || !post.data.draft),
  );
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Aynı translationKey'e sahip diğer dildeki yazı */
export async function findTranslation(post: Post, lang: Lang): Promise<Post | undefined> {
  if (!post.data.translationKey) return undefined;
  const others = await getPosts(lang);
  return others.find((other) => other.data.translationKey === post.data.translationKey);
}

/** Dakika cinsinden okuma süresi (dakikada ~200 kelime) */
export function readingMinutes(post: Post): number {
  const words = (post.body ?? '').replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const locales: Record<Lang, string> = { tr: 'tr-TR', en: 'en-US' };

export function formatPostDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(locales[lang], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}
