<template>
    <div class="airplaneUser masthead-airplaneUser">
        <br>
        <form v-if="favorite.is_current_user" v-on:submit.prevent="submit()">
            <div class="container">
                <br>
                <br>
                <h2 class="text-primary">Add a new image</h2>
                <div class="input-group">
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="input-image-file" v-on:change="setFile($event)"
                               ref="fileInput">
                        <label class="custom-file-label" for="input-image-file">{{ currentFilename }}</label>
                    </div>
                    <div class="input-group-append">
                        <input class="btn-primary" type="submit" value="Submit">
                    </div>
                </div>
            </div>

        </form>

        <router-link :to="`/users-profile/${favorite.user_id}`">Back to profile</router-link>

        <section id="portfolio">
            <div class="container-fluid p-0">
                <div class="row no-gutters">
                    <div v-for="image in favorite.images" class="col-lg-4 col-sm-6">
                        <a class="portfolio-box" :href="image.url">
                            <img class="img-fluid plane-image" :src="image.url" alt="">
                            <div class="portfolio-box-caption">
                                <div class="project-category text-white-50">
                                </div>
                                <div class="project-name">
                                    Image
                                    <button v-if="favorite.is_current_user" class="btn btn-danger"
                                            v-on:click.stop.prevent="deletePhoto(image)">X
                                    </button>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <br>
        <br>
        <br>
        <section>
            <div class="container">
                <h2>Articles ({{articles.length}} found)</h2>
                <!--Display all articles-->
                <ul>
                    <li v-for="article in articles" class="mb-2">
                        <div class="row">
                            <div class="col-8">
                                <a class="text-dark" v-bind:href="article.url"
                                   target="_blank">{{article.title}}</a>
                            </div>
                            <div class="col-4">
                                <button class="btn btn-primary" v-on:click="setPostText(article)">Make a post about this
                                    article
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
        <br>
        <br>
        <section>
            <div class="container">
                <h2 class="text-primary">New post</h2>
                <form v-on:submit.prevent="submitPost()">
                    <div class="form-group">
                        <textarea class="form-control new-post" v-model="postText"></textarea>
                    </div>
                    <input type="submit" class="btn btn-primary" value="Submit">
                </form>
            </div>
        </section>

        <section>
            <div class="container">
                <h2 class="text-primary">Posts</h2>
                <div v-for="post in favorite.posts">
                    <!--show the post text-->
                    <a v-bind:href="`/posts/${post.id}`">{{ post.text }}</a>
                </div>
            </div>
        </section>
    </div>
</template>

<style>
    header.masthead.favorite {
        height: 200px !important;
    }

    .plane-image {
        height: 300px;
        width: 100%;
        object-fit: cover;
    }

    .card-img-top {
        height: 200px;
        object-fit: cover !important;
    }

    textarea.new-post {
        min-height: 10em;
    }

    .masthead-airplaneUser {
        padding-top: 10rem;
        padding-bottom: calc(10rem - 72px);
        background: linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url("../../../public/img/portfolio/fullsize/14.jpg");
        background-position: center;
        background-repeat: no-repeat !important;
        background-attachment: scroll;
        background-size: cover !important;
        height: 100vh
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
                postText: "",
                currentFilename: "Choose file"
            };
        },
        mounted: function () {
            // Magnific popup calls
            $('#portfolio').magnificPopup({
                delegate: 'a',
                type: 'image',
                tLoading: 'Loading image #%curr%...',
                mainClass: 'mfp-img-mobile',
                gallery: {
                    enabled: true,
                    navigateByImgClick: true,
                    preload: [0, 1]
                },
                image: {
                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
                }
            });
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
                console.log('setFile', event);
                if (event.target.files.length > 0) {
                    this.image = event.target.files[0];
                    this.currentFilename = event.target.files[0].name;
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
                    this.currentFilename = "Choose file";
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
                console.log("post added", newpost);
                this.$router.push("/posts/" + newpost.id)
            },
            setPostText: function (article) {
                this.postText = article.title + "\n" + article.url + "\n\nYour text goes here..."
            }
        }
    };

</script>
