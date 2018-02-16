import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Register from '@/components/Register'
import Notes from '@/components/Notes'
import Note from '@/components/Note'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      meta: {
        requiresAuth: false
      },
      component: Welcome
    },
    {
      path: '/register',
      name: 'Register',
      meta: {
        requiresAuth: false
      },
      component: Register
    },
    {
      path: '/notes',
      name: 'Notes',
      meta: {
        requiresAuth: true
      },
      component: Notes
    },
    {
      path: '/notes/:id',
      name: 'Note',
      meta: {
        requiresAuth: true
      },
      component: Note
    }
  ],
  mode: 'history'
})
