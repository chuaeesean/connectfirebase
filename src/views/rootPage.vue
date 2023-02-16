<template>
    <div class="container justify-content-md-center">
        <div class="container" v-if="contentViewable">
            <div class="container justify-content-md-center">
                <button v-if="contentEditable" @click="addData()" type="button" class="btn btn-primary btn-sm">
                    Add user
                </button>
            </div>
            <div class="container" style="width: 80%">
            <div style="width: 100%;" class="mt-4" v-for="recordData in recordDatas" :key="recordData.id">
                <div style="width: 100%" class="d-flex card m-2">
                    <div class="card-header">
                        <div class="row">
                            <div class="col">
                                <h4 v-if="contentEditable" @click="editID = recordData.id, editName = recordData.name, editMarks = recordData.marks, editData()" style="font-family: Avenir, Helvetica, Arial, sans-serif; cursor: pointer; font-weight: bold;" v-text="recordData.name" />
                                <h4 v-else style="font-family: Avenir, Helvetica, Arial, sans-serif;" v-text="recordData.name" />
                                <p style="opacity: 80%; font-size: 0.8rem;" v-text="recordData.id" />
                            </div>
                        </div>
                    </div>
                    <div id="cardBody" class="card-body" style="display: flex; text-align: center;">
                        <div class="container">
                            <div class="row">
                                <div class="col">
                                    <button v-if="contentEditable" @click="deleteID = recordData.id, deleteName = recordData.name, confirmDelete()" id="deleteBtn" class="btn btn-danger btn-sm">
                                        <i class="fa-duotone fa-trash"></i>
                                    </button>
                                </div>
                                <div class="col">
                                    <button v-if="contentEditable" @click="editID = recordData.id, editName = recordData.name, editMarks = recordData.marks - 1, changeMarks()" class="btn btn-light btn-sm" type="button">
                                        <i class="fas fa-minus" />
                                    </button>
                                </div>
                                <div class="col">
                                    <p v-if="contentEditable" @click="editID = recordData.id, editName = recordData.name, editMarks = recordData.marks, setMarks()" v-text="recordData.marks" style="cursor:pointer" />
                                    <p v-else v-text="recordData.marks"/>
                                </div>
                                <div class="col">
                                    <button v-if="contentEditable" @click="editID = recordData.id, editName = recordData.name, editMarks = recordData.marks + 1, changeMarks()" class="btn btn-light btn-sm" type="button">
                                        <i class="fas fa-plus"/>
                                    </button>
                                </div>
                                <div class="col"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
import firebase from "firebase";

export default {
    data: () => ({
        recordDatas: [],
        currentUserEmail: "",
        contentViewable: true,
        contentEditable: true,
        addUser: "",
        saveUserBtnText: "Add user",
        btnDisabled: false,
        inputDisabled: true,
        deleteID: "",
        deleteName: "",
        editID: "",
        editName: "",
        editMarks: 0
    }),
    methods: {
        getData() {
            let Route = this.$route.hash
            firebase.firestore().collection("markRecord").where("group", "==", Route).onSnapshot((querySnap) => {
                this.recordDatas = []
                querySnap.forEach((data) => {
                    let dataPush = {
                        id: data.id,
                        name: data.data().name,
                        marks: data.data().marks,
                    }
                    this.recordDatas.push(dataPush)
                })
            })
        },
        confirmDelete() {
            let confirm = window.confirm("Do you want to delete the following user: "+this.deleteID+" - "+this.deleteName + ".")
            if (confirm === true) {
                firebase.firestore().collection("markRecord").doc(this.deleteID).delete()
                setTimeout( () => {
                    this.deleteID = ""
                    this.deleteName = ""
                }, 100)
            }
            else if (confirm === false) {
                setTimeout( () => {
                    this.deleteID = ""
                    this.deleteName = ""
                }, 100)
            }
        },
        editData() {
            let prompt = window.prompt("Type a new name to replace the following: "+this.editID+this.editName)
            if (prompt !== null) {
                let addData = {
                    name: prompt,
                    marks: this.editMarks,
                    group: this.$route.hash
                }
                firebase.firestore().collection("markRecord").doc(this.editID).set(addData)
                setTimeout(() => {
                    this.editID = ""
                    this.editMarks = ""
                    this.editName = ""
                }, 100)
            }
        },
        setMarks() {
            let prompt = window.prompt("Type a new name to replace the following: "+this.editID+" - "+this.editName)
            if (prompt !== null) {
                let addData = {
                    name: this.editName,
                    marks: parseInt(prompt, 10),
                    group: this.$route.hash
                }
                firebase.firestore().collection("markRecord").doc(this.editID).set(addData)
                setTimeout(() => {
                    this.editID = ""
                    this.editMarks = ""
                    this.editName = ""
                }, 100)
            }
        },
        addData() {
            let Hash = this.$route.hash
            window.open("/adduser"+Hash, "adduser", "height=400,width=400")
        }, 
        changeMarks() {
            let addData = {
                    name: this.editName,
                    marks: this.editMarks,
                    group: this.$route.hash
                }
                firebase.firestore().collection("markRecord").doc(this.editID).set(addData)
                setTimeout(() => {
                    this.editID = ""
                    this.editMarks = ""
                    this.editName = ""
                }, 100)
        },
        userCheck() {
            let Hash = this.$route.hash.split("#").join("")
            firebase.firestore().collection("markGroup").doc(Hash).get().then((result) => {
                if (result.data().createdEmail !== this.currentUserEmail) {
                    this.contentEditable = false
                    if (result.data().view !== true) {
                        this.contentViewable = false
                    }
                }
            })
        },
        refreshPage() {
            setTimeout(() => {
                window.location.reload()
            }, 500)
        }
    },
    mounted() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user !== null) {
                this.currentUserEmail = user.email
                this.getData()
                setTimeout(() => {
                    this.userCheck()
                }, 200)
            }
            else {
                this.$router.push("/"+this.$route.hash)
            }
        })
    }
}
</script>

<style scoped>
#editBtn {
    visibility: hidden;
    opacity: 80%;
    transition: 100ms;
}

#deleteBtn {
    visibility: hidden;
    opacity: 80%;
    transition: 100ms;
}

#cardBody:hover #editBtn{
    visibility: visible;
    transition: 100ms;
}

#cardBody:hover #deleteBtn {
    visibility: visible;
    transition: 100ms;
}
</style>