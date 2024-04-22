// @ts-ignore // Why is this happening?
import Aura from 'primevue/themes/primeone/aura'
// @ts-ignore // Why is this happening?
import { definePreset } from 'primevue/themes'

export const CustomTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}',
        },
        primary: {
          color: '{zinc.950}',
          inverseColor: '#ffffff',
          hoverColor: '{zinc.800}',
          activeColor: '{zinc.900}',
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
        maskBackground: 'rgba(0,0,0,0.4)',
        formField: {
          background: '{zinc.0}',
          disabledBackground: '{zinc.100}',
          filledBackground: '{zinc.50}',
          filledFocusBackground: '{zinc.0}',
          borderColor: '{zinc.300}',
          hoverBorderColor: '{zinc.400}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '{red.400}',
          color: '{zinc.700}',
          disabledColor: '{zinc.500}',
          placeholderColor: '{zinc.500}',
          floatLabelColor: '{zinc.500}',
          floatLabelFocusColor: '{zinc.500}',
          floatLabelInvalidColor: '{red.400}',
          boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)',
        },
      },
    },
  },
  components: {},
})
