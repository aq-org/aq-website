import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
          href: getPermalink('/index'),
    },{
      text: 'Resources',
      href: getPermalink('/about'),
    },{
      text: 'About',
      href: getPermalink('/about'),
    },{
      text: 'Support',
      href: getPermalink('/about'),
    },
    {
      text: 'Blog',
      links: [
        {
          text: 'Blog List',
          href: getBlogPermalink(),
        },
        {
          text: 'Article',
          href: getPermalink('get-started-website-with-astro-tailwind-css', 'post'),
        },
        {
          text: 'Category Page',
          href: getPermalink('tutorials', 'category'),
        },
        {
          text: 'Tag Page',
          href: getPermalink('astro', 'tag'),
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
        { text: 'Docs', href: 'https://example.com/documentation' },
        { text: 'Blog', href: 'https://example.com/api-reference' },
        { text: 'Download', href: 'https://example.com/code-samples' },
        { text: 'Partners', href: 'https://example.com/code-samples' },
        { text: 'License', href: 'https://example.com/code-samples' },
        { text: 'Sources Code', href: 'https://example.com/tutorials' },
      ],
    },
    {
      title: 'About',
      links: [
        { text: 'Team', href: 'https://example.com/team' },
        { text: 'Careers', href: 'https://example.com/careers' },
        { text: 'Contact Us', href: 'https://example.com/contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Help Center', href: 'https://example.com/help-center' },
        { text: 'Community Forum', href: 'https://example.com/community-forum' },
        { text: 'FAQ', href: 'https://example.com/faq' },
        { text: 'Live Chat', href: 'https://example.com/live-chat' },
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
          href: getPermalink('get-started-website-with-astro-tailwind-css', 'post'),
        },
        {
          text: 'Category Page',
          href: getPermalink('tutorials', 'category'),
        },
        {
          text: 'Tag Page',
          href: getPermalink('astro', 'tag'),
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
