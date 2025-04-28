/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import {
    BIGReactWebview,
    EXPERIMENTAL_TYPES,
    type ExperimentalGLSPServerModelState
} from '@borkdominik-biguml/big-vscode-integration/vscode';
import { inject, injectable, postConstruct } from 'inversify';
import {
    DiagramVisibilityControlActionResponse,
    RequestDiagramVisibilityControlAction
} from '../common/diagram-visibility-control.action.js';

export const DiagramVisibilityControlViewId = Symbol('DiagramVisibilityControlViewId');

@injectable()
export class DiagramVisibilityControlProvider extends BIGReactWebview {
    @inject(DiagramVisibilityControlViewId)
    viewId: string;

    @inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    protected readonly modelState: ExperimentalGLSPServerModelState;

    protected override cssPath = ['diagram-visibility-control', 'bundle.css'];
    protected override jsPath = ['diagram-visibility-control', 'bundle.js'];
    protected readonly actionCache = this.actionListener.createCache([DiagramVisibilityControlActionResponse.KIND]);

    @postConstruct()
    protected override init(): void {
        super.init();

        this.toDispose.push(this.actionCache);
        console.log('HAHAHAHAHAHHA', this.modelState);
    }

    protected override handleConnection(): void {
        super.handleConnection();

        this.toDispose.push(
            this.actionCache.onDidChange(message => this.webviewConnector.dispatch(message)),
            this.webviewConnector.onReady(() => {
                // this.requestCount();
                this.requestModel();
                this.webviewConnector.dispatch(this.actionCache.getActions());
            }),
            this.webviewConnector.onVisible(() => this.webviewConnector.dispatch(this.actionCache.getActions())),
            this.connectionManager.onDidActiveClientChange(() => {
                // this.requestCount();
                this.requestModel();
            }),
            this.connectionManager.onNoActiveClient(() => {
                // Send a message to the webview when there is no active client
                this.webviewConnector.dispatch(DiagramVisibilityControlActionResponse.create());
            }),
            this.connectionManager.onNoConnection(() => {
                // Send a message to the webview when there is no glsp client
                this.webviewConnector.dispatch(DiagramVisibilityControlActionResponse.create());
            }),
            this.modelState.onDidChangeModelState(() => {
                // this.requestCount();
                this.requestModel();
                // this.actionDispatcher.dispatch(RequestDiagramVisibilityControlAction.create({}));
            })
        );
    }

    // protected requestCount(): void {
    //     this.actionDispatcher.dispatch(
    //         RequestDiagramVisibilityControlAction.create({
    //             increase: 0
    //         })
    //     );
    // }
    protected requestModel(): void {
        console.log('abcd');

        this.actionDispatcher.dispatch(RequestDiagramVisibilityControlAction.create());
    }
}
