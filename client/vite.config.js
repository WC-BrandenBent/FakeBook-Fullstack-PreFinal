import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.REACT_APP_FLASK_API_ENDPOINT': JSON.stringify(env.REACT_APP_FLASK_API_ENDPOINT)
    },
    plugins: [react()],
  }
})


// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '');
//   return {
//     define: {
//       'process.env': env
//     },
//     plugins: [react()],
//   }
// })