/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeContext } from '@borkdominik-biguml/big-components';

import {
    ExportStoreActionResponse,
    ImportStoreActionResponse,
    RequestExportStoreAction,
    RequestImportStoreAction
} from '../common/index.js';

import { DiagramVisibilityControlActionResponse } from '../common/index.js';

import { useContext, useEffect, useRef, useState } from 'react';
import type { Filter } from '../model/model.js';
import { seedStore } from '../store/devSeed.js';
import { useLayerStore } from '../store/layerStore.js';
import { FilterDetailsView } from './FilterDetailsView.js';
import { LayerDetailsView } from './LayerDetailsView.js';
import { MainView } from './MainView.js';

export function DiagramVisibilityControl() {
    seedStore();
    const { dispatchAction, listenAction } = useContext(VSCodeContext);
    const layers = useLayerStore(s => s.layers);
    const storeAddLayer = useLayerStore(s => s.addLayer);
    const storeToggle = useLayerStore(s => s.toggleLayer);
    const storeReorder = useLayerStore(s => s.reorderLayers);
    const storeDeleteLayer = useLayerStore(s => s.deleteLayer);
    const storeUpdateLayer = useLayerStore(s => s.updateLayer);
    const storeAddFilter = useLayerStore(s => s.addFilter);
    const storeUpdateFilter = useLayerStore(s => s.updateFilter);
    const storeDeleteFilter = useLayerStore(s => s.deleteFilter);
    const storeDeleteSelectedElement = useLayerStore(s => s.deleteSelectedElement);
    const storeAddSelectedElements = useLayerStore(s => s.addSelectedElements);
    const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
    const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);

    const selectedLayer = layers.find(l => l.id === selectedLayerId) || null;
    const selectedFilter: Filter | null = selectedLayer?.filters.find(f => f.id === selectedFilterId) || null;
    const selectedElementIdsRef = useRef<{ id: string; name: string }[]>([]);

    useEffect(() => {
        listenAction(action => {
            if (ExportStoreActionResponse.is(action)) {
                console.log('Client ExportStoreActionResponse', action.success);
            }
            if (ImportStoreActionResponse.is(action)) {
                console.log('Save in store');
                const storeData = action.data;
                console.log('storeData', storeData);
                useLayerStore.setState(JSON.parse(typeof storeData === 'string' ? storeData : JSON.stringify(storeData)));
                console.log('Store updated', useLayerStore.getState());
            }
        });
    }, [listenAction]);
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
        dispatchAction(RequestImportStoreAction.create({}));
    };

    const saveConfig = () => {
        console.log('saveConfig clicked');
        const model = useLayerStore.getState().getModel(); // get current config
        console.log('model', JSON.stringify(model, null, 2));
        dispatchAction(
            RequestExportStoreAction.create({
                data: JSON.stringify(model, null, 2) // send actual data, not dummy string
            })
        );
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

    const addFilter = (layerId: string, type: 'type' | 'pattern' | 'selection') => {
        console.log('addFilter clicked', type);
        const f: Filter = storeAddFilter(layerId, type);
        if (f.type == 'selection') {
            storeUpdateFilter(layerId, f.id, {
                id: f.id,
                name: f.name,
                type: 'selection',
                elements: selectedElementIdsRef.current
            });
        }
    };

    /***********************
    Filter Details Functions
    ***********************/

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

    const changePattern = (layerId: string, filterId: string, pattern: string) => {
        console.log('changePattern clicked', layerId, filterId, pattern);
        storeUpdateLayer(layerId, {
            filters: selectedLayer?.filters.map(f => (f.id === filterId ? { ...f, pattern } : f)) || []
        });
    };

    const goBackToLayer = () => {
        console.log('goBackToLayer clicked');
        setSelectedFilterId(null);
    };

    const toggleSelectedType = (layerId: string, filterId: string, type: string) => {
        const allowedTypes = ['class', 'property', 'relation', 'method', 'interface'];
        if (!allowedTypes.includes(type)) return;

        const layer = useLayerStore.getState().layers.find(l => l.id === layerId);
        if (!layer) return;

        const filter = layer.filters.find(f => f.id === filterId);
        if (!filter || filter.type == 'selection') return;

        // Ensure types is of the correct literal type array
        const currentTypes = Array.isArray((filter as any).types) ? ((filter as any).types as string[]) : [];

        const typesSet = new Set(currentTypes);
        if (typesSet.has(type)) {
            typesSet.delete(type);
        } else {
            typesSet.add(type);
        }

        const updatedFilter: Filter = {
            ...filter,
            types: Array.from(typesSet) as ('class' | 'property' | 'relation' | 'method' | 'interface')[]
        };

        storeUpdateFilter(layerId, filterId, updatedFilter);
    };
    const deleteSelectedElement = (id: string) => {
        console.log('deleteSelectedElement clicked', id);
        storeDeleteSelectedElement(selectedLayerId ?? '', selectedFilterId ?? '', id);
    };

    const addSelection = (id: string) => {
        console.log('addSelection clicked', id);
        storeAddSelectedElements(selectedLayerId ?? '', selectedFilterId ?? '', selectedElementIdsRef.current);
    };

    /*******
        Listener
        *******/

    useEffect(() => {
        listenAction(action => {
            if (DiagramVisibilityControlActionResponse.is(action)) {
                selectedElementIdsRef.current = action.selectedElementIds ?? [];
            }
        });
    }, [listenAction]);

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
        return (
            <FilterDetailsView
                layerId={selectedLayer.id}
                filter={selectedFilter}
                onBack={goBackToLayer}
                changePattern={(layerId, filterId, pattern) => {
                    changePattern(layerId, filterId, pattern);
                }}
                onChangeName={name => changeFilterName(selectedLayer.id, selectedFilter.id, name)}
                toggleSelectedType={toggleSelectedType}
                deleteSelectedElement={deleteSelectedElement}
                addSelection={addSelection}
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
