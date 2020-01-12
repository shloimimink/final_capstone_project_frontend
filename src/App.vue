<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Home</router-link>
            |
            <router-link to="/about">About</router-link>
            |
            <router-link to="/register" v-if="!jwt">Register</router-link>
            |
            <router-link to="/login" v-if="!jwt">Login</router-link>
            |
            <router-link to="/logout" v-if="jwt">Logout</router-link>
            |
            <router-link to="/airlines">All Airlines</router-link>
            |
            <router-link to="/users">All users</router-link>
        </div>
        <div class="container">
            <router-view v-on:theJwtChanged="updateJwt()"/>
        </div>
    </div>
</template>

<style>

</style>

<script>

    export default {
        data: function () {
            return {
                jwt: null
            };
        },
        created: function () {
            this.jwt = localStorage.jwt;
        },
        methods: {
            updateJwt: function () {
                this.jwt = localStorage.jwt;
            }
        }
    };
</script>
