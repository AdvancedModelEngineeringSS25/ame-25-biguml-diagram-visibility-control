/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { Element, ElementId, ElementIdsPerLayer, Layer, PatternFilter, SelectionFilter, TypeFilter } from '../model/model.js';

export interface IVisibilityService {
    computeAffectedElementIdsPerLayer(elements: Element[], layers: Layer[]): ElementIdsPerLayer;

    computeAffectedElementIdsForLayer(elements: Element[], layer: Layer): ElementId[];

    // computeAffectedElementIdsForFilter(elements: Element[], filter: Filter): ElementId[];

    computeAffectedElementIdsForTypeFilter(elements: Element[], filter: TypeFilter): ElementId[];

    computeAffectedElementIdsForPatternFilter(elements: Element[], filter: PatternFilter): ElementId[];

    computeAffectedElementIdsForSelectionFilter(elements: Element[], filter: SelectionFilter): ElementId[];

    computeVisibleElementIds(elementIds: ElementIdsPerLayer, layers: Layer[]): ElementId[];
}
