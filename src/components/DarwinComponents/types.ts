import { StoreClosedReason } from "config/types";
import { DropdownToggleProps } from "react-bootstrap/esm/DropdownToggle";

export interface StatusCloseModalProps {
    open: boolean;
    title: string;
    text: string;
    closeReasons: StoreClosedReason[];
    handleConfirmCloseModal: (reason: StoreClosedReason, otherReasonDescription?: string) => any;
    handleCancelCloseModal: () => void;
    closeErrorMessage: string;
    cssClass: string;
}

export interface StatusOpenModalProps {
    open: boolean;
    title: string;
    text: string;
    handleConfirmOpenModal: () => any;
    handleCancelOpenModal:  () => void;
    openErrorMessage: string;
    cssClass: string;
}

export interface ErrorCardProps {
    errorMessage: string;
}

export interface ReminderModalProps {
    open: boolean;
    title: string;
    text: string;
    redirect: string;
    confirmButtonText: string;
    handleClosure: () => void;
    cssClass: string; // primary, success, info, danger, warning, dark
    hasCancelButton: boolean;
}

export interface DarwinTooltipProps {
    id: string;
    text: string;
}

export interface DarwinSectionTitleProps {
    title: string;
    subtitle?: string
}

export interface MissingDataProps {
    title: string;
}

export interface DarwinRowOfCardsProps {
    cards: React.ReactNode[];
}

export interface DarwinBrandSelectProps {
    brandsSearchText: string;
    activeBrand: string;
    brandsInSelect: string[]; 
    handleSelectBrand: (key: any, event: Object) => void;
    refreshBrands: (text: string) => void;
    dropDownToggleProps?: DropdownToggleProps
}

export type AccordionItem = {
    id: number;
    title: string;
};
export interface DarwinAccordionProps {
    item: AccordionItem;
    index: number;
    content: React.ReactNode;
    isActive: boolean;
    handleClickOnAccordion: (id: string) => void;
    isMovable?: boolean;
    isTitleEditable?: boolean;
}
