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

const headers = (account: string = X_ACCOUNT) => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
  "Content-Type": "application/json",
  Accept: "*/*",
  "X-Account": account,
});

export const getChainIdList = (): Promise<string[]> => {
  const options = {
    method: "get",
    url: `${SERVER}/chain`,
    headers: headers(),
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
    headers: headers(),
  };

  return axios(options).then((res: any) => getContractFromChain(id, res.data));
};

export const createProduct = async (
  account: string,
  chainId: string,
  productInfo: StepUserInput
): Promise<Step> => {
  console.log("createProduct", account, chainId, productInfo);
  const id = productInfo.id
    ? productInfo.id
    : await getNextProductIdForStep(chainId, productInfo.sid);

  const data: StepInput = {
    id,
    ...productInfo,
  };

  console.log("creating product", data);

  const options = {
    method: "post",
    url: `${SERVER}/chain/${chainId}/batch`,
    headers: headers(account),
    data: JSON.stringify(data),
  };

  return axios(options).then((res: any) => res.data);
};

const getContractFromChain = (
  id: string,
  { roles, steps, transitions, meta }: Chain
): Contract => {
  try {
    const { title, model } = JSON.parse(meta);
    return {
      id,
      title,
      roles,
      steps,
      transitions,
      model,
    };
  } catch (e) {
    // костыль для контрактов созданных вне редактора
    return {
      id,
      title: "trash",
      roles,
      steps,
      transitions,
      model: {},
    };
  }
};

type StepUserInput = {
  id?: number;
  precedents: number[];
  quantity: number;
  sid: number;
};

type StepInput = {
  id: number;
} & StepUserInput;

type Step = StepInput & {
  tx: string;
  step: string;
};

const getSteps = (chainId: string): Promise<Step[]> => {
  const options = {
    method: "get",
    url: `${SERVER}/chain/${chainId}/step`,
    headers: headers(),
  };

  return axios(options).then((res: any) => res.data);
};

const getNextProductIdForStep = async (chainId: string, stepId: number) => {
  console.log("getNextProductIdForStep", chainId, stepId);
  const steps: Step[] = await getSteps(chainId);

  const productList = steps.filter(({ sid }) => sid === stepId);
  const nextId = productList.length + 1;

  console.log("next id", nextId);

  return nextId;
};
