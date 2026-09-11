import type { APIRoute } from 'astro';
import { homeCard, renderPng } from '../../lib/og';
import type { Lang } from '../../i18n/ui';

// /og/tr.png ve /og/en.png — ana sayfa ve blog listesi paylaşım görselleri
export function getStaticPaths() {
  return [{ params: { lang: 'tr' } }, { params: { lang: 'en' } }];
}

export const GET: APIRoute = async ({ params }) =>
  new Response(await renderPng(homeCard(params.lang as Lang)), { headers: { 'Content-Type': 'image/png' } });
