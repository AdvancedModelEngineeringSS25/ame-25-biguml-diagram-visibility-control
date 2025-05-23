/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { Action, RequestAction, type ResponseAction } from '@eclipse-glsp/protocol';

// === EXPORT ACTION ===

export interface RequestExportStoreAction extends RequestAction<ExportStoreActionResponse> {
    kind: typeof RequestExportStoreAction.KIND;
    data: unknown;
}

export namespace RequestExportStoreAction {
    export const KIND = 'requestExportStore';

    export function is(object: unknown): object is RequestExportStoreAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<RequestExportStoreAction, 'kind' | 'requestId'>): RequestExportStoreAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface ExportStoreActionResponse extends ResponseAction {
    kind: typeof ExportStoreActionResponse.KIND;
    success: boolean;
}

export namespace ExportStoreActionResponse {
    export const KIND = 'exportStoreResponse';

    export function is(object: unknown): object is ExportStoreActionResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<ExportStoreActionResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): ExportStoreActionResponse {
        return {
            kind: KIND,
            responseId: '',
            success: false,
            ...options
        };
    }
}

// === IMPORT ACTION ===

export interface RequestImportStoreAction extends RequestAction<ImportStoreActionResponse> {
    kind: typeof RequestImportStoreAction.KIND;
}

export namespace RequestImportStoreAction {
    export const KIND = 'requestImportStore';

    export function is(object: unknown): object is RequestImportStoreAction {
        return RequestAction.hasKind(object, KIND);
    }

    export function create(options: Omit<RequestImportStoreAction, 'kind' | 'requestId'>): RequestImportStoreAction {
        return {
            kind: KIND,
            requestId: '',
            ...options
        };
    }
}

export interface ImportStoreActionResponse extends ResponseAction {
    kind: typeof ImportStoreActionResponse.KIND;
    data: unknown;
}

export namespace ImportStoreActionResponse {
    export const KIND = 'importStoreResponse';

    export function is(object: unknown): object is ImportStoreActionResponse {
        return Action.hasKind(object, KIND);
    }

    export function create(
        options?: Omit<ImportStoreActionResponse, 'kind' | 'responseId'> & { responseId?: string }
    ): ImportStoreActionResponse {
        return {
            kind: KIND,
            responseId: '',
            data: {},
            ...options
        };
    }
}
