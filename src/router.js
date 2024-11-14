import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const vueRouter = new Router({
    $breadCrumbs: ['main'],
    mode: "history",
    routes: [



        {
            path: "/",
            name: "main",
            meta: {
                title: "Home"
            },

            component: () => import("./components/Main"),
            //redirect: {name: 'sshList'},
            children: [




                {
                    path: "user",
                    name: "user",
                    meta: {
                        breads: [{name: 'main', title: '首页'}, {name: 'user', title: '用户列表'}],
                        title: "用户"
                    },
                    component: () => import("./components/ListUser")
                },


            ]
        }
    ]
});


export default vueRouter;