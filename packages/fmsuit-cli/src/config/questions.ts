import type { PackageManagerType, TechnologySelector } from '@typings/technologySelector'

interface Select {
  id: string
  title: string
}

interface TecOptions {
  id: "vite" | TechnologySelector
  value: string
  children?: TecOptions[]
}

interface TechnologiesType extends Select {
  option: TecOptions[]
}

export const technologiesQuestions: TechnologiesType = {
  id: 'technologies',
  title: 'Technologies',
  option: [
    {
      id: 'vite',
      value: 'Vite (Recommended)',
      children: [
        { id: 'vite-react-ts', value: 'React + TypeScript' },
        { id: 'vite-react', value: 'React + JavaScript' },
        { id: 'vite-vue-ts', value: 'Vue + TypeScript' },
        { id: 'vite-vanilla-ts', value: 'Vanilla TypeScript' },
        { id: 'vite-vanilla', value: 'Vanilla JavaScript' },
      ],
    },
    {
      id: 'nextjs',
      value: 'Next.js (App Router)',
    },
    {
      id: 'astro',
      value: 'Astro',
    },
    {
      id: 'empty',
      value: 'No Framework / No Builder',
    },
  ],
}

interface PkgMgrQuestOptions {
  id: PackageManagerType
  value: string
  children?: TecOptions[]
}

interface PkgMgrQuestType extends Select {
  option: PkgMgrQuestOptions[]
}

export const packageManagerQuestion: PkgMgrQuestType = {
  id: "packageManager",
  title: "package manager",
  option: [
    {
      id: "pnpm",
      value: "pnpm",
    },
    {
      id: "bun",
      value: "bun",
    },
    {
      id: "npm",
      value: "npm",
    },
  ]
}