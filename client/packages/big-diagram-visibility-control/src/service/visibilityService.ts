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

        const sortedLayers = layers.sort((a, b) => a.zIndex - b.zIndex);

        for (const layer of sortedLayers) {
            const layerElementIds = this.computeAffectedElementIdsForLayer(elements, layer);

            // the layer with the highest z-index is responsible (layers are sorted by z-index)
            // if we already saw the id the current layer is not responsible for handling it
            const affectedElementIds = layerElementIds.filter(elementId => !seenIds?.includes(elementId));

            seenIds.push(...layerElementIds);

            elementIdsPerLayer[layer.id] = affectedElementIds;
        }

        elementIdsPerLayer['default'] = this.extractAllElementIds(elements).filter(id => !seenIds.includes(id));

        return elementIdsPerLayer;
    }

    extractAllElementIds(elements: Element[]): ElementId[] {
        const elementIds: ElementId[] = [];

        for (const element of elements) {
            elementIds.push(element.id);
            if (element.children) {
                elementIds.push(...this.extractAllElementIds(element.children));
            }
        }

        return [...new Set(elementIds)];
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

    computeAffectedElementIdsForFilter(elements: Element[], filter: Filter): ElementId[] {
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
        const types = filter.types;
        const affectedElementIds = new Set<ElementId>();

        for (const element of elements) {
            if (types.includes(element.type)) {
                affectedElementIds.add(element.id);

                if (element.children) {
                    this.extractAllElementIds(element.children).forEach(childId => affectedElementIds.add(childId));
                }
            }
        }

        return [...affectedElementIds];
    }

    computeAffectedElementIdsForPatternFilter(elements: Element[], filter: PatternFilter): ElementId[] {
        const affectedElementIds = new Set<ElementId>();
        const matcher = this.matchPattern(filter.pattern);

        for (const element of elements) {
            if (element.name && matcher(element.name)) {
                affectedElementIds.add(element.id);

                if (element.children) {
                    this.extractAllElementIds(element.children).forEach(childId => affectedElementIds.add(childId));
                }
            }
        }

        return [...affectedElementIds];
    }

    private matchPattern(input: string): (text: string) => boolean {
        if (input.startsWith('/') && input.lastIndexOf('/') > 0) {
            // Try to parse the regex
            const lastSlash = input.lastIndexOf('/');
            const pattern = input.slice(1, lastSlash);
            const flags = input.slice(lastSlash + 1);

            try {
                const regex = new RegExp(pattern, flags);
                return (text: string) => regex.test(text);
            } catch (e: any) {
                console.error('Invalid regex:', e.message);
                return () => false;
            }
        } else {
            const normalized = input.toLowerCase();
            return (text: string) => text.toLowerCase().includes(normalized);
        }
    }

    computeAffectedElementIdsForSelectionFilter(elements: Element[], filter: SelectionFilter): ElementId[] {
        const selectedElementIds = filter.elements;
        const affectedElementIds = new Set<ElementId>();

        for (const element of elements) {
            if (selectedElementIds.some(item => item.id === element.id)) {
                affectedElementIds.add(element.id);

                if (element.children) {
                    const childIds = this.extractAllElementIds(element.children);

                    childIds.forEach(childId => affectedElementIds.add(childId));
                }
            } else if (element.children) {
                const affectedChildren = this.computeAffectedElementIdsForSelectionFilter(element.children, filter);

                affectedChildren.forEach(childId => affectedElementIds.add(childId));
            }
        }

        return [...affectedElementIds];
    }

    computeVisibleElementIds({ default: remainingElements, ...elementIds }: ElementIdsPerLayer, layers: Layer[]): ElementId[] {
        const visibleElementIds = new Set<ElementId>(remainingElements);

        for (const layer of layers) {
            const layerElementIds = elementIds[layer.id];
            if (!layerElementIds || !layer.active) continue;

            for (const id of layerElementIds) {
                visibleElementIds.add(id);
            }
        }

        return [...new Set(visibleElementIds)];
    }
}
