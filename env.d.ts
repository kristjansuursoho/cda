/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DIGI_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
