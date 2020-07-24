import * as React from "react";
import { Contract, ContractKeys } from "../ContractsList/ContractsList";
import {
  getDraftContract,
  setPublicKeys,
  getContract,
} from "../../utils/contractUtils";
import {
  makeStyles,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  ListItemSecondaryAction,
  TextField,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import PublishIcon from "@material-ui/icons/Publish";

type AttributeEditorProps = {
  id: string;
  onOpenList: () => void;
};

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    background: "#eee",
    height: "100%",
  },
  inner: {
    maxWidth: "500px",
    width: "100%",
  },
  controls: {
    background: "#fff",
    margin: "10px 0",
    display: "flex",
    justifyContent: "space-between",
  },
  list: {
    background: "#fff",
  },
  nested: {
    paddingLeft: "40px",
  },
  publicKeyInput: {
    paddingRight: "84px",
  },
});

export const AttributeEditor = ({ id, onOpenList }: AttributeEditorProps) => {
  const classes = useStyles();

  const [contract, setContract] = React.useState<Contract | null>(null);
  const [keys, setKeys] = React.useState<ContractKeys>({});
  const [recieved, setRecieved] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!recieved) {
      (async () => {
        const contract = await getContract(id);
        setContract(contract);
        contract.keys && setKeys(contract.keys);
        setRecieved(true);
      })();
    }
  });

  const [open, setOpen] = React.useState<string>("");

  const handleOpenFactory = (type: string) => () => {
    setOpen(type === open ? "" : type);
    handleEditOff();
  };

  const [editId, setEditId] = React.useState<string>("");
  const handleEditOnFactory = (id: string) => () => {
    setEditId(id);
    setPublicKey(keys[id] || "");
  };

  const handleEditOff = () => {
    setEditId("");
    setPublicKey("");
  };

  const [publicKey, setPublicKey] = React.useState<string>("");
  const handleEditSave = () => {
    setKeys({
      ...keys,
      [editId]: publicKey,
    });

    handleEditOff();
  };

  const handlePublicKeyChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPublicKey(e.currentTarget.value);

  const handlePublish = () => {
    setPublicKeys(id, keys);
    onOpenList();
  };

  if (!contract) {
    return null;
  }

  const models = (Object.values(contract.data.layers[1].models) as any[])
    .filter((model) => model.nodeType !== "link")
    .reduce((models, node) => {
      const type = node.nodeType;
      if (!models[type]) {
        models[type] = [node];
      } else {
        models[type].push(node);
      }

      return models;
    }, {});

  return (
    <div className={classes.wrapper}>
      <div className={classes.inner}>
        <div className={classes.controls}>
          <IconButton onClick={onOpenList}>
            <MenuIcon />
          </IconButton>
          <IconButton
            onClick={handlePublish}
            disabled={
              !Object.values(models).every((nodes: any[]) =>
                nodes.every(({ roleId }) => keys[roleId])
              )
            }
            title="publish"
          >
            <PublishIcon />
          </IconButton>
        </div>
        <List className={classes.list}>
          {Object.keys(models).map((type) => (
            <React.Fragment key={type}>
              <ListItem button onClick={handleOpenFactory(type)}>
                <ListItemText primary={type} />
                {open === type ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open === type} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {models[type].map((model) => (
                    <ListItem className={classes.nested}>
                      {editId === model.roleId ? (
                        <>
                          <TextField
                            className={classes.publicKeyInput}
                            fullWidth
                            label="Input public key"
                            size="small"
                            variant="outlined"
                            onChange={handlePublicKeyChange}
                            value={publicKey}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              onClick={handleEditSave}
                              title="save"
                              disabled={!publicKey}
                            >
                              <SaveIcon />
                            </IconButton>
                            <IconButton onClick={handleEditOff} title="cancel">
                              <CloseIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </>
                      ) : (
                        <>
                          <ListItemText
                            primary={model.title}
                            secondary={keys[model.roleId]}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              onClick={handleEditOnFactory(model.roleId)}
                              title="edit"
                            >
                              <EditIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </div>
    </div>
  );
};
