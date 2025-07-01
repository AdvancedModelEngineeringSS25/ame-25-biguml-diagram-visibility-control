/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BIGReactWebview } from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable, postConstruct } from 'inversify';
import {
    DiagramVisibilityControlActionResponse,
    RequestDiagramVisibilityControlAction,
    SendVisibleElementsActionResponse
} from '../common/diagram-visibility-control.action.js';
import { ExportStoreActionResponse, ImportStoreActionResponse } from '../common/index.js';

export const DiagramVisibilityControlViewId = Symbol('DiagramVisibilityControlViewId');

@injectable()
export class DiagramVisibilityControlProvider extends BIGReactWebview {
    @inject(DiagramVisibilityControlViewId)
    viewId: string;

    protected override cssPath = ['diagram-visibility-control', 'bundle.css'];
    protected override jsPath = ['diagram-visibility-control', 'bundle.js'];

    protected readonly actionCache = this.actionListener.createCache([
        DiagramVisibilityControlActionResponse.KIND,
        ExportStoreActionResponse.KIND,
        ImportStoreActionResponse.KIND,
        SendVisibleElementsActionResponse.KIND
    ]);

    protected selectedIds?: string[];

    @postConstruct()
    protected override init(): void {
        super.init();

        this.toDispose.push(this.actionCache);
    }

    protected override handleConnection(): void {
        super.handleConnection();

        this.toDispose.push(
            this.actionCache.onDidChange(message => {
                this.webviewConnector.dispatch(message);
                if (DiagramVisibilityControlActionResponse.is(message)) {
                    // this.selectedIds = message.selectedElementIds ?? [];
                }
            }),
            this.webviewConnector.onReady(() => {
                this.requestCount();
                this.webviewConnector.dispatch(this.actionCache.getActions());
            }),
            this.webviewConnector.onVisible(() => this.webviewConnector.dispatch(this.actionCache.getActions())),
            this.connectionManager.onDidActiveClientChange(() => {
                this.requestCount();
            }),
            this.connectionManager.onNoActiveClient(() => {
                // Send a message to the webview when there is no active client
                this.webviewConnector.dispatch(DiagramVisibilityControlActionResponse.create());
                this.webviewConnector.dispatch(ExportStoreActionResponse.create());
                this.webviewConnector.dispatch(ImportStoreActionResponse.create());
                this.webviewConnector.dispatch(SendVisibleElementsActionResponse.create());
            }),
            this.selectionService.onDidSelectionChange(() => {
                this.selectedIds = this.selectionService.selection?.selectedElementsIDs;
                this.requestCount();
            }),
            this.connectionManager.onNoConnection(() => {
                // Send a message to the webview when there is no glsp client
                this.webviewConnector.dispatch(DiagramVisibilityControlActionResponse.create());
                this.webviewConnector.dispatch(ExportStoreActionResponse.create());
                this.webviewConnector.dispatch(ImportStoreActionResponse.create());
                this.webviewConnector.dispatch(SendVisibleElementsActionResponse.create());
            }),
            this.modelState.onDidChangeModelState(() => {
                this.requestCount();
            })
        );
    }
    // protected requestExportSuccess(): void {
    //     console.log('Report export success');
    //     this.actionDispatcher.dispatch(
    //         RequestExportStoreAction.create({

    //         })
    //     );

    // }

    protected requestCount(): void {
        this.actionDispatcher.dispatch(
            RequestDiagramVisibilityControlAction.create({
                model: this.modelState.getModelState(),
                selectedElementIds: this.selectedIds ?? []
            })
        );
    }
}
