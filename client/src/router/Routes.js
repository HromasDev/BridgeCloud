import Admin from '../pages/Admin/Admin'
import Auth from '../pages/Auth/Auth'
import Drive from '../pages/Drive/Drive'
import Settings from '../pages/Settings/Settings'

export const publicRoutes = [{ path: '/auth', component: Auth }]

export const privateRoutes = [
	{ path: '/drive', component: Drive },
	{ path: '/settings', component: Settings },
]

export const adminRoutes = [{ path: '/admin', component: Admin }]
