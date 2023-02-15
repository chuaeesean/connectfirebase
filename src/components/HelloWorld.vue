<template>
  <div>
<div v-if="signOut" class="container-fluid justify-content-md-center">
  <div style="width: 100%">
      <i class="fa-duotone fa-10x fa-right-to-bracket" />
  </div>
    <div style="width: 100%">
        <h1>Login to "connectFirebase"</h1>
        <p>Press the login button above to proceed. </p>
    </div>
</div>
      <div v-if="loginInfo" class="container">
          <div>
              <h1>Welcome {{' '+userEmail}}</h1>
          </div>
          <center>
          <div class="justify-content-md-center">
                  <div class="justify-content-md-center" v-for="collectionGroupData in collectionGroupDatas" :key="collectionGroupData.id">
                  <div style="width: 40%; cursor:pointer;" class="card m-2 justify-content-start">
                      <div class="card card-header">
                        <div class="row">
                            <div style="text-align: left;" class="col">
                                <h5 style="font-weight: bold" v-text="collectionGroupData.name"/>
                            </div>
                            <div style="text-align: right;" class="col">
                                <button @click="$router.push(collectionGroupData.link)" class="btn btn-light">
                                    <i class="fa-duotone fa-folder-open"/>
                                </button>
                                <button @click="openDeletePage(collectionGroupData.deleteLink)" class="btn btn-outline-danger">
                                    <i class="fa-duotone fa-trash" />
                                </button>
                            </div>
                        </div>
                      </div>
                      <div class="card card-body">
                        <a class="link-dark" @click="$router.push(collectionGroupData.link)" v-text="collectionGroupData.id" />
                      </div>
                  </div>
              </div>
          </div>
          </center>
      </div>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
name: 'HelloWorld',
  data: () => ({
      loginInfo: false,
      signOut: true,
      userEmail: "",
      collectionGroupDatas: []
  }),
  methods: {
    openDeletePage(item) {
        window.open(item, "deletePage", "height=700,width=700")
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user !== null) {
            this.userEmail = user.email
            this.loginInfo = true
            this.signOut = false
            firebase.firestore().collection("markGroup").where("createdEmail", "==", user.email).onSnapshot((querySnap) => {
                this.collectionGroupDatas = []
                querySnap.forEach((data) => {
                    let dataPush = {
                        name: data.data().name,
                        email: data.data().createdEmail,
                        id: data.id,
                        link: "/group#"+data.id,
                        deleteLink: "/deletegroup#"+data.id
                    }

                    this.collectionGroupDatas.push(dataPush)
                })
            })
        }
        else {
            this.loginInfo = false
            this.signOut = true
        }
    })
  }
}
</script>
