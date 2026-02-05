import type { StorybookConfig } from '@storybook/nextjs-vite'
import svgr from 'vite-plugin-svgr'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    config.plugins = config.plugins || []
    config.plugins.push(svgr({ svgrOptions: { exportType: 'default' } }))
    return config
  },
}
export default config
