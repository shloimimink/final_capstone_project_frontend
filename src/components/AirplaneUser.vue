<template>
    <div class="container">
        <h3>{{favorite.airplane.model}}</h3>
        <div v-for="image in favorite.images">
            <img v-bind:src="image.url" alt="" width="300">
            <button v-on:click="deletePhoto(image)">Delete image</button>
        </div>
        <form v-on:submit.prevent="submit()">
            <h2>Create a new image:</h2>
            <div>
                Image: <input type="file" v-on:change="setFile($event)" ref="fileInput">
            </div>
            <input type="submit" value="Submit">
        </form>


        <router-link :to="`/users/${favorite.user_id}`">Back to profile</router-link>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        data: function () {
            return {
                favorite: {airplane: {}}
            };
        },
        created: async function () {
            const response = await axios.get("/api/airplane_users/" + this.$route.params.id);
            const favoriteAirplane = response.data;
            this.favorite = response.data;
            console.log("edit favorite", favoriteAirplane)
        },
        methods: {
            setFile: function (event) {
                if (event.target.files.length > 0) {
                    this.image = event.target.files[0];
                }
            },

            submit: async function () {
                const formData = new FormData();
                formData.append("image_file", this.image);
                formData.append("airplane_id", this.favorite.airplane_id);

                try {
                    const response = await axios.post("/api/images", formData);
                    const postImage = response.data;
                    this.$refs.fileInput.value = "";
                    console.log("added Image", postImage);
                    console.log("favorite images", this.favorite.images);
                    this.favorite.images.push(postImage);
                } catch (error) {
                    console.log(error.response)
                }
            },

            deletePhoto: async function (image) {
                const response = await axios.delete("/api/images/" + image.id);
                const imageDeleted = response.data;
                const index = this.favorite.images.indexOf(image);
                this.favorite.images.splice(index, 1);
                console.log("image deleted", imageDeleted)
            }
        }
    };

</script>
<style>

</style>
