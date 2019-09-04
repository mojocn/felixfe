module.exports = {
    outputDir: "D:\\code\\felix\\dist",
    devServer: {
        //proxy:'http://localhost:2222'
        proxy: {
            '/api': {
                ws: false,
                changeOrigin: true,
                target: 'http://127.0.0.1:2222'
            },

            '/ws': {
                target: 'ws://127.0.0.1:2222',
                ws: true,
                changeOrigin: true
            },

        }
    }
};