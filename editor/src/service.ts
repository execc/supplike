const axios = require("axios");

const X_ACCOUNT = "admin";
const SERVER = "/api";

export type ChainRolesInfo = {
  id: number;
  name: string;
};

export type ChainStepsInfo = {
  id: number;
  name: string;
  role: number;
};

export type ChainTransitionsInfo = {
  from: number;
  to: number;
};

export type Chain = {
  roles: ChainRolesInfo[];
  steps: ChainStepsInfo[];
  transitions: ChainTransitionsInfo[];
};

export const createChain = (chain: Chain) => {
  // const headers = new Headers();
  // headers.append("Content-Type", "application/json");
  // headers.append("Accept", "*/*");
  // headers.append("X-Account", X_ACCOUNT);
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Content-Type": "application/json",
    Accept: "*/*",
    "X-Account": X_ACCOUNT,
  };

  const options = {
    method: "post",
    url: `${SERVER}/chain`,
    headers,
    mode: "no-cors",
    data: JSON.stringify(chain),
  };

  // return fetch(, options)
  //   .then((response) => response.json())
  //   .then((result) => console.log(result))
  //   .catch((error) => console.log("error", error));
  return axios(options)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
