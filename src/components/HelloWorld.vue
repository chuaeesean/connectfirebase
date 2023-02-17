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
                <h1 v-if="selected">{{ changeNameData + ' is selected. ' }}</h1>
                <div v-else>
                    <h1 class="projectText">Your Groups</h1>
                </div>
            </div>
            <div>
                <div class="btn-group">
                    <button v-if="selected" class="btn btn-secondary btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Options
                    </button>
                    <ul v-if="selected" class="dropdown-menu">
                        <li style="font-family: Avenir, Helvetica, Arial, sans-serif;"><a class="dropdown-item" @click="$router.push(selectedLink)">Open</a></li>
                        <li style="font-family: Avenir, Helvetica, Arial, sans-serif;"><a class="dropdown-item" @click="openWindow(selectedDeleteLink)">Delete</a></li>
                        <li style="font-family: Avenir, Helvetica, Arial, sans-serif;"><a class="dropdown-item" @click="openWindow(selectedPrintLink)">Print</a></li>
                        <li style="font-family: Avenir, Helvetica, Arial, sans-serif;"><a class="dropdown-item" @click="openWindow('/excel#'+changeNameID)">Export</a></li>
                        <li style="font-family: Avenir, Helvetica, Arial, sans-serif;" v-if="changeNameView"><a @click="changeNameView = false, changeView()" class="dropdown-item">Set Group Protected</a></li>
                        <li style="font-family: Avenir, Helvetica, Arial, sans-serif;" v-else><a @click="changeNameView = true, changeView()" class="dropdown-item" >Set Group Visible</a></li>
                        <li style="font-family: Avenir, Helvetica, Arial, sans-serif;"><a @click="clearSelectedData" class="dropdown-item" >Cancel Selection</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li>{{ changeNameID }}</li>
                    </ul>
                </div>
            </div>
            <center>
                <div class="justify-content-md-center">
                    <div class="justify-content-md-center" v-for="collectionGroupData in collectionGroupDatas"
                        :key="collectionGroupData.id">
                        <div style="width: 80%; cursor:pointer;" class="card m-2 justify-content-start">
                            <div class="card card-header">
                                <div class="row">
                                    <div style="text-align: left;" class="col">
                                        <h5 @click="changeNameView = collectionGroupData.view, changeNameData = collectionGroupData.name, changeNameID = collectionGroupData.id, changeName()"
                                            style="font-weight: bold; font-family: Avenir, Helvetica, Arial, sans-serif;"
                                            v-text="collectionGroupData.name" />
                                    </div>
                                    <div style="text-align: right;" class="col">
                                        <button @click="selected = true,selectedLink = collectionGroupData.link, selectedDeleteLink = collectionGroupData.deleteLink, selectedPrintLink = collectionGroupData.printLink, changeNameView = collectionGroupData.view, changeNameData = collectionGroupData.name, changeNameID = collectionGroupData.id" class="btn btn-light">
                                            <i class="fa-duotone fa-square-check" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="card card-body">
                                <div class="row">
                                    <div class="col">
                                        <a class="link-dark" @click="$router.push(collectionGroupData.link)"
                                            v-text="collectionGroupData.id" />
                                    </div>
                                </div>
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
        collectionGroupDatas: [],
        changeNameData: "",
        changeNameID: "",
        changeNameView: "",
        selected: false,
        selectedLink: "",
        selectedDeleteLink: "",
        selectedPrintLink: ""
    }),
    methods: {
        openWindow(item) {
            window.open(item, "deletePage", "height=700,width=700")
        },
        changeName() {
            let newValue = window.prompt("Enter a new name to replace the following group: " + this.changeNameData + " - " + this.changeNameID)
            if (newValue !== null) {
                let setData = {
                    name: newValue,
                    group: true,
                    view: this.changeNameView,
                    createdEmail: this.userEmail
                }
                firebase.firestore().collection("markGroup").doc(this.changeNameID).set(setData)
                setTimeout(() => {
                    this.changeNameData = ""
                    this.changeNameID = ""
                    this.changeNameView = ""
                }, 500)
            }
        },
        clearSelectedData() {
            this.changeNameData = ""
            this.changeNameID = ""
            this.changeNameView = ""
            this.selected = false
            this.selectedLink = ""
            this.selectedDeleteLink
        },
        changeView() {
            let setData = {
                name: this.changeNameData,
                group: true,
                view: this.changeNameView,
                createdEmail: this.userEmail
            }
            firebase.firestore().collection("markGroup").doc(this.changeNameID).set(setData)
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
                            view: data.data().view,
                            id: data.id,
                            link: "/group#" + data.id,
                            printLink: "/print#"+data.id,
                            deleteLink: "/deletegroup#" + data.id
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