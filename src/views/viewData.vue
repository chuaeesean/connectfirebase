<template>
    <div class="container">
        <div class="container" style="text-align: left;" v-if="contentViewable">
            <div class="row" style="text-align: center">
                <div v-if="contentLocked">
                    <i class="fa-duotone fa-lock mr-2"/>
                    The content is locked & protected from others to view. 
                </div>
                <div v-else>
                    <button v-if="linkCopiedBtn" class="btn btn-success btn-sm m-1">
                        Link Copied!
                    </button>
                    <button v-else @click="copyLink()" class="btn btn-primary btn-sm m-1">
                        Copy Link
                    </button>
                    <button @click="shareLink()" class="btn btn-light btn-sm">
                        Share
                    </button>
                </div>
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
        viewLink: "",
        linkCopiedBtn: false,
    }),
    methods: {
        copyLink() {
                let writeValue = "https://caller-record.web.app" + this.$route.fullPath
                navigator.clipboard.writeText(writeValue)
                this.linkCopiedBtn = true
                setTimeout(() => {
                    this.linkCopiedBtn = false
                }, 1500)
        },
        shareLink() {
                navigator.share({
                    url: "https://caller-record.web.app" + this.$route.fullPath,
                    title: this.groupName,
                    text: "Take a look on this group's data. "
                })
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
                this.viewLink = this.$route.fullPath
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