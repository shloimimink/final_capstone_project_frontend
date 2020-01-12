<template>
    <div class="signup">
        <!-- Masthead -->
        <header class="masthead signup">
            <div class="container h-100">
                <div class="row h-100 align-items-center justify-content-center text-center">
                    <div class="col-lg-10 align-self-end">
                        <h1 class="text-uppercase text-white font-weight-bold">{{ message }}</h1>
                        <hr class="divider my-4">


                        <div class="container">
                            <form v-on:submit.prevent="submit()">
                                <h1>Signup</h1>
                                <ul>
                                    <li class="text-danger" v-for="error in errors">{{ error }}</li>
                                </ul>
                                <div class="form-group">
                                    <label>Name:</label>
                                    <input type="text" class="form-control" v-model="name">
                                </div>
                                <div class="form-group">
                                    <label>Email:</label>
                                    <input type="email" class="form-control" v-model="email">
                                </div>
                                <div class="form-group">
                                    <label>Password:</label>
                                    <input type="password" class="form-control" v-model="password">
                                </div>
                                <div class="form-group">
                                    <label>Password confirmation:</label>
                                    <input type="password" class="form-control" v-model="password_confirmation">
                                </div>
                                <input type="submit" class="btn btn-primary" value="Submit">
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
        background: linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url("../../public/img/portfolio/fullsize/1.jpg");
    }
</style>

<script>
    import axios from "axios";

    export default {
        data: function () {
            return {
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
                errors: []
            };
        },
        methods: {
            submit: async function () {
                const params = {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.password_confirmation,
                };

                try {
                    const response = await axios.post("/api/users", params);
                    const user = response.data;
                    this.$router.push("/login");
                    console.log("register success", user)

                } catch (err) {
                    console.log(err.response);
                }

            }
        }
    };
</script>
