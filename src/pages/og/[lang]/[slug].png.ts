import type { APIRoute } from 'astro';
import { postCard, renderPng } from '../../../lib/og';
import { getPosts, postMeta, type Post } from '../../../lib/posts';

// /og/<dil>/<yazı>.png — her blog yazısının kendi başlığıyla paylaşım görseli
export async function getStaticPaths() {
  const posts = [...(await getPosts('tr')), ...(await getPosts('en'))];
  return posts.map((post) => ({ params: postMeta(post), props: { post } }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderPng(postCard((props as { post: Post }).post)), { headers: { 'Content-Type': 'image/png' } });
