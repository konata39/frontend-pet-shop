import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { providePokemonStore } from './providers/PokemonProvider.vue'

const app = createApp(App)
providePokemonStore(app)
app.mount('#app')
