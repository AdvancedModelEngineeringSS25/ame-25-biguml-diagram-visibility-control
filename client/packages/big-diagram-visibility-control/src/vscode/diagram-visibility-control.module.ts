/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { TYPES } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';
import { ContainerModule } from 'inversify';
import { DiagramVisibilityControlActionResponse, SendVisibleElementsActionResponse } from '../common/diagram-visibility-control.action.js';
import { DiagramVisibilityControlActionHandler } from './diagram-visibility-control.handler.js';
import { DiagramVisibilityControlProvider, DiagramVisibilityControlViewId } from './diagram-visibility-control.provider.js';

export function DiagramVisibilityControlModule(viewId: string) {
    return new ContainerModule(bind => {
        bind(DiagramVisibilityControlViewId).toConstantValue(viewId);
        bind(DiagramVisibilityControlProvider).toSelf().inSingletonScope();
        bind(TYPES.Disposable).toService(DiagramVisibilityControlProvider);
        bind(TYPES.RootInitialization).toService(DiagramVisibilityControlProvider);
        bind(DiagramVisibilityControlActionHandler).toSelf().inSingletonScope();
        bind(TYPES.Disposable).toService(DiagramVisibilityControlActionHandler);
        bind(TYPES.RootInitialization).toService(DiagramVisibilityControlActionHandler);
        bind(ExtensionActionKind).toConstantValue(DiagramVisibilityControlActionResponse.KIND);
        bind(ExtensionActionKind).toConstantValue(SendVisibleElementsActionResponse.KIND);
    });
}
