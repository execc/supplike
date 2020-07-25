import { Product } from "./components/Contract";

const axios = require("axios");

const X_ACCOUNT = "admin";
const SERVER = "http://84.201.165.26:3000";

export type ChainRolesInfo = {
  id: number;
  name: string;
  nodeId: string;
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
  product?: Product;
  model: any;
  assignedRoles: AssignedRoles;
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

export const getContractById = async (id: string): Promise<Contract> => {
  const data = await Promise.all([getChainById(id), getAssignedRoles(id)]);

  return getContractFromChain(id, data[0], data[1]);
};

export const getChainById = (chainId: string): Promise<Chain> => {
  const options = {
    method: "get",
    url: `${SERVER}/chain/${chainId}`,
    headers: headers(),
  };

  return axios(options).then((res: any) => res.data);
};

/**
 * {
 *  [username]: roleId
 *  user1: 1
 * }
 */
type AssignedRoles = {
  [user: string]: number;
};

export const getAssignedRoles = (chainId: string): Promise<AssignedRoles> => {
  const options = {
    method: "get",
    url: `${SERVER}/chain/${chainId}/roles`,
    headers: headers(),
  };

  return axios(options).then((res: any) => res.data);
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

  const steps = await getSteps(chainId);
  console.log("get steps for create new product", steps);
  const precedents: number[] = productInfo.precedents.map(
    ({ stepId, productId }) => {
      const product = steps.find(
        ({ id, sid }) => id === productId && sid === stepId
      );
      return Number(product!.step);
    }
  );

  const data: StepInput = {
    id,
    ...productInfo,
    precedents,
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
  { roles, steps, transitions, meta }: Chain,
  assignedRoles: AssignedRoles
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
      assignedRoles,
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
      assignedRoles,
    };
  }
};

type StepUserInput = {
  id?: number;
  precedents: { stepId: number; productId: number }[];
  quantity: number;
  sid: number;
};

type StepInput = {
  id: number;
  precedents: number[];
  quantity: number;
  sid: number;
};

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

export type TimelineData = {
  title: string;
  subtitle?: string;
  success: boolean;
};

export const getProductTimeLineForUser = async (
  chainId: string,
  productId: number
): Promise<TimelineData[]> => {
  const data = await Promise.all([
    getContractById(chainId),
    getProductPath(chainId, productId),
  ]);

  return data[1].map(({ sid, tx }: Step) => {
    const { roles, model } = data[0];
    const role = roles.find(({ id }) => id === sid)!;
    const nodes = model.layers[1].models;

    const node = nodes[role.nodeId];

    return {
      title: node.title,
      subtitle: tx,
      success: true,
    };
  });
};

export const getProductPath = async (
  chainId: string,
  productId: number
): Promise<Step[]> => {
  const steps: Step[] = await getSteps(chainId);
  const productSteps = steps
    .filter(({ id }) => id === productId)
    .sort((a, b) => Number(a.step) - Number(b.step));
  const lastStep = productSteps[productSteps.length - 1];

  return getPreviousStep([], steps, [lastStep.step]).sort(
    (a, b) => Number(a.step) - Number(b.step)
  );
};

const getPreviousStep = (
  stepLine: Step[],
  steps: Step[],
  previousStepIds: string[]
): Step[] => {
  if (!previousStepIds.length) {
    return stepLine;
  }
  let newPreviousStepIds: string[] = [];
  previousStepIds.forEach((stepId: string) => {
    const previousStep = steps.find(({ step }) => step === stepId);
    if (!previousStep) {
      console.log(stepId);
      return;
    }

    stepLine.push(previousStep);
    newPreviousStepIds = [
      ...newPreviousStepIds,
      ...previousStep.precedents.map((stepId: number) => stepId.toString()),
    ];
  });

  return getPreviousStep(stepLine, steps, newPreviousStepIds);
};
