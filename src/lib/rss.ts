import rss from '@astrojs/rss';
import { getPosts, postUrl } from './posts';
import { ui, type Lang } from '../i18n/ui';

export async function blogFeed(lang: Lang, site: URL | undefined): Promise<Response> {
  const posts = await getPosts(lang);
  return rss({
    title: ui[lang].blog.title,
    description: ui[lang].blog.description,
    site: site ?? 'https://www.abdurrahmanyesilyurt.com',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postUrl(post),
      categories: post.data.tags,
    })),
    customData: `<language>${lang === 'tr' ? 'tr-TR' : 'en-US'}</language>`,
  });
}
