/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { describe, expect, it } from 'vitest';
import {
    type Element,
    type ElementIdsPerLayer,
    type Layer,
    type PatternFilter,
    type SelectionFilter,
    type TypeFilter
} from '../model/model.js';
import { type IVisibilityService } from './IVisibilityService.js';
import { VisibilityService } from './visibilityService.js';

function constructElement(
    element: {
        id: Element['id'];
    } & Partial<Element>
): Element {
    return {
        type: 'Class',
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

            const selectedElementIds = [{ id: '1' }, { id: '2' }, { id: '3' }];

            const filter: SelectionFilter = {
                ...filterBase,
                elements: selectedElementIds
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForSelectionFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual(['1', '2', '3']);
        });

        it('should not return elementIds that are not existing', async () => {
            const elements: Element[] = [constructElement({ id: '1' }), constructElement({ id: '2' }), constructElement({ id: '3' })];

            const selectedElementIds = [{ id: '0' }, { id: '4' }];

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

            const selectedElementIds = [];

            const filter: SelectionFilter = {
                ...filterBase,
                elements: selectedElementIds
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForSelectionFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual(selectedElementIds);
        });

        it('should return empty array if no elements are present', async () => {
            const elements: Element[] = [];

            const selectedElementIds = [];

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
        it('should return elementIds for matching single type', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', type: 'Class' }),
                constructElement({ id: '2', type: 'Interface' }),
                constructElement({ id: '3', type: 'OwnedAttribute' }),
                constructElement({ id: '4', type: 'UMLUsage' }),
                constructElement({ id: '5', type: 'OwnedOperation' }),
                constructElement({ id: '6', type: 'Class' })
            ];

            const filter: TypeFilter = {
                ...filterBase,
                types: ['Class']
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForTypeFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual(['1', '6']);
        });

        it('should return elementIds for matching multiple types', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', type: 'Class' }),
                constructElement({ id: '2', type: 'Interface' }),
                constructElement({ id: '3', type: 'OwnedAttribute' }),
                constructElement({ id: '4', type: 'UMLUsage' }),
                constructElement({ id: '5', type: 'OwnedOperation' }),
                constructElement({ id: '6', type: 'Class' })
            ];

            const filter: TypeFilter = {
                ...filterBase,
                types: ['Class', 'Interface']
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForTypeFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual(['1', '2', '6']);
        });

        it('should return empty array if no elements are present', async () => {
            const elements: Element[] = [];

            const filter: TypeFilter = {
                ...filterBase,
                types: ['Class']
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForTypeFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual([]);
        });

        it('should return empty array if no elements are matching the type', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', type: 'Interface' }),
                constructElement({ id: '2', type: 'Interface' }),
                constructElement({ id: '3', type: 'OwnedAttribute' }),
                constructElement({ id: '4', type: 'UMLUsage' }),
                constructElement({ id: '5', type: 'OwnedOperation' })
            ];

            const filter: TypeFilter = {
                ...filterBase,
                types: ['Class']
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForTypeFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual([]);
        });

        it('should return empty array if no types are present', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', type: 'Interface' }),
                constructElement({ id: '2', type: 'Interface' }),
                constructElement({ id: '3', type: 'OwnedAttribute' }),
                constructElement({ id: '4', type: 'UMLUsage' }),
                constructElement({ id: '5', type: 'OwnedOperation' })
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
            active: true
        };

        it('should only set elementId for the layer with the lowest relevant z-index', async () => {
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
                            elements: [{ id: '1' }, { id: '2' }, { id: '3' }]
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
                            elements: [{ id: '2' }]
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
                            elements: [{ id: '4' }]
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
                            elements: [{ id: '3' }]
                        }
                    ]
                }
            ];

            const elementIdsPerLayer = visibilityService.computeAffectedElementIdsPerLayer(elements, layers);

            expect(elementIdsPerLayer['3']).toStrictEqual([]);
            expect(elementIdsPerLayer['2']).toStrictEqual(['1', '3']);
            expect(elementIdsPerLayer['1']).toStrictEqual(['2']);
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
                            elements: [{ id: '1' }, { id: '2' }, { id: '3' }]
                        }
                    ]
                }
            ];

            const elementIdsPerLayer = visibilityService.computeAffectedElementIdsPerLayer(elements, layers);

            expect(elementIdsPerLayer['1']).toStrictEqual([]);
        });

        it('should return only default object with all elements if no layers are present', async () => {
            const elements: Element[] = [constructElement({ id: '1' }), constructElement({ id: '2' }), constructElement({ id: '3' })];

            const layers: Layer[] = [];

            const elementIdsPerLayer = visibilityService.computeAffectedElementIdsPerLayer(elements, layers);

            expect(elementIdsPerLayer).toStrictEqual({
                default: ['1', '2', '3']
            });
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
                    active: true
                },
                {
                    ...layerBase,
                    id: '2',
                    active: false
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
                    active: true
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
                    active: false
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
            active: true,
            name: 'layer 1',
            zIndex: 1
        };

        it('should only return intersection of filters', async () => {
            const elements = [
                constructElement({ id: '1', type: 'Class' }),
                constructElement({ id: '2', type: 'OwnedAttribute' }),
                constructElement({ id: '3', type: 'Class' }),
                constructElement({ id: '4', type: 'OwnedAttribute' }),
                constructElement({ id: '5', type: 'OwnedAttribute' })
            ];

            const layer: Layer = {
                ...layerBase,
                filters: [
                    {
                        id: '1',
                        name: 'filter 1',
                        type: 'selection',
                        elements: [{ id: '2' }, { id: '3' }]
                    },
                    {
                        id: '2',
                        name: 'filter 2',
                        type: 'type',
                        types: ['Class']
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
                        elements: [{ id: '2' }, { id: '3' }]
                    }
                ]
            };

            const visibleElementIds = visibilityService.computeAffectedElementIdsForLayer(elements, layer);

            expect(visibleElementIds).toStrictEqual([]);
        });

        it('should return empty array if no filters are present', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', type: 'Class' }),
                constructElement({ id: '2', type: 'OwnedAttribute' }),
                constructElement({ id: '3', type: 'Class' }),
                constructElement({ id: '4', type: 'OwnedAttribute' }),
                constructElement({ id: '5', type: 'OwnedAttribute' })
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
                constructElement({ id: '1', type: 'Class' }),
                constructElement({ id: '2', type: 'OwnedAttribute' }),
                constructElement({ id: '3', type: 'Class' }),
                constructElement({ id: '4', type: 'OwnedAttribute' }),
                constructElement({ id: '5', type: 'OwnedAttribute' })
            ];

            const layer: Layer = {
                ...layerBase,
                filters: [
                    {
                        id: '1',
                        name: 'filter 1',
                        type: 'selection',
                        elements: [{ id: '6' }]
                    }
                ]
            };

            const visibleElementIds = visibilityService.computeAffectedElementIdsForLayer(elements, layer);

            expect(visibleElementIds).toStrictEqual([]);
        });
    });

    describe('computeAffectedElementIdsForPatternFilter', () => {
        const filterBase: Omit<PatternFilter, 'pattern'> = {
            id: '1',
            name: 'filter 1',
            type: 'pattern'
        };

        it('should return elementIds for matching RegEx pattern', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', name: 'Class A' }),
                constructElement({ id: '2', name: 'Class B' }),
                constructElement({ id: '3', name: 'Interface C' }),
                constructElement({ id: '4', name: 'Enumeration D' }),
                constructElement({ id: '5', name: 'PrimitiveType E' })
            ];

            const filter: PatternFilter = {
                ...filterBase,
                pattern: '/Class/'
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForPatternFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual(['1', '2']);
        });

        it('should return elementIds for matching text pattern', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', name: 'Class A' }),
                constructElement({ id: '2', name: 'Class B' }),
                constructElement({ id: '3', name: 'Interface C' }),
                constructElement({ id: '4', name: 'Enumeration D' }),
                constructElement({ id: '5', name: 'PrimitiveType E' })
            ];

            const filter: PatternFilter = {
                ...filterBase,
                pattern: 'Class'
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForPatternFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual(['1', '2']);
        });

        it('should return empty array if no elements are present', async () => {
            const elements: Element[] = [];

            const filter: PatternFilter = {
                ...filterBase,
                pattern: 'Class'
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForPatternFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual([]);
        });

        it('should return empty array if no elements are matching the text pattern', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', name: 'Class A' }),
                constructElement({ id: '2', name: 'Class B' }),
                constructElement({ id: '3', name: 'Interface C' }),
                constructElement({ id: '4', name: 'Enumeration D' }),
                constructElement({ id: '5', name: 'PrimitiveType E' })
            ];

            const filter: PatternFilter = {
                ...filterBase,
                pattern: 'NonMatchingPattern'
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForPatternFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual([]);
        });

        it('should return empty array if no elements are matching the RegEx pattern', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', name: 'Class A' }),
                constructElement({ id: '2', name: 'Class B' }),
                constructElement({ id: '3', name: 'Interface C' }),
                constructElement({ id: '4', name: 'Enumeration D' }),
                constructElement({ id: '5', name: 'PrimitiveType E' })
            ];

            const filter: PatternFilter = {
                ...filterBase,
                pattern: '/NonMatchingPattern/'
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForPatternFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual([]);
        });

        it('should handle invalid RegEx patterns gracefully', async () => {
            const elements: Element[] = [
                constructElement({ id: '1', name: 'Class A' }),
                constructElement({ id: '2', name: 'Class B' }),
                constructElement({ id: '3', name: 'Interface C' }),
                constructElement({ id: '4', name: 'Enumeration D' }),
                constructElement({ id: '5', name: 'PrimitiveType E' })
            ];

            const filter: PatternFilter = {
                ...filterBase,
                pattern: '/[a-z/' // Invalid RegEx
            };

            const affectedElementIds = visibilityService.computeAffectedElementIdsForPatternFilter(elements, filter);

            expect(affectedElementIds).toStrictEqual([]);
        });
    });
});
