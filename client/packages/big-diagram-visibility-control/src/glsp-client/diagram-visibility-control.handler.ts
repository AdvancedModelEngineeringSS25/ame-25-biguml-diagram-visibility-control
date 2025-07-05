/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
//import {
//    EXPERIMENTAL_TYPES,
//    type ExperimentalGLSPServerModelState
//} from '@borkdominik-biguml/big-vscode-integration/vscode';

import { EXPERIMENTAL_TYPES, type ExperimentalGLSPServerModelState } from '@borkdominik-biguml/big-vscode-integration/vscode';
import type { Action, IActionHandler, ICommand } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import {
    DiagramVisibilityControlActionResponse,
    RequestDiagramVisibilityControlAction
} from '../common/diagram-visibility-control.action.js';

@injectable()
export class DiagramVisibilityControlHandler implements IActionHandler {
    @inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    protected readonly modelState: ExperimentalGLSPServerModelState;

    private selectedElementIds: { id: string; name: string }[] = [];

    handle(action: Action): ICommand | Action | void {
        if (RequestDiagramVisibilityControlAction.is(action)) {
            const ids = action.selectedElementIds ?? [];
            this.selectedElementIds = this.getNamesToIds(ids);

            return DiagramVisibilityControlActionResponse.create({
                selectedElementIds: this.selectedElementIds,
                model: this.modelState
            });
        }
    }

    private getNamesToIds(ids: string[]): { id: string; name: string }[] {
        // just use ids as names, since ExperimentalGLSPServerModelState cannot be used here
        const elements: { id: string; name: string }[] = [];

        ids.forEach(id => elements.push({ id: id, name: id }));

        return elements;
    }
}
