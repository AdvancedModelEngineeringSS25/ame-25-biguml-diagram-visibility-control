/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { useState } from 'react';
import type { Filter, Layer } from '../model/model.js';
import { FilterDetailsView } from './FilterDetailsView.js';
import { LayerDetailsView } from './LayerDetailsView.js';
import { MainView } from './MainView.js';

// Sample dummy data for testing
const sampleLayers: Layer[] = [
    {
        id: '1',
        name: 'Layer 1',
        visible: true,
        filters: [
            { id: 'f1', type: 'type', types: ['property', 'relation'] },
            { id: 'f2', type: 'pattern', pattern: 'hello' },
            { id: 'f3', type: 'selection', elements: [1, 5, 7] }
        ]
    },
    {
        id: '2',
        name: 'Layer 2',
        visible: false,
        filters: [
            { id: 'f4', type: 'type', types: ['class'] }
        ]
    }
];

export function DiagramVisibilityControl() {
    const [layers, setLayers] = useState<Layer[]>(sampleLayers);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
    const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);

    const selectedLayer = layers.find(l => l.id === selectedLayerId) || null;
    const selectedFilter: Filter | null = selectedLayer?.filters.find(f => f.id === selectedFilterId) || null;

    const goBackToLayers = () => {
        setSelectedLayerId(null);
        setSelectedFilterId(null);
    };

    const goBackToLayer = () => {
        setSelectedFilterId(null);
    };

    if (selectedFilter && selectedLayer) {
        return <FilterDetailsView filter={selectedFilter} onBack={goBackToLayer} />;
    }

    if (selectedLayer) {
        return (
            <LayerDetailsView
                layer={selectedLayer}
                onBack={goBackToLayers}
                onFilterSelect={setSelectedFilterId}
            />
        );
    }

    const moveUp = (id: string) => {
        console.log('moveUp clicked', id);
    };

    const moveDown = (id: string) => {
        console.log('moveDown clicked', id);
    };

    const toggleActive = (id: string) => {
        console.log('toggleActive clicked', id);
        setLayers(prevLayers =>
            prevLayers.map(layer =>
                layer.id === id ? { ...layer, visible: !layer.visible } : layer
            )
        );
    };

    const uploadConfig = () => {
        console.log('uploadConfig clicked');
    };

    const saveConfig = () => {
        console.log('saveConfig clicked');
    };

    const recomputeAll = () => {
        console.log('recomputeAll clicked');
    };

    const addLayer = () => {
        console.log('addLayer clicked');
    };

    return (
        <MainView
            layers={layers}
            moveUp={moveUp}
            moveDown={moveDown}
            toggleActive={toggleActive}
            goToDetails={setSelectedLayerId}
            uploadConfig={uploadConfig}
            saveConfig={saveConfig}
            recomputeAll={recomputeAll}
            addLayer={addLayer}
        />
    );
}
