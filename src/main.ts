import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@govbr-ds/core/dist/core.min.css'
import 'leaflet/dist/leaflet.css'
import '@rural-environmental-registry/map_component/dist/index.css'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
