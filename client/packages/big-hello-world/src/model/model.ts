/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

export type FilterType = 'type' | 'pattern' | 'selection';

export interface TypeFilter {
    id: string;
    name: string;
    type: 'type';
    types: string[];
}

export interface PatternFilter {
    id: string;
    name: string;
    type: 'pattern';
    pattern: string;
    types: string[];
}

export interface SelectionFilter {
    id: string;
    name: string;
    type: 'selection';
    elements: string[];
}

export type Filter = TypeFilter | PatternFilter | SelectionFilter;

export interface Layer {
    id: string;
    name: string;
    visible: boolean;
    filters: Filter[];
}

export const ALL_TYPES = ['class', 'property', 'relation', 'method', 'interface'];
