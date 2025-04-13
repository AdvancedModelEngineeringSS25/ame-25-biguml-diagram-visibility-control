/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import type { TypeFilter } from '../model/model.js';

export function TypeFilterEditor({ filter }: { filter: TypeFilter }) {
    return (
        <div>
            <label>Types:</label>
            <ul>
                {filter.types.map((t, i) => (
                    <li key={i}>{t}</li>
                ))}
            </ul>
        </div>
    );
}