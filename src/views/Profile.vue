<template>
    <v-container>
        <v-row class="text-center">
            <v-col cols="12">
                <h1 class="display-2 font-weight-bold mb-6">Profile</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="d-flex justify-center align-center">
                <div> {{user.displayName}} </div>
            </v-col>
        </v-row>
        <v-row cols="12" class="d-flex justify-center align-center">
                <div> {{user.email}} </div>
        </v-row>
        &nbsp;&nbsp;
        &nbsp;&nbsp;
        <v-row cols="12" class="d-flex justify-center align-center">                
                <v-img 
                :src=user.photoURL
                max-height="150"
                max-width="250"
                ></v-img>
        </v-row>
    </v-container>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default {
    data: () => ({
        user: {}
    }),

    methods: {
        authStateChanged() {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // User is signed in, see docs for a list of available properties 
                    // https://firebase.google.com/docs/reference/js/firebase.User 
                    console.log(user);
                    this.user = user;
                    // ... 
                } else {
                    
                    // User is signed out 
                    // ... 
                }
            });
        },


    },
    watch: {},
    computed: {},
    mounted() {
        this.authStateChanged();
    },
};
</script>

<style>
</style>