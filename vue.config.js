module.exports = {
    outputDir: "D:\\code\\felix\\dist",
    devServer: {
        //proxy:'http://localhost:2222'
        proxy: {
            '/api': {
                ws: false,
                changeOrigin: true,
                target: 'http://127.0.0.1:2222'
            }

        }
    }
};