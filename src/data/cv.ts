/**
 * Sitedeki tüm CV içeriği bu dosyada. CV'ni güncellemek için sadece burayı düzenle.
 *
 * Bir alan iki dilde aynıysa düz yaz:        company: 'TOS Analytics'
 * Dile göre değişiyorsa { tr, en } olarak yaz: role: { tr: 'Stajyer', en: 'Intern' }
 * Tarihler 'YYYY-AA' biçiminde:                start: '2024-08'
 */
import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/ui';
import ecoasistanIcon from '../assets/projects/ecoasistan.png';
import ecoyazilimIcon from '../assets/projects/ecoyazilim.png';
import ekonazKarbonIcon from '../assets/projects/ekonaz-karbon.png';
import nakliyekoopIcon from '../assets/projects/nakliyekoop.png';
import sayveraIcon from '../assets/projects/sayveraglobal.png';

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

export type ProjectLinkType = 'web' | 'google-play' | 'app-store';

export interface ProjectLink {
  type: ProjectLinkType;
  url: string;
  /** Varsayılan etiketin yerine, örn. { tr: 'Karbon paneli', en: 'Carbon dashboard' } */
  label?: Localized;
}

export interface Project {
  name: string;
  /** Kartın üstündeki kısa alan adı, örn. "Lojistik" */
  category: Localized;
  /** Örn. ['Web', 'iOS', 'Android'] — marka adları olduğu için çevrilmez */
  platforms?: string[];
  description: Localized;
  /** Projede benim üstlendiğim kısım */
  role?: Localized;
  tech: string[];
  links?: ProjectLink[];
  /** QR kodun açacağı adres ve altındaki kısa yazı; boşsa QR gösterilmez */
  qr?: { url: string; label: Localized };
  /** src/assets/projects altından import edilen ikon */
  icon?: ImageMetadata;
  /** Öne çıkan proje: iki sütunu kaplayan geniş kart olur */
  featured?: boolean;
}

export interface SkillItem {
  label: Localized;
  /** simple-icons kısa adı, örn. 'docker' (https://simpleicons.org); marka logosu gösterilir */
  icon?: string;
  /** Ana odak: yeşil çerçeveyle vurgulanır */
  core?: boolean;
}

export interface SkillGroup {
  name: Localized;
  /** Düz metin ya da { label, icon, core } */
  items: (Localized | SkillItem)[];
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
    tr: 'ASP.NET Core, NestJS ve PostgreSQL ile backend sistemler; Next.js ve React Native (Expo) ile web ve mobil istemciler geliştiren bir bilgisayar mühendisiyim. Farklı sektörlerden firmalar için geliştirdiğim ürünler web’de, App Store’da ve Google Play’de canlıda; son olarak Claude API ile e-postalardan randevu, görev ve son tarih çıkaran yapay zekâ destekli asistan ürünüm Ecoasistan’ı yayına aldım. API ve veritabanı tasarımından kimlik doğrulama, bulut dağıtımı ve CI/CD otomasyonuna kadar uçtan uca sorumluluk alırım.',
    en: 'Computer engineer building backend systems with ASP.NET Core, NestJS and PostgreSQL, and web and mobile clients with Next.js and React Native (Expo). Products I have built for companies across several industries are live on the web, the App Store and Google Play; most recently I launched Ecoasistan, my own AI-powered assistant that uses the Claude API to extract appointments, tasks and deadlines from email. I take end-to-end ownership, from API and database design to authentication, cloud deployment and CI/CD automation.',
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
          'Dijitalleşme ihtiyacı olan firmalar için uçtan uca ürünler tasarlayıp canlıya aldım (bkz. Projeler). ASP.NET Core 8 ve NestJS ile katmanlı Web API’lar geliştirdim; PostgreSQL şemalarını EF Core ve Prisma migration’larıyla yönetip sorgu performansını optimize ettim.',
          'JWT ve HTTP-only cookie tabanlı kimlik doğrulama, refresh token rotasyonu ile token bağlama (IP, UserAgent) ve rol/izin bazlı çok kiracılı yetkilendirme kurguladım; SignalR/Socket.IO ile gerçek zamanlı güncellemeler, FCM/APNs ve Web Push bildirimleri, SMTP e-posta entegrasyonları geliştirdim.',
          'Ubuntu sunucularda Docker, Nginx reverse proxy ve SSL ile dağıtım yaptım; GitHub Actions ile test, imaj yayını, otomatik deploy, migration ve sağlık kontrolü içeren, başarısızlıkta önceki sürüme dönen CI/CD hatları kurdum.',
          'Next.js, React, TanStack Query ve Tailwind CSS ile web istemcileri; React Native (Expo) ile App Store ve Google Play’de yayında olan mobil uygulamalar geliştirdim, EAS ile OTA güncelleme akışı kurdum.',
          'Frontend ekipleri için DTO sözleşmeleri ve API dokümantasyonu hazırladım; canlı ortam hatalarını sunucu loglarından teşhis edip giderdim.',
        ],
        en: [
          'Designed and shipped end-to-end products for companies pursuing digital transformation (see Projects). Built layered Web APIs with ASP.NET Core 8 and NestJS; managed PostgreSQL schemas through EF Core and Prisma migrations and optimized query performance.',
          'Implemented JWT and HTTP-only cookie authentication, refresh token rotation with token binding (IP, UserAgent), and role/permission-based multi-tenant authorization; built real-time updates with SignalR/Socket.IO, FCM/APNs and Web Push notifications, and SMTP email integrations.',
          'Deployed on Ubuntu servers with Docker, Nginx reverse proxy and SSL; built GitHub Actions CI/CD pipelines covering tests, image publishing, automated deploys, migrations and health checks, with automatic rollback.',
          'Built web clients with Next.js, React, TanStack Query and Tailwind CSS, and React Native (Expo) mobile apps live on the App Store and Google Play; set up over-the-air updates with EAS.',
          'Prepared DTO contracts and API documentation for frontend teams; diagnosed and fixed production issues from server logs.',
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

  // Sadece herkese açık adresler: API, yönetim paneli ve test ortamı linkleri buraya girmez.
  projects: [
    {
      name: 'Ecoasistan',
      category: { tr: 'Yapay zekâ · Verimlilik', en: 'AI · Productivity' },
      platforms: ['Web'],
      description: {
        tr: 'Gmail ve Google Takvim’i okuyup randevuları, görevleri ve son tarihleri tek bir günlük akışta toplayan yapay zekâ destekli asistan: takvim önerileri, üç tonda yanıt taslakları, asistan sohbeti ve günün özeti bildirimi. Takvime yazma ve mail gönderme yalnızca kullanıcı onayıyla yapılır.',
        en: 'AI-powered assistant that reads Gmail and Google Calendar and gathers appointments, tasks and deadlines into a single daily feed: calendar suggestions, reply drafts in three tones, an assistant chat and a daily summary notification. Writing to the calendar or sending email only happens with the user’s approval.',
      },
      role: {
        tr: 'Kendi ürünüm. pnpm monorepo mimarisi (NestJS + Prisma API, Next.js web, yayına hazırlanan Expo mobil uygulaması); Claude API ile sınıflandırma → çıkarım hattı (Zod şema doğrulaması, dayanak cümlesi kontrolü, prompt injection’a karşı araçsız model); modelden önce çalışan kural tabanlı ayrıştırıcılar; Gmail, Takvim ve Outlook entegrasyonları; KVKK uyumu ve Docker + GitHub Actions ile otomatik deploy.',
        en: 'My own product. The pnpm monorepo architecture (NestJS + Prisma API, Next.js web app, an upcoming Expo mobile app); a classification → extraction pipeline on the Claude API (Zod schema validation, source-quote checks, a tool-less model against prompt injection); rule-based parsers that run before the model; Gmail, Calendar and Outlook integrations; KVKK compliance and automated deploys with Docker and GitHub Actions.',
      },
      tech: ['NestJS', 'Prisma', 'PostgreSQL', 'Claude API', 'Zod', 'Next.js 16', 'React Native (Expo)', 'Docker', 'GitHub Actions'],
      links: [{ type: 'web', url: 'https://ecoasistan.com' }],
      qr: { url: 'https://ecoasistan.com', label: { tr: 'Siteyi aç', en: 'Open site' } },
      icon: ecoasistanIcon,
      featured: true,
    },
    {
      name: 'EcoYazılım',
      category: { tr: 'Kurumsal yönetim', en: 'Business management' },
      platforms: ['Web', 'iOS', 'Android'],
      description: {
        tr: 'Çevre ve iş güvenliği danışmanlık firmaları ile müşterileri için yönetim platformu: teklif ve sözleşme onayları, periyodik kontrol raporları, İSG ve çevre danışmanlığı, akademi, belge takibi ve karbon raporu yönetimi. Saha ekipleri için mobil uygulaması var.',
        en: 'Management platform for environmental and occupational-safety consultancies and their client companies: quote and contract approvals, periodic inspection reports, OHS and environmental consulting, an academy, document tracking and carbon report management — plus a mobile app for field teams.',
      },
      role: {
        tr: 'Ekonaz ürünlerinin ortak ASP.NET Core 8 API’si (SignalR bildirimleri, QuestPDF ile QR doğrulamalı PDF raporlar, firma bazlı veri ayrımı ve yetkilendirme) ve Next.js web uygulaması; Expo mobil uygulamasında ekip içinde geliştirme; Docker ve GitHub Actions ile yayın.',
        en: 'The shared ASP.NET Core 8 API behind the Ekonaz products (SignalR notifications, QR-verified PDF reports with QuestPDF, per-company data isolation and permissions) and the Next.js web app; team development on the Expo mobile app; releases with Docker and GitHub Actions.',
      },
      tech: ['ASP.NET Core 8', 'PostgreSQL', 'SignalR', 'QuestPDF', 'Next.js 15', 'React Native (Expo)', 'Docker', 'GitHub Actions'],
      links: [
        { type: 'web', url: 'https://www.ecoyazilim.com' },
        { type: 'app-store', url: 'https://apps.apple.com/tr/app/ecoyaz%C4%B1l%C4%B1m/id6780693355' },
        { type: 'google-play', url: 'https://play.google.com/store/apps/details?id=com.ekonaz.dijital' },
      ],
      qr: { url: 'https://www.ecoyazilim.com/indir', label: { tr: 'Uygulamayı indir', en: 'Get the app' } },
      icon: ecoyazilimIcon,
    },
    {
      name: 'Ekonaz Karbon',
      category: { tr: 'Sürdürülebilirlik', en: 'Sustainability' },
      platforms: ['Web', 'iOS', 'Android'],
      description: {
        tr: 'Şirketler için karbon ayak izi hesaplama ve raporlama portalı: tesis ve dönem bazlı faaliyet verisi, Kapsam 1-2-3 emisyon hesabı, onaylı PDF raporlar ve grafikli gösterge paneli. ISO 14064 ve GHG Protocol’e dayanır.',
        en: 'Corporate carbon footprint calculation and reporting portal: activity data per facility and period, Scope 1–3 emission calculations, approved PDF reports and a dashboard with charts, based on ISO 14064 and the GHG Protocol.',
      },
      role: {
        tr: 'Formül tabanlı emisyon hesaplama ve rapor onay akışının backend’i (ASP.NET Core 8), Next.js müşteri portalı ve Expo ile geliştirilen iOS/Android uygulaması.',
        en: 'The backend for formula-based emission calculations and the report approval flow (ASP.NET Core 8), the Next.js customer portal and the iOS/Android app built with Expo.',
      },
      tech: ['ASP.NET Core 8', 'PostgreSQL', 'NCalc', 'QuestPDF', 'Next.js 15', 'React Native (Expo)', 'TanStack Query', 'Recharts'],
      links: [
        { type: 'web', url: 'https://www.ekocarbon.com.tr' },
        { type: 'app-store', url: 'https://apps.apple.com/tr/app/ekonaz-karbon/id6768579586' },
        { type: 'google-play', url: 'https://play.google.com/store/apps/details?id=com.ekonaz.karbon' },
      ],
      qr: { url: 'https://www.ekocarbon.com.tr/indir', label: { tr: 'Uygulamayı indir', en: 'Get the app' } },
      icon: ekonazKarbonIcon,
    },
    {
      name: 'Sayvera Global',
      category: { tr: 'E-ticaret · Doğrudan satış', en: 'E-commerce · Direct selling' },
      platforms: ['Web'],
      description: {
        tr: 'Doğal sağlık ve bakım ürünleri için doğrudan satış e-ticaret platformu: üyelik ve referans sistemi, ekip ağacı ve aylık kazanç hesabı, satıcı pazaryeri ve kapsamlı yönetim paneli.',
        en: 'Direct-selling e-commerce platform for natural health and care products: membership and referrals, a team tree with monthly earnings, a seller marketplace and an extensive admin panel.',
      },
      role: {
        tr: 'ASP.NET Core 8 backend’in büyük kısmı: katmanlı mimari, komisyon motoru (binary ağaç, kariyer seviyeleri), PayTR ödeme, e-fatura ve kargo entegrasyonları, zamanlanmış işler ve GitHub Actions ile yayın.',
        en: 'Most of the ASP.NET Core 8 backend: layered architecture, the commission engine (binary tree, career ranks), PayTR payments, e-invoice and shipping integrations, scheduled jobs and GitHub Actions deployment.',
      },
      tech: ['ASP.NET Core 8', 'EF Core', 'PostgreSQL', 'Identity + JWT', 'AWS S3', 'PayTR', 'GitHub Actions'],
      links: [{ type: 'web', url: 'https://www.sayveraglobal.com' }],
      qr: { url: 'https://www.sayveraglobal.com', label: { tr: 'Siteyi aç', en: 'Open site' } },
      icon: sayveraIcon,
    },
    {
      name: 'NakliyeKoop',
      category: { tr: 'Lojistik', en: 'Logistics' },
      platforms: ['Web', 'Android'],
      description: {
        tr: 'Nakliye kooperatifleri için araç ve şoför sıra yönetimi, sefer takibi ve yük panosu. Yöneticiler sırayı ve seferleri yönetir; şoförler sıralarını mobil uygulamadan anlık takip eder.',
        en: 'Queue and dispatch system for freight cooperatives: vehicle and driver queues, trip tracking and a freight board. Admins run the queue and trips; drivers follow their place in line live from the mobile app.',
      },
      role: {
        tr: 'Flutter mobil uygulama; NestJS backend’in büyük kısmı (JWT, rol bazlı yetki, Socket.IO ile anlık güncellemeler, FCM bildirimleri) ve AWS üzerinde CI/CD ile dağıtım.',
        en: 'The Flutter mobile app; most of the NestJS backend (JWT, role-based access, real-time updates over Socket.IO, FCM push) and CI/CD deployment on AWS.',
      },
      tech: ['Flutter', 'NestJS', 'PostgreSQL', 'Socket.IO', 'Firebase (FCM)', 'Docker', 'AWS Lightsail', 'GitHub Actions'],
      links: [
        { type: 'web', url: 'https://www.nakliyekoop.com' },
        { type: 'google-play', url: 'https://play.google.com/store/apps/details?id=com.nakliyekoop.app' },
      ],
      qr: {
        url: 'https://play.google.com/store/apps/details?id=com.nakliyekoop.app',
        label: { tr: 'Android uygulaması', en: 'Android app' },
      },
      icon: nakliyekoopIcon,
    },
  ],

  // İlk grup geniş kart olarak en üstte görünür. core: true olanlar "ana odak" olarak vurgulanır.
  skills: [
    {
      name: 'Backend',
      items: [
        { label: 'ASP.NET Core 8', icon: 'dotnet', core: true },
        { label: '.NET 8', icon: 'dotnet', core: true },
        { label: 'Entity Framework Core', icon: 'dotnet', core: true },
        { label: 'SignalR', icon: 'dotnet' },
        { label: 'NestJS', icon: 'nestjs' },
        { label: 'Node.js', icon: 'nodedotjs' },
        { label: 'Prisma', icon: 'prisma' },
        { label: 'Socket.IO', icon: 'socketdotio' },
        'Web API',
        'REST',
        'LINQ',
      ],
    },
    {
      name: { tr: 'Diller', en: 'Languages' },
      items: [
        { label: 'C#', icon: 'dotnet', core: true },
        { label: 'TypeScript', icon: 'typescript', core: true },
        { label: 'JavaScript', icon: 'javascript' },
        { label: 'Python', icon: 'python' },
        { label: 'Dart', icon: 'dart' },
        'SQL',
      ],
    },
    {
      name: { tr: 'Veritabanı', en: 'Databases' },
      items: [
        { label: 'PostgreSQL', icon: 'postgresql', core: true },
        { tr: 'İlişkisel veri modelleme', en: 'Relational data modeling' },
        { tr: 'Sorgu optimizasyonu', en: 'Query optimization' },
        { tr: 'Migration yönetimi', en: 'Migration management' },
      ],
    },
    {
      name: 'Frontend',
      items: [
        { label: 'Next.js 15/16', icon: 'nextdotjs', core: true },
        { label: 'React', icon: 'react' },
        { label: 'TypeScript', icon: 'typescript' },
        { label: 'TanStack Query', icon: 'reactquery' },
        { label: 'Tailwind CSS', icon: 'tailwindcss' },
        { label: 'Astro', icon: 'astro' },
        { label: 'HTML', icon: 'html5' },
        { label: 'CSS', icon: 'css' },
      ],
    },
    {
      name: { tr: 'Mobil', en: 'Mobile' },
      items: [
        { label: 'React Native', icon: 'react', core: true },
        { label: 'Expo', icon: 'expo' },
        { label: 'Flutter', icon: 'flutter' },
      ],
    },
    {
      name: { tr: 'Yapay Zekâ', en: 'AI' },
      items: [
        { label: 'Claude API', icon: 'claude' },
        { label: 'Zod', icon: 'zod' },
        { tr: 'LLM ile yapılandırılmış veri çıkarımı', en: 'Structured data extraction with LLMs' },
        { tr: 'Prompt injection’a karşı tasarım', en: 'Prompt-injection-resistant design' },
        { tr: 'Model maliyeti takibi', en: 'Model cost tracking' },
      ],
    },
    {
      name: { tr: 'Kimlik ve Güvenlik', en: 'Identity & Security' },
      items: [
        { label: 'JWT', icon: 'jsonwebtokens' },
        { label: 'ASP.NET Core Identity', icon: 'dotnet' },
        'OAuth 2.0',
        'Cookie Authentication',
        { tr: 'Refresh token rotasyonu', en: 'Refresh token rotation' },
        { tr: 'Rol ve izin tabanlı yetkilendirme', en: 'Role- and permission-based authorization' },
        { tr: 'Çok kiracılı (multi-tenant) mimari', en: 'Multi-tenant architecture' },
        { tr: 'AES-GCM ile token şifreleme', en: 'AES-GCM token encryption' },
        { tr: 'CSP ve güvenlik başlıkları', en: 'CSP and security headers' },
      ],
    },
    {
      name: { tr: 'Entegrasyonlar', en: 'Integrations' },
      items: [
        { label: 'Gmail API', icon: 'gmail' },
        { label: 'Google Calendar API', icon: 'googlecalendar' },
        'Microsoft Graph',
        { label: 'Firebase Cloud Messaging', icon: 'firebase' },
        'APNs',
        'Web Push',
        'PayTR',
        { tr: 'E-fatura', en: 'E-invoicing' },
        { tr: 'SMTP entegrasyonları', en: 'SMTP integrations' },
      ],
    },
    {
      name: { tr: 'Bulut ve DevOps', en: 'Cloud & DevOps' },
      items: [
        { label: 'Docker', icon: 'docker' },
        { label: 'Nginx', icon: 'nginx' },
        { label: 'Ubuntu Server', icon: 'ubuntu' },
        { label: 'GitHub Actions (CI/CD)', icon: 'githubactions' },
        { label: 'Vercel', icon: 'vercel' },
        'AWS EC2',
        'AWS S3',
        'AWS Lightsail',
        { tr: 'SSL ve alan adı yönetimi', en: 'SSL and domain management' },
      ],
    },
    {
      name: { tr: 'Araçlar', en: 'Tools' },
      items: [
        { label: 'Git', icon: 'git' },
        { label: 'GitHub', icon: 'github' },
        { label: 'pnpm', icon: 'pnpm' },
        { label: 'Vitest', icon: 'vitest' },
        { label: 'Swagger/OpenAPI', icon: 'swagger' },
        { label: 'Postman', icon: 'postman' },
        { label: 'Rider', icon: 'rider' },
        'Visual Studio',
        'VS Code',
      ],
    },
    {
      name: { tr: 'Diğer', en: 'Other' },
      items: [
        { tr: 'QuestPDF (PDF üretimi)', en: 'QuestPDF (PDF generation)' },
        { tr: 'NCalc (formül motoru)', en: 'NCalc (formula engine)' },
        { label: { tr: 'Python ile veri işleme', en: 'Python for data processing' }, icon: 'python' },
        { label: { tr: 'Bluetooth Low Energy entegrasyonu', en: 'Bluetooth Low Energy integration' }, icon: 'bluetooth' },
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

/** Yetenek listesindeki düz metni { label } biçimine getirir */
export function toSkillItem(item: Localized | SkillItem): SkillItem {
  return typeof item === 'object' && item !== null && 'label' in item ? item : { label: item };
}

/** Localized bir değerin istenen dildeki karşılığını döndürür. */
export function t<T>(value: Localized<T>, lang: Lang): T {
  if (typeof value === 'object' && value !== null && !Array.isArray(value) && 'tr' in value && 'en' in value) {
    return (value as { tr: T; en: T })[lang];
  }
  return value as T;
}

/** 'https://www.linkedin.com/in/ye%C5%9F/' → 'linkedin.com/in/yeş' (ekranda ve baskıda gösterilecek hâl) */
export function displayUrl(url: string): string {
  return decodeURI(url)
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/\/$/, '');
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
