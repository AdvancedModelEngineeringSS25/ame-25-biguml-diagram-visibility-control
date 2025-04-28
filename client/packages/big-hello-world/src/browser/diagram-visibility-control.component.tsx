/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { useState } from 'react';
import type { Filter } from '../model/model.js';
import { useLayerStore } from '../store/layerStore.js';
import { FilterDetailsView } from './FilterDetailsView.js';
import { LayerDetailsView } from './LayerDetailsView.js';
import { MainView } from './MainView.js';
export function DiagramVisibilityControl() {
    // seedStore();
    const layers = useLayerStore(s => s.layers);
    const storeAddLayer = useLayerStore(s => s.addLayer);
    const storeToggle = useLayerStore(s => s.toggleLayer);
    const storeReorder = useLayerStore(s => s.reorderLayers);
    const storeDeleteLayer = useLayerStore(s => s.deleteLayer);
    const storeUpdateLayer = useLayerStore(s => s.updateLayer);
    const storeAddFilter = useLayerStore(s => s.addFilter);
    const storeDeleteFilter = useLayerStore(s => s.deleteFilter);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
    const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);

    const selectedLayer = layers.find(l => l.id === selectedLayerId) || null;
    const selectedFilter: Filter | null = selectedLayer?.filters.find(f => f.id === selectedFilterId) || null;

    /******************
    Main View Functions
    ******************/

    const moveUp = (id: string) => {
        console.log('moveUp clicked', id);
        const from = layers.findIndex(l => l.id === id);
        if (from <= 0) return; // already top or not found
        storeReorder(from, from - 1);
    };

    const moveDown = (id: string) => {
        console.log('moveDown clicked', id);
        const from = layers.findIndex(l => l.id === id);
        if (from < 0 || from >= layers.length - 1) return; // already bottom or not found
        storeReorder(from, from + 1);
    };

    const toggleActive = (id: string) => {
        console.log('toggleActive clicked', id);
        storeToggle(id);
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
        storeAddLayer();
    };

    /**********************
    Layer Details Functions
    **********************/

    const goBackToLayers = () => {
        console.log('goBackToLayers clicked');
        setSelectedLayerId(null);
        setSelectedFilterId(null);
    };

    const deleteLayer = (id: string) => {
        console.log('deleteLayer clicked', id);
        storeDeleteLayer(id);
    };

    const changeLayerName = (id: string, name: string) => {
        console.log('changeLayerName clicked', id, name);
        storeUpdateLayer(id, { name });
    };

    /***********************
    Filter Details Functions
    ***********************/

    const addFilter = (layerId: string) => {
        console.log('addFilter clicked');
        storeAddFilter(layerId);
    };

    const deleteFilter = (layerId: string, filterId: string) => {
        console.log('deleteFilter clicked', layerId, filterId);
        storeDeleteFilter(layerId, filterId);
    };

    const changeFilterName = (layerId: string, filterId: string, name: string) => {
        console.log('changeFilterName clicked', layerId, filterId, name);
        storeUpdateLayer(layerId, {
            filters: selectedLayer?.filters.map(f => (f.id === filterId ? { ...f, name } : f)) || []
        });
    };

    const goBackToLayer = () => {
        console.log('goBackToLayer clicked');
        setSelectedFilterId(null);
    };

    const toggleSelectedType = (id: string) => {
        console.log('toggleSelectedType clicked', id);
    };

    const deleteSelectedElement = (id: string) => {
        console.log('deleteSelectedElement clicked', id);
    };

    const startSelection = (id: string) => {
        console.log('startSelection clicked', id);
    };

    /*********
    Navigation
    *********/

    if (selectedLayer && !selectedFilter) {
        return (
            <LayerDetailsView
                layer={selectedLayer}
                changeLayerName={changeLayerName}
                onBack={goBackToLayers}
                deleteFilter={deleteFilter}
                deleteLayer={deleteLayer}
                addFilter={addFilter}
                onFilterSelect={setSelectedFilterId}
            />
        );
    }

    if (selectedFilter && selectedLayer) {
        console.log('returning FilterDetailsView');
        return (
            <FilterDetailsView
                filter={selectedFilter}
                onBack={goBackToLayer}
                onChangeName={name => changeFilterName(selectedLayer.id, selectedFilter.id, name)}
                toggleSelectedType={toggleSelectedType}
                deleteSelectedElement={deleteSelectedElement}
                startSelection={startSelection}
            />
        );
    }

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
