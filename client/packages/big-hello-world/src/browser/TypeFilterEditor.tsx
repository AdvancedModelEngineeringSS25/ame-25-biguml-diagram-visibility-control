/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { BigCheckbox } from '@borkdominik-biguml/big-components';
import type { TypeFilter } from '../model/model.js';
import { ALL_TYPES } from '../model/model.js';

export function TypeFilterEditor({
    layerId,
    filter,
    toggleSelectedType
}: {
    layerId: string;
    filter: TypeFilter;
    toggleSelectedType: (layerId: string, filterId: string, type: string) => void;
}) {
    return (
        <div>
            <label>Types:</label>
            <div>
                {ALL_TYPES.map((type, index) => (
                    <div key={index}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                            <BigCheckbox
                                label=''
                                value={(filter.types ?? []).includes(type)}
                                onDidChangeValue={() => toggleSelectedType(layerId, filter.id, type)}
                            />
                            <span>{type}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
