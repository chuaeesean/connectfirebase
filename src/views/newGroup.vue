<template>
    <div class="container">
        <div class="row">
            <h1>Create a new group</h1>
            <p style="opacity:80%;">feel free to type a nice name for your group. After that, press "Create". </p>
        </div>
        <select v-model="selectInput" class="form-select" aria-label="select">
            <option value="1" selected>Shared(open to others)</option>
            <option value="2">Locked(Only visible to you)</option>
        </select>
        <div class="input-group mt-3">
            <span class="input-group-text" id="basic-addon1">
                <i class="fas fa-plus" />
            </span>
            <input v-model="newGroupName" type="text" class="form-control" placeholder="Name" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <div class="row mt-4">
            <center>
            <button @click="createGroup()" style="width:100pt;" class="btn btn-success">
                Create
            </button>
            
            </center>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';
export default {
    data: () => ({
        selectInput: 1,
        newGroupName: "",
        currentEmail: ""
    }),
    methods: {
        createGroup() {
            if (this.newGroupName !== ""){
                let inputView = null
                if (this.selectInput === 1) {
                    inputView = true
                }
                else {
                    inputView = false
                }
                let addDatas = {
                name: this.newGroupName,
                group: true,
                createdEmail: this.currentEmail,
                view: inputView
            }
            firebase.firestore().collection("markGroup").add(addDatas)
            setTimeout(() => {
                this.$router.push("/")
            }, 500)
            }
        }
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user !== null) {
                this.currentEmail = user.email
            }
            else if (user === null) {
                this.$router.push("/")
            }
        })
    }
}
</script>