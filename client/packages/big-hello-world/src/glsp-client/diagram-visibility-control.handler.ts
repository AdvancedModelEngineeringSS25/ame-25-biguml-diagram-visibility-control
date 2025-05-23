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

import type { Action, IActionHandler, ICommand } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { DiagramVisibilityControlActionResponse, RequestDiagramVisibilityControlAction } from '../common/diagram-visibility-control.action.js';

@injectable()
export class DiagramVisibilityControlHandler implements IActionHandler {

    //@inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    //protected readonly modelState: ExperimentalGLSPServerModelState;

    private count = 0;
    private selectedElementIds: { id: string; name: string }[] = [];

    handle(action: Action): ICommand | Action | void {
        if (RequestDiagramVisibilityControlAction.is(action)) {
            this.count += action.increase;
            console.log(`Diagram Visibility Control from the GLSP Client: ${this.count}`);
            
            const ids = action.selectedElementIds ?? [];
            this.selectedElementIds = this.getNamesToIds(ids);
            console.log('Selected element IDs from the GLSP Client:', this.selectedElementIds);

            return DiagramVisibilityControlActionResponse.create({
                count: this.count,
                selectedElementIds: this.selectedElementIds
            });
        }
    }

    private getNamesToIds(ids: string[]): { id: string; name: string }[] {
        // just use ids as names, since ExperimentalGLSPServerModelState cannot be used here
        const elements: { id: string; name: string }[] = [];

        ids.forEach(id => elements.push({id: id, name: id}));

        return elements;
    }
}
