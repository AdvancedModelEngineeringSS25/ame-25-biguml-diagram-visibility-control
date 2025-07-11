/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import {
    type ActionDispatcher,
    type ActionListener,
    type Disposable,
    EXPERIMENTAL_TYPES,
    type ExperimentalGLSPServerModelState,
    TYPES
} from '@borkdominik-biguml/big-vscode-integration/vscode';
import { getUMLObjectType, type UMLEObject, type UMLSourceModel } from '@borkdominik-biguml/uml-protocol';
import { DisposableCollection } from '@eclipse-glsp/protocol';
import { inject, injectable, postConstruct } from 'inversify';
import * as vscode from 'vscode';
import {
    DiagramVisibilityControlActionResponse,
    RequestDiagramVisibilityControlAction,
    RequestSendVisibleElementsAction,
    SendVisibleElementsActionResponse
} from '../common/diagram-visibility-control.action.js';
import {
    ExportStoreActionResponse,
    ImportStoreActionResponse,
    RequestExportStoreAction,
    RequestImportStoreAction
} from '../common/export-import-state.action.js';
import type { Element, Type } from '../model/model.js';
import { validateLayerStore } from '../store/validation.js';
@injectable()
export class DiagramVisibilityControlActionHandler implements Disposable {
    @inject(TYPES.ActionDispatcher)
    protected readonly actionDispatcher: ActionDispatcher;
    @inject(TYPES.ActionListener)
    protected readonly actionListener: ActionListener;
    @inject(EXPERIMENTAL_TYPES.GLSPServerModelState)
    protected readonly modelState: ExperimentalGLSPServerModelState;

    private readonly toDispose = new DisposableCollection();
    private selectedElementIds: { id: string; name: string }[] = [];

    @postConstruct()
    protected init(): void {
        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestDiagramVisibilityControlAction>(
                RequestDiagramVisibilityControlAction.KIND,
                async message => {
                    const sourceModel = this.modelState.getModelState()?.getSourceModel();
                    const model: Element[] = sourceModel ? this.createModelElements(sourceModel) : [];

                    const ids = message.action.selectedElementIds ?? [];
                    this.selectedElementIds = this.getNamesToIds(ids);

                    return DiagramVisibilityControlActionResponse.create({
                        model,
                        selectedElementIds: this.selectedElementIds
                    });
                }
            )
        );
        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestExportStoreAction>(RequestExportStoreAction.KIND, async message => {
                const uri = await vscode.window.showSaveDialog({
                    title: 'Save Configuration File',
                    defaultUri: vscode.Uri.file('configuration-file.json'),
                    filters: {
                        JSON: ['json']
                    }
                });

                if (uri) {
                    try {
                        if (typeof message.action.data === 'string') {
                            await vscode.workspace.fs.writeFile(uri, Buffer.from(message.action.data, 'utf8'));
                        } else {
                            throw new Error('Export data is not a string');
                        }
                        vscode.window.showInformationMessage('Configuration exported successfully!');
                        return ExportStoreActionResponse.create({ success: true });
                    } catch (error) {
                        console.error('Failed to write file:', error);
                        return ExportStoreActionResponse.create({ success: false });
                    }
                }
                return ExportStoreActionResponse.create({ success: false });
            })
        );

        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestImportStoreAction>(RequestImportStoreAction.KIND, async () => {
                const uri = await vscode.window.showOpenDialog({
                    canSelectMany: false,
                    filters: { JSON: ['json'] },
                    title: 'Import Configuration File'
                });

                if (uri && uri[0]) {
                    try {
                        const content = await vscode.workspace.fs.readFile(uri[0]);
                        const text = Buffer.from(content).toString('utf8');
                        const parsed = JSON.parse(text);
                        const validation = validateLayerStore(parsed);
                        if (!validation.success) {
                            vscode.window.showErrorMessage(`Import failed: ${validation.error}`);
                            return ImportStoreActionResponse.create({ data: {} });
                        }

                        vscode.window.showInformationMessage('Configuration imported successfully!');
                        return ImportStoreActionResponse.create({
                            data: validation.data
                        });
                    } catch (error) {
                        console.error('Failed to import configuration:', error);
                        let errorMessage = 'Failed to import configuration';

                        if (error instanceof SyntaxError) {
                            errorMessage = 'Invalid JSON file format';
                        } else if (error instanceof Error) {
                            errorMessage = `Import error: ${error.message}`;
                        }

                        vscode.window.showErrorMessage(errorMessage);
                        return ImportStoreActionResponse.create({ data: {} });
                    }
                }
                return ImportStoreActionResponse.create({ data: {} });
            })
        );
        this.toDispose.push(
            this.actionListener.handleVSCodeRequest<RequestSendVisibleElementsAction>(
                RequestSendVisibleElementsAction.KIND,
                async message => {
                    const visibleElementIds = message.action.visibleElementIds;

                    this.actionDispatcher.dispatch({
                        kind: 'setVisibleElements',
                        visibleElementIds
                    } as any);

                    return SendVisibleElementsActionResponse.create({ success: true });
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

    private umleObjectToElement(source: UMLEObject): Element {
        const type = getUMLObjectType(source);

        const target: Element = {
            id: source.id,
            type: type as Type,
            children: [] as Element[]
        };

        if ('name' in source && source.name && typeof source.name === 'string') {
            target.name = source.name;
        }

        const childrenFields = ['ownedParameter', 'ownedAttribute', 'ownedOperation', 'interfaceRealization', 'ownedLiteral'] as const;

        for (const param of childrenFields) {
            if (!(param in source)) {
                continue;
            }

            const sourceChildren = (source as any)[param] as any[];
            const targetChildren = sourceChildren.map(element => this.umleObjectToElement(element)) ?? [];

            target.children?.push(...targetChildren);
        }

        return target;
    }

    private createModelElements(model: UMLSourceModel): Element[] {
        const elements = model.packagedElement?.map(element => this.umleObjectToElement(element));
        return elements ?? [];
    }

    dispose(): void {
        this.toDispose.dispose();
    }
}
