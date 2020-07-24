const axios = require("axios");

const X_ACCOUNT = "admin";
const SERVER = "http://84.201.165.26:3000";

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
  meta: string;
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
  "Content-Type": "application/json",
  Accept: "*/*",
  "X-Account": X_ACCOUNT,
};

export const getChainIdList = (): string[] => {
  const options = {
    method: "get",
    url: `${SERVER}/chain`,
    headers,
  };

  return axios(options).then((res: any) => res.data);
};

export const getChainById = (id: string): Promise<Chain> => {
  const options = {
    method: "get",
    url: `${SERVER}/chain/${id}`,
    headers,
  };

  return axios(options).then((res: any) => res.data);
};
