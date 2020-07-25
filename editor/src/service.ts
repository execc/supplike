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
  meta: string;
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
  "Content-Type": "application/json",
  Accept: "*/*",
  "X-Account": X_ACCOUNT,
};

export const createChain = (chain: Chain) => {
  const options = {
    method: "post",
    url: `${SERVER}/chain`,
    headers,
    data: JSON.stringify(chain),
  };

  return axios(options).then((res) => res.data);
};

export const getChainIdList = (): string[] => {
  const options = {
    method: "get",
    url: `${SERVER}/chain`,
    headers,
  };

  return axios(options).then((res) => res.data);
};

export const getChainById = (id: string): Promise<Chain> => {
  const options = {
    method: "get",
    url: `${SERVER}/chain/${id}`,
    headers,
  };

  return axios(options).then((res) => res.data);
};

export type RoleConfig = {
  role: number;
  userAddress: string;
};

export const assignUsers = async (chainId: string, roles: RoleConfig[]) => {
  // return Promise.all(
  // roles.map((role) => {
  for (let i = 0; i < roles.length; i++) {
    const options = {
      method: "post",
      url: `${SERVER}/chain/${chainId}/roles`,
      headers,
      data: JSON.stringify(roles[i]),
    };

    await axios(options).then((res) => res.data);
  }

  //   return await axios(options).then((res) => res.data);
  // });
  // );
};
