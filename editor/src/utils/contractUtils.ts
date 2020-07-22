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
} from "../service";

export const CONTRACTS_KEY = "CONTRACT_LIST";

export const getContractName = () => Math.random().toString();

export const getContractsList = (): Contract[] => {
  const data = localStorage.getItem(CONTRACTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const setContractsList = (contracts: Contract[]) =>
  localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));

export const addContract = (title: string, contractData: ContractData) => {
  const contracts = getContractsList();
  contracts.push({
    title,
    status: "draft",
    data: contractData,
  });
  setContractsList(contracts);
};

export const editContract = (id: string, contractData: ContractData) => {
  const contracts = getContractsList();
  const contract = contracts.find(({ title }: Contract) => title === id);
  contract.data = contractData;
  setContractsList(contracts);
};

export const getContract = (id: string): Contract | null => {
  const contracts = getContractsList();
  return contracts.find(({ title }: Contract) => title === id);
};

export const copyContract = (title: string, id: string) => {
  addContract(title, getContract(id).data);
};

export const publishContract = (id: string) => {
  const contracts = getContractsList();
  const contract = contracts.find(({ title }: Contract) => title === id);
  contract.status = "published";
  setContractsList(contracts);
  createChain(contractToChain(contract));
};

export const deleteContract = (id: string) => {
  const contracts = getContractsList();
  const contractIndex = contracts.findIndex(
    ({ title }: Contract) => title === id
  );
  contracts.splice(contractIndex, 1);
  setContractsList(contracts);
};

export const setPublicKeys = (id: string, keys: ContractKeys) => {
  const contracts = getContractsList();
  const contract = contracts.find(({ title }: Contract) => title === id);
  contract.keys = keys;
  setContractsList(contracts);
};

type ChainRolesInfoWithNodeId = ChainRolesInfo & {
  nodeId: string;
};

const contractToChain = (contract: Contract): Chain => {
  const {
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
  };
};
