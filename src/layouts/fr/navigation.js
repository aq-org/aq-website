import { getPermalink, getBlogPermalink, getAsset } from '../../utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Accueil',
          href: getPermalink('/index'),
    },{
      text: 'Ressources',
      links: [
        { text: 'Docs', href: getPermalink('/docs') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Télécharger', href: 'https://github.com/aq-org/AQ' },
        { text: 'Partenaires', href: getPermalink('/partners') },
        { text: 'Licence', href: 'https://github.com/aq-org/AQ/blob/main/LICENSE' },
        { text: 'Code Source', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      text: 'À Propos',
      links: [
        { text: 'À Propos', href: getPermalink('/about') },
        { text: 'Équipe', href: getPermalink('/team') },
        { text: 'Carrières', href: 'https://github.com/aq-org/AQ' },
        { text: 'Nous Contacter', href: getPermalink('/contact') },
        { text: 'X', href: 'https://x.com/aq_organization' },
        { text: 'Github', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      text: 'Support',
      links: [
        { text: 'Forum Communautaire', href: getPermalink('/community') },
        { text: 'FAQ', href: 'https://github.com/aq-org/AQ/issues' },
        { text: 'Docs', href: getPermalink('/docs') },
        { text: 'Discord', href: 'https://discord.gg/JCKzxavG' },
        { text: 'Mail', href: 'mailto:admin@axa6.com' },
      ],
    },
    {
      text: 'Blog',
      links: [
        {
          text: 'Tous les Articles',
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
      text: 'Télécharger',
      href: 'https://github.com/aq-org/AQ',
        
    },
  ],
  actions: [{ text: 'Télécharger', href: 'https://github.com/aq-org/AQ', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Ressources',
      links: [
        { text: 'Docs', href: getPermalink('/docs') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Télécharger', href: 'https://github.com/aq-org/AQ' },
        { text: 'Partenaires', href: getPermalink('/partners') },
        { text: 'Licence', href: 'https://github.com/aq-org/AQ/blob/main/LICENSE' },
        { text: 'Code Source', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: 'À Propos',
      links: [
        { text: 'À Propos', href: getPermalink('/about') },
        { text: 'Équipe', href: getPermalink('/team') },
        { text: 'Carrières', href: 'https://github.com/aq-org/AQ' },
        { text: 'Nous Contacter', href: getPermalink('/contact') },
        { text: 'X', href: 'https://x.com/aq_organization' },
        { text: 'Github', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Forum Communautaire', href: getPermalink('/community') },
        { text: 'FAQ', href: 'https://github.com/aq-org/AQ/issues' },
        { text: 'Docs', href: getPermalink('/docs') },
        { text: 'Discord', href: 'https://discord.gg/JCKzxavG' },
        { text: 'Mail', href: 'mailto:admin@axa6.com' },
      ],
    },
    {
      title: 'Blog',
      links: [
        {
          text: 'Tous les Articles',
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
    { text: 'Termes', href: getPermalink('/terms') },
    { text: 'Politique de Confidentialité', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/aq_organization' },
    { ariaLabel: 'Mail', icon: 'tabler:mail', href: 'mailto:admin@axa6.com' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/aq-org/AQ' },
  ],
  footNote: `
    <img class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm" src="./aq.png" alt="Logo de AQ" loading="lazy"></img>
    Droits d'auteur 2024 <a class="text-blue-600 underline dark:text-muted" href="https://www.axa6.com/">AQ ORG</a>, Tous droits réservés.
  `,
};