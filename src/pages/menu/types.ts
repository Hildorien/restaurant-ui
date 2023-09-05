import { BranchMetadata } from "redux/branch/types";

//Models
export interface Menu {
    id?: string;
    brand: MenuBrand;
    apps: MenuApp[];
    sections: MenuSection[];
}
export type MenuBrand = {
    id: number,
    name?: string;
}
export interface MenuApp {
    app: string;
    appId?: string;
    name?: string;
    logo?: string;
    active?: boolean;
    published?: boolean;
    publishedAt?: Date;
}
export interface MenuSection {
    id?: string;
    name: string;
    position: number;
    active: boolean;
    items: MenuItem[];
}
export interface MenuItem {
    id?: number;
    position: number;
    price: number;
    active: boolean;
    product: MenuItemProduct;
    modifierGroups?: MenuModifierGroup[];
}
export interface MenuItemProduct {
    id: number;
    name?: string;
    description?: string;
    sku?: string;
    image: string;
}
export interface MenuModifierGroup {
    id?: number;
    groupId: number;
    name?: string;
    minQty?: number;
    maxQty?: number;
    position: number;
    optionsMultiple?: boolean;
    options: MenuModifierOption[];
}
export interface MenuModifierOption {
    id?: number;
    optionId: number;
    name?: string;
    position: number;
    price: number;
    product: MenuItemProduct;
    active: boolean;
}
export interface AppPublicationState {
    app: MenuApp;
    approval: string; //This should be an ENUM representing states
}
//Component Props
export interface MenuAccordionRowProps {
    item: MenuAccordionItem;
    eventKey: string;
    content: React.ReactNode;
    isActive: boolean;
    canImport: boolean;
    canDuplicate: boolean;
    canDelete: boolean;
    handleClickOnAccordion: (id: string) => void;
    handleImport: (item: MenuAccordionItem) => void;
    handleDuplicate: (item: MenuAccordionItem) => void;
    handleDeleteMenu: (item: MenuAccordionItem) => void;
}
export interface MenuAccordionItem {
    brand: MenuBrand;
    brandLogo?: string
    apps: MenuApp[];
    sections: MenuSection[];
    menuId? : string;
}
export interface MenuCardProps {
    id?: string;
    brand: MenuBrand;
    apps: MenuApp[];
    sections: MenuSection[];
    index: number;
    onChangeMenu: (index: number, sections: MenuSection[], apps: MenuApp[], id?: string) => void;
    onSaveMenu: (brand: MenuBrand, sections: MenuSection[], apps: MenuApp[], id?: string) => void;
    onPublishMenu: (brand: MenuBrand, sections: MenuSection[], apps: MenuApp[], id?: string) => void;
}
export interface MenuSectionAccordionRowProps {
    item: MenuSectionAccordionItem;
    eventKey: string;
    content: React.ReactNode;
    isActive: boolean;
    isEmpty: boolean;
    itemsWithoutPrice: number;
    otherSectionNames: string[];
    handleClickOnAccordion: (id: string) => void;
    handleDeleteOnAccordion: (id: string) => void;
    handleEditOnAccordion: (id: string, name: string) => void;
}
export interface MenuSectionAccordionItem {
    id: string;
    name: string;
}
export interface MenuSectionsProps {
    brand: MenuBrand;
    apps: MenuApp[];
    sections: MenuSection[];
    handleChangeOnMenu: (sections: MenuSection[]) => void;
}
export interface MenuSectionProps {
    section: MenuSection;
    brand: MenuBrand;
    onNewMenuItemInSection: (section: MenuSection) => void;
    onDeleteMenuItemInSection: (section: MenuSection) => void;
    onSortItemsInSection: (section: MenuSection) => void;
}
export interface MenuActionsProps {
    menuId?: string;
    brand: MenuBrand;
    sections: MenuSection[];
    apps: MenuApp[];
    onSaveMenu: (sections: MenuSection[], apps: MenuApp[]) => void;
    onPublishMenu: (sections: MenuSection[], apps: MenuApp[]) => void;
}
export interface MenuItemCardProps {
    menuItem: MenuItem;
    index: number;
    handleDeleteMenuItemOnSection: (productId: number) => void;
    handleConfirmMenuItemOnSection: (item: MenuItem) => void;
    handleEditMenuItemOnSection: (itemBeingEdited: boolean) => void;
}
export interface MenuItemModifiersProps {
    menuItem: MenuItem;
    disabled: boolean;
    onMenuItemModifiersChange: (menuItem: MenuItem ) => void;
}
export interface MenuItemModifierOptionsProps {
    modifierGroup?: MenuModifierGroup;
    onRequestEditedGroup: (modifierGroup: MenuModifierGroup) => void;
    onRequestCancelEdit: () => void;
}
export interface MenuItemModifierOptionsTableProps {
    options: MenuModifierOption[];
    onRequestEditedOptions: (options: MenuModifierOption[]) => void;
}
export interface MenuItemModifierOptionTableRowProps {
    option: MenuModifierOption;
    onReportChange: (option: MenuModifierOption) => void;
}

export enum MenuValidationTypes {
    OK = "OK",
    ITEMS_WITHOUT_PRICE = "Productos sin precio",
    ITEMS_WITHOUT_IMAGE = "Productos sin imágen",
    EMPTY_SECTIONS = "Secciones vacías",
    EMPTY_MENU = "No hay secciones",
    APPS_INACTIVE = "Sin aplicaciónes activas",
}

export interface SortableMenuSection {
    id: number;
    element: MenuSection;
}

export interface SortableMenuItem {
    id: number;
    element: MenuItem;
}
export interface SortableMenuModifierOption {
    id: number;
    element: MenuModifierOption;
}

export interface MenuImportProps {
    brand?: MenuBrand;
    branches?: BranchMetadata[];
    handleSelectBranch: (branch: BranchMetadata) => void;
    handleSelectMenu: (menu: Menu) => void;
}

export interface MenuActionMessage {
    message: string;
    class: 'danger' | 'success';
}

export type PublishStatus = {
    app: string;
    status: boolean;
    error?: string;
}