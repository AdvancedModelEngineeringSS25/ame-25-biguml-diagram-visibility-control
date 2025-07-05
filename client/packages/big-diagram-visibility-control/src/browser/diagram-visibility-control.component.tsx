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
    ImportStoreActionResponse,
    RequestExportStoreAction,
    RequestImportStoreAction,
    RequestSendVisibleElementsAction
} from '../common/index.js';

import { isEqual } from 'lodash';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DiagramVisibilityControlActionResponse } from '../common/index.js';
import type { Element, ElementIdsPerLayer, Filter, Layer, Type } from '../model/model.js';
import type { IVisibilityService } from '../service/IVisibilityService.js';
import { AdvancedVisibilityService } from '../service/advancedVisibilityService.js';
import { useLayerStore } from '../store/layerStore.js';
import { FilterDetailsView } from './FilterDetailsView.js';
import { LayerDetailsView } from './LayerDetailsView.js';
import { MainView } from './MainView.js';

export function DiagramVisibilityControl() {
    // seedStore();
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
    const [elementIdsPerLayer, setElementIdsPerLayer] = useState<ElementIdsPerLayer>({});
    const [visibleElementIds, setVisibleElementIds] = useState<Element['id'][]>([]);

    const selectedLayer = layers.find(l => l.id === selectedLayerId) || null;
    const selectedFilter: Filter | null = selectedLayer?.filters.find(f => f.id === selectedFilterId) || null;
    const selectedElementIdsRef = useRef<{ id: string; name: string }[]>([]);

    useEffect(() => {
        listenAction(action => {
            if (ImportStoreActionResponse.is(action)) {
                const storeData = action.data;
                if (storeData && Object.keys(storeData).length > 0) {
                    useLayerStore.setState(storeData);
                }
            }
        });
    }, [listenAction]);

    const [model, setModel] = useState<Element[]>([]);
    const [modelLoaded, setModelLoaded] = useState<boolean>(false);
    const visibilityService = useRef<IVisibilityService>(new AdvancedVisibilityService());

    useLayerStore();
    const sendVisibleElementsToVSCode = useCallback(
        (elementIds: string[]) => {
            dispatchAction(
                RequestSendVisibleElementsAction.create({
                    visibleElementIds: elementIds
                })
            );
        },
        [dispatchAction]
    );
    useEffect(() => {
        if (!modelLoaded) return;
        sendVisibleElementsToVSCode(visibleElementIds);
    }, [visibleElementIds, sendVisibleElementsToVSCode, modelLoaded]);

    /******************
    Main View Functions
    ******************/

    const moveUp = (id: string) => {
        const from = layers.findIndex(l => l.id === id);
        if (from <= 0) return; // already top or not found
        storeReorder(from, from - 1);
    };

    const moveDown = (id: string) => {
        const from = layers.findIndex(l => l.id === id);
        if (from < 0 || from >= layers.length - 1) return; // already bottom or not found
        storeReorder(from, from + 1);
    };

    const toggleActive = (id: string) => {
        storeToggle(id);
    };

    const uploadConfig = () => {
        dispatchAction(RequestImportStoreAction.create({}));
    };

    const saveConfig = () => {
        const model = useLayerStore.getState().getModel(); // get current config
        dispatchAction(
            RequestExportStoreAction.create({
                data: JSON.stringify(model, null, 2) // send actual data, not dummy string
            })
        );
    };

    const recomputeVisibleElements = useCallback(() => {
        const visbleElementIds = visibilityService.current.computeVisibleElementIds(elementIdsPerLayer, layers);

        if (!isEqual(visibleElementIds, visbleElementIds)) {
            setVisibleElementIds(visbleElementIds);
        }
    }, [elementIdsPerLayer, visibleElementIds, layers]);

    const recomputeAffectedElementIds = useCallback(() => {
        setElementIdsPerLayer(visibilityService.current.computeAffectedElementIdsPerLayer(model, layers));
    }, [layers, model]);

    useEffect(() => {
        recomputeVisibleElements();
    }, [elementIdsPerLayer, recomputeAffectedElementIds, recomputeVisibleElements]);

    useEffect(() => {
        if (modelLoaded) {
            recomputeAffectedElementIds();
        }
    }, [modelLoaded, recomputeAffectedElementIds]);

    const addLayer = () => {
        storeAddLayer();
    };

    /**********************
    Layer Details Functions
    **********************/

    const goBackToLayers = () => {
        setSelectedLayerId(null);
        setSelectedFilterId(null);
        recomputeAffectedElementIds();
    };

    const changeLayerType = (id: string, type: Layer['type']) => {
        storeUpdateLayer(id, { type });
    };

    const deleteLayer = (id: string) => {
        storeDeleteLayer(id);
        goBackToLayers();
    };

    const changeLayerName = (id: string, name: string) => {
        storeUpdateLayer(id, { name });
    };

    const addFilter = (layerId: string, type: 'type' | 'pattern' | 'selection') => {
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
        storeDeleteFilter(layerId, filterId);
    };

    const changeFilterName = (layerId: string, filterId: string, name: string) => {
        storeUpdateLayer(layerId, {
            filters: selectedLayer?.filters.map(f => (f.id === filterId ? { ...f, name } : f)) || []
        });
    };

    const changePattern = (layerId: string, filterId: string, pattern: string) => {
        storeUpdateLayer(layerId, {
            filters: selectedLayer?.filters.map(f => (f.id === filterId ? { ...f, pattern } : f)) || []
        });
    };

    const goBackToLayer = () => {
        setSelectedFilterId(null);
        recomputeAffectedElementIds();
    };

    const toggleSelectedType = (layerId: string, filterId: string, type: string) => {
        const layer = useLayerStore.getState().layers.find(l => l.id === layerId);
        if (!layer) return;

        const filter = layer.filters.find(f => f.id === filterId);
        if (!filter || filter.type == 'selection') return;
        const currentTypes = Array.isArray((filter as any).types) ? ((filter as any).types as string[]) : [];

        const typesSet = new Set(currentTypes);
        if (typesSet.has(type)) {
            typesSet.delete(type);
        } else {
            typesSet.add(type);
        }

        const updatedFilter: Filter = {
            ...filter,
            types: Array.from(typesSet) as Type[]
        };

        storeUpdateFilter(layerId, filterId, updatedFilter);
    };
    const deleteSelectedElement = (id: string) => {
        storeDeleteSelectedElement(selectedLayerId ?? '', selectedFilterId ?? '', id);
    };

    const addSelection = () => {
        storeAddSelectedElements(selectedLayerId ?? '', selectedFilterId ?? '', selectedElementIdsRef.current);
    };

    /*******
    Listener
    *******/

    useEffect(() => {
        listenAction(action => {
            if (DiagramVisibilityControlActionResponse.is(action)) {
                selectedElementIdsRef.current = action.selectedElementIds ?? [];
                setModel(action.model ?? []);

                if (!modelLoaded && action.model && action.model.length > 0) {
                    setModelLoaded(true);
                }
            }
        });
    }, [listenAction, setModelLoaded, modelLoaded]);

    /*********
    Navigation
    *********/

    if (selectedLayer && !selectedFilter) {
        return (
            <LayerDetailsView
                layer={selectedLayer}
                changeLayerName={changeLayerName}
                onBack={goBackToLayers}
                changeLayerType={changeLayerType}
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
        <>
            <MainView
                layers={layers}
                moveUp={moveUp}
                moveDown={moveDown}
                toggleActive={toggleActive}
                goToDetails={setSelectedLayerId}
                uploadConfig={uploadConfig}
                saveConfig={saveConfig}
                addLayer={addLayer}
            />
        </>
    );
}
