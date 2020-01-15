<template>
    <div class="signup">
        <header class="masthead signup">
            <div class="container h-100">
                <div class="row h-100 align-items-center justify-content-center text-center">
                    <div class="col-lg-10 align-self-end">
                        <h1 class="text-uppercase text-white font-weight-bold">{{ message }}</h1>
                        <hr class="divider my-4">
                    </div>
                    <div class="">
                        <div class="card-body">
                            <div class="card">
                                <div class="row">
                                    <div class="col col-sm-4 left">
                                        <div class="img animated fadeIn">
                                            <!--<i class="fa fa-user"></i>-->
                                            <img class="img-logo" v-bind:src="user.profile_picture" alt="">
                                        </div>
                                        <h4>{{user.name}}</h4>
                                        <p>Role: Admin</p>
                                        <button v-on:click="showMoreInfo()">More Info</button>
                                    </div>
                                    <div class="col col-sm-8 right">
                                        <div class="container">
                                            <h4>Email:</h4>
                                            <p>{{user.email}}</p>

                                            <h4>Phone:</h4>
                                            <p>{{user.phone}}</p>

                                            <h4>Website:</h4>
                                            <p>www.website.com</p>

                                            <div class="action-buttons">
                                                <button class="edit"><i class="fa fa-pencil"></i></button>
                                                <button class="delete"><i class="fa fa-trash"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </div>
</template>

<style>
    header.masthead-login {
        background: linear-gradient(to bottom, rgba(92, 77, 66, 0.8) 0%, rgba(92, 77, 66, 0.8) 100%), url("../../public/img/portfolio/fullsize/1.jpg");
    }

    .img-logo {
        border-radius: 50%;
    }

    @import url('https://fonts.googleapis.com/css?family=Poppins');
    html, body {
        height: 100%;
        padding: 0;
        margin: 0;
        font-size: 16px;
        font-family: 'Poppins', sans-serif;
    }

    .left .img,
    .card,
    .left button,
    .action-buttons button {
        box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
    }

    button {
        transition: 0.3s ease-in-out;
    }

    button:hover {
        cursor: pointer;
        transform: scale(1.1);
    }

    .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: #e6e6e6;
    }

    .card {
        border-radius: .25rem;
        border: none;
        width: 600px;
        height: 300px
    }

    .card-body {
        padding: 0;
    }

    .left {
        background: #7386D5;
        text-align: center;
        max-width: 200px;
        max-height: 300px;
        color: #fff;
        border-top-left-radius: .25rem;
        border-bottom-left-radius: .25rem;
        box-shadow: 3px 0 6px rgba(0, 0, 0, 0.2);
    }

    .left .img {
        border-radius: 50%;
        width: 100%;
        width: 90px;
        height: 90px;
        background: #E6E6E6;
        margin-top: 1.625rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: auto;
        margin-right: auto;
    }

    .left .img i {
        font-size: 4rem;
        color: #6C757D;
    }

    .left h4 {
        font-size: 1.25rem;
        margin-top: .94rem;
    }

    .left p {
        font-size: .75rem;
    }

    .left button {
        font-size: .75rem;
        border-radius: 1.1rem;
        padding: .25rem 1.25rem;
        border: none;
        background: #17A2B8;
        color: #fff;
        position: absolute;
        bottom: 1.25rem;
        left: 50%;
        transform: translate(-50%);
    }

    .right {
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .right h4 {
        margin-bottom: .93rem;
        font-size: 1.25rem
    }

    .right p {
        line-height: .5;
    }

    .right h4:not(:first-of-type) {
        margin-top: 2.5rem;
    }

    .action-buttons {
        position: absolute;
        top: 1.25rem;
        right: 3rem;
    }

    .action-buttons button {
        height: 30px;
        width: 30px;
        border-radius: 4px;
        border: none;
    }

    .action-buttons button i {
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .edit {
        margin-right: .25rem;
        background: #17A2B8;
    }

    .delete {
        background: #EE6E73;
    }

    @media only screen and (max-width: 500px) {

    }

</style>

<script>
    import axios from "axios";

    export default {
        data: function () {
            return {
                message: "Profile",
                user: {}
            };
        },

        created: async function () {
            //get users profile

            try {
                const response = await axios.get("/api/users/" + this.$route.params.id);
                const users = response.data;
                this.user = response.data;
                console.log("user", users)
            } catch (error) {
                console.log(error.response);
            }
        },

        methods: {
            showMoreInfo: function () {
                this.$router.push("/users-airplane/" + this.$route.params.id)
            }
        }
    }
</script>
