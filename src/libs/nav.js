export const menuUser = [
    {
        txt: '个人中心',
        icon: 'el-icon-c-scale-to-original',
        subs: [
            {path: '/requisition-my', txt: 'Manage User', name: 'requisitionMy'},
        ]
    },
]
export const menuAdmin = [

    {
        txt: 'CMDB',
        icon: 'el-icon-c-scale-to-original',
        subs: [
            {path: '/asset', txt: '资产列表', name: 'asset'},
            {path: '/manage-account', txt: '管理账号', name: 'manageAccount'},
            {path: '/script-exec', txt: '命令执行', name: 'script-exec'},

        ]
    },
    {
        txt: '用户',
        icon: 'el-icon-user',
        subs: [
            {path: '/user', txt: '用户管理', name: 'user'},
            {path: '/asset-user', txt: '资产授权', name: '资产用户'},

        ]
    },
    {
        txt: '审计',
        icon: 'el-icon-video-camera',
        subs: [
            {path: '/terminal-log', txt: '命令日志', name: '日志审计'},
            {path: '/video-log', txt: '录像日志', name: '录像审计'},//todo:: 录像审计

        ]
    },

]
