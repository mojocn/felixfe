import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const vueRouter = new Router({
  mode: "hash",
  routes: [

  {
      path: "/",
      name: "main",
      meta: {
          title: "main"
      },
      component: () => import("@/components/Main"),
      children:[
          {
              path: "sftp/:id",
              name: "sftp",
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
              path: "ssh/console",
              name: "sshConsole",
              meta: {
                  title: "xtern"
              },
              component: () => import("@/components/SshConsole")
          },
      ]
  }
  ]
});

export default vueRouter;
