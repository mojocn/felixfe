import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const vueRouter = new Router({
    mode: "hash",
    routes: [
        {
            path:"/login",
            app_dir: "login",
            component: () => import("@/components/Login"),
        }
        ,
        {
            path: "/",
            app_dir: "main",
            meta: {
                title: "main"
            },
            component: () => import("@/components/Main"),
            redirect: {app_dir: 'sshList'},
            children: [
                {
                    path: "sftp/:ID/:app_dir/:user",
                    app_dir: "sftp",
                    props: true,
                    meta: {
                        title: "sftp awesome"
                    },
                    component: () => import("@/components/Sftp")
                },
                {
                    path: "ssh/list",
                    app_dir: "sshList",
                    meta: {
                        title: "ssh list"
                    },
                    component: () => import("@/components/SshList")
                },
                {
                    path: "ginbro/gen",
                    app_dir: "ginbroGen",
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
