/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    EXPERIMENTAL_TYPES,
    TYPES,
    type ActionDispatcher,
    type ActionListener,
    type Disposable,
    type ExperimentalGLSPServerModelState
} from '@borkdominik-biguml/big-vscode-integration/vscode';
import { DisposableCollection } from '@eclipse-glsp/protocol';
import { inject, injectable, postConstruct } from 'inversify';
import {
    DiagramVisibilityControlActionResponse,
    RequestDiagramVisibilityControlAction
} from '../common/diagram-visibility-control.action.js';

// Handle the action within the server and not the glsp client / server
@injectable()
export class DiagramVisibilityControlActionHandler implements Disposable {
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;
    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;
    @inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    protected readonly modelState: ExperimentalGLSPServerModelState;

    private readonly toDispose = new DisposableCollection();
    private count = 0;
    private selectedElementIds: { id: string; name: string }[] = [];

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestDiagramVisibilityControlAction>(
                RequestDiagramVisibilityControlAction.KIND,
                async message => {
                    this.count += message.action.increase;
                    console.log(`Diagram Visibility Control from VS Code: ${this.count}`);

                    const ids = message.action.selectedElementIds ?? [];
                    this.selectedElementIds = this.getNamesToIds(ids);
                    console.log('Selected element IDs from VS Code:', this.selectedElementIds);

                    return DiagramVisibilityControlActionResponse.create({
                        count: this.count,
                        selectedElementIds: this.selectedElementIds
                    });
                }
            )
        );
    }

    private getNamesToIds(ids: string[]): { id: string; name: string }[] {
        const model = this.modelState.getModelState()?.getSourceModel();
        const found: { id: string; name: string }[] = [];

        if (!model) return found;

        const visited = new Set<string>();

        const traverse = (element: any) => {
            if (!element || typeof element !== 'object' || visited.has(element.id)) {
                return;
            }

            visited.add(element.id);

            if (ids.includes(element.id)) {
                found.push({
                    id: element.id,
                    name: element.name ?? '<Unnamed>'
                });
            }

            for (const key in element) {
                if (Array.isArray(element[key])) {
                    for (const child of element[key]) {
                        traverse(child);
                    }
                } else if (typeof element[key] === 'object') {
                    traverse(element[key]);
                }
            }
        };

        traverse(model);
        return found;
    }


    dispose(): void {
        this.toDispose.dispose();
    }
}
