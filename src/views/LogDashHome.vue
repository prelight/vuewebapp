<template>
  <div id="logdash-home">
    <!-- Appbar -->
    <v-app-bar dense app fixed color="white">
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-toolbar-title class="ml-0 pl-3"
        ><img class="img pt-2" src="../static/logdash-logo.png" width="180" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        flat
        solo
        height="28"
        hide-details
        prepend-inner-icon="search"
        single-line
        label="Search"
        class="hidden-sm-and-down"
        background-color=" lighten-3"
      ></v-text-field>
      <ButtonDropdown v-model="languageList[0]" :items="languageList" :onClick="handleClick" />

      <v-btn text class="primary--text ml-2" to="/login">
<!--
      <v-btn text class="primary--text ml-2" href="https://sonytest.auth.us-east-2.amazoncognito.com/login?response_type=code&client_id=6mdsa320oe530p1r774mkjtt98&redirect_uri=http://localhost:8080/logdash/format">
-->
        {{ $t('button.login') }}
      </v-btn>
    </v-app-bar>
    <!-- <v-flex xs6> -->

    <v-content>
      <v-parallax height="100%" src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg">
        <v-container fluid>
          <v-row justify="center" align="center">
            <v-col lg="10" sm="12" cols="12">
              <v-card max-width="auto">
                <v-card-title primary-title>
                  <div>
                    <h3 class="display-1 font-weight-bold mb-0">Log:dashの概要</h3>
                  </div>
                </v-card-title>
                <v-row justify="center" align="center" class="pa-5">
                  <v-img
                    class="overview-image"
                    src="/img/logdash-overview.png"
                    alt="LogDash Overview"
                  ></v-img>
                </v-row>
                <v-card-text>
                  <v-row justify="center">
                    <v-col class="mr-5" lg="3" sm="12" cols="12">
                      <h5 class="headline font-weight-bold mb-1">自動化と見える化</h5>
                      <h6 class="subtitle-1 font-weight-bold">
                        スキーマのシステム管理、商用化まで見える化
                      </h6>
                      <div class="introduct-content">
                        <div class="grey--text">
                          環境や各種バージョン管理 (製品、ソフト、ログ、PP・・・)
                        </div>
                        <div class="grey--text">ログタイプなどの利用状況がわかる</div>
                      </div>

                      <h6 class="subtitle-1 font-weight-bold">
                        ルールを一元化（個別ルールなども）
                      </h6>
                      <div class="introduct-content">
                        <div class="grey--text">
                          環境や各種バージョン管理（製品、ソフト、ログ、PP・・・）
                        </div>
                      </div>

                      <h6 class="subtitle-1 font-weight-bold">
                        マニュアル対応による事故防止
                      </h6>
                      <div class="introduct-content">
                        <div class="grey--text">ログの不備についても事前に検証が可能</div>
                      </div>
                    </v-col>

                    <v-col class="mr-5" lg="3" sm="12" cols="12">
                      <h5 class="headline font-weight-bold mb-1">各種連携のシステム化</h5>
                      <h6 class="subtitle-1 font-weight-bold mb-2">
                        Frontend/Backendのシステムと連携
                      </h6>

                      <h6 class="subtitle-1 font-weight-bold mb-2">
                        DataCatalogのデータセット情報との連携
                      </h6>

                      <h6 class="subtitle-1 font-weight-bold mb-2">
                        デバイス・アプリへスキーマを連携
                      </h6>
                    </v-col>

                    <v-col class="mr-5" lg="3" sm="12" cols="12">
                      <h5 class="headline font-weight-bold mb-1">省力化</h5>

                      <h6 class="subtitle-1 font-weight-bold">
                        導入時やログ定義追加時のオペレーションをシステム化（コスト低減）
                      </h6>
                      <div class="introduct-content">
                        <div class="grey--text">
                          フォーマット定義とレビュー
                        </div>
                        <div class="grey--text">EntityId管理やConfig運用を統合</div>
                      </div>

                      <h6 class="subtitle-1 font-weight-bold">
                        SDK・ツール側の省力化
                      </h6>
                      <div class="introduct-content">
                        <div class="grey--text">
                          Format Classの自動生成、クラウド側ReaderにてVerification自動対応
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col lg="10" sm="12" cols="12">
              <v-card>
                <!-- <v-img
                  src="https://cdn.vuetifyjs.com/images/cards/desert.jpg"
                  aspect-ratio="2.75"
                ></v-img> -->

                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">Log:dashのサービス</h3>
                  </div>
                </v-card-title>

                <v-card-text>
                  <span>
                    進化するログダッシュ
                  </span>
                  <v-img width="38" src="https://image.flaticon.com/icons/svg/1829/1829799.svg" />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-parallax>
    </v-content>

    <v-footer height="auto" color="white">
      <v-row>
        <v-btn v-for="link in links" :key="link" color="white" flat round>
          {{ link }}
        </v-btn>
        <v-col class="pa-3" cols="1"
          ><router-link class="sss" to="/setting">利用規約</router-link></v-col
        >

        <v-col class="py-3 text-center" cols="12">
          Copyright 2019 Sony Corporation, All rights reserved. — <strong>LogDash</strong>
        </v-col>
      </v-row>
    </v-footer>

    <!-- <span>&copy; 2019</span> -->
    <!-- <v-footer app fixed>
        <span>&copy; 2019</span>
      </v-footer> -->
    <!-- </v-flex> -->
  </div>
</template>

<i18n>
{
  "en": {
    "hello": "Hi"
  },
  "ja": {
    "hello": "こんにちは"
  }
}
</i18n>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ButtonDropdown from '@/components/ButtonDropdown.vue';
@Component({
  components: { ButtonDropdown },
})
export default class Home extends Vue {
  languageList: { text: string; value: string }[] = [
    { text: '日本語', value: 'ja' },
    { text: 'English', value: 'en' },
  ];

  selectedItem = {};

  selectedLanguage = this.languageList[0].text;

  handleClick(item) {
    this.selectedItem = item;
    this.selectedLanguage = item.title;
  }
}
</script>

<style scoped lang="scss">
.introduct-content {
  line-height: 20px;
  margin-bottom: 20px;
}

.overview-image {
  // min-width: 500px;
  width: 500px;
}

.toolbar-search-input .v-input__prepend-inner .v-icon {
  color: purple !important;
}

.button-dropdown {
  border: 1px solid #999;
  text-transform: none;
  font-weight: normal;
}

:link,
:visited {
  color: black;
  outline: 0;
  text-decoration: none;
}

#inspire img {
  height: 100%;
}
</style>
