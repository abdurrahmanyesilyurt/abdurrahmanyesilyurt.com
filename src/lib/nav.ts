import { sectionKeys, ui, type Lang } from '../i18n/ui';

const homePaths: Record<Lang, string> = { tr: '/', en: '/en/' };

export function homePath(lang: Lang): string {
  return homePaths[lang];
}

/** Ana sayfa dışındaki sayfaların menüsü: bölümlere ana sayfa üzerinden, yazılara blog listesinden gider */
export function siteNav(lang: Lang): { href: string; label: string }[] {
  const s = ui[lang];
  return sectionKeys.map((key) => ({
    href: key === 'writing' ? s.blogPath : `${homePaths[lang]}#${s.sections[key].id}`,
    label: s.sections[key].label,
  }));
}
