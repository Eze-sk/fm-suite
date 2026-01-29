import type { SelectType } from '@components/ui/Select'

export const technologies: SelectType = {
  id: 'technologies',
  title: 'Technologies',
  option: [
    {
      id: 'vite',
      value: 'Vite (Recommended)',
      children: [
        { id: 'vite-react-ts', value: 'React + TypeScript' },
        { id: 'vite-react-js', value: 'React + JavaScript' },
        { id: 'vite-vue-ts', value: 'Vue + TypeScript' },
        { id: 'vite-vanilla-ts', value: 'Vanilla TypeScript' },
        { id: 'vite-vanilla-js', value: 'Vanilla JavaScript' },
      ],
    },
    {
      id: 'nextjs',
      value: 'Next.js (App Router)',
      children: [
        { id: 'next-ts-tailwind', value: 'TypeScript + Tailwind CSS' },
        { id: 'next-ts-css-modules', value: 'TypeScript + CSS Modules' },
      ],
    },
    {
      id: 'astro',
      value: 'Astro',
      children: [
        { id: 'astro-minimal', value: 'Minimal (No framework)' },
        { id: 'astro-react', value: 'Astro + React' },
      ],
    },
    {
      id: 'no-builder',
      value: 'No Framework / No Builder',
      children: [
        { id: 'pure-html-css-js', value: 'Pure HTML/CSS/JS (Cdn based)' },
      ],
    },
  ],
}
