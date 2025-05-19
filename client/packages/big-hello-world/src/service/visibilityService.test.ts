/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { describe, expect, it } from 'vitest';
import { type Element, type ElementIdsPerLayer, type Layer, type SelectionFilter, type TypeFilter } from '../model/model.js';
import { type IVisibilityService } from './IVisibilityService.js';
import { VisibilityService } from './visibilityService.js';

function constructElement(
    element: {
        id: Element['id'];
    } & Partial<Element>
): Element {
    return {
        type: 'class',
        children: [],
        ...element
    };
}

describe('VisiblityService', () => {
    const visibilityService: IVisibilityService = new VisibilityService();

    describe('computeAffectedElementIdsForSelectionFilter', () => {
        const filterBase: Omit<SelectionFilter, 'elements'> = {
            id: '1',
            name: 'filter 1',
            type: 'selection'
        };

        it('should only return selected elementIds', async () => {
            const elements: Element[] = [
                constructElement({ id: '1' }),
                constructElement({ id: '2' }),
                constructElement({ id: '3' }),
                constructElement({ id: '4' }),
                constructElement({ id: '5' })
            ];

            const selectedElementIds = ['1', '2', '3'];

            const filter: SelectionFilter = {
                ...filterBase,
                elements: selectedElementIds
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForSelectionFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual(selectedElementIds);
        });

        it('should not return elementIds that are not existing', async () => {
            const elements: Element[] = [constructElement({ id: '1' }), constructElement({ id: '2' }), constructElement({ id: '3' })];

            const selectedElementIds = ['0', '4'];

            const filter: SelectionFilter = {
                ...filterBase,
                elements: selectedElementIds
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForSelectionFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual([]);
        });

        it('should return empty array if no elements are selected', async () => {
            const elements: Element[] = [
                constructElement({ id: '1' }),
                constructElement({ id: '2' }),
                constructElement({ id: '3' }),
                constructElement({ id: '4' }),
                constructElement({ id: '5' })
            ];

            const selectedElementIds: string[] = [];

            const filter: SelectionFilter = {
                ...filterBase,
                elements: selectedElementIds
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForSelectionFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual(selectedElementIds);
        });

        it('should return empty array if no elements are present', async () => {
            const elements: Element[] = [];

            const selectedElementIds: string[] = [];

            const filter: SelectionFilter = {
                ...filterBase,
                elements: selectedElementIds
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForSelectionFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual(selectedElementIds);
        });
    });

    describe('computeAffectedElementIdsForTypeFilter', () => {
        const filterBase: Omit<TypeFilter, 'types'> = {
            id: '1',
            name: 'filter 1',
            type: 'type'
        };

        // we assume that the implementation is correct if it works for one type and therfore only test the type 'class'
        it('should return elementIds for matching single type', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', type: 'class' }),
                constructElement({ id: '2', type: 'interface' }),
                constructElement({ id: '3', type: 'property' }),
                constructElement({ id: '4', type: 'relation' }),
                constructElement({ id: '5', type: 'method' }),
                constructElement({ id: '6', type: 'class' })
            ];

            const filter: TypeFilter = {
                ...filterBase,
                types: ['class']
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForTypeFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual(['1', '6']);
        });

        it('should return elementIds for matching multiple types', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', type: 'class' }),
                constructElement({ id: '2', type: 'interface' }),
                constructElement({ id: '3', type: 'property' }),
                constructElement({ id: '4', type: 'relation' }),
                constructElement({ id: '5', type: 'method' }),
                constructElement({ id: '6', type: 'class' })
            ];

            const filter: TypeFilter = {
                ...filterBase,
                types: ['class', 'interface']
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForTypeFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual(['1', '2', '6']);
        });

        it('should return empty array if no elements are present', async () => {
            const elements: Element[] = [];

            const filter: TypeFilter = {
                ...filterBase,
                types: ['class']
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForTypeFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual([]);
        });

        it('should return empty array if no elements are matching the type', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', type: 'interface' }),
                constructElement({ id: '2', type: 'interface' }),
                constructElement({ id: '3', type: 'property' }),
                constructElement({ id: '4', type: 'relation' }),
                constructElement({ id: '5', type: 'method' })
            ];

            const filter: TypeFilter = {
                ...filterBase,
                types: ['class']
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForTypeFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual([]);
        });

        it('should return empty array if no types are present', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', type: 'interface' }),
                constructElement({ id: '2', type: 'interface' }),
                constructElement({ id: '3', type: 'property' }),
                constructElement({ id: '4', type: 'relation' }),
                constructElement({ id: '5', type: 'method' })
            ];

            const filter: TypeFilter = {
                ...filterBase,
                types: []
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForTypeFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual([]);
        });
    });

    describe('computeAffectedElementIdsPerLayer', () => {
        const filterBase: Omit<SelectionFilter, 'elements'> = {
            id: '1',
            name: 'filter 1',
            type: 'selection'
        };

        const layerBase: Omit<Layer, 'filters' | 'zIndex' | 'id'> = {
            name: 'layer 1',
            visible: true
        };

        it('should only set elementId for the layer with the highest relevant z-index', async () => {
            const elements: Element[] = [
                constructElement({ id: '1' }),
                constructElement({ id: '2' }),
                constructElement({ id: '3' }),
                constructElement({ id: '4' }),
                constructElement({ id: '5' }),
                constructElement({ id: '6' })
            ];

            const layers: Layer[] = [
                {
                    ...layerBase,
                    id: '2',
                    zIndex: 2,
                    filters: [
                        {
                            ...filterBase,
                            elements: ['1', '2', '3']
                        }
                    ]
                },
                {
                    ...layerBase,
                    id: '1',
                    zIndex: 1,
                    filters: [
                        {
                            ...filterBase,
                            elements: ['2']
                        }
                    ]
                },
                {
                    ...layerBase,
                    id: '-1',
                    zIndex: -1,
                    filters: [
                        {
                            ...filterBase,
                            elements: ['4']
                        }
                    ]
                },
                {
                    ...layerBase,
                    id: '3',
                    zIndex: 3,
                    filters: [
                        {
                            ...filterBase,
                            elements: ['3']
                        }
                    ]
                }
            ];

            const elementIdsPerLayer = visibilityService.computeAffectedElementIdsPerLayer(elements, layers);

            expect(elementIdsPerLayer['3']).toStrictEqual(['3']);
            expect(elementIdsPerLayer['2']).toStrictEqual(['1', '2']);
            expect(elementIdsPerLayer['1']).toStrictEqual([]);
            expect(elementIdsPerLayer['-1']).toStrictEqual(['4']);
        });

        it('should return object with empty arrays if no elements are present', async () => {
            const elements: Element[] = [];

            const layers: Layer[] = [
                {
                    ...layerBase,
                    id: '1',
                    zIndex: 1,
                    filters: [
                        {
                            ...filterBase,
                            elements: ['1', '2', '3']
                        }
                    ]
                }
            ];

            const elementIdsPerLayer = visibilityService.computeAffectedElementIdsPerLayer(elements, layers);

            expect(elementIdsPerLayer['1']).toStrictEqual([]);
        });

        it('should return empty object if no layers are present', async () => {
            const elements: Element[] = [constructElement({ id: '1' }), constructElement({ id: '2' }), constructElement({ id: '3' })];

            const layers: Layer[] = [];

            const elementIdsPerLayer = visibilityService.computeAffectedElementIdsPerLayer(elements, layers);

            expect(elementIdsPerLayer).toStrictEqual({});
        });
    });

    describe('computeVisibleElementIds', () => {
        const layerBase: Omit<Layer, 'visible' | 'id'> = {
            name: 'layer 1',
            zIndex: 1,
            filters: []
        };

        it('should return all elementIds managed by visible layers', async () => {
            const layers: Layer[] = [
                {
                    ...layerBase,
                    id: '1',
                    visible: true
                },
                {
                    ...layerBase,
                    id: '2',
                    visible: false
                }
            ];

            const elementIdsPerLayer: ElementIdsPerLayer = {
                '1': ['2', '3'],
                '2': ['1', '4', '5']
            };

            const visibleElementIds = visibilityService.computeVisibleElementIds(elementIdsPerLayer, layers);

            expect(visibleElementIds).toStrictEqual(['2', '3']);
        });

        it('should return empty array if no layers are present', async () => {
            const layers: Layer[] = [];

            const elementIdsPerLayer: ElementIdsPerLayer = {
                '1': ['2', '3'],
                '2': ['1', '4', '5']
            };

            const visibleElementIds = visibilityService.computeVisibleElementIds(elementIdsPerLayer, layers);

            expect(visibleElementIds).toStrictEqual([]);
        });

        it('should return empty array if no elementIds are present', async () => {
            const layers: Layer[] = [
                {
                    ...layerBase,
                    id: '1',
                    visible: true
                }
            ];

            const elementIdsPerLayer: ElementIdsPerLayer = {};

            const visibleElementIds = visibilityService.computeVisibleElementIds(elementIdsPerLayer, layers);

            expect(visibleElementIds).toStrictEqual([]);
        });

        it('should return empty array if no elementIds are managed by visible layers', async () => {
            const layers: Layer[] = [
                {
                    ...layerBase,
                    id: '1',
                    visible: false
                }
            ];

            const elementIdsPerLayer: ElementIdsPerLayer = {
                '1': ['2', '3']
            };

            const visibleElementIds = visibilityService.computeVisibleElementIds(elementIdsPerLayer, layers);

            expect(visibleElementIds).toStrictEqual([]);
        });
    });

    describe('computeAffectedElementIdsForLayer', () => {
        const layerBase: Omit<Layer, 'filters'> = {
            id: '1',
            visible: true,
            name: 'layer 1',
            zIndex: 1
        };

        it('should only return intersection of filters', async () => {
            const elements = [
                constructElement({ id: '1', type: 'class' }),
                constructElement({ id: '2', type: 'property' }),
                constructElement({ id: '3', type: 'class' }),
                constructElement({ id: '4', type: 'property' }),
                constructElement({ id: '5', type: 'property' })
            ];

            const layer: Layer = {
                ...layerBase,
                filters: [
                    {
                        id: '1',
                        name: 'filter 1',
                        type: 'selection',
                        elements: ['2', '3']
                    },
                    {
                        id: '2',
                        name: 'filter 2',
                        type: 'type',
                        types: ['class']
                    }
                ]
            };

            const visibleElementIds = visibilityService.computeAffectedElementIdsForLayer(elements, layer);

            expect(visibleElementIds).toStrictEqual(['3']);
        });

        it('should return empty array if no elements are present', async () => {
            const elements: Element[] = [];

            const layer: Layer = {
                ...layerBase,
                filters: [
                    {
                        id: '1',
                        name: 'filter 1',
                        type: 'selection',
                        elements: ['2', '3']
                    }
                ]
            };

            const visibleElementIds = visibilityService.computeAffectedElementIdsForLayer(elements, layer);

            expect(visibleElementIds).toStrictEqual([]);
        });

        it('should return empty array if no filters are present', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', type: 'class' }),
                constructElement({ id: '2', type: 'property' }),
                constructElement({ id: '3', type: 'class' }),
                constructElement({ id: '4', type: 'property' }),
                constructElement({ id: '5', type: 'property' })
            ];

            const layer: Layer = {
                ...layerBase,
                filters: []
            };

            const visibleElementIds = visibilityService.computeAffectedElementIdsForLayer(elements, layer);

            expect(visibleElementIds).toStrictEqual([]);
        });

        it('should return empty array if no filters are matching', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', type: 'class' }),
                constructElement({ id: '2', type: 'property' }),
                constructElement({ id: '3', type: 'class' }),
                constructElement({ id: '4', type: 'property' }),
                constructElement({ id: '5', type: 'property' })
            ];

            const layer: Layer = {
                ...layerBase,
                filters: [
                    {
                        id: '1',
                        name: 'filter 1',
                        type: 'selection',
                        elements: ['6']
                    }
                ]
            };

            const visibleElementIds = visibilityService.computeAffectedElementIdsForLayer(elements, layer);

            expect(visibleElementIds).toStrictEqual([]);
        });
    });
});
