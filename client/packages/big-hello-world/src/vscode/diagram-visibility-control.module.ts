/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { ContainerModule } from 'inversify';
import { DiagramVisibilityControlProvider, DiagramVisibilityControlViewId } from './diagram-visibility-control.provider.js';

export function DiagramVisibilityControlModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(DiagramVisibilityControlViewId).toConstantValue(viewId);
        bind(DiagramVisibilityControlProvider).toSelf().inSingletonScope();
        bind(TYPES.Disposable).toService(DiagramVisibilityControlProvider);
        bind(TYPES.RootInitialization).toService(DiagramVisibilityControlProvider);

        // Handle the request vscode side
        // This will prevent the glsp to handle the request
        // Remember to comment out the the glsp client handler!
        // In DiagramVisibilityControlActionHandler implementation GLSP has priority over vscode

        // bind(DiagramVisibilityControlActionHandler).toSelf().inSingletonScope();
        // bind(TYPES.Disposable).toService(DiagramVisibilityControlActionHandler);
        // bind(TYPES.RootInitialization).toService(DiagramVisibilityControlActionHandler);
    });
}
