/**********************************************************************************
 * Copyright (c) 2025 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 **********************************************************************************/
import { VSCodeButton, VSCodeDivider, VSCodeTextField } from '@vscode/webview-ui-toolkit/react/index.js';
import { useEffect, useRef, useState } from 'react';
import type { Layer } from '../model/model.js';

export function LayerDetailsView({
    layer,
    onBack,
    changeLayerName,
    deleteFilter,
    deleteLayer,
    addFilter,
    onFilterSelect
}: {
    layer: Layer;
    onBack: () => void;
    changeLayerName: (id: string, name: string) => void;
    deleteFilter: (layerId: string, filderId: string) => void;
    deleteLayer: (id: string) => void;
    addFilter: (layerId: string, newLayerType: 'type' | 'pattern' | 'selection') => void;
    onFilterSelect: (id: string) => void;
}) {
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setShowFilterOptions(false);
            }
        }

        if (showFilterOptions) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilterOptions]);


    const handleAddClick = () => {
        setShowFilterOptions(!showFilterOptions);
    };

    const handleSelectFilter = (type: 'type' | 'pattern' | 'selection') => {
        addFilter(layer.id, type);
        setShowFilterOptions(false);
    };

    return (
        <div id='layer-details-view'>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                <VSCodeButton slot='anchor' appearance='icon' onClick={onBack} style={{ display: 'flex', alignItems: 'center' }}>
                    <div className='codicon codicon-chevron-left'></div>
                </VSCodeButton>
                <h2>Edit Layer</h2>
            </div>
            <VSCodeTextField
                onChange={e => {
                    const newValue = (e.target as HTMLInputElement).value;
                    changeLayerName(layer.id, newValue);
                }}
                value={layer.name}
            />

            <h3>Filters</h3>
            {layer.filters.map(filter => (
                <div
                    key={filter.id}
                    className="className='reference-item-body"
                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}
                >
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center' }}>
                        <span>{filter.name}</span>
                        <span>-</span>
                        <span>{filter.type}</span>
                    </div>
                    <div
                        id='filter-buttons'
                        className='reference-item-actions'
                        style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center', marginLeft: 'auto' }}
                    >
                        <VSCodeButton
                            slot='anchor'
                            className='action-delete'
                            appearance='icon'
                            onClick={() => deleteFilter(layer.id, filter.id)}
                        >
                            <div className='codicon codicon-trash'></div>
                        </VSCodeButton>
                        <VSCodeButton slot='anchor' appearance='icon' onClick={() => onFilterSelect(filter.id)}>
                            <div className='codicon codicon-chevron-right'></div>
                        </VSCodeButton>
                    </div>
                </div>
            ))}
            <br />
            <VSCodeDivider />
            <footer>
                <div id='secondary-footer-buttons'>
                    <VSCodeButton slot='anchor' className='action-delete' appearance='icon' onClick={() => deleteLayer(layer.id)}>
                        <div className='codicon codicon-trash'></div>
                    </VSCodeButton>
                </div>
                <div id='primary-footer-button' style={{ position: 'relative', marginLeft: 'auto' }}>
                    <VSCodeButton slot='anchor' appearance='icon' onClick={handleAddClick}>
                        <div className='codicon codicon-add'></div>
                    </VSCodeButton>

                    {showFilterOptions && (
                        <div ref={popupRef}
                            style={{
                                position: 'absolute',
                                right: 0,
                                bottom: '100%',
                                marginBottom: '4px',
                                background: 'var(--vscode-editor-background)',
                                zIndex: 10,
                                padding: '4px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                            }}
                        >
                            <div style={{ cursor: 'pointer' }} onClick={() => handleSelectFilter('type')}>Type</div>
                            <VSCodeDivider />
                            <div style={{ cursor: 'pointer' }} onClick={() => handleSelectFilter('pattern')}>Pattern</div>
                            <VSCodeDivider />
                            <div style={{ cursor: 'pointer' }} onClick={() => handleSelectFilter('selection')}>Selection</div>
                        </div>
                    )}

                </div>
            </footer>
        </div>
    );
}
