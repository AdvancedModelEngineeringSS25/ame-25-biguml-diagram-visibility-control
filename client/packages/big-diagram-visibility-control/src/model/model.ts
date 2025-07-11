/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

export type Element = {
    id: string;
    type: Type;
    name?: string;
    children?: Element[];
};

export type ElementId = Element['id'];

export type ElementIdsPerLayer = Record<Layer['id'] | 'default', ElementId[]>;

interface FilterBase {
    id: string;
    name: string;
}

export type TypeFilter = FilterBase & {
    type: 'type';
    types: Type[];
};

export type PatternFilter = FilterBase & {
    type: 'pattern';
    pattern: string;
    types?: Type[];
};

export type SelectionFilter = FilterBase & {
    type: 'selection';
    elements: { id: string; name?: string }[];
};

export type Filter = TypeFilter | SelectionFilter | PatternFilter;

export interface Layer {
    id: string;
    name: string;
    active: boolean;
    zIndex: number;
    filters: Filter[];
    type: 'hide' | 'show';

    /* future-proof */
    groupId?: string;
    styleClass?: string;
}

export const ALL_TYPES = [
    'Class',
    'Interface',
    'Enumeration',
    'PrimitiveType',
    'EnumerationLiteral',
    'OwnedAttribute',
    'OwnedOperation',
    'OwnedParameter',
    'EObjectReference',
    'LiteralInteger',
    'LiteralUnlimitedNatural',
    'UMLInterfaceRealization',
    'UMLUsage',
    'UMLSourceModel',
    'EObject'
] as const;

export type Type = (typeof ALL_TYPES)[number];
