
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import SvgIcon from './components/SvgIcon.vue'
import 'virtual:svg-icons-register'
import './assets/styles/main.css'

const app = createApp(App)

// 注册全局组件
app.component('SvgIcon', SvgIcon)

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
	console.error(err, instance, info)
}

app.mount('#app')
