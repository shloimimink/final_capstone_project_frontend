<template>
    <div class="container">
        <!-- Masthead -->
        <header class="masthead signup">
            <div class="container h-100">
                <div class="row h-100 align-items-center justify-content-center text-center">
                    <div class="col-lg-10 align-self-end">
                        <h1 class="text-uppercase text-white font-weight-bold">{{ message }}</h1>
                        <hr class="divider my-4">
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
                    <div class="col-lg-8 align-self-baseline">

                    </div>
                </div>
            </div>
        </header>
    </div>
</template>

<style>
    header.masthead-login {
        background: linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url("../../public/img/portfolio/fullsize/1.jpg");
    }
</style>

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
