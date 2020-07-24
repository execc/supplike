import * as React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  makeStyles,
  Button,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import EditAttributesIcon from "@material-ui/icons/EditAttributes";
import PublishIcon from "@material-ui/icons/Publish";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import {
  getContractsList,
  publishContract,
  deleteContract,
  copyContract,
} from "../../utils/contractUtils";
import { useState } from "react";

type ContractsListProps = {
  onContractOpen: (id?: string) => void;
  onEditAttribute: (id: string) => void;
};

export type ContractStatus = "draft" | "published";

export type ContractData = any;

export type ContractKeys = { [roleId: number]: string };

export type Contract = {
  id: string;
  title: string;
  status: ContractStatus;
  data?: ContractData;
  keys?: ContractKeys;
};

const useContractsListStyle = makeStyles({
  wrapper: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    background: "#eee",
    minHeight: "100%",
  },
  inner: {
    maxWidth: "500px",
    width: "100%",
  },
  addButton: {
    background: "#fff",
    margin: "10px 0",
  },
  list: {
    background: "#fff",
  },
});

export const ContractsList = ({
  onContractOpen,
  onEditAttribute,
}: ContractsListProps) => {
  const classes = useContractsListStyle();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [recieved, setRecieved] = useState<boolean>(false);

  React.useEffect(() => {
    if (!recieved) {
      (async () => {
        setContracts(await getContractsList());
        setRecieved(true);
      })();
    }
  });

  const handleCopyFactory = (id: string) => async () => {
    copyContract(id);
    setContracts(await getContractsList());
  };

  const handlePublishFactory = (id: string) => async () => {
    await publishContract(id);
    setContracts(await getContractsList());
  };

  const handleDeleteFactory = (id: string) => async () => {
    deleteContract(id);
    setContracts(await getContractsList());
  };

  const handleEditAttributeFactory = (id: string) => () => onEditAttribute(id);

  const renderContract = ({ id, title, status }: Contract) => (
    <ListItem key={id}>
      <ListItemText
        primary={title}
        secondary={status === "published" ? id : status}
      />
      <ListItemSecondaryAction>
        {status === "draft" && (
          <IconButton onClick={() => onContractOpen(id)} title="edit">
            <EditIcon />
          </IconButton>
        )}
        {status === "draft" && (
          <IconButton onClick={handleCopyFactory(id)} title="copy">
            <FileCopyIcon />
          </IconButton>
        )}
        {status === "published" && (
          <IconButton
            title="edit attributes"
            onClick={handleEditAttributeFactory(id)}
          >
            <EditAttributesIcon />
          </IconButton>
        )}
        {status === "draft" && (
          <IconButton onClick={handlePublishFactory(id)} title="publish">
            <PublishIcon />
          </IconButton>
        )}
        {status === "draft" && (
          <IconButton onClick={handleDeleteFactory(id)} title="delete">
            <DeleteIcon />
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.inner}>
        <Button
          fullWidth
          onClick={() => onContractOpen()}
          className={classes.addButton}
        >
          <AddIcon /> Add new contract
        </Button>
        <List className={classes.list}>{contracts.map(renderContract)}</List>
      </div>
    </div>
  );
};
