import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: '主页',
          href: getPermalink('/index'),
    },{
      text: '资源',
      links: [
        { text: '文档', href: getPermalink('/docs') },
        { text: '博客', href: getBlogPermalink() },
        { text: '下载', href: 'https://github.com/aq-org/AQ' },
        { text: '合作伙伴', href: getPermalink('/partners') },
        { text: '许可证', href: 'https://github.com/aq-org/AQ/blob/main/LICENSE' },
        { text: '源代码', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      text: '关于',
      links: [
        { text: '关于', href: getPermalink('/about') },
        { text: '团队', href: getPermalink('/team') },
        { text: '职业', href: 'https://github.com/aq-org/AQ' },
        { text: '联系我们', href: getPermalink('/contact') },
        { text: 'X', href: 'https://x.com/aq_organization' },
        { text: 'Github', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      text: '支持',
      links: [
        { text: '社区论坛', href: getPermalink('/community') },
        { text: '常见问题', href: 'https://github.com/aq-org/AQ/issues' },
        { text: '文档', href: getPermalink('/docs') },
        { text: 'Discord', href: 'https://discord.gg/JCKzxavG' },
        { text: '邮件', href: 'mailto:admin@axa6.com' },
      ],
    },
    {
      text: '博客',
      links: [
        {
          text: '所有文章',
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
      text: '下载',
      href: 'https://github.com/aq-org/AQ',
        
    },
  ],
  actions: [{ text: '下载', href: 'https://github.com/aq-org/AQ', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: '资源',
      links: [
        { text: '文档', href: getPermalink('/docs') },
        { text: '博客', href: getBlogPermalink() },
        { text: '下载', href: 'https://github.com/aq-org/AQ' },
        { text: '合作伙伴', href: getPermalink('/partners') },
        { text: '许可证', href: 'https://github.com/aq-org/AQ/blob/main/LICENSE' },
        { text: '源代码', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: '关于',
      links: [
        { text: '关于', href: getPermalink('/about') },
        { text: '团队', href: getPermalink('/team') },
        { text: '职业', href: 'https://github.com/aq-org/AQ' },
        { text: '联系我们', href: getPermalink('/contact') },
        { text: 'X', href: 'https://x.com/aq_organization' },
        { text: 'Github', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: '支持',
      links: [
        { text: '社区论坛', href: getPermalink('/community') },
        { text: '常见问题', href: 'https://github.com/aq-org/AQ/issues' },
        { text: '文档', href: getPermalink('/docs') },
        { text: 'Discord', href: 'https://discord.gg/JCKzxavG' },
        { text: '邮件', href: 'mailto:admin@axa6.com' },
      ],
    },
    {
      title: '博客',
      links: [
        {
          text: '所有文章',
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
    { text: '条款', href: getPermalink('/terms') },
    { text: '隐私政策', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/aq_organization' },
    { ariaLabel: '邮件', icon: 'tabler:mail', href: 'mailto:admin@axa6.com' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/aq-org/AQ' },
  ],
  footNote: `
    <img class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm" src="https://www.axa6.com/aq.png" alt="AQ logo" loading="lazy"></img>
    版权所有 2024 <a class="text-blue-600 underline dark:text-muted" href="https://www.axa6.com/">AQ ORG</a>，保留所有权利。
  `,
};