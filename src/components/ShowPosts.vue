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
                            <h3>Edit User</h3>
                            <div class="container">
                                <h2>Posts and Comments</h2>
                                {{ post.text}}
                                <!--delete the post-->
                                <button v-on:click="deletePost(post)">X</button>
                                <!--show the post comments ()-->
                                <ul>
                                    <li v-for="comment in post.comments">
                                        {{comment.text}}
                                        <!--delete the comment-->
                                        <button v-on:click="deleteComment(comment)">X</button>
                                    </li>
                                </ul>
                                <!--add a comment-->
                                <section>
                                    <div class="container">
                                        <h2>New Comment</h2>
                                        <form v-on:submit.prevent="submitComment()">
                                            <div class="form-group">
                                                <label>comment:</label>
                                                <input type="text" class="form-control" v-model="postComment">
                                            </div>
                                            <input type="submit" class="btn btn-primary" value="Submit">
                                        </form>
                                    </div>
                                </section>
                                <!--delete the post-->
                                <a v-bind:href="`/favorites/${post.favorite_id}`">Back to posts</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8 align-self-baseline">

                    </div>
                </div>
            </div>
        </header>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        data: function () {
            return {
                post: {},
                postComment: ""
            };
        },

        created: async function () {

            try {
                const response = await axios.get("/api/posts/" + this.$route.params.id);
                const posts = response.data;
                this.post = response.data;
                console.log("post", posts)
            } catch (error) {
                console.log(error.response);
            }

            try {
                const response = await axios.get("/api/comments/" + this.$route.params.id);
                const comments = response.data;
                this.comment = response.data;
                console.log("comment", comments)
            } catch (error) {
                console.log(error.response);
            }
        },

        methods: {
            submitComment: async function () {
                const params = {
                    text: this.postComment,
                    post_id: this.post.id
                };
                // console.log(params, "look here", this.post.post_id, this.post);

                const response = await axios.post("/api/comments", params);
                const newcomment = response.data;
                this.post.comments.push(newcomment);
                this.postComment = "";
                console.log("comment added", newcomment)
            },

            deletePost: async function (post) {
                const response = await axios.delete("/api/posts/" + post.id);
                const postDeleted = response.data;
                const index = this.favorite.posts.indexOf(post);
                this.favorite.posts.splice(index, 1);
                console.log("post deleted", postDeleted);
            },

            deleteComment: async function (comment) {
                const response = await axios.delete("/api/comments/" + comment.id);
                const commentDeleted = response.data;
                const index = this.post.comments.indexOf(comment);
                this.post.comments.splice(index, 1);
                console.log("comment deleted", commentDeleted);
            }
        }
    }
</script>

<style>

</style>
