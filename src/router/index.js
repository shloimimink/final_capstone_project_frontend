import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Register from "../components/auth/Register.vue";
import Login from "../components/auth/Login.vue";
import Logout from "../components/auth/Logout.vue";
import Airlines from "../components/ProfileFavorites/Airlines.vue";
import EditUser from "../components/users/EditUser.vue";
import AllUsers from "../components/users/AllUsers.vue";
import UserProfileShow from "../components/ProfileFavorites/UserProfileShow.vue";
import AirplaneUser from "../components/users/AirplaneUser.vue";
import ShowPosts from "../components/ProfileFavorites/ShowPosts.vue";
import UserAirplaneShow from "../components/ProfileFavorites/UserAirplaneShow.vue";


Vue.use(VueRouter);

const routes = [
    {path: '/', name: 'home', component: Home},
    {path: "/register", name: "/register", component: Register},
    {path: '/about', name: 'about', component: () => import( '../components/About.vue')},
    {path: "/login", name: "login", component: Login},
    {path: "/logout", name: "logout", component: Logout},
    {path: "/airlines", name: "airlines-index", component: Airlines},
    {path: "/users/:id/edit", name: "users-edit", component: EditUser},
    {path: "/users", name: "users-index", component: AllUsers},
    {path: "/users-profile/:id", name: "users-profile-show", component: UserProfileShow},
    {path: "/favorites/:id", name: "favorites-show", component: AirplaneUser},
    {path: "/posts/:id", name: "posts-show", component: ShowPosts},
    {path: "/users-airplane/:id", name: "users-airplane-show", component: UserAirplaneShow}
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
