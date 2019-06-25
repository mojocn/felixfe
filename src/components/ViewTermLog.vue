<template>
    <div>
        <comp-tlog :obj="selectedRow" :visible="termVisible" @pclose="doClose"></comp-tlog>
    </div>

</template>

<script>

    import CompTlog from "./CompTlog";

    export default {
        components: {CompTlog},
        name: "ViewTermLog",
        props: ['ID', 'name', 'user'],
        data() {
            return {
                termVisible: false,
                selectedRow: {},

            };
        },
        mounted() {
            this.termVisible = true
        },
        created() {
        },
        methods: {
            doClose(flag) {
                this.termVisible = flag
            },
        }
    };
</script>
<style scoped>


</style>
