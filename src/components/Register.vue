<template>
    <div class="signup">
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
</template>

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
