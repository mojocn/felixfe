import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const vueRouter = new Router({
    mode: "hash",
    routes: [
        {
            path:"/login",
            name: "login",
            component: () => import("@/components/Login"),
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
                    component: () => import("@/components/Sftp")
                },
                {
                    path: "ssh/list",
                    name: "sshList",
                    meta: {
                        title: "ssh list"
                    },
                    component: () => import("@/components/SshList")
                },
                {
                    path: "ginbro/gen",
                    name: "ginbroGen",
                    meta: {
                        title: "ginbro-gen"
                    },
                    component: () => import("@/components/GinbroGen")
                }
            ]
        }
    ]
});

export default vueRouter;
