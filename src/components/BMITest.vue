<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1 class="display-2 font-weight-bold mb-3 green123">
          Welcome to BMI
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" class="d-flex justify-center align-center">
        <template>
          <v-card>
            <v-card-title>
              BMI
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="bmiTable" :search="search">
              <template v-slot:[`item.desc`]="{ item }">
                <v-chip :color="item.color" dark>
                  {{ item.desc }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card>
        </template>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex justify-center align-center">
        <v-chip v-if="bmi != 0" x-large :color="getColor(bmi)" dark>
          {{ bmi }}
        </v-chip>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center align-center">
      <v-col cols="8">
        <template>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="w"
              :counter="5"
              :rules="wRules"
              label="Weight"
              required
              type="number"
            ></v-text-field>
            <v-text-field
              v-model="h"
              :counter="5"
              :rules="hRules"
              label="Height"
              required
              type="number"
            ></v-text-field>
            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="validate"
            >
              Calculate BMI
            </v-btn>
          </v-form>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    w: 0,
    wRules: [
      (v) => !!v || "Weight is required",
      (v) =>
        (v && v > 0 && v < 300) ||
        "Weight must be more than 0 KG and less than 300 KG",
    ],
    h: 0,
    hRules: [
      (v) => !!v || "Height is required",
      (v) =>
        (v && v > 10 && v < 250) ||
        "Height must be more than 10 cm and less than 250 cm",
    ],

    search: "",
    headers: [
      {
        text: "BMI kg/m2",
        value: "rule",
      },
      {
        text: "อยู่ในเกณฑ์",
        value: "desc",
      },
      {
        text: "ภาวะเสี่ยงต่อโรค",
        value: "risk",
      },
    ],

    bmi: 0,

    bmiTable: [
      {
        rule: "น้อยกว่า18.50",
        desc: "น้ำหนักน้อย/ผอม",
        risk: "มากกว่าคนปกติ",
        color: "orange",
      },
      {
        rule: "ระหว่าง18.50-22.90",
        desc: "ปกติ(สุขภาพดี)",
        risk: "เท่าคนปกติ",
        color: "green",
      },
      {
        rule: "ระหว่าง23-24.90",
        desc: "ท้วม/โรคอ้วนระดับ1",
        risk: "อันตรายระดับ1",
        color: "red",
      },
    ],
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        if (this.h > 0) {
          this.bmi = (this.w / ((this.h / 100) * (this.h / 100))).toFixed(2);
          console.log(this.bmi);
        }
      } else {
        alert("Form not valid");
      }
    },

    getColor(bmi) {
      if (bmi < 18.5) return "orange";
      else if (bmi >= 18.5 && bmi < 23) return "green";
      else return "red";
    },
  },
};
</script>

<style>
.green123 {
  color: greenyellow;
}
</style>
