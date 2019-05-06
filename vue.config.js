module.exports = {
    devServer: {
        //proxy:'http://localhost:2222'
        proxy: {
            '/ws': {
                target: 'ws://localhost:2222',
                ws: true,
                changeOrigin: true
            },
            '/api': {
                ws: false,
                changeOrigin: true,
                target: 'http://localhost:2222'
            }

        }
    }
}