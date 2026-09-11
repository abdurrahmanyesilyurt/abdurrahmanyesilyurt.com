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
  location?: Localized;
  /** Kısa ek bilgi, örn. "Staj → Tam Zamanlı" */
  detail?: Localized;
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
  start?: string;
  end?: string;
  note?: Localized;
}

export interface Certification {
  name: Localized;
  issuer?: Localized;
  date?: string;
}

export type Cefr = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Language {
  name: Localized;
  level: Cefr | 'native' | 'basic';
  note?: Localized;
}

export interface CV {
  name: string;
  title: Localized;
  summary: Localized;
  location: Localized;
  focus: string[];
  openToWork: boolean;
  militaryService?: Localized;
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
  summary: {
    tr: 'ASP.NET Core ve PostgreSQL tabanlı backend sistemler geliştiren, aynı zamanda Next.js ve React Native ile web ve mobil istemci tarafında da üretim yapabilen bir bilgisayar mühendisiyim. Hem tam zamanlı hem serbest projelerde farklı sektörlerden firmalara uçtan uca çözümler ürettim; API geliştirmeden veritabanı tasarımına, frontend entegrasyonundan bulut üzerinde dağıtıma ve CI/CD otomasyonuna kadar geniş bir yelpazede sorumluluk aldım.',
    en: 'Computer engineer building backend systems on ASP.NET Core and PostgreSQL, and equally comfortable on the web and mobile client side with Next.js and React Native. Delivered end-to-end solutions for companies in a range of industries, both in full-time roles and as a freelancer — covering API development, database design, frontend integration, cloud deployment, and CI/CD automation.',
  },
  location: 'Kocaeli, Türkiye',
  focus: ['.NET', 'PostgreSQL', 'Next.js', 'React Native'],
  openToWork: true,
  militaryService: { tr: 'Tamamlandı', en: 'Completed' },

  links: {
    email: 'abdurrahmanyesilyurt4141@gmail.com', // Sitede görünecek e-posta adresi (boşsa gösterilmez)
    github: 'https://github.com/abdurrahmanyesilyurt',
    linkedin: 'https://www.linkedin.com/in/abdurrahman-ye%C5%9Filyurt-52b289241/',
  },

  experience: [
    {
      role: {
        tr: 'Backend ve Full-Stack Yazılım Geliştirici',
        en: 'Backend & Full-Stack Software Developer',
      },
      company: { tr: 'Serbest (Freelance)', en: 'Freelance' },
      location: { tr: 'Kocaeli / Uzaktan', en: 'Kocaeli / Remote' },
      detail: { tr: 'Çeşitli firmalar', en: 'Various clients' },
      start: '2025-06',
      current: true,
      highlights: {
        tr: [
          'Dijitalleşme ihtiyacı olan birden fazla firma için uçtan uca backend çözümleri tasarladım ve hayata geçirdim; gereksinim analizinden canlı ortama alımına kadar süreci tek başıma yönettim.',
          'ASP.NET Core 8 ile kurumsal Web API’lar geliştirdim; katmanlı mimari, bağımlılık enjeksiyonu, DTO ve temiz kod ilkelerini tutarlı şekilde uyguladım.',
          'PostgreSQL şeması tasarlayıp EF Core Code-First yaklaşımıyla migration’ları yönettim; canlı veritabanlarında sorgu performansını ölçüp optimize ettim.',
          'JWT ve HTTP-only cookie tabanlı kimlik doğrulama, refresh token rotasyonu ile token bağlama (IP, UserAgent) akışlarını kurguladım; rol ve izin bazlı çok kiracılı yetkilendirme modeli tasarladım.',
          'Gerçek zamanlı bildirim altyapıları için SignalR kullandım; SMTP sağlayıcıları üzerinden şablonlu e-posta entegrasyonları gerçekleştirdim.',
          'Ubuntu sunucuda Docker ile container bazlı dağıtım, Nginx reverse proxy, SSL sertifika kurulumu ve sistem bakımı süreçlerini yürüttüm.',
          'GitHub Actions ile CI/CD hattı tasarladım; imaj yayını ve otomatik SSH deploy akışı kurarak her push ile güvenli yayın alınmasını sağladım.',
          'Aynı backend’i tüketen birden fazla web istemcisi (Next.js 15, React, TypeScript, TanStack Query, Tailwind CSS) ve React Native (Expo) tabanlı mobil uygulama geliştirip sürdürdüm; uçtan uca full-stack sorumluluk aldım.',
          'Ortak projelerde frontend ekipleri için DTO sözleşmeleri, API dokümantasyonu ve migration rehberleri hazırlayarak entegrasyonu kolaylaştırdım.',
          'Canlı ortamda çıkan hataları sunucu logları üzerinden teşhis edip müdahale ettim; kullanıcı geri bildirimleri doğrultusunda sürekli iyileştirme yaptım.',
        ],
        en: [
          'Designed and delivered end-to-end backend solutions for multiple companies pursuing digital transformation; owned the process from requirements analysis through production rollout.',
          'Built enterprise Web APIs with ASP.NET Core 8, applying layered architecture, dependency injection, DTO patterns, and clean code principles consistently.',
          'Designed PostgreSQL schemas and managed migrations with EF Core Code-First; profiled and optimized query performance on live databases.',
          'Implemented JWT and HTTP-only cookie authentication, refresh token rotation with token binding (IP, UserAgent), and a role- and permission-based multi-tenant authorization model.',
          'Built real-time notification infrastructure with SignalR and integrated transactional email flows through SMTP providers with templated content.',
          'Operated Ubuntu servers with Docker container-based deployment, Nginx reverse proxy, SSL certificate setup, and ongoing system maintenance.',
          'Designed a CI/CD pipeline with GitHub Actions; published container images and automated SSH deploy so every push triggers a safe release.',
          'Developed and maintained multiple web clients (Next.js 15, React, TypeScript, TanStack Query, Tailwind CSS) and a React Native (Expo) mobile app consuming the same backend — taking full-stack ownership end to end.',
          'Coordinated with frontend teams on joint projects by preparing DTO contracts, API documentation, and migration guides to streamline integration.',
          'Diagnosed production issues through server logs and iterated on improvements based on user feedback.',
        ],
      },
    },
    {
      role: { tr: 'Backend Geliştirici', en: 'Backend Developer' },
      company: 'TOS Analytics',
      location: { tr: 'İstanbul', en: 'Istanbul' },
      detail: {
        tr: 'Staj → Yarı Zamanlı (Uzaktan) → Tam Zamanlı (Hibrit)',
        en: 'Intern → Part-Time (Remote) → Full-Time (Hybrid)',
      },
      start: '2024-08',
      end: '2025-10',
      highlights: {
        tr: [
          'ASP.NET Core ile kurumsal düzeyde Web API geliştirme süreçlerinde aktif rol aldım; takım üyeleriyle birlikte hata ayıklama ve kod iyileştirme çalışmaları yürüttüm.',
          'PostgreSQL veritabanı tasarımı, sorgu optimizasyonu ve AWS S3 ile dosya yönetimi entegrasyonları üzerinde çalıştım.',
          'Git üzerinden versiyon kontrol, pull request inceleme ve takım içi kod kalitesi çalışmalarına katkı sağladım; Web API uç noktalarının test edilmesi ve dokümantasyonu süreçlerinde yer aldım.',
          'Python betikleri ile veri işleme ve analiz görevleri geliştirdim; yapay zekâ araçlarını iş akışlarına entegre ederek süreçleri otomatize ettim ve ekip verimliliğine katkı sundum.',
        ],
        en: [
          'Contributed actively to enterprise-grade Web API development with ASP.NET Core; debugged and refactored code together with team members.',
          'Worked on PostgreSQL database design, query optimization, and file management integrations with AWS S3.',
          'Participated in version control, pull request reviews, and team-wide code quality efforts on Git; took part in testing Web API endpoints and preparing their documentation.',
          'Wrote Python scripts for data processing and analysis tasks; integrated AI tools into workflows to automate processes and improve team productivity.',
        ],
      },
    },
    {
      role: { tr: 'Stajyer Mühendis', en: 'Engineering Intern' },
      company: { tr: 'Kocaeli Büyükşehir Belediyesi', en: 'Kocaeli Metropolitan Municipality' },
      location: 'Kocaeli',
      start: '2024-07',
      end: '2024-08',
      highlights: {
        tr: [
          '.NET Framework ile iç kullanım amaçlı uygulamalar geliştirdim.',
          'Sunucu tarafı yapılandırma süreçlerinde mentör eşliğinde çalıştım.',
          'Ubuntu sunucu yönetimi ve temel sistem yönetimi konularında pratik deneyim kazandım.',
        ],
        en: [
          'Developed internal-use applications on .NET Framework.',
          'Worked on server-side configuration tasks under mentor supervision.',
          'Gained hands-on experience in Ubuntu server administration and general system management.',
        ],
      },
    },
    {
      role: { tr: 'Mobil Uygulama Geliştirici', en: 'Mobile App Developer' },
      company: { tr: 'MERLAB İnovasyon Bilim ve Teknoloji', en: 'MERLAB Innovation, Science and Technology' },
      location: 'Konya',
      start: '2024-03',
      end: '2024-08',
      highlights: {
        tr: [
          'Flutter ile endüstriyel ölçüm sistemi için mobil uygulama geliştirdim.',
          'Bluetooth Low Energy cihazlardan gelen verileri uygulamaya entegre ettim.',
          'Donanım ve yazılım arayüzü üzerinde ekip içinde koordineli çalışma yürüttüm.',
        ],
        en: [
          'Built a Flutter mobile application for an industrial weighing system.',
          'Integrated sensor data from Bluetooth Low Energy devices into the mobile app.',
          'Collaborated with the team on the hardware/software interface.',
        ],
      },
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
      name: { tr: 'Diller', en: 'Languages' },
      items: ['C#', 'TypeScript', 'JavaScript', 'Python', 'SQL', 'Dart'],
    },
    {
      name: 'Backend',
      items: ['ASP.NET Core 8', '.NET 8', 'Web API', 'REST', 'SignalR', 'Entity Framework Core', 'LINQ', 'Node.js'],
    },
    {
      name: 'Frontend',
      items: ['Next.js 15', 'React', 'TypeScript', 'TanStack Query', 'Tailwind CSS', 'HTML', 'CSS'],
    },
    {
      name: { tr: 'Mobil', en: 'Mobile' },
      items: ['React Native', 'Expo', 'Flutter'],
    },
    {
      name: { tr: 'Veritabanı', en: 'Databases' },
      items: [
        'PostgreSQL',
        { tr: 'İlişkisel veri modelleme', en: 'Relational data modeling' },
        { tr: 'Sorgu optimizasyonu', en: 'Query optimization' },
        { tr: 'Migration yönetimi', en: 'Migration management' },
      ],
    },
    {
      name: { tr: 'Kimlik ve Güvenlik', en: 'Identity & Security' },
      items: [
        'JWT',
        'ASP.NET Core Identity',
        'Cookie Authentication',
        { tr: 'Refresh token rotasyonu', en: 'Refresh token rotation' },
        { tr: 'Rol ve izin tabanlı yetkilendirme', en: 'Role- and permission-based authorization' },
        { tr: 'Çok kiracılı (multi-tenant) mimari', en: 'Multi-tenant architecture' },
      ],
    },
    {
      name: { tr: 'Bulut ve DevOps', en: 'Cloud & DevOps' },
      items: [
        'AWS EC2',
        'AWS S3',
        'Docker',
        'Nginx',
        'Ubuntu Server',
        'GitHub Actions (CI/CD)',
        { tr: 'SSL ve alan adı yönetimi', en: 'SSL and domain management' },
      ],
    },
    {
      name: { tr: 'Araçlar', en: 'Tools' },
      items: ['Git', 'GitHub', 'Swagger/OpenAPI', 'Postman', 'Visual Studio', 'Rider', 'VS Code'],
    },
    {
      name: { tr: 'Diğer', en: 'Other' },
      items: [
        { tr: 'QuestPDF (PDF üretimi)', en: 'QuestPDF (PDF generation)' },
        { tr: 'SMTP entegrasyonları', en: 'SMTP integrations' },
        { tr: 'Python ile veri işleme', en: 'Python for data processing' },
        { tr: 'Bluetooth Low Energy entegrasyonu', en: 'Bluetooth Low Energy integration' },
      ],
    },
  ],

  education: [
    {
      school: { tr: 'Konya Teknik Üniversitesi', en: 'Konya Technical University' },
      degree: { tr: 'Bilgisayar Mühendisliği, Lisans', en: 'BSc, Computer Engineering' },
      start: '2021-09',
      end: '2025-06',
      note: {
        tr: 'Bitirme projesi: ASP.NET Core tabanlı mobil uygulama backend geliştirme; kullanıcı bazlı öneri sistemi, JWT kimlik doğrulama, çok katmanlı mimari ve PostgreSQL veritabanı tasarımı konularını kapsadı.',
        en: 'Graduation project: ASP.NET Core backend for a mobile application — covering a user-based recommendation system, JWT authentication, layered architecture, and PostgreSQL database design.',
      },
    },
  ],

  certifications: [
    {
      name: { tr: 'İngilizce C2', en: 'English C2' },
      issuer: { tr: 'Amerikan Kültür Yabancı Dil Kursları', en: 'American Culture Language Schools' },
    },
    {
      name: { tr: 'Mikroservis Mimarileri Eğitimi', en: 'Microservice Architectures Training' },
    },
  ],

  languages: [
    { name: { tr: 'Türkçe', en: 'Turkish' }, level: 'native' },
    {
      name: { tr: 'İngilizce', en: 'English' },
      level: 'C2',
      note: {
        tr: 'İleri düzey okuma ve yazma; iyi düzey dinleme ve konuşma',
        en: 'Advanced reading and writing; strong listening and speaking',
      },
    },
    { name: { tr: 'Japonca', en: 'Japanese' }, level: 'basic' },
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
