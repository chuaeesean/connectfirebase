<template>
    <div class="container">
        <div class="container" v-if="exists">
        <div class="card" v-if="contentViewable">
            <div style="font-family: Avenir, Helvetica, Arial, sans-serif;" class="card-header">
                <h3 v-if="canDelete">Do you want to delete the following group? <b>{{ groupName+' - '+$route.hash.split("#").join("") }}</b></h3>
                <h3 v-else>The current group can't be deleted.</h3>
            </div>
            <div class="card-body">
                <button @click="deleteGroup()" v-if="canDelete" class="btn btn-danger btn-lg">
                    Delete
                </button>
                <p style="font-weight: bold;" v-if="canDelete">
                    The entire group can't be recovered from the moment you deleted it. <a style="cursor: pointer; font-size: 1.5rem; font-family: Avenir, Helvetica, Arial, sans-serif;" @click="cancelDelete()" class="link-danger">Press here to cancel</a>
                </p>
                <p v-else>To prevent data-loss, please make sure to delete all the user data in the group before deleting the group. 
                    <a style="cursor: pointer; font-size: 1.5rem; font-family: Avenir, Helvetica, Arial, sans-serif;" @click="cancelDelete()" class="link-danger">OK</a>
                </p>
            </div>
        </div>
        <div class="container justify-content-md-center" v-else>
            <div class="container justify-content-md-center m-3">
                <i class="fas fa-ban fa-10x" />
            </div>
            <div class="container justify-content-md-center m-2">
                <h3>You're not allowed to view this group.</h3>
            </div>
            <div class="container justify-content-md-center m-2">
                <p>Please contact the owner of the group. </p>
            </div>
        </div>
        </div>
        <div class="container justify-content-md-center" v-else>
            <div class="container justify-content-md-center m-3">
                <i class="fa-duotone fa-file-xmark fa-10x" />
            </div>
            <div class="container justify-content-md-center m-2">
                <h3>Error 404 Not Found</h3>
            </div>
            <div class="container justify-content-md-center m-2">
                <p>The current page isn't available in this server.</p>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';
export default {
    data: () => ({
        userEmail: "",
        canDelete: false,
        contentViewable: false,
        exists: false,
        groupName: ""
    }),
    methods: {
        userCheck() {
            let Hash = this.$route.hash.split("#").join("")
            firebase.firestore().collection("markGroup").doc(Hash).get().then((result) => {
                if (result.data().createdEmail === this.userEmail) {
                    this.contentViewable = true
                    this.groupName = result.data().name
                }
                if (result.data().group === true) {
                    this.exists = true
                }
            })
            firebase.firestore().collection("markRecord").where("group", "==", this.$route.hash).onSnapshot((querySnap)=> {
                if (querySnap.empty === true) {
                    this.canDelete = true
                }
            })
        },
        deleteGroup() {
            let Hash = this.$route.hash.split("#").join("")
            firebase.firestore().collection("markGroup").doc(Hash).delete()
            setTimeout(() => {
                window.close()
            }, 500)
        },
        cancelDelete() {
            window.close()
        }
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user !== null) {
                this.userEmail = user.email
                this.userCheck()
            }
        })

    }
}
</script>