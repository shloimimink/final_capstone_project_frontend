<template>
    <div class="container">
        <div class="card">
            <div class="card-body">
                <h4>{{user.name}}</h4>
                <p>{{user.email}}</p>
                <p>{{user.phone}}</p>
                <p>{{user.profile_picture}}</p>
                <p>{{user.location}}</p>
                <p>{{user.seat_preference}}</p>
                <p>{{user.class_preference}}</p>
                <p>{{user.airport_preference}}</p>
                <h4>Favorites</h4>
                <div v-for="favorite in user.favorites">
                    Airplane: {{ favorite.airplane_model}}
                    <router-link v-bind:to="`/favorites/${favorite.id}`">More Info</router-link>
                    <button v-on:click="deleteFavorite(favorite)">Delete</button>
                </div>
                <div v-if="user.is_current_user">
                    <router-link v-bind:to="`/users/${user.id}/edit`">Edit user</router-link>
                    <h2>Add a favorite (show all airplanes in a dropdown)</h2>
                    <select v-model="selectedAirplaneId">
                        <option v-for="airplane in airplanes" v-if="!user.favorite_ids.includes(airplane.id)"
                                v-bind:value="airplane.id">
                            {{ airplane.model }}
                        </option>
                    </select>
                    <span>Selected airplane id: {{ selectedAirplaneId }}</span>
                    <button v-on:click="addFavorite()">Submit</button>
                </div>
                <br>
                <router-link to="/users">Back to all users</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        data: function () {
            return {
                user: {},
                airplanes: [],
                selectedAirplaneId: null
            };
        },

        created: async function () {

            try {
                const response = await axios.get("/api/users/" + this.$route.params.id);
                const users = response.data;
                this.user = response.data;
                console.log("user", users)
            } catch (error) {
                console.log(error.response);
            }

            try {
                const response = await axios.get("/api/airplanes/");
                const airplanes = response.data;
                this.airplanes = response.data;
                console.log("get airplanes", airplanes)
            } catch (error) {
                console.log(error.response);
            }
        },

        methods: {
            addFavorite: async function () {
                const params = {
                    airplane_id: this.selectedAirplaneId
                };

                const response = await axios.post("/api/airplane_users", params);
                const favorite = response.data;
                this.user.favorites.push(favorite);
                this.user.favorite_ids.push(favorite.airplane_id);
                this.selectedAirplaneId = null;
                console.log("airplane added", favorite)
            },

            deleteFavorite: async function (favorite) {
                const response = await axios.delete("/api/airplane_users/" + favorite.id);
                const favoritesUser = response.data;
                const index = this.user.favorites.indexOf(favorite);
                this.user.favorites.splice(index, 1);
                console.log("favorite deleted", favoritesUser)
            }
        }
    }
</script>

<style scoped>

</style>
