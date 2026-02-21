type BaseVite = "vite" | "vanilla" | "react" | "vue" | "svelte";
type OtherFrameworks = "nextjs" | "astro" | "empty";

type ViteTS = `${BaseVite}-ts`;

export type TechnologySelector = BaseVite | ViteTS | OtherFrameworks;