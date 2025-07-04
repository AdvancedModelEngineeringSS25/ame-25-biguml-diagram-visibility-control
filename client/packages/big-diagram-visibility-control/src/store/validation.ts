/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { z } from 'zod';
const FilterBaseSchema = z.object({
    id: z.string(),
    name: z.string()
});

const TypeFilterSchema = FilterBaseSchema.extend({
    type: z.literal('type'),
    types: z.array(z.string())
});

const PatternFilterSchema = FilterBaseSchema.extend({
    type: z.literal('pattern'),
    pattern: z.string(),
    types: z.array(z.string()).optional()
});

const SelectionFilterSchema = FilterBaseSchema.extend({
    type: z.literal('selection'),
    elements: z.array(
        z.object({
            id: z.string(),
            name: z.string()
        })
    )
});

const FilterSchema = z.discriminatedUnion('type', [TypeFilterSchema, PatternFilterSchema, SelectionFilterSchema]);

const LayerSchema = z.object({
    id: z.string(),
    name: z.string(),
    active: z.boolean(),
    type: z.string(),
    zIndex: z.number(),
    filters: z.array(FilterSchema),
    groupId: z.string().optional(),
    styleClass: z.string().optional()
});
const LayerStoreSchema = z.object({
    layers: z.array(LayerSchema)
});
export function validateLayerStore(data: unknown): { success: true; data: { layers: any[] } } | { success: false; error: string } {
    try {
        const validated = LayerStoreSchema.parse(data);
        return { success: true, data: validated };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
            return { success: false, error: `Invalid configuration format: ${issues}` };
        }
        return { success: false, error: 'Unknown validation error' };
    }
}
export function validateLayerStorePartial(data: unknown): { success: true; data: { layers: any[] } } | { success: false; error: string } {
    try {
        const PartialLayerStoreSchema = z.object({
            layers: z.array(LayerSchema).default([])
        });
        const validated = PartialLayerStoreSchema.parse(data);
        return { success: true, data: validated };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
            return { success: false, error: `Invalid configuration format: ${issues}` };
        }
        return { success: false, error: 'Unknown validation error' };
    }
}
