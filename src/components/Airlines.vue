<template>
    <div class="container">
        <h1>All Airlines</h1>.
        <div v-for="airline in airlines">
            <h4>{{airline.name}}</h4>
            <p>{{airline.class_type}}</p>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        data: function () {
            return {
                airlines: []
            };
        },
        created: async function () {
            const response = await axios.get("/api/airlines");
            const airline = response.data;
            this.airlines = response.data;
            console.log("get airlines", airline);
        },

        methods: {}
    }
</script>

<style>

</style>
