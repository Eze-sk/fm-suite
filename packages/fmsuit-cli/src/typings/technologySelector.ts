type ViteStack = "vanilla" | "react" | "vue" | "svelte";
type OtherFrameworks = "nextjs" | "astro" | "empty";

type ViteTS = `vite-${ViteStack}-ts`;
type VanillaVite = `vite-${ViteStack}`

export type TechnologySelector = VanillaVite | ViteTS | OtherFrameworks;