import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const vueRouter = new Router({
    mode: "hash",
    routes: [
        {
            path: "/login",
            name: "login",
            component: () => import("@/components/ViewLogin"),
        }
        ,
        {
            path: "/",
            name: "main",
            meta: {
                title: "main"
            },

            component: () => import("@/components/Main"),
            //redirect: {name: 'sshList'},
            children: [
                {
                    path: "sftp/:ID/:name/:user",
                    name: "sftp",
                    props: true,
                    meta: {
                        title: "sftp awesome"
                    },
                    component: () => import("@/components/ViewSftp")
                },
                {
                    path: "ssh",
                    name: "ssh",
                    meta: {
                        title: "ssh list"
                    },
                    component: () => import("@/components/ViewSsh")
                },
                {
                    path: "term-log",
                    name: "termLog",
                    meta: {
                        title: "term-log"
                    },
                    component: () => import("@/components/ViewTermLog")
                },
                {
                    path: "user",
                    name: "user",
                    meta: {
                        title: "user"
                    },
                    component: () => import("@/components/ViewUser")
                },
                {
                    path: "ginbro",
                    name: "ginbro",
                    meta: {
                        title: "ginbro-gen"
                    },
                    component: () => import("@/components/ViewGinbro")
                }
            ]
        }
    ]
});

export default vueRouter;
