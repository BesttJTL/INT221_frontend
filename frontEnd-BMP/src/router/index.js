import { createRouter, createWebHistory } from 'vue-router'
import AllAnView from '../views/AllAnView.vue'
import AnDetailView from '../views/AnDetailView.vue'
import AnAddView from '../views/AnAddView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import AnEdit from '../components/AnEdit.vue'
import AllUserView from '../views/AllUserView.vue'
import AnUserDetailView from '../views/AnUserDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/admin/announcement'
    },
    {
      path: '/admin/announcement',
      name: 'allAnnouncement',
      component: AllAnView
    },
    {
      path: '/admin/announcement/:id',
      name: 'detailAnnouncement',
      component: AnDetailView
    },
    {
      path: '/admin/announcement/add',
      name: 'addAnnouncement',
      component: AnAddView
    },
    {
      path: '/admin/announcement/:id/edit',
      name: 'editDetail',
      component: AnEdit
    },
    {
      path: '/announcement',
      name: 'announcement',
      component: AllUserView
    },
    {
      path: '/announcement/:id',
      name: 'userDetailAnnouncement',
      component: AnUserDetailView
    },
    {
      path: '/:catchNotMatchPath(.*)',
      name: 'NotFound',
      component: NotFoundView
    }
  ]
})

export default router
