<template>
    <div class="signup">

        <!-- Portfolio Section -->
        <section id="portfolio">
            <div class="container-fluid p-0">
                <div class="row no-gutters">
                    <div v-for="image in favorite.images" class="col-lg-4 col-sm-6">
                        <a class="portfolio-box" v-bind:href="image.url">
                            <img class="img-fluid plane-image" v-bind:src="image.url" alt="">
                            <div class="portfolio-box-caption">
                                <div class="project-category text-white-50">
                                    Category
                                </div>
                                <div class="project-name">
                                    Project Name
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div class="container">
                <h2>Articles ({{articles.length}} found)</h2>
                <!--Display all articles-->
                <div v-for="article in articles">
                    <a v-bind:href="article.url" target="_blank">{{article.title}}</a>
                </div>
            </div>
        </section>

        <section>
            <div class="container">
                <h2>New post</h2>
                <form v-on:submit.prevent="submitPost()">
                    <div class="form-group">
                        <label>post:</label>
                        <input type="text" class="form-control" v-model="postText">
                    </div>
                    <input type="submit" class="btn btn-primary" value="Submit">
                </form>
            </div>
        </section>

        <section>
            <div class="container">
                <h2>Posts</h2>
                <div v-for="post in favorite.posts">
                    <!--show the post text-->
                    <a v-bind:href="`/posts/${post.id}`">{{ post.text }}</a>
                </div>
            </div>
        </section>

        <!-- Masthead -->
        <header class="masthead signup">
            <div class="container h-100">
                <div class="row h-100 align-items-center justify-content-center text-center">
                    <div class="col-lg-10 align-self-end">
                        <h1 class="text-uppercase text-white font-weight-bold">{{ favorite.airplane.model }}</h1>
                        <hr class="divider my-4">
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
                    </div>
                    <div class="col-lg-8 align-self-baseline"></div>
                </div>
            </div>
        </header>
    </div>
</template>

<style>
    header.masthead-login {
        background: linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url("../../public/img/portfolio/fullsize/1.jpg");
    }

    .plane-image {
        height: 300px;
        object-fit: cover !important;
    }
</style>

<script>
    import axios from "axios";

    export default {
        data: function () {
            return {
                message: "Hello",
                favorite: {airplane: {}},
                articles: [],
                postText: ""
            };
        },
        created: async function () {
            const response = await axios.get("/api/airplane_users/" + this.$route.params.id);
            const favoriteAirplane = response.data;
            this.favorite = response.data;
            console.log("edit favorite", favoriteAirplane);
            // Make web request to backend for articles, save as this.articles

            const response2 = await axios.get("/api/news_apis?search=" + this.favorite.airplane.model);
            this.articles = response2.data;
            console.log("news", this.articles)
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
            },

            submitPost: async function () {
                const params = {
                    text: this.postText,
                    airplane_id: this.favorite.airplane_id
                };

                const response = await axios.post("/api/posts", params);
                const newpost = response.data;
                this.favorite.posts.push(newpost);
                console.log("post added", newpost)
            },
        }
    };

</script>
