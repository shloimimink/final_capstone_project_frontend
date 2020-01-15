<template>
    <!-- Masthead -->
    <header class="masthead signup">
        <div class="container h-100">
            <div class="row h-100 align-items-center justify-content-center text-center">
                <div class="col-lg-10 align-self-end">
                    <h1 class="text-uppercase text-white font-weight-bold"></h1>
                    <hr class="divider my-4">
                    <div class="card">
                        <div class="card-header">
                            <h2>Favorites and Profile</h2>
                        </div>
                        <div class="">
                            <div class="card-body">
                                Seat Preference:
                                <p>{{user.seat_preference}}</p>
                                Class Preference:
                                <p>{{user.class_preference}}</p>
                                Airport Preference:
                                <p>{{user.airport_preference}}</p>
                                <div v-for="favorite in user.favorites">
                                    Airplane: {{ favorite.airplane_model}}
                                    <router-link v-bind:to="`/favorites/${favorite.id}`">More Info</router-link>
                                    <button v-on:click="deleteFavorite(favorite)">Delete</button>
                                </div>
                                <div v-if="user.is_current_user">
                                    <router-link v-bind:to="`/users/${user.id}/edit`">Edit user</router-link>
                                    <h2>Add a favorite</h2>
                                    <select v-model="selectedAirplaneId">
                                        <option v-for="airplane in airplanes"
                                                v-if="!user.favorite_ids.includes(airplane.id)"
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
                </div>
                <div class="col-lg-8 align-self-baseline">

                </div>
            </div>
        </div>
    </header>
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
                user: {},
                airplanes: [],
                selectedAirplaneId: null
            };
        },

        created: async function () {

            // getting all Airplanes
            try {
                const response = await axios.get("/api/airplanes/");
                const airplanes = response.data;
                this.airplanes = response.data;
                console.log("get airplanes", airplanes)
            } catch (error) {
                console.log(error.response);
            }

            const response = await axios.get("/api/users/" + this.$route.params.id);
            this.user = response.data;
        },


        methods: {

            //add a favorite
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
            //delete a favorite
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
