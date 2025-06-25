/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 
**********************************************************************************/
interface FilterBase {
    id: string;
    name: string;
}

export type TypeFilter = FilterBase & {
    type: 'type';
    types: string[];
};

export type PatternFilter = FilterBase & {
    type: 'pattern';
    pattern: string;
    types?: string[];
};

export type SelectionFilter = FilterBase & {
    type: 'selection';
    elements: { id: string; name: string }[]; // Change this
};

export type Filter = TypeFilter | SelectionFilter | PatternFilter;

export interface Layer {
    id: string;
    name: string;
    visible: boolean;
    zIndex: number;
    explicitlyShows: boolean
    filters: Filter[];

    /* future-proof */
    groupId?: string;
    styleClass?: string;
}
