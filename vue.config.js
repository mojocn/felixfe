module.exports = {
    outputDir: "C:\\Users\\zhouqing1\\go\\src\\github.com\\dejavuzhou\\felix\\dist",
    devServer: {
        //proxy:'http://localhost:2222'
        proxy: {
            '/ws': {
                target: 'ws://localhost:2222',
                ws: true,
                changeOrigin: true
            },
            '/api': {
                ws: true,
                changeOrigin: true,
                target: 'http://localhost:2222'
            }

        }
    }
};