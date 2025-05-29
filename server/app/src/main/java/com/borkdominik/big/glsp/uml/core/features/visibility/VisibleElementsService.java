package com.borkdominik.big.glsp.uml.core.features.visibility;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.glsp.server.emf.EMFIdGenerator;

import com.borkdominik.big.glsp.server.core.model.BGEMFModelElementIndex;
import com.google.inject.Inject;

public class VisibleElementsService {
    @Inject
    protected BGEMFModelElementIndex modelElementIndex;
    @Inject
    protected EMFIdGenerator idGenerator;

    protected Set<String> visibleElementIds;

    protected void setVisibleElements(List<String> visibleElementIds) {
        var ids = new HashSet<String>();

        for (var id : visibleElementIds) {
            var element = modelElementIndex.getSemantic(id);
            if (element.isEmpty()) {
                continue; // Skip if the element is not found
            }

            ids.add(id);
            for (var ancestor : getAllAncestors(element.get())) {
                ids.add(idGenerator.getOrCreateId(ancestor));
            }
        }

        this.visibleElementIds = ids;
    }

    public boolean isVisible(String elementId) {
        if (visibleElementIds == null) {
            return true; // Default to visible if no action is set
        }

        return visibleElementIds.contains(elementId);
    }

    protected Set<EObject> getAllAncestors(EObject eObject) {
        Set<EObject> ancestors = new HashSet<>();

        // Get the root container
        EObject rootContainer = EcoreUtil.getRootContainer(eObject);

        // Add all containers in between
        EObject current = eObject.eContainer();
        while (current != null) {
            ancestors.add(current);
            if (current == rootContainer) {
                break;
            }
            current = current.eContainer();
        }

        return ancestors;
    }
}
