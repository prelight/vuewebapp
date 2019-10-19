<template>
  <div id="app">
    <v-app id="inspire">
      <v-content>
        <!--
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
              <v-card outlined class="login-card">
                <v-card-title class="align-center justify-center">
                  <img class="img pt-2" src="../static/logdash-logo.png" width="120" />
                </v-card-title>
                <v-toolbar flat color="white">
                  <v-row justify="center">
                    <v-toolbar-title>
                      <v-col>
                        <h6 class="title">
                          {{ $t('login.title') }}
                        </h6>
                      </v-col>
                    </v-toolbar-title>
                  </v-row>
                </v-toolbar>

                <v-card-text>
                  <v-form @submit.prevent="checkLogin()" id="login-form">
                    <div class="caption">
                      hint: demo
                    </div>
                    <v-text-field
                      prepend-icon="person"
                      v-model="username"
                      label="Username"
                      type="text"
                      autofocus
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="lock"
                      v-model="password"
                      label="Password"
                      id="password"
                      type="password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :loading="loading"
                    :disabled="loading"
                    type="submit"
                    form="login-form"
                    color="primary"
                    @click="loader = 'loading'"
                    >Login</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-snackbar v-model="message.text" :color="message.type" bottom>
            {{ message.text }}
            <v-btn dark flat @click="clearNotification()">
              Close
            </v-btn>
          </v-snackbar>
        </v-container>
        -->
      </v-content>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mapState, mapActions } from 'vuex';

@Component({
  name: 'Login',
  computed: {
    ...mapState('account', ['status']),
    ...mapState('notification', ['type', 'message']),
  },
})
export default class ActionLogFormat extends Vue {
  // public alert!: any = {};
  loader = null;

  loading = false;

  username: string = '';

  password: string = '';

  clearNotification() {
    this.$store.dispatch('notification/clear');
  }

  get message() {
    return this.$store.getters['notification/message'];
  }

  created() {
    if (this.$route.query.code) {
      const code = this.$route.query.code;
      const l = this.loader;
      this[l] = !this[l];

      console.log('******* code=' + code);

      this.$store
        .dispatch('account/login', { code })
        .then(() => {
          this.clearNotification();
        })
        .finally(() => (this.loading = null));
    }
    else {
      console.log('xxxxx');
    }
  }

  checkLogin(this: any) {
    const { username, password } = this;
    if (username && password) {
      const l = this.loader;
      this[l] = !this[l];

      this.$store
        .dispatch('account/login', { username, password })
        .then(() => {
          this.clearNotification();
        })
        .finally(() => (this.loading = null));
    }
  }
}
</script>

<style lang="scss">
.login-card {
  min-width: 400px;
  height: 400px;
}
</style>
