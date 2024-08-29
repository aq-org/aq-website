import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Главная',
          href: getPermalink('/index'),
    },{
      text: 'Ресурсы',
      links: [
        { text: 'Документы', href: 'https://docs.axa6.com' },
        { text: 'Блог', href: getBlogPermalink() },
        { text: 'Скачать', href: 'https://github.com/aq-org/AQ' },
        { text: 'Партнеры', href: getPermalink('/partners') },
        { text: 'Лицензия', href: 'https://github.com/aq-org/AQ/blob/main/LICENSE' },
        { text: 'Исходный Код', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      text: 'О Нас',
      links: [
        { text: 'О Нас', href: getPermalink('/about') },
        { text: 'Команда', href: getPermalink('/team') },
        { text: 'Карьера', href: 'https://github.com/aq-org/AQ' },
        { text: 'Свяжитесь с Нами', href: getPermalink('/contact') },
        { text: 'X', href: 'https://x.com/aq_organization' },
        { text: 'Facebook', href: 'https://www.facebook.com/aq.organization' },
        { text: 'Github', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      text: 'Поддержка',
      links: [
        { text: 'Форум Сообщества', href: getPermalink('/community') },
        { text: 'Часто Задаваемые Вопросы', href: 'https://github.com/aq-org/AQ/issues' },
        { text: 'Документы', href: 'https://docs.axa6.com' },
        { text: 'Discord', href: 'https://discord.gg/JCKzxavG' },
        { text: 'Почта', href: 'mailto:admin@axa6.com' },
      ],
    },
    {
      text: 'Блог',
      links: [
        {
          text: 'Все Статьи',
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
      text: 'Скачать',
      href: 'https://github.com/aq-org/AQ',
        
    },
  ],
  actions: [{ text: 'Скачать', href: 'https://github.com/aq-org/AQ', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Ресурсы',
      links: [
        { text: 'Документы', href: 'https://docs.axa6.com' },
        { text: 'Блог', href: getBlogPermalink() },
        { text: 'Скачать', href: 'https://github.com/aq-org/AQ' },
        { text: 'Партнеры', href: getPermalink('/partners') },
        { text: 'Лицензия', href: 'https://github.com/aq-org/AQ/blob/main/LICENSE' },
        { text: 'Исходный Код', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: 'О Нас',
      links: [
        { text: 'О Нас', href: getPermalink('/about') },
        { text: 'Команда', href: getPermalink('/team') },
        { text: 'Карьера', href: 'https://github.com/aq-org/AQ' },
        { text: 'Свяжитесь с Нами', href: getPermalink('/contact') },
        { text: 'X', href: 'https://x.com/aq_organization' },
        { text: 'Facebook', href: 'https://www.facebook.com/aq.organization' },
        { text: 'Github', href: 'https://github.com/aq-org/AQ' },
      ],
    },
    {
      title: 'Поддержка',
      links: [
        { text: 'Форум Сообщества', href: getPermalink('/community') },
        { text: 'Часто Задаваемые Вопросы', href: 'https://github.com/aq-org/AQ/issues' },
        { text: 'Документы', href: 'https://docs.axa6.com' },
        { text: 'Discord', href: 'https://discord.gg/JCKzxavG' },
        { text: 'Почта', href: 'mailto:admin@axa6.com' },
      ],
    },
    {
      title: 'Блог',
      links: [
        {
          text: 'Все Статьи',
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
    { text: 'Условия', href: getPermalink('/terms') },
    { text: 'Политика Конфиденциальности', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: 'https://x.com/aq_organization' },
    { ariaLabel: 'Почта', icon: 'tabler:mail', href: 'mailto:admin@axa6.com' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/aq-org/AQ' },
  ],
  footNote: `
    <img class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm" src="https://www.axa6.com/aq.png" alt="Логотип AQ" loading="lazy"></img>
    Авторские права 2024 <a class="text-blue-600 underline dark:text-muted" href="https://www.axa6.com/">AQ ORG</a>, Все права защищены.
  `,
};