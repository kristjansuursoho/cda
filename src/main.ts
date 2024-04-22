import './assets/poppins.css'
import './assets/styles.css'

// @ts-ignore
import PrimeOne from 'primevue/themes/primeone'
import PrimeVueUnstyled from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { CustomTheme } from './presets/custom'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.directive('tooltip', Tooltip)
app.use(createPinia())
app.use(router)

app.use(PrimeVueUnstyled, {
  theme: {
    base: PrimeOne,
    preset: CustomTheme,
    options: {
      prefix: 'p',
      darkModeSelector: 'dark-mode',
      cssLayer: false,
    },
  },
  pt: {
    button: {
      root: {
        class: 'items-center flex gap-2',
      },
      label: 'text-base', // OR { class: 'text-white font-bold text-xl' }
      icon: 'text-white text-base',
    },
  },
})

app.mount('#cd-digi-adapter')
