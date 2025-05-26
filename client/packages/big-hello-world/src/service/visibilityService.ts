/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/

import type { Element, ElementId, ElementIdsPerLayer, Filter, Layer, PatternFilter, SelectionFilter, TypeFilter } from '../model/model.js';
import { type IVisibilityService } from './IVisibilityService.js';

export class VisibilityService implements IVisibilityService {
    computeAffectedElementIdsPerLayer(elements: Element[], layers: Layer[]): ElementIdsPerLayer {
        const elementIdsPerLayer: ElementIdsPerLayer = {};
        const seenIds: ElementId[] = [];

        const sortedLayers = layers.sort((a, b) => b.zIndex - a.zIndex);

        console.log('sortedLayers', sortedLayers);

        for (const layer of sortedLayers) {
            const layerElementIds = this.computeAffectedElementIdsForLayer(elements, layer);

            // the layer with the highest z-index is responsible (layers are sorted by z-index)
            // if we already saw the id the current layer is not responsible for handling it
            const affectedElementIds = layerElementIds.filter(elementId => !seenIds?.includes(elementId));

            seenIds.push(...layerElementIds);

            elementIdsPerLayer[layer.id] = affectedElementIds;
        }

        return elementIdsPerLayer;
    }

    computeAffectedElementIdsForLayer(elements: Element[], layer: Layer): ElementId[] {
        let elementIds: ElementId[] | undefined = undefined;

        for (const filter of layer.filters) {
            const affectedElementIds = this.computeAffectedElementIdsForFilter(elements, filter);

            if (!elementIds) {
                elementIds = affectedElementIds;
                continue;
            }

            // the layers are combined using logical AND (only intersection is returned)
            const overlappingElementIds = elementIds.filter(id => affectedElementIds.includes(id));
            return overlappingElementIds;
        }

        return [...new Set(elementIds)];
    }

    private computeAffectedElementIdsForFilter(elements: Element[], filter: Filter): ElementId[] {
        switch (filter.type) {
            case 'type':
                return this.computeAffectedElementIdsForTypeFilter(elements, filter);
            case 'pattern':
                return this.computeAffectedElementIdsForPatternFilter(elements, filter);
            case 'selection':
                return this.computeAffectedElementIdsForSelectionFilter(elements, filter);
        }
    }

    computeAffectedElementIdsForTypeFilter(elements: Element[], filter: TypeFilter): ElementId[] {
        console.log(elements, filter);

        const types = filter.types;
        const affectedElementIds = new Set<ElementId>();

        for (const element of elements) {
            if (types.includes(element.type)) {
                affectedElementIds.add(element.id);
            }
        }

        return [...affectedElementIds];
    }

    computeAffectedElementIdsForPatternFilter(_elements: Element[], _filter: PatternFilter): ElementId[] {
        // throw new Error('Method not implemented.');
        return [];
    }

    computeAffectedElementIdsForSelectionFilter(elements: Element[], filter: SelectionFilter): ElementId[] {
        const selectedElementIds = filter.elements;
        const affectedElementIds = new Set<ElementId>();

        for (const element of elements) {
            if (selectedElementIds.some(item => item.id === element.id)) {
                affectedElementIds.add(element.id);
            }
        }

        return [...affectedElementIds];
    }

    computeVisibleElementIds(elementIds: ElementIdsPerLayer, layers: Layer[]): ElementId[] {
        const visibleElementIds = new Set<ElementId>();

        for (const layer of layers) {
            const layerElementIds = elementIds[layer.id];
            if (!layer.visible || !layerElementIds) continue;

            for (const id of layerElementIds) {
                visibleElementIds.add(id);
            }
        }

        return [...new Set(visibleElementIds)];
    }
}
