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
    type: 'type';
    types: string[];
}

export interface PatternFilter {
    id: string;
    type: 'pattern';
    pattern: string;
}

export interface SelectionFilter {
    id: string;
    type: 'selection';
    elements: number[];
}

export type Filter = TypeFilter | PatternFilter | SelectionFilter;

export interface Layer {
    id: string;
    name: string;
    visible: boolean;
    filters: Filter[];
}