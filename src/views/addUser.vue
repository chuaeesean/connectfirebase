<template>
    <div style="text-align: center;" class="container">
        <div v-if="contentViewable" class="container">
        <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">@</span>
            <input v-model="addUser" type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <div class="row">
            <button @click="addData()" class="btn btn-primary btn-sm">
                Add user
            </button>
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
</template>

<script>
import firebase from 'firebase';
export default {
    data: () => ({
        userEmail: "",
        contentViewable: true,
        addUser: ""
    }),
    methods: {
        userCheck() {
            let Hash = this.$route.hash.split("#").join("")
            firebase.firestore().collection("markGroup").doc(Hash).get().then((result) => {
                if (result.data().createdEmail !== this.userEmail) {
                    this.contentViewable = false
                }
            })
        },
        addData() {
            if (this.addUser !== '') {
                let addDatas = {
                name: this.addUser,
                marks: 0,
                group: this.$route.hash
            }
            firebase.firestore().collection("markRecord").add(addDatas)
            setTimeout(() => {
                window.close()
            }, 500)
            }
        }, 
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user !== null) {
                this.userEmail = user.email
                this.userCheck()
            }
            else {
                this.userCheck()
            }
        })
    }
}
</script>