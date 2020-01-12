<template>
    <div class="container">
        <h2>All Users</h2>
        <div class="card-body">
            <div v-for="user in users" class="card">
                <h4>{{user.name}}</h4>
                <p>{{user.email}}</p>
                <p>{{user.phone}}</p>
                <p>{{user.profile_picture}}</p>
                <p>{{user.location}}</p>
                <p>{{user.seat_preference}}</p>
                <p>{{user.class_preference}}</p>
                <p>{{user.airport_preference}}</p>
                <router-link v-bind:to="`/users/${user.id}`">More details</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        data: function () {
            return {
                users: []
            };
        },

        created: async function () {
            const response = await axios.get("/api/users");
            const users = response.data;
            this.users = response.data;
            console.log("all users", users)
        },

        methods: {}

    }
</script>

<style>

</style>
