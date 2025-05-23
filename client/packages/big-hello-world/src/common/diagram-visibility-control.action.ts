/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/

import { type UMLSourceModel } from '@borkdominik-biguml/uml-protocol';
import { Action, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

// ========= This action will be handled by the GLSP Client =========

export interface RequestDiagramVisibilityControlAction extends RequestAction<DiagramVisibilityControlActionResponse> {
    kind: typeof RequestDiagramVisibilityControlAction.KIND;
    increase: number;
    model: any | Readonly<UMLSourceModel> | undefined;
    selectedElementIds?: string[];
}

export namespace RequestDiagramVisibilityControlAction {
    export const KIND = 'requestDiagramVisibilityControl';

    export function is(object: unknown): object is RequestDiagramVisibilityControlAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(
        options: Omit<RequestDiagramVisibilityControlAction, 'kind' | 'requestId'>
    ): RequestDiagramVisibilityControlAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface DiagramVisibilityControlActionResponse extends ResponseAction {
    kind: typeof DiagramVisibilityControlActionResponse.KIND;
    count: number;
    model: any | Readonly<UMLSourceModel> | undefined;
    // model: ReturnType<ReturnType<ExperimentalGLSPServerModelState['getModelState']>['getSourceModel']>;
    selectedElementIds?: { id: string; name: string }[];
}
export namespace DiagramVisibilityControlActionResponse {
    export const KIND = 'DiagramVisibilityControlResponse';

    export function is(object: unknown): object is DiagramVisibilityControlActionResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<DiagramVisibilityControlActionResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): DiagramVisibilityControlActionResponse {
        return {
            kind: KIND,
            responseId: '',
            model: undefined,
            count: 0,
            ...options
        };
    }
}
