import Admin from "../pages/Admin/Admin";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Drive from "../pages/Drive/Drive";
import Settings from "../pages/Settings/Settings";

export const publicRoutes = [
    { path: '/auth', component: Login },
    { path: '/register', component: Register },
]

export const privateRoutes = [
    { path: '/drive', component: Drive },
    { path: '/settings', component: Settings },
]

export const adminRoutes = [
    { path: '/admin', component: Admin }
]
