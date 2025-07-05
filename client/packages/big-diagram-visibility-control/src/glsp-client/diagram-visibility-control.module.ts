/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
/*
 */
import { FeatureModule } from '@eclipse-glsp/client';
import { ExtensionActionKind } from '@eclipse-glsp/vscode-integration-webview';
import { DiagramVisibilityControlActionResponse, SendVisibleElementsActionResponse } from '../common/diagram-visibility-control.action.js';
import { ExportStoreActionResponse, ImportStoreActionResponse } from '../common/export-import-state.action.js';

export const DiagramVisibilityControlModule = new FeatureModule(bind => {
    bind(ExtensionActionKind).toConstantValue(DiagramVisibilityControlActionResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(ExportStoreActionResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(ImportStoreActionResponse.KIND);
    bind(ExtensionActionKind).toConstantValue(SendVisibleElementsActionResponse.KIND);
});
