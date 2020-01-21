<template>
    <div class="signup">
        <!-- Masthead -->
        <header class="editUser masthead-editUser">
            <div class="container h-100">
                <div class="row h-100 align-items-center justify-content-center text-center">
                    <div class="col-lg-10 align-self-end">
                        <h1 class="text-uppercase text-white font-weight-bold">{{ message }}</h1>
                        <hr class="divider my-4">
                        <div class="container">
                            <h3 class="text-primary">Edit User</h3>
                            <form v-on:submit.prevent="updateUser(user)">
                                <ul>
                                    <li v-for="error in errors">{{error}}</li>
                                </ul>
                                <div class="text-primary">Name:</div>
                                <input type="text" class="form-control" v-model="user.name">
                                <div class="text-primary">Phone Number:</div>
                                <input type="text" class="form-control" v-model="user.phone">
                                <div class="text-primary">Profile picture:</div>
                                <input type="text" class="form-control" v-model="user.profile_picture">
                                <div class="text-primary">Location:</div>
                                <input type="text" class="form-control" v-model="user.location">
                                <div class="text-primary">Seat Preference:</div>
                                <input type="text" class="form-control" v-model="user.seat_preference">
                                <div class="text-primary">Class Preference:</div>
                                <input type="text" class="form-control" v-model="user.class_preference">
                                <div class="text-primary">airport Preference:</div>
                                <input type="text" class="form-control" v-model="user.airport_preference">
                                <br>
                                <input class="btn btn-primary" type="submit" value="Update"/>
                            </form>
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
    .masthead-editUser {
        padding-top: 2rem;
        padding-bottom: calc(10rem - 72px);
        background: linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url("../../../public/img/portfolio/fullsize/17.jpg");
        background-position: center;
        background-repeat: no-repeat !important;
        background-attachment: scroll;
        background-size: cover !important;
        height: 100vh
    }

</style>


<script>
    import axios from "axios"

    export default {
        data: function () {
            return {
                user: {},
                errors: []
            };
        },

        created: async function () {
            const response = await axios.get("/api/users/" + this.$route.params.id);
            const user = response.data;
            this.user = response.data;
            console.log("updated successfully", user)
        },

        methods: {
            updateUser: async function (user) {
                const params = {
                    name: user.name,
                    phone: user.phone,
                    profile_picture: user.profile_picture,
                    location: user.location,
                    seat_preference: user.seat_preference,
                    class_preference: user.class_preference,
                    airport_preference: user.airport_preference,
                    airline_id: user.airline_id
                };

                try {
                    const response = await axios.patch("/api/users/" + user.id, params);
                    const users = response.data;
                    this.$route.push("/users");
                    console.log("user updated", users)

                } catch (error) {
                    console.log(error.response);
                }
            }
        }
    }
</script>
