const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    host: '0.0.0.0',         // Permette accessi esterni (non solo localhost)
    port: 8080,              // La porta che usi nel tuo Dockerfile
    disableHostCheck: true   // Disattiva il controllo dell'host (risolve "Invalid Host header")
  }
})