import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 디버깅용: 우클릭 방지 일시 비활성화
document.addEventListener('contextmenu', (event) => {
  event.preventDefault()
})

createApp(App).mount('#app')
