import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const vueRouter = new Router({
    $breadCrumbs: ['main'],
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
                title: "Home"
            },

            component: () => import("@/components/Main"),
            //redirect: {name: 'sshList'},
            children: [
                {
                    path: "sftp/:ID/:name/:user",
                    name: "sftp",
                    props: true,
                    meta: {
                        breads: [{name: 'main', title: 'Home'}, {name: 'ssh', title: 'Ssh'}, {
                            name: 'sftp',
                            title: 'Sftp'
                        }],
                        title: "Sftp"
                    },
                    component: () => import("@/components/ViewSftp")
                },
                {
                    path: "ssh",
                    name: "ssh",
                    meta: {
                        breads: [{name: 'main', title: 'Home'}, {name: 'ssh', title: 'Ssh/Sftp'}],
                        title: "Ssh/Sftp"
                    },
                    component: () => import("@/components/ViewSsh")
                },
                {
                    path: "ssh-log",
                    name: "sshLog",
                    meta: {
                        breads: [{name: 'main', title: 'Home'}, {name: 'sshLog', title: 'sshLog'}],
                        title: "sshLog"
                    },
                    component: () => import("@/components/ViewSshLog")
                },
                {
                    path: "user",
                    name: "user",
                    meta: {
                        breads: [{name: 'main', title: 'Home'}, {name: 'user', title: 'User'}],
                        title: "Users"
                    },
                    component: () => import("@/components/ViewUser")
                },
                {
                    path: "ginbro",
                    name: "ginbro",
                    meta: {
                        breads: [{name: 'main', title: 'Home'}, {name: 'ginbro', title: 'Ginbro'}],
                        title: "Ginbro"
                    },
                    component: () => import("@/components/ViewGinbro")
                },
                {
                    path: "wslog-msg",
                    name: "wslogMsg",
                    meta: {
                        breads: [{name: 'main', title: 'Home'}, {name: 'ViewWslogMsgHi', title: 'ViewWslogMsgHi'}],
                        title: "wslog msg history"
                    },
                    component: () => import("@/components/ViewWslogMsg")
                },
                {
                    path: "wslog/hook",
                    name: "wslogHook",
                    meta: {
                        breads: [{name: 'main', title: 'Home'}, {name: 'slog', title: 'slog'}],
                        title: "wslog hook"
                    },
                    component: () => import("@/components/ViewWslogHook")
                }
            ]
        }
    ]
});

vueRouter.beforeEach((to, from, next) => {
    window.location.pa;
    next()
});




export default vueRouter;
