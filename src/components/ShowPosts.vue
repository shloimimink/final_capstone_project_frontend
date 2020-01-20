<template>
    <div class="signup">
        <!-- Masthead -->
        <header class="masthead signup">
            <div class="container h-100">
                <div class="row h-100 align-items-center justify-content-center text-center">
                    <div class="col-lg-10 align-self-end">
                        <h1 class="text-uppercase text-white font-weight-bold"></h1>
                        <hr class="divider my-4">


                        <div class="position"><a v-bind:href="`/favorites/${post.favorite_id}`">Back to posts</a></div>
                        <br>
                        <div class="jumbotron jumbotron-fluid">
                            <div class="container">
                                <h1 class="display-4">Posts and Comments</h1>
                                <p class="lead">{{ post.text}}
                                    <button v-if="post.is_current_user" class="btn btn-danger"
                                            v-on:click="deletePost(post)">delete a post
                                    </button>
                                </p>
                            </div>
                        </div>

                        <form v-on:submit.prevent="submitComment()" class="form-inline">
                            <div class="form-group mb-2 mr-2 w-50">
                                <input type="text" class="form-control w-100" placeholder="Add a comment..."
                                       v-model="postComment">
                            </div>
                            <button type="submit" class="btn btn-primary mb-2">Submit</button>
                        </form>


                        <div class="container">
                            <div class="container post-comments">
                                <div class="row">
                                    <div class="col-md-12">
                                        <br>
                                        <br>
                                    </div><!-- /col-md-12 -->
                                </div><!-- /row -->
                                <div class="row" v-for="comment in post.comments">
                                    <div class="col-md-1">
                                        <img class="img-thumbnail img-responsive user-photo"
                                             src="https://ssl.gstatic.com/accounts/ui/avatar_2x.png">
                                    </div><!-- /col-md-1 -->
                                    <div class="col-md-7">
                                        <div class="card card-info">
                                            <div class="card-header">
                                                <strong>{{comment.name}}</strong>
                                            </div>
                                            <div class="card-body">
                                                <ul>
                                                    {{comment.text}}
                                                    <!--delete the comment-->
                                                    <button v-if="comment.is_current_user" class="btn btn-danger"
                                                            v-on:click="deleteComment(comment)">
                                                        X
                                                    </button>
                                                </ul>
                                            </div><!-- /panel-body -->
                                        </div><!-- /panel panel-default -->
                                    </div><!-- /col-md-5 -->
                                </div><!-- /row -->
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

<style>
    .post-comments .img-thumbnail {
        padding: 0px;
    }

    .post-comments .card {
        position: relative;
        height: 105px;
        margin-bottom: 1em;
    }

    .post-comments .card .card-header:after,
    .post-comments .card .card-header:before {
        position: absolute;
        top: 11px;
        left: -16px;
        right: 100%;
        width: 0;
        height: 0;
        display: block;
        content: " ";
        border-color: transparent;
        border-style: solid solid outset;
        pointer-events: none;
    }

    .post-comments .card .card-header:after {
        border-width: 7px;
        border-right-color: #f7f7f7;
        margin-top: 1px;
        margin-left: 2px;
    }

    .post-comments .card .card-header:before {
        border-right-color: #ddd;
        border-width: 8px;
    }

    .position {
        padding-right: 800px;
    }
</style>


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

            // try {
            //     const response = await axios.get("/api/comments/" + this.$route.params.id);
            //     const comments = response.data;
            //     this.comment = response.data;
            //     console.log("comment", comments)
            // } catch (error) {
            //     console.log(error.response);
            // }
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
                console.log("post deleted", postDeleted);
                this.$router.push("/favorites/" + this.post.favorite_id);
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
