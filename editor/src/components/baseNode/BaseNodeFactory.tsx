import * as React from 'react';
import { BaseNodeModel } from './BaseNodeModel';
import { BaseNodeWidget } from './BaseNodeWidget';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class BaseNodeFactory extends AbstractReactFactory<BaseNodeModel, DiagramEngine> {
	constructor() {
		super('baseNode');
	}

	generateModel(initialConfig) {
		return new BaseNodeModel();
	}

	generateReactWidget(event): JSX.Element {
		return <BaseNodeWidget engine={this.engine as DiagramEngine} node={event.model} />;
	}
}
