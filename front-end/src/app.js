import Vue from "vue/dist/vue.esm.js";
import App from "./App.vue";
import VueRouter from "vue-router";
import VModal from "vue-js-modal";

Vue.use(VueRouter);
Vue.use(VModal,  { dynamicDefault: { draggable: true, resizable: true } });

new Vue({
    el: "#vue-app",
    render: h => h(App)
})
