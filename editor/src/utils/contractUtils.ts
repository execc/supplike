import {
  Contract,
  ContractData,
  ContractKeys,
} from "../components/ContractsList/ContractsList";
import {
  Chain,
  ChainRolesInfo,
  ChainStepsInfo,
  ChainTransitionsInfo,
  createChain,
  getChainIdList,
  getChainById,
} from "../service";

export const CONTRACTS_KEY = "CONTRACT_LIST";

export const getDraftContractsList = (): Contract[] => {
  const data = localStorage.getItem(CONTRACTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getContractsList = async (): Promise<Contract[]> => {
  const publishedIds = await getChainIdList();
  const publichedContracts = await Promise.all(publishedIds.map(getContract));
  const drafts = getDraftContractsList();
  return [...publichedContracts, ...drafts];
};

export const setDraftContractsList = (contracts: Contract[]) =>
  localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));

export const addContract = (title: string, contractData: ContractData) => {
  const contracts = getDraftContractsList();
  contracts.push({
    id: new Date().toString(),
    title,
    status: "draft",
    data: contractData,
  });
  setDraftContractsList(contracts);
};

export const editContract = (
  id: string,
  title: string,
  contractData: ContractData
) => {
  const contracts = getDraftContractsList();
  const contract = contracts.find((contract: Contract) => contract.id === id);
  contract.title = title;
  contract.data = contractData;
  setDraftContractsList(contracts);
};

export const getDraftContract = (id: string): Contract | null => {
  const contracts = getDraftContractsList();
  return contracts.find((contract: Contract) => contract.id === id);
};

export const getContract = async (id: string): Promise<Contract | null> => {
  const chain = await getChainById(id);
  return chain ? chainToContract(id, chain) : null;
};

export const copyContract = (id: string) => {
  const { title, data } = getDraftContract(id);
  addContract(title + " copy", data);
};

export const publishContract = async (id: string) => {
  const contracts = getDraftContractsList();
  const contract = contracts.find((contract: Contract) => contract.id === id);
  setDraftContractsList(
    contracts.filter((contract: Contract) => contract.id === id)
  );
  await createChain(contractToChain(contract));
};

export const deleteContract = (id: string) => {
  const contracts = getDraftContractsList();
  const contractIndex = contracts.findIndex(
    (contract: Contract) => contract.id === id
  );
  contracts.splice(contractIndex, 1);
  setDraftContractsList(contracts);
};

export const setPublicKeys = (id: string, keys: ContractKeys) => {
  const contracts = getDraftContractsList();
  const contract = contracts.find((contract: Contract) => contract.id === id);
  contract.keys = keys;
  setDraftContractsList(contracts);
};

type ChainRolesInfoWithNodeId = ChainRolesInfo & {
  nodeId: string;
};

const chainToContract = (id: string, chain: Chain): Contract => {
  const { meta } = chain;

  const { title, model } = JSON.parse(meta);

  return {
    id,
    title,
    data: model,
    status: "published",
  };
};

const contractToChain = (contract: Contract): Chain => {
  const {
    title,
    data: {
      layers: [links, nodes],
    },
  } = contract;

  const roles: ChainRolesInfoWithNodeId[] = Object.values(nodes.models)
    .filter(
      ({ nodeType }) => nodeType === "factorier" || nodeType === "supplier"
    )
    .map(
      ({ title, id }, index): ChainRolesInfoWithNodeId => ({
        id: index + 1,
        name: title,
        nodeId: id,
      })
    );

  const steps: ChainStepsInfo[] = roles.map(
    ({ name, id }): ChainStepsInfo => ({
      id,
      name: `${name}_PRODUCE`,
      role: id,
    })
  );

  const transitions: ChainTransitionsInfo[] = Object.values(links.models).map(
    ({ source, target }): ChainTransitionsInfo => ({
      from: roles.find(({ nodeId }) => nodeId === source).id,
      to: roles.find(({ nodeId }) => nodeId === target).id,
    })
  );

  return {
    roles,
    steps,
    transitions,
    meta: JSON.stringify({ title, model: contract.data }),
  };
};
