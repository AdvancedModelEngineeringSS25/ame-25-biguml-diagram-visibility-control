/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Filter, Layer, SelectionFilter } from '../model/model.js';

interface LayerState {
    layers: Layer[];
    configuration: string;

    addLayer: () => void;
    updateLayer: (id: string, patch: Partial<Omit<Layer, 'id'>>) => void;
    deleteLayer: (id: string) => void;
    reorderLayers: (from: number, to: number) => void;
    toggleLayer: (id: string) => void;

    addFilter: (layerId: string, f: Filter) => void;
    updateFilter: (layerId: string, filterId: string, f: Filter) => void;
    deleteFilter: (layerId: string, filterId: string) => void;

    setConfiguration: (name: string) => void;
    getVisibleElementIds: () => string[];
    getModel: () => { layers: Layer[]; configuration: string };
}

export const useLayerStore = create<LayerState>()(
    persist(
        (set, get) => ({
            layers: [],
            configuration: 'default',

            addLayer: () => {
                const id = crypto.randomUUID();
                // find max zIndex + 1 in the current layers
                // if zIndex is set, use it
                const name = `Layer ${get().layers.length + 1}`;
                const zIndex = get().layers.length + 1; //TODO set highest value plus 1
                const newLayer: Layer = {
                    id,
                    name,
                    zIndex,
                    visible: true,
                    filters: []
                };
                set(state => ({
                    layers: [...state.layers, newLayer]
                }));
            },

            updateLayer: (id, patch) => {
                set(state => ({
                    layers: state.layers.map(l => (l.id === id ? { ...l, ...patch } : l))
                }));
            },

            deleteLayer: id => {
                set(state => ({
                    layers: state.layers.filter(l => l.id !== id)
                }));
            },

            reorderLayers: (from, to) => {
                set(state => {
                    const layers = [...state.layers];
                    const [moved] = layers.splice(from, 1);
                    layers.splice(to, 0, moved);
                    layers.forEach((l, i) => (l.zIndex = i));
                    return { layers };
                });
            },

            toggleLayer: id => {
                set(state => ({
                    layers: state.layers.map(l => (l.id === id ? { ...l, visible: !l.visible } : l))
                }));
            },

            addFilter: (layerId, f) => {
                set(state => ({
                    layers: state.layers.map(l => (l.id === layerId ? { ...l, filters: [...l.filters, f] } : l))
                }));
            },

            updateFilter: (layerId, filterId, f) => {
                set(state => ({
                    layers: state.layers.map(l =>
                        l.id === layerId
                            ? {
                                  ...l,
                                  filters: l.filters.map((old, i) => (i !== Number(filterId) ? old : f))
                              }
                            : l
                    )
                }));
            },

            deleteFilter: (layerId, filterId) => {
                set(state => ({
                    layers: state.layers.map(l =>
                        l.id === layerId
                            ? {
                                  ...l,
                                  filters: l.filters.filter((_, i) => i !== Number(filterId))
                              }
                            : l
                    )
                }));
            },

            setConfiguration: name => set({ configuration: name }),

            getVisibleElementIds: () => {
                const ordered = get()
                    .layers.filter(l => l.visible)
                    .sort((a, b) => a.zIndex - b.zIndex);

                const ids = new Set<string>();
                for (const layer of ordered) {
                    for (const f of layer.filters) {
                        if (f.type === 'selection') {
                            (f as SelectionFilter).elements.forEach(id => ids.add(id));
                        }
                    }
                }
                return [...ids];
            },

            getModel: () => ({
                layers: get().layers,
                configuration: get().configuration
            })
        }),
        {
            name: 'diagram-layer-state'
        }
    )
);
