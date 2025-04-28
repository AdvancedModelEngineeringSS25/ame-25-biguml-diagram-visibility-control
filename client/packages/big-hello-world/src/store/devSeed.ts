/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { useLayerStore } from './layerStore.js';
import { type Layer } from './types.js';

// development-only seed ---------------------------------
const sampleLayers: Layer[] = [
    {
        id: '1',
        name: 'Layer 1',
        visible: true,
        zIndex: 1,
        filters: [
            { id: '1', name: 'filter 1', type: 'type', types: ['property', 'relation'] },
            { id: '2', name: 'filter 2', type: 'pattern', pattern: 'hello', types: ['property'] },
            { id: '3', name: 'filter 3', type: 'selection', elements: ['1', '5', '7'] }
        ]
    },
    {
        id: '2',
        name: 'Layer 2',
        visible: false,
        zIndex: 2,
        filters: [{ id: '4', name: 'filter 4', type: 'type', types: ['class'] }]
    }
];

export const seedStore = () => {
    // if (import.meta.env.MODE === 'development') {

    // push only if store is still empty
    if (useLayerStore.getState().layers.length === 0) {
        useLayerStore.setState({ layers: sampleLayers });
    }
    // }
};
