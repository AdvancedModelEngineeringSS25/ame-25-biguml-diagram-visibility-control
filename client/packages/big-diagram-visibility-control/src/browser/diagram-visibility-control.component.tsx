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
            if (ExportStoreActionResponse.is(action)) {
                console.log('Client ExportStoreActionResponse', action.success);
            }
            if (ImportStoreActionResponse.is(action)) {
                console.log('Save in store');
                const storeData = action.data;
                console.log('storeData', storeData);

                // Additional safety check - ensure we're not setting empty data
                if (storeData && Object.keys(storeData).length > 0) {
                    // The data is already validated at this point, so we can safely set it
                    useLayerStore.setState(storeData);
                    console.log('Store updated', useLayerStore.getState());
                } else {
                    console.log('No valid data to import, keeping current state');
                }
            }
        });
    }, [listenAction]);

    const [model, setModel] = useState<Element[]>([]);
    const [modelLoaded, setModelLoaded] = useState<boolean>(false);
    const visibilityService = useRef<IVisibilityService>(new AdvancedVisibilityService());

    useLayerStore();
    // Send visible elements to VS Code when they change
    const sendVisibleElementsToVSCode = useCallback(
        (elementIds: string[]) => {
            console.log('Sending visible elements to VS Code:', elementIds);
            dispatchAction(
                RequestSendVisibleElementsAction.create({
                    visibleElementIds: elementIds
                })
            );
        },
        [dispatchAction]
    );

    // Effect to send visible elements when they change
    useEffect(() => {
        if (!modelLoaded) return;
        sendVisibleElementsToVSCode(visibleElementIds);
    }, [visibleElementIds, sendVisibleElementsToVSCode, modelLoaded]);

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

    const recomputeVisibleElements = useCallback(() => {
        const visbleElementIds = visibilityService.current.computeVisibleElementIds(elementIdsPerLayer, layers);
        console.log('visbleElementIds', visbleElementIds);

        if (!isEqual(visibleElementIds, visbleElementIds)) {
            setVisibleElementIds(visbleElementIds);
        }
    }, [elementIdsPerLayer, visibleElementIds, layers]);

    const recomputeAffectedElementIds = useCallback(() => {
        console.log('recomputeAffectedElementIds');

        setElementIdsPerLayer(visibilityService.current.computeAffectedElementIdsPerLayer(model, layers));
        console.log('elementIdsPerLayer', elementIdsPerLayer);

        // recomputeVisibleElements();
    }, [layers, elementIdsPerLayer, model]);

    useEffect(() => {
        recomputeVisibleElements();
    }, [elementIdsPerLayer, recomputeAffectedElementIds, recomputeVisibleElements]);

    useEffect(() => {
        console.log('modelLoaded', { modelLoaded });
        if (modelLoaded) {
            recomputeAffectedElementIds();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modelLoaded]);

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
        recomputeAffectedElementIds();
    };

    const changeLayerType = (id: string, type: Layer['type']) => {
        console.log('changeLayerType clicked', id, type);
        storeUpdateLayer(id, { type });
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
        recomputeAffectedElementIds();
    };

    const toggleSelectedType = (layerId: string, filterId: string, type: string) => {
        // const allowedTypes = ['class', 'property', 'relation', 'method', 'interface'];
        // if (!allowedTypes.includes(type)) return;

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
            types: Array.from(typesSet) as Type[]
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
                console.log(action.model);
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
            {/* <br />
            <br />
            <h2>Visible Element IDs</h2>
            {visibleElementIds.map(item => {
                const isNotTargetedByLayer = elementIdsPerLayer['default'].includes(item);
                return (
                    <div key={item} style={{ opacity: isNotTargetedByLayer ? 0.5 : 1 }}>
                        {item}
                    </div>
                );
            })} */}
        </>
    );
}
