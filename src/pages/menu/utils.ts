import config from "config/config";
import { Menu, MenuApp, MenuItem, MenuModifierGroup, MenuModifierOption, MenuSection } from "./types";
import { getLogo } from "pages/kitchen/utils";

export function getDeliveryApps(): MenuApp[] {
    let apps: MenuApp[]= [];
    let entries = Object.entries(config.appNames);
    for (let [key, value] of entries) {
        apps.push({
            app: key,
            name: value,
            logo: getLogo(key),
        });
    }
    return apps;
}

export function removeIdsFromMenuModifierOptions(options: MenuModifierOption[]): MenuModifierOption[] {
    return options.map((option) => {
        return {
            optionId: option.optionId,
            position: option.position,
            name: option.name,
            price: option.price,
            active: option.active,
            product: option.product
        }
    }).slice();
}

export function removeIdsFromMenuModifierGroups(groups: MenuModifierGroup[]): MenuModifierGroup[] {
    return groups.map((group) => {
        return {
            groupId: group.groupId,
            name: group.name,
            minQty: group.minQty,
            maxQty: group.maxQty,
            position: group.position,
            optionsMultiple: group.optionsMultiple,
            options: removeIdsFromMenuModifierOptions(group.options || []),
        }
    }).slice();
}

export function removeIdsFromMenuItem(items: MenuItem[]): MenuItem[] {
    return items.map((item) =>  {
        return {
            position: item.position,
            price: item.price,
            active: item.active,
            product: item.product,
            modifierGroups: removeIdsFromMenuModifierGroups(item.modifierGroups || []),
        }
    }).slice();
}

export function removeIdsFromMenu(sections: MenuSection[]): MenuSection[] {
    return sections.map((section) => {
         return { 
            name: section.name,
            position: section.position,
            active: section.active,
            items: removeIdsFromMenuItem(section.items)
        }
    }).slice();
}

export function sortMenus(menus: Menu[]): Menu[] {
    return menus.sort((m1: Menu, m2: Menu) => {
        return ( (m1.brand.name || '') < (m2.brand.name || '')) ? -1 : 1;
    }).slice();
}
