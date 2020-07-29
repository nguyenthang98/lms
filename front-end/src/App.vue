<template>
    <div>
        <p>
            <router-link to="/home">Home</router-link>
        </p>

        <router-view></router-view>
    </div>
</template>

<script>
import TaskView from './components/TaskView.vue';
import ImportSubmission from './components/ImportSubmission.vue';
import HomeView from './components/HomeView.vue';
import VueRouter from 'vue-router';

export default {
    name: "App",
    router: new VueRouter({
        routes: [
            { path: '/task/:id/import', component: ImportSubmission },
            { path: '/task/:id', component: TaskView },
            { path: '/home', component: HomeView },
            { path: '/', redirect: '/home' }
        ]
    })
}
</script>

<style lang="css" scoped>
</style>

