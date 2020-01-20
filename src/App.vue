<template>
    <div id="page-top">
        <!-- Navigation -->
        <nav class="navbar navbar-expand-lg navbar-light fixed-top py-3" id="mainNav">
            <div class="container">
                <img src="./assets/logo.png" alt="./assets/logo.png" width="50" class="mr-3"> <a
                    class="navbar-brand js-scroll-trigger"
                    href="#page-top">The
                Airplane
                Connector</a>
                <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                        data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav ml-auto my-2 my-lg-0">
                        <li class="nav-item">
                            <router-link class="nav-link js-scroll-trigger" to="/">Home</router-link>
                        </li>

                        <li class="nav-item">
                            <router-link class="nav-link js-scroll-trigger" to="/about">Book a Flight</router-link>
                        </li>

                        <li class="nav-item">
                            <router-link class="nav-link js-scroll-trigger" to="/register" v-if="!jwt">Register
                            </router-link>
                        </li>

                        <li class="nav-item">
                            <router-link class="nav-link js-scroll-trigger" to="/login" v-if="!jwt">Login</router-link>
                        </li>

                        <li class="nav-item">
                            <router-link class="nav-link js-scroll-trigger" to="/logout" v-if="jwt">Logout</router-link>
                        </li>

                        <li class="nav-item">
                            <router-link class="nav-link js-scroll-trigger" to="/users">All users</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <router-view v-on:theJwtChanged="updateJwt()"/>
        <!-- Footer -->
        <!--<footer class="bg-light py-5">-->
        <!--<div class="container">-->
        <!--<div class="small text-center text-muted">Copyright &copy; 2020 - Airplane Connector</div>-->
        <!--</div>-->
        <!--</footer>-->
    </div>
</template>

<style>

</style>

<script>

    export default {
        data: function () {
            return {
                jwt: null
            };
        },
        created: function () {
            this.jwt = localStorage.jwt;
        },
        mounted: function () {
            (function ($) {
                "use strict"; // Start of use strict

                // Smooth scrolling using jQuery easing
                $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
                    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                        var target = $(this.hash);
                        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                        if (target.length) {
                            $('html, body').animate({
                                scrollTop: (target.offset().top - 72)
                            }, 1000, "easeInOutExpo");
                            return false;
                        }
                    }
                });

                // Closes responsive menu when a scroll trigger link is clicked
                $('.js-scroll-trigger').click(function () {
                    $('.navbar-collapse').collapse('hide');
                });

                // Activate scrollspy to add active class to navbar items on scroll
                $('body').scrollspy({
                    target: '#mainNav',
                    offset: 75
                });

                // Collapse Navbar
                var navbarCollapse = function () {
                    if ($("#mainNav").offset().top > 100) {
                        $("#mainNav").addClass("navbar-scrolled");
                    } else {
                        $("#mainNav").removeClass("navbar-scrolled");
                    }
                };
                // Collapse now if page is not at top
                navbarCollapse();
                // Collapse the navbar when page is scrolled
                $(window).scroll(navbarCollapse);

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

            })(jQuery); // End of use strict

        },
        methods: {
            updateJwt: function () {
                this.jwt = localStorage.jwt;
            }
        }
    };
</script>
