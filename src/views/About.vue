<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="6" class="about">
        <v-card class="about__card">
          <v-card-title class="title">{{ appname }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <p class="subhedding">バージョン:{{ version }}</p>
          </v-card-text>

          <v-btn small color="primary" @click="$router.go(-1)">go back</v-btn>
        </v-card>
      </v-col>
      <!-- <v-flex lg6 sm12 xs12>
        <v-card>
          <v-card-title class="font-weight-bold">This is an about page2</v-card-title>
          <v-card-text>
            <a @click="$router.go(-1)">go back</a>
          </v-card-text>

          <v-btn color="primary" @click="$router.go(-1)">go back</v-btn>
        </v-card>
      </v-flex>
      <v-flex lg7 sm12 xs12>
        <plain-table></plain-table>
      </v-flex>
      <v-flex lg5 sm12 xs12>
        <plain-table-order></plain-table-order>
      </v-flex>
      <v-flex lg12 sm12 xs12>
        <post-list-card :items="posts"></post-list-card>
      </v-flex> -->
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({ name: 'About' })
export default class About extends Vue {
  appname = process.env.VUE_APP_APPLICATION_NAME;

  version = process.env.VUE_APP_VERSION;
}
</script>

<style lang="scss" scoped>
.about {
  &__card {
    max-width: 600px;
  }
}
</style>
