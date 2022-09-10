import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.globalProperties.$reortGaEvent = (action: string, category: string, label: string) => {
	const gtag = window.gtag || (() => {})
	gtag('event', action, {
		event_category: category,
		event_label: label || action,
	})
}

app.config.errorHandler = (err, instance, info) => {
  // 处理错误，例如：报告给一个服务
	console.error(err, instance, info)
}

app.mount('#app')
