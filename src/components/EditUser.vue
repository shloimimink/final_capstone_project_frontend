<template>
    <div class="container">
        <h3>Edit User</h3>
        <form v-on:submit.prevent="updateUser(user)">
            <ul>
                <li v-for="error in errors">{{error}}</li>
            </ul>
            Name:
            <input type="text" class="form-control" v-model="user.name">
            Phone Number:
            <input type="text" class="form-control" v-model="user.phone">
            Profile picture:
            <input type="text" class="form-control" v-model="user.profile_picture">
            Location:
            <input type="text" class="form-control" v-model="user.location">
            Seat Preference:
            <input type="text" class="form-control" v-model="user.seat_preference">
            Class Preference:
            <input type="text" class="form-control" v-model="user.class_preference">
            airport Preference:
            <input type="text" class="form-control" v-model="user.airport_preference">
            <input type="submit" value="Update"/>
        </form>
    </div>
</template>

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
                    airport_preference: user.airport_preference
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

<style scoped>

</style>
