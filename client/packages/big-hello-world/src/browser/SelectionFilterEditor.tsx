/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { SelectionFilter } from '../model/model.js';

export function SelectionFilterEditor({ filter }: { filter: SelectionFilter }) {
    return (
        <div>
            <label>Selected Elements:</label>
            <ul>
                {filter.elements.map(id => (
                    <li key={id}>Element #{id}</li>
                ))}
            </ul>
        </div>
    );
}
