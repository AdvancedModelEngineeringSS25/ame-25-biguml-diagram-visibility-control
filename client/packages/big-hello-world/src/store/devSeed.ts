/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { type Layer } from '../model/model.js';
import { useLayerStore } from './layerStore.js';

// development-only seed ---------------------------------
const sampleLayers: Layer[] = [
    {
        id: '1',
        name: 'Layer 1',
        visible: true,
        zIndex: 0,
        filters: [
            { id: 'f1', name: 'filter 1', type: 'type', types: ['property', 'relation'] },
            { id: 'f2', name: 'filter 2', type: 'pattern', pattern: 'hello', types: ['property'] },
            { id: 'f3', name: 'filter 3', type: 'selection', elements: ['1', '5', '7'] }
        ]
    },
    {
        id: '2',
        name: 'Layer 2',
        visible: false,
        zIndex: 1,
        filters: [{ id: 'f4', name: 'filter 4', type: 'type', types: ['class'] }]
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
