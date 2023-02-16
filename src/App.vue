<template>
  <div id="app">
    <nav v-if="$route.path !== '/adduser'" v-show="$route.path !== '/deletegroup'" class="navbar navbar-expand-xxl navbar-light justify-content-md-center bg-light">
      <div style="height: 30pt" class="container align-content-center">
        <button id="menuBtn" class="btn btn-light btn-lg navbar-brand" type="button" data-bs-toggle="offcanvas"
          data-bs-target="#menuOffcanva" aria-controls="menuOffcanva">
          <i class="fas fa-lg fa-bars" />
        </button>
        <button @click="$router.push('/')" class="btn btn-light btn-lg" type="button">
          connectFirebase
        </button>
        <div class="d-flex">
          <button v-show="logout" @click="login()" class="btn btn-outline-primary btn-lg" :disabled="processingLogin"
            type="button">
            <div v-if="processingLogin" class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            login
          </button>
          <button v-show="loginInfo" type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#accountModal">
            <img width="40" style="border-radius: 100%;" :src="currentImageUrl">  
          </button>
          <div class="modal fade" id="accountModal" tabindex="-1" aria-labelledby="accountModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="accountModalLabel">Account</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  Username: {{ currentUsername }} - {{ currentEmail }}
                </div>
                <div class="modal-footer">
                  <button v-show="loginInfo" @click="signOut()" class="btn btn-outline-success btn-lg">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="offcanvas offcanvas-start" id="menuOffcanva" tabindex="-1" aria-labelledby="menuOffcanva">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasExampleLabel">Menu</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <button @click="backHome()" v-if="$route.fullPath === '/'" type="button" style="width: 100%"
          class="btn btn-primary">Home</button>
        <button @click="backHome()" v-else type="button" style="width: 100%" class="btn btn-light">Home</button>
        <button @click="$router.push('/new')" v-if="$route.fullPath === '/new'" type="button" style="width: 100%"
          class="btn btn-primary">New Group</button>
        <button @click="$router.push('/new')" v-else type="button" style="width: 100%" class="btn btn-light">New
          Group</button>
          <button @click="$router.push('/about')" v-if="$route.fullPath === '/about'" type="button" style="width: 100%"
          class="btn btn-primary">About</button>
        <button @click="$router.push('/about')" v-else type="button" style="width: 100%" class="btn btn-light">About</button>
        <button @click="openViewMode()" v-show="$route.path === '/group'" type="button" style="width: 100%" class="btn btn-light">Open in view mode</button>
        <button @click="openGroupMode()" v-show="$route.path === '/view'" type="button" style="width: 100%" class="btn btn-light">Open in group mode</button>
      </div>
    </div>
    <router-view style="margin-top: 3%" />
</div>
</template>

<script>
import firebase from "firebase";
export default {
  data: () => ({
    loginInfo: false,
    logout: true,
    processingLogin: false,
    currentEmail: "",
    currentUsername: "",
    currentImageUrl: ""
  }),
  methods: {
    login() {
      this.processingLogin = true
      let googleProvider = new firebase.auth.GoogleAuthProvider
      firebase.auth().signInWithPopup(googleProvider).then(() => {
        this.loginInfo = true
        this.logout = false
        if (this.$route.hash !== '') {
          this.$router.push("/group" + this.$route.hash)
        }
      })
        .catch((e) => {
          console.warn(e)
          this.processingLogin = false
        })
    },
    signOut() {
      firebase.auth().signOut()
      window.location.href = "/"
    },
    backHome() {
      this.$router.push("/")
    },
    openViewMode() {
      this.$router.push("/view"+this.$route.hash)
    },
    openGroupMode() {
      this.$router.push("/group"+this.$route.hash)
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        this.loginInfo = true
        this.logout = false
        this.currentEmail = user.email
        this.currentUsername = user.displayName
        this.currentImageUrl = user.photoURL
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
  font-family: 'JetBrains Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
};
</style>