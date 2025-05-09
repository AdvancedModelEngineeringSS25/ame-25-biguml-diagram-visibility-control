/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import type { Action, IActionHandler, ICommand } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { DiagramVisibilityControlActionResponse, RequestDiagramVisibilityControlAction } from '../common/diagram-visibility-control.action.js';

@injectable()
export class DiagramVisibilityControlHandler implements IActionHandler {
    private count = 0;

    handle(action: Action): ICommand | Action | void {
        if (RequestDiagramVisibilityControlAction.is(action)) {
            this.count += action.increase;
            console.log(`Diagram Visibility Control from the GLSP Client: ${this.count}`);
            return DiagramVisibilityControlActionResponse.create({
                count: this.count
            });
        }
    }
}
