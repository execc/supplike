import { NodeModel, DefaultPortModel } from "@projectstorm/react-diagrams";
import { BaseModelOptions } from "@projectstorm/react-canvas-core";
import { Mod } from "./BaseNodeWidget";

export type NodeType = "base" | "link" | "supplier" | "factorier" | "store";

export type BaseNodeCustomProps = {
  title?: string;
  nodeType?: NodeType;
  withInPort?: boolean;
  withOutPort?: boolean;
  mods?: Mod[];
};

export type BaseNodeModelOptions = BaseModelOptions & BaseNodeCustomProps;

const defaultOptions: BaseNodeModelOptions = {
  nodeType: "base",
  withInPort: true,
  withOutPort: true,
};

export class BaseNodeModel extends NodeModel {
  title: string;
  nodeType: NodeType;
  withInPort: boolean;
  withOutPort: boolean;
  mods: Mod[];

  constructor(options?: BaseNodeModelOptions) {
    const mergedOptions: BaseNodeModelOptions = {
      ...defaultOptions,
      ...options,
    };
    super({
      ...mergedOptions,
      type: "baseNode",
    });
    this.title = mergedOptions.title;
    this.nodeType = mergedOptions.nodeType;
    this.withInPort = mergedOptions.withInPort;
    this.withOutPort = mergedOptions.withOutPort;
    this.mods = mergedOptions.mods;

    // setup an in and out port
    // if (this.withInPort) {
    this.addPort(
      new DefaultPortModel({
        in: true,
        name: "in",
      })
    );
    // }
    // if (this.withOutPort) {
    this.addPort(
      new DefaultPortModel({
        in: false,
        name: "out",
      })
    );
    // }
  }

  serialize() {
    return {
      ...super.serialize(),
      title: this.title,
      nodeType: this.nodeType,
      withInPort: this.withInPort,
      withOutPort: this.withOutPort,
      mods: this.mods,
    };
  }

  deserialize(event): void {
    super.deserialize(event);
    this.title = event.data.title;
    this.nodeType = event.data.nodeType;
    this.withInPort = event.data.withInPort;
    this.withOutPort = event.data.withOutPort;
    this.mods = event.data.mods;
  }
}
