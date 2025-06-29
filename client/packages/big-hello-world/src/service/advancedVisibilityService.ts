/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *
 * The advancedVisibility service extends the 'basic' VisibilityService,
 * by adding layer types (show or hide), that determine if a layer
 * should show or hide it affected elements.
 *
 * The functionality of computing the affected elements is still the same.
 * But the visiblity computation differs in a way that the layer that is
 * responsible for a given element is determined by the layer with the
 * highest priority among those layers that are active. The visiblity of
 * the elment is then determined by the layer type.
 *
 **********************************************************************************/

import type { Element, ElementId, ElementIdsPerLayer, Layer } from '../model/model.js';
import { type IVisibilityService } from './IVisibilityService.js';
import { VisibilityService } from './visibilityService.js';

export class AdvancedVisibilityService extends VisibilityService implements IVisibilityService {
    override computeAffectedElementIdsPerLayer(elements: Element[], layers: Layer[]): ElementIdsPerLayer {
        const elementIdsPerLayer: ElementIdsPerLayer = {};

        for (const layer of layers) {
            const layerElementIds = this.computeAffectedElementIdsForLayer(elements, layer);
            elementIdsPerLayer[layer.id] = layerElementIds;
        }

        elementIdsPerLayer['default'] = this.extractAllElementIds(elements) ?? [];

        console.log('elementIdsPerLayer', elementIdsPerLayer);

        return elementIdsPerLayer;
    }

    override computeVisibleElementIds({ default: allElements, ...elementIds }: ElementIdsPerLayer, layers: Layer[]): ElementId[] {
        if (!allElements) return [];

        const visibleElementIds: ElementId[] = [];
        const hiddenElementIds: ElementId[] = [];

        // Sort layers by zIndex to determine the priority of layers
        const sortedLayers = layers.sort((a, b) => a.zIndex - b.zIndex);

        function isElementHandled(elementId: ElementId): boolean {
            return visibleElementIds.includes(elementId) || hiddenElementIds.includes(elementId);
        }

        // Iterate through each layer to determine visibility
        for (const layer of sortedLayers) {
            if (!layer.active) continue; // Skip inactive layers

            const affectedElementIds = elementIds[layer.id] || [];

            console.log(layer.name, layer.type, layer.active, { affectedElementIds });

            for (const elementId of affectedElementIds) {
                if (isElementHandled(elementId)) continue;

                if (layer.type === 'show') {
                    visibleElementIds.push(elementId);
                } else if (layer.type === 'hide') {
                    hiddenElementIds.push(elementId);
                }
            }
        }

        console.log({ allElements, visibleElementIds, hiddenElementIds });

        // Add remaining elements that are not affected by any layer
        visibleElementIds.push(...allElements.filter(id => !isElementHandled(id)));

        return visibleElementIds;
    }
}
