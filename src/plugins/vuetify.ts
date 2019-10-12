import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/es5/util/colors';
// import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    // dark: true,
    dark: false,
    themes: {
      // primary: colors.indigo.base,
      light: {
        primary: '#0D47A1',
        secondary: colors.blue.base,
        accent: colors.amber.base,
        warning: '#FB8C00',
        background: '#FFF',
      },
      dark: {
        primary: '#C2185B',
        secondary: colors.blue.base,
        warning: '#FB8C00',
        background: colors.grey.darken3,
      },
    },
    options: {
      customProperties: true,
    },
  },
});
