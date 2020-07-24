import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Scanner: {
            screens: {
              Scanner: "one",
            },
          },
          Account: {
            screens: {
              Account: "two",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};
