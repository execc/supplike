import * as React from "react";
import { DiagramEngine, PortWidget } from "@projectstorm/react-diagrams-core";
import { BaseNodeModel, NodeType, BaseNodeCustomProps } from "./BaseNodeModel";
import "./style.css";
import { IconAc } from "../icons/ac_unit";
import { IconSchedule } from "../icons/schedule";
import { Truck } from "../icons/truck";
import { Inventory } from "../icons/inventory";
import { Factory } from "../icons/factory";
import { Store } from "../icons/store";
import Popover, { ArrowContainer } from "react-tiny-popover";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
  TextField,
  Button,
} from "@material-ui/core";

export interface BaseNodeWidgetProps {
  node: BaseNodeModel;
  engine: DiagramEngine;
}

type ModType = "time" | "temperature";

type Option<T> = {
  label: string;
  value: T;
};

type ModTypeOption = Option<ModType>;

const modTypeOptions: ModTypeOption[] = [
  {
    label: "Time",
    value: "time",
  },
  {
    label: "Temperature",
    value: "temperature",
  },
];

export type Mod = {
  title: string;
  type: ModType;
  value: string;
};

export interface BaseNodeWidgetState {
  mods: Mod[];
  editModIndex?: number;
  isEditTitle: boolean;
  title: string;
  tempTitle: string;
}

type ModFormProps = {
  value?: Mod;
  onSave: (value: Mod) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

type ModFormState = {
  value: Mod;
};

class ModForm extends React.Component<ModFormProps, ModFormState> {
  constructor(props: ModFormProps) {
    super(props);

    this.state = {
      value: props.value
        ? props.value
        : {
            title: "",
            type: "temperature",
            value: "0",
          },
    };
  }

  handleSave = () => {
    this.props.onSave(this.state.value);
  };

  handleTypeChange = (
    event: React.ChangeEvent<{ name?: string; value: ModType }>
  ) => {
    this.setState({
      value: {
        ...this.state.value,
        type: event.target.value,
      },
    });
  };

  handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: {
        ...this.state.value,
        value: event.currentTarget.value,
      },
    });
  };

  render() {
    const {
      value: { type, value },
    } = this.state;
    const { onDelete, onCancel } = this.props;

    return (
      <div>
        <FormControl fullWidth>
          <InputLabel id="mod-type">Type</InputLabel>
          <Select
            fullWidth
            labelId="mod-type"
            value={type}
            onChange={this.handleTypeChange}
          >
            {modTypeOptions.map(({ value, label }: ModTypeOption) => (
              <MenuItem value={value}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Value"
          value={value}
          onChange={this.handleValueChange}
        />
        <Button
          className="mod-form-button save-condition-button"
          fullWidth
          variant="contained"
          onClick={this.handleSave}
        >
          Save condition
        </Button>
        <Button
          className="mod-form-button"
          fullWidth
          variant="contained"
          onClick={onCancel}
        >
          Cancel
        </Button>
        {onDelete && (
          <Button
            className="mod-form-button delete-condition-button"
            fullWidth
            variant="contained"
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
      </div>
    );
  }
}

type NodeIconProps = {
  type: NodeType;
};

const NodeIcon = ({ type }: NodeIconProps) => {
  let Icon;

  switch (type) {
    case "supplier":
      Icon = Inventory;
      break;
    case "link":
      Icon = Truck;
      break;
    case "factorier":
      Icon = Factory;
      break;
    case "store":
      Icon = Store;
      break;
  }

  return Icon ? <Icon width={20} height={20} /> : null;
};

type BaseNodePreviewProps = Pick<BaseNodeCustomProps, "title" | "nodeType">;

export const BaseNodePreview = ({ nodeType, title }: BaseNodePreviewProps) => {
  return (
    <div
      className="node node-preview"
      draggable
      onDragStart={(event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData(
          "editor",
          JSON.stringify({
            position: {
              x: event.pageX - event.currentTarget.offsetLeft,
              y: event.pageY - event.currentTarget.offsetTop,
            },
            type: nodeType,
            title,
          })
        );
      }}
    >
      <div className="icon">
        <NodeIcon type={nodeType} />
      </div>
      <div className="content">
        <div className="title">{title}</div>
      </div>
    </div>
  );
};

export class BaseNodeWidget extends React.Component<
  BaseNodeWidgetProps,
  BaseNodeWidgetState
> {
  constructor(props: BaseNodeWidgetProps) {
    super(props);

    const {
      node: { mods, title },
    } = props;
    this.state = {
      mods: mods || [],
      editModIndex: undefined,
      isEditTitle: false,
      title,
      tempTitle: title,
    };
  }

  handleOpenPopover = (index?: number) => () => {
    this.setState({
      editModIndex: index,
    });
  };

  handleEditMod = (value: Mod) => {
    const { mods, editModIndex } = this.state;
    const newMods = [...mods];
    newMods[editModIndex!] = value;

    this.setState({
      mods: newMods,
      editModIndex: undefined,
    });

    this.props.node.mods = newMods;
  };

  handleRemoveMod = () => {
    const { mods, editModIndex } = this.state;
    const newMods = [...mods];
    newMods.splice(editModIndex!, 1);

    this.setState({
      mods: newMods,
      editModIndex: undefined,
    });

    this.props.node.mods = newMods;
  };

  handleEditTitleOn = () => {
    const { title } = this.state;
    this.setState({ isEditTitle: true, tempTitle: title });
  };

  handleEditTitleOff = (save: boolean) => {
    const { tempTitle, title } = this.state;
    const newTitle = save ? tempTitle : title;
    this.setState({
      isEditTitle: false,
      title: newTitle,
      tempTitle: "",
    });
    this.props.node.title = newTitle;
  };

  handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      tempTitle: e.currentTarget.value,
    });
  };

  handleTitleInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // ESCAPE key pressed
    if (e.keyCode == 27) {
      this.handleEditTitleOff(false);
    }

    if (e.key === "Enter") {
      this.handleEditTitleOff(true);
    }
  };

  renderTitle = () => {
    const { isEditTitle, tempTitle, title } = this.state;

    return isEditTitle ? (
      <TextField
        fullWidth
        label="title"
        value={tempTitle}
        onChange={this.handleTitleChange}
        onKeyDown={this.handleTitleInputKeyDown}
      />
    ) : (
      <div className="title" onClick={this.handleEditTitleOn}>
        {title}
      </div>
    );
  };

  renderMod = ({ title, type, value }: Mod, index: number) => {
    let Icon = null;

    switch (type) {
      case "temperature":
        Icon = IconAc;
        break;
      case "time":
        Icon = IconSchedule;
        break;
    }

    let description = value;
    switch (type) {
      case "temperature":
        description = `temperature control up to ${value}\u00a0degrees`;
        break;
      case "time":
        description = `shelf life not exceeding ${value}\u00a0days`;
        break;
    }

    return (
      <Popover
        key={index}
        isOpen={this.state.editModIndex === index}
        // onClickOutside={this.handleOpenPopover()}
        position={"top"} // preferred position
        content={({ position, targetRect, popoverRect }) => (
          <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
            position={position}
            targetRect={targetRect}
            popoverRect={popoverRect}
            arrowColor={"#ddd"}
            // arrowSize={10}
            // arrowStyle={{ opacity: 0.7 }}
          >
            <div
              className="popover"
              // style={{ backgroundColor: "blue", opacity: 0.7 }}
              onClick={this.handleOpenPopover()}
            >
              {this.renderModForm()}
            </div>
          </ArrowContainer>
        )}
      >
        <div
          className={`mod mod-${type}`}
          onClick={this.handleOpenPopover(index)}
        >
          <Icon width={20} height={20} />
          <div className="mod-text">{description}</div>
        </div>
      </Popover>
    );
  };

  renderMods = () => (
    <div className="mods">{this.state.mods.map(this.renderMod)}</div>
  );

  renderModForm = () => {
    const { mods, editModIndex } = this.state;

    return (
      <div
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
          e.stopPropagation()
        }
      >
        <ModForm
          value={mods[editModIndex]}
          onSave={this.handleEditMod}
          onCancel={this.handleOpenPopover()}
          onDelete={mods.length !== editModIndex && this.handleRemoveMod}
        />
      </div>
    );
  };

  render() {
    const {
      engine,
      node: { nodeType, title, withInPort, withOutPort },
    } = this.props;

    return (
      <div className="node">
        <div className="ports">
          <PortWidget
            className={`port-wrapper port-in ${
              withInPort ? "" : "hidden-port"
            } ${withOutPort ? "half-port" : ""}`}
            engine={engine}
            port={this.props.node.getPort("in")}
          >
            <div className="port circle-port" />
          </PortWidget>
          <PortWidget
            className={`port-wrapper port-out ${
              withOutPort ? "" : "hidden-port"
            } ${withInPort ? "half-port" : ""}`}
            engine={engine}
            port={this.props.node.getPort("out")}
          >
            <div className="port circle-port" />
          </PortWidget>
        </div>
        <div className="pipe"></div>
        <div className="icon">
          <NodeIcon type={nodeType} />
        </div>
        <div className="content">
          {this.renderTitle()}
          {this.renderMods()}
          <div className="add-mod-button-wrapper">
            <Popover
              isOpen={this.state.editModIndex == this.state.mods.length}
              // onClickOutside={this.handleOpenPopover()}
              position={"top"} // preferred position
              content={({ position, targetRect, popoverRect }) => (
                <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                  position={position}
                  targetRect={targetRect}
                  popoverRect={popoverRect}
                  arrowColor={"#ddd"}
                  // arrowSize={10}
                  // arrowStyle={{ opacity: 0.7 }}
                >
                  <div
                    className="popover"
                    // style={{ backgroundColor: "blue", opacity: 0.7 }}
                    onClick={this.handleOpenPopover()}
                  >
                    {this.renderModForm()}
                  </div>
                </ArrowContainer>
              )}
            >
              <button
                className="add-mod-button"
                onClick={this.handleOpenPopover(this.state.mods.length)}
              >
                <div className="add-mod-button-content">add new condition</div>
              </button>
            </Popover>
          </div>
        </div>
      </div>
    );
  }
}
