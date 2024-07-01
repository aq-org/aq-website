import { getPermalink, getBlogPermalink, getAsset } from '../../utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'الصفحة الرئيسية',
      href: getPermalink('/index'),
    },{
      text: 'الموارد',
      links: [
        { text: 'المستندات', href: getPermalink('/docs') },
        { text: 'المدونة', href: getBlogPermalink() },
        { text: 'تحميل', href: 'https://github.com/aq-org/AQ' },
        { text: 'الشركاء', href: getPermalink('/partners') },
        { text: 'رخصة', href: 'https://github.com/aq-org/AQ/blob/main/LICENSE' },
        { text: 'شفرات المصدر', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      text: 'حول',
      links: [
        { text: 'حول', href: getPermalink('/about') },
        { text: 'الفريق', href: getPermalink('/team') },
        { text: 'وظائف', href: 'https://github.com/aq-org/AQ' },
        { text: 'اتصل بنا', href: getPermalink('/contact') },
        { text: 'X', href: 'https://x.com/aq_organization' },
        { text: 'جيت هاب', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      text: 'الدعم',
      links: [
        { text: 'منتدى المجتمع', href: getPermalink('/community') },
        { text: 'الأسئلة الشائعة', href: 'https://github.com/aq-org/AQ/issues' },
        { text: 'المستندات', href: getPermalink('/docs') },
        { text: 'ديسكورد', href: 'https://discord.gg/JCKzxavG' },
        { text: 'البريد', href: 'mailto:admin@axa6.com' },
      ],
    },
    {
      text: 'المدونة',
      links: [
        {
          text: 'جميع المقالات',
          href: getBlogPermalink(),
        },
        { text: 'X', href: 'https://x.com/aq_organization' },
        {
          text: 'RSS',
          href: getAsset('/rss.xml'),
        },
      ],
    },
    {
      text: 'تحميل',
      href: 'https://github.com/aq-org/AQ',
        
    },
  ],
  actions: [{ text: 'تحميل', href: 'https://github.com/aq-org/AQ', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'الموارد',
      links: [
        { text: 'المستندات', href: getPermalink('/docs') },
        { text: 'المدونة', href: getBlogPermalink() },
        { text: 'تحميل', href: 'https://github.com/aq-org/AQ' },
        { text: 'الشركاء', href: getPermalink('/partners') },
        { text: 'رخصة', href: 'https://github.com/aq-org/AQ/blob/main/LICENSE' },
        { text: 'شفرات المصدر', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: 'حول',
      links: [
        { text: 'حول', href: getPermalink('/about') },
        { text: 'الفريق', href: getPermalink('/team') },
        { text: 'وظائف', href: 'https://github.com/aq-org/AQ' },
        { text: 'اتصل بنا', href: getPermalink('/contact') },
        { text: 'X', href: 'https://x.com/aq_organization' },
        { text: 'جيت هاب', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: 'الدعم',
      links: [
        { text: 'منتدى المجتمع', href: getPermalink('/community') },
        { text: 'الأسئلة الشائعة', href: 'https://github.com/aq-org/AQ/issues' },
        { text: 'المستندات', href: getPermalink('/docs') },
        { text: 'ديسكورد', href: 'https://discord.gg/JCKzxavG' },
        { text: 'البريد', href: 'mailto:admin@axa6.com' },
      ],
    },
    {
      title: 'المدونة',
      links: [
        {
          text: 'جميع المقالات',
          href: getBlogPermalink(),
        },
        { text: 'X', href: 'https://x.com/aq_organization' },
        {
          text: 'RSS',
          href: getAsset('/rss.xml'),
        },
      ],
    },
    
  ],
  secondaryLinks: [
    { text: 'البنود', href: getPermalink('/terms') },
    { text: 'سياسة الخصوصية', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/aq_organization' },
    { ariaLabel: 'البريد', icon: 'tabler:mail', href: 'mailto:admin@axa6.com' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'جيت هاب', icon: 'tabler:brand-github', href: 'https://github.com/aq-org/AQ' },
  ],
  footNote: `
    <img class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm" src="https://www.axa6.com/aq.png" alt="شعار AQ" loading="lazy"></img>
    حقوق النشر 2024 <a class="text-blue-600 underline dark:text-muted" href="https://www.axa6.com/">AQ ORG</a>، جميع الحقوق محفوظة.
  `,
};