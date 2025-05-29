package com.borkdominik.big.glsp.uml.core.features.visibility;

import java.util.List;

import org.eclipse.glsp.server.actions.Action;

public class SetVisibleElementsAction extends Action {
    public static final String TYPE = "setVisibleElements";

    private List<String> visibleElementIds;

    public SetVisibleElementsAction() {
        super(TYPE);
    }

    public List<String> getVisibleElementIds() {
        return visibleElementIds;
    }

    public void setVisibleElementIds(List<String> visibleElements) {
        this.visibleElementIds = visibleElements;
    }

}
