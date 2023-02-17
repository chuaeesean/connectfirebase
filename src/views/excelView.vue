<template>
    <div class="container">
        <div class="container" style="text-align: left;" v-if="contentViewable">
            <div class="row">
                <h1 @click="closeWindow()" style="cursor: pointer" v-text="groupName" />
                <p style="opacity: 80%" v-text="groupID" />
                <export-excel @click="closeWindow()" style="width: 100pt" :data = "recordDatas" :fields = "excelHeader" :worksheet = "groupName" :name= "groupName+'.xls'" class="btn btn-success">
                    export as Excel
                </export-excel>
                <export-excel @click="closeWindow()" style="width: 100pt; margin-left: 2pt;" type="csv" :data = "recordDatas" :fields = "excelHeader" :worksheet = "groupName" :name= "groupName+'.csv'" class="btn btn-primary">
                    export as CSV
                </export-excel>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Marks</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="recordData in recordDatas" :key="recordData.id">
                        <th scope="row" v-text="recordData.name" />
                        <td style="font-size: 1.5rem; font-weight: bold" v-text="recordData.marks" />
                    </tr>
                </tbody>
            </table>
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
        recordDatas: [],
        userEmail: "",
        contentViewable: true,
        contentLocked: false,
        groupName: "",
        groupID: "",
        viewLink: "",
        linkCopiedBtn: false,
        notFound: false,
        excelHeader: {'name':"name", 'marks':"marks"}
    }),
    methods: {
        closeWindow() {
            setTimeout(() => {
                window.close()
            }, 250)
        }
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user !== null) {
                this.userEmail = user.email
            }
        })

        let Hash = this.$route.hash.split("#").join("")
        setTimeout(() => {
            firebase.firestore().collection("markGroup").doc(Hash).get().then((data) => {
                this.groupName = data.data().name
                this.groupID = data.id
                this.viewLink = this.$route.fullPath

                if (data.exists === false) {
                    this.notFound = true
                }

                if (data.data().view === false) {
                    this.contentLocked = true
                    if (data.data().createdEmail !== this.userEmail) {
                        this.contentViewable = false
                    }
                }

                firebase.firestore().collection("markRecord").where("group", "==", this.$route.hash).onSnapshot((querySnap) => {
                    this.recordDatas = []
                    querySnap.forEach((data) => {
                        let dataPush = {
                            name: data.data().name,
                            group: data.data().group,
                            marks: data.data().marks,
                            id: data.id
                        }
                        this.recordDatas.push(dataPush)
                    })
                })
            }, 100)
        })

    }
}
</script>