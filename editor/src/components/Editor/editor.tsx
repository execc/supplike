import * as React from "react";
import createEngine, {
  DefaultLinkModel,
  DiagramModel,
} from "@projectstorm/react-diagrams";
import { BaseNodeFactory } from "../baseNode/BaseNodeFactory";
import { BaseNodeModel } from "../baseNode/BaseNodeModel";
import { BodyWidget } from "../../BodyWidget";
import { BaseNodePreview } from "../baseNode/BaseNodeWidget";
import { makeStyles, IconButton } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import MenuIcon from "@material-ui/icons/Menu";
import PublishIcon from "@material-ui/icons/Publish";
import {
  addContract,
  getContract,
  editContract,
  getContractName,
} from "../../utils/contractUtils";
import { Contract } from "../ContractsList/ContractsList";

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
  onSave: () => void;
};

const Sidebar = ({ className, onOpenList, onSave }: SidebarProps) => {
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
          <IconButton onClick={onSave}>
            <SaveIcon />
          </IconButton>
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

export const Editor = ({ onOpenList, id }: EditorProps) => {
  const classes = useEditorStyles();

  const handleSave = () => {
    const data = model.serialize();
    if (id) {
      editContract(id, data);
    } else {
      addContract(getContractName(), data);
    }
    onOpenList();
  };

  const contract: Contract | null = id ? getContract(id) : null;

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
      <Sidebar
        className={classes.sidebar}
        onOpenList={onOpenList}
        onSave={handleSave}
      />
      <Workspace />
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
