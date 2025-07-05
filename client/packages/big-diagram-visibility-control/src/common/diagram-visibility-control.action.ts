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

export interface RequestDiagramVisibilityControlAction extends RequestAction<DiagramVisibilityControlActionResponse> {
    kind: typeof RequestDiagramVisibilityControlAction.KIND;
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
    model: any | Readonly<UMLSourceModel> | undefined;
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
            ...options
        };
    }
}

export interface RequestSendVisibleElementsAction extends RequestAction<SendVisibleElementsActionResponse> {
    kind: typeof RequestSendVisibleElementsAction.KIND;
    visibleElementIds: string[];
}

export namespace RequestSendVisibleElementsAction {
    export const KIND = 'requestSendVisibleElements';

    export function is(object: unknown): object is RequestSendVisibleElementsAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<RequestSendVisibleElementsAction, 'kind' | 'requestId'>): RequestSendVisibleElementsAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface SendVisibleElementsActionResponse extends ResponseAction {
    kind: typeof SendVisibleElementsActionResponse.KIND;
    success: boolean;
}

export namespace SendVisibleElementsActionResponse {
    export const KIND = 'sendVisibleElementsResponse';

    export function is(object: unknown): object is SendVisibleElementsActionResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<SendVisibleElementsActionResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): SendVisibleElementsActionResponse {
        return {
            kind: KIND,
            responseId: '',
            success: false,
            ...options
        };
    }
}
