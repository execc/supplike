import * as React from "react";
import createEngine, {
  DefaultLinkModel,
  DiagramModel,
} from "@projectstorm/react-diagrams";
import { BaseNodeFactory } from "../baseNode/BaseNodeFactory";
import { BaseNodeModel } from "../baseNode/BaseNodeModel";
import { BodyWidget } from "../../BodyWidget";
import { BaseNodePreview } from "../baseNode/BaseNodeWidget";
import { makeStyles, IconButton, TextField } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import MenuIcon from "@material-ui/icons/Menu";
import PublishIcon from "@material-ui/icons/Publish";
import {
  addContract,
  getDraftContract,
  editContract,
} from "../../utils/contractUtils";
import { Contract } from "../ContractsList/ContractsList";
import { useState } from "react";

// create an instance of the engine
const engine = createEngine();
engine.maxNumberPointsPerLink = 0;

// register the engine
engine.getNodeFactories().registerFactory(new BaseNodeFactory());

// create a diagram model
let model = new DiagramModel();

// install the model into the engine
engine.setModel(model);

const SidebarStyles = makeStyles({
  controls: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #999",
  },
});

type SidebarProps = {
  className?: string;
  onOpenList: () => void;
};

const Sidebar = ({ className, onOpenList }: SidebarProps) => {
  const classes = SidebarStyles();
  return (
    <div className={className}>
      <div className={classes.controls}>
        <IconButton onClick={onOpenList}>
          <MenuIcon />
        </IconButton>
        <div>
          {status === "draft" && (
            <IconButton edge="end">
              <PublishIcon />
            </IconButton>
          )}
        </div>
      </div>
      <BaseNodePreview title="Supplier" nodeType="supplier" />
      <BaseNodePreview title="Transfer" nodeType="link" />
      <BaseNodePreview title="Factorier" nodeType="factorier" />
      <BaseNodePreview title="Store" nodeType="store" />
    </div>
  );
};

const useEditorStyles = makeStyles({
  wrapper: {
    display: "flex",
    height: "100%",
  },
  sidebar: {
    width: "200px",
    borderRight: "1px solid #777",
  },
});

type EditorProps = {
  onOpenList: () => void;
  id?: string;
};

const ControlBlock = ({ onOpenList, id }: EditorProps) => {
  const contract: Contract | null = id ? getDraftContract(id) : null;

  const handleSave = () => {
    const data = model.serialize();
    if (id) {
      editContract(id, name, data);
    } else {
      addContract(name, data);
    }
    onOpenList();
  };

  const [name, setName] = useState<string>(contract ? contract.title : "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setName(e.currentTarget.value);
  };

  return (
    <div style={{ height: "43px", display: "flex", alignItems: "center" }}>
      <TextField
        style={{
          marginTop: "3px",
        }}
        fullWidth
        label="Input contract name"
        size="small"
        variant="standard"
        onChange={handleNameChange}
        value={name}
      />
      <IconButton disabled={!name} onClick={handleSave}>
        <SaveIcon />
      </IconButton>
    </div>
  );
};

export const Editor = ({ onOpenList, id }: EditorProps) => {
  const classes = useEditorStyles();

  const contract: Contract | null = id ? getDraftContract(id) : null;

  React.useEffect(() => {
    if (contract) {
      model.deserializeModel(contract.data, engine);
    }
  }, [id]);

  React.useEffect(() => {
    return () => {
      model = new DiagramModel();
      engine.setModel(model);
    };
  });

  return (
    <div className={classes.wrapper}>
      <Sidebar className={classes.sidebar} onOpenList={onOpenList} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "0 10px",
        }}
      >
        <ControlBlock onOpenList={onOpenList} id={id} />
        <Workspace />
      </div>
    </div>
  );
};

class Workspace extends React.Component {
  render() {
    return (
      <div
        style={{
          flex: "1",
        }}
        onDrop={(event: React.DragEvent) => {
          const data = JSON.parse(event.dataTransfer.getData("editor"));

          const node = new BaseNodeModel({
            title: data.title,
            withInPort: data.type !== "supplier",
            withOutPort: data.type !== "store",
            nodeType: data.type,
          });
          node.setPosition(
            event.clientX - data.position.x,
            event.clientY - data.position.y
          );
          engine.getModel().addNode(node);

          this.forceUpdate();
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
      >
        <BodyWidget engine={engine} />
      </div>
    );
  }
}
