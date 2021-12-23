<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1 class="display-2 font-weight-bold mb-3 green123">
          Welcome to CRUD with Firestore
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-center align-center">
        <template>
          <v-card>
            <v-card-title>
              BMI History
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>

            <v-data-table
              :headers="headers"
              :items="bmiTable"
              :loading="!bmiTable.length"
              :search="search"
            >
              <template slot="progress">
                <v-progress-linear
                  color="red"
                  indeterminate
                ></v-progress-linear>
              </template>

              <template v-slot:[`item.date`]="{ item }">
                {{ formatTimestamp(item.date) }}
              </template>

              <template v-slot:[`item.bmi`]="{ item }">
                <v-chip v-if="item.bmi != 0" :color="getColor(item.bmi)" dark>
                  {{ item.bmi }}
                </v-chip>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <v-icon large color="yellow darken-2" @click="editItem(item)"
                  >mdi-pencil-outline
                </v-icon>

                <v-icon large color="red darken-2" @click="deleteItem(item)"
                  >mdi-close-circle
                </v-icon>
              </template>
            </v-data-table>
          </v-card>
        </template>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card class="card-shadow card-padding">
            <v-card-title
              >คุณแน่ใจว่าต้องการลบ ({{ itemSelected.bmi }})</v-card-title
            >
            <v-card-actions class="pb-0">
              <v-spacer></v-spacer>
              <v-btn @click="closeDelete" color="yellow">Cancel</v-btn>

              <v-btn @click="deleteItemConfirm(itemSelected)" color="error"
                >Ok</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
            <br />
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-center align-center">
        <template>
          <v-btn
            @click="
              editedIndex = '-1';
              dialog = true;
            "
            color="success"
            >เพิ่มข้อมูล</v-btn
          >
        </template>

        <v-dialog v-model="dialog" max-width="800px">
          <v-card class="card-shadow">
            <v-card-title>{{ formTitle }}</v-card-title>

            <v-card-text class="card-padding">
              <v-container class="px-0">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <br />

                  <v-row>
                    <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.firstname"
                        :counter="20"
                        :rules="firstnameRules"
                        label="firstname"          
                        required
                      ></v-text-field>
                    </v-col>

                        <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.lastname"
                        :counter="20"
                        :rules="lastnameRules"
                        label="lastname"          
                        required
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.bmi"
                        :counter="3"
                        :rules="bmiRules"
                        label="ค่า BMI"
                        type="number"
                        required
                      ></v-text-field>
                    </v-col>
                    
    <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.email"
                        :counter="20"
                        :rules="emailRules"
                        label="email"          
                        required
                      ></v-text-field>
                    </v-col>

                    
                    <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.gender"
                        :counter="20"
                        :rules="genderRules"
                        label="gender"          
                        required
                      ></v-text-field>
                      </v-col>
                    <!-- <v-col cols="12" class="col-md-4 col-sm-12">
                      <v-text-field
                        v-model="editedItem.Tel"
                        :counter="10"
                        label="Tel"
                      ></v-text-field>
                    </v-col> -->
                  </v-row>

                  <br />
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions class="card-padding d-flex justify-center">
              <v-btn @click="close" color="error">ยกเลิก</v-btn>

              <v-btn
                v-if="editedIndex == -1"
                :disabled="!valid"
                @click="validate"
                color="success"
                >เพิ่มข้อมูล</v-btn
              >
              <v-btn v-else @click="validate" color="success"
                >ปรับปรุงข้อมูล</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  addDoc, 
  doc, deleteDoc, setDoc,Timestamp
} from "firebase/firestore";

import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

export default {
  data: () => ({
    bmiTable: [
      {
        firstname: "วรรณ์ชนะ",
        lastname: "ศรีเพชร์",
        bmi: 21,
        email: "ice108118@gmail.com",
        gender: "ชาย",
   
      },
      {
        firstname: "วรรณ์ชนะ",
        lastname: "ศรีเพชร์",
        bmi: 21,
        email: "ice108118@gmail.com",
        gender: "ชาย",
   
      },
      {
        firstname: "วรรณ์ชนะ",
        lastname: "ศรีเพชร์",
        bmi: 21,
        email: "ice108118@gmail.com",
        gender: "ชาย",
   
      },
    ],

    search: "",
    headers: [
      {
        text: "firstname",
        value: "firstname",
      },
        {
        text: "lastname",
        value: "lastname",
      },
      {
        text: "BMI",
        value: "bmi",
      },
      
      {
        text: "email",
        value: "email",
      },
       {
        text: "gender",
        value: "gender",
      },
      { text: "Actions", align: "center", value: "actions", sortable: false },
    ],

    valid: true,
    bmi: 0,
    bmiRules: [
      (v) => !!v || "BMI is required",
      (v) => (v && v > 0 && v < 100) || "BMI more than 0 and less than 100",
    ],
    
    note: "",
    firstnameRules: [(v) => !!v || "Firstname is required"],
    lastnameRules: [(v) => !!v || "Lastname is required"],
    genderRules: [(v) => !!v || "gender"],
emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],

    dateRules: [(v) => !!v || "Date is required"],
    

    dialog: false,
    dialogDelete: false,
    menu: false,
    modal: false,
    editedIndex: -1,
    itemSelected: {},
    db : getFirestore(),


    editedItem: {
      bmi: 10,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      note: "",
    },

    defaultItem: {
      bmi: 10,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      note: "",
    },




  }),

  methods: {
    getColor(bmi) {
      if (bmi < 18.5) return "orange";
      else if (bmi >= 18.5 && bmi < 23) return "green";
      else return "red";
    },
    SignInAnonymously() { const auth = getAuth(); 
    signInAnonymously(auth) 
    .then(() => { 
      // Signed in.. 
      }) 
      .catch((error) => { 
        console.log(error); 
        // ... 
        });   
    },

    authStateChanged() { 
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => { 
        if (user) { 
          // User is signed in, see docs for a list of available properties 
          // https://firebase.google.com/docs/reference/js/firebase.User 
          console.log(user); 
          // ... 
          } else { 
            // User is signed out 
            // ... 
          } 
      }); 
    },


    validate() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex == -1) {
          this.createItem();
        } else {
          this.updateItem();
        }
        this.getItemFromAPI();
        console.log(this.bmiTable);
        this.close();
      } else {
        alert("Form not valid");
      }
    },

    readItem() {
      if (localStorage.getItem("bmi") != null) {
        this.bmiTable = JSON.parse(localStorage.getItem("bmi"));
      }

      console.log(this.bmiTable);
    },

   async getItemFromFirestore() {
      console.log("get and sync");



      const q = query(collection(this.db, "bmiTable"), where("bmi", ">", 0));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        this.bmiTable = [];
        var tmp = {};
        querySnapshot.forEach((doc) => {
          tmp = Object.assign({ uid: doc.id }, doc.data());
          tmp.date = new Date(tmp.date.toDate()).toISOString().substr(0, 10),
            this.bmiTable.push(tmp);
        });
      });
      console.log(this.bmiTable);
      console.log(unsubscribe);
    },
async createItem() {
          this.editedItem.bmi = parseInt(this.editedItem.bmi);         

          this.editedItem.date = Timestamp.fromDate(new Date(this.editedItem.date));

          const docRef = await addDoc(collection(this.db, "bmiTable"), this.editedItem);
          console.log("Document written with ID: ", docRef.id);
        },
editItem(item) {
        this.editedIndex = item.uid;
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
async updateItem() {
        this.editedItem.bmi = parseInt(this.editedItem.bmi);
        this.editedItem.date = Timestamp.fromDate(new Date(this.editedItem.date));
        await setDoc(doc(this.db, "bmiTable", this.editedIndex), this.editedItem);
},
deleteItem(item) {
        this.itemSelected = item;
        this.editedIndex = item.uid;
        console.log(this.editedIndex);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },
async deleteItemConfirm() {    
        await deleteDoc(doc(this.db, "bmiTable", this.editedIndex));
        console.log("Delete");
        this.closeDelete();
      },

    close() {
      this.dialog = false;
      this.clearItem();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.clearItem();
    },

    clearItem() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.itemSelected = {};
      console.log(this.editedIndex);
    },

    formatTimestamp(t) {

      // return t.toDate().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
      if (t instanceof Date) {
        return t
          .toDate()
          .toLocaleDateString("th-TH", { timeZone: "Asia/Bangkok" });
      } else {
        return t;
      }
    },
  },
  watch: {
    editedIndex(val) {
      console.log(val);
    },
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล";
    },
  },
  mounted() {
    // this.readItem();
    this.SignInAnonymously(); 
    this.authStateChanged();
    this.getItemFromFirestore();
    
  },
};
</script>

<style>
.green123 {
  color: green;
}
</style>
