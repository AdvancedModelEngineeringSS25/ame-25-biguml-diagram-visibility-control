/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { z } from 'zod';

// Define schemas that match your model interfaces
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
    visible: z.boolean(),
    zIndex: z.number(),
    filters: z.array(FilterSchema),
    groupId: z.string().optional(),
    styleClass: z.string().optional()
});

const LayerStateSchema = z.object({
    layers: z.array(LayerSchema),
    configuration: z.string()
});

export function validateLayerState(data: unknown): { success: true; data: any } | { success: false; error: string } {
    try {
        const validated = LayerStateSchema.parse(data);
        return { success: true, data: validated };
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Create a user-friendly error message
            const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
            return { success: false, error: `Invalid configuration format: ${issues}` };
        }
        return { success: false, error: 'Unknown validation error' };
    }
}

// Alternative: Partial validation for more flexible imports
export function validateLayerStatePartial(data: unknown): { success: true; data: any } | { success: false; error: string } {
    try {
        // Create a more lenient schema that fills in defaults for missing fields
        const PartialLayerStateSchema = z.object({
            layers: z.array(LayerSchema).default([]),
            configuration: z.string().default('default')
        });

        const validated = PartialLayerStateSchema.parse(data);
        return { success: true, data: validated };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
            return { success: false, error: `Invalid configuration format: ${issues}` };
        }
        return { success: false, error: 'Unknown validation error' };
    }
}
