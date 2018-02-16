// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

/* eslint-disable no-new */
let main = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: {
    token: '',
    user_id: '',
    name: ''
  }
},
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (router.app.token === '' || typeof router.app.token === 'undefined') {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
}))
main.$on('update_token', function (value) {
  main.token = value
})
main.$on('logged_id', function (id, name) {
  main.user_id = id
  main.name = name
})
main.$on('logout', function () {
  this.axios.post('http://todo.test/logout')
    .then((response) => {
      router.push({
        name: 'Welcome'
      })
    }).catch(function (error) {
      alert(error.response.data)
    })
})
