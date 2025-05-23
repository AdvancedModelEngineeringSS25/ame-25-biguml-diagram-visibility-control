/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
/*
// use this block to use GLSP handler
//import { configureActionHandler, FeatureModule } from '@eclipse-glsp/client';
//import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview/lib/features/default/extension-action-handler.js';
//import { DiagramVisibilityControlActionResponse, RequestDiagramVisibilityControlAction } from '../common/diagram-visibility-control.action.js';
//import { DiagramVisibilityControlHandler } from './diagram-visibility-control.handler.js';

//export const DiagramVisibilityControlModule = new FeatureModule((bind, unbind, isBound, rebind) => {
    //const context = { bind, unbind, isBound, rebind };
    // Register the DiagramVisibilityControlHandler to handle the RequestDiagramVisibilityControlAction
    //bind(DiagramVisibilityControlHandler).toSelf().inSingletonScope();
    //configureActionHandler(context, RequestDiagramVisibilityControlAction.KIND, DiagramVisibilityControlHandler);

    // Allow the DiagramVisibilityControlActionResponse to propagate to the server
    //bind(ExtensionActionKind).toConstantValue(DiagramVisibilityControlActionResponse.KIND);
//});
*/

// use this block to use vs-code handler
import { FeatureModule } from '@eclipse-glsp/client';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview';
import { DiagramVisibilityControlActionResponse } from '../common/diagram-visibility-control.action.js';
import { ExportStoreActionResponse, ImportStoreActionResponse } from '../common/export-import-state.action.js';

export const DiagramVisibilityControlModule = new FeatureModule(bind => {
    bind(ExtensionActionKind).toConstantValue(DiagramVisibilityControlActionResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(ExportStoreActionResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(ImportStoreActionResponse.KIND);
});
