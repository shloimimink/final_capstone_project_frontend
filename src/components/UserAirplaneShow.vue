<template>
    <!-- Masthead -->
    <header class="profileShow masthead-profileShow">
        <div class="container h-100">
            <div class="row h-100 align-items-center justify-content-center text-center">
                <div class="col-lg-12 align-self-end">
                    <h1 class="text-uppercase text-white font-weight-bold"></h1>
                    <hr class="divider my-4">
                    <div class="container my-5 pt-3 pb-4 bg-transparent">
                        <h1 class="pb-3 text-white text-center text-primary">Favorites and Profile Info</h1>
                        <section class="row d-flex justify-content-center">

                            <article class="col-md-4">
                                <div class="card h-100">
                                    <div class="card-block p-3">
                                        <h5 class=" card-title">Seat Preference</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">{{user.seat_preference}}</h6>
                                        <h5 class=" card-title">Class Preference</h5>
                                        <h6 class="card-subtitle mb-2 text-muted"> {{user.class_preference}}</h6>
                                        <h5 class=" card-title">Airport Preference</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">{{user.airport_preference}}</h6>
                                        <h5 class=" card-title">Airline Preference</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">{{user.airline_name}}</h6>
                                        <br>
                                        <div>
                                            <h4 class=" card-title">Add a Favorite Airline</h4>
                                            <div>
                                                <span>Select an airline {{ selectedAirlineId }}</span>
                                            </div>
                                            <select class="form-control" v-model="selectedAirlineId">
                                                <option v-for="airline in airlines" v-bind:value="airline.id">
                                                    {{ airline.name }}
                                                </option>
                                            </select>
                                        </div>
                                        <br>
                                        <div>
                                            <button v-on:click="addFavoriteAirline()" type="submit"
                                                    class="btn btn-primary">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>


                            <article class="col-md-4">
                                <div class="card h-100">
                                    <div class="card-block p-3 text-center">
                                        <div>
                                            <div class="form-group">
                                                <div v-if="user.is_current_user">
                                                    <h4 class=" card-title">Add a Favorite</h4>
                                                    <div>
                                                        <span>Select an airplane {{ selectedAirplaneId }}</span>
                                                    </div>
                                                    <select class="form-control" v-model="selectedAirplaneId">
                                                        <option v-for="airplane in airplanes"
                                                                v-if="!user.favorite_ids.includes(airplane.id)"
                                                                v-bind:value="airplane.id">
                                                            {{ airplane.model }}
                                                        </option>
                                                    </select>
                                                </div>
                                                <br>
                                                <div>
                                                    <button v-on:click="addFavorite()" type="submit"
                                                            class="btn btn-primary">
                                                        Submit
                                                    </button>
                                                </div>
                                                <br>
                                                <router-link v-if="user.is_current_user"
                                                             v-bind:to="`/users/${user.id}/edit`">Edit user
                                                </router-link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            <article class="col-md-4">
                                <div class="card h-100 text-center">
                                    <div class="card-block p-3">
                                        <h4 class=" card-title">Favorites</h4>
                                        <ul class="list-unstyled">
                                            <div v-for="favorite in user.favorites">
                                                <div class="airplane-text">Airplane: {{ favorite.airplane_model}}
                                                    <button v-if="user.is_current_user" type="button"
                                                            class="btn btn-danger"
                                                            v-on:click="deleteFavorite(favorite)">X
                                                    </button>
                                                </div>
                                                <router-link v-bind:to="`/favorites/${favorite.id}`">More Info
                                                </router-link>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </article>
                        </section>
                        <hr>
                        <section class="row justify-content-center">
                            <form class="form-inline">
                                <div class="form-group">
                                    <router-link to="/users">Back to all users</router-link>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
                <div class="col-lg-8 align-self-baseline">

                </div>
            </div>
        </div>
    </header>
</template>

<style>
    .masthead-profileShow {
        padding-top: 2rem;
        padding-bottom: calc(10rem - 72px);
        background: linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url("../../public/img/portfolio/fullsize/12.jpg");
        background-position: center;
        background-repeat: no-repeat !important;
        background-attachment: scroll;
        background-size: cover !important;
        height: 100vh
    }


    .card {
        width: inherit;
    }

    .container.bg-transparent {
        border: solid 4px darkgrey;
        border-radius: 10px;
        width: 100vw;
    }

</style>

<script>
    import axios from "axios";

    export default {
        data: function () {
            return {
                user: {},
                airplanes: [],
                airlines: [],
                selectedAirlineId: null,
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
            // getting all airlines
            try {
                const response = await axios.get("/api/airlines/");
                const airlines = response.data;
                this.airlines = response.data;
                console.log("get airlines", airlines)
            } catch (error) {
                console.log(error.response)
            }

            const response = await axios.get("/api/users/" + this.$route.params.id);
            this.user = response.data;
            console.log("user", this.user);
            this.selectedAirlineId = this.user.airline_id;
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
            },

            addFavoriteAirline: async function () {
                const params = {
                    airline_id: this.selectedAirlineId,
                };

                const response = await axios.patch("/api/users/" + this.user.id, params);
                const user = response.data;
                console.log("user updated", user);
                this.user.airline_name = user.airline_name;
            }
        }
    }
</script>
