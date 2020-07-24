import { Product } from "./components/Contract";

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

export type Contract = {
  id: string;
  title: string;
  roles: ChainRolesInfo[];
  steps: ChainStepsInfo[];
  transitions: ChainTransitionsInfo[];
  products?: Product[];
  model: any;
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
  "Content-Type": "application/json",
  Accept: "*/*",
  "X-Account": X_ACCOUNT,
};

export const getChainIdList = (): Promise<string[]> => {
  const options = {
    method: "get",
    url: `${SERVER}/chain`,
    headers,
  };

  return axios(options).then((res: any) => res.data);
};

export const getContractList = async (): Promise<Contract[]> => {
  const ids = await getChainIdList();
  return await Promise.all(ids.map(getContractById));
};

export const getContractById = (id: string): Promise<Contract> => {
  const options = {
    method: "get",
    url: `${SERVER}/chain/${id}`,
    headers,
  };

  return axios(options).then((res: any) => getContractFromChain(id, res.data));
};

const getContractFromChain = (
  id: string,
  { roles, steps, transitions, meta }: Chain
): Contract => {
  const {
    title = "", // Костыль из-за того, что уже есть контракт без title
    model,
  } = JSON.parse(meta);
  return {
    id,
    title,
    roles,
    steps,
    transitions,
    model,
  };
};
