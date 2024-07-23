import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Inicio',
      href: getPermalink('/index'),
    },{
      text: 'Recursos',
      links: [
        { text: 'Documentos', href: getPermalink('/docs') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Descargar', href: 'https://github.com/aq-org/AQ' },
        { text: 'Colaboradores', href: getPermalink('/partners') },
        { text: 'Licencia', href: 'https://github.com/aq-org/AQ/blob/main/LICENSE' },
        { text: 'Código Fuente', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      text: 'Acerca de',
      links: [
        { text: 'Acerca de', href: getPermalink('/about') },
        { text: 'Equipo', href: getPermalink('/team') },
        { text: 'Carreras', href: 'https://github.com/aq-org/AQ' },
        { text: 'Contáctenos', href: getPermalink('/contact') },
        { text: 'X', href: 'https://x.com/aq_organization' },
{ text: 'Facebook', href: 'https://www.facebook.com/aq.organization' },
        { text: 'Github', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      text: 'Soporte',
      links: [
        { text: 'Foro Comunitario', href: getPermalink('/community') },
        { text: 'Preguntas Frecuentes', href: 'https://github.com/aq-org/AQ/issues' },
        { text: 'Documentos', href: getPermalink('/docs') },
        { text: 'Discord', href: 'https://discord.gg/JCKzxavG' },
        { text: 'Correo', href: 'mailto:admin@axa6.com' },
      ],
    },
    {
      text: 'Blog',
      links: [
        {
          text: 'Todos los Artículos',
          href: getBlogPermalink(),
        },
        { text: 'X', href: 'https://x.com/aq_organization' },
{ text: 'Facebook', href: 'https://www.facebook.com/aq.organization' },
        {
          text: 'RSS',
          href: getAsset('/rss.xml'),
        },
      ],
    },
    {
      text: 'Descargar',
      href: 'https://github.com/aq-org/AQ',
        
    },
  ],
  actions: [{ text: 'Descargar', href: 'https://github.com/aq-org/AQ', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Recursos',
      links: [
        { text: 'Documentos', href: getPermalink('/docs') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Descargar', href: 'https://github.com/aq-org/AQ' },
        { text: 'Colaboradores', href: getPermalink('/partners') },
        { text: 'Licencia', href: 'https://github.com/aq-org/AQ/blob/main/LICENSE' },
        { text: 'Código Fuente', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: 'Acerca de',
      links: [
        { text: 'Acerca de', href: getPermalink('/about') },
        { text: 'Equipo', href: getPermalink('/team') },
        { text: 'Carreras', href: 'https://github.com/aq-org/AQ' },
        { text: 'Contáctenos', href: getPermalink('/contact') },
        { text: 'X', href: 'https://x.com/aq_organization' },
{ text: 'Facebook', href: 'https://www.facebook.com/aq.organization' },
        { text: 'Github', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: 'Soporte',
      links: [
        { text: 'Foro Comunitario', href: getPermalink('/community') },
        { text: 'Preguntas Frecuentes', href: 'https://github.com/aq-org/AQ/issues' },
        { text: 'Documentos', href: getPermalink('/docs') },
        { text: 'Discord', href: 'https://discord.gg/JCKzxavG' },
        { text: 'Correo', href: 'mailto:admin@axa6.com' },
      ],
    },
    {
      title: 'Blog',
      links: [
        {
          text: 'Todos los Artículos',
          href: getBlogPermalink(),
        },
        { text: 'X', href: 'https://x.com/aq_organization' },
{ text: 'Facebook', href: 'https://www.facebook.com/aq.organization' },
        {
          text: 'RSS',
          href: getAsset('/rss.xml'),
        },
      ],
    },
    
  ],
  secondaryLinks: [
    { text: 'Términos', href: getPermalink('/terms') },
    { text: 'Política de Privacidad', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/aq_organization' },
    { ariaLabel: 'Correo', icon: 'tabler:mail', href: 'mailto:admin@axa6.com' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/aq-org/AQ' },
  ],
  footNote: `
    <img class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm" src="./aq.png" alt="Logo de AQ" loading="lazy"></img>
    Derechos de autor 2024 <a class="text-blue-600 underline dark:text-muted" href="https://www.axa6.com/">AQ ORG</a>, Todos los derechos reservados.
  `,
};