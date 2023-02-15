<template>
  <div id="app">
    <nav class="navbar navbar-expand-xxl navbar-light justify-content-md-center bg-light">
      <div style="height: 30pt" class="container align-content-center">
          <button class="btn btn-light navbar-brand btn-lg" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuOffcanva" aria-controls="menuOffcanva">
              <i class="fas fa-lg fa-bars" />
          </button>
          <div class="d-flex">
              <button v-show="logout" @click="login()" class="btn btn-outline-primary btn-lg" type="button">
                  login
              </button>
              <button v-show="loginInfo" @click="signOut()" class="btn btn-outline-success btn-lg">Logout</button>
          </div>
      </div>
  </nav>
  <div class="offcanvas offcanvas-start" id="menuOffcanva" tabindex="-1"  aria-labelledby="menuOffcanva">
        <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasExampleLabel">Menu</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
           <button @click="backHome()" v-if="$route.fullPath === '/'" type="button" style="width: 100%" class="btn btn-primary">Home</button>
           <button @click="backHome()" v-else type="button" style="width: 100%" class="btn btn-light">Home</button>
           <button @click="$router.push('/new')" v-if="$route.fullPath === '/new'" type="button" style="width: 100%" class="btn btn-primary">New Group</button>
           <button @click="$router.push('/new')" v-else type="button" style="width: 100%" class="btn btn-light">New Group</button>
        </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
    data: () => ({
        loginInfo: false,
       logout: true,
    }),
    methods: {
        login() {
            let googleProvider = new firebase.auth.GoogleAuthProvider
            firebase.auth().signInWithPopup(googleProvider).then(() => {
                this.loginInfo = true
                this.logout = false
            })
        },
        signOut() {
            firebase.auth().signOut()
            window.location.reload()
        },
        backHome() {
          this.$router.push("/")
        }
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user !== null) {
                this.loginInfo = true
                this.logout = false
            }
            else {
                this.loginInfo = false
                this.logout = true
            }
        })

    }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>