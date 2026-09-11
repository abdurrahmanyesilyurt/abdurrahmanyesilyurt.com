export const languages = {
  tr: 'Türkçe',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const sectionKeys = ['experience', 'projects', 'skills', 'education', 'contact'] as const;
export type SectionKey = (typeof sectionKeys)[number];

interface UI {
  meta: { title: string; description: string };
  sections: Record<SectionKey, { id: string; label: string }>;
  skipToContent: string;
  navLabel: string;
  openToWork: string;
  present: string;
  facts: { role: string; focus: string; location: string; languages: string; military: string };
  contactCta: string;
  savePdf: string;
  themeToggle: string;
  education: string;
  certifications: string;
  languages: string;
  native: string;
  basic: string;
  contactTitle: string;
  contactAccent: string;
  contactLinks: { email: string; github: string; linkedin: string };
  projectRole: string;
  projectLinks: { web: string; 'google-play': string; 'app-store': string };
  builtWith: string;
  lastUpdated: string;
}

export const ui: Record<Lang, UI> = {
  tr: {
    meta: {
      title: 'Abdurrahman Yeşilyurt — Backend & Full-Stack Yazılım Geliştirici',
      description:
        "Abdurrahman Yeşilyurt'un özgeçmişi: ASP.NET Core, PostgreSQL, Next.js ve React Native ile backend ağırlıklı full-stack yazılım geliştirme.",
    },
    sections: {
      experience: { id: 'deneyim', label: 'Deneyim' },
      projects: { id: 'projeler', label: 'Projeler' },
      skills: { id: 'yetenekler', label: 'Yetenekler' },
      education: { id: 'egitim', label: 'Eğitim' },
      contact: { id: 'iletisim', label: 'İletişim' },
    },
    skipToContent: 'İçeriğe geç',
    navLabel: 'Bölümler',
    openToWork: 'Yeni fırsatlara açığım',
    present: 'Günümüz',
    facts: { role: 'Rol', focus: 'Odak', location: 'Konum', languages: 'Diller', military: 'Askerlik' },
    contactCta: 'İletişime geç',
    savePdf: 'PDF olarak kaydet',
    themeToggle: 'Açık / koyu tema',
    education: 'Eğitim',
    certifications: 'Sertifikalar',
    languages: 'Diller',
    native: 'Anadil',
    basic: 'Temel seviye',
    contactTitle: 'Bir projen ya da açık bir pozisyon mu var?',
    contactAccent: 'Konuşalım.',
    contactLinks: { email: 'E-posta', github: 'GitHub', linkedin: 'LinkedIn' },
    projectRole: 'Rolüm',
    projectLinks: { web: 'Web sitesi', 'google-play': 'Google Play', 'app-store': 'App Store' },
    builtWith: 'Astro ile yazıldı · Vercel’de yayında',
    lastUpdated: 'Son güncelleme',
  },
  en: {
    meta: {
      title: 'Abdurrahman Yeşilyurt — Backend & Full-Stack Software Developer',
      description:
        'Résumé of Abdurrahman Yeşilyurt: backend-leaning full-stack development with ASP.NET Core, PostgreSQL, Next.js and React Native.',
    },
    sections: {
      experience: { id: 'experience', label: 'Experience' },
      projects: { id: 'projects', label: 'Projects' },
      skills: { id: 'skills', label: 'Skills' },
      education: { id: 'education', label: 'Education' },
      contact: { id: 'contact', label: 'Contact' },
    },
    skipToContent: 'Skip to content',
    navLabel: 'Sections',
    openToWork: 'Open to new opportunities',
    present: 'Present',
    facts: { role: 'Role', focus: 'Focus', location: 'Location', languages: 'Languages', military: 'Military service' },
    contactCta: 'Get in touch',
    savePdf: 'Save as PDF',
    themeToggle: 'Light / dark theme',
    education: 'Education',
    certifications: 'Certifications',
    languages: 'Languages',
    native: 'Native',
    basic: 'Basic',
    contactTitle: 'Have a project or an open role?',
    contactAccent: 'Let’s talk.',
    contactLinks: { email: 'Email', github: 'GitHub', linkedin: 'LinkedIn' },
    projectRole: 'My role',
    projectLinks: { web: 'Website', 'google-play': 'Google Play', 'app-store': 'App Store' },
    builtWith: 'Built with Astro · Hosted on Vercel',
    lastUpdated: 'Last updated',
  },
};
