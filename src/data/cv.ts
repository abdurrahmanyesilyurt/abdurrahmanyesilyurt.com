/**
 * Sitedeki tüm CV içeriği bu dosyada. CV'ni güncellemek için sadece burayı düzenle.
 *
 * Bir alan iki dilde aynıysa düz yaz:        company: 'TOS Analytics'
 * Dile göre değişiyorsa { tr, en } olarak yaz: role: { tr: 'Stajyer', en: 'Intern' }
 * Tarihler 'YYYY-AA' biçiminde:                start: '2024-08'
 */
import type { Lang } from '../i18n/ui';

export type Localized<T = string> = T | { tr: T; en: T };

export interface Experience {
  role: Localized;
  company: Localized;
  start: string;
  end?: string;
  current?: boolean;
  highlights?: Localized<string[]>;
}

export interface Project {
  name: string;
  description: Localized;
  tech: string[];
  url?: string;
  repo?: string;
}

export interface SkillGroup {
  name: Localized;
  items: Localized[];
}

export interface Education {
  school: Localized;
  degree: Localized;
  field?: Localized;
  start?: string;
  end?: string;
}

export interface Certification {
  name: Localized;
  issuer?: Localized;
  date?: string;
}

export type Cefr = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Language {
  name: Localized;
  level: Cefr | 'native';
}

export interface CV {
  name: string;
  title: Localized;
  summary: Localized;
  location: Localized;
  focus: string[];
  openToWork: boolean;
  links: { email?: string; github?: string; linkedin?: string };
  experience: Experience[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
}

export const cv: CV = {
  name: 'Abdurrahman Yeşilyurt',
  title: {
    tr: 'Backend & Full-Stack Yazılım Geliştirici',
    en: 'Backend & Full-Stack Software Developer',
  },
  // TODO: Bu metni kendi cümlelerinle güncelle.
  summary: {
    tr: 'Backend ağırlıklı çalışan bir full-stack yazılım geliştiriciyim. ASP.NET Core ve PostgreSQL ile güvenli, ölçeklenebilir API’ler ve multi-tenant mimariler kuruyor; bu servislerin web ve mobil arayüzlerini Next.js, React Native ve Flutter ile geliştiriyorum.',
    en: 'I’m a backend-leaning full-stack software developer. I design secure, scalable APIs and multi-tenant architectures with ASP.NET Core and PostgreSQL, then build the web and mobile clients on top of them with Next.js, React Native and Flutter.',
  },
  location: 'Türkiye',
  focus: ['.NET', 'PostgreSQL', 'Next.js', 'React Native'],
  openToWork: true,

  links: {
    email: '', // TODO: sitede görünecek e-posta adresi
    github: 'https://github.com/abdurrahmanyesilyurt',
    linkedin: '', // TODO: https://www.linkedin.com/in/...
  },

  // TODO: Her işe 1–3 madde ekle (ne yaptın, hangi teknolojiyle, ne sonuç verdi)
  // ve biten işlerin bitiş tarihini `end` ile yaz.
  experience: [
    {
      role: {
        tr: 'Backend & Full-Stack Yazılım Geliştirici',
        en: 'Backend & Full-Stack Software Developer',
      },
      company: { tr: 'Serbest', en: 'Freelance' },
      start: '2025-06',
      current: true,
    },
    {
      role: { tr: 'Backend Geliştirici', en: 'Backend Developer' },
      company: 'TOS Analytics',
      start: '2024-08',
    },
    {
      role: { tr: 'Mühendislik Stajyeri', en: 'Engineering Intern' },
      company: { tr: 'Kocaeli Büyükşehir Belediyesi', en: 'Kocaeli Metropolitan Municipality' },
      start: '2024-07',
    },
    {
      role: { tr: 'Mobil Uygulama Geliştirici', en: 'Mobile App Developer' },
      company: 'MERLAB Innovation, Science and Technology',
      start: '2024-03',
    },
  ],

  // Proje eklediğinde "Projeler" bölümü otomatik görünür. Örnek:
  // {
  //   name: 'Proje Adı',
  //   description: { tr: 'Kısa açıklama', en: 'Short description' },
  //   tech: ['ASP.NET Core', 'PostgreSQL', 'Next.js'],
  //   url: 'https://...',
  //   repo: 'https://github.com/abdurrahmanyesilyurt/...',
  // },
  projects: [],

  skills: [
    {
      name: 'Backend',
      items: ['C#', '.NET', 'ASP.NET Core', 'Web API', 'REST API', 'Entity Framework Core', 'JWT', 'Node.js', 'Python'],
    },
    {
      name: { tr: 'Mimari', en: 'Architecture' },
      items: [
        { tr: 'Mikroservisler', en: 'Microservices' },
        { tr: 'Multi-tenant mimari', en: 'Multi-tenant architecture' },
      ],
    },
    {
      name: 'Frontend',
      items: ['TypeScript', 'JavaScript', 'React', 'Next.js'],
    },
    {
      name: { tr: 'Mobil', en: 'Mobile' },
      items: ['React Native', 'Expo', 'Flutter', 'Dart'],
    },
    {
      name: { tr: 'Veri', en: 'Data' },
      items: [
        'PostgreSQL',
        'SQL',
        { tr: 'İlişkisel veri modelleme', en: 'Relational data modeling' },
        { tr: 'Sorgu optimizasyonu', en: 'Query optimization' },
        { tr: 'Veritabanı migration’ları', en: 'Database migrations' },
      ],
    },
    {
      name: { tr: 'DevOps & Araçlar', en: 'DevOps & Tools' },
      items: ['Git', 'GitHub', 'CI/CD', 'AWS', 'Ubuntu Server'],
    },
  ],

  // TODO: Bölümünü (`field`) ve yıllarını (`start` / `end`, örn. '2020' / '2025') ekle.
  education: [
    {
      school: 'Konya Teknik Üniversitesi',
      degree: { tr: 'Lisans', en: 'Bachelor’s degree' },
    },
  ],

  certifications: [
    {
      name: { tr: 'Mikroservis Mimarileri Eğitimi', en: 'Microservice Architectures Training' },
    },
    {
      name: { tr: 'İngilizce C2', en: 'English C2' },
      issuer: 'American Culture Language Schools',
    },
  ],

  languages: [
    { name: { tr: 'Türkçe', en: 'Turkish' }, level: 'native' },
    { name: { tr: 'İngilizce', en: 'English' }, level: 'C2' },
  ],
};

/** Localized bir değerin istenen dildeki karşılığını döndürür. */
export function t<T>(value: Localized<T>, lang: Lang): T {
  if (typeof value === 'object' && value !== null && !Array.isArray(value) && 'tr' in value && 'en' in value) {
    return (value as { tr: T; en: T })[lang];
  }
  return value as T;
}

const locales: Record<Lang, string> = { tr: 'tr-TR', en: 'en-US' };

/** '2024-08' → 'Ağu 2024' / 'Aug 2024'. Sadece yıl verilirse ('2025') yılı döndürür. */
export function formatDate(value: string, lang: Lang): string {
  const [year, month] = value.split('-').map(Number);
  if (!month) return String(year);
  return new Intl.DateTimeFormat(locales[lang], { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}
