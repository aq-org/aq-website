import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
          href: getPermalink('/index'),
    },{
      title: 'Resources',
      links: [
        { text: 'Docs', href: getPermalink('/docs') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Download', href: 'https://github.com/aq-org/AQ' },
        { text: 'Partners', href: getPermalink('/partners') },
        { text: 'License', href: 'https://github.com/aq-org/AQ/blob/main/LICENSE' },
        { text: 'Sources Code', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: 'About',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Team', href: getPermalink('/team') },
        { text: 'Careers', href: 'https://github.com/aq-org/AQ' },
        { text: 'Contact Us', href: getPermalink('/contact') },
        { text: 'X', href: 'https://x.com/aq_organization' },
        { text: 'Github', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Community Forum', href: getPermalink('/community') },
        { text: 'FAQ', href: 'https://www.axa6.com/#faq' },
        { text: 'Docs', href: getPermalink('/docs') },
        { text: 'Discord', href: 'https://discord.gg/JCKzxavG' },
        { text: 'Mail', href: 'mailto:admin@axa6.com' },
      ],
    },
    {
      title: 'Blog',
      links: [
        {
          text: 'Blog List',
          href: getBlogPermalink(),
        },
        {
          text: 'Article',
          href: getPermalink('post'),
        },
        {
          text: 'Category Page',
          href: getPermalink('category'),
        },
        {
          text: 'Tag Page',
          href: getPermalink('tag'),
        },
      ],
    },
    {
      text: 'Download',
      href: 'https://github.com/aq-org/AQ',
        
    },
  ],
  actions: [{ text: 'Download', href: 'https://github.com/aq-org/AQ', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Resources',
      links: [
        { text: 'Docs', href: getPermalink('/docs') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Download', href: 'https://github.com/aq-org/AQ' },
        { text: 'Partners', href: getPermalink('/partners') },
        { text: 'License', href: 'https://github.com/aq-org/AQ/blob/main/LICENSE' },
        { text: 'Sources Code', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: 'About',
      links: [
        { text: 'About', href: getPermalink('/about') },
        { text: 'Team', href: getPermalink('/team') },
        { text: 'Careers', href: 'https://github.com/aq-org/AQ' },
        { text: 'Contact Us', href: getPermalink('/contact') },
        { text: 'X', href: 'https://x.com/aq_organization' },
        { text: 'Github', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Community Forum', href: getPermalink('/community') },
        { text: 'FAQ', href: 'https://www.axa6.com/#faq' },
        { text: 'Docs', href: getPermalink('/docs') },
        { text: 'Discord', href: 'https://discord.gg/JCKzxavG' },
        { text: 'Mail', href: 'mailto:admin@axa6.com' },
      ],
    },
    {
      title: 'Blog',
      links: [
        {
          text: 'Blog List',
          href: getBlogPermalink(),
        },
        {
          text: 'Article',
          href: getPermalink('post'),
        },
        {
          text: 'Category Page',
          href: getPermalink('category'),
        },
        {
          text: 'Tag Page',
          href: getPermalink('tag'),
        },
      ],
    },
    
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/aq_organization' },
    { ariaLabel: 'Mail', icon: 'tabler:mail', href: 'mailto:admin@axa6.com' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/aq-org/AQ' },
  ],
  footNote: `
    <img class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm" src="./aq.png" alt="AQ logo" loading="lazy"></img>
    Copyright 2024 <a class="text-blue-600 underline dark:text-muted" href="https://www.axa6.com/">AQ ORG</a>, All rights reserved.
  `,
};
