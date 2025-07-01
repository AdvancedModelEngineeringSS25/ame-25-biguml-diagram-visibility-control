/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { describe, expect, it } from 'vitest';
import { type Element, type Layer, type SelectionFilter } from '../model/model.js';
import { AdvancedVisibilityService } from './advancedVisibilityService.js';
import { type IVisibilityService } from './IVisibilityService.js';

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

describe('AdvancedVisiblityService', () => {
    const visibilityService: IVisibilityService = new AdvancedVisibilityService();

    describe('computeAffectedElementIdsPerLayer', () => {
        const filterBase: Omit<SelectionFilter, 'elements'> = {
            id: '1',
            name: 'filter 1',
            type: 'selection'
        };

        const layerBase: Omit<Layer, 'filters' | 'zIndex' | 'id' | 'type'> = {
            name: 'layer 1',
            active: true
        };

        it('should contain all elements that the layer handels', async () => {
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
                    type: 'show',
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
                    type: 'show',
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
                    type: 'show',
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
                    type: 'show',
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '3' }]
                        }
                    ]
                }
            ];

            const elementIdsPerLayer = visibilityService.computeAffectedElementIdsPerLayer(elements, layers);

            expect(elementIdsPerLayer['3']).toStrictEqual(['3']);
            expect(elementIdsPerLayer['2']).toStrictEqual(['1', '2', '3']);
            expect(elementIdsPerLayer['1']).toStrictEqual(['2']);
            expect(elementIdsPerLayer['-1']).toStrictEqual(['4']);
        });

        it('should contain all elment ids in the default layer', async () => {
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
                    type: 'show',
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
                    type: 'show',
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
                    type: 'show',
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
                    type: 'show',
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '3' }]
                        }
                    ]
                }
            ];

            const elementIdsPerLayer = visibilityService.computeAffectedElementIdsPerLayer(elements, layers);

            expect(elementIdsPerLayer['default']).toStrictEqual(['1', '2', '3', '4', '5', '6']);
        });
    });

    describe('computeVisibleElementIds', () => {
        const filterBase: Omit<SelectionFilter, 'elements'> = {
            id: '1',
            name: 'filter 1',
            type: 'selection'
        };

        const layerBase: Omit<Layer, 'filters' | 'zIndex' | 'id' | 'type' | 'active'> = {
            name: 'layer 1'
        };

        it('should return all elements if all layers are active and show', async () => {
            const elements: Element[] = [
                constructElement({ id: '1' }),
                constructElement({ id: '2' }),
                constructElement({ id: '3' }),
                constructElement({ id: '4' })
            ];

            const layers: Layer[] = [
                {
                    ...layerBase,
                    id: '1',
                    zIndex: 1,
                    type: 'show',
                    active: true,
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '2' }]
                        }
                    ]
                },
                {
                    ...layerBase,
                    id: '2',
                    zIndex: 2,
                    type: 'show',
                    active: true,
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '1' }, { id: '2' }, { id: '3' }]
                        }
                    ]
                },
                {
                    ...layerBase,
                    id: '3',
                    zIndex: 3,
                    type: 'show',
                    active: true,
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '3' }, { id: '4' }]
                        }
                    ]
                }
            ];

            const elementIdsPerLayer = visibilityService.computeAffectedElementIdsPerLayer(elements, layers);
            const visibleElementIds = visibilityService.computeVisibleElementIds(elementIdsPerLayer, layers);

            expect(visibleElementIds.sort()).toStrictEqual(['1', '2', '3', '4']);
        });

        it('should return no visible elements if all layers are active and hide', async () => {
            const elements: Element[] = [
                constructElement({ id: '1' }),
                constructElement({ id: '2' }),
                constructElement({ id: '3' }),
                constructElement({ id: '4' })
            ];

            const layers: Layer[] = [
                {
                    ...layerBase,
                    id: '1',
                    zIndex: 1,
                    type: 'hide',
                    active: true,
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '2' }]
                        }
                    ]
                },
                {
                    ...layerBase,
                    id: '2',
                    zIndex: 2,
                    type: 'hide',
                    active: true,
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '1' }, { id: '2' }, { id: '3' }]
                        }
                    ]
                },
                {
                    ...layerBase,
                    id: '3',
                    zIndex: 3,
                    type: 'hide',
                    active: true,
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '3' }, { id: '4' }]
                        }
                    ]
                }
            ];

            const elementIdsPerLayer = visibilityService.computeAffectedElementIdsPerLayer(elements, layers);
            const visibleElementIds = visibilityService.computeVisibleElementIds(elementIdsPerLayer, layers);

            expect(visibleElementIds).toStrictEqual([]);
        });

        it('should return all elements if no layer is active', async () => {
            const elements: Element[] = [
                constructElement({ id: '1' }),
                constructElement({ id: '2' }),
                constructElement({ id: '3' }),
                constructElement({ id: '4' })
            ];

            const layers: Layer[] = [
                {
                    ...layerBase,
                    id: '1',
                    zIndex: 1,
                    type: 'show',
                    active: false,
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '2' }]
                        }
                    ]
                },
                {
                    ...layerBase,
                    id: '2',
                    zIndex: 2,
                    type: 'hide',
                    active: false,
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '1' }, { id: '2' }, { id: '3' }]
                        }
                    ]
                },
                {
                    ...layerBase,
                    id: '3',
                    zIndex: 3,
                    type: 'hide',
                    active: false,
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '3' }, { id: '4' }]
                        }
                    ]
                }
            ];

            const elementIdsPerLayer = visibilityService.computeAffectedElementIdsPerLayer(elements, layers);
            const visibleElementIds = visibilityService.computeVisibleElementIds(elementIdsPerLayer, layers);

            expect(visibleElementIds).toStrictEqual(['1', '2', '3', '4']);
        });

        it('should return elements where the active filter with the lowest z-index is show', async () => {
            const elements: Element[] = [
                constructElement({ id: '1' }),
                constructElement({ id: '2' }),
                constructElement({ id: '3' }),
                constructElement({ id: '4' })
            ];

            const layers: Layer[] = [
                {
                    ...layerBase,
                    id: '1',
                    zIndex: 1,
                    type: 'hide',
                    active: true,
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '2' }]
                        }
                    ]
                },
                {
                    ...layerBase,
                    id: '2',
                    zIndex: 2,
                    type: 'show',
                    active: true,
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '1' }, { id: '2' }, { id: '3' }]
                        }
                    ]
                },
                {
                    ...layerBase,
                    id: '3',
                    zIndex: 3,
                    type: 'hide',
                    active: true,
                    filters: [
                        {
                            ...filterBase,
                            elements: [{ id: '3' }, { id: '4' }]
                        }
                    ]
                }
            ];

            const elementIdsPerLayer = visibilityService.computeAffectedElementIdsPerLayer(elements, layers);
            const visibleElementIds = visibilityService.computeVisibleElementIds(elementIdsPerLayer, layers);

            expect(visibleElementIds.sort()).toStrictEqual(['1', '3']);
        });
    });
});
