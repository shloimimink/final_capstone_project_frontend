<template>
    <div class="home">
        <!-- Masthead -->
        <header class="masthead">
            <div class="container h-100">
                <div class="row h-100 align-items-center justify-content-center text-center">
                    <div class="col-lg-10 align-self-end">
                        <h1 class="text-uppercase text-white-75 font-weight-bold">{{ message }}</h1>
                        <hr class="divider my-4">
                    </div>
                    <div class="col-lg-8 align-self-baseline">
                        <p class="text-white-75 font-weight-light mb-5">A small airplane social network, for people to
                            communicate along them by,
                            creating favorites and Profiles. And much
                            much more !!! </p>
                        <a class="btn btn-primary btn-xl js-scroll-trigger" href="/register">Sign Up to Find Out
                            More</a>
                    </div>
                </div>
            </div>
        </header>


        <h1></h1>
    </div>
</template>

<style>
</style>

<script>
    export default {
        data: function () {
            return {
                message: "Welcome to the Airplane Social network"
            };
        },
        created: function () {
        },
        methods: {}
    };
</script>
