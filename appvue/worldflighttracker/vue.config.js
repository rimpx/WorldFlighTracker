const { defineConfig } = require('@vue/cli-service')

// Rileva se siamo in Codespaces
const isCodespaces = process.env.CODESPACES === 'true' || 
                      process.env.GITHUB_CODESPACES === 'true' || 
                      process.env.CODESPACE_NAME || 
                      (process.env.HOSTNAME && process.env.HOSTNAME.includes('codespaces'));

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // Disabilita WebSocket in Codespaces ma mantienili in locale
    webSocketServer: isCodespaces ? false : 'ws',
    hot: !isCodespaces,
    liveReload: !isCodespaces,
    client: {
      // Disabilita gli overlay di errore WebSocket in Codespaces
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: !isCodespaces
      },
      webSocketURL: isCodespaces ? undefined : undefined
    },
    // Configura il proxy API per comunicare con il backend
    proxy: isCodespaces ? {
      '/api': {
        target: process.env.API_URL || 'http://localhost:3000',
        changeOrigin: true
      }
    } : undefined
  }
})