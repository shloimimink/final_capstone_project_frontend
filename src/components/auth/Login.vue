<template>
    <div class="login">
        <!-- Masthead -->
        <header class="masthead masthead-login">
            <div class="container h-100">
                <div class="row h-100  justify-content-center text-center">
                    <div class="col-lg-10">
                        <h1 class="text-uppercase text-white font-weight-bold"></h1>
                        <hr class="divider my-4">


                        <div class="container">
                            <form v-on:submit.prevent="submit()">
                                <h1 class="text-primary">Login</h1>
                                <ul>
                                    <li class="text-danger" v-for="error in errors">{{ error }}</li>
                                </ul>
                                <div class="form-group">
                                    <label class="text-primary">Email:</label>
                                    <input type="email" class="form-control" v-model="email">
                                </div>
                                <div class="form-group">
                                    <label class="text-primary">Password:</label>
                                    <input type="password" class="form-control" v-model="password">
                                </div>
                                <input type="submit" class="btn btn-primary" value="Login">
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
    header.masthead-login {
        padding-top: 10rem;
        padding-bottom: calc(10rem - 72px);
        background: linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url("../../../public/img/portfolio/fullsize/7.jpg");
        background-position: center;
        background-repeat: no-repeat !important;
        background-attachment: scroll;
        background-size: cover !important;
    }
</style>

<script>
    import axios from "axios";

    export default {
        data: function () {
            return {
                email: "shloimi@email.com",
                password: "password",
                errors: []
            };
        },
        methods: {
            submit: async function () {
                const params = {
                    email: this.email,
                    password: this.password
                };

                try {
                    const response = await axios.post("/api/sessions", params);
                    const session = response.data;
                    axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt;
                    localStorage.setItem("jwt", response.data.jwt);
                    this.$emit("theJwtChanged");
                    this.$router.push("/users-profile/" + response.data.user_id);
                    console.log("login success", session)

                } catch (error) {
                    this.errors = ["Invalid email or password."];
                    this.email = "";
                    this.password = "";
                }
            }
        }
    };
</script>
